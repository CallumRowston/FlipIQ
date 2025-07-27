"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user has a token
    const token = localStorage.getItem("access_token");

    if (token) {
      // User is logged in, go to dashboard
      router.push("/dashboard");
    } else {
      // User not logged in, go to auth page
      router.push("/auth");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">FLIPIQ</h1>
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    </div>
  );
}
