# REQ-005: AI Features

**Status:** done
**Phase:** 2 (AI + ATS)
**Priority:** p1-high
**Depends on:** [[REQ-007-auth-cloud-sync]]
**Blocks:** none

## Description

AI-powered writing assistance for resume content. Uses Cloudflare Workers AI (free tier) as default, with option to bring your own API key for OpenAI/Anthropic. AI helps generate bullet points, improve writing, suggest skills, and tailor content to job descriptions.

## Acceptance Criteria

1. **Bullet point generator** — given job title + brief description, generates 3-5 achievement-oriented bullets
2. **Content improver** — rewrites a bullet to be stronger (quantified, active voice, results-driven)
3. **Summary writer** — generates professional summary from resume content + target role
4. **Skills suggester** — given job title or JD, suggests relevant skills
5. **Job tailoring** — paste a job description, AI highlights what to emphasize and suggests rewrites
6. AI panel appears as a sidebar or inline within the editor
7. Responses return as a full JSON payload (Workers AI `env.AI.run`; token streaming deferred — `workers-ai-provider` needs AI SDK v7, stack is `ai@6`)
8. Free tier: 5 AI requests per day (using Workers AI)
9. Pro tier: unlimited AI requests (`tier === "pro"` skips the D1 cap; Stripe is Phase 3)
10. All AI output is clearly marked as "AI-generated" and user must explicitly accept changes
11. AI never invents facts — it only works with what the user has provided
12. Rate limiting is account-based in D1. AI requires sign-in (no anonymous IP quota in Phase 2).

## Data Contract

```typescript
type AIAction = 
  | { type: 'generate-bullets'; jobTitle: string; description: string; count?: number }
  | { type: 'improve-bullet'; original: string; context?: string }
  | { type: 'write-summary'; resumeData: Partial<Resume>; targetRole?: string }
  | { type: 'suggest-skills'; jobTitle?: string; jobDescription?: string }
  | { type: 'tailor-resume'; resumeData: Resume; jobDescription: string };

interface AIResponse {
  content: string;
  action: AIAction['type'];
  streaming: boolean;
}
```

## Edge Cases

1. Workers AI rate limit hit — graceful error with "try again later" message
2. AI generates inappropriate content — content filtering
3. Very long job description input — truncate to model context limit
4. Network failure during streaming — show partial result with retry option
5. User has no resume content yet — AI needs minimal input to work with
6. Non-English content — AI should handle multilingual input

## Affected Files

- `src/lib/ai/prompts.ts` — Prompt templates for each AI action
- `src/lib/ai/client.ts` — AI SDK client configuration
- `src/app/api/ai/route.ts` — AI proxy API route
- `src/components/editor/AIPanel.tsx` — AI assistant UI
- `src/components/editor/AIInlineButton.tsx` — Inline AI action buttons on each section
- `src/lib/hooks/use-ai-action.ts` — Hook for invoking AI actions

## Tasks

- [[TASK-P2-001-ai-prompts]] — Design and test all AI prompt templates
- [[TASK-P2-002-ai-api]] — Build AI proxy API route with rate limiting
- [[TASK-P2-003-ai-panel]] — Build AI assistant panel UI
- [[TASK-P2-004-ai-inline]] — Add inline AI buttons to editor sections
- [[TASK-P2-005-ai-tailoring]] — Implement job description tailoring
