# Data Model — Nordljud Classroom SDD

## Teaching domain (immutable common inputs)

`Level` is the enum `A2 | B1 | B2 | C1`.

`VerbSense`:
- `v`: Swedish written lemma.
- `meaning`: English gloss distinguishing homograph senses.
- `forms`: `Inf`, `Imp`, `Pres`, `Pret`, `Sup`; each has `word`, `sv` example, and `en` translation.
- `frequency` and `page`: source metadata; frequency label not equivalent to CEFR sentence difficulty.
- **Identity:** `v + "::" + meaning`, stable across the four immutable datasets; show 456 sense records, 455 unique written lemmas at each level.

`MissionSeed`: `id`, `level`, `title`, `learnerGoal`, `verb`, `formKeys`, `suggestedContext`. Four shared seeds exactly.

`MissionPresentation`: seed metadata plus selected teaching source `VerbSense`, examples and two independent exercise questions. This object is derived; never edits the source.

## User state (authenticated)

`LearnerState`:
- `completed`: map of mission ID → `{comprehension:boolean, forms:boolean}`.
- `favorites`: array of `VerbSense` stable IDs.
- version stored inside a distinct namespace: `learner_states.state.nordljud_sdd_v1`.

Existing Supabase table `public.learner_states`:
- `user_id UUID PRIMARY KEY`, must equal `auth.uid()`.
- `state JSONB`, holds independent namespaces for each research app.
- `updated_at`.

Existing RLS policies require authenticated user `auth.uid() = user_id` on SELECT, INSERT, UPDATE and DELETE; verified on the project separately. Never use a service-role token.

## Guest state

Browser localStorage key `nordljud_sdd_guest_v1`; same `LearnerState` shape. Anonymous guest data stays local, is not automatically merged after OAuth sign-in, and cannot access authenticated cloud rows.

## State transitions

- Correct quiz answer: set only the corresponding mission completion flag.
- Incorrect answer: show feedback without modifying progress.
- Favorite toggle: add/remove sense ID.
- Account sign-in: load this account's SDD namespace and ignore other namespaces.
- Save: preserve foreign JSONB namespaces; upsert this user's row.
- Error: show a visible failure without claiming remote persistence.

## Data Validation

- Each CEFR input must have 456 records.
- Both `sticka` entries must remain distinguishable by meaning and present form.
- The ordered IDs must be consistent across A2, B1, B2 and C1.
- Source missing examples cannot be made up.
