import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Provider } from "@supabase/supabase-js";

const supabase = createClient();

export function useOAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithProvider = async (provider: Provider) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      // options: { redirectTo: "YOUR_REDIRECT_URL" } // Optional: set redirect URL
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  return {
    signInWithProvider,
    loading,
    error,
  };
}