# Graph research and decisions — 2026-11-24

This is a design synthesis, not a benchmark of the cited products. No external plugin is installed or copied into KnowledgeFlow. Only public documentation was consulted; implementation is original within this repository and reuses its own 1.1 graph data model.

| Source | Documented behavior | KnowledgeFlow 1.2 adaptation |
| --- | --- | --- |
| [Obsidian Graph view](https://obsidian.md/help/plugins/graph) | Note-sized nodes, link highlighting, search and orphan controls; local graphs have adjustable depth. | Size by visible degree, select/hover highlighting, source/orphan filters, a local depth selector. |
| [Juggl Workspace mode](https://juggl.io/features/workspace-mode/workspace-mode.html) | Expand/collapse neighbors and focus a selected neighborhood. | Explicit Neighborhood/Whole network controls with 1–3 link steps. We do not implement Juggl's full saved workspaces or radial menu. |
| [Juggl Filtering](https://juggl.io/features/filtering.html) | Query-based graph filtering, with documented syntax limitations. | Plain multi-term title/body/tag/area search and explicit connection-type toggles. No claim to support its complete query syntax. |
| [Apoo711 3D Graph](https://github.com/Apoo711/obsidian-3d-graph) | Spatial graph interaction, focus/highlight, display controls and physics cooling; uses a separate rendering/physics stack. | Real 3D coordinates, orbit/pan/zoom, sparse labels and idle rendering. We do not copy its Three.js/Rust/WASM stack or adopt its performance claims. |

## Why this design

The global graph provides orientation; the local graph provides a way to investigate one idea without seeing every line at once. That is our design inference from these documented interaction patterns, not evidence that 3D is inherently better for every knowledge task.

We therefore retain sources, actual links and the normal knowledge view as the reliable navigation/data layer. 3D exploration is read-only. Same-tag/project membership does not create edges or pretend to establish evidence. Every node opens an existing owned Markdown note. Drafts, archived records and unrelated vault notes are excluded.

## Layout and interaction

The user's requested 90/10 split is interpreted vertically on desktop: approximately 90% network workspace (including compact controls), 10% eight navigation tiles. Narrow and short windows relax the split for reachable controls. Home contains no task lists or day-statistic charts.

Real x/y/z force layout and perspective projection are rendered using Canvas 2D. Nodes are depth-sorted, farther nodes are visually smaller/fainter, and camera orbit changes actual perspective. This avoids a runtime library, remote code, GPU setup or a continuously running simulation. It is not an assertion of performance parity with a GPU/WASM implementation. The scene limit is 240 nodes; the source model limit is 500. Omitted counts are shown. Physics runs only to establish bounded, cached coordinates, and frames are requested on input/resize rather than continuously.

Default labels are limited to hovered/selected notes. Optional additional labels are distance/overlap limited. Filters expose sources, unlinked notes and connection types rather than adding mandatory colors to the existing neutral design. A note selector, details panel and keyboard controls keep the network navigable without precision mouse targeting.

## Follow-up validation

Use an explicitly approved disposable Obsidian vault to validate host styling, multiple windows, actual mobile touch, persisted lifecycle and realistic collection size later. Until then browser/DOM simulations and math/storage tests define the tested scope. No existing vault, original TaskFlow repository or Obsidian installation is modified by this release.
