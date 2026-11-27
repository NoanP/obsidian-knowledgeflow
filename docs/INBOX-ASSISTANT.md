# Inbox assistant (1.13)

## Deliberate organization

Open Knowledge & sources → Note inbox → Inbox assistant on an open personal note. The existing quick-capture and editing actions remain available. The assistant does not start automatically or invoke an AI provider.

All suggestions are initially unchecked. Review the reason and select only useful changes:

- Title: first Markdown heading, otherwise first nonempty text line; editable before preview.
- Note type: page, meeting, case or decision. Explicit structural headings suggest a more specific type; otherwise page is the fallback. You can choose another type.
- Topics: up to six candidates from explicit hashtags, existing published-note tags literally present in the text and repeated nontrivial word forms. Existing topics are never removed. Suggested tags are lowercase with spaces converted to hyphens; Unicode letters, accents and ß are preserved.
- Connections: existing local lexical suggestions, with paired exact excerpts available under each candidate. Targets are published, owned and unambiguous notes. Nothing is linked from project/tag similarity alone.
- Optional section copies: offered for notes of at least 400 characters containing two to six level-two Markdown headings outside code/comments. This is a structural split, not a semantic rewrite. The first child includes any preamble, and the exact contiguous slices cover the complete original text.

Open change preview writes nothing. It shows before/after title, type, topics and connection count, names selected targets, retains the original text for inspection and lists every additional section note with its complete text and resulting metadata. Close without changes cancels. Back to fresh suggestions discards the pending choices and reloads current versions.

Only Approve reviewed changes saves the frozen preview. The original body is unchanged. Existing project, annotation, unknown frontmatter and unrelated fields are preserved. The note stays open in the inbox, outside published knowledge, answers and graph. Nothing becomes a real task.

## Types, topics and section provenance

Personal inbox records keep `kind: page`; the chosen future knowledge type is `noteKind`. When Prepare knowledge draft is later opened, this type is selected by default and remains editable. Existing/approved topics and relations carry into the review draft. Knowledge publication remains a separate approval.

Section copies are new open inbox records with stable UUID-shaped IDs derived from the original version and exact offsets. Each has its heading as title, type page, the resulting original topics, no project and no connections. The original is retained in addition to all section copies. One original note can approve this splitting operation only once; later edits never silently regenerate the children.

`inboxOrigin` on each child records original note ID/path/full-record hash, exact offsets and body hash. `inboxSplit` on the parent records child IDs and matching offsets/hashes. These describe the creation snapshot; later deliberate child edits do not rewrite the original. The original note receives an `inboxAssist` approval key/time. No separate queue/proposal files are created simply by opening the assistant.

## Reliability and boundaries

Preview pins the original and selected target snapshots. Approval rechecks exact current files, target states and unique identities before persisting a constrained write-ahead plan. Only approved title/noteKind/topic additions, selected related IDs, approval metadata and optional exact new children can be written. Source snapshots and target notes are never modified. History preserves the complete prior original; the audit and plan retain the selected operation.

Stable approval/child identities prevent duplicate clicks and identical restart retries from creating copies. A changed original, selected target, colliding filename or edited approved child blocks stale approval instead of overwriting it. Interrupted operations quarantine all affected inbox records and block new knowledge writes until Change log is explicitly reviewed and resumed. Recovery checks frozen snapshots and constrained outputs rather than rerunning future suggestion rules. There is no cross-device locking or crash-proof filesystem atomicity claim.

Suggestions are explainable local rules, not semantic classification or factual validation. Capture retains the existing 20,000-character body limit; topics retain the 30-tag limit, relations the 50-target limit. Connection matching retains its disclosed 400-note/2M-character/eight-candidate limits. Unselected suggestions remain transient and cause no automatic provider cost.

This is a repository-only release. Existing TaskFlow and real Obsidian vaults, installations, settings and plugins remain untouched. Native Obsidian YAML/sync/mobile validation requires a separate authorized test.
