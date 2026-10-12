# Shared Swedish–English learning content (frozen starting input)

This directory contains the educational **data**, common **product objective** and **mission seeds** used across all three Nordljud conditions.

## Confirmed recovered assets

- `verb-library/A2.json` — 456 verb entries with A2-level example sentences.
- `verb-library/B1.json` — 456 verb entries with B1-level example sentences.
- `verb-library/B2.json` — 456 verb entries with B2-level example sentences.
- `verb-library/C1.json` — 456 verb entries with C1-level example sentences.
- `mission-seeds.json` — four small representative lesson goals, one per level.
- `PRODUCT_BRIEF.md` — the common app goal and shared constraints.
- `SOURCE_MANIFEST.md` — recovery provenance, incomplete form caveats and limitations.

The four datasets include **1,824 level-specific entries covering 456 distinct verbs**. Some forms are deliberately empty or unavailable; no missing content has been invented.

## Experiment rules

- The educational data and mission seeds are shared common input. **Historical application source code is not included.**
- Build each implementation independently from the exact same baseline Git commit.
- Existing Swedish educational examples are not teacher-certified; review before commercial publication.
- The old prototype uses browser `speechSynthesis` (`sv-SE`); MP3 assets are not required for this bounded classroom MVP.
- Never commit API keys or production secrets.

**Status:** Shared baseline imported and checked; **none of the three experimental implementations has started yet**.
