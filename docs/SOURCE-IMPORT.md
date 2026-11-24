# Selected-source import (1.5)

## Use

Open **Wissen & Quellen → Quellen importieren**. Search and select note filenames or choose export files. Note bodies are read only when you request a preview; filename listing uses vault metadata. Hidden paths and KnowledgeFlow's own knowledge folders are excluded from note selection. The plugin never automatically imports TaskFlow or any other vault content.

Review each candidate's content, origin, date basis and duplicate/revision status. Select up to 20 sources and choose **Ausgewählte Quellen importieren**. Source snapshots enter the inbox; no tasks, published claims or AI calls are generated. Originals remain untouched. Selected vault notes are checked again against their preview hashes before confirmation. Inputs are treated only as data and never as instructions.

Changing the selection or metadata invalidates the visible preview. Closing the modal cancels an unconfirmed preview. Private previews expire after 30 minutes; at most three are retained in memory. Closing a modal after starting an import does not promise cancellation of already-authorized writes.

## Supported input

| Input | Snapshot and text view |
| --- | --- |
| Selected vault `.md` | Full, exact note text, including frontmatter, whitespace and line endings. No frontmatter commands are executed or copied into source metadata. |
| Local UTF-8 `.md` / `.txt` | Exact decoded text, including BOM and line endings. Invalid UTF-8 is rejected. |
| ChatGPT conversation JSON | Root conversation object, array, or `conversations` array whose entries contain `mapping`. Follows `current_node` backwards through parents for the text view; a missing active node is accepted only for an unambiguous single-leaf tree. |
| Claude conversation JSON | Root conversation object, array, or `conversations` array whose entries contain `chat_messages`. Uses `sender`, `text` or text content blocks, and message dates. |
| KnowledgeFlow Chat v1 | Explicit `knowledgeflowChatExport: 1` wrapper with `conversations`; each has optional stable string `id`, title/date and `messages` with role/content/date. |

A chat source body is canonical, key-sorted JSON for the **selected conversation**, preserving parsed export fields and alternative branches. It is not a byte-for-byte archive of the original file: JSON formatting, duplicate keys and number representation are subject to ordinary JSON parsing. Keep original exports for exact archival fidelity. The original selected file's UTF-8 SHA-256 is retained for provenance.

The readable ChatGPT view shows the active branch. Other branches stay in the JSON snapshot and can appear in the raw source supplied to a later explicitly requested AI work prompt. Claude and exchange-format views retain message order. Non-text content is retained as JSON metadata when present; attachments, images, linked pages, voice and other external files are not loaded. Unsupported conversations get explicit error rows; valid conversations can be selected independently. Invalid JSON rejects that file, not unrelated valid inputs.

ZIP, HTML, PDF, Gemini exports and arbitrary JSON/message schemas are outside this release. Extract ZIPs and select conversation JSON files, including separate numbered files where applicable. No provider login, export download or account access is added.

The provider help pages confirm export availability but do not define a stable JSON schema; adapters here cover the structures above and synthetic test fixtures, not every historical/future export:
- [OpenAI export help](https://help.openai.com/en/articles/7260999-exporting-your-chatgpt-history-and-data)
- [Claude export help](https://support.claude.com/en/articles/9450526-export-your-claude-data)

## Provenance and dates

Every imported source records its author/origin label, selected vault path or external filename/provider, input-file digest and import timestamp. A chat's stable conversation ID and readable message count are retained. Labels are local metadata; they are not proof of authorship.

Conversation creation dates take precedence. For text files and vault notes, available modification time is explicitly labelled **file modified**, not asserted as creation time. An optional user-specified date fills unknown dates only. Missing/invalid dates remain unknown; import time stays separate. Datetimes normalize to ISO UTC, while user date-only values retain their calendar date. Embedded YAML dates are not guessed. Message timestamps are shown when recognized; raw export values stay in the snapshot.

## Duplicates and versions

- Exact source-body SHA-256 is compared with valid existing sources and within the current selection. No fuzzy or semantic deduplication is claimed. Whitespace/line-ending differences in text count as content differences.
- Existing exact matches are skipped and linked in the preview. Confirmation rechecks duplicates, including sources captured since preview. If every selected source already exists, nothing is written.
- When several candidates have identical content, choose the representative whose provenance you want to keep. Importing both keeps the first selected candidate in preview order and skips the rest. Skipping a duplicate does not add another origin to, or alter, the existing immutable source.
- A selected vault note path or stable provider/conversation ID establishes an identity. Changed content creates a new immutable revision under that identity. Renamed notes with identical content match the existing snapshot by hash.
- External text files and chats lacking an ID are content-addressed. Changed content becomes a new source; a filename alone does not prove that two files share an origin.
- Corrupt existing target snapshots are reported as conflicts, never overwritten.

## Limits and recovery

At most 10 external files, 8 MiB per file, 16 MiB combined decoded UTF-8 input, 200 preview conversations/candidates and 20 confirmed sources per batch. A source body is limited to 1 million characters; message traversal is bounded. The existing journal has an additional 16-million-character plan limit, including escaping and metadata: reduce the selection if a large batch exceeds it. No partial oversized batch is silently imported.

One selected batch uses the existing write-ahead journal. Interrupted outputs remain unindexed until reviewed recovery; originals are never rollback targets. See [RECOVERY.md](RECOVERY.md). Preview errors are not imported. Confirmed operations retain source provenance in immutable metadata and their journal snapshots; skipped-only previews are not persisted as extra reports.

## Exchange example

See [the synthetic example](../preview/import-example.json):

```json
{
  "knowledgeflowChatExport": 1,
  "conversations": [{
    "id": "example-chat",
    "title": "A selected conversation",
    "createdAt": "2026-11-24T09:00:00Z",
    "messages": [
      {"role": "user", "content": "A question"},
      {"role": "assistant", "content": "An answer"}
    ]
  }]
}
```

All import previews use plain text rendering. Opening a raw Markdown source later uses Obsidian's own rendering and normal vault behavior. This release is repository-only; native Obsidian/mobile testing and real export variants need a separately authorized pilot.
