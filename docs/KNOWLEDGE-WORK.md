# Connect knowledge to projects and tasks (1.8)

## Navigate existing relationships

- In a published knowledge draft, select a project before publishing. A published knowledge card opens that project and lists up to 20 linked active/completed tasks; more tasks are accessible through project/search.
- In a task editor, expand **Wissen verknüpfen / Link knowledge** and select published notes. Task cards expose their knowledge links, and generated tasks retain exact approval provenance in **Freigabe und Herkunft / Approval and origin**.
- A project detail page lists its linked published knowledge and retains the project-filtered knowledge view. IDs survive renames; unavailable references are disclosed rather than silently retargeted.
- Recurrence skips/superseded occurrences and trashed tasks are omitted from knowledge backlinks. Completed/archived tasks remain available.

## Propose, review, approve

1. Open **Wissen & Quellen → Aufgabenvorschläge**, or **Aufgaben vorschlagen** on one published note.
2. Only unchecked Markdown checklist lines (`- [ ]`, `* [ ]`, `+ [ ]`, up to three leading spaces) become candidates. Completed checkboxes, code blocks, indented code, quoted checklists, comments and generated-link blocks are not proposed. Sources, drafts and archives do not produce candidates.
3. **Prüfen und freigeben** opens one candidate, its exact note title and passage. **Belegstelle prüfen** verifies the original raw-version hash and offsets before opening the evidence. This proves origin, not that the statement is true or the action is authorized without review.
4. Edit the title, choose an existing active project or no project, and optionally set priority, due date and task notes. Nothing infers a due date, assignee, calendar time or recurrence from prose. A due date uses existing calendar behavior; there is no separate calendar-write step.
5. **Freigeben und Aufgabe erstellen** explicitly authorizes this one task. Cancel/close/hide never creates a task. Hide is temporary for the current suggestion window, not a stored rejection.
6. Find the task through the linked knowledge card, selected project, or the board when no project was chosen. Existing behavior excludes project tasks from the independent-task board. General **Neue Aufgabe** remains a board action.

Suggestions use local rules, not an external LLM or a persistent approval queue. They are regenerated on demand, capped at 100 published notes and 200 unique candidates; a selected note can be inspected independently of the global note limit. The source note/checklist is never checked off or rewritten when the task is created or completed.

## Safeguards

Before creation, reread the note and sources, validate the exact unchecked passage, active project snapshot and owned task folder, and detect an existing approval identity or same-title open task in the chosen project. Pending/invalid transactions block a new approval. No unimported note body is read.

Persist a sealed, vault-bound plan before task/audit output. It can only create one deterministic owned task and audit entry. Verify all bytes/dependencies and the selected project before acknowledging a completion receipt. API failures after persistence retain outputs for reviewed recovery. See [recovery](RECOVERY.md).

The approval key combines note path/ID and normalized checklist text. Repeated equal lines are one candidate. Double-clicks, restarts, task edits, archive and recoverable trash do not create another copy while the task retains its provenance. A moved note, renamed checklist or permanent loss of task/provenance can yield a new candidate; title matching is a conservative secondary check, not semantic deduplication. Cross-device races, filesystem fsync guarantees and automatic conflict reconciliation are not provided.

Existing task edits preserve provenance/unknown fields; changing/unlinking a task later does not rewrite the original reviewed snapshot. A stale evidence inspector refuses to present it as the current note. The sealed transaction remains a historical record; normal task trash is the reversible undo path for creation. There is no general task/project/settings rollback.

## Delivery scope

Repository-only release. Synthetic in-memory tests and preview never attach to Vault1 or an Obsidian process. Real Obsidian/mobile acceptance requires separate authorization.
