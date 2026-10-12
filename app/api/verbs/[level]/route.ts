import { getVerbsForLevel } from "../../../../lib/verb-library";
import type { Level } from "../../../../lib/missions";

export const runtime = "nodejs";
const levels = new Set(["A2", "B1", "B2", "C1"]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ level: string }> }
) {
  const { level } = await params;
  const normalized = level.toUpperCase();
  if (!levels.has(normalized)) {
    return Response.json({ error: "Unsupported learning level." }, { status: 404 });
  }
  return Response.json(
    { level: normalized, verbs: getVerbsForLevel(normalized as Level) },
    { headers: { "Cache-Control": "public, max-age=60, s-maxage=3600" } }
  );
}
