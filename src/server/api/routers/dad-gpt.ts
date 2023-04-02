import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Configuration, OpenAIApi } from "openai";
import { TRPCError } from "@trpc/server";

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openaiConfig);

export const dadGptRouter = createTRPCRouter({
  ask: publicProcedure
    .input(
      z.object({
        content: z.string().min(3).max(300),
      })
    )
    .mutation(async ({ input }) => {
      const results = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            // content: `Answer my question with a related dad joke: ${input.content}`,
            content: `Answer my question and include a pun: ${input.content}`,
          },
        ],
      });

      console.log("results", results.data.choices);

      if (results.data.choices.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No results found" });
      }

      return results.data.choices[0]?.message?.content;
    }),
  askMock: publicProcedure
    .input(
      z.object({
        content: z.string().min(3).max(300),
      })
    )
    .mutation(() => {
      return "The quick brown fox jumps over the lazy dog.";
    }),
});
