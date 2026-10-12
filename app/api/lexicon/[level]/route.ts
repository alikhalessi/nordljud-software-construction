import { corpus } from "../../../../src/teaching";
import { isLevel } from "../../../../src/domain";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ level: string }> }
) {
  const { level } = await params;
  const normalized = level.toUpperCase();
  if (!isLevel(normalized)) {
    return Response.json({ error: "Unsupported learning level" }, { status: 404 });
  }
  const items = corpus(normalized);
  return Response.json({ level: normalized, count: items.length, items }, {
    headers: { "Cache-Control": "public, s-maxage=3600, max-age=60" }
  });
}
