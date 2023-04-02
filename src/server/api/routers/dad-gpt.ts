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
      const results = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `In the form of a dad joke, answer: ${input.content}`,
        max_tokens: 100,
      });

      if (results.data.choices.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No results found" });
      }

      return results.data.choices;
    }),
  askMock: publicProcedure
    .input(
      z.object({
        content: z.string().min(3).max(300),
      })
    )
    .mutation((input) => {
      const x = [{ content: { text: input } }];
      return x;
    }),
});
