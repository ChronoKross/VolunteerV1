import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookieStore = await cookies();
  console.log('Cookies:', cookieStore.getAll()); // Log all cookies

  try {
    const client = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              console.log(`Setting cookie: ${name}=${value}`); // Log each cookie being set
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    console.log('Supabase client created successfully');
    return client;
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    throw error;
  }
};