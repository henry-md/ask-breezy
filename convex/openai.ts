import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { z } from "zod";
import { streamText, tool } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import {
  getCurrentCondition,
  getLocation as originalGetLocation,
} from "./weather";
import { internal } from "./_generated/api";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const GetLocationParameters = z.object({
  city: z.string().describe("City name e.g. Baltimore"),
});

const GetCurrentConditionParameters = z.object({
  locationKey: z.string().describe("Location key for a city, e.g. 348707"),
});

const instructions = `You are "Breezy," a helpful assistant that can provide information about the weather.
You have access to two functions: \`getLocation\` and \`getCurrentCondition\`.
When a user asks for the weather conditions in a city, 
you should use the \`getLocation\` function to get the location information (object).
This object contains several attributes, including the \`Key\` attribute.
You should then use the \`Key\` attribute to call the \`getCurrentCondition\` function
which will return a forecast object with the current weather conditions.
`;

export const completion = internalAction({
  args: {
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      }),
    ),
    placeholderMessageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const openai = createOpenAI({
      apiKey: OPENAI_API_KEY,
      compatibility: "strict", // strict mode, enable when using the OpenAI API
    });

    const { textStream } = streamText({
      model: openai("gpt-4o"),
      tools: {
        getLocation: tool({
          description:
            "Given a city name, return the location object which contains the location key",
          parameters: GetLocationParameters,
          execute: async ({ city }) => { 
            await ctx.runMutation(internal.messages.update, {
              messageId: args.placeholderMessageId,
              content: `🔍 Getting location information for ${city}...`
            });
            return originalGetLocation(city);
          },
        }),
        getCurrentCondition: tool({
          description:
            "Given a location key, return the current weather conditions",
          parameters: GetCurrentConditionParameters,
          execute: async ({ locationKey }) => { 
            await ctx.runMutation(internal.messages.update, {
              messageId: args.placeholderMessageId,
              content: `🌤️ Fetching weather conditions for location ${locationKey}...`
            });
            return getCurrentCondition(locationKey);
          },
        }),
      },
      messages: [
        {
          role: "system",
          content: instructions,
        },
        ...args.messages,
      ],
      maxSteps: 10,
      temperature: 0,
    });

    let fullResponse = "";
    for await (const delta of textStream) {
      fullResponse += delta;
      await ctx.runMutation(internal.messages.update, {
        messageId: args.placeholderMessageId,
        content: fullResponse,
      });
    }
  },
});
