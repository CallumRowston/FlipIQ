"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthCallbackContent() {
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

        // Check for OAuth errors
        const error = searchParams.get("error");
        if (error) {
          setStatus("error");
          setMessage(`Authentication failed: ${error}`);
          return;
        }

        // If we get here, user should be authenticated via Django session after OAuth
        // Try to get JWT tokens from the session
        const checkAuthResponse = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
          }/auth/callback/`,
          {
            method: "GET",
            credentials: "include", // Include session cookies
          }
        );

        if (checkAuthResponse.ok) {
          const data = await checkAuthResponse.json();
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

        // Fallback: try the auth/user endpoint
        const userAuthResponse = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
          }/auth/user/`,
          {
            credentials: "include",
          }
        );

        if (userAuthResponse.ok) {
          const userData = await userAuthResponse.json();
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

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-6">FLIPIQ</h1>
          <div className="space-y-4">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-300">Loading authentication...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
