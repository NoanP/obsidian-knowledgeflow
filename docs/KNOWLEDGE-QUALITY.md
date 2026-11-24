# Knowledge quality review (1.7)

## Use and ownership

Open **Wissen & Quellen → Pflege** and choose **Wissen prüfen**. Filter the report to links, similar content, possible conflicts or further review. **Fundstellen prüfen** displays the exact source text on each side; **Notiz öffnen ↗** verifies and opens the owned note in a new tab.

Reports are local and read-only. No repair, rewrite, merge, deletion, source selection, query history, quality score, model request or audit entry is generated. Findings are candidates for manual inspection. Existing draft/review/publish workflows remain the route for any later intentional knowledge edits.

The content corpus is published pages and valid source snapshots owned by KnowledgeFlow. Drafts, archived pages, history, journals, tasks and unimported note bodies do not become comparison evidence. Archived source snapshots remain available for validating exact recorded source references, while active content comparisons skip them. Pending/invalid journals retain the 1.4 quarantine rules. Metadata can identify an existing non-published related page without exposing its text as active evidence.

## Links

The check inspects authored Wiki/Markdown links and embeds in published note bodies and personal annotations. Source quotations are not treated as newly authored live links. It also validates structured `sourceRefs` and `related` identifiers, distinguishing missing, ambiguous and non-published targets. Existing same-title, missing-source, later-imported source-version and ambiguous-claim review notices remain available.

Supported text patterns include `[[note|alias]]`, `[[./note#Heading]]`, `[[note#^block-id]]`, nested heading paths, self-heading links, `![[image.png]]` and simple `[label](encoded/path.md#heading)` destinations. Code fences, indented code, inline code, comments, generated link blocks and escaped examples are masked without moving evidence offsets.

This is a conservative resolver, not a replacement for Obsidian's complete parser or metadata cache. Root/folder paths, explicit relative paths and unambiguous basenames use the available filename catalog. Ambiguity is reported rather than guessed. Case/Unicode normalization and percent-decoding handle common filename variants. Frontmatter aliases, exotic Markdown, reference-style links, nested URL parentheses and every plugin-specific link form are not fully resolved.

Heading/block validation reads only already-loaded owned knowledge records. Common ATX/Setext headings, heading hierarchy and simple block IDs are recognized; complex markup can remain unchecked. An existing outside note/attachment is identified through filename metadata only. Its heading, block, attachment page or plugin-specific fragment is explicitly unverified. No additional outside body or attachment bytes are read. HTTP, mail, application and other protocol targets are not fetched or checked online.

The reference syntax follows [Obsidian's documented internal link formats](https://help.obsidian.md/links); resolution limits above describe this implementation, not full native equivalence.

## Similar content

The comparison normalizes word case/diacritics and measures shared sequences of five consecutive words. A candidate needs at least eight distinct sequences in each record, six shared sequences, and shared/union ratio of at least 0.55. Generated links, code and comments do not inflate the measurement. Short generic headings are not enough.

Each candidate shows the measured shared count and exact excerpt locations from both records. Excerpts keep whole-word boundaries. Similarity is lexical, not semantic equivalence, plagiarism proof, a correctness estimate or a recommendation to delete either record. Paraphrases without shared wording can be missed.

A note that explicitly references its similar source is labelled as related material, rather than counted as independent corroboration. Similar revisions of the same source are labelled as such. Copies remain unchanged. Very common sequences are bounded to the first 40 posting records and this limit is disclosed; reports do not claim an exhaustive duplicate inventory.

## Possible statement conflicts

The checker recognizes a deliberately narrow set of declarative patterns:

- `VPN ist erlaubt.` versus `VPN ist verboten.`; also explicit enabled/disabled and required/optional forms in German/English.
- Direct negations of allowed, enabled and required forms; ambiguous inverse formulations such as “not forbidden” are not interpreted as permission.
- Simple values such as `Timeout beträgt 30 Sekunden.` versus `Timeout beträgt 60 Sekunden.`; recognized time units convert to seconds. `30 Sekunden` and `0,5 Minuten` therefore agree.
- Percent/currency values and narrowly named unitless configuration values such as a port or timeout. Negative, grouped, excessive-precision and ambiguous byte/bit forms are outside these rules.

A candidate requires the same normalized subject, property and recognized condition text, plus matching recorded project, area, heading path and body/annotation section. Different projects, explicit conditions or headings are kept separate. Questions, code, block quotes, quoted examples, leading condition-only clauses and recognized hypothetical language are excluded. Rule extraction skips chat snapshots: a conversation utterance is not automatically promoted to a policy assertion.

Both exact statements are retained. Explicit revisions of the same source are version history rather than unresolved cross-source conflicts; later-imported versions still create normal review notices on pages that reference an earlier snapshot. Import dates are not asserted to be validity dates.

These are possible conflicts between recognized text patterns, not confirmed logical or factual contradictions. The checker does not understand arbitrary paraphrases, all negation, hidden contextual differences, historical validity, domain-specific units or general natural language. Some candidates can be legitimate alternatives; many real contradictions can be missed. There is no chosen winner, automatic truth score, autonomous claim repair or semantic language-model classification.

## Evidence and freshness

Every finding pins the full owning record hash. Literal links and compared statements/passages also retain exact section offsets, verified by the 1.6 evidence checks. The comparison dialog refreshes owned knowledge records, rechecks collection/catalog freshness and verifies every displayed evidence record. Opening again repeats freshness and hash checks.

A changed body, source snapshot, note identity or filename catalog requires a fresh report. These are point-in-time safeguards, not cross-device locking. Outside bodies are deliberately not freshness-tracked by content because the checker never read them. Opening raw notes later follows normal Obsidian rendering behavior.

## Bounds and storage

- At most 300 owned records are analyzed per run, in stable path order. Reference lookups can use other valid already-loaded records.
- Link scanning: up to 100,000 characters per section, 4 million overall, and 500 recognized links per section.
- Similarity: up to 20,000 characters per record and 1 million overall; at most 10,000 candidate pairs and first 40 records per very common sequence.
- Simple statements: up to 20,000 characters per section, 1,000 recognized assertions overall and 10 retained examples per pattern group.
- Findings: at most 100 per category; the UI shows 30 at a time. Omitted work and shortened scopes are disclosed with readable counters. No finding never means “everything is correct”.

These are analysis bounds, not a disk-read quota: the existing knowledge scan still reads owned records. Reports and filters remain in memory and do not persist content changes. No extra runtime dependency, online service or quality database is introduced.

## Validation

230 automated tests pass, including read-only reports, protected outside content, exact quote verification, Wiki/Markdown formats, masks/escaping, owned anchors and metadata references, similar copies, common-text bounds, narrow opposite statements, numeric equivalence, context separation, source versions, stale reports and filename normalization.

The isolated browser host uses synthetic notes for two opposite rules, a missing file, a missing heading and two similar instructions. Native Obsidian/mobile behavior, complete link-parser equivalence, real-vault similarity thresholds and actual contradiction precision need a separate, explicitly authorized pilot. This release is repository-only; TaskFlow and the user's Obsidian system remain unchanged.
