---
title: Declaration
level: "9"
description: Who did the work, how AI tools were used, and what this project is built on.
---

## Declaration

{% include todo.html text="Declaration text from Appendix H of the brief" %}

<dl class="facts">
  <dt>Name</dt><dd>{{ site.student_name }}</dd>
  <dt>Student ID</dt><dd>{{ site.student_id }}</dd>
  <dt>Course</dt><dd>{{ site.course }}</dd>
  <dt>Date</dt><dd>{% include todo.html text="Date of hand-in" %}</dd>
</dl>

I worked alone on this project.

## Use of AI tools

<dl class="facts">
  <dt>Tool</dt><dd>Claude and Claude Code, by Anthropic</dd>
  <dt>What I used it for</dt><dd>Planning the project, explaining AWS steps, writing configuration and scripts, and <b>drafting the text of this website</b></dd>
  <dt>How I checked it</dt><dd>I tested every step myself, compared the results with the AWS and LibreChat documentation, and read and edited the website text</dd>
</dl>

## Credit

- **LibreChat** by Danny Avila and the LibreChat contributors, [github.com/LibreChat-AI/LibreChat](https://github.com/LibreChat-AI/LibreChat), MIT licence ([licence text](https://github.com/LibreChat-AI/LibreChat/blob/main/LICENSE)). Version used: `v0.8.9-rc1`. Sohei is a reskin: LibreChat was configured, not rewritten.
- **Google Gemini** writes the answers, through its free tier.
- **Bootstrap 5** (MIT licence) and the **Tinos** and **Cousine** fonts (Apache licence) are used on this site.

## Data

South Heights Apartments, its residents, its manager and every address and phone number in the handbook are made up. No real personal data was used or sent to Gemini.
