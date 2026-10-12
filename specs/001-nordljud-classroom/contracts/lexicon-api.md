# HTTP Contract — CEFR Teaching Lexicon

**Operation:** `GET /api/lexicon/{level}`  
**Authentication:** none; publicly available static teaching content.  
**Supported levels:** A2, B1, B2, C1 (case-insensitive input may normalize to uppercase).

## Success — 200

```json
{
  "level": "A2",
  "count": 456,
  "items": [
    {
      "v": "arbeta",
      "meaning": "work",
      "forms": {
        "Pres": { "word": "arbetar", "sv": "...", "en": "..." }
      }
    }
  ]
}
```

**Important:** The example above is a *shape illustration*, not the full source record or an acceptance fixture; real responses must include the exact source entries and all available five keys.

- Array contains **456 records per level**, including two distinct `sticka` entries.
- Lexicon endpoint never returns learner profile, email, token or progress.
- ETag/Cache-Control allowed for immutable common content.

## Failure — 404

```json
{ "error": "Unsupported learning level" }
```

Unsupported CEFR labels must not silently fall back to A2.

## Client invariants

- Search by lemma and English gloss, and potentially source example/translation.
- Selected sense ID must survive CEFR switch.
- No `service_role` key or private auth info in response.
- Absent form example is a rendered unavailable state, not a generated Swedish sentence.

## User Progress Protocol

Supabase Auth provider governs sessions and existing `learner_states` table enforces user-level RLS. This is deliberately **not** a custom session API.

For account ID `auth.uid()`, read and upsert the row while preserving existing JSONB keys and changing only `nordljud_sdd_v1`.

External Google redirect must be on Supabase Auth's allowlist. A successful Next.js build does not verify the Google callback.
