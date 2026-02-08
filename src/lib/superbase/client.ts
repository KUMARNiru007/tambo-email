import { createBrowserClient } from "@supabase/ssr";

function getURL() {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? 
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel
    'http://localhost:3000/';
  
 
  url = url.includes('http') ? url : `https://${url}`;

  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  
  return url;
}

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
    cookies: {
      getAll() {
        const cookies: { name: string; value: string }[] = [];
        if (typeof document === "undefined") return cookies;

        document.cookie.split(`;`).forEach((cookie) => {
          const [name, value] = cookie.trim().split(`=`);
          if (name) cookies.push({ name, value });
        });
        return cookies;
      },
      setAll(cookiesToSet) {
        if (typeof document === "undefined") return;
        cookiesToSet.forEach(({ name, value, options }) => {
          document.cookie = `${name}=${value}; path=${options?.path || "/"}; ${
            options?.maxAge ? `max-age=${options.maxAge};` : ""
          } ${options?.secure ? "secure;" : ""} ${
            options?.sameSite ? `samesite=${options.sameSite};` : ""
          }`;
        });
      },
    },
  }
);

export { getURL };