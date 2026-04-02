import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new Response("Missing url", { status: 400 });

  try {
    const res = await fetch(url, {
      headers: {
        Referer: "https://www.ufc.com/",
        Origin: "https://www.ufc.com",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
    });

    if (!res.ok) return new Response(null, { status: res.status });

    const blob = await res.arrayBuffer();
    return new Response(blob, {
      headers: {
        "Content-Type": res.headers.get("Content-Type") ?? "image/png",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
