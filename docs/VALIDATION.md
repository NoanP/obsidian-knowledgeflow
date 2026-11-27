# Validation and acceptance

The initial user scope permits only a new repository. Do not install this plugin or change any Obsidian vault/settings as part of this delivery.

## Automated

`npm run check` validates JavaScript and release metadata. `npm test` runs inherited TaskFlow task/calendar/project tests and new knowledge storage/approval tests. The Obsidian module is simulated; JSON represents the YAML subset used by fixtures. This does not certify Obsidian's real YAML adapter.

Knowledge tests cover: exact source preservation, URL normalization, deduplication, new source revisions, simultaneous capture, invalid input, source tampering, explicit approval, stale targets, preserving annotations/unknown metadata, retained page history, failed multi-file/audit writes and reviewed recovery, search/filter behavior, health findings, path ownership and separate plugin identity.

## Browser-only UI

Open preview/index.html. Synthetic data is memory-only and resets when reloaded. The preview does not use any Vault1 data or attach to an Obsidian process.

- Home: eight work tiles and knowledge entry; no New task on home.
- Knowledge: search by title/body; project/area filters; inspect source wikilinks.
- Capture source: title and exact text required; same text+URL is not duplicated.
- Draft: source selection required; no publishing before review.
- Review: before/after text visible; publish changes the count; original source unchanged.
- Annotations and History: own notes survive the next approved page update.
- Health: findings are explainable; no claim of semantic truth checking.
- Board: new tasks, notes, structured subtasks and linked knowledge selection.
- Calendar: 14:00 demo time block, actual duration preserved.
- Dark/light and narrow viewport: controls remain readable and reachable.

Native Obsidian plugin lifecycle, real YAML, actual sync races, mobile gestures, large collections and operating-system interruptions remain outstanding. 1.0 is an initial release, not a claim of production validation across all devices. Known limitations belong in release notes rather than being hidden by a version label.

## Knowledge network (1.1)

The graph is read-only. Tests verify eligibility, no synthetic same-tag edges, exact version matching, undirected edge deduplication, explicit wikilinks, missing/ambiguous targets, ignored code examples, capped node counts, deterministic finite layout and viewport fitting. Browser checks cover home placement, selection/detail navigation and graph controls in the synthetic preview. Native Obsidian validation is still outside the authorized scope.

## 3D graph and homepage (1.2)

Automated tests cover a non-planar deterministic layout, finite bounded coordinates, perspective size changes with depth, camera orbit, wide/narrow viewport fitting, frontmost-node hit testing, BFS neighborhoods (1–3 hops), connection/orphan/text filters, explicit node limits, removal of home task/stat rendering and DOM/Canvas-host interaction/lifecycle without file writes.

The browser preview was visually inspected for the viewport split and eight action tiles. Native browser input automation was intermittently interrupted by window changes, so automated renderer-host tests supplement rather than replace that visual inspection. Native Obsidian lifecycle/mobile gestures and large-vault performance are still separate outstanding checks. No Obsidian files were touched.

## Persistent knowledge journal (1.4)

163 automated tests pass. Fault injection exercises before and after each of seven storage calls in an existing-page publish (14 interruption scenarios), restarts with a fresh plugin and Vault wrapper, confirms read-only discovery, resumes from persisted snapshots and checks duplicate-free repeat recovery. Other cases cover stale previews, divergent external edits, source changes/removal, process-time races, create collisions, malformed/truncated/moved plans, mismatched snapshot hashes, missing/corrupt/orphan receipts, unsafe and duplicate paths, direct concurrent commits and journal persistence failure.

The isolated browser host exercises the change-log tab, simulated interruption, human-readable before/after preview, explicit continuation and completed status. Test data remains in memory. The preview supports JSON frontmatter, a subset of YAML; native Obsidian parsing, actual process termination, filesystem corruption, fsync/power-loss durability, mobile rendering and multi-device sync behavior are not verified. No Obsidian installation or real vault is used.

## Selected-source import (1.5)

184 automated tests pass. Import coverage includes read-only previews, selected-only note reads, exact original preservation, source date versus file modification/import time, provenance and input hashes, exact duplicate/revision checks, active-branch ordering, retained alternate branches, Claude/exchange messages, invalid formats and partial errors, strict UTF-8/BOM/CRLF handling, selection limits, stale/expired private previews, immutable preview snapshots, confirmation-time duplicate rechecks, corrupt targets, concurrent imports and interrupted batch recovery.

The isolated browser host successfully exercises two selected synthetic notes (one already known), a local synthetic chat-export file selected through the real file chooser, per-conversation deselection, readable transcript preview and confirmed import of exactly one note and one chat. The sources page shows provenance and separate source/import dates. The unselected conversation and existing duplicate are not imported again. All simulated vault data stays in memory. Real provider-export variants and native Obsidian/mobile behavior remain unverified.

## Local evidence search (1.6)

206 automated tests pass. Retrieval coverage includes read-only questions, corpus restrictions, exact Unicode/CRLF quotes and offsets, annotation/chat sections, generated-link exclusion, body/rare-term ranking, scopes, stale/missing/forged evidence, source-revision warnings, conflicting text retention, copied-quote deduplication, active chat branches, corrupt-source exclusion, content-sensitive index reuse, disclosed limits, direct new-tab links and stale-answer withholding. Title-only matches remain separate discovery links and never become quoted answer passages.

A fixed synthetic set has 10 relevant queries with the expected topic in the first three passages and two absent-topic queries with no passages. This is an authored regression fixture, not an independent real-vault benchmark.

The isolated browser preview verifies the question tab, two actual matching excerpts, separate title discovery, recorded source links, exact passage inspection, opening the correct note and source snapshot, and explicit no-evidence handling for an unrelated question. All examples remain in memory. Native Obsidian/new-tab behavior, mobile layout and real-vault retrieval quality remain unverified; no installation or real vault is used.

## Knowledge quality candidates (1.7)

230 automated tests pass. Quality coverage includes missing/ambiguous Wiki and Markdown links, conservative path resolution, encoded/dotted/Unicode names, owned headings/block IDs, metadata-only outside targets and attachments, masks/escaping, structured references, non-published targets and preserved same-title review. Similarity tests verify both excerpts, short-text exclusion, linked copies and bounded common passages. Statement tests verify opposing permission/numeric patterns, equivalent units and exclusions for different context, questions, quotes, code, hypothetical text, chats and explicit source revisions. Reports remain read-only and stale references are rejected.

The isolated browser preview confirms two possible permission/timeout conflicts, two missing targets/headings and a near-copy pair. Category filtering, two-sided exact evidence, readable comparisons and opening the correct owning note all succeed with synthetic in-memory data. The feature does not claim unrestricted semantic contradiction detection, full native Obsidian link semantics, real-vault precision or exhaustive checking. No real Obsidian session is used.

## 1.8 knowledge-to-work acceptance

252 automated tests pass. Added checks cover read-only candidates, exact literal evidence, exclusions, reviewed fields and provenance, project choice, stale note/source/project snapshots, duplicate clicks/restarts/archives/trash, same-title open tasks, path ownership, malicious evidence changes, outside-note isolation, response loss before/after task creation/receipts, explicit recovery and completed journal portability across task-folder changes. Quoted origin text is not parsed as a subtask.

The final isolated browser preview verified: two suggestions without creating a task; cancel preserves both; an edited title/note and project selection create one task on explicit approval; the candidate disappears while its knowledge backlink increments; opening that backlink shows approval provenance, a verified original passage and no unintended subtask; project details show linked knowledge and the new project task. Only synthetic memory data was used. Real native Obsidian/mobile integration was not tested or installed.

## 1.9 controlled AI acceptance

286 automated tests pass. The new simulated-provider tests cover opt-in defaults, zero-send preparation, exact request/approval hashes, session key non-persistence, fixed endpoint/model/body, per-job/day/month gates at approval and dispatch, durable reservations, usage settlement/retention, duplicate starts, rejection, pause in flight, stale source/configuration checks, late external edits, optimistic failures, restart classification, logical timeout/native overlap, unload, deterministic review-draft adoption and knowledge-journal recovery. No real provider request occurs.

Final browser acceptance used only synthetic in-memory sources, an inert example key and an overridden simulated transport. Verified disabled defaults; configured illustrative prices/limits; created an unsent local draft; inspected the complete JSON payload and disabled approval before consent; cancelled and reopened; explicitly approved and started; observed reported usage/accounting; paused; reviewed the untrusted result and explicitly adopted it into the Review tab; opened the same control via Settings → AI & budget and confirmed paused state plus saved-draft status. No task or knowledge publication occurred automatically.

Native Obsidian/mobile transport, real account/model availability, token-estimation bounds and invoice accuracy remain unverified. No Obsidian process/vault/installation was read or changed. Only repository files and the in-memory host were used.

## 1.10 Synapsenraum acceptance

297 automated tests pass. New coverage checks whole-model pan on multiple projected coordinates, unrestricted orientation/offset validation, explicit inset fit, unchanged camera after note selection/filters/neighborhoods/topology updates and rerenders, keyboard pan modes, touch centroid movement with pinch, empty/unavailable graphics, explicit note-kind colors, actual GPU vertex/edge counts, single resource disposal, context interruption and organic bounds on a 180-note chain. The existing graph data tests retain exact source revisions, unambiguous Wikilinks and no inferred tag/project edges.

Browser acceptance used only the in-memory host. Confirmed native WebGL rendering, the original 23 synthetic notes and an explicitly populated 173-note/209-edge example network. Recorded camera values remained identical after pan+zoom, note selection, neighborhood and source filters. Leaving for Board and returning restored the exact same camera. Rotation changed orientation without resetting translation/zoom. The stationary core/star decoration is absent; navigation and text labels remain readable in the dark home. No tasks/statistics return to home, and New task remains a Board action.

No real Obsidian application, native mobile device, real-vault content or external AI provider was used. Touch behavior and narrow fitting are automated fixture checks, not a native-device certification. Performance on arbitrary large vaults/driver combinations is not guaranteed.

## Personal quick capture and note inbox (1.11)

316 automated tests pass, including 19 new tests for exact body preservation, title derivation, input limits, duplicate clicks/retries, deliberately separate captures, active project validation, unknown metadata, stale edits, reversible archiving, source reuse, conversion idempotency across restart, failure after persisted writes, reviewed recovery and concurrent conflicts. Inbox content does not become an answer/graph/task candidate or trigger provider calls.

Browser acceptance uses synthetic memory-only data: capture from Home; close/reopen retains unsaved session text; Ctrl+Enter saves; open count and inbox entry appear; the network stays unchanged before processing; edit and assign a project; archive and restore; preview and explicitly convert to a review draft; processed original remains; Home still has eight navigation tiles and no task creation action. Native Obsidian/YAML/sync/mobile behavior remains outside the current repository-only scope.

The 1.11 capture and conversion dialogs were visually checked at the normal viewport and capture at 440 px width; dark/light controls use local neutral surfaces and explicit text contrast. The preview-only debug toolbar is not shipped as plugin UI.

## Reviewed link suggestions (1.12)

339 automated tests pass, including 23 new link tests: read-only suggestions; exact paired excerpts; target/origin ownership and states; unambiguous identities; no tag/project/code-only matches; suppression of existing relations and wikilinks; deterministic bounded ranking and disclosed omissions; individually selected narrow changes; exact body/unknown metadata preservation; stale origin and target rejection; duplicate clicks/restart retries; multi-target all-or-nothing preflight; inbox conversion/publication/real graph edges; interrupted recovery; concurrent edits; lost acknowledgements; forged evidence/plan rejection; and continued readability when a future matcher changes.

Synthetic browser acceptance verified: capture a new note, open proposals with all boxes unchecked and approval disabled, close without adopting, reopen/select exactly one target/approve, see exactly one stored connection and its exclusion from fresh proposals, carry it through the conversion and final publication previews, and access suggestions from review draft cards. Dark/light views were inspected, including cleaned exact excerpts without generated link blocks; 440 px width stacks evidence columns. No real vault, provider request or Obsidian process is used. Native YAML/sync/mobile acceptance remains separate.

## Inbox assistant (1.13)

360 automated tests pass, including 21 new tests for read-only proposals/preview, explicit structural type rules, Unicode topics, narrow selected changes, exact CRLF original preservation, unknown metadata/project/tag preservation, stale origin/target rejection, exact optional section coverage/provenance, duplicate/restart prevention, child collisions/edits, type/topic/link retention through separate conversion, interrupted origin/child writes, pinned recovery conflicts, lost receipts and forged plans. Completed journals remain readable after future suggestion-rule changes.

Synthetic browser acceptance verified all choices initially unchecked, a full before/after preview with every proposed section copy, cancellation retaining one unchanged original, explicit approval producing only the chosen metadata and two additional exact section notes, and the assisted Meeting type plus selected topic retained in a separately reviewed knowledge draft. Dark/light layouts and the review at 440 px width were visually checked. No real vault, Obsidian process or provider request is used. Native YAML/sync/mobile acceptance remains separate.

The final browser pass also verified that the change-preview action is disabled with no effective selection, enables after selecting a changed type, and still requires a separate approval. Cancelling that final preview leaves the original unchanged.

## Automatic topic hubs (1.14)

383 automated tests pass, including 23 new hub tests for read-only grouping, explicit property vs lexical membership, decision kinds, exact archived source pins, deduplication and missing/corrupt references, literal CRLF questions, completed/code exclusions, active chat-branch containment and anti-forgery, origin/target ownership, German text normalization, project-scoped catalogue behavior, cache reuse/invalidation, stale-evidence rejection, dynamic membership, scan exclusions and disclosed content limits.

Browser acceptance used synthetic in-memory records: navigate to Topic hubs, select #netzwerk, verify notes/one decision/one deduplicated source/three explicit questions, inspect a question and open its exact original note, restrict to a project, explore a custom term, and refresh while retaining an unsubmitted query. Dark/light and 440 px layouts were inspected. Returning to Home retained eight work tiles and the freely movable Synapsenraum; hub navigation created no graph nodes or edges. Native Obsidian/YAML/sync/mobile acceptance remains separate.

## Weekly knowledge review (1.15)

395 automated tests pass, including 12 new tests for local week/year/DST boundaries, new-versus-updated date groups, current backlog scope, read-only refresh, unknown dates, project isolation, ownership/duplicate exclusions, stale/forged actions, dynamic backlog and limits. Browser acceptance with synthetic data verified current/past week selection, unchanged current inbox/draft backlog for a past week, inbox-assistant cancellation, draft-review entry without publishing, and dark/light project-filtered layouts. No real vault, provider or Obsidian process was used; native YAML/sync/mobile acceptance remains separate.

## Rediscovery (1.16)

408 automated tests pass, including 13 new rediscovery tests for read-only selection, age ranking, narrow metadata/body/date preservation, fixed review/snooze calendar dates, restart/hide/restore, idempotency, stale/foreign scope, malformed state, interrupted writes, explicit recovery conflicts and forged plans. Browser acceptance with synthetic data verified marking an important note, its 14-day review date, removal from the due list, management under All visible notes, hiding, Hidden notes restoration, and dark/light layouts. No real vault, provider or Obsidian process was used. Native YAML/sync/mobile validation remains separate.

## Related-concept search (1.17)

428 automated tests pass, including twenty new concept-search/integration cases. The authored twelve-query bilingual fixture retrieves intended notes with no word-only hits; it is not an independent semantic-quality benchmark. Synthetic browser acceptance verified related-word search, word-only controls, exact evidence, unchecked link proposals and explicit approval, stale-result invalidation, light/dark presentation. No providers, model downloads, real vaults or Obsidian processes were used. See [implementation and limitations](CONCEPT-SEARCH.md).
