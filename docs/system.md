---
title: Sohei & system card
level: "2"
description: What Sohei is, how it looked before and after the reskin, and its system card.
---

## Before and after the reskin

Sohei is LibreChat with a new look and new rules. LibreChat itself was not rewritten: only its settings file, logo files and a footer were changed.

<div class="plates">
{% include evidence.html id="E-05" file="E-05-original.png" caption="Original LibreChat v0.8.9-rc1 on the laptop, default look." %}
{% include evidence.html id="E-01" file="E-01-reskin.png" caption="Sohei answering a real question, after the reskin." %}
</div>

What the reskin changed:

- **Name and logo:** "Sohei" with a building mark that is also a chat bubble.
- **Colours:** the Sohei palette (cream, sand, sage, forest green) in light and dark mode.
- **Type:** a serif font, chosen so the digits in "000" read clearly.
- **Footer:** "South Heights Apartments · Emergencies: call 000".
- **Model spec:** one locked choice, Sohei, which holds the rules and the building handbook.

## The live link

**[{{ site.live_url | remove: "https://" }}]({{ site.live_url }})**. Sign-ups are closed, so only test accounts can log in.

{% include evidence.html id="E-02" file="E-02-live-url.png" caption="The live HTTPS link in the browser, with the padlock." %}

## System card

{% include todo.html text="Check these nine headings against Appendix C of the brief" %}

### Name and version

Sohei, app version `sohei-v1`. Built on LibreChat `v0.8.9-rc1` (Docker image `registry.librechat.ai/librechat-ai/librechat:v0.8.9-rc1`).

### Purpose

Answer everyday questions from residents of South Heights Apartments, a made-up building, using only the building handbook.

### Users

Residents of an invented building. In practice: the student and test accounts. Sign-ups are closed.

### Model and data

- **Model:** Google Gemini `gemini-3.5-flash-lite`, free tier, called from outside AWS.
- **What it receives:** the question, a short set of rules and the full handbook. Every name, address and phone number in the handbook is invented.
- **What is kept:** chats are stored in MongoDB on the server and backed up to S3. Backups are deleted after 7 days.

### What it can do

Answer questions about bins, parking, the laundry, the gym and pool, moving in and out, booking the lift, noise, pets, reporting a repair and the building manager's contact details.

### What it must not do

- Decide complaints or disputes, or approve requests. It sends those to the building manager.
- Share anything about residents. "Which unit does John live in?" must be refused.
- Handle emergencies. It tells people to call **000**.

### Known limits

- The free Gemini tier has rate limits, so many questions at once can fail.
- AI answers can be wrong, even with the handbook in front of it.
- The handbook copy inside the settings file must be updated by hand when the handbook changes.
- It runs on one server. If the server is down, Sohei is down.

### How it is checked

- A health check every 15 minutes, with an alarm and email when it fails.
- A request log of every answer: time taken and success.
- A 10-question test with expected answers. {% include todo.html text="Quality score – Day 2 Part D" %}

### Owner

{{ site.student_name }} ({{ site.student_id }}), {{ site.course }}. The building manager in the handbook (`manager@southheights.example`) is made up.
