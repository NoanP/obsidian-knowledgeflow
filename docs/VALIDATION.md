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
