---
title: Well-Architected
level: "4"
description: AWS judges systems on six pillars. For each one, what AWS asks, what Sohei does today and its weakest point.
---

## The six pillars

The AWS Well-Architected Framework is a checklist AWS uses to judge whether a system is safe, reliable and good value. It has six pillars. Verdicts are set after the checks in Day 2 Part D.

<div class="pillars">
  <section class="pillar">
    <h3>Operational excellence</h3>
    <dl>
      <dt>AWS asks</dt><dd>Can you run it, see what it is doing and improve it?</dd>
      <dt>Sohei does</dt><dd>A dashboard with 6 graphs, a log of every answer, scripts and config in git, a written deploy guide. {% include todo.html text="Runbook for disk full – Day 2 Part C" %}</dd>
      <dt>Weak point</dt><dd>The servers and services were set up by hand and by scripts, not as infrastructure-as-code.</dd>
      <dt>Verdict</dt><dd>{% include todo.html text="Verdict" %}</dd>
    </dl>
  </section>
  <section class="pillar">
    <h3>Security</h3>
    <dl>
      <dt>AWS asks</dt><dd>Are people, data and secrets protected, and is every action recorded?</dd>
      <dt>Sohei does</dt><dd>MFA on root and on the IAM user, admin only through a role with MFA, secrets in Parameter Store, no SSH, port 80 open to CloudFront only, a private encrypted S3 bucket, CloudTrail on, sign-ups closed.</dd>
      <dt>Weak point</dt><dd>CloudFront has no web application firewall (AWS WAF) in front of it.</dd>
      <dt>Verdict</dt><dd>{% include todo.html text="Verdict" %}</dd>
    </dl>
  </section>
  <section class="pillar">
    <h3>Reliability</h3>
    <dl>
      <dt>AWS asks</dt><dd>Does it notice failures and recover from them?</dd>
      <dt>Sohei does</dt><dd>A health check every 15 minutes with an alarm, a database backup every 6 hours, a service that starts the app again whenever the server boots. {% include todo.html text="Restore test result – Day 2 Part B" %}</dd>
      <dt>Weak point</dt><dd>One server in one Availability Zone (<code>ap-southeast-2b</code>). If it fails, Sohei is down.</dd>
      <dt>Verdict</dt><dd>{% include todo.html text="Verdict" %}</dd>
    </dl>
  </section>
  <section class="pillar">
    <h3>Performance efficiency</h3>
    <dl>
      <dt>AWS asks</dt><dd>Are the right resources used, and is speed measured?</dd>
      <dt>Sohei does</dt><dd>A <code>t3.medium</code> server with 2 GB of swap, CloudFront in front, a response-time metric from the request log.</dd>
      <dt>Weak point</dt><dd>No load test. The free Gemini tier limits how many questions can be answered at once.</dd>
      <dt>Verdict</dt><dd>{% include todo.html text="Verdict" %}</dd>
    </dl>
  </section>
  <section class="pillar">
    <h3>Cost optimisation</h3>
    <dl>
      <dt>AWS asks</dt><dd>Do you pay only for what you need, and do you watch the bill?</dd>
      <dt>Sohei does</dt><dd>One server, a US$10 a month budget with email alerts, backups deleted after 7 days, logs kept for 14 days.</dd>
      <dt>Weak point</dt><dd>The server runs 24 hours a day for very few users. {% include todo.html text="Cost per day from Cost Explorer" %}</dd>
      <dt>Verdict</dt><dd>{% include todo.html text="Verdict" %}</dd>
    </dl>
  </section>
  <section class="pillar">
    <h3>Sustainability</h3>
    <dl>
      <dt>AWS asks</dt><dd>Do you use only the resources you need?</dd>
      <dt>Sohei does</dt><dd>One small server, short log and backup retention, only the containers it needs (the unused RAG and vector database containers are switched off).</dd>
      <dt>Weak point</dt><dd>The server is always on, even at night when nobody asks anything.</dd>
      <dt>Verdict</dt><dd>{% include todo.html text="Verdict" %}</dd>
    </dl>
  </section>
</div>

## The gap to fix first

{% include todo.html text="Which gap to fix first, and why – Day 2 Part D" %}

{% include evidence.html id="E-17" file="E-17-well-architected.png" caption="Optional: the review in the free AWS Well-Architected Tool." %}
