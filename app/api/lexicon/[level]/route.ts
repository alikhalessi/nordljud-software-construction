import { LEVELS, type Level } from "../../../../domain/types";
import { library } from "../../../../domain/learning";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ level: string }> }
) {
  const { level } = await params;
  const requested = level.toUpperCase();
  if (!LEVELS.includes(requested as Level)) {
    return Response.json({ error: "Unrecognized Swedish learning level" }, { status: 404 });
  }
  return Response.json(
    { level: requested, items: library(requested as Level) },
    { headers: { "Cache-Control": "public, max-age=60, s-maxage=3600" } }
  );
}
