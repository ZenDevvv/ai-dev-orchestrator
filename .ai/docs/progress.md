# Progress Tracker

<!--
Auto-appended by each phase command on completion.
Do not edit manually - rows are written by the phase scripts.

Canonical logging spec for all commands:
1) If this file does not exist, create it with the standard header/table below.
2) Every log entry is one table row with exactly 6 columns:
   | Phase | Name | Scope | Status | Timestamp | Notes |
3) Timestamp format is local datetime: YYYY-MM-DD HH:mm:ss
4) Status values must use the workflow statuses:
   - ✅ Complete
   - ⚠️ Stale
   - 🔄 Changed
   - 🚀 Started
   - 🏁 Finished
5) Use these event mappings:
   - Phase completion:
     Phase={phase id}, Name={phase name}, Scope={scope or —}, Status=✅ Complete
   - Build started:
     Phase=BUILD, Name=Build Run, Scope=all, Status=🚀 Started
   - Build finished:
     Phase=BUILD, Name=Build Run, Scope=all, Status=🏁 Finished
   - Change logged:
     Phase=—, Name=Change, Scope={CHG-NNN}: {feature name}, Status=🔄 Changed
6) When marking stale rows, update an existing matching row:
   - Status: ✅ Complete -> ⚠️ Stale
   - Append stale reason and timestamp in Notes
-->

| Phase | Name | Scope | Status | Timestamp | Notes |
|-------|------|-------|--------|-----------|-------|
