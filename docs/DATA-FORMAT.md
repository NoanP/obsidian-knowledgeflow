# Data format and ownership

KnowledgeFlow uses plugin ID `knowledgeflow`, view `knowledgeflow-board`, CSS/data prefix `kf-`, and its own Obsidian plugin data.json. All task operations default to `KnowledgeFlow/Aufgaben`. The task marker is `knowledgeflow: 1`; project association is `knowledgeflowProject`. TaskFlow's marker, data folder, settings and release stream are not read or modified. Common task concepts and markdown transformations originate from TaskFlow 0.17.3.

Knowledge records live only under `KnowledgeFlow/Wissen`:

| Folder | Purpose |
| --- | --- |
| Quellen | Immutable text snapshots; filename `src-<identity-sha256>--<text-sha256>.md` |
| Entwuerfe | Review drafts, including archived accepted/rejected drafts |
| Seiten | Published pages, meeting notes, solved cases and decisions |
| Verlauf | Before versions of changed records, retained locally |
| Protokoll | Human-readable audit entries, completed only when the transaction receipt exists |
| Aenderungen | Sealed JSON write-ahead plans and completion receipts in `.md` files; immutable snapshots, excluded from the knowledge index |

`knowledgeflowKnowledge: 1` identifies records. Required fields: `id`, `title`, `kind` (`source`, `page`, `meeting`, `case`, `decision`), `state` (`inbox`, `review`, `published`, `archived`). Sources add `revision`, `url`, `author`, `created`. Other records can include `sourceRefs: [{id, revision, passage}]`, `related` page IDs, `project` ID, `area`, `tags`, `provenance` (`source`, `inferred`, `ambiguous`), `userNotes` and review timestamps.

For source identity, normalize http/https URL, strip fragments/tracking parameters and sort query parameters. A source without URL is keyed by its text digest. Only the original text determines the revision. Title/author corrections to an existing exact snapshot do not replace it. Changed local source text is excluded from the knowledge index with a visible error; re-capture the corrected text as a new revision. Metadata is not cryptographically signed and an expert can alter files outside the plugin.

Drafts include `targetId` and `baseHash` when updating a page. `baseHash` is SHA-256 of the full page as it existed when the draft was prepared. Approval rejects a stale target or draft, preserves unknown target metadata and userNotes, writes the page, and archives the accepted draft. The source snapshots remain unchanged. Citation/version existence is checked; review remains responsible for whether claims are actually supported.

Published bodies contain a generated section between `<!-- knowledgeflow:links:start -->` and `<!-- knowledgeflow:links:end -->`. It links actual source/page files using Obsidian wikilinks. It is rebuilt on publish. Do not place personal content inside this generated block. Personal notes belong in Your annotations or outside the block. Files keep stable IDs when titles change.

Before an existing knowledge record changes, a history file preserves its old full Markdown. A published page's History dialog can load prior text as a NEW draft against the current revision; source selection and explicit approval still apply. Current personal annotations are kept. This is page revision recovery, not full-vault backup restoration. Old histories and operation logs are not silently pruned.

Knowledge writes are serialized per Vault object in the local runtime. A write-ahead plan is persisted before record, history or audit writes. Plans include exact before/after text and SHA-256 hashes, source-dependency hashes and a vault/root identity. Existing records use Vault.process with exact expected-text checks; new records use create-only writes. Completion requires matching outputs, dependencies and a sealed receipt. Pending operations retain all available files and snapshots; recovery is explicit, preview-bound and idempotent. Partial records are excluded from the knowledge index until completion. No automatic deletion or rollback is performed. See [RECOVERY.md](RECOVERY.md) for scope, recovery, retention and failure limits.

The index is rebuilt in memory from owned records. No database, embeddings, global vault scan for content, or generated index.md is required. Search does not search arbitrary legacy notes. Attachments and external web fetching are outside 1.0.

## Imported sources (1.5)

Source `importInfo` version 1 records `format`, selected `origin`, `sourceDate`, `dateBasis`, `importedAt`, the selected input text's `originalFileHash`, optional `conversationId` and readable `messageCount`. `created` remains the import time; a source's date is not invented from it. `revision` hashes the actual immutable source body. Text bodies retain decoded UTF-8 verbatim; chat bodies use canonical per-conversation JSON. See [SOURCE-IMPORT.md](SOURCE-IMPORT.md) for identity and deduplication rules. Import previews are private, bounded and memory-only; only confirmed selections reach disk through a single knowledge transaction.

## Reviewed knowledge tasks (1.8)

Tasks keep `knowledgeRefs` (published knowledge IDs) and `knowledgeflowProject` (stable project ID). Approved checklist conversions also retain `knowledgeApproval: { version: 1, key, approvedAt, evidence, sourcePins }`. Evidence stores the original owned note path/title, full raw SHA-256, body offsets and exact checklist text. Source pins store original snapshot paths and hashes. The body includes the origin link and quoted passage; the quote is not a new subtask. The task filename/ID is `knowledge-<64-hex-key>.md` within a validated owned task folder. Key = SHA-256 of note path, knowledge ID and whitespace/case-normalized checklist title. This is provenance/idempotence, not semantic identity or cryptographic user authentication.

A `task-approve` journal plan contains exactly one create-only `task` write and one audit, `approval` with folder/key/evidence/project ID and snapshot, and read pins for the published note and its original sources. Other journal actions cannot acquire task writes. Completed plans remain readable after task-folder changes; pending recovery blocks changed context. General task edits are unchanged.

## AI queue (1.9)

`KnowledgeFlow/Automation/queue.md` is a sealed JSON envelope using the existing SHA-256 envelope helper. Its payload has `knowledgeflowAI:1`, a vault identity, monotonic `seq`, persisted `paused`, provider price/limit `config` and up to 100 jobs. Config costs are integer micro-USD (`perJob`, `daily`, `monthly`); rates are USD per million tokens. Zero rates prevent job preparation. The fixed provider/model are defined in code, not arbitrary persisted endpoints.

Jobs retain purpose, source ID/revision/path/raw hashes, exact two-message request, config snapshot, estimate, hash, individual send-approval hash/time and status. Request credentials are never persisted. A running reservation has `chargeMicro` and local `chargeDay` before transport; ready/failed/uncertain/adopted jobs retain accounting. Results have a separate hash. Charges are counted by local day/month and are not released for unknown sends. No automatic pruning removes accounting.

Allowed states: `draft → queued → running → ready → adopted`; unsent jobs can become `cancelled` or `blocked`. Provider errors become `failed`; unknown dispatch outcomes become `uncertain`. Failed/uncertain/blocked/cancelled work can only be prepared as a new draft for a new send approval, never reset to an automatic retry. Configuration changes pause and withdraw queued approvals. Restart classifies persisted running work as uncertain.

The envelope is plaintext local state, protected against accidental corruption/stale writes rather than a cryptographic authorization boundary against someone who controls vault files. Source content and result text may be sensitive; vault backup/sync includes them. The queue is not a general knowledge journal transaction. Adopted results create `Entwuerfe/ai-<job-uuid>.md` through the existing journal, with deterministic ID, `aiJobId`, `aiOutputHash`, original sourceRefs and `provenance: inferred`.

## Personal note inbox (1.11)

`KnowledgeFlow/Wissen/NotizInbox/<UUID>.md` holds personal quick notes marked `quickNote: 1`, `kind: page` and `inboxStatus: open|processed|archived`. Only open notes use `state: inbox`; processed/archived use `state: archived`, never published. `sourceRefs` stays empty; optional `project`, `created`, `updated` and a `quickConversion` source/draft/request-hash reference retain workflow context. Body bytes and unknown metadata survive archive/processing. Read [the inbox workflow](NOTE-INBOX.md) for conversion and duplicate rules.

## Reviewed links (1.12)

Accepted suggestions use the existing `related` page-ID array on open inbox notes/review drafts, with only `updated` additionally changed. A `link-approve` journal contains `linkApproval` with origin hash and selected full target snapshots/hashes/matching evidence, target read dependencies, one origin write, one before-history write and one audit write. The validator constrains this shape; recovery checks pinned target versions. No new note kind or background proposal file is introduced.

## Inbox assistant (1.13)

Personal notes may carry `noteKind: page|meeting|case|decision`; the record kind stays page and the knowledge type is applied only during later conversion. Approved topics use the existing tags array. `inboxAssist` stores the latest approval identity/time. Optional `inboxSplit` and child `inboxOrigin` store exact creation offsets, original record/body hashes and stable child identities. The inbox-assist journal includes frozen origin/patch/selected target snapshots/section specifications; the validator reconstructs the exact allowed output and preserves original bodies. No proposal file is saved on analysis or preview.

## Topic hubs (1.14)

Hubs introduce no persistent record, setting or file schema. The view derives tag/area/project groupings from published owned pages and valid source snapshots, retaining existing exact source references. A view-local lexical query is transient. Question citations keep full-record hashes and original body/annotation/active-transcript offsets. All membership and source grouping is read-only.

## File inbox (1.19)

DateiInbox envelopes/acceptance receipts are internal Markdown records explicitly excluded from the knowledge scan. Original envelopes contain canonical base64 bytes and hashes; acceptance writes a frozen extracted source with exact page offsets and an independent reference receipt. Never index the base64 payload or treat these inbox records as knowledge. [Storage overhead, identity, recovery and bounds](FILE-INBOX.md).
