---
title: Lobby
heading: A helper for a <span class="nw">made-up</span> apartment building, running on AWS.
level: G
home: true
rooms: false
description: Residents of South Heights Apartments ask Sohei about bin day, parking or booking the lift. I put it on AWS, set up alarms and backups, then broke it on purpose to test them. Each page is one floor of the building.
---

<div class="lobby">
<section class="lobby-main" markdown="1">

## In one minute

<dl class="facts">
  <dt>What Sohei does</dt>
  <dd>It answers questions from the building handbook. It does not decide complaints, approve requests or share anything about residents. In an emergency it tells people to call 000.</dd>
  <dt>How it started</dt>
  <dd>LibreChat on a laptop with its default settings: no HTTPS, no monitoring, no backups, and the secrets in a plain file. See <a href="{{ '/baseline.html' | relative_url }}">Baseline</a>.</dd>
  <dt>What changed</dt>
  <dd>It now runs on one AWS server behind CloudFront (HTTPS). Secrets are in Parameter Store, logs and alarms are in CloudWatch, alerts arrive by email, the database is backed up to S3 every 6 hours and a health check runs every 15 minutes.</dd>
  <dt>What improved</dt>
  <dd>In a real test, the alarm caught the app being down 16 minutes 37 seconds after it stopped, and emailed the owner. Before, nobody would have known. A full disk was caught and fixed in minutes, and container logs now have a size limit. A deleted database came back from backup in 2 minutes 31 seconds. Sohei answered 9 of 10 test questions correctly. See <a href="{{ '/results.html' | relative_url }}">Results</a>.</dd>
</dl>

</section>
<aside class="lobby-side" markdown="1">

## The video

{% include video.html %}

## Key facts

<dl class="facts facts-tight">
  <dt>Live link</dt>
  <dd><a href="{{ site.live_url }}">{{ site.live_url | remove: "https://" }}</a> (sign-ups are closed)</dd>
  <dt>Where it runs</dt>
  <dd>AWS Sydney (<code>ap-southeast-2</code>), one <code>t3.medium</code> server</dd>
  <dt>AI model</dt>
  <dd>Google Gemini <code>gemini-3.5-flash-lite</code>, free tier</dd>
  <dt>Who is watching</dt>
  <dd>5 CloudWatch alarms and a US$10 a month AWS Budget, all by email</dd>
  <dt>Cost per day</dt>
  <dd>About US$1.45 (projected from the rates AWS charged on 7 Nov 2026), covered by credits so far</dd>
</dl>

</aside>
</div>

<p class="lobby-go">Start on <a href="{{ '/infrastructure.html' | relative_url }}">level 1, Infrastructure</a>, or click any floor on the building.</p>
