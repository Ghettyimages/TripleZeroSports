import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-webhook-secret");
  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const paths: string[] = Array.isArray(body?.paths)
      ? body.paths
      : ["/", "/rss.xml", "/sitemap.xml"];

    paths.forEach((p) => revalidatePath(p));
    return NextResponse.json({ ok: true, revalidated: paths });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}