# Automatic topic hubs (1.14)

## Open and explore

Knowledge & sources has a Topic hubs tab and an assignable Open topic hubs command. The existing homepage, eight action tiles and Synapsenraum remain unchanged. Hubs are a view of existing content; opening them creates no files, settings, tags, links or tasks and makes no provider request.

The navigation derives hubs from existing tags, areas and project IDs on owned published notes and active captured sources. Case/accent aliases are grouped once per record. Project display names follow the existing project settings; a retained ID stays usable if a project name is unavailable. All knowledge is an overview for unclassified content. The sidebar filters locally and initially shows 40 hubs with a Show more action.

Selecting a tag hub includes explicit tag assignments and literal title/text matches, labeled distinctly. Area and project hubs use their declared properties, with no guessed membership. A separate project filter restricts notes to that project; exact sources cited by those notes remain available even if the source has no project metadata. Other unassigned source matches are excluded by that filter.

A free-term query explores up to twelve meaningful words, using the existing light German/English normalization. All terms must occur across title/checked text; this is lexical matching, not embeddings or semantic understanding. Custom queries, selection, project filter and pagination belong to the open view. They are not saved custom topic definitions. To make a durable hub, use the existing reviewed tag/area/project properties. New knowledge changes update the view through the normal plugin scan; Reload topics refreshes immediately.

## Four groups and provenance

- Notes: published pages, meetings and cases in KnowledgeFlow/Wissen/Seiten.
- Decisions: only the explicit decision kind, never a guessed conclusion or a title containing the word decision.
- Sources: exact source ID + revision cited by matched notes/decisions, deduplicated with their referring note titles. An archived source is shown only when that exact version is referenced. Active captured sources may also match the topic directly and are labeled as source content, not automatically published knowledge.
- Open questions & points: literal excerpts from explicitly named open sections or unchecked question checkboxes in matched content. No questions are generated, answered, marked complete or converted to tasks.

Source revisions are SHA-256 checked. Missing/ambiguous/out-of-bounds references are reported; another version is never substituted. Related source content is provenance, not an automatic factual endorsement. Every card explains membership and opens a pinned passage; the passage can then open the original note. Evidence actions recheck the collection and exact record text, rejecting stale excerpts rather than opening them as current evidence.

The existing selected active chat branch is respected: imported JSON is rendered through the active transcript, and raw alternate branches/JSON field names never become matches or quoted evidence. Inbox records, review drafts, archived non-source knowledge, histories, journals, tasks and unimported outside note bodies are outside hub content. Open personal inbox topics appear in hubs only after their note is separately published.

## What counts as an open question

Recognized headings include Offene Fragen, Offene Punkte, Ungeklärte Fragen, Open questions and Unanswered questions. Under those headings, question lines and bullet points are included until a heading at the same or higher level closes the section. A normal unchecked Markdown checkbox containing a question mark is also included outside those sections. Completed checkboxes, fully struck-through lines, code and comments are excluded. Original CRLF text and exact offsets remain intact.

A question placed in an open section may have been answered elsewhere; the view cannot determine that semantically. It remains a literal open marker to review. Questions inherit their parent note/source topic context rather than a generated interpretation.

## Limits and freshness

The in-memory index is reused while the owned knowledge snapshot is unchanged and released at plugin unload. Changed note text, metadata, sources or membership rebuild it. Navigation uses stale-render guards, and passage actions reject an old corpus after refresh.

The index checks up to 500 records and four million full-record characters, preferring published notes before sources. Matching/question extraction uses the first 20,000 text characters per record, including annotations within that budget. The catalogue lists up to 200 distinct hubs plus All knowledge. Question extraction is capped at 20 per record and 200 per view; groups initially show 12 entries with Show more. Truncation, omitted topics, ambiguous/corrupt content and unavailable source references are disclosed. These are content-processing bounds; the existing owned knowledge refresh retains its normal file-reading behavior.

This release adds no persistent hub schema or automatic content changes. Existing TaskFlow and real Obsidian vaults/installations/settings remain untouched. Automated fixtures and the in-memory browser host validate the repository; native Obsidian/YAML/sync/mobile acceptance is separate.
