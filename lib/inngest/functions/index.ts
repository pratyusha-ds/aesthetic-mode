/**
 * @fileoverview Fashion event scraper and database synchronization.
 * Uses Exa for search and Gemini for data structuring.
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

      const searchResults = await step.run("search-exa", async () => {
        return await exa.search(
          `Latest designer sample sales and fashion pop-ups in London ${currentYear}`,
          {
            type: "auto",
            numResults: 10,
            contents: { text: true },
            startPublishedDate: new Date(
              Date.now() - 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
        );
      });

      const cleanData = await step.run("clean-with-gemini", async () => {
        const prompt = `Extract fashion events from this data: ${JSON.stringify(searchResults.results)}`;

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
                    required: ["title", "date", "event_url"],
                  },
                },
              },
            },
          },
        });

        const parsed = JSON.parse(result.response.text());
        return parsed.events || parsed;
      });

      const dbResult = await step.run("save-to-supabase", async () => {
        const { error, data } = await supabase
          .from("fashion_events")
          .upsert(cleanData, {
            onConflict: "event_url",
            ignoreDuplicates: true,
          })
          .select();

        if (error) throw error;
        return { count: data?.length || 0 };
      });

      return { message: "Scout successful", stats: dbResult };
    } catch (error: any) {
      logger.error("Scout Function Failed", {
        message: error.message,
      });
      throw error;
    }
  },
);
