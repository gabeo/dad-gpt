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
      return `
      Sure, here's a quick Python code to find a prime number: 

      \`\`\`
      num = int(input("Enter a number: "))
        
      if num > 1:
          for i in range(2, num):
              if (num % i) == 0:
                  print(num, "is not a prime number")
                  break
          else:
              print(num, "is a prime number")
        
      else:
          print(num, "is not a prime number")
      \`\`\`
      
      And here's your pun: Why do programmers prefer dark mode? Because light attracts bugs!
      `;
    }),
});
