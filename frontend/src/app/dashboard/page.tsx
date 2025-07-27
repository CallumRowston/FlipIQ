"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/lib/api";
import { getGuestQuizzes, GuestQuiz } from "@/lib/guestStorage";
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
  isGuest?: boolean; // Optional flag for guest quizzes
}

export default function Home() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const loadQuizzes = async () => {
    const token = localStorage.getItem("access_token");
    let isUserAuthenticated = !!token; // Start with JWT token check

    try {
      let serverQuizzes: Quiz[] = [];

      if (token) {
        // User has JWT token - fetch their personal quizzes
        try {
          const response = await apiCall("/api/quizzes/");
          if (response.ok) {
            serverQuizzes = await response.json();
          }
        } catch (error) {
          console.log("Error fetching user quizzes:", error);
        }
      } else {
        // No JWT token - check if user is authenticated via Django session (OAuth)
        try {
          // First, try to access user profile endpoint to check session auth
          const sessionCheckResponse = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
            }/accounts/profile/`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (sessionCheckResponse.ok) {
            // User is authenticated via Django session (OAuth user)
            isUserAuthenticated = true;

            // Fetch their personal quizzes
            const response = await fetch(
              `${
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
              }/api/quizzes/`,
              {
                method: "GET",
                credentials: "include",
              }
            );

            if (response.ok) {
              serverQuizzes = await response.json();
            }
          } else {
            // Not authenticated - fetch public quizzes
            const response = await fetch(
              `${
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
              }/api/quizzes/`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.ok) {
              serverQuizzes = await response.json();
            }
          }
        } catch (error) {
          console.log("Error checking authentication:", error);
        }
      }

      setIsAuthenticated(isUserAuthenticated);

      // Always fetch guest quizzes
      const guestQuizzes = getGuestQuizzes();

      // Combine quizzes with guest quizzes first (most recent)
      const allQuizzes = [...guestQuizzes, ...serverQuizzes];

      setQuizzes(allQuizzes);
    } catch (error) {
      console.error("Error loading quizzes:", error);
      // If server fails, still show guest quizzes
      const guestQuizzes = getGuestQuizzes();
      setQuizzes(guestQuizzes);
      setIsAuthenticated(!!token);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();

    // Refresh quizzes when the user returns to the page
    const handleFocus = () => loadQuizzes();
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/auth");
  };

  useEffect(() => {
    setFlipped(false);
  }, [cardIndex, selectedQuiz]);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  if (!selectedQuiz) {
    return (
      <main className="p-8 min-h-screen">
        {/* User Status Bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-center">FLIPIQ</h1>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-green-400 text-sm">✓ Logged in</span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <span className="text-yellow-400 text-sm">👋 Guest mode</span>
                <button
                  onClick={() => router.push("/auth")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition cursor-pointer"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>

        {/* Generate Quiz Button */}
        <div className="text-center mb-8">
          <div className="relative inline-block bg-gradient-to-r from-purple-500 via-blue-500 to-yellow-500 bg-[length:400%_400%] animate-gradient-wave hover:bg-transparent p-1.5 rounded-2xl hover:scale-110 transition-all cursor-pointer">
            <button
              onClick={() => router.push("/dashboard/generate")}
              className="bg-gray-700 hover:bg-transparent text-white px-12 py-6 rounded-2xl font-bold text-xl block cursor-pointer transition-all"
            >
              ✨ Generate AI Quiz
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-center">
          or select a quiz below
        </h2>

        <div className="flex justify-center">
          <ul className="max-w-2xl mx-auto space-y-4">
            {quizzes.map((quiz) => (
              <li key={`${quiz.isGuest ? "guest" : "server"}-${quiz.id}`}>
                <button
                  onClick={() => {
                    setSelectedQuiz(quiz);
                    setCardIndex(0);
                  }}
                  className="group/btn relative w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all cursor-pointer transform hover:scale-[1.02] hover:from-blue-400 hover:to-indigo-500 active:scale-[0.98]"
                >
                  <span className="relative z-10 flex items-center justify-between">
                    <span className="text-lg">{quiz.title}</span>
                    <div className="flex items-center space-x-2">
                      {quiz.isGuest && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                          Guest Session
                        </span>
                      )}
                      {!quiz.isGuest && !isAuthenticated && (
                        <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                          Public
                        </span>
                      )}
                    </div>
                  </span>
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
    <main className="p-8 min-h-screen text-center">
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
          className={`group/btn relative bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 cursor-pointer transform active:scale-[0.98] ${
            cardIndex === 0
              ? "opacity-40 cursor-not-allowed"
              : "hover:from-gray-400 hover:to-gray-500 hover:scale-[1.02] hover:shadow-gray-500/25"
          }`}
        >
          <span className="relative z-10 flex items-center justify-center space-x-2">
            <svg
              className={`w-4 h-4 transition-transform ${
                cardIndex === 0 ? "" : "group-hover/btn:-translate-x-1"
              }`}
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
            <span>Previous</span>
          </span>
        </button>
        <button
          onClick={() => setCardIndex(cardIndex + 1)}
          disabled={cardIndex === flashcards.length - 1}
          className={`group/btn relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 cursor-pointer transform active:scale-[0.98] ${
            cardIndex === flashcards.length - 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:from-blue-400 hover:to-indigo-500 hover:scale-[1.02] hover:shadow-blue-500/25"
          }`}
        >
          <span className="relative z-10 flex items-center justify-center space-x-2">
            <span>Next</span>
            <svg
              className={`w-4 h-4 transition-transform ${
                cardIndex === flashcards.length - 1
                  ? ""
                  : "group-hover/btn:translate-x-1"
              }`}
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
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => setSelectedQuiz(null)}
          className="group/btn relative bg-gradient-to-r from-purple-500 to-violet-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:from-purple-400 hover:to-violet-500 active:scale-[0.98]"
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
            <span>Back to Quiz List</span>
          </span>
        </button>
      </div>
    </main>
  );
}
