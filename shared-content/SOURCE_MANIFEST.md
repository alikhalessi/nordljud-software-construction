# Shared content — recovery and provenance

**Status:** Imported educational **data** only; historical application **code is excluded** from the experimental baseline.

## Recovery source

Recovered from the user's historical Nordlyd materials created in earlier ChatGPT sessions, especially `Nordlyd_3B_Demo.html` and `Nordlyd_3B_1_Ready_To_Deploy.zip` (8 October 2026).

The historical 3B.1 README states that the original verb forms were sourced from **previously provided Swedish-learning PDFs**. Those underlying source PDFs have **not been independently inspected in this preparation stage**. The attached O'Reilly books on AI coding and agent engineering are methodology references, **not Swedish educational source material**.

## Dataset

| File | CEFR sentence set | Verb records | Missing form examples |
|---|---|---:|---|
| `verb-library/A2.json` | A2 | 456 | imperative 34, infinitive 1, supine 1 |
| `verb-library/B1.json` | B1 | 456 | imperative 29 |
| `verb-library/B2.json` | B2 | 456 | imperative 31 |
| `verb-library/C1.json` | C1 | 456 | imperative 31 |

Total: **1,824 level-specific verb records** covering the **same 456 base verbs** at four sentence complexity levels. The `frequency` field denotes the original lexicon classification and is **not identical to the sentence-set CEFR level**.

Records preserve the original `v`, `frequency`, `meaning`, `forms` (Inf, Imp, Pres, Pret, Sup), and `page` fields. Blank examples and the em dash are **not filled in or silently corrected**.

## Use in the experiment

1. Every condition must read the same frozen JSON data and mission seeds.
2. Do **not** transplant historical HTML/CSS/JavaScript, UI state logic, auth code, database wiring, or tests into one condition as though it were newly generated.
3. Reference past Nordlyd deployments only as **historical prototypes**. Prior familiarity with the app is disclosed as a limitation.
4. All example sentences, translations, mission scenarios and Swedish-language feedback require **human Swedish-teacher review** before a public commercial release.
5. Preserve provenance and review licenses/permissions of underlying language source PDFs before redistributing data outside the private project.
6. Swedish speech in the old application uses browser `speechSynthesis` with `sv-SE`, **not recorded MP3 audio**. Comparable browser speech is acceptable for the classroom experiment; voice availability/quality is platform-dependent.
7. Historical deployment `nordlyd-3b.vercel.app` is *not* proof that signup, cloud sync, or all missions are operational.

## Methodology sources

- Addy Osmani (2025), *Beyond Vibe Coding* — Vibe Coding protocol and validation.
- Tom Taulli (2024), *AI-Assisted Programming* — development lifecycle, prompt engineering, requirements and testing.
- Michael Albada (2025), *Building Applications with AI Agents* — planning, reflection, autonomy and evaluation.

These three texts inform **methodology**, not the Swedish-language curriculum.
