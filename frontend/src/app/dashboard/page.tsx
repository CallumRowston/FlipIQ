"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "./Card";

interface FlashCard {
  id: number;
  question: string;
  answer: string;
  created_at: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  created_at: string;
  flashcards: FlashCard[];
}

export default function Home() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);

    // Fetch quizzes with auth header if available
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    fetch("http://localhost:8000/api/quizzes/", { headers })
      .then((res) => res.json())
      .then((data) => {
        setQuizzes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/auth");
  };

  useEffect(() => {
    setFlipped(false);
  }, [cardIndex, selectedQuiz]);

  if (loading)
    return <div className="bg-gray-900 text-center py-8">Loading...</div>;

  if (!selectedQuiz) {
    return (
      <main className="p-8 min-h-screen bg-gray-900">
        {/* User Status Bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-center">FLIPIQ</h1>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-green-400 text-sm">✓ Logged in</span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <span className="text-yellow-400 text-sm">👋 Guest mode</span>
                <button
                  onClick={() => router.push("/auth")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-center">
          Select a Category
        </h2>

        {/* Generate Quiz Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push("/dashboard/generate")}
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 hover:scale-105 transition cursor-pointer"
          >
            ✨ Generate AI Quiz
          </button>
        </div>

        <div className="flex items-center">
          <ul className="max-w-xl mx-auto">
            {quizzes.map((quiz) => (
              <li key={quiz.id} className="mb-6">
                <button
                  onClick={() => {
                    setSelectedQuiz(quiz);
                    setCardIndex(0);
                  }}
                  className="w-xs text-lg font-medium bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition cursor-pointer hover:scale-105"
                >
                  {quiz.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    );
  }

  const flashcards = selectedQuiz.flashcards;
  const currentCard = flashcards[cardIndex];

  return (
    <main className="p-8 min-h-screen bg-gray-900 text-center">
      <h1 className="text-3xl font-bold mb-8">{selectedQuiz.title}</h1>
      <div className="mb-4 text-lg text-gray-200">
        {cardIndex + 1} / {flashcards.length}
      </div>
      <Card
        question={currentCard.question}
        answer={currentCard.answer}
        flipped={flipped}
        setFlipped={setFlipped}
      />
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => setCardIndex(cardIndex - 1)}
          disabled={cardIndex === 0}
          className={`px-4 py-2 rounded bg-gray-300 text-gray-700 font-medium transition cursor-pointer hover:scale-105 ${
            cardIndex === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-400"
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => setCardIndex(cardIndex + 1)}
          disabled={cardIndex === flashcards.length - 1}
          className={`px-4 py-2 rounded bg-blue-500 text-white font-medium transition cursor-pointer hover:scale-105 ${
            cardIndex === flashcards.length - 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
      <div className="mt-8">
        <button
          onClick={() => setSelectedQuiz(null)}
          className="px-4 py-2 rounded bg-gray-500 text-white font-medium hover:bg-gray-600 transition cursor-pointer hover:scale-105"
        >
          Back to Quiz List
        </button>
      </div>
    </main>
  );
}
