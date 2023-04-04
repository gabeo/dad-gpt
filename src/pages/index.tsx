import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

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
        <div className="p-6">
          <div className="relative rounded-xl border border-purple-600 bg-gradient-to-br from-[#9c6ae3] to-[hsl(280,100%,70%)] p-10">
            <Image
              src="/images/dad.png"
              alt="Profile image"
              className="bd absolute -top-8 -left-8 border-spacing-4 rounded-full border-2 border-teal-800 bg-teal-500 p-2"
              width={80}
              height={80}
            />
            <div className="flex items-center space-x-4 text-2xl font-bold text-white">
              {answer}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  return (
    <>
      <Head>
        <title>DadGPT</title>
        <meta property="og:title" content="DadGPT - Ask Me Anything" />
        <meta
          property="og:description"
          content="DadGPT is what would happen if AI was trained by your dad. Ask him anything!  Just don't expect a good answer."
        />
        <meta property="og:site_name" content="DadGPT" />
        <meta property="og:image" content="/images/dad.png" />
      </Head>
      <nav className="flex h-16 flex-wrap items-center justify-end">
        {userLoaded && (
          <div className="mr-5 flex-shrink-0 rounded border-4 border-teal-500 bg-teal-500 py-1 px-2 text-sm text-white hover:border-teal-700 hover:bg-teal-700">
            {!isSignedIn ? <SignInButton /> : <SignOutButton />}
          </div>
        )}
      </nav>
      <main className="flex min-h-screen flex-col items-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Dad<span className="text-[hsl(280,100%,70%)]">GPT</span>
          </h1>
          {!isSignedIn && (
            <div className="rounded-xl bg-gradient-to-br from-[#9c6ae3] to-[hsl(280,100%,70%)] p-10">
              <div className="flex items-center space-x-4 text-2xl font-bold text-white">
                <div className="flex flex-col items-center justify-center gap-4">
                  <p className="text-2xl font-bold text-white">
                    Ask DadGPT anything!
                  </p>
                </div>
              </div>
            </div>
          )}
          {!!isSignedIn && (
            <>
              <AskQuestionComponent />
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
