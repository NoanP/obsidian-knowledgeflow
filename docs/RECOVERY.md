# Knowledge changes and recovery (1.4)

## User workflow

1. Open **Wissen & Quellen → Änderungsprotokoll**. Completed knowledge operations show their time, action and affected file count. Expand a review to compare readable content and, if needed, exact full Markdown.
2. An interrupted operation appears first. Further knowledge writes pause; affected records are withheld from the knowledge index and graph until completion. The home scene links to recovery.
3. Open **Fassungen prüfen**. The view identifies already-written, pending and conflicting files and checks referenced sources. After checking the saved plan, choose **Geprüfte Änderung fortsetzen**.
4. Recovery writes only pending outputs. It verifies unchanged current files and source dependencies again. Any divergence or stale preview stops it. Close, resolve the file conflict carefully, and reopen the preview; there is no force-overwrite button.
5. Completed published-page changes can load their prior content as a new draft against the current page. Normal source validation and explicit publishing still apply. Current personal annotations and unknown target metadata are retained. This is a content revision proposal, not a byte-for-byte rollback of every metadata field.

An invalid journal pauses the entire knowledge index until resolved; its affected paths cannot safely be inferred. On startup, journals are discovered without applying them. Closing a recovery review never authorizes a write. Existing old history and human-readable audit files remain available. No automatic migration, pruning, source reprocessing or external provider is involved.

## Persisted protocol

- Scope: `KnowledgeFlow/Wissen/{Quellen,Entwuerfe,Seiten,Verlauf,Protokoll}`. Source snapshots remain create-only. Version 1.8 adds the narrowly validated `task-approve` action: one create-only owned task and audit, with published-note/source pins and a reviewed project snapshot. Other task edits, recurrence, project settings, plugin settings and trash operations remain outside this transaction layer.
- `Aenderungen/<uuid>.md` is a sealed JSON plan with schema marker, action/time, exact original and intended text, SHA-256 per version, source-dependency hashes and vault/root binding. It is created before any record writes.
- The desktop binding hashes the vault base path and owned root. When no base path is available, it hashes the vault name and root; this fallback cannot distinguish two vaults with the same name. Renaming/moving a vault may intentionally block replay of its older plans. Inspect and recover before moving the vault; manually review moved/foreign plans rather than editing their binding blindly.
- Plans accept at most 256 total writes and 16 million characters. Path scope, roles, duplicate paths and content hashes are revalidated when read. Checksums detect accidental damage; they are not signatures or a defense against someone who can rewrite vault files and recompute hashes.
- Existing records use `Vault.process` with exact before-text checks inside the update callback. New files use create-only operations. Writer coordination is shared by cooperating calls using the same Vault object in this runtime, not other devices or external applications.
- Recovery approval binds to the exact plan and current file/source hashes. A late edit cannot be silently accepted using an old preview. Missing existing targets and content matching neither saved version require manual resolution.
- After every output and dependency matches, `<uuid>.done.md` records a checksummed completion receipt bound to the exact plan hash. Missing receipts are pending; malformed receipts or missing plans block knowledge writes.
- The receipt establishes what was verified then. Later external edits do not retroactively change completed history. Complete histories do not automatically replay.

## Failure limits and retention

Interrupted operations retain both saved snapshots and any partial output. They do not automatically delete files or roll back external edits. A later source conflict may leave already-written output in place but unindexed until reviewed recovery succeeds. A damaged journal requires careful manual inspection and restoration from a trusted backup; do not delete the warning file simply to clear the blocker.

Completed Vault calls are the persistence boundary available to this plugin. It cannot force filesystem flushes, atomically commit multiple files, prevent all sync races, replace an independent backup or reconstruct a lost/corrupt journal. Recovery has automated simulated-interruption coverage, not certification against power loss or arbitrary storage corruption. Multi-device editing remains an external coordination concern.

Plans contain local copies of original and new text, including annotations. They share the vault's existing storage/sync/backup permissions and are not separately encrypted. No external transmission is added. History is never silently pruned, so storage grows with edits; retention management is a future explicit feature.

## Task suggestion approvals (1.8)

A failed approval refreshes the change log even when an API failed after persisting. Its task output is withheld from the task view until a matching completion receipt exists. Open the saved transaction, compare the reviewed task text and dependencies, then explicitly resume. Already-written task bytes are verified and skipped; recovery never creates a second task. Changed note/source bytes, divergent task content, a changed project or task-folder setting block recovery. Resolve these conflicts deliberately; do not edit sealed plans to bypass them. A matching receipt after a lost API response counts as completed.

When the journal is invalid, generated `knowledge-<hash>` tasks are withheld as well as the knowledge index because affected task paths cannot be trusted. Independent ordinary tasks keep their existing behavior. A later legitimate project rename or folder change does not invalidate a completed historical plan. Completed task creations do not have a previous task version: use the normal recoverable task trash for undo. General project/task operations do not acquire full journal rollback by this release.

## AI queue recovery (1.9)

The queue is separate vault-bound optimistic state, not a knowledge journal plan. On plugin startup it remains paused; interrupted `running` reservations become `uncertain` without sending again. Re-enter the session key and explicitly start only previously approved queued jobs. Unknown/failed attempts retain full calculated reservations; new attempts require a fresh local draft and data-transfer approval. Verify provider-side usage separately before any manual reconciliation; do not edit queue charges to bypass limits.

Pause prevents later dispatch but does not cancel a paid request already accepted by the provider. A 60-second local timeout marks the result unknown, retains its reservation and pauses. A still-pending native request blocks starting another request in the same runtime; a late response is ignored, not silently adopted or retried. A process restart cannot cancel an old remote request.

Unreadable/foreign/conflicting queue files block AI operations and are preserved. Restore from a trusted backup after comparing retained requests and provider usage; there is no automatic overwrite or reset button. The seal detects corruption, not malicious control of the vault or cross-device races. General backup remains necessary.

Result adoption uses the knowledge change journal and a deterministic draft path. If interrupted, inspect and resume that transaction first; repeating adoption then finds the same existing draft. No provider request is repeated as part of draft recovery. Completed draft creation is undone through normal knowledge draft/archive handling rather than deleting cost history.

## Personal inbox (1.11)

Capture/edit/archive/restore/conversion are journaled. A conversion plan includes the exact personal source snapshot (unless reused), review draft and processed original; newly staged sources are hash-verified before the plan is persisted. Recovery handles already-written identical outputs and rejects changed targets. An identical capture/conversion retry retains its identity after completion, including after restart. Review pending transactions before retrying. Unsaved capture text exists only in session memory and cannot be recovered from the journal; Cancel on an edit discards unsaved input.

## Reviewed connections (1.12)

A link-approve plan can change only the origin related IDs and updated time, with one history and audit record. Selected published target snapshots are hash-pinned read dependencies, never writes. Pending approvals quarantine the origin. A changed target/origin blocks explicit recovery; identical persisted output is reused. After success an identical retry adds no copy. See [link suggestion workflow](LINK-SUGGESTIONS.md).
