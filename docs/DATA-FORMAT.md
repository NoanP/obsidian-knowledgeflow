# Data format and ownership

KnowledgeFlow uses plugin ID `knowledgeflow`, view `knowledgeflow-board`, CSS/data prefix `kf-`, and its own Obsidian plugin data.json. All task operations default to `KnowledgeFlow/Aufgaben`. The task marker is `knowledgeflow: 1`; project association is `knowledgeflowProject`. TaskFlow's marker, data folder, settings and release stream are not read or modified. Common task concepts and markdown transformations originate from TaskFlow 0.17.3.

Knowledge records live only under `KnowledgeFlow/Wissen`:

| Folder | Purpose |
| --- | --- |
| Quellen | Immutable text snapshots; filename `src-<identity-sha256>--<text-sha256>.md` |
| Entwuerfe | Review drafts, including archived accepted/rejected drafts |
| Seiten | Published pages, meeting notes, solved cases and decisions |
| Verlauf | Before versions of changed records, retained locally |
| Protokoll | One Markdown audit entry per completed knowledge operation |

`knowledgeflowKnowledge: 1` identifies records. Required fields: `id`, `title`, `kind` (`source`, `page`, `meeting`, `case`, `decision`), `state` (`inbox`, `review`, `published`, `archived`). Sources add `revision`, `url`, `author`, `created`. Other records can include `sourceRefs: [{id, revision, passage}]`, `related` page IDs, `project` ID, `area`, `tags`, `provenance` (`source`, `inferred`, `ambiguous`), `userNotes` and review timestamps.

For source identity, normalize http/https URL, strip fragments/tracking parameters and sort query parameters. A source without URL is keyed by its text digest. Only the original text determines the revision. Title/author corrections to an existing exact snapshot do not replace it. Changed local source text is excluded from the knowledge index with a visible error; re-capture the corrected text as a new revision. Metadata is not cryptographically signed and an expert can alter files outside the plugin.

Drafts include `targetId` and `baseHash` when updating a page. `baseHash` is SHA-256 of the full page as it existed when the draft was prepared. Approval rejects a stale target or draft, preserves unknown target metadata and userNotes, writes the page, and archives the accepted draft. The source snapshots remain unchanged. Citation/version existence is checked; review remains responsible for whether claims are actually supported.

Published bodies contain a generated section between `<!-- knowledgeflow:links:start -->` and `<!-- knowledgeflow:links:end -->`. It links actual source/page files using Obsidian wikilinks. It is rebuilt on publish. Do not place personal content inside this generated block. Personal notes belong in Your annotations or outside the block. Files keep stable IDs when titles change.

Before an existing knowledge record changes, a history file preserves its old full Markdown. A published page's History dialog can load prior text as a NEW draft against the current revision; source selection and explicit approval still apply. Current personal annotations are kept. This is page revision recovery, not full-vault backup restoration. Old histories and operation logs are not silently pruned.

Writes are serialized within one plugin instance, use Vault.process for existing files and optimistic checks, and attempt conditional rollback when an operation throws. Newly created files from a failed operation go to Obsidian's trash. Concurrent external modifications are never deliberately overwritten during rollback. A process crash, sync race or power failure can still leave partial changes. Audit entries record operations and paths, not proofs of atomicity. Use normal independent backups for later real-vault use.

The index is rebuilt in memory from owned records. No database, embeddings, global vault scan for content, or generated index.md is required. Search does not search arbitrary legacy notes. Attachments and external web fetching are outside 1.0.
