---
title: Home
level: G
home: true
description: Sohei answers everyday questions for residents of a made-up apartment building. This site shows how it was put on AWS and kept watched, backed up and secure.
---
{%- assign total = site.data.progress | size -%}
{%- assign finished = site.data.progress | where: "done", true | size -%}
<section class="home-hero" aria-labelledby="home-title">
  <div class="shell">
    <div class="home-building">{% include building.html %}</div>
    <div class="home-text">
      <h1 id="home-title">A helper for a made-up apartment building, run properly on AWS.</h1>
      <p class="lede">Sohei answers residents' everyday questions about South Heights Apartments: bin day, parking, the gym, booking the lift. This site shows how it was put online and kept watched, backed up and secure.</p>
      <h2>{{ finished }} of {{ total }} project parts finished</h2>
      <p class="lit-key"><span><i class="on"></i>Lit window = finished part</span><span><i></i>Dark window = still to do</span></p>
      <ol class="parts">
        {%- for p in site.data.progress %}
        <li id="part-{{ forloop.index }}" class="{% if p.done %}is-done{% else %}is-todo{% endif %}">{% if p.done %}{% include icon.html name="tick" %}{% else %}{% include icon.html name="box" %}{% endif %}<span>{{ p.part }}<small>{{ p.stage }}{% if p.done %} · {{ p.date }}{% else %} · to do{% endif %}</small></span></li>
        {%- endfor %}
      </ol>
    </div>
  </div>
</section>

<div class="shell reading" markdown="1">

## In one minute

<dl class="facts">
  <dt>What Sohei does</dt>
  <dd>It answers questions from the building handbook. It does not decide complaints, approve requests or share anything about residents. In an emergency it tells people to call 000.</dd>
  <dt>How it started</dt>
  <dd>LibreChat on a laptop with its default settings: no HTTPS, no monitoring, no backups, and the secrets in a plain file. See <a href="{{ '/baseline.html' | relative_url }}">Baseline</a>.</dd>
  <dt>What changed</dt>
  <dd>It now runs on one AWS server behind CloudFront (HTTPS). Secrets are in Parameter Store, logs and alarms are in CloudWatch, alerts arrive by email, the database is backed up to S3 every 6 hours and a health check runs every 15 minutes.</dd>
  <dt>What improved</dt>
  <dd>In a real test, the alarm caught the app being down 16 minutes 37 seconds after it stopped, and emailed the owner. Before, nobody would have known. {% include todo.html text="Full before and after numbers – after Day 2 Part D" %}</dd>
</dl>

## The video

{% include video.html %}

## Key facts

<dl class="facts">
  <dt>Live link</dt>
  <dd><a href="{{ site.live_url }}">{{ site.live_url | remove: "https://" }}</a> (sign-ups are closed)</dd>
  <dt>Where it runs</dt>
  <dd>AWS Sydney region (<code>ap-southeast-2</code>), one <code>t3.medium</code> server</dd>
  <dt>AI model</dt>
  <dd>Google Gemini <code>gemini-3.5-flash-lite</code>, free tier</dd>
  <dt>Who is watching</dt>
  <dd>5 CloudWatch alarms and a US$10 a month AWS Budget, all by email</dd>
  <dt>Cost per day</dt>
  <dd>{% include todo.html text="Cost per day from Cost Explorer – Day 2 Part D" %}</dd>
</dl>

</div>
