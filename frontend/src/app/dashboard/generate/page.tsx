"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/lib/api";
import { saveGuestQuiz } from "@/lib/guestStorage";

export default function GenerateQuiz() {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [numCards, setNumCards] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isAuthenticated = !!localStorage.getItem("access_token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const isAuthenticated = !!localStorage.getItem("access_token");

    try {
      // Always call the AI API to generate the quiz content
      const response = await apiCall("/api/generate-quiz/", {
        method: "POST",
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

      const quizData = await response.json();

      if (!isAuthenticated) {
        // For guest users, save the AI-generated quiz locally
        saveGuestQuiz({
          title: quizData.title,
          description: quizData.description,
          flashcards: quizData.flashcards,
        });
      }
      // For authenticated users, the quiz is already saved on the server
      
      // Redirect to the dashboard to see the new quiz
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 min-h-screen text-white">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Generate AI Quiz
        </h1>

        {!isAuthenticated && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-200 text-sm">
                <strong>Guest Mode:</strong> AI Generated quizzes will not be saved after you close this window. 
                <button 
                  onClick={() => router.push("/auth")}
                  className="text-yellow-300 underline hover:text-yellow-100 ml-1 cursor-pointer"
                >
                  Login to save permanently
                </button>
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-lg font-medium mb-2">
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
            <label htmlFor="topic" className="block text-lg font-medium mb-2">
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
              className="block text-lg font-medium mb-2"
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
            className={`w-full py-3 px-4 rounded font-medium transition cursor-pointer border border-transparent ${
              loading
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 hover:border-blue-400"
            }`}
          >
            {loading ? "Generating Quiz..." : "Generate AI Quiz"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 hover:border-gray-400 border border-transparent transition cursor-pointer"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    </main>
  );
}
