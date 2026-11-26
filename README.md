# KnowledgeFlow 1.10

A local Markdown workspace connecting sources, reviewed knowledge and everyday work in Obsidian. An independent project derived from [TaskFlow 0.17.3](https://github.com/NoanP/obsidian-taskflow/tree/468af48c96bb9a4c87a5443c426d49937b1998d4).

**This repository does not update TaskFlow or install anything in Obsidian.** The plugin uses a distinct identity and an independent `KnowledgeFlow/` folder. There is no automatic migration or reading of TaskFlow tasks/settings. Keep using the existing installation unchanged until you explicitly choose a separate test.

## New in 1.10: Synapsenraum

The approved Synapsenraum replaces the fixed galaxy core with a freely movable 3D note network: charcoal background, pastel note-type colors, fine real connections, compact left-hand welcome and eight translucent navigation tiles. There are no decorative stars, fake nodes or fixed center object.

Use **Verschieben / Pan**, Shift/right/middle drag, or Shift + arrow keys to move the entire model. Drag in **Drehen / Rotate** mode rotates it; wheel, pinch and +/− zoom. Selecting a note, searching, changing filters, entering a neighborhood and returning from another workspace preserve your camera. Only **Zentrieren / Fit view** or **Hier fokussieren / Focus here** explicitly realigns it.

A native WebGL renderer uses real x/y/z positions without a runtime library or remote code. A software perspective fallback and accessible selector remain available when graphics support is limited. [Interaction, color meanings and limitations](docs/SYNAPSENRAUM.md).

## Controlled AI automation (1.9)

Open **Wissen & Quellen → KI-Automatisierung**, or **Settings → KI & Budget**. The optional OpenAI connection is disabled by default. Set current input/output prices and per-job/daily/monthly USD limits, then provide an API key for this session only. Nothing connects automatically, and the manual assistant workflow remains available.

Select one to six existing source snapshots and a job type: summary, next steps or open questions. A local job draft does not send anything. **Versand prüfen** shows the complete outgoing request, recipient, pinned source versions and estimated reservation. Explicitly approve each transfer, then start the approved queue. Pause stops subsequent jobs; a request already sent may still complete and incur costs. Restarts pause the queue; uncertain requests are never automatically retried.

Results remain untrusted text until **Als Wissensentwurf zur Prüfung speichern** is explicitly chosen. This creates a source-pinned, journaled review draft, never a published note or real task. Publication and checklist-to-task approval remain separate actions.

Cost limits are local accounting gates based on manually entered prices, conservative text-input estimates and an output-token cap, not provider billing guarantees or an account-wide spending control. Unknown outcomes retain their full reservation. Read [setup, privacy, costs and recovery](docs/AI-AUTOMATION.md).

## Connect knowledge to work (1.8)

Published knowledge cards show their project and linked tasks, including completed tasks. Projects list their linked knowledge; task cards and editors retain direct knowledge links. Existing tasks can be linked through **Wissen verknüpfen / Link knowledge**, and a knowledge draft can assign its project before publishing.

Choose **Aufgabenvorschläge / Task suggestions** in Knowledge & sources, or **Aufgaben vorschlagen / Suggest tasks** on an individual published note. Only unchecked Markdown checklist lines become local review candidates. Inspect the exact passage, adjust the title/project/priority/due date/note, then explicitly choose **Freigeben und Aufgabe erstellen / Approve and create task**. Closing or hiding does not create a task. Hiding lasts for the current window; there is no persistent rejection queue or automatic provider call in checklist-to-task conversion.

Approved tasks store exact provenance and a stable approval identity. Their creation is journaled with pinned note/source dependencies, conflict checks and explicit recovery. Read [workflow, safeguards and limits](docs/KNOWLEDGE-WORK.md). TaskFlow and existing Obsidian installations are untouched.

## Knowledge quality review (1.7)

Open **Wissen & Quellen → Pflege / Knowledge & sources → Health** and choose **Wissen prüfen / Check knowledge**. The local report groups broken/ambiguous links, similar word sequences, possible rule/numeric conflicts and existing review needs. Each candidate opens pinned evidence, with both passages for comparisons. Reports do not edit, merge, delete or declare any source true.

Link checks use filename metadata for outside targets without reading their content. Similarity is lexical, and conflict candidates require narrow recognized statements with matching context; chat assertions and unrestricted semantic contradictions are not automatically classified. Limits and unchecked sections are disclosed. See [quality checks and limitations](docs/KNOWLEDGE-QUALITY.md).

## Local answers with evidence (1.6)

Open **Wissen & Quellen → Wissenssuche / Knowledge & sources → Ask knowledge**. Ask a question or enter concrete terms; scope the search to published notes, sources or both. Responses assemble verbatim passages with direct note links, exact-version inspection and separate recorded source links. Missing material, inference/ambiguity markers and known source-version issues are disclosed. Title-only matches remain separate discovery links. Queries and answers are not saved or sent to a provider.

This is local extractive retrieval, not a free-form AI chatbot or automatic fact checker. It does not infer whether two passages contradict each other or whether recorded source links actually prove each note claim. Read [search, citations, validation and limits](docs/KNOWLEDGE-SEARCH.md).

## Selected source import (1.5)

Open **Wissen & Quellen → Quellen importieren / Knowledge & sources → Import sources**. Select Markdown notes by filename or choose local `.md`, `.txt` and supported chat `.json` files. Review conversations individually, exact duplicate/new-version indicators, provenance and dates, then explicitly import up to 20 selected sources. Originals are never edited. Import writes use the 1.4 journal and recovery flow.

Text notes retain their exact decoded UTF-8 text. ChatGPT/Claude conversation JSON and the documented KnowledgeFlow Chat v1 format become canonical JSON conversation snapshots, with a readable text preview. This is not a verbatim copy of the entire export archive. Attachments and URLs are not fetched; ZIP files must be extracted first. Unsupported structures and partial format errors are listed for review. See [formats, dates, limits and examples](docs/SOURCE-IMPORT.md).

## Reliable knowledge changes (1.4)

Open **Wissen & Quellen → Änderungsprotokoll / Knowledge & sources → Change log** to inspect before/after versions, resume interrupted operations after a fresh review, or load previous published content as a new draft. Before changing a source/draft/page, KnowledgeFlow persists a local write-ahead plan with content snapshots and SHA-256 checks. Pending or invalid operations block further knowledge writes; partial records stay out of the knowledge index. Recovery preserves divergent external edits and requires manual conflict resolution. Source dependencies are checked as well as output files.

This covers knowledge capture, drafts, publishing, annotations, archive and restore. Reviewed task-suggestion creation also uses the journal (1.8); other task edits, recurrence, project settings and permanent trash operations retain their previous behavior. The journal supports resuming persisted operations after a restart; it is not a full-vault backup, cross-device lock or a guarantee against power loss. See [recovery and limitations](docs/RECOVERY.md).

## Interactive 3D homepage

Home shows a daily welcome/thought, eight compact navigation tiles and the Synapsenraum. Daily tasks/statistics remain in their own workspaces. The model canvas spans the workspace behind the compact navigation. Narrow panes stack navigation above the model. The home scene uses the approved dark palette; other screens retain their existing appearance settings.

- Orbit, whole-model pan and zoom are independent. No periodic scan, filter, selection or resize forces a fit. Camera state stays in the current view instance across navigation, not in Markdown or plugin settings.
- Click/tap selects and highlights neighboring links; double-click/tap opens the note. **Netz erkunden / Explore network** exposes search, an accessible note selector, filters and neighborhood depth.
- **Umgebung / Neighborhood** limits visible records to actual neighbors at 1–3 connection steps; **Gesamtes Netz / Whole network** exits that filter. These controls do not reset the camera. **Hier fokussieren / Focus here** is a separate explicit camera action.
- Source snapshots, orphan notes, labels and connection types can be filtered. Search matches all terms across title, body, tags and area; it is not Obsidian's full query language.
- Colors identify actual note kinds, not inferred semantic groups or certainty: pages blue, meetings rose, cases sage, sources apricot, decisions lavender. Labels and the legend provide text equivalents.
- Bounded force placement runs on topology changes; frames are requested only on input/resize. No automatic spinning or perpetual physics. WebGL resources, pending frames and listeners are released when leaving the graph. There are no large-vault frame-rate guarantees.

Only actual `related` links, exact source-version references and unambiguously resolved `[[wikilinks]]` create edges. No relationships are inferred from tags or projects. Only owned published KnowledgeFlow pages and optional source snapshots appear. The base graph is capped at 500 nodes and each 3D scene at 240, most connected first; omitted counts are visible. Filters/neighborhoods operate on that base, not on arbitrary vault notes beyond the base limit.

See [graph research and design decisions](docs/GRAPH-RESEARCH.md) for the official Obsidian, Juggl and 3D Graph inspirations.

## Included since 1.0

- **Knowledge workspace:** sources, published pages, review queue, health checks and archive. Full-text search across title, content, tags and annotations, with excerpts and project/area filters.
- **Traceable sources:** paste source text or your own notes, optionally recording a URL and author. Source text is preserved exactly and identified by SHA-256. Repeated capture of the same URL/text version is detected; changed text creates a new revision.
- **Human review:** prepare a knowledge page, meeting record, solved case or decision. Select exact source versions; compare before and after; explicitly publish or archive. Existing pages receive proposed changes rather than silent overwrites.
- **AI-assisted workflow:** prepare a work request from selected sources and manually pass it to an assistant of your choice. Paste its JSON proposal back into KnowledgeFlow; it stays a draft until reviewed. This manual workflow makes no provider calls. Version 1.9 separately adds an optional, disabled-by-default OpenAI queue with explicit data-transfer approval.
- **Knowledge in work:** project knowledge view, linked knowledge pages on tasks, related pages and native wikilinks. Personal annotations remain separate from proposed content.
- **History and health:** earlier record versions, loading previous page text as a fresh draft, operation logs, missing references, newer source revisions and duplicate titles. Health findings are review prompts, not a truth detector.
- **TaskFlow-derived work tools:** graph-first homepage, interactive Kanban, projects, calendar, recurring tasks, filters, statistics, notes/subtasks, archive/trash and detailed settings. Gray interface with status and priority colors; eight action tiles plus a knowledge-workspace entry. New tasks remain a board action.

## Workflow

1. Open **Knowledge / Wissen** through the homepage toolbar or the plugin command.
2. Capture source text. URLs are stored as references; pages are not fetched.
3. Prepare a draft yourself, or select sources under **AI work request**. Nothing is sent automatically.
4. Paste a structured proposal under **Import AI draft** if using an assistant.
5. Open **Review**, inspect the proposed text and original sources, then publish.
6. Link knowledge to a project or select it in a task's **Link knowledge** section.
7. Review source updates and broken references under **Health**. Prior page versions can be loaded as new review drafts under **History**.

See [data format](docs/DATA-FORMAT.md), [assistant workflow](docs/ASSISTANT-WORKFLOW.md), [acceptance checks](docs/VALIDATION.md) and [roadmap](docs/ROADMAP.md).

## Preview without Obsidian

Open [`preview/index.html`](preview/index.html) in a desktop browser, or run `npm run preview` and visit `http://127.0.0.1:8765`. Synthetic example data lives only in browser memory and resets on reload. No vault, filesystem, storage service or real AI provider is connected. The host adapter implements a subset of Obsidian's APIs and uses JSON frontmatter, a valid YAML subset.

## Optional installation later

**No installation is part of the initial repository delivery.** When you decide to test it, use a new disposable vault. With BRAT, add `NoanP/obsidian-knowledgeflow` and select release `1.7.0`. Plugin ID: `knowledgeflow`; required Obsidian version: `1.7.2` or later. All three release assets are required: `main.js`, `manifest.json`, `styles.css`. Do not overwrite `taskflow-kanban` or copy TaskFlow's settings into this plugin.

Native Obsidian and mobile validation are not completed for 1.0. The inherited task layer has automated coverage; the new knowledge workflow is tested through an in-memory vault and browser simulation. Cross-device conflicts and process/power failures are not atomic transactions. Use normal backups before any later real-vault pilot.

## Development and updates

Node.js 22+; no package install or build step is required. The runtime dependency is Obsidian itself.

```sh
npm run check
npm test
npm run preview
```

Edit `main.js`, `styles.css`, tests and docs here. Bump `manifest.json`, `package.json` and `versions.json` together; add a changelog section. Push to `main`: GitHub Actions checks syntax, versions and tests, then creates an immutable release with BRAT assets. Existing release numbers are never overwritten.

## Boundaries

1.0 provides the knowledge workflow and task tools. Version 1.9 adds sequential, explicitly approved provider jobs. It does not provide unattended schedules, semantic/vector search, automatically generated weekly reviews, source-page crawling, tool execution or direct chat. Other providers and local models need separate adapters and validation. Local storage does not make an external assistant local: you decide what selected text to share and with whom.

## Inspiration and license

- [Evgeni Rusev: Obsidian + Claude Code second brain](https://medium.com/@evgeni.n.rusev/how-i-built-my-second-brain-with-obsidian-claude-code-9fb54b7665ca)
- [Karpathy: LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- [Tiago Forte: PARA](https://fortelabs.com/blog/para/)
- [Andy Matuschak: concept-oriented evergreen notes](https://notes.andymatuschak.org/Evergreen_notes_should_be_concept-oriented)
- [Obsidian Web Clipper](https://obsidian.md/help/web-clipper/templates)
- [obsidian-wiki: provenance](https://giovi321.github.io/obsidian-wiki/concepts/provenance-and-confidence/)
- [QMD](https://github.com/tobi/qmd), a possible optional search integration, not bundled.

MIT, copyright 2026 NoanP. TaskFlow's original MIT notice is retained in [LICENSE](LICENSE). No third-party article text, private vault contents or external project code is included.
