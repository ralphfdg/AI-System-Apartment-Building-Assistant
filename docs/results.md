---
title: Results
level: "7"
description: Before and after, measured the same way over periods of the same length, plus how well Sohei answers and what it costs.
---

## Before and after

Every number has its date range next to it. Both periods have the same length (see [Baseline]({{ '/baseline.html' | relative_url }})).

| Measure | Before | After |
| --- | --- | --- |
| Health checks passed | {% include todo.html text="% and dates" %} | {% include todo.html text="% and dates" %} |
| Average response time | {% include todo.html text="seconds and dates" %} | {% include todo.html text="seconds and dates" %} |
| Failed requests | {% include todo.html text="count and dates" %} | {% include todo.html text="count and dates" %} |
| Backups taken | {% include todo.html text="count and dates" %} | {% include todo.html text="count and dates" %} |
| Time to detect a fault | {% include todo.html text="minutes" %} | {% include todo.html text="minutes" %} |
| Restore time | {% include todo.html text="minutes" %} | {% include todo.html text="minutes" %} |
{: .wide}

{% include evidence.html id="Graph" file="results-graph.png" caption="A before and after graph from CloudWatch." %}

## Answer quality

Ten test questions were written from the building handbook, each with the expected answer: seven normal, two tricky and one that must be refused. Each question was asked on the live site and each answer was marked right or wrong by hand.

**Score:** {% include todo.html text="Correct on X of 10 – Day 2 Part D" %}

{% include evidence.html id="E-04" file="E-04-quality-score.png" caption="The scoring table." %}

Three of the answers, including one failure:

<div class="plates">
{% include evidence.html id="E-03" n="1" file="E-03-test-1.png" caption="A good answer." %}
{% include evidence.html id="E-03" n="2" file="E-03-test-2.png" caption="A tricky question." %}
</div>
{% include evidence.html id="E-03" n="3" file="E-03-test-3-failure.png" caption="A failure, and why it went wrong." %}

## Cost

| | Per day | Dates |
| --- | --- | --- |
| Before (laptop) | US$0 in AWS | – |
| After (AWS) | {% include todo.html text="From Cost Explorer" %} | {% include todo.html text="Dates" %} |

{% include evidence.html id="E-16" file="E-16-cost.png" caption="Cost Explorer, before and after." %}
