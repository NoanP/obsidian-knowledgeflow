# File inbox (1.19)

## Workflow

Open **Knowledge & sources → File inbox** or its dedicated command. Choose files or drag them from the operating system onto the drop area. PDF, UTF-8 TXT and Markdown are supported. Dropping is an explicit instruction to save a local staging copy; it does not extract text, create knowledge, run OCR/AI or index the original. There is no watched external folder or automatic vault-wide ingestion. Internal Obsidian link drags are not OS file uploads.

The list has filename search and Pending review/Captured/All filters. Staging survives plugin restarts. A staged item offers **Prepare preview** and **Download original**. Explicit preview extracts every page and checks existing source text; it writes nothing. Review page contents/methods and the filename, original-byte fingerprint, date basis and duplicate notice. The approval checkbox starts unchecked and Capture reviewed text stays disabled until checked. Closing/cancelling an unapproved preview imports nothing. Preview text is read-only: fix a faulty original externally, or choose a different extraction mode and prepare a new preview; no silent OCR correction is claimed.

Approval journals a frozen source snapshot and acceptance receipt together. Only then does the extracted source enter normal word/concept search and, on a separately requested local embedding search, the semantic corpus. Publication as a reviewed knowledge page, links, tasks and AI automation remain separate explicit workflows. The staged binary is never fed into these features. Captured items keep their original and a source-opening action; exact content duplicates point at the existing source without creating another copy. First-source provenance remains unchanged; the per-file receipt records the additional staged original.

Multi-file selections are processed individually and report saved files, exact file duplicates and failures. A later file failure does not roll back earlier successful staging. Rerendering the view does not interrupt the selected batch. Starting another batch while one runs is blocked. Unload stops subsequent file dispatch; an already authorized journal operation may finish. Closing a preview after clicking approval does not promise to cancel already-started writes.

## PDF and local OCR setup

Digital PDF text uses Obsidian's public [loadPdfJs API](https://github.com/obsidianmd/obsidian-api/blob/master/obsidian.d.ts), which loads its bundled PDF.js. No PDF library download or npm runtime dependency is added to the plugin. The plugin supplies bytes rather than a PDF URL, disables PDF.js eval and worker resource fetching, sets image/canvas resource caps and never executes embedded PDF actions, follows links or loads attachments.

For scanned pages, separately install a trusted **Tesseract** executable and the desired language data. The plugin does not install or download them. See [official installation instructions](https://tesseract-ocr.github.io/tessdoc/Installation.html) and [command-line/language documentation](https://tesseract-ocr.github.io/tessdoc/Command-Line-Usage.html). On a user-managed Homebrew setup, `brew install tesseract tesseract-lang` is one option; the language package can be large. Configure an installed program yourself rather than running an unreviewed install script.

Open **PDF & local OCR setup**. Select German+English, German or English and use `tesseract` from the desktop app's PATH or an absolute path to the trusted executable, e.g. `/opt/homebrew/bin/tesseract`. Graphical apps may have a different PATH from a terminal. These options live only in the plugin session, not saved settings. OCR requires Obsidian Desktop; mobile OCR is not supported/certified. Digital PDF support depends on the PDF.js supplied by the user's Obsidian version; native mobile behavior is separately unvalidated.

Modes:

- **Automatic:** preserve a page's extracted text if it contains at least 30 Unicode letters; otherwise render it and request local OCR.
- **PDF text only:** never invoke OCR. Entirely textless documents are rejected. Blank pages alongside readable pages retain their page positions and visibly say no text was detected.
- **OCR all pages:** render every page, useful when a misleading partial text layer conceals scanned material. An automatic threshold cannot reliably detect all partial text layers.

Rendering targets up to 2x page scale within a 12-million-pixel cap. OCR sends the PNG over stdin to the configured local executable and reads stdout, using fixed `stdin stdout -l <whitelisted-language> --psm 3` arguments, shell disabled, a deadline and output limits. File contents/names never become shell commands. No temporary original or raster file is written by this integration. Missing engine/language data, unsupported text, page failure or an entirely empty result yields no adoptable partial preview. Password-protected PDFs are unsupported and must be unlocked separately by the user.

OCR and PDF reading order can be wrong, especially for handwriting, columns, tables, rotated/degraded scans and oversize images. Empty pages are not proof that the original has no content: inspect the original. The preview is reviewable extracted text, not a guarantee of faithful layout or exact wording in the binary PDF. This is why every page/method remains visible before approval. No OCR confidence percentage or automatic correctness certification is invented.

## Storage, identity and provenance

Staging writes immutable create-only Markdown envelopes under **KnowledgeFlow/Wissen/DateiInbox**. Each envelope stores exact original bytes as canonical base64, byte SHA-256, filename, byte size and modification/import dates. It is an application-managed storage format, not an ordinary PDF folder: use Download original to recover the original binary. This allows the existing string-snapshot journal to recover exact originals without adding unjournaled binary writes. Do not edit these internal files or drop raw PDFs into this internal folder expecting automatic ingestion.

The staging envelope and its journal both retain the bytes; base64 takes about 4/3 of binary size, so the pair alone is roughly 8/3 of original size before metadata, receipts/backups or source text. This is deliberately a bounded inbox, not a space-efficient large document archive. No automatic cleanup, retention policy, permanent deletion or compression is introduced. User-managed vault backup/sync may retain further copies; local processing is not encryption or control over the user's other sync tools.

Accepted source snapshots live in the existing Quellen folder. They contain stable `## Page N` boundaries and extracted text. Metadata records the binary hash, original name, stage path/full-record hash, file modification time when known, import time, page offsets/method and OCR language selection. The date is labeled file-modified, not asserted creation time. Exact search citations verify the extracted source version/offsets; they are not native PDF byte/page-coordinate citations.

Byte hashes deduplicate original staging, including renamed copies, retaining the first original name. A separately calculated hash of the complete page-mapped extracted text deduplicates sources at preview and again at approval. Different layouts, whitespace, page splits or OCR output can produce different text snapshots; no fuzzy/semantic duplicate detection is claimed. Different extraction results from the same staged original are not silently substituted after acceptance; a repeated approval returns the existing receipt/source. A document revision with changed bytes is staged independently.

## Approval and recovery

The original envelope is pinned by full-record hash. Acceptance checks it again, verifies original byte integrity, rechecks valid sources and creates a receipt referencing the accepted source. Neither the external original nor the staged envelope is changed. Sources remain immutable. Preview copies cannot alter the internally retained frozen approval. Up to three previews are retained in memory for 30 minutes; reload/unload clears them and requires a new preview.

Staging and acceptance use constrained file-stage/file-accept journal actions, a validated write-ahead plan, exact dependencies, verification and a sealed completion receipt. A failed stage or source/acceptance write is quarantined. Review it in Change log, inspect snapshots and explicitly recover. Recovery reuses stored bytes/text/page maps; it never reruns a later OCR/parser or replaces the approved text. Changed original/source dependencies or conflicting partial outputs block recovery rather than overwriting them. Existing journal schemas/actions remain valid; no cross-device locking, fsync-level atomicity or universal crash-proof guarantee is asserted.

Staged/receipt records are explicitly excluded from the knowledge scan, graph, hubs, inbox assistant, task suggestions, search and AI sources. Reading the file list does not OCR or adopt anything. No external vault files are read by this workflow unless explicitly chosen through the browser/OS file input. Original download verifies exact staged bytes first and creates a local download only after a click.

## Bounds

- 1–5 files per selection, up to 8 MiB each and 16 MiB combined. Unsupported/empty/oversize inputs fail explicitly.
- At most 30 pages per PDF; oversized PDFs must be split first. At most 900,000 extracted document characters. No silent page/text truncation.
- 60-second deadlines per PDF loading/page/text/render step and native OCR call; native OCR output at most 2 MB, PNG input at most 16 MiB. Cancellation stops subsequent work and requests worker/process termination; it is not a guarantee of instantly terminating all already-started native computation.
- List scan bounded to 100 checked envelopes and 32 MiB of staged envelope characters/stat-size budget, with omissions/errors disclosed. Binary hashes are rechecked; this is not metadata-only or full-vault indexing. A very large original may consume much of this listing budget. The preceding journal/knowledge scans retain their existing separate scope.
- The existing 16-million-character transaction-plan limit still applies. Originals/receipts are retained; manually retaining many large journaled files can increase startup/scan time. Real large-vault performance remains unmeasured.

## Validation

**486 automated tests** pass, including 30 file-inbox cases for durable/excluded staging, exact byte/hash checks, filename/size validation, read-only previews, approval/idempotency/restart, date/provenance, frozen input, expiry, corrupt originals, base64 boundaries, PDF page/OCR modes, blank pages, failure/cancellation/limits, safe local child arguments, duplicate races, partial-write quarantine, frozen recovery, conflicts, forged journals and multi-file staging through rerenders. Native OCR protocol tests use trusted synthetic local child executables; they are not a real Tesseract binary certification.

Separate engine validation uses **PDF.js 5.6.205** and a real Tesseract LSTM engine through **Tesseract.js 7.0.0 WASM** with local German/English tessdata_fast. A two-page text PDF extracts both pages; an image-only German PDF renders and recognizes the expected synthetic text. The scan was visually rendered/inspected. Fixtures are synthetic base64 files; [recorded engine results](../tests/fixtures/file-inbox-engine-results.json) retain the observed text. This is not a broad OCR accuracy benchmark or native Obsidian/Tesseract CLI certification.

Optional reproduction: install the dev-only PDF.js/canvas packages outside a production plugin installation, make them resolvable to Node, and run `node scripts/check-file-inbox.cjs`. It expects an already installed native Tesseract and language data; use KNOWLEDGEFLOW_TESSERACT for an absolute program path. `--wasm-ocr` instead requires dev-only Tesseract.js plus KNOWLEDGEFLOW_TESSDATA pointing to local deu/eng traineddata. The script never downloads software/models or opens a vault. No dev libraries or language models are shipped in the BRAT assets.

The in-memory browser uses explicitly simulated PDF/OCR for UI acceptance: staged listing, per-page preview, initially unchecked approval, accepted filter/source access, OCR preview cancellation, post-approval search and exclusion of the unapproved scan; light/dark layout inspected. The additional file-chooser automation timed out, so chooser/drop delivery is not certified by that browser run. Native Obsidian YAML/worker integration, file-picker/drop behavior, mobile and real-document OCR/performance remain separate acceptance work. No real Obsidian vault or TaskFlow file was opened/changed during development.
