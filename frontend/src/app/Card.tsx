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
    <div className="border rounded-lg p-8 w-80 mx-auto text-center shadow-md bg-gray-600">
      {!flipped ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Question</h2>
          <p className="mb-6 text-gray-200">{question}</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setFlipped(true)}
          >
            Show Answer
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Answer</h2>
          <p className="mb-6 text-gray-200">{answer}</p>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={() => setFlipped(false)}
          >
            Back to Question
          </button>
        </>
      )}
    </div>
  );
};

export default Card;
