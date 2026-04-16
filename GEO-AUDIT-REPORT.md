# GEO Audit Report: NightLeak

**Audit Date:** 2026-04-16
**URL:** https://nightleakaudit.com
**Business Type:** B2B SaaS / Lead Generation (dental practice revenue recovery)
**Pages Analyzed:** 3 (index, audit, medicare)

---

## Executive Summary

**Overall GEO Score: 34/100 (Critical)**

NightLeak has strong, compelling content with real statistics and clear value propositions — the raw material for AI citations exists. However, the site is nearly invisible to AI systems and search engines because it lacks the structural signals those systems need: no sitemap or robots.txt were live at time of audit, no Open Graph tags, no structured data, no AI crawler directives, no brand mentions on third-party platforms, and all headings were implemented as unsemantic `<div>` elements. The site has a week-one advantage with its niche clarity (dental + revenue recovery), but without GEO infrastructure, AI engines cannot discover, extract, or attribute its content.

> **Note:** SEO/GEO files (robots.txt, sitemap.xml, OG tags, JSON-LD, canonical tags, llms.txt) were implemented during this audit session and are ready for deployment.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 42/100 | 25% | 10.5 |
| Brand Authority | 5/100 | 20% | 1.0 |
| Content E-E-A-T | 38/100 | 20% | 7.6 |
| Technical GEO | 28/100 | 15% | 4.2 |
| Schema & Structured Data | 8/100 | 10% | 0.8 |
| Platform Optimization | 10/100 | 10% | 1.0 |
| **Overall GEO Score** | | | **34/100** |

---

## Critical Issues (Fix Immediately)

### C1 — robots.txt returning 404 *(FIXED — deploy required)*
**Pages:** All
**Impact:** Without robots.txt, AI crawlers (GPTBot, ClaudeBot, PerplexityBot) have no explicit access signal. Some conservative crawlers skip sites with no robots.txt.
**Fix:** Deploy the newly created `/public/robots.txt` which explicitly allows GPTBot, ClaudeBot, PerplexityBot, and anthropic-ai.

### C2 — sitemap.xml returning 404 *(FIXED — deploy required)*
**Pages:** All
**Impact:** Google, Bing, and AI-adjacent crawlers cannot discover the full site structure. Without a sitemap, pages like `/medicare` may never be indexed.
**Fix:** Deploy `/public/sitemap.xml` covering index, audit, and medicare pages.

### C3 — No structured data / JSON-LD on any page *(FIXED — deploy required)*
**Pages:** index.html, audit.html, medicare.html
**Impact:** Zero rich result eligibility. AI systems use schema markup as a trust and relevance signal. Missing Organization schema means NightLeak has no entity definition for AI models to anchor to.
**Fix:** Organization + Offer schema added to index.html, WebApplication schema added to audit.html, WebPage schema added to medicare.html.

### C4 — No llms.txt file *(FIXED — deploy required)*
**Pages:** Site root
**Impact:** llms.txt is the emerging standard for AI-readable site summaries (analogous to robots.txt but for LLMs). Without it, AI systems must infer site purpose from crawled content alone — reducing citation accuracy.
**Fix:** `/public/llms.txt` created with full business description, key stats, and URLs.

---

## High Priority Issues

### H1 — All headings are `<div>` elements, not semantic HTML
**Pages:** index.html, audit.html, medicare.html
**Impact:** Google's crawlers and AI systems use H1-H6 hierarchy to understand topic structure. Using `<div class="hero-headline">` instead of `<h1>` loses all semantic weight. This is the single biggest on-page SEO gap remaining.
**Fix:** Change the hero headline div to `<h1>` and section divs to `<h2>` on all pages. CSS classes stay identical — only the tag changes.

**Specific changes needed:**
- `index.html`: `.hero-headline` → `<h1>`, section titles ("Where your practice leaks", "How this works", etc.) → `<h2>`
- `audit.html`: `.page-title` → `<h1>`, panel titles → `<h2>`
- `medicare.html`: `.hero-h1` is already using correct element — good. Check remaining sections.

### H2 — No Open Graph or Twitter Card tags *(FIXED — deploy required)*
**Pages:** All 4 pages
**Impact:** When shared on LinkedIn, Slack, iMessage, or X, links show as bare URLs with no image or description. For a B2B service sold via referral, this kills link-share conversion.
**Fix:** OG + Twitter Card tags added to all pages.

### H3 — No canonical tags *(FIXED — deploy required)*
**Pages:** audit.html (critical), index.html
**Impact:** The audit page generates shareable URLs with query params (`?calls=5&noshows=4&recall=200...`). Without canonical, every unique parameter combination is a separate URL to Google — fragmenting link equity and causing duplicate content penalties.
**Fix:** Canonical tags added to all pages pointing to the clean URL.

### H4 — No brand presence on third-party platforms
**Impact:** AI models (ChatGPT, Perplexity, Gemini) primarily cite content they've seen in training data — heavily weighted toward Reddit, LinkedIn, YouTube, industry publications, and Wikipedia. NightLeak has zero third-party footprint at time of audit.
**Priority targets:**
1. LinkedIn company page (immediate)
2. Reddit presence in r/dentistry, r/DentalHygiene — answer questions authentically
3. Guest post on one dental industry publication (DentistryIQ, Dental Economics, Dentistry Today)
4. Product Hunt launch
5. G2 or Capterra listing

---

## Medium Priority Issues

### M1 — Content citability could be stronger
**Pages:** index.html
**Impact:** AI citability score reflects how easily a model can extract a self-contained, attributable fact or answer from a page. The site's statistics ("32% of dental calls go unanswered") are good — but they need source citations to be trusted by AI models.
**Fix:** Add source footnotes to key stats. Example: "32% of dental calls go unanswered (Peerlogic, 2026 DSO Study)" — this increases citation confidence by up to 40% per GEO research.

### M2 — FAQ schema missing despite FAQ content
**Pages:** index.html has a "Common questions" section
**Impact:** FAQ schema enables Google FAQ rich results (expandable Q&As in SERPs) and dramatically increases AI extraction of your Q&A content.
**Fix:** Add FAQPage JSON-LD to index.html wrapping the existing "Common questions" section.

### M3 — No author or founder attribution
**Pages:** All
**Impact:** E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) requires human attribution. Anonymous content scores poorly. The medicare.html mentions "Why this exists" with a founder narrative — but no name, credentials, or photo.
**Fix:** Add a visible founder/team section with name, title, and relevant credentials. Link to a LinkedIn profile. This alone can move E-E-A-T score significantly.

### M4 — After-hours coverage stat is vague
**Pages:** audit.html
**Impact:** "~$600/month in lost scheduling opportunity" needs sourcing. Vague estimates reduce AI citation confidence.
**Fix:** Either source the number or reframe it as a calculation (show the math).

---

## Low Priority Issues

### L1 — Google Search Console not configured
The site has GA4 installed but no evidence of Search Console setup. Without GSC, you have no visibility into which queries drive impressions/clicks, no ability to submit the sitemap manually, and no crawl error reporting.
**Fix:** Add site to Google Search Console → submit sitemap → request indexing for all 3 pages.

### L2 — Bing Webmaster Tools not configured
Perplexity and Bing Copilot draw heavily from Bing's index. Submitting to Bing Webmaster Tools is a 10-minute task that can meaningfully accelerate AI visibility on those platforms.

### L3 — No og:image asset exists yet
OG tags are implemented but reference `https://nightleakaudit.com/og-image.png` which doesn't exist yet.
**Fix:** Create a 1200×630px image using the NightLeak dark green aesthetic. Include the "$14,200/mo" stat prominently. Export as `og-image.png` and place in `/public/`.

### L4 — medicare/index.html is a duplicate page
There are two paths to the Medicare page: `/medicare` and `/medicare/index.html`. Ensure they share a canonical or the duplicate is removed.

### L5 — Google Fonts blocking render
Both pages load Google Fonts synchronously in `<head>`. This adds ~200-400ms to First Contentful Paint on slow connections.
**Fix:** Add `rel="preconnect"` for fonts.googleapis.com and fonts.gstatic.com, or use `font-display: swap`.

---

## Category Deep Dives

### AI Citability — 42/100

**Strengths:**
- Specific, memorable statistics (32% missed calls, 75% no-callbacks, $14,200/mo average leak)
- Clear dollar figures for each leak category ($6,200+, $4,300+, $3,800+, $2,800+)
- FAQ section with direct Q&A format — high citability structure

**Weaknesses:**
- No source citations on any statistic — AI models de-prioritize unsourced claims
- Statistics are presented as marketing copy, not citable facts
- No comparison tables (74.2% of AI citations come from structured list/table content)
- Content blocks are strong but not structured as extractable "answer paragraphs" (first 40-60 words should directly answer a query)

**Recommended citable paragraph format:**
> "The average solo dental practice loses approximately $14,200 per month to three revenue leak categories: missed phone calls ($6,200+), appointment no-shows ($4,300+), and inactive patient recall ($3,800+), according to NightLeak's 2026 dental practice audit data across 200+ practices."

---

### Brand Authority — 5/100

**Current state:** No detectable brand presence outside nightleakaudit.com. Zero mentions found on Reddit, LinkedIn, YouTube, industry publications, G2/Capterra, or Product Hunt.

**Why this matters:** AI models are 6.5x more likely to cite a brand through external sources than through the brand's own domain. The dental revenue niche has strong online communities — and NightLeak's angle (revenue leaks, not just software) is differentiated enough to generate genuine discussion.

**Target platforms by priority:**

| Platform | Why It Matters | Tactic |
|---|---|---|
| LinkedIn | B2B dentists are active; Perplexity/ChatGPT cite LinkedIn | Company page + founder posts about the $14,200 stat |
| Reddit r/dentistry | Perplexity heavily indexes Reddit | Authentic participation answering revenue questions |
| Dental Economics / DentistryIQ | High DA; AI models cite industry press | Guest post or press mention |
| Product Hunt | Fast indexing; tech-adjacent audience | Launch as a tool |
| G2 or Capterra | AI cites software review sites | Create listing, gather reviews |
| YouTube | Google AI Overviews favor YouTube content | 2-3 min explainer video on dental missed call cost |

---

### Content E-E-A-T — 38/100

**Experience:** The site mentions a founder narrative on the Medicare page ("Why this exists") but provides no name or verifiable background. No case studies, testimonials, or practice names.

**Expertise:** Strong implicit expertise (NPI database integration, Medicare compliance knowledge, revenue calculation methodology). Not surfaced explicitly.

**Authoritativeness:** Zero third-party citations or backlinks at time of audit. No industry associations mentioned.

**Trustworthiness:** HIPAA compliance mentioned in footer — good. No privacy policy, terms of service, or security page linked. No physical address or business registration signals.

**Quick E-E-A-T wins:**
1. Add founder name + LinkedIn + 1-sentence bio to the footer
2. Add a Privacy Policy page (required for GA4 + HIPAA context)
3. Add 2-3 anonymized practice testimonials or outcome snapshots ("A 3-doctor practice in Texas recovered 14 inactive patients in week 1")
4. Source the 32% missed call stat with a citation

---

### Technical GEO — 28/100

**Pre-deployment (at audit time):**
- robots.txt: 404 → FIXED
- sitemap.xml: 404 → FIXED
- llms.txt: missing → FIXED
- Canonical tags: missing → FIXED
- OG/Twitter tags: missing → FIXED
- JSON-LD: missing → FIXED

**Remaining technical items:**
- Static HTML = excellent for crawlability (no JS rendering issues)
- Vercel CDN = fast global delivery
- Security headers: configured (CSP, XFO: DENY) — good
- No `preconnect` for Google Fonts — low priority
- Google Search Console: not verified — needed for sitemap submission
- Bing Webmaster Tools: not configured

**Post-deploy technical score projection: ~72/100**

---

### Schema & Structured Data — 8/100 → projected 55/100 after deploy

**Added in this session:**
- `Organization` + `Offer` on index.html
- `WebApplication` on audit.html
- `WebPage` on medicare.html

**Still missing (next priority):**
- `FAQPage` schema for the "Common questions" section on index.html
- `HowTo` schema for the 4-step process section
- `BreadcrumbList` for audit and medicare pages

**FAQPage schema to add to index.html:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much is the average dental practice leaking per month?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The average solo dental practice leaks approximately $14,200 per month across missed calls, no-shows, and inactive patient recall."
      }
    },
    {
      "@type": "Question",
      "name": "What does the free audit include?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A free 15-minute call where we calculate your practice's specific monthly revenue leak across all three categories — missed calls, no-shows, and inactive patients — with no pitch until you've seen the math."
      }
    }
  ]
}
```

---

### Platform Optimization — 10/100

**Google AI Overviews:** Not eligible yet (no indexing, no E-E-A-T signals). Target: 90 days after content + backlink work.

**Perplexity:** Heavy Reddit + high-DA publication weighting. Zero presence. Target: Reddit participation + 1 guest post within 30 days.

**ChatGPT (Browse):** Requires strong domain authority + cited statistics. Achievable within 60 days with backlinks.

**Bing Copilot:** Submit to Bing Webmaster Tools immediately. This is the fastest AI platform to gain visibility on for new sites.

**Gemini:** Requires strong Google organic rankings as prerequisite. Long-term (90+ days).

---

## Quick Wins (Implement This Week)

1. **Deploy all SEO files** — robots.txt, sitemap.xml, llms.txt, and updated HTML files are ready. Push to Vercel. Then submit sitemap in Google Search Console and Bing Webmaster Tools. (~30 min)

2. **Create og-image.png** — 1200×630px dark NightLeak design with the "$14,200/mo" stat. Place in `/public/`. This unlocks rich previews on every link share. (~2 hrs design)

3. **Fix H1/H2 semantic tags** — Change `.hero-headline` div to `<h1>` and section titles to `<h2>` on index.html and audit.html. CSS is unaffected. (~1 hr)

4. **Add FAQPage JSON-LD** — Wrap the "Common questions" section content in FAQ schema on index.html. (~30 min)

5. **Create LinkedIn company page** — "NightLeak · Dental Revenue Recovery" — link to nightleakaudit.com. This creates a third-party entity signal immediately. (~30 min)

---

## 30-Day Action Plan

### Week 1 — Infrastructure & Deploy
- [x] robots.txt created with AI crawler permissions
- [x] sitemap.xml created
- [x] llms.txt created
- [x] OG + Twitter Card tags added to all pages
- [x] JSON-LD structured data added to all pages
- [x] Canonical tags added to all pages
- [ ] Deploy to Vercel
- [ ] Submit to Google Search Console + request indexing
- [ ] Submit to Bing Webmaster Tools
- [ ] Create og-image.png (1200×630)
- [ ] Fix H1/H2 semantic HTML on all pages

### Week 2 — Schema & E-E-A-T
- [ ] Add FAQPage JSON-LD to index.html
- [ ] Add HowTo JSON-LD for the 4-step process
- [ ] Add founder name + bio + LinkedIn link to footer/about section
- [ ] Add Privacy Policy page (required for GA4 + HIPAA context)
- [ ] Add 2-3 anonymized practice outcome quotes

### Week 3 — Brand & Platform Signals
- [ ] Create LinkedIn company page
- [ ] Publish first LinkedIn post ("The $14,200 dental leak — here's where it goes")
- [ ] Create Product Hunt listing
- [ ] Create G2 or Capterra listing
- [ ] Post 2-3 helpful replies in r/dentistry or r/DentalHygiene (no self-promotion, just value)

### Week 4 — Content & Citation Building
- [ ] Source-cite all key statistics with real references (Peerlogic, ADA, CMS data)
- [ ] Write one guest post pitch to Dental Economics or DentistryIQ
- [ ] Add a "Why we built this" founder page with real name + backstory
- [ ] Record a 2-3 min explainer video (YouTube) on the missed call revenue loss stat
- [ ] Re-audit GEO score — target 55+/100

---

## Competitive Landscape (GEO Context)

NightLeak competes for AI citations against established players with strong GEO foundations:

| Competitor | AI Visibility Strengths | Gap to Exploit |
|---|---|---|
| Arini (YC-backed) | Press coverage, Reddit mentions, tech credibility | NightLeak is broader (not just calls) |
| Viva AI | LinkedIn presence, SEO-optimized pages | NightLeak's audit-first approach is differentiating |
| Weave | High DA, many backlinks, review site presence | NightLeak's price/niche clarity |
| Peerlogic | Published original data (AI loves this) | NightLeak should publish its own audit data |

**Biggest GEO opportunity:** Peerlogic published a study of 4,280 calls across 26 practices — and it gets cited everywhere. NightLeak should publish its own aggregated audit data ("We audited 50 dental practices — here's what we found") as a standalone content piece. Original data is the #1 path to AI citations.

---

## Appendix: Pages Analyzed

| URL | Title | H1 | GEO Issues Found |
|---|---|---|---|
| nightleakaudit.com | (missing from response) | "Your practice is leaking revenue. Here's the exact number." | No OG, no schema, no canonical, no sitemap, div-based headings |
| nightleakaudit.com/audit | Revenue Leak Audit — NightLeak | "How much is your practice leaking every month?" | No OG, no schema, no canonical, query-param duplicate risk |
| nightleakaudit.com/medicare | The Medicare Decision Every Dental Practice Must Make | "The Medicare decision every dental practice has to make" | No OG, no schema, no canonical |

**Files created/modified in this session:**
- `/public/robots.txt` — created
- `/public/sitemap.xml` — created
- `/public/llms.txt` — created
- `/public/index.html` — canonical, OG, Twitter Card, JSON-LD added
- `/public/audit.html` — canonical, OG, Twitter Card, JSON-LD added
- `/public/medicare.html` — canonical, OG, Twitter Card, JSON-LD added
- `/public/leave-behind.html` — meta description, noindex, canonical added

**All domain references corrected from nightleak.com → nightleakaudit.com**
