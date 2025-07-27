// Utility functions for handling guest quiz storage

export interface GuestFlashCard {
  id: number;
  question: string;
  answer: string;
  created_at: string;
}

export interface GuestQuiz {
  id: number;
  title: string;
  description: string;
  created_at: string;
  flashcards: GuestFlashCard[];
  isGuest: true; // Flag to identify guest quizzes
}

const GUEST_QUIZ_KEY = "flipiq_guest_quizzes";

export const getGuestQuizzes = (): GuestQuiz[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = sessionStorage.getItem(GUEST_QUIZ_KEY); // Changed from localStorage
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading guest quizzes:", error);
    return [];
  }
};

export const saveGuestQuiz = (
  quiz: Omit<GuestQuiz, "id" | "created_at" | "isGuest">
): GuestQuiz => {
  const existingQuizzes = getGuestQuizzes();
  const newQuiz: GuestQuiz = {
    ...quiz,
    id: Date.now(), // Simple ID generation
    created_at: new Date().toISOString(),
    isGuest: true,
  };

  const updatedQuizzes = [newQuiz, ...existingQuizzes];

  try {
    sessionStorage.setItem(GUEST_QUIZ_KEY, JSON.stringify(updatedQuizzes)); // Changed from localStorage
  } catch (error) {
    console.error("Error saving guest quiz:", error);
  }

  return newQuiz;
};

export const clearGuestQuizzes = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(GUEST_QUIZ_KEY); // Changed from localStorage
};
