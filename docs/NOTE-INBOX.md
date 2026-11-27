# Quick capture and personal note inbox (1.11)

## Capture

Home has two small text actions above the existing eight navigation tiles: Quick note and Note inbox with the open count. No New task button is added outside Board. Capture also has an Obsidian command and an inbox button. There is no operating-system-wide capture service or default hotkey; bind the command through Obsidian Hotkeys if desired.

Only text is required, up to 20,000 characters. An optional title supports 240 characters; otherwise the first nonempty line becomes a short title after removing an initial Markdown heading/bullet/checkbox marker. This normalization never rewrites the body. An active project is optional and does not create or alter project tasks. ⌘/Ctrl + Enter saves from the capture text area.

A newly opened capture writes nothing. Closing it or choosing Continue later keeps the draft in session memory until plugin unload; Discard unsaved text explicitly clears it. This buffer is not a durable autosave. Saved notes survive restart. An edit is separate: Cancel/closing discards its unsaved changes; validation/conflict failures keep the editor open for copying or correction.

## Process deliberately

Open Knowledge & sources → Note inbox, or the direct Home action. The inbox defaults to open notes, with local text search and project/status filters, full original text disclosure and pages of 40. Open notes can be edited or assigned to an active project. Archive is reversible and does not delete Markdown files. Processed notes remain visible under Processed; archiving/restoring one retains its processed identity.

Prepare knowledge draft shows the exact body, editable draft title/type/project and what will be written. Only Save source and draft for review commits:

1. An immutable, content-hashed personal text source, reusing an exact existing text source snapshot where possible.
2. One source-pinned review draft (page, meeting, case or decision), with interpretation provenance.
3. The original inbox note, retaining its body and unknown metadata, marked processed and linked to source revision and draft ID.

These are a single journaled transaction. No published note or real task is created. Review/publication and any checklist-to-task approval remain separate, explicit actions. Before this conversion, personal notes are excluded from the normal knowledge list, source picker, knowledge answers, quality checks, task suggestions and network. Nothing invokes an AI provider or imports outside files.

## Data and reliability

Each note uses `KnowledgeFlow/Wissen/NotizInbox/<UUID>.md`, the existing `knowledgeflowKnowledge: 1` marker, `kind: page`, `quickNote: 1` and `inboxStatus: open|processed|archived`. The knowledge state is inbox for open, archived otherwise. Source references remain empty on personal notes. Created/updated times and optional project ID accompany exact body text. A processed note stores `quickConversion` with draft ID, source ID/revision and request hash. A linked draft may later be published; Open associated draft opens its retained Markdown record rather than republishing it.

Each capture session has a stable ID, so repeated clicks/retries do not create a second note. Separate deliberate captures of identical text remain separate thoughts. Conversion uses a deterministic draft ID and request hash, making an identical repeated approval idempotent even after restart; changed conversion choices are rejected. All updates compare exact current text, preserve unknown fields and retain before-state history. A concurrent edit blocks the operation rather than overwriting it.

Capture, edit, archive, restore and processing use the existing persisted change journal. Pending targets are quarantined and new writes are blocked. Review an interrupted operation in Change log before explicitly resuming it. A source+draft partially written before failure is completed from the pinned plan; it is not silently retried as another capture. Recovery refuses changed targets/dependencies. There is no cross-device lock, automatic journal compaction or permanent-delete action for personal notes in this release.

## Delivery boundary

Repository-only delivery with automated tests and the synthetic in-memory browser host. Existing TaskFlow, Obsidian installations, vaults and hotkeys are untouched. Native Obsidian/YAML/sync/mobile acceptance remains a separately authorized test.

## Reviewed link suggestions (1.12)

Open notes can explicitly request related-note candidates, inspect exact passages and approve individual connections. Nothing is preselected or applied on opening. Approved related IDs survive conversion into a review draft, with graph edges visible only after separate publication. See [matching and recovery](LINK-SUGGESTIONS.md).

## Inbox assistant (1.13)

Open personal notes now offer an Inbox assistant with local title, future note type, topic and connection proposals, all unchecked. A separate complete change preview precedes explicit approval. Optional section copies preserve the exact original and retain creation provenance. Note type/topics/relations carry into the separately approved knowledge draft. See [the complete workflow](INBOX-ASSISTANT.md).
