"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenerateQuiz() {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [numCards, setNumCards] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch("http://localhost:8000/api/generate-quiz/", {
        method: "POST",
        headers,
        body: JSON.stringify({
          title,
          topic,
          num_cards: numCards,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate quiz");
      }

      const quiz = await response.json();
      // Redirect to the dashboard to see the new quiz
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 min-h-screen bg-gray-900 text-white">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Generate AI Quiz
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Quiz Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g., World History Quiz"
            />
          </div>

          <div>
            <label htmlFor="topic" className="block text-sm font-medium mb-2">
              Topic
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g., ancient civilizations"
            />
          </div>

          <div>
            <label
              htmlFor="numCards"
              className="block text-sm font-medium mb-2"
            >
              Number of Cards
            </label>
            <select
              id="numCards"
              value={numCards}
              onChange={(e) => setNumCards(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
            >
              <option value={5}>5 cards</option>
              <option value={10}>10 cards</option>
              <option value={15}>15 cards</option>
            </select>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded font-medium transition cursor-pointer ${
              loading
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {loading ? "Generating Quiz..." : "Generate Quiz"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition cursor-pointer"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    </main>
  );
}
