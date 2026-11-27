# Rediscover knowledge (1.16)

Rediscover is a dedicated Knowledge & sources tab and command. The due list refreshes on opening, the normal collection scan and explicit refresh; calendar days determine eligibility. It is not a background scheduler, notification service, mastery test or global Obsidian reading-history tracker.

Six notes appear initially, with Show more in batches of six. Only owned, unambiguous published pages/meetings/cases/decisions qualify. Sources, inbox notes, drafts and archived pages are excluded. The existing bounded topic index supplies at most 500 records / 4M file characters with disclosed exclusions. A project filter scopes the list.

Ranking is deterministic: days since the last explicit review, otherwise the stored creation date, plus 14 days for importance. Unknown dates receive zero age rather than an invented old date. The card explains prior confirmation, importance and next-review date. Opening a note verifies the pinned passage but does not silently mark it read.

## Explicit controls

- Mark important / Remove importance changes only that flag and ranking. It does not immediately change an existing next-review date.
- Reviewed confirms today and schedules 30 calendar days, or 14 when currently important. This is a revisit interval, not evidence that you learned the content.
- In one week postpones the next appearance seven calendar days.
- Do not show again hides the note indefinitely without deleting it.
- Hidden notes lets you Show again, making it due today. All visible notes includes snoozed/future notes for managing importance.

Nothing is written on overview, filtering, pagination, refresh or original-note opening. Explicit feedback stores the reserved rediscovery metadata object on the published note: version, important/hidden flags, lastReviewed/nextReview calendar dates and action identity/time. Body, unknown frontmatter, annotations, tags, relations and knowledge created/updated/reviewedAt dates are preserved, so feedback does not become a new weekly insight. No graph edges, tasks or provider calls are created.

## Reliability

Each feedback operation validates the exact current collection and original record. A constrained rediscovery write-ahead plan permits only that metadata change plus history/audit records. Double clicks and identical retries are idempotent; later intentional toggles use a fresh record version. Stale notes/collection changes require reloading. Interrupted operations retain the existing quarantine and require explicit Change log recovery; concurrent edits block recovery rather than being erased. Malformed state is disclosed, never silently reset.

The intervals are fixed in this release. Saved preferences survive plugin restart through note metadata, while selection/project filters are view-local. No operating-system or remote scheduled reminder is installed. Native YAML/sync/mobile acceptance is separate from the automated and synthetic browser checks.

Only the KnowledgeFlow repository is released. Existing TaskFlow and real Obsidian installations, vaults and settings remain untouched.
