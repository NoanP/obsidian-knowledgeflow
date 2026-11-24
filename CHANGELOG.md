# Changelog

## [Unreleased]

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
