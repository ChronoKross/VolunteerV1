"use client";
import { useOAuth } from "@/hooks/useOAuth";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/form-message";

export default function OAuthGoogleButton() {
  const { signInWithProvider, loading, error } = useOAuth();

  return (
    <div className="flex flex-col gap-2 mt-2">
      <Button
        type="button"
        variant="outline"
        className="flex items-center justify-center gap-2"
        onClick={() => signInWithProvider("google")}
        disabled={loading}
      >
        <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
        {loading ? "Signing in with Google..." : "Sign up with Google"}
      </Button>
      {error && (
        <FormMessage message={{ message: error, type: "error" } as any} />
      )}
    </div>
  );
}