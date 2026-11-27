# Reviewed connection suggestions (1.17)

## Workflow

After quick capture, open Note inbox and choose Suggest links on the new note. The same action is available on review draft cards and in the draft review dialog. This is deliberately invoked when ready to organize, not another popup in the capture flow. Published/processed/archived notes are not edited by this feature.

The preview lists up to eight candidates. Each shows its title, shared terms and literal excerpts from the origin and target; title excerpts are labeled. Checkboxes start unchecked, and approval is disabled until at least one candidate is selected. Closing or reloading suggestions does not write any note. Approve selection adds exactly those related-page IDs to the origin; it never edits target notes, publishes a draft or creates tasks. There is no automatic or external AI request.

Approved connections are shown on the inbox card and in the conversion/publication preview. Conversion retains them in the review draft. Inbox and review drafts remain outside the graph; the new connections become real network edges only after the separate publication approval. Existing manual related IDs use the same display and remain untouched. The graph camera behavior is unchanged.

## What matching means

Only unambiguous published notes in KnowledgeFlow/Wissen/Seiten can be targets. Sources, inbox notes, review drafts, archived notes, outside vault files and duplicate IDs are excluded. The source must be an open owned personal note or a review draft in its proper folder. An update draft does not propose a connection to the page it updates.

The matcher compares normalized German/English word forms in titles and the first 20,000 body characters. Tokens longer than 64 normalized characters are ignored. It removes common stopwords, code examples, comments, generated connection sections and existing link syntax. At least two distinct shared word/concept features are required, including one key of at least five characters. Bundled German/English concept groups map related wording (e.g. Datensicherung/Backup); synonyms in the same group count once. [Concept matching and limitations](CONCEPT-SEARCH.md). Shared title terms and rarer terms improve the ordering; a shared project is only a small tie aid after textual overlap exists. Tags/projects alone never generate a candidate. No embedding model, similarity percentage, confirmed semantic relationship or factual agreement is asserted. Paired literal words expose the matching basis.

Existing forward/reverse related IDs and explicit wiki/Markdown connections suppress redundant suggestions. Candidates are ordered deterministically. Matching is bounded to 400 published records, two million total target body characters and eight displayed suggestions. Per-text matching truncation, omitted/ambiguous targets and additional qualifying matches are disclosed. Long or late-alphabet notes may remain unchecked; a fresh request is not an exhaustive semantic search. Full original target bodies are charged to this scan budget for existing-link checks; the existing owned knowledge refresh still reads its normal collection.

## Approval and recovery

The origin and every selected target are pinned to exact full-record hashes. Approval checks current files and unique IDs again, rejects stale text/archive/deletion, derives the quoted evidence again, then persists a validated vault-bound write-ahead plan. Recovery validates the approved literal snapshots rather than rerunning a later matching/ranking algorithm. The plan records selected target versions, exact matching evidence, original and proposed origin, a before-version history record and an audit entry. Only related IDs and updated time may change on the origin; body, unknown frontmatter and annotations remain intact.

A repeated identical approval, including after restart, returns the same result without adding another link or journal operation. A later meaningful edit requires a fresh preview. At most 50 related-page IDs are retained per note. Targets are read dependencies and are never written.

Interrupted writes quarantine the origin and block new knowledge writes. Open Change log, inspect snapshots and pinned dependencies, then explicitly resume the reviewed change. Already persisted identical output is reused; changed origin or target versions block recovery instead of being overwritten. No cross-device lock or crash-proof filesystem atomicity is claimed. Pending plans include snapshots of selected owned target notes for verification; those snapshots remain local with the existing history policy.

Accepted links persist as normal references. Future edits to a target do not silently remove or reclassify an already accepted connection. Publication continues to use the existing review workflow; the target snapshot records the version reviewed at link approval time, not a promise that linked notes will never change.

## Scope and validation

Only the independent KnowledgeFlow repository is released. Automated fixtures and the synthetic in-memory browser host are used; existing TaskFlow and all real Obsidian installations, settings and vaults remain untouched. Native Obsidian YAML/sync/mobile testing is separate.
