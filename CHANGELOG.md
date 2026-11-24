# Changelog

## [Unreleased]

## [1.8.0] - 2026-11-24

### Added
- Bidirectional knowledge/work navigation: published notes show linked tasks and their project; projects list linked published notes; task cards expose knowledge links. Completed tasks remain visible as backlinks; trashed/superseded/skipped tasks are excluded.
- Read-only suggestions from unchecked checklist lines in selected or published owned knowledge. Individual review shows a pinned literal passage and editable task title, project, priority, due date and notes. No automatic task creation, date inference, assignments or provider calls.
- Create-only approval transactions with immutable plans, exact note/source dependency hashes, project snapshots, audited completion receipts and existing explicit recovery UI. Partial task outputs are withheld until recovery completes.
- Stable approval identity across repeated clicks, reloads, edits, archive and trash; same-title open tasks in the chosen project block accidental duplication. Existing notes and source snapshots remain unchanged.
- Task editor shows approval provenance and can verify the original passage against its recorded version.

### Boundaries and validation
- 252 automated tests pass, including stale notes/sources/projects, forged passages, concurrent approvals, response loss after writes/receipts, reviewed recovery, path collisions and untouched outside content. Isolated in-memory browser acceptance checks the actual review and relationship workflow.
- Suggestions are temporary review candidates, limited to 100 notes and 200 unique checklist candidates per window. Hiding is session-only; arbitrary prose/semantic action extraction and persistent rejection queues are not included.
- Approval identity normalizes a checklist title within its note path/ID; duplicate equal lines are one candidate. A renamed action or moved note may become a new candidate; title checks are conservative, not semantic deduplication. Permanent removal of both the task and its provenance can permit regeneration.
- Only suggestion creation joins the journal. Ordinary task/project/settings changes keep their existing behavior. No cross-device locking or filesystem atomicity claim.
- Repository-only release; no TaskFlow or Obsidian changes. Native Obsidian/mobile and real-vault acceptance remain separately scoped.

## [1.7.0] - 2026-11-24

### Added
- Read-only knowledge quality report under Knowledge & sources → Health, with manual checks, category filtering, candidate counts, bounded pagination and scope disclosures.
- Missing/ambiguous source and page references, Wiki/Markdown file targets, owned heading/block references and explicit unverified/external cases. Code, comments, generated links and escaped examples are excluded.
- Similar-passage candidates based on shared five-word sequences, with exact pinned excerpts from both records. Related note/source copies and explicit source revisions are labelled separately.
- Possible conflicts for narrow opposite-status and numeric templates with matching recognized project/area/heading/condition context. Both statements remain visible; no winner is chosen.
- Freshness checks for collection/catalog changes and file hashes before evidence inspection/opening. Outside link targets use filename metadata only, without reading unimported note content.

### Boundaries and validation
- Possible conflicts are review candidates, not semantic contradiction or truth judgments. Chats, arbitrary paraphrases and unsupported numeric/unit forms are not automatically classified as contradictory.
- 230 automated tests cover link parsing/resolution, protected outside content, exact evidence, similar copies, contradictory/same-context patterns, conservative exclusions, versions, stale reports and explicit bounds.
- Isolated browser verification confirms category filters, paired conflict/similarity excerpts, broken-link evidence and opening the correct owning note with synthetic in-memory data.
- No automatic repairs, merges, edits, external calls or persisted quality reports. Existing missing-source, same-title and ambiguous-claim checks remain available.
- Repository-only release: TaskFlow and Obsidian remain unchanged. Native Obsidian/mobile semantics and real-vault precision require a later explicitly authorized pilot.


## [1.6.0] - 2026-11-24

### Added
- Read-only Wissenssuche / Ask knowledge tab and command, using local lexical passage ranking across owned published notes and valid source snapshots. Scope to notes, sources or both.
- Up to six verbatim answer passages, exact full-record hashes and section offsets, inspectable citations and note/source links opening in a new tab after freshness checks.
- Separate recorded source references, original revision identity, personal-annotation labels, inference/ambiguity warnings, missing/ambiguous source references and newer/multiple source-version notices.
- Explicit no-result/partial-match handling, title-only discovery links separated from answer passages, bounded indexing, copied-passage deduplication, active-branch chat text retrieval and content-sensitive in-memory index reuse.

### Boundaries and validation
- 206 automated tests pass, including exact quotes/offsets, stale links, read-only operation, untrusted input, missing evidence, contradictory passages, source versions, chat branches, cache invalidation and explicit search limits.
- A fixed synthetic retrieval set returns the expected topic in the first three passages for 10 questions and abstains on two absent topics. This is not a real-vault quality benchmark.
- Answers are extracted text, not free-form AI synthesis. Source links establish provenance, not automatic claim support. No provider calls, query-history storage, publishing or automatic contradiction/truth verification.
- Isolated browser verification confirms excerpt rendering, separate title discovery, source links, exact passage inspection, note/source opening and explicit no-evidence results.
- Repository-only release: TaskFlow and Obsidian remain unchanged. Native Obsidian/mobile behavior and real-vault retrieval quality need a separately authorized pilot.


## [1.5.0] - 2026-11-24

### Added
- Central selected-source import from Knowledge & sources: explicitly chosen vault Markdown notes, UTF-8 Markdown/text files, ChatGPT/Claude conversation JSON and a documented KnowledgeFlow Chat v1 exchange format.
- Read-only preview with per-conversation selection, source origin/author, source date and its basis, separate import time, original-input SHA-256 and exact-content duplicate detection against existing sources and the current batch.
- Immutable new revisions for changed selected note paths or stable conversation IDs. New sources stay in the inbox and require the normal draft/review/publish workflow.
- Active-branch ChatGPT text previews, Claude text/block previews and retained canonical per-conversation JSON. Unknown formats, ambiguous/broken branches, unsupported non-text parts and missing dates are disclosed.
- Guarded file decoding, bounded previews/imports, stale-note detection, expiring private preview plans and recovery through the existing persistent journal.
- Synthetic chat example and selectable note examples in the isolated preview. No external provider calls, live chat recording, attachment fetching, original-file edits or automatic TaskFlow import.

### Validation
- 184 automated tests pass, covering selected-only reads, immutable originals, provenance/dates, exact duplicates, revisions, branch order, parser errors, UTF-8/BOM, stale/expired previews, concurrent confirmations and interrupted batch recovery.
- Isolated browser verification includes a real synthetic-file chooser, note/chat preview, duplicate disclosure, conversation deselection and exact selected-source import.
- Native Obsidian/mobile and real provider-export variants require a later explicitly authorized pilot. This release changes the KnowledgeFlow repository only.


## [1.4.0] - 2026-11-24

### Added
- Persistent knowledge write-ahead plans with exact before/after snapshots, SHA-256 checks, source dependencies, a vault/root identity and sealed completion receipts.
- Knowledge & sources → Change log, with readable version previews, pending/completed status, explicit preview-bound recovery and loading prior published text as a new draft.
- Read-only restart discovery. Pending/invalid journals block knowledge writes; partial records are excluded from the knowledge index and a home notice leads to recovery.
- Local per-Vault writer serialization, safe path/duplicate checks, create-only new files, exact expected-text checks inside Vault.process and final output/dependency verification.

### Changed
- Interrupted knowledge operations now retain files and persisted snapshots for reviewed continuation. They no longer attempt destructive rollback or remove newly created files. Matching outputs are skipped during recovery; divergent external changes are preserved and block continuation.
- This upgrade covers knowledge operations. Task, recurrence, project-setting and trash workflows are unchanged. Historical logs and page versions remain readable.

### Validation
- 163 automated tests, including 14 injected interruption points around publish writes, reload/recovery, repeat recovery, stale previews, conflicts, source dependencies, corrupt journals, receipts, path constraints and concurrent writes.
- Isolated in-memory browser verification of the log, snapshot review and interruption/recovery. No changes or installation in Obsidian or TaskFlow.
- Restart recovery depends on the files actually persisted by the Vault API. This is not filesystem-level atomicity, power-loss protection, cross-device locking or a full-vault backup.


## [1.3.0] - 2026-11-24

### Changed
- Implemented the approved cosmic homepage: quiet dark background, small translucent navigation tiles and daily welcome on the left, interactive 3D knowledge network on the right.
- Added a local rotating daily thought and time-aware greeting in German and English. The thought is editorial guidance, not an AI assessment of private notes; no network calls or new stored data.
- Added a decorative warm light core and subtle stars, reduced node sizes and showed sparse hub labels. Decorations never become notes, links or counts. Empty networks remain honestly empty.
- Moved search, note selection and graph filters into a compact expandable explorer. Existing orbit, zoom, keyboard controls, neighborhood navigation and note opening remain available.
- Added narrow-pane stacking and small-screen navigation. The homepage has a fixed dark presentation; other workspaces retain their existing preferences.

### Validation
- Automated checks and isolated in-memory preview; no Obsidian or TaskFlow installation changes. Native Obsidian/mobile interaction and production-scale performance remain separate validation tasks.


## [1.2.0] - 2026-11-24

### Changed
- Replaced the 2D homepage graph with a real-coordinate 3D scene: deterministic spatial force layout, perspective projection, depth sorting and sphere/ring drawing on Canvas 2D. No external rendering dependency or CDN.
- Homepage now uses an approximately 90/10 vertical split between the graph workspace and eight action tiles. Daily tasks, day statistics, favorites and additional-task sections are not rendered there. The underlying task/statistic functions remain accessible through navigation.
- Reduced default label density, highlighted actual neighbors and added title/body/tag/area text filtering, source visibility, unlinked-note visibility and connection-type filters.

### Added
- Local neighborhood exploration at depth 1–3 and return to the global network, inspired by Obsidian local graphs and Juggl workspace navigation.
- Pointer orbit, Shift/middle-drag pan, wheel/pinch zoom, click/tap selection, double-click/tap open, keyboard orbit/fit/open and accessible note selection.
- Bounded layout (240 visible scene nodes, 500 base graph nodes), omitted-count disclosure, cached coordinates, on-demand frames, high-DPI drawing and observer/frame cleanup.
- Research notes with source links and implementation boundaries. Replaced retired 2D layout tests with 3D math, filtering, picking, lifecycle and homepage-content checks.

### Validation
- 150 automated tests pass; isolated browser preview visually confirms graph-first layout and removal of day widgets. Renderer selection, neighborhood interaction, orbit and cleanup are also exercised by the in-memory DOM/Canvas host test.
- No installation or modification in Obsidian. Native Obsidian/mobile interaction and large-vault performance remain unverified. TaskFlow is unchanged.

## [1.1.0] - 2026-11-24

### Added
- Read-only knowledge network directly on My Day, above daily tasks and the eight existing function tiles.
- Size-by-degree nodes and thin neutral lines based on actual related-page links, exact source revisions and resolvable wikilinks. No links inferred from shared tags or projects.
- Node selection highlights neighbors, displays a note excerpt and allows opening its original Markdown note. Double-click opens a node; keyboard and native select provide alternative navigation.
- Search highlights matching nodes, source visibility toggle, zoom buttons, pan by dragging, automatic fit/reset and expandable graph panel.
- Graph shows only published KnowledgeFlow notes and optionally its source snapshots. Drafts, archives, tasks and other vault notes remain excluded.
- Deterministic bounded layout, cached coordinates and explicit 180-node display cap (most connected first). Hidden-note count is shown; graph does not load or rewrite arbitrary vault files.
- Synthetic graph fixtures in the isolated browser preview and tests for ownership, actual edges, source revisions, ambiguous links, code examples, node limits, layout and fitting.

### Validation
- Automated tests plus isolated browser preview. No installation in Obsidian, no source-data changes and no changes to TaskFlow.

## [1.0.0] - 2026-11-24

### Added
- Independent KnowledgeFlow Obsidian plugin and release pipeline; own plugin ID, view, CSS namespace, settings and KnowledgeFlow/ data root.
- Source capture with URL normalization, SHA-256 snapshots, exact text preservation, duplicate detection and version-pinned citations.
- Knowledge, sources, review, health and archive views; full-text search with excerpts, project and area filters.
- Knowledge-page, meeting, solved-case and decision drafts with source selection, provenance and related pages.
- Separate before/after review and explicit publish; imported AI proposals never auto-publish or create tasks.
- Local AI work-request preparation from selected sources, with visible context-size omissions, plus validated JSON proposal import. No provider, network calls or embedded AI chat.
- Personal annotations, prior-version snapshots and loading prior text as a new review draft.
- Source-change, missing-source, missing-related-page, ambiguous-claim and duplicate-title checks. These checks do not establish truth.
- Generated Obsidian wikilinks to sources and related pages, project knowledge access, and knowledge links on tasks.
- Serialized knowledge writes, stale-edit protection, conditional error rollback and per-operation Markdown audit records.
- Isolated browser preview with synthetic in-memory data, knowledge tests, reusable templates and assistant rules.

### Based on TaskFlow 0.17.3
- My Day with interactive tasks, day statistics and eight function tiles; separate knowledge entry.
- Kanban, projects, calendar/time blocks, recurring tasks and series editing, filters, subtasks and notes.
- Task archive and trash, automatic archive on completion, detailed appearance/settings and German/English interface.
- TaskFlow's MIT notice and attribution retained. Original repository and all existing Obsidian installations are unchanged.

### Scope and validation
- No automatic migration, Web Clipper installation, external calendar sync, OS reminders, semantic search or background AI.
- No deployment into any Obsidian vault. Initial validation uses automated tests and a browser host simulation; native Obsidian/mobile validation remains outstanding.
