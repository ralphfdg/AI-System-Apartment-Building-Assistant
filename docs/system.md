---
title: Sohei & system card
level: "2"
description: Sohei next to the LibreChat it started from, plus its system card.
---

## Before and after the reskin

Sohei is LibreChat with a new look and new rules. LibreChat itself was not rewritten: only its settings file, logo files and a footer were changed.

<div class="plates">
{% include evidence.html id="E-05" file="E-05-original.png" caption="Original LibreChat v0.8.9-rc1 on the laptop, default look." %}
{% include evidence.html id="E-01" file="E-01-reskin.png" caption="Sohei answering a real question, after the reskin." %}
</div>

What the reskin changed is listed in part 4 of the system card below.

## The live link

**[{{ site.live_url | remove: "https://" }}]({{ site.live_url }})**. Sign-ups are closed, so only test accounts can log in.

{% include evidence.html id="E-02" file="E-02-live-url.png" caption="The live HTTPS link in the browser, with the padlock." %}

## System card

This card follows the template in Appendix C of the project brief.

### 1. What it does

Sohei answers everyday questions from residents of South Heights Apartments, such as bin day, parking, the gym or how to book the lift. It answers only from the building handbook, and sends anything it cannot answer to the building manager. The building and everything in the handbook are made up.

### 2. Who uses it, and who must not

- **Intended users:** residents of the (invented) building. In practice, the student and test accounts, because sign-ups are closed.
- **Explicitly NOT for:** emergencies (it says "call 000"), deciding complaints or disputes, approving requests, legal or medical advice, or any question about an identifiable resident ("Which unit does John live in?" is refused).

### 3. Base system

- **Name and version:** LibreChat `v0.8.9-rc1`, Docker image `registry.librechat.ai/librechat-ai/librechat:v0.8.9-rc1`
- **Source URL:** [github.com/LibreChat-AI/LibreChat](https://github.com/LibreChat-AI/LibreChat)
- **Author:** Danny Avila and the LibreChat contributors
- **Licence:** MIT ([licence text](https://github.com/LibreChat-AI/LibreChat/blob/main/LICENSE))
- **What it did originally:** a general ChatGPT-style chat app. Anyone could sign up, pick a model from many AI providers and ask anything.

### 4. What you changed (the reskin)

| Part | Original | Sohei | Why it was changed |
| --- | --- | --- | --- |
| Name/branding | "LibreChat", its logo and colours | "Sohei", a building-and-chat-bubble logo, the cream, sand, sage and forest palette, footer "South Heights Apartments · Emergencies: call 000" | Residents should see the building's own helper, and the emergency number on every page |
| Data/content | No content of its own | The invented building handbook (`config/building-handbook.md`) inside the Sohei model spec | Answers must come from the building's rules, not from the open internet |
| Wording/prompts | No rules | Rules: answer only from the handbook, never share anything about residents, never decide or approve, emergencies "call 000" | Safe and responsible answers |
| Interface | A model picker for many providers, open sign-ups | One locked choice, "Sohei" (`enforce: true`), sign-ups closed, a serif font so "000" reads clearly | Simple for residents, and strangers cannot use the AI quota |
| AWS services | None (a laptop) | EC2, CloudFront, S3, Parameter Store, CloudWatch, SNS, Lambda, EventBridge Scheduler, CloudTrail | To run it online, safely, watched and backed up |
{: .wide}

### 5. Data

- **Where it came from:** written for this project; it is part of this repository.
- **Size and format:** one Markdown file, 57 lines (1,103 bytes).
- **Anything personal in it:** no. All of it is invented: the building, the manager, the email `manager@southheights.example` and the phone number.
- **Anything sent to a third-party AI service:** yes. Google Gemini receives the question, the rules and the handbook, all invented. Chats are stored in MongoDB on the server and in S3 backups for 7 days.

### 6. How good it is

- **The one number:** correct on **9 of 10** test questions.
- **How it was measured:** 10 questions with expected answers taken from the handbook. They were asked on the live site on 8 Nov 2026 (<span class="t">03:25–03:33 UTC</span>), and each answer was marked by hand. The average answer took 1.27 seconds. See [Results]({{ '/results.html' | relative_url }}#answer-quality).
- **What the tests covered:** 7 normal questions, 2 tricky ones (a BBQ on the balcony, which is not in the handbook, and a move on a Sunday, which is not allowed) and 1 that must be refused (where a resident lives).
- **An example it gets wrong:** "Can I move in on Sunday afternoon?" Sohei gave the right rule ("Monday to Saturday, 9 am to 4 pm") but never said a plain "No", so the resident has to work out the answer. It was marked as partly right.

### 7. How it is served

- **Where it runs:** one Amazon EC2 `t3.medium` server (Amazon Linux 2023) in Sydney (`ap-southeast-2`). LibreChat, MongoDB, Meilisearch and nginx run in Docker.
- **What calls it:** residents use the web page at [{{ site.live_url | remove: "https://" }}]({{ site.live_url }}) through CloudFront (HTTPS). The page calls LibreChat's `/api/` paths.
- **The model behind it:** Google Gemini `gemini-3.5-flash-lite`, free tier, through LibreChat's `google` endpoint.
- **If the model or service is unavailable:** the chat shows an error instead of an answer, and the request log counts it as a failed request. The health check only loads the web page, so it does not notice when Gemini alone is down. If the server is down, the health-check alarm emails the owner.

### 8. Limitations and risks

- **What it cannot do:** book the lift, approve pets or decide anything. It knows only what is in the handbook, and the handbook copy in the settings file must be updated by hand.
- **What could go wrong with the data:** a resident could type real personal details into a chat. They would then be sent to Gemini and kept in the backups for 7 days.
- **How it could be misused:** asking about other residents (it refuses), tricking it into ignoring its rules, or using up the free Gemini quota (sign-ups are closed). The free tier has rate limits, so many questions at once can fail.
- **What a user must always check themselves:** anything important, such as a booking, a rule or a deadline, with the building manager. AI answers can be wrong, even with the handbook in front of it.

### 9. Operational summary

- **Where the code lives:** this GitHub repository (`config/`, `deploy/`, `ops/`). The server copies it from S3 at start-up. LibreChat itself is the upstream project.
- **How often it is backed up:** the database every 6 hours to S3, kept for 7 days. The handbook is versioned in S3.
- **How we know it is healthy:** a health check every 15 minutes, and the alarms `sohei-health-down`, `sohei-cpu-high`, `sohei-memory-high`, `sohei-disk-high` and `sohei-status-check-failed`, plus a US$10 a month AWS Budget, all by email.
- **Who to contact:** {{ site.student_name }}, the owner. For building questions, the (invented) building manager.
