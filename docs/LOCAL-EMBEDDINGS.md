# Local semantic search (1.18)

## Setup and use

This is a separately activated **Obsidian Desktop** search mode. The BRAT plugin still has no new npm/runtime package dependency; inference needs a separately installed Ollama process and model. Repository development does not install either into Obsidian or change any vault.

1. Install Ollama yourself from its [official download](https://ollama.com/download). Review the model's [license and limitations](https://huggingface.co/google/embeddinggemma-300m) before downloading/using it.
2. Start Ollama in local-only mode. For a manually started server: `OLLAMA_NO_CLOUD=1 ollama serve`. If an Ollama app/server already runs, configure its local-only mode and restart it yourself; do not start a second server on the occupied port. [Official local-only configuration](https://docs.ollama.com/faq#how-do-i-disable-ollamas-cloud-features).
3. Separately run `ollama pull embeddinggemma:300m`. The current official model is approximately 622 MB and requires Ollama 0.11.10 or later. This model download uses the internet; subsequent local inference does not need a cloud model. [Official model](https://ollama.com/library/embeddinggemma).
4. Open **Wissen & Quellen → Wissenssuche → Lokale Embeddings · Einrichtung & Datenschutz**. Choose **Lokales Modell verbinden**. Connection checks local metadata only; no note is sent at this stage.
5. Select **Semantisch · lokale Embeddings**, choose notes/sources/both, enter a free question and click **Antwort suchen**. This explicit action indexes the bounded selected corpus locally and embeds the question. Cached documents are reused on later searches; there is no background indexing.

Missing model/server errors are shown rather than falling back to another provider. Word/concept modes still work without Ollama. Use word search for exact identifiers, dates and codes. Connecting does not save a setting; reload requires explicit reconnection. The model and endpoint are fixed in this release, not arbitrary configurable provider URLs.

## Privacy and scope

KnowledgeFlow talks only to the numeric loopback address `127.0.0.1:11434` using built-in desktop HTTP, with fixed `/api/tags` and `/api/embed` routes. There is no DNS resolution, proxy setting, automatic redirect follow, arbitrary URL, API key, model pull, chat endpoint or cloud fallback in this feature. The selected fixed model must appear as a local model with a valid digest and positive size; known remote-model fields are rejected. Run a trusted local Ollama installation with cloud disabled. A loopback connection cannot prove that an arbitrary replacement/proxy service is trustworthy or independently attest its actual computation.

An explicit search transfers the selected owned, eligible note **titles and quoted passage text**, plus the question, to this local process. Sources are immutable owned imports; original outside notes are not read. Inbox/drafts/archives, generated connection blocks and journal artifacts remain excluded. Imported chat sources expose only their active transcript branch. Personal annotations form their own searchable, labeled section. The preceding owned-record scan retains its normal scope; selected search scope restricts the passages sent for embedding, not all metadata reads performed by that scan.

The plugin saves no query, vector, index, result, note, setting or history entry while searching. Vectors are transient derived data, never real graph edges or approvals. The fixed local-inference exception does not enable the separate paid AI automation queue and is never called by startup, quality checks, link suggestions or task generation. No source content can instruct the plugin to change endpoints or execute actions.

## How matching works

EmbeddingGemma maps text into 768-dimensional dense vectors; no dictionary word overlap is required. Document inputs use `title: <title> | text: <passage>` and questions use `task: search result | query: <question>` as documented in the [original model card](https://huggingface.co/google/embeddinggemma-300m#prompt-instructions). The [Ollama embedding API](https://docs.ollama.com/api/embed) receives batches of at most eight inputs with `truncate:false`: over-context inputs fail instead of silently losing text. No source quote is rewritten.

Vectors must have the expected model, count and dimension, finite bounded values and nonzero norms. They are normalized before cosine comparison. Results are sorted by cosine, then stable note path/offset, with copied excerpts deduplicated, at most six results and two per record. Title context can influence semantic relevance; inspect the quoted body rather than assuming the title establishes support. Exact word/concept modes retain their previous ranking.

The configurable cutoff defaults to **0.20**, with choices from 0.10 to 0.85. These numbers are raw cosine values, not percentages or confidence. Higher cutoffs remove weak matches but can also exclude useful paraphrases. The default is an initial usability choice informed by a tiny synthetic fixture, not a calibrated guarantee for real material. A no-hit result does not prove the information is absent. Embeddings can confuse negation, nearby topics, ambiguous wording and numeric facts. No factual answer synthesis, contradiction resolution or automatic relation is introduced.

## Lifecycle and bounds

The existing extraction index bounds remain: 500 records, 4M text characters, 5,000 chunks, 200,000 characters per record, 900-character passages. Semantic inference selects at most the first **512 eligible chunks** in stable order after scope filtering. Results disclose chunk omissions and partially/unindexed note paths; a late note may remain unembedded. This is bounded exact vector comparison, not full-vault exhaustive search or a persistent vector database.

The cache holds at most 512 normalized Float32 vectors (about 1.5 MiB of numeric vector storage, excluding keys/index/record snapshots). Cache keys include model digest, full raw-record hash, section and offsets. Only the current selected chunk keys are retained. A model digest change clears vectors and requires reconnection; digest is checked before and after inference. A full corpus refresh after inference rejects stale snapshots, including journal quarantine changes. Citation inspection/opening independently rechecks raw hash and exact offsets.

**Suche abbrechen** stops subsequent batches, closes an in-flight local HTTP request and discards late results. Started server work may finish; this is not a guarantee of instantly stopping CPU/GPU computation. Partial vectors remain reusable until cleared. **Trennen & Index verwerfen** cancels, disables the session and clears the cache. Unloading does the same. Navigating away is checked before further dispatch; an already-running batch may complete before navigation is detected. No jobs resume automatically. Ollama's separately managed process is not stopped or reconfigured by KnowledgeFlow; requests ask to keep the model loaded for one minute.

Network requests have a 60-second total deadline and a 2 MB response cap. Redirects/non-200, malformed JSON, mismatched model/count/dimension, zero/non-finite vectors, concurrent jobs, cancellation, model changes and corpus changes fail closed. No silent retry or replacement ranking is labeled as semantic success.

## Validation and practical limits

**456 automated tests** pass, including 28 embedding-specific protocol/lifecycle/integration cases. Synthetic vectors test algorithm behavior, scope, cache invalidation, cancellation, model/corpus changes, active chat branches, preserved citation offsets and no writes. Real loopback HTTP fixture tests verify fixed request options, redirect refusal, oversized/malformed/stalled responses and cancellation. These tests do not attest a real Ollama installation.

A separate test used the actual `embeddinggemma:300m` GGUF with SHA-256 `0800cbac9c2064dde519420e75e512a83cb360de3ad5df176185dc69652fc515`. The same weights ran through an isolated llama.cpp CPU server with a test-only Ollama-shape adapter. Eight authored German paraphrase questions searched eight synthetic notes: expected note top-1 in **7/8**, top-3 in **8/8** at cutoff 0.20. This demonstrates actual learned embeddings, not dictionary lookup; it is a small development regression set, not an independent benchmark, corpus-scale performance evaluation or native Ollama/Obsidian certification. No user notes were used. [Recorded results](../tests/fixtures/embedding-model-acceptance.json).

Optional reproduction: `node scripts/check-local-embeddings.cjs` against an already running, user-configured local Ollama exercises production loopback transport. The development-only `--llama-cpp-test` flag instead uses loopback port 18500 for an explicitly started isolated llama.cpp server with the same model, retrieval prefixes, mean pooling and normalized vectors. The script never downloads software or opens a vault. CI does not start/download a model.

The isolated browser host uses clearly labeled **simulated** embeddings to test setup, pre-activation refusal, search, exact evidence inspection, disconnect/index discard, word-only control and light/dark layout. Model quality was tested separately above. A UI default cutoff formatting bug found in browser testing was fixed before release. Native Obsidian/Electron behavior, real Ollama end-to-end use, mobile and real-vault performance remain separate validation work. No Obsidian session or vault was opened/changed.
