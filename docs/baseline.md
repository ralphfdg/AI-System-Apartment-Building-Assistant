---
title: Baseline
level: "3"
description: Where the project started. LibreChat ran on a laptop with its default settings, and nothing watched or protected it.
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

To compare before and after fairly, both periods have the same length and are measured the same way.

| | Start | End |
| --- | --- | --- |
| Before | <span class="t">7 Nov 2026, 12:10 UTC</span> | {% include todo.html text="End of the before period" %} |
| After | {% include todo.html text="Start of the after period" %} | {% include todo.html text="End – same length as before" %} |

All times on this site are UTC unless they say UTC+8 (the student's local time).
