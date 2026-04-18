# NightLeak City-by-City Outreach Strategy
## Handoff Document for NightLeak Team

---

## The Play

Every weeknight, NightLeak audits 30 dental practices in ONE city. Call after hours. Score the outcome. Build the map. Use the data as content AND outreach.

**The loop:** Call city → build report → create content → email the practices their score → book calls.

---

## Weekly Schedule

| Day | City | Why |
|-----|------|-----|
| Monday | San Jose, CA | Home base. Densest NPI data. Start here. |
| Tuesday | San Leandro, CA | Adjacent market. East Bay expansion. |
| Wednesday | [Pick next — Sacramento, Fremont, Oakland] | Rotate new cities |
| Thursday | [Pick next] | |
| Friday | [Pick next] | |

**Minimum:** 30 new practices per night, Monday-Friday = 150/week.

---

## Nightly Process (Automated)

1. **6:00pm** — Pull 30 dentists from NPI Registry for tonight's city (filter: individual providers, dental taxonomy, active)
2. **6:30pm** — Serper lookup: find phone numbers + domains for each
3. **7:00pm** — Nightly runner fires: Retell AI calls each practice after hours
4. **7:30pm-8:30pm** — Calls complete. Results logged.
5. **8:30pm** — Email discovery: Anymail/Prospeo for each practice with a domain
6. **9:00pm** — ZeroBounce verify any emails found
7. **9:30pm** — Results stamped: ready_to_send OR call_queue
8. **Next morning** — Morning brief via Telegram. Send emails to verified leads.

---

## The Content Loop

Each city audit produces:

### 1. The Report (PDF + web page)
- "We called 30 dental offices in [City] after 5pm. Here's what happened."
- Aggregate stats only — no practice names
- Color-coded map (green=answered, red=voicemail)
- Revenue leak estimate for the city

### 2. The YouTube Video (60 seconds)
- Screen recording of the map filling in with dots
- Voiceover: the key stat ("97% went to voicemail")
- CTA: "Find out your number — nightleakaudit.com"
- Post to DIS YouTube channel

### 3. The Outreach Email
- Sent ONLY to practices in that city
- Subject: "We called 30 dental offices in [City] after 5pm"
- Body: Link to the report (no names) + "Want to know your score? 15-min audit, free."
- This is NOT cold email — it's "we did research in your city, here are the results"

---

## Map Spec (Color-Coded, No Addresses)

**What shows:**
- City-level dots (zip code centroid, NOT street address)
- Green dot = answered live after hours
- Yellow dot = IVR/phone tree (partial coverage)
- Red dot = voicemail only (leaking)
- Gray dot = not yet called

**What does NOT show:**
- Practice names
- Street addresses
- Doctor names
- Phone numbers

**The map grows every night.** After 1 week = 150 dots. After 1 month = 600+ dots. It becomes a living asset.

---

## City Selection Criteria

Pick cities that are:
1. **Dense enough** — 30+ dental practices in NPI registry
2. **In California first** — your Twilio numbers are 510/415/213 area codes, local presence matters
3. **Metro areas** — higher patient volume = higher revenue leak = more compelling data

### Suggested Sequence (first 2 weeks)

| Week | Mon | Tue | Wed | Thu | Fri |
|------|-----|-----|-----|-----|-----|
| 1 | San Jose | San Leandro | Sacramento | Fremont | Oakland |
| 2 | San Francisco | Hayward | Stockton | Modesto | Fresno |

After NorCal is covered, move to SoCal (LA, Long Beach, Anaheim, etc.)

---

## What Eric Does (45 min/day max)

- **Morning:** Review Telegram brief. Approve/send emails. (10 min)
- **Saturday:** Film 4-5 sixty-second map walkthrough videos for the week's cities. (60 min)
- **Everything else:** Automated.

---

## Success Metrics

| Metric | Week 1 Target | Month 1 Target |
|--------|---------------|----------------|
| Practices called | 150 | 600 |
| Cities covered | 5 | 20 |
| Emails discovered + verified | 30 | 120 |
| Outreach emails sent | 30 | 120 |
| Audit calls booked | 3 | 12 |
| YouTube videos posted | 5 | 20 |
| Report pages live | 5 | 20 |

---

## Files

- Report template: `docs/NIGHTLEAK-AFTER-HOURS-REPORT-V1.md`
- Nightly runner: `ops/nightly-runner.js`
- Daytime email caller: `ops/daytime-email-caller.js`
- Master queue: `ops/master-send-queue.json`
- Call logs: `ops/retell-calls/`
