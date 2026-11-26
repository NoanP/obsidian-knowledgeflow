# Synapsenraum (1.10)

The approved Synapsenraum replaces the fixed galaxy visual on KnowledgeFlow's home. A charcoal canvas fills the workspace, with a small daily welcome/thought and eight quiet navigation tiles at the left. Daily tasks and statistics remain in their workspaces; New task remains a Board action. Narrow panes stack the navigation above the graph.

## Move the entire model

- **Drehen / Rotate**: drag to orbit the real x/y/z network. Arrow keys also orbit. Orientation has no old ±1.5-radian pitch clamp.
- **Verschieben / Pan**: drag or use arrows to move the whole network. Shift-drag, right-button drag, middle-button drag and Shift + arrows also pan. The camera translates every projected point equally; it is not tethered to a central object or bounded to its initial screen position.
- Wheel, +/− and two-finger pinch zoom. A two-finger gesture also pans by the finger centroid. Pointer cancellation/capture loss prevents a stale drag from continuing.
- Click/tap selects; double-click/tap opens the existing owned note. Selection highlights real adjacent links without changing camera position.
- **Zentrieren / Fit view** explicitly fits the scene. **Hier fokussieren / Focus here** explicitly sets the selected note as the orbit target. They are the user actions that realign the camera after first display.
- Escape clears selection; Enter opens a selected note. Use **Netz erkunden → Notiz auswählen** and the details panel when targeting a small point is inconvenient.

Selection, search, source/orphan/type filters, neighborhood depth, routine redraws, resizing and navigating to another workspace do not automatically recenter the model. Positions are computed against the cached base graph; filtering does not invent a new spatial layout. Changed data can therefore leave a few new points outside the chosen view until the user explicitly fits it.

The camera is retained in the current view instance across navigation, not saved to Markdown or plugin settings. New view instances/plugin restarts initialize a new camera. No source/user metadata migration is performed.

## What colors and edges mean

| Color | Explicit note kind |
| --- | --- |
| Pastel blue | Knowledge page |
| Dusty rose | Meeting |
| Sage | Case |
| Apricot | Source snapshot |
| Lavender | Decision |

Text labels, note details and the legend provide non-color context. These colors do not assert topic inference, truth or priority; task status/priority behavior is unchanged. Node size reflects visible connection degree with a bounded display size.

Only actual related IDs, exact source-revision references and unambiguous Wikilinks create edges. Same project/tag/kind alone creates no link. No decorative stars, core, particles masquerading as notes or synthetic production records are included. Real note counts determine how dense the graph looks; a small corpus is intentionally sparse.

The existing limits remain: up to 500 base nodes and 240 visible nodes, most connected first, with omitted counts disclosed. Search/neighborhood filters operate on that bounded base, not every unrelated vault note.

## Rendering and failure behavior

Native WebGL renders the real 3D positions using local shaders and the same perspective transform used for picking/labels. No external renderer package or network resource is loaded. A CPU perspective renderer uses the same x/y/z model when WebGL is unavailable. If no graphics backend works, the accessible selector and details still open notes. Context interruption preserves the camera and keeps selection available.

A deterministic force layout runs when base topology changes. Bounded integration/final radial normalization avoid artificial Cartesian clipping walls. Frames are requested on input/resize/data changes, not through perpetual rotation or running physics. Leaving the graph cancels pending frames/timers, disconnects observers/listeners and releases GPU buffers, shaders, programs and the old context.

Browser acceptance and automated fixtures cover these behaviors with synthetic data. Native Obsidian/mobile/driver coverage and unbounded-vault frame rates are not claimed. The graph is read-only and never calls an AI provider.

## Delivery boundary

Only the independent KnowledgeFlow repository/release changes. No existing TaskFlow repository, Obsidian vault, plugin installation or settings are modified by this delivery.
