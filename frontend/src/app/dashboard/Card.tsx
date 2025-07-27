import React from "react";

interface CardProps {
  question: string;
  answer: string;
  flipped: boolean;
  setFlipped: (value: boolean) => void;
}

const Card: React.FC<CardProps> = ({
  question,
  answer,
  flipped,
  setFlipped,
}) => {
  return (
    <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md mx-auto shadow-2xl border border-gray-700/50">
      {!flipped ? (
        <div className="space-y-6">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Question
            </h2>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300"></div>
          </div>

          <div className="min-h-[120px] flex items-center justify-center">
            <p className="text-gray-200 text-lg leading-relaxed text-center font-medium">
              {question}
            </p>
          </div>

          <button
            className="group/btn relative w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-green-500/25 transition-all cursor-pointer transform hover:scale-[1.02] hover:from-green-400 hover:to-emerald-500 active:scale-[0.98]"
            onClick={() => setFlipped(true)}
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <span>Show Answer</span>
              <svg
                className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5-5 5M6 12h12"
                />
              </svg>
            </span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Answer
            </h2>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
          </div>

          <div className="min-h-[120px] flex items-center justify-center">
            <p className="text-gray-200 text-lg leading-relaxed text-center font-medium">
              {answer}
            </p>
          </div>

          <button
            className="group/btn relative w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:from-blue-400 hover:to-indigo-500 active:scale-[0.98]"
            onClick={() => setFlipped(false)}
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <svg
                className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 17l-5-5 5-5M18 12H6"
                />
              </svg>
              <span>Back to Question</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;
