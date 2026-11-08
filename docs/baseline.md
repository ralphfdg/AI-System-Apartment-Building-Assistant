---
title: Baseline
level: "3"
description: LibreChat ran on my laptop with its default settings. Nothing watched it and nothing backed it up.
---

## The starting point

Before any of the work on this site, LibreChat ran in Docker on a laptop, with the settings it ships with.

| Area | At the start | Why that is a problem |
| --- | --- | --- |
| Where it ran | A laptop, in Docker | Off whenever the laptop is off |
| Access | `http://localhost:3080`, no HTTPS | Nobody else can reach it, and nothing is encrypted |
| Secrets | The Gemini key and other secrets in a plain `.env` file | Easy to leak, or to commit to git by mistake |
| Monitoring | None | Nobody knows when it breaks or slows down |
| Alerts | None | A failure is found only when someone complains |
| Backups | None | One broken disk loses every chat and account |
| Logs | Docker's default: no size limit | One noisy container can fill the disk |
| Sign-ups | Open to anyone with the link | Strangers could use the free AI quota |
| Look | The original LibreChat design | Not branded for the building |
{: .wide}

{% include evidence.html id="E-05" file="E-05-original.png" caption="The starting point: original LibreChat on the laptop." %}

## The "before" period

To compare before and after fairly, both periods have the same length (14 hours 56 minutes) and are measured the same way. The "before" period starts once monitoring was running on AWS, and ends when the last Day 2 fix (the Docker log limit) was in place. The results are on the [Results]({{ '/results.html' | relative_url }}) page.

| | Start | End |
| --- | --- | --- |
| Before | <span class="t">7 Nov 2026, 12:10 UTC</span> | <span class="t">8 Nov 2026, 03:06 UTC</span> |
| After | <span class="t">8 Nov 2026, 03:06 UTC</span> | <span class="t">8 Nov 2026, 18:02 UTC</span> |

All times on this site are UTC unless they say UTC+8 (the student's local time).
