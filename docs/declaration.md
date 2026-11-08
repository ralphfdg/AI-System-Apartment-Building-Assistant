---
title: Declaration
level: "9"
description: My declaration, how I used AI tools, and the projects Sohei builds on.
---

## Declaration

I confirm that the work submitted for SAM10 – Systems Administration and Maintenance, Final Project – is my own, except where clearly identified as borrowed, based on an existing open project, or as AI-assisted. I confirm that:

- the base system I built on is identified and credited, and I have complied with its licence;
- the system described on my website and in my repository exists and can be demonstrated;
- all data and content used in the system is invented, and contains no real patient, student or staff information;
- my AI system does not make consequential decisions about identifiable people;
- all evidence submitted is authentic and has not been altered to misrepresent results;
- no AWS credentials, API keys or passwords are included in this submission, including in the history of my repository; and
- I have read and accept the academic integrity and ethics requirements of this course.

<dl class="facts">
  <dt>Student name</dt><dd>{{ site.student_name }}</dd>
  <dt>Student ID</dt><dd>{{ site.student_id }}</dd>
  <dt>Course</dt><dd>{{ site.course }}</dd>
  <dt>Signature</dt><dd>{{ site.student_name }} (typed)</dd>
  <dt>Date</dt><dd>{% include todo.html text="Date of hand-in" %}</dd>
</dl>

I worked alone on this project.

## Use of AI tools

<dl class="facts">
  <dt>Tool</dt><dd>Claude and Claude Code, by Anthropic</dd>
  <dt>What I used it for</dt><dd>Planning the project, explaining AWS steps, writing configuration and scripts, running the checks I asked for, and <b>drafting the text of this website</b>. At my request it also drafted the explanations: the RPO and RTO sentences, the alarm threshold reasons, the security sentences, the system card, the runbook, the Well-Architected verdicts and the incident write-up.</dd>
  <dt>How I checked it</dt><dd>I tested every step myself, compared the results with the AWS and LibreChat documentation and with the raw facts in <code>docs/notes/</code>, chose the verdicts, the test marks and the gap to fix first myself, and read and edited the website text</dd>
</dl>

## Credit

- **LibreChat** by Danny Avila and the LibreChat contributors, [github.com/LibreChat-AI/LibreChat](https://github.com/LibreChat-AI/LibreChat), MIT licence ([licence text](https://github.com/LibreChat-AI/LibreChat/blob/main/LICENSE)). Version used: `v0.8.9-rc1`. Sohei is a reskin: LibreChat was configured, not rewritten.
- **Google Gemini** writes the answers, through its free tier.
- **Bootstrap 5** (MIT licence) and the **Tinos** and **Cousine** fonts (Apache licence) are used on this site.

## Data

South Heights Apartments, its residents, its manager and every address and phone number in the handbook are made up. No real personal data was used or sent to Gemini.
