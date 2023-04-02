import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { SignInButton, useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";

const AskQuestionComponent = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const { mutate, isLoading: isPosting } = api.dadGpt.ask.useMutation({
    onSuccess: (data) => {
      const answer = data;
      console.log("success", answer);
      if (answer) {
        setAnswer(answer);
      } else {
        setAnswer("I don't know");
      }
    },
    onError: (e) => {
      setAnswer("");
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Beep boop, something went wrong");
      }
    },
  });

  return (
    <>
      <div className="w-full max-w-xl">
        <div className="flex items-center border-b border-teal-500 py-2">
          <input
            className="mr-3 w-full appearance-none border-none bg-transparent py-1 px-2 leading-tight text-white focus:outline-none"
            type="text"
            placeholder="What would you like to ask?"
            aria-label="Full name"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (question !== "") {
                  console.log("submitting", question);
                  mutate({ content: question });
                }
              }
            }}
            disabled={isPosting}
          />
          <button
            className="flex-shrink-0 rounded border-4 border-teal-500 bg-teal-500 py-1 px-2 text-sm text-white hover:border-teal-700 hover:bg-teal-700"
            type="button"
            onClick={() => {
              mutate({ content: question });
            }}
          >
            Ask DadGPT
          </button>
        </div>
      </div>
      {answer && (
        <div className="rounded-xl bg-gradient-to-br from-[#9c6ae3] to-[hsl(280,100%,70%)] p-10">
          <div className="flex items-center space-x-4 text-2xl font-bold text-white">
            {answer}
          </div>
        </div>
      )}
    </>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  if (!userLoaded) {
    return <div></div>;
  }

  return (
    <>
      <Head>
        <title>DadGPT</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Dad<span className="text-[hsl(280,100%,70%)]">GPT</span>
          </h1>
          {!isSignedIn && (
            <div className="flex justify-center rounded-md bg-white py-5 px-20 text-lg text-slate-600">
              <SignInButton />
            </div>
          )}
          {!!isSignedIn && <AskQuestionComponent />}
        </div>
      </main>
    </>
  );
};

export default Home;
