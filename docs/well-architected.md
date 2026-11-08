---
title: Well-Architected
level: "4"
description: AWS checks a system against six pillars. Each pillar below shows the question, what Sohei does and where it falls short.
---

## The six pillars

The AWS Well-Architected Framework is a checklist AWS uses to judge whether a system is safe, reliable and good value. It has six pillars. The verdicts below were set after the checks in Day 2 (8 November 2026): <span class="verdict verdict-good">Good</span> means it meets what AWS asks, <span class="verdict verdict-ok">Adequate</span> means it works but has a clear weak point, <span class="verdict verdict-gap">Gap</span> means a real risk to fix.

<div class="pillars">
  <section class="pillar">
    <h3>Operational excellence</h3>
    <dl>
      <dt>AWS asks</dt><dd>Can you run it, see what it is doing and improve it?</dd>
      <dt>Sohei does</dt><dd>A dashboard with 6 graphs, a log of every answer, scripts and config in git, a written deploy guide, and a <a href="{{ '/runbook.html' | relative_url }}">runbook for a full disk</a> that was tested on a real fault.</dd>
      <dt>Weak point</dt><dd>The servers and services were set up by hand and by scripts, not as infrastructure-as-code.</dd>
      <dt>Verdict</dt><dd><span class="verdict verdict-ok">Adequate</span> The system is watched and the alarms were proven twice, but rebuilding it is still a manual job.</dd>
    </dl>
  </section>
  <section class="pillar">
    <h3>Security</h3>
    <dl>
      <dt>AWS asks</dt><dd>Are people, data and secrets protected, and is every action recorded?</dd>
      <dt>Sohei does</dt><dd>MFA on root and on the IAM user, admin only through a role with MFA, secrets in Parameter Store, no SSH, port 80 open to CloudFront only, a private encrypted S3 bucket, CloudTrail on, sign-ups closed.</dd>
      <dt>Weak point</dt><dd>CloudFront has no web application firewall (AWS WAF) in front of it.</dd>
      <dt>Verdict</dt><dd><span class="verdict verdict-good">Good</span> Every control on the <a href="{{ '/operations.html' | relative_url }}#security">security list</a> was checked live and the git history has no secrets. Still missing: AWS WAF, a newer minimum TLS version, and removing the long-lived access key.</dd>
    </dl>
  </section>
  <section class="pillar">
    <h3>Reliability</h3>
    <dl>
      <dt>AWS asks</dt><dd>Does it notice failures and recover from them?</dd>
      <dt>Sohei does</dt><dd>A health check every 15 minutes with an alarm, a database backup every 6 hours, a service that starts the app again whenever the server boots. A restore from backup took <b>2 min 31 s</b> in a test, and an old S3 version of the handbook was brought back in 4 seconds.</dd>
      <dt>Weak point</dt><dd>One server in one Availability Zone (<code>ap-southeast-2b</code>). If it fails, Sohei is down. The status-check alarm only sends an email, and there are no disk snapshots.</dd>
      <dt>Verdict</dt><dd><span class="verdict verdict-gap">Gap</span> Backups and restores work, but everything depends on one server in one zone, and nothing restarts it automatically.</dd>
    </dl>
  </section>
  <section class="pillar">
    <h3>Performance efficiency</h3>
    <dl>
      <dt>AWS asks</dt><dd>Are the right resources used, and is speed measured?</dd>
      <dt>Sohei does</dt><dd>A <code>t3.medium</code> server with 2 GB of swap, CloudFront in front, a response-time metric from the request log.</dd>
      <dt>Weak point</dt><dd>No load test. The free Gemini tier limits how many questions can be answered at once. The CPU runs in "unlimited" burst mode, which can cost extra if it stays busy.</dd>
      <dt>Verdict</dt><dd><span class="verdict verdict-ok">Adequate</span> Answers took 1.27 seconds on average in the 10-question test, but there is no load test, and the CPU hit 100% during the disk-full test.</dd>
    </dl>
  </section>
  <section class="pillar">
    <h3>Cost optimisation</h3>
    <dl>
      <dt>AWS asks</dt><dd>Do you pay only for what you need, and do you watch the bill?</dd>
      <dt>Sohei does</dt><dd>One server, a US$10 a month budget with email alerts, backups deleted after 7 days, logs kept for 14 days.</dd>
      <dt>Weak point</dt><dd>The server runs 24 hours a day for very few users. It costs about US$1.45 a day (projected from the rates charged on 7 Nov 2026), and the server is 86% of that.</dd>
      <dt>Verdict</dt><dd><span class="verdict verdict-ok">Adequate</span> The bill is small and watched by a budget, but the server runs all day and night for very few users.</dd>
    </dl>
  </section>
  <section class="pillar">
    <h3>Sustainability</h3>
    <dl>
      <dt>AWS asks</dt><dd>Do you use only the resources you need?</dd>
      <dt>Sohei does</dt><dd>One small server, short log and backup retention, only the containers it needs (the unused RAG and vector database containers are switched off).</dd>
      <dt>Weak point</dt><dd>The server is always on, even at night when nobody asks anything.</dd>
      <dt>Verdict</dt><dd><span class="verdict verdict-ok">Adequate</span> One small server with short retention. An Arm (Graviton) server, or switching it off at night, would use less energy.</dd>
    </dl>
  </section>
</div>

## The gap to fix first

**Reliability: one server and no automatic recovery.**

This is the gap with the biggest effect on residents. Everything runs on one EC2 server in one Availability Zone. If that server or its zone fails, Sohei is down until someone reads the email, builds a new server by hand and restores the latest backup, and up to 6 hours of chats can be lost. The other gaps (no WAF, no infrastructure as code) make an outage more likely or slower to fix, but this one decides how long residents are without Sohei.

How to close it, cheapest first (not done yet):

1. Add the EC2 **recover** action to `sohei-status-check-failed`, so AWS moves the server to healthy hardware by itself. No extra cost.
2. Take a daily **EBS snapshot** of the disk with Data Lifecycle Manager, so a whole server can be brought back, not only the database.
3. Copy the backups to a **second region**.
4. Later, run a second server in another Availability Zone behind a load balancer (see [Next steps]({{ '/next.html' | relative_url }})).

{% include evidence.html id="E-17" file="E-17-well-architected.png" caption="Optional: the review in the free AWS Well-Architected Tool." %}
