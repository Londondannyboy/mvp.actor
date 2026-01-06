# EsportsJobs.quest V2 - Cloud Deployment Log

## Current Status: Phase 1 Complete

**Backend Live:** https://esports-v2-agent-production.up.railway.app
**GitHub:** https://github.com/Londondannyboy/esportsjobs.quest-v2
**Railway Project:** esports-v2-agent

---

## What's Working

### Endpoints
- `/health` - Returns `{"status":"ok","agent":"esports-jobs"}`
- `/copilotkit/` - AG-UI protocol, returns 4 actions (search_jobs, lookup_company, get_job_categories, get_job_countries)
- `/chat/completions` - OpenAI-compatible SSE for Hume CLM

### Auth
- CLM_AUTH_SECRET: `esports-clm-secret-2025`

### Data
- 11 real esports job listings
- 10 company profiles (Team Liquid, Riot Games, Fnatic, etc.)

---

## Failures & Lessons Learned

### 1. LLM Integration Wasted Time (~45 mins)

**What went wrong:**
- Started with Groq `llama-3.3-70b-versatile` → Hit rate limit (100k TPD exhausted)
- Switched to `llama-3.1-8b-instant` → Model struggled with tool calls
- Switched to Google Gemini → API key was wrong type (GOOGLE_API_KEY vs GEMINI_API_KEY)
- Gemini still failed → Key not enabled for Generative AI API

**What I should have done:**
- Immediately fall back to keyword-based MVP when first LLM failed
- Or use a reliable model from the start (OpenAI GPT-4 is most stable)
- Test LLM locally BEFORE deploying to Railway
- The MVP doesn't need an LLM - simple keyword matching works fine for demo

**Current solution:**
- Keyword-based response system (no LLM dependency)
- Detects: job searches, company mentions, category queries
- Returns real job data without AI hallucination risk

### 2. Wrong Repository

**What went wrong:**
- Initially deployed to `esportsjobs.quest` (live production repo)
- User had to redirect to `esportsjobs.quest-v2` (fresh build repo)

**Lesson:**
- Always confirm target repo before deploying
- v2/fresh builds should never touch production repos

### 3. Railway CLI Issues

**What went wrong:**
- `railway variables set` syntax was wrong (it's `--set` not `set`)
- MCP Railway tools returned "not logged in" but CLI worked fine
- Had to use bash Railway CLI directly

**Lesson:**
- When MCP tools fail, fall back to direct CLI
- Check `railway --help` for correct syntax

### 4. Pydantic AI Result Attribute

**What went wrong:**
- Used `result.data` but pydantic-ai uses `result.output`
- Caused 500 errors on Railway

**Lesson:**
- Check library documentation for correct API
- Test locally before deploying

---

## Environment Variables

### Railway (set)
```
CLM_AUTH_SECRET=esports-clm-secret-2025
```

### Railway (not needed for MVP)
```
GROQ_API_KEY=xxx (rate limited)
GEMINI_API_KEY=xxx (key issues)
```

### Vercel (Phase 2+)
```
HUME_API_KEY=xxx
HUME_SECRET_KEY=xxx
NEXT_PUBLIC_HUME_CONFIG_ID=xxx
```

---

## Phase 2 Requirements

### CopilotKit Frontend
1. Create Next.js app in repo root
2. Install: `@copilotkit/react-core @copilotkit/react-ui`
3. Create `/api/copilotkit/route.ts` proxy to Railway
4. Wrap app with CopilotProvider
5. Add CopilotSidebar to homepage

### Key File: `/app/api/copilotkit/route.ts`
```typescript
import { CopilotRuntime, copilotRuntimeNextJSAppRouterEndpoint } from "@copilotkit/runtime";

const runtime = new CopilotRuntime({
  remoteEndpoints: [{
    url: "https://esports-v2-agent-production.up.railway.app/copilotkit",
  }],
});

export const POST = async (req: Request) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    endpoint: "/api/copilotkit",
  });
  return handleRequest(req);
};
```

---

## Test Commands

```bash
# Health check
curl https://esports-v2-agent-production.up.railway.app/health

# Chat (non-streaming)
curl -X POST https://esports-v2-agent-production.up.railway.app/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer esports-clm-secret-2025" \
  -d '{"messages":[{"role":"user","content":"Find marketing jobs"}],"stream":false}'

# CopilotKit info
curl https://esports-v2-agent-production.up.railway.app/copilotkit/
```

---

## Future LLM Integration

When ready to add real AI:

1. **OpenAI (most reliable)**
```python
from pydantic_ai.models.openai import OpenAIModel
model = OpenAIModel("gpt-4o-mini")  # Cheap and fast
```
Env: `OPENAI_API_KEY`

2. **Anthropic Claude**
```python
from pydantic_ai.models.anthropic import AnthropicModel
model = AnthropicModel("claude-3-haiku-20240307")
```
Env: `ANTHROPIC_API_KEY`

3. **Groq (fast but rate limited)**
```python
from pydantic_ai.models.groq import GroqModel
model = GroqModel("llama-3.1-8b-instant")  # Use smaller model
```
Env: `GROQ_API_KEY` - Watch rate limits!

---

## Remaining Phases

- [ ] Phase 2: CopilotKit Frontend
- [ ] Phase 3: Three.js Esports Arena Hero
- [ ] Phase 4: Hume Voice Integration
- [ ] Phase 5: 3D Avatar

---

*Last updated: 2026-01-06*
