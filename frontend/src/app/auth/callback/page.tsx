"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Processing authentication...");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if we have tokens in URL params (if Django passes them)
        const accessToken = searchParams.get("access_token");
        const refreshToken = searchParams.get("refresh_token");

        if (accessToken && refreshToken) {
          // Store tokens and redirect
          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("refresh_token", refreshToken);
          setStatus("success");
          setMessage("Successfully authenticated! Redirecting...");

          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);

          return;
        }

        // If no tokens in URL, check if we have a session cookie or need to exchange code
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (error) {
          setStatus("error");
          setMessage(`Authentication failed: ${error}`);
          return;
        }

        if (code) {
          // Exchange code for tokens via backend
          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
            }/auth/github/callback/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ code }),
              credentials: "include", // Include cookies
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.access && data.refresh) {
              localStorage.setItem("access_token", data.access);
              localStorage.setItem("refresh_token", data.refresh);
              setStatus("success");
              setMessage("Successfully authenticated! Redirecting...");

              setTimeout(() => {
                router.push("/dashboard");
              }, 1000);
              return;
            }
          }
        }

        // If we get here, try to check if user is already authenticated via session
        const checkAuthResponse = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
          }/auth/user/`,
          {
            credentials: "include",
          }
        );

        if (checkAuthResponse.ok) {
          const userData = await checkAuthResponse.json();
          if (userData.tokens) {
            localStorage.setItem("access_token", userData.tokens.access);
            localStorage.setItem("refresh_token", userData.tokens.refresh);
            setStatus("success");
            setMessage("Successfully authenticated! Redirecting...");

            setTimeout(() => {
              router.push("/dashboard");
            }, 1000);
            return;
          }
        }

        // If nothing worked, show error
        setStatus("error");
        setMessage("Authentication failed. No valid tokens received.");
      } catch (err) {
        console.error("Auth callback error:", err);
        setStatus("error");
        setMessage("Authentication failed due to network error.");
      }
    };

    handleAuthCallback();
  }, [searchParams, router]);

  const handleRetry = () => {
    router.push("/auth");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-6">FLIPIQ</h1>

          {status === "loading" && (
            <div className="space-y-4">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-300">{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <div className="text-green-400 text-4xl">✓</div>
              <p className="text-green-300">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="text-red-400 text-4xl">✗</div>
              <p className="text-red-300 mb-4">{message}</p>
              <button
                onClick={handleRetry}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
