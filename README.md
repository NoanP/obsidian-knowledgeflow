# KnowledgeFlow 1.0

A local Markdown workspace connecting sources, reviewed knowledge and everyday work in Obsidian. An independent project derived from [TaskFlow 0.17.3](https://github.com/NoanP/obsidian-taskflow/tree/468af48c96bb9a4c87a5443c426d49937b1998d4).

**This repository does not update TaskFlow or install anything in Obsidian.** The plugin uses a distinct identity and an independent `KnowledgeFlow/` folder. There is no automatic migration or reading of TaskFlow tasks/settings. Keep using the existing installation unchanged until you explicitly choose a separate test.

## Included in 1.0

- **Knowledge workspace:** sources, published pages, review queue, health checks and archive. Full-text search across title, content, tags and annotations, with excerpts and project/area filters.
- **Traceable sources:** paste source text or your own notes, optionally recording a URL and author. Source text is preserved exactly and identified by SHA-256. Repeated capture of the same URL/text version is detected; changed text creates a new revision.
- **Human review:** prepare a knowledge page, meeting record, solved case or decision. Select exact source versions; compare before and after; explicitly publish or archive. Existing pages receive proposed changes rather than silent overwrites.
- **AI-assisted workflow:** prepare a work request from selected sources and manually pass it to an assistant of your choice. Paste its JSON proposal back into KnowledgeFlow; it stays a draft until reviewed. The plugin has no built-in AI provider or network calls.
- **Knowledge in work:** project knowledge view, linked knowledge pages on tasks, related pages and native wikilinks. Personal annotations remain separate from proposed content.
- **History and health:** earlier record versions, loading previous page text as a fresh draft, operation logs, missing references, newer source revisions and duplicate titles. Health findings are review prompts, not a truth detector.
- **TaskFlow-derived work tools:** My Day, interactive Kanban, projects, calendar, recurring tasks, filters, statistics, notes/subtasks, archive/trash and detailed settings. Gray interface with status and priority colors; eight home tiles plus a knowledge entry. New tasks remain a board action.

## Workflow

1. Open **Knowledge / Wissen** through My Day or the plugin command.
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

**No installation is part of the initial repository delivery.** When you decide to test it, use a new disposable vault. With BRAT, add `NoanP/obsidian-knowledgeflow` and select release `1.0.0`. Plugin ID: `knowledgeflow`; required Obsidian version: `1.7.2` or later. All three release assets are required: `main.js`, `manifest.json`, `styles.css`. Do not overwrite `taskflow-kanban` or copy TaskFlow's settings into this plugin.

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

1.0 provides the knowledge workflow and task tools. It does not yet provide unattended AI processing, semantic/vector search, automatically generated weekly reviews, source-page crawling, background jobs or direct chat inside Obsidian. A local search engine or an AI provider can be added after measured need and a separate design decision. Local storage does not make an external assistant local: you decide what selected text to share and with whom.

## Inspiration and license

- [Evgeni Rusev: Obsidian + Claude Code second brain](https://medium.com/@evgeni.n.rusev/how-i-built-my-second-brain-with-obsidian-claude-code-9fb54b7665ca)
- [Karpathy: LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- [Tiago Forte: PARA](https://fortelabs.com/blog/para/)
- [Andy Matuschak: concept-oriented evergreen notes](https://notes.andymatuschak.org/Evergreen_notes_should_be_concept-oriented)
- [Obsidian Web Clipper](https://obsidian.md/help/web-clipper/templates)
- [obsidian-wiki: provenance](https://giovi321.github.io/obsidian-wiki/concepts/provenance-and-confidence/)
- [QMD](https://github.com/tobi/qmd), a possible optional search integration, not bundled.

MIT, copyright 2026 NoanP. TaskFlow's original MIT notice is retained in [LICENSE](LICENSE). No third-party article text, private vault contents or external project code is included.
