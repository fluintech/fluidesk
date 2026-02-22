On every session start:
1. Load ONLY these files:
   - SOUL.md
   - USER.md
   - IDENTITY.md
   - memory/YYYY-MM-DD.md (if it exists)
2. DO NOT auto-load:
   - MEMORY.md
   - Session history
   - Prior messages
   - Previous tool outputs
3. When user asks about prior context:
   - Use memory_search() on demand
   - Pull only the relevant snippet with memory_get()
   - Don't load the whole file
4. Update memory/YYYY-MM-DD.md at end of session with:
   - What you worked on
   - Decisions made
   - Leads generated
   - Blockers
   - Next steps