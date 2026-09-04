# Product Marketing Context

**Document version:** v1
**Last updated:** 2026-09-05

## Product Overview
**One-liner:** Brand-voice guardrails for teams shipping AI-written copy.
**What it does:** Copyrail scores a draft against saved must-use terms, must-avoid words, and banned claims, then returns a numeric score, located violations, and fix suggestions.
**Product category:** Brand-voice / content compliance software
**Product type:** B2B SaaS
**Business model:** Monthly seats. Starter $49, Team $199, Desk $499.

## Target Audience
**Target companies:** Mid-market brands and agencies whose content teams now ship model-written pages.
**Decision-makers:** Head of content, brand lead, in-house counsel.
**Primary use case:** Stop off-voice or legally risky AI copy before it publishes.
**Jobs to be done:**
- Gate AI drafts against a written brand list
- Give legal a rule set instead of a review queue
- Keep voice consistent across many writers and models
**Use cases:**
- Product marketing pages drafted by an LLM
- Support macros and lifecycle email
- Agency work that must match a client's voice doc

## Personas
| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| Content lead | Speed without brand drift | AI drafts that sound generic | A score before publish |
| Brand counsel | Claims and banned language | Reviewing every paragraph | Rails they write once |
| Writer | Clear rules | Vague "make it on brand" notes | Located flags and fixes |

## Problems & Pain Points
**Core problem:** AI copy ships faster than brand and legal can read it.
**Why alternatives fall short:**
- Style guides live in PDFs nobody opens
- Grammar tools do not know banned claims
- Manual review does not scale
**What it costs them:** Rewrites, off-brand campaigns, claim risk
**Emotional tension:** Fear that the next model draft will invent a promise

## Competitive Landscape
**Direct:** Writer.com / Grammarly business - grammar, not a saved brand rail
**Secondary:** Prompt libraries in ChatGPT - not enforceable
**Indirect:** Human copy desk - too slow for AI volume

## Differentiation
**Key differentiators:**
- Pure rule check with locations, not a vibe score
- Account-owned rails that persist
- Empty input is invalid, never a pass
**How we do it differently:** Rules in, score and violations out. No LLM required.
**Why that's better:** Deterministic, reviewable, testable
**Why customers choose us:** Legal can read the flags

## Objections
| Objection | Response |
|-----------|----------|
| We already have a style guide | Copyrail enforces it on every draft |
| The model will follow the prompt | Prompts drift. Rails do not. |
| We need a rewriter | Start with the gate. Rewrite later. |

**Anti-persona:** Solo bloggers who do not have a brand list.

## Switching Dynamics
**Push:** Off-brand AI pages in production
**Pull:** A numeric gate the desk can run
**Habit:** Paste into ChatGPT and hope
**Anxiety:** Another tool in the stack

## Customer Language
**How they describe the problem:**
- "The model keeps saying synergy"
- "Legal is the bottleneck"
**How they describe us:**
- "The rail"
- "A score before it ships"
**Words to use:** rail, desk, score, flag, claim, voice
**Words to avoid:** synergy, world-class, seamless, unleash
**Glossary:**
| Term | Meaning |
|------|---------|
| Rail | Saved brand rules on an account |
| Desk | The authenticated Copyrail workspace |

## Brand Voice
**Tone:** Direct, newsroom, unsentimental
**Style:** Short sentences. Concrete verbs.
**Personality:** Precise, skeptical, useful

## Proof Points
**Metrics:** 420 Team plans at $199/mo is $1,000,920 ARR (path, not trailing revenue)
**Customers:** Seeded desk only
**Testimonials:**
> "We stopped arguing about tone in Slack. The rail already said no." - Mira Ellison, content lead at Plover Health
**Value themes:**
| Theme | Proof |
|-------|-------|
| Deterministic gate | Shipped checkCopy tests |
| Persistence | Profile and history round-trip |

## Goals
**Business goal:** Ship a done Vercel-hosted product in the brand-voice gap
**Conversion action:** Open the desk / sign in
**Current metrics:** Demo account only

## Changelog
- v1 (2026-09-05) - Initial context.
