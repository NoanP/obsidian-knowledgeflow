# Knowledge search and evidence (1.18)

## Use

Open **Wissen & Quellen → Wissenssuche** or the **Wissenssuche mit Belegen** command. Enter a question or concrete terms, optionally restrict the scope to published notes or sources, and choose **Antwort suchen**. The existing list/filter search remains available in other knowledge tabs.

The answer consists of up to six verbatim original passages with numbered references. **Textstelle prüfen** validates and displays the exact passage. **Notiz öffnen ↗** validates the current file again and opens it in a new tab. References point to KnowledgeFlow-owned knowledge notes and exact source snapshots, including explicitly imported note/chat copies. They never silently open a different source revision or fetch an external URL.

Questions and result sets remain in memory. No query, answer, task, source, draft, audit entry or setting is written by searching. Word/concept search needs no model or provider. The separately activated desktop semantic mode uses a local Ollama embedding process after explicit search; no remote provider or background recording is involved. See [local embeddings](LOCAL-EMBEDDINGS.md). Closing the view clears its answer/question state; unloading clears the derived index.

## What an answer means

This is extractive retrieval: ranked existing text, not a generated explanatory synthesis. Word overlap and related concepts are discovery signals, not proof that a passage fully answers a question. Missing unmatched query terms are disclosed. Expanded matches display literal query/passage pairs. Title-only matches appear separately as discovery links and never become quoted answer passages. No result means the current indexed material provides no matching passage; it does not prove the topic is absent everywhere or false.

A citation establishes the quoted text's exact file and version. It does not establish that the text is true. Source links stored on a published note are displayed separately as **Hinterlegte Quellen dieser Notiz**. Their existence does not automatically validate each selected note passage. Inference, ambiguity, missing source revisions, ambiguous source identities and multiple/later-imported source revisions get explicit notices when known from metadata.

Conflicting passages are retained independently, not combined into an invented resolution. The system does not perform semantic contradiction detection, fact checking or source-independence assessment. Matching copied passages are deduplicated in the displayed answer to avoid presenting copies as independent evidence. No numerical confidence/accuracy percentage is invented.

## Search and scope

- Input corpus: owned `KnowledgeFlow/Wissen/Seiten` records with state `published`, and valid source snapshots under `Quellen` with state `inbox`. Exact archived source revisions can still be linked as a published note's recorded references, but are not standalone search hits.
- Drafts, archived pages, generated link blocks, journal/history/audit files, tasks and unimported vault notes are excluded. Selecting an original note for import in 1.5 remains the explicit route for adding it to this corpus.
- Personal annotations on published pages are searched as a separate section and labelled accordingly; they do not inherit a separate claim-review certification.
- Imported chat text uses the same active-branch/order view as the source importer. Alternate ChatGPT branches retained in raw JSON are not retrieved as answers. Broken chat views are excluded rather than falling back to arbitrary raw branches.
- Text normalization handles case, diacritics, German ß and limited suffix forms; common German/English question words are omitted. Ranking combines the existing BM25-style weighted title/body calculation with explicit DE/EN concept expansion by default. Select Word matches only to disable expansion. This is bounded symbolic matching, not neural embeddings, unrestricted paraphrase understanding, translation or a general reasoning engine. See [Concept search](CONCEPT-SEARCH.md).
- The index is derived in memory from exact raw-record pins. Changed, added, removed or reordered records invalidate its reuse. No persistent index or extra runtime library is added.

## Citation checks

Each passage stores path, full raw-record SHA-256, original excerpt, exact UTF-16 section offsets and displayed section-relative line numbers. A fresh read verifies the file hash and exact substring before inspection/opening. Source text additionally verifies its immutable revision hash. Direct links to recorded source references similarly pin the full source record and exact revision.

Line numbers refer to the note **body**, annotation field or reconstructed chat text view, as labelled. They are not asserted to be raw Markdown file line numbers. Chat passages are reconstructed from a pinned JSON snapshot; their human-readable lines do not correspond to literal raw JSON lines. The evidence dialog is the exact passage locator; opening a note does not promise a cursor jump.

If a file has changed or disappeared, opening from an old answer is blocked and the user is asked to search again. A rerender after a detected collection change withholds old quotations until a new search. Results are a point-in-time view; an external change can happen after any check, so this is not cross-device locking or filesystem atomicity.

The note-opening API is based on [Obsidian's public API](https://github.com/obsidianmd/obsidian-api/blob/master/obsidian.d.ts), using a new leaf and `openFile`. No active real Obsidian session is used during repository development.

## Limits and disclosed omissions

At most 500 answer-corpus records, 200,000 indexed characters per record, 4 million indexed characters overall, 5,000 chunks and 900 UTF-16 characters per chunk. Notes precede sources in the stable path order. Up to six answer passages are shown, at most two per record. These are UI/resource bounds, not evidence-completeness or full-vault performance promises.

Records fully or partly omitted by these bounds are reported. Unreadable, changed-source, invalid-chat and transaction-quarantined records are not silently presented as valid evidence. Pending/invalid write journals keep their existing 1.4 quarantine rules. The underlying knowledge scan can still read all owned records before indexing; these index limits are not a disk-read quota.

A query accepts up to 1,000 characters and 30 distinct non-stopword terms. Long passages may be excerpted at text/line boundaries. Normalization never changes the displayed quote. Indexing/searching large real vaults and mobile devices needs a separate measurement pilot.

## Validation

456 automated tests pass, covering immutable/read-only queries, exact Unicode/CRLF quotes and offsets, annotation/chat sections, stale/missing/forged citations, direct-link behavior, source-version issues, conflicting text retention, copied-text deduplication, exclusions, indexing bounds and content-sensitive cache invalidation.

A fixed synthetic set has 10 topic queries (network, SIM, backup, calendar, privacy, handover); each expected topic appears in the top three passages. Two unrelated astronomy/quantum questions return no passages. This fixture is intentionally small and authored alongside the code: it is a regression check, not an independent effectiveness benchmark. The 1.17 suite adds twelve synthetic bilingual concept queries with word-only controls. Real question quality, vocabulary outside the catalog, multi-hop reasoning and native Obsidian behavior remain outside that validation.
