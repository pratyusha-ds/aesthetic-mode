/**
 * @fileoverview API Route Handler for the Fashion Concierge.
 * This file manages the AI chat stream and database retrieval for UK fashion events.
 */

import { google } from "@ai-sdk/google";
import { streamText, tool, convertToModelMessages, stepCountIs } from "ai";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/**
 * Handles the AI chat stream and RAG tool execution.
 * * @param {Request} req - The incoming HTTP request.
 * @returns {Promise<Response>} The streaming AI response.
 */
export async function POST(req: Request) {
  const { messages } = await req.json();
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: google("gemini-3-flash-preview"),
    messages: modelMessages,
    system: `You are the Fashion Concierge. 
        CRITICAL RULE: You must ONLY provide information about fashion events returned by the 'searchEvents' tool. 
        If the tool returns no events or if an event is not in the list provided by the tool, 
        you must say: 'I'm sorry, I couldn't find any events matching that in our current database.'
        NEVER make up dates, locations, or events from your own memory.Only show an 'Event Details' section if you have a specific URL or extra instructions from the database. If that information is missing, do not create the header. Keep the layout compact to avoid large gaps.`,

    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingLevel: "medium",
          includeThoughts: true,
        },
      },
    },

    stopWhen: stepCountIs(10),
    tools: {
      searchEvents: tool({
        description: "Search for fashion events in the UK database",
        inputSchema: z.object({
          query: z.string().describe("The city, brand, or event type"),
        }),
        execute: async ({ query }) => {
          const today = new Date().toISOString();
          const { data } = await supabase
            .from("fashion_events")
            .select("*")
            .or(`city.ilike.%${query}%,title.ilike.%${query}%`)
            .gte("date", today)
            .order("date", { ascending: true })
            .limit(4);
          return data ?? [];
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
