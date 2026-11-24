# Controlled AI automation (1.9)

## Start deliberately

The feature is optional and disabled by default. It is available in **Wissen & Quellen → KI-Automatisierung** and **Settings → KI & Budget**. Local search, quality checks, imports and task suggestions continue to work without an API key and never trigger this provider path.

1. Under **Anbieter & Kostenlimits**, enable external AI, enter current input/output prices in USD per million tokens, choose the maximum output length (128–4096), and set per-job, daily and monthly USD limits. Defaults are $0.10/$1/$5, with **zero prices and AI disabled**, so they do not permit an initial send. Prices are manually maintained, not silently fetched or assumed.
2. Enter an OpenAI API key under **API-Schlüssel · nur diese Sitzung**. It is held only in process memory, cleared from the input after setting, never persisted to queue/settings/notes, and forgotten on unload/restart. **Schlüssel vergessen & pausieren** prevents subsequent requests. Process memory and other plugins are not a secure enclave.
3. Select one to six existing KnowledgeFlow source snapshots and choose summary, proposed next steps or open questions. **Auftrag lokal vormerken** only saves a local draft; it does not authorize sending.
4. **Versand prüfen** displays the complete exact JSON request, recipient, source versions, model, assumed prices and calculated maximum reservation. Confirm the checkbox and choose **Diesen Datenversand freigeben** for that one job. Close/cancel does not approve it. **Versand ablehnen** withdraws an unsent job.
5. **Freigegebene Aufträge starten** processes approved jobs sequentially. A queued job without matching approval, changed configuration/source version or enough remaining budget cannot dispatch. Each request receives a durable running reservation first. Unapproved jobs remain local. No background schedule, automatic source scan-to-send or retry loop exists.
6. **Ergebnis prüfen** displays untrusted result text. **Als Wissensentwurf zur Prüfung speichern** explicitly adopts it as one source-pinned review draft through the knowledge journal. It opens the Review tab. Edit/review/publish through the existing knowledge workflow; task creation still uses separate checklist-to-task approval. Nothing marks provider output true or turns returned instructions into execution.

## Provider boundary

Only OpenAI Chat Completions at `https://api.openai.com/v1/chat/completions` is implemented, using pinned `gpt-4.1-mini-2025-04-14`, `n:1`, `store:false`, `stream:false`, standard service tier, no tools and an explicit `max_completion_tokens`. It uses Obsidian's native `requestUrl`; no SDK, proxy, arbitrary endpoint or provider plugin is added. Your account must permit this model. API charges/subscriptions belong to your own provider account.

Only selected source IDs, revisions, titles and exact snapshot bodies plus the shown transformation instructions/language leave the plugin. Unimported note bodies, other source snapshots, user annotations, tasks, graph contents and credentials are not added to the prompt. The session key is used only as the Authorization header to the fixed endpoint. The model receives source text as data; no result may authorize further actions.

`store:false` controls the completion-storage option. It is not a guarantee of zero provider retention, safety logging or privacy policy coverage. Check provider terms and retention before sharing sensitive content. This release does not configure your provider account.

## How local cost gates work

The queue uses integer micro-USD to avoid adding fractional dollar approximations. Before approval **and** dispatch it checks a single-job limit and current local-day/month charges/reservations. At dispatch the entire calculated maximum is saved before the HTTP call. Multiple queued approvals cannot skip the dispatch-time check.

The input allowance uses UTF-8 bytes of the exact messages plus 1,024 tokens of headroom. This is a conservative engineering estimate for this text-only adapter, not an official tokenizer or guaranteed billing bound. Output is capped in the API request. Both use the manually entered uncached input/output rates; no cache discount is assumed. Valid provider token usage settles the local reservation using those same rates. Missing/invalid/zero usage retains the full reservation. Reported cost above the reservation is retained and pauses the queue.

These gates constrain **KnowledgeFlow's calculated sends**, not your provider invoice. Incorrect or changed prices, token-accounting differences, fees/tax, other apps, other devices, past remote requests and provider-side behavior can produce different actual charges. No account-wide spending enforcement, invoice reconciliation, cross-device locking or remote request cancellation is claimed.

## Pause, restart and errors

Pause prevents the next dispatch, including while another request is awaiting a result. An already-sent request may still complete and cost money; its result can be stored for review. Closing the AI window does not cancel approved running work. Disable AI or pause explicitly to prevent later jobs.

Each plugin startup pauses the queue and forgets the key. Running jobs from an interrupted session become **Ausgang unklar**; their reservations remain charged. Ready/adopted results and existing unsent jobs survive. Nothing retries automatically. Failed/blocked/unknown work can be explicitly prepared **as a new draft** for new source/version/price review and send approval. Retained charges from unknown attempts remain counted.

At 60 seconds, a logical timeout pauses and retains the reservation. Obsidian's request API has no cancellation parameter here; a still-pending native request blocks another start within the same runtime. Late results after that timeout or unload are not silently adopted. Restarting cannot cancel an old provider-side operation. Check provider usage separately.

Queue/source/configuration conflicts block rather than overwrite. Failed writes before a durable reservation prevent network dispatch. A lost response after a matching local write is verified before continuing. See [recovery](RECOVERY.md) for interrupted result adoption and damaged queues.

## Local storage and limits

`KnowledgeFlow/Automation/queue.md` retains the reviewed request text, source hashes, price assumptions, approvals, reservations/usage, statuses and results in a vault-bound checksummed envelope. It contains **no API key**, but request/result content can still be private. It is plaintext local data and is included in normal vault backups/sync. The checksum is corruption detection, not encryption, an authenticated user signature or cross-device coordination.

There are at most 100 retained jobs, six sources per job, 12,000 UTF-8 input bytes including instructions, 24,000 result characters and eight million queue-envelope characters. Limits fail closed. History is not silently deleted or pruned to release budget; safe compaction/retention settings are future work. Result adoption uses one deterministic draft path and checks source versions, so repeated clicks or recovered partial draft writes do not create copies. Deduplication of identical requests covers their snapshot/configuration, not semantic equivalence.

## Validation and delivery scope

286 tests plus a browser workflow use synthetic data and simulated transports. They do not contact a paid provider. Browser acceptance covers disabled setup, full request preview and cancel, individual consent, manual start/accounting, pause, explicit draft adoption and the central Settings entry. Native Obsidian/mobile networking, actual account/model availability and invoice reconciliation have **not** been tested.

Only this independent repository is published. No existing TaskFlow repository, Vault1, test vault, Obsidian plugin or setting is changed.

## API references checked for this adapter

- [OpenAI Chat Completions request fields and usage](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create)
- [GPT-4.1 mini model and snapshots](https://developers.openai.com/api/docs/models/gpt-4.1-mini)
- [Current OpenAI API pricing](https://platform.openai.com/pricing/)
- [Official Obsidian requestUrl and RequestUrlParam definitions](https://github.com/obsidianmd/obsidian-api/blob/master/obsidian.d.ts)
