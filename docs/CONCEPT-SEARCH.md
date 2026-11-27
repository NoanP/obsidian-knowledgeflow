# Local related-concept search (1.17)

The separate 1.18 [local neural embedding mode](LOCAL-EMBEDDINGS.md) supports free paraphrases. This document describes the unchanged dictionary-based fallback and link matcher.

## Use

Open Knowledge & sources → Ask knowledge. **Words + related concepts** is the default matching mode; **Word matches only** preserves the previous BM25-style lexical retrieval. Both search only owned published notes and valid source snapshots, with optional note/source scope. Search text, matching mode and results are view-local, not saved settings. Changing mode invalidates the displayed results until a fresh search.

A search for **Datensicherung Wiederherstellung** can retrieve **Backup … Recovery** without those German words appearing in the passage. Every such hit shows the literal pairs, e.g. `Datensicherung ↔ Backup`. References remain original extracts with full-record SHA-256 and exact section offsets. Title-only related matches stay separate discovery links. Missing unmatched terms remain visible; no generated synthesis is introduced.

## Meaning and limitations

This is symbolic semantic expansion using explicit bundled German/English concept groups, followed by hybrid lexical/concept ranking. It is not a neural embedding model, learned corpus representation, translation engine or unrestricted paraphrase search. The vocabulary covers common knowledge-work, technical and everyday terms. Related groups indicate possible relevance, not logical equivalence, factual agreement, truth, a resolved contradiction or certainty. Negations are retained in quotations; opposite claims can both be found.

Examples include Datensicherung/Backup, Wiederherstellung/Recovery, Kennwort/Password, Fehlersuche/Troubleshooting, Besprechung/Meeting, Frist/Deadline, Einarbeitung/Onboarding, Fernwartung/Remote, Freigabe/Approval and Verschlüsselung/Encryption. Normalized complete tokens and existing light suffix handling are used; arbitrary substrings/compound fragments are not guessed. Ambiguous words outside the explicit vocabulary get no expansion. Unknown expressions still require lexical matches. A missing result does not establish that a topic is absent.

Exact word scores retain BM25 weighting. Body concept pairs add a bounded score; title concept pairs have less weight. Quotes are never rewritten. This release adds neither model downloads nor network calls, API costs, keys, persistent vector files, telemetry or runtime dependencies. Indexes are derived in memory, invalidated by exact corpus changes and cleared on unload. Startup does not build an external semantic service.

## Link suggestions and the inbox assistant

The same concept features enhance matching from open personal notes/review drafts to unambiguous published pages. Existing common-word masking, code/comment/generated-link exclusion and redundant-link checks remain. Multiple synonyms in a single group count **once**, so “Backup Datensicherung Sicherungskopie” does not satisfy the two-signal gate by itself. Two distinct shared word/concept features are required; tags or a project alone are insufficient.

Each candidate displays paired literal words and exact origin/target excerpts. All checkboxes start unchecked. Approval still changes only selected origin relations/updated time, leaving the body, unknown metadata, annotations and target notes intact. The inbox assistant carries the same literal evidence through its separate full preview and approval.

The existing version-1 approval **structure** is unchanged: `shared` stores a feature key plus literal origin/target words (a concept key has the prefix `concept:`), with exact paired passages. Old plans retain their original lexical keys and words. Recovery validates the frozen literal evidence and constrained writes; it never reruns a future vocabulary/ranker. No approval is reinterpreted, no historical plans are rewritten, and no data migration is needed. Current direct approvals recheck the freshly offered match and exact versions. Only separately approved published relations enter the graph.

## Bounds and verification

Search retains the 500-record, 4-million-character, 5,000-chunk, 200,000-character-per-record bounds and active-chat-branch exclusions. Link matching retains 400 target notes, two million body characters, the first 20,000 body characters per note and eight visible proposals. Disclosed omissions and journal quarantine still apply. Index bounds do not limit the preceding owned-record disk scan. Full-vault/mobile performance remains unmeasured.

428 automated tests pass. Twenty new cases cover bilingual wording, word-only controls, unknown-term abstention, partial results, title-only discovery, scope/read-only operation, CRLF/Unicode/stale citations, generated/inbox/draft exclusions, opposing passages, cache invalidation, active chat branches, one-concept deduplication, link masking, exact pinned approval/idempotency, stale targets, inbox-assistant integration, future-vocabulary compatibility and interrupted recovery. A small authored acceptance set has twelve bilingual queries; each finds its intended note and no hit in word-only mode. This is a regression fixture, not an independent retrieval-quality benchmark.

The isolated browser host confirmed the Backup/Recovery example, word-only no-hit control, exact evidence inspection, an initially unchecked concept link, explicit approval, stale-result invalidation and light/dark presentation. All fixtures are synthetic and memory-only. Native Obsidian YAML/mobile/sync behavior and broad paraphrase quality require separate validation.

Only the KnowledgeFlow repository is published. TaskFlow and existing Obsidian systems are unchanged.
