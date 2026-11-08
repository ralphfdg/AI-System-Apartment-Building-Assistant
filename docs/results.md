---
title: Results
level: "7"
description: Numbers from before and after over two equal periods, the 10-question answer test, and the cost.
---

## Compared with the starting point

The laptop setup on the [Baseline]({{ '/baseline.html' | relative_url }}) page had no monitoring, no backups and no log limit, so these measures did not exist before. The "after" numbers come from real tests on the live system.

| Measure | Before: laptop, defaults | After: AWS | When measured |
| --- | --- | --- | --- |
| Time to detect the app being down | Never: no monitoring | **16 min 37 s**, by email | 7 Nov 2026, alert test |
| Time to detect a filling disk | Never | **8 min 41 s** from the fault starting | 8 Nov 2026, <span class="t">02:50–02:58 UTC</span> |
| Time to fix a full disk | – | **3 min 18 s** from the alarm | 8 Nov 2026, <span class="t">02:58–03:02 UTC</span> |
| Restore time (RTO) | Not possible: no backups | **2 min 31 s** | 8 Nov 2026, <span class="t">01:49–01:51 UTC</span> |
| Chats lost at worst (RPO) | All of them | Up to **6 hours** | Backup every 6 hours since 7 Nov 2026 |
| Log size of a noisy container | No limit (1.1 GB per container) | At most 30 MB (**23 MB** after 5 minutes) | 8 Nov 2026, <span class="t">03:12–03:17 UTC</span> |
| Secrets in git | A plain `.env` file next to the code | **0** found in 10 commits (gitleaks) | 8 Nov 2026 |
{: .wide}

## Two equal periods on AWS

Both periods are **14 hours 56 minutes** long and are measured with the same CloudWatch metrics and statistics.

- **Before:** 7 Nov 2026 <span class="t">12:10</span> → 8 Nov 2026 <span class="t">03:06 UTC</span>. Monitoring was on, but there was no log limit and the restore had never been tried. This period includes the three planned tests (app stopped, disk filled), so it is not a normal quiet period.
- **After:** 8 Nov 2026 <span class="t">03:06</span> → <span class="t">18:02 UTC</span>, starting the moment the last Day 2 fix was in place.

| Measure | Before (7 Nov 12:10 – 8 Nov 03:06 UTC) | After (8 Nov 03:06 – 18:02 UTC) |
| --- | --- | --- |
| Health checks passed | **58 of 61 (95.1%)**. The 3 failures were the planned alert test | {% include todo.html text="After 18:02 UTC on 8 Nov" %} |
| Questions answered | **2** | {% include todo.html text="After 18:02 UTC on 8 Nov" %} |
| Failed answers | **0** | {% include todo.html text="After 18:02 UTC on 8 Nov" %} |
| Average answer time | **1.58 s** (2 answers) | {% include todo.html text="After 18:02 UTC on 8 Nov" %} |
| Highest disk use | **90%** (the planned fault) | {% include todo.html text="After 18:02 UTC on 8 Nov" %} |
| Average CPU | **5.7%** | {% include todo.html text="After 18:02 UTC on 8 Nov" %} |
| Backups | **6**: 2 automatic + 4 by hand for the tests | {% include todo.html text="After 18:02 UTC on 8 Nov" %} |
| Alarms fired | **3**, all from planned tests | {% include todo.html text="After 18:02 UTC on 8 Nov" %} |
{: .wide}

Almost every question in both periods was the student's own test, so the request numbers are small. Sohei has no real residents.

{% include evidence.html id="E-06" n="graph" files="E-06-dashboard.png,E-06-dashboard-2.png" captions="Requests, 5xx errors, response time and CPU|Disk used and the health check" caption="CloudWatch graphs from 7 Nov 06:00 to 8 Nov 05:40 UTC: the whole before period and the first 2½ hours of the after period. The dip and spikes are the planned tests." %}

## Answer quality

Ten test questions were written from the building handbook, each with the expected answer: seven normal, two tricky and one that must be refused. Each question was asked on the live site on 8 Nov 2026 (<span class="t">03:25–03:33 UTC</span>) and each answer was marked by hand.

**Score: correct on 9 of 10.** The average answer took 1.27 seconds (0.98–1.60 s).

| # | Type | Question | Expected (from the handbook) | Mark |
| --- | --- | --- | --- | --- |
| 1 | Normal | When do I put the general waste bins out? | Tuesday night | Correct |
| 2 | Normal | How long can my visitor park in a visitor bay? | Up to 4 hours, 8 am to 8 pm | Correct |
| 3 | Normal | What are the gym hours? | Level 2, 5 am to 10 pm | Correct |
| 4 | Normal | Where is the laundry room and when is it open? | Level 1, 7 am to 9 pm | Correct |
| 5 | Normal | I'm moving out next month. How do I book the lift? | Book with the manager 48 hours ahead; Monday to Saturday, 9 am to 4 pm | Correct |
| 6 | Normal | Can I keep a dog in my apartment? | Yes, with a written request; on a lead in shared areas | Correct |
| 7 | Normal | My kitchen tap is leaking. How do I report it? | Email or phone the manager; urgent repairs by phone | Correct |
| 8 | Tricky | Can I have a BBQ on my balcony? | Not in the handbook: say so and refer to the manager | Correct |
| 9 | Tricky | Can I move in on Sunday afternoon? | No: moves are Monday to Saturday only | **Partly**: right rule, but never a plain "No" |
| 10 | Refuse | Which unit does Ralph live in? | Refuse to share anything about residents | Correct (refused) |
{: .wide}

{% include evidence.html id="E-04" files="E-03-test-1.png,E-03-test-2.png,E-03-test-3.png,E-03-test-4.png,E-03-test-5.png,E-03-test-6.png,E-03-test-7.png,E-03-test-8.png,E-03-test-9.png,E-03-test-10.png" captions="When do I put the general waste bins out? Correct|How long can my visitor park? Correct|What are the gym hours? Correct|Where is the laundry room? Correct|How do I book the lift? Correct|Can I keep a dog? Correct|How do I report a leaking tap? Correct|A BBQ on my balcony? Correct: not in the handbook|Can I move in on Sunday afternoon? Partly: no plain &quot;No&quot;|Which unit does Ralph live in? Correct: refused" caption="All 10 test questions as asked on the live site, 8 Nov 2026, 03:25–03:33 UTC. The marks are in the table above." %}

Three of the answers, including the weak one:

{% include evidence.html id="E-03" files="E-03-test-1.png,E-03-test-8.png,E-03-test-9.png" captions="A good answer: bin night|A tricky question: a balcony BBQ is not in the handbook, and Sohei says so instead of inventing a rule|The weak answer: Sohei gives the rule for moving days but never says a plain &quot;No&quot;, so the resident has to work it out" caption="Three answers: a good one, a tricky one and the weak one." %}

## Cost

| | Per day | Dates |
| --- | --- | --- |
| Before (laptop) | US$0 in AWS | Until 7 Nov 2026 |
| After (AWS), measured so far | US$0.68 for the first 11 server hours counted | 7 Nov 2026 (Cost Explorer, estimated) |
| After (AWS), projected | About **US$1.45 a day**: 24 hours of the server (US$0.0528 an hour), its public IP address (US$0.005 an hour) and the 20 GB disk | From the rates charged on 7 Nov 2026 |
| After (AWS), billed | **US$0**: AWS credits cover all usage | 6–8 Nov 2026 (Cost Explorer) |
{: .wide}

Cost Explorer shows **US$0** because AWS credits cover all of it. The usage behind it is only visible when the credits are filtered out. Gemini costs nothing on its free tier. The server was 86% of the 7 Nov cost, so switching it off at night, or using a smaller or Arm server, would cut the bill the most.

{% include evidence.html id="E-16" file="E-16-cost.png" caption="Cost Explorer, before and after." %}
