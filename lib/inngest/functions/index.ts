/**
 * @fileoverview Fashion event scraper and database synchronization.
 * Uses Exa for regional search and Gemini for sequential data drip-feeding.
 */

import { inngest } from "../client";
import { exa, model } from "../../ai/scout";
import { createClient } from "@supabase/supabase-js";
import { SchemaType } from "@google/generative-ai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/**
 * Main worker function.
 * Runs on 'scout/run' event or daily cron (3 AM).
 */
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
          q: "UK designer fashion sample sales pop-ups -London -Manchester -Birmingham -Leeds -Glasgow -Liverpool -Edinburgh -Bristol -Belfast -Nottingham -Sheffield -Newcastle",
        },
      ];

      const searchTasks = regions.map((region) =>
        step.run(`search-${region.id}`, async () => {
          const res = await exa.search(`${region.q} ${currentYear}`, {
            type: "auto",
            numResults: 20,
            contents: { text: { maxCharacters: 1000 } },
          });
          return { region: region.id, results: res.results };
        }),
      );

      const allRegionalResults = await Promise.all(searchTasks);

      let allCleanedEvents: any[] = [];

      for (const batch of allRegionalResults) {
        if (batch.results.length === 0) continue;

        const cleanedBatch = await step.run(
          `clean-${batch.region}`,
          async () => {
            const inputForAI = batch.results.map((r) => ({
              title: r.title,
              url: r.url,
              text: r.text.substring(0, 800),
            }));

            const focusInstruction =
              batch.region === "rural_hidden_gems"
                ? "FOCUS: Look for independent boutique sales in smaller UK towns (e.g., Harrogate, Cheltenham, Oxford, St Ives). Discard major city results."
                : `FOCUS: Extract events specifically for the ${batch.region} region.`;

            const prompt = `You are a UK Fashion Editor. Extract all fashion events (past and upcoming) from this data: ${JSON.stringify(inputForAI)}.
          Current Date: ${today}.
          ${focusInstruction}
          Capture the event even if the date has passed so we can archive it.
          Format date as YYYY-MM-DD. Always include the 'city' field.`;

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
            return parsed.events || [];
          },
        );

        allCleanedEvents = [...allCleanedEvents, ...cleanedBatch];
      }

      const dbResult = await step.run("save-to-supabase", async () => {
        if (allCleanedEvents.length === 0) return { count: 0 };

        const { error, data } = await supabase
          .from("fashion_events")
          .upsert(allCleanedEvents, {
            onConflict: "event_url",
            ignoreDuplicates: false,
          })
          .select();

        if (error) throw error;
        return { count: data?.length || 0 };
      });

      return {
        message: "National Scout Successful",
        regionsProcessed: regions.length,
        totalFound: allCleanedEvents.length,
        newOrUpdated: dbResult.count,
      };
    } catch (error: any) {
      logger.error("National Scout Failed", { message: error.message });
      throw error;
    }
  },
);
