# Validation and acceptance

The initial user scope permits only a new repository. Do not install this plugin or change any Obsidian vault/settings as part of this delivery.

## Automated

`npm run check` validates JavaScript and release metadata. `npm test` runs inherited TaskFlow task/calendar/project tests and new knowledge storage/approval tests. The Obsidian module is simulated; JSON represents the YAML subset used by fixtures. This does not certify Obsidian's real YAML adapter.

Knowledge tests cover: exact source preservation, URL normalization, deduplication, new source revisions, simultaneous capture, invalid input, source tampering, explicit approval, stale targets, preserving annotations/unknown metadata, retained page history, failed multi-file writes/audit writes and rollback, search/filter behavior, health findings, path ownership and separate plugin identity.

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
