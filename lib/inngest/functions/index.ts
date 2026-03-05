/**
 * @fileoverview Optimized Fashion event scraper.
 * Batches regional results to stay within Gemini Free Tier quotas.
 */

import { inngest } from "../client";
import { exa, model } from "../../ai/scout";
import { createClient } from "@supabase/supabase-js";
import { SchemaType } from "@google/generative-ai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const scoutFunction = inngest.createFunction(
  { id: "scout-uk-fashion" },
  [{ event: "scout/run" }, { cron: "0 3 * * *" }],
  async ({ step, logger }) => {
    try {
      const currentYear = new Date().getFullYear();
      const today = new Date().toISOString().split("T")[0];

      const regions = [
        {
          id: "london",
          q: "Designer sample sales and fashion pop-ups in London",
        },
        {
          id: "north",
          q: "Fashion warehouse sales and luxury events in Manchester, Leeds, and Liverpool",
        },
        {
          id: "midlands",
          q: "Designer sales and fashion pop-ups in Birmingham and Nottingham",
        },
        {
          id: "scotland_ni",
          q: "Luxury fashion events in Glasgow, Edinburgh, and Belfast",
        },
        {
          id: "south_west_wales",
          q: "Fashion sample sales in Bristol, Cardiff, and Bath",
        },
        {
          id: "rural_hidden_gems",
          q: "UK designer fashion boutique sales in smaller towns like Harrogate, Oxford, St Ives",
        },
      ];

      const allSearchResults = await step.run(
        "gather-all-search-data",
        async () => {
          const results = await Promise.all(
            regions.map(async (region) => {
              const res = await exa.search(`${region.q} ${currentYear}`, {
                type: "auto",
                numResults: 10,
                contents: { text: { maxCharacters: 800 } },
              });
              return res.results.map((r) => ({ ...r, regionId: region.id }));
            }),
          );
          return results.flat();
        },
      );

      const allCleanedEvents = await step.run(
        "batch-clean-with-ai",
        async () => {
          if (allSearchResults.length === 0) return [];

          const inputForAI = allSearchResults.map((r) => ({
            title: r.title,
            url: r.url,
            text: r.text.substring(0, 600),
            region: r.regionId,
          }));

          const prompt = `You are a UK Fashion Editor. Extract all fashion events from this data: ${JSON.stringify(inputForAI)}.
        Current Date: ${today}.
        INSTRUCTIONS:
        1. Capture past and upcoming events.
        2. Format date as YYYY-MM-DD.
        3. For 'rural_hidden_gems', ensure they are NOT in major cities.
        4. For 'image_url', only use direct links ending in .jpg, .jpeg, .png, .webp, or .avif. Otherwise return null.`;

          const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                  events: {
                    type: SchemaType.ARRAY,
                    items: {
                      type: SchemaType.OBJECT,
                      properties: {
                        title: { type: SchemaType.STRING },
                        date: { type: SchemaType.STRING },
                        location: { type: SchemaType.STRING },
                        city: { type: SchemaType.STRING },
                        category: { type: SchemaType.STRING },
                        image_url: { type: SchemaType.STRING },
                        description: { type: SchemaType.STRING },
                        event_url: { type: SchemaType.STRING },
                      },
                      required: ["title", "date", "event_url", "city"],
                    },
                  },
                },
              },
            },
          });

          const parsed = JSON.parse(result.response.text());
          const rawEvents = parsed.events || [];
          const imageRegex = /\.(jpg|jpeg|png|webp|avif|gif)($|\?)/i;

          return rawEvents.map((event: any) => ({
            ...event,
            image_url:
              event.image_url && imageRegex.test(event.image_url)
                ? event.image_url
                : null,
          }));
        },
      );

      const dbResult = await step.run("save-to-supabase", async () => {
        if (allCleanedEvents.length === 0) return { count: 0 };
        const { error, data } = await supabase
          .from("fashion_events")
          .upsert(allCleanedEvents, { onConflict: "event_url" })
          .select();
        if (error) throw error;
        return { count: data?.length || 0 };
      });

      return {
        success: true,
        totalFound: allCleanedEvents.length,
        upserted: dbResult.count,
      };
    } catch (error: any) {
      logger.error("Scout Failed", { message: error.message });
      throw error;
    }
  },
);
