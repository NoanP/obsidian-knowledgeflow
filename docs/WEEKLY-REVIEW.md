# Weekly knowledge review (1.15)

The Weekly review tab under Knowledge & sources and the Open weekly knowledge review command open a live overview. It defaults to the current Monday–Sunday week. Choose any date to select its calendar week; Current week returns to today. Dates/timestamp conversion use the running device local calendar, with noon-based day navigation across DST. This is an on-demand view, not a background scheduler, notification or archived weekly report.

## Four sections

- New knowledge: currently published owned pages whose stored created date is in the selected week, falling back to reviewedAt only when created is unavailable/invalid.
- Updated knowledge: other currently published pages whose updated date (or reviewedAt fallback) is in that week. Each page appears in only one of the two groups. These are metadata-based dates, not a generated claim about what you learned or a full change history.
- Open inbox notes: the current open personal inbox across all creation dates. Oldest dated items come first. Processed and archived inbox notes are excluded.
- Pending approvals: current review drafts from the owned drafts folder across all creation dates. These remain visibly unreviewed and are never treated as new published knowledge.

Selecting a previous week changes the date-based knowledge sections only; backlog sections explicitly remain current. Archived/deleted knowledge is not reconstructed as a historical snapshot. Missing dates are disclosed rather than guessed from file modification times. Original notes remain unchanged, and an empty section is not a claim that no other work happened.

A project filter scopes the content sections. Global interrupted journal operations and unreadable records remain visible regardless of project. Existing Change log and Knowledge quality views handle those checks; this overview does not automatically resume or repair anything.

## Actions and safeguards

Original-note actions verify exact full-record hashes and current collection membership. Inbox assistant and draft-review buttons revalidate before opening the existing workflows. Those workflows retain their separate previews/approvals; opening the overview approves nothing. A changed/deleted/processed item requires reloading rather than acting on a stale report.

The ordinary knowledge scan and Reload review refresh the live overview. No review-completion flag, saved report, new source, task, tag, link, settings change or provider call is created. Draft/inbox excerpts remain local, literal previews, separate from published insights. Unimported outside note bodies and raw sources are not scanned for supposed new insights. Pending journal targets retain the existing quarantine behavior.

At most 1,000 eligible records and four million full-record characters are processed. Each section initially displays 12 entries with Show more. Ambiguous identities, invalid files, undated published records and bounds are disclosed. These are content-processing limits; the existing knowledge refresh retains its normal owned file reads. There is no semantic summary or automatic determination that a draft/question is resolved.

Repository-only release, validated with synthetic data. TaskFlow and real Obsidian systems remain untouched; native YAML/sync/mobile acceptance is separate.
