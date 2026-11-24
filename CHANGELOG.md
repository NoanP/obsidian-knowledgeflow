# Changelog

## [Unreleased]

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
