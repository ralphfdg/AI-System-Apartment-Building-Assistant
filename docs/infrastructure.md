---
title: Infrastructure
level: "1"
description: One server in Sydney sits behind CloudFront. Around it, AWS services hold the secrets, backups, logs and alerts.
---

## The diagram

<figure class="diagram" id="e-18">
  <span class="plate-stamp">E-18</span>
  <img src="{{ '/assets/img/architecture.svg' | relative_url }}" alt="Sohei architecture: browser to CloudFront to the EC2 server sohei-app in Sydney (nginx, LibreChat, MongoDB, Meilisearch), out to the Gemini API, with S3, Parameter Store, CloudWatch, SNS, a Lambda health check and CloudTrail around it." width="1040" height="624">
  <figcaption><span class="plate-id">E-18</span> How Sohei is built. Every name matches what is deployed, listed in <code>deploy/aws-resources.md</code>.</figcaption>
</figure>

## How a question travels

1. A resident opens the live link and types a question. The browser talks to **CloudFront** over HTTPS, so the question is encrypted.
2. CloudFront passes it to the server on port 80. The server's firewall (a **security group**) lets only CloudFront in, so nobody can skip HTTPS or reach the server directly.
3. On the server, **nginx** hands the request to **LibreChat**.
4. LibreChat sends the question, the rules and the building handbook to **Google Gemini**, which writes the answer.
5. The answer comes back the same way, and LibreChat saves the chat in **MongoDB**.
6. Every 5 minutes, a small script copies one line per answer (time, wait, success) to **CloudWatch**, where the dashboard and alarms use it.

## Every service used

| Service | What it does for Sohei | Name |
| --- | --- | --- |
| Amazon EC2 | The one server. Runs nginx, LibreChat, MongoDB and Meilisearch in Docker. | `sohei-app`, `t3.medium`, Amazon Linux 2023, 20 GB encrypted disk |
| Elastic IP | A fixed address for the server, used only by CloudFront | `sohei-eip` |
| Security group | The server's firewall: port 80 from CloudFront only, nothing else, no SSH | `sohei-web-sg` |
| Amazon CloudFront | The HTTPS front door. Sends plain HTTP visitors to HTTPS. | `sohei-cdn` |
| Amazon S3 | Private, versioned, encrypted storage for app files, the handbook and backups. Backups older than 7 days are deleted. | `sohei-909927` |
| Parameter Store | Holds the Gemini key and the other secrets. The server reads them when it starts. | `/sohei/` (8 values) |
| Systems Manager | Runs commands on the server without SSH (Run Command) | – |
| IAM roles | Give the server, the health check and the scheduler only the access each needs | `sohei-ec2-role`, `sohei-healthcheck-role`, `sohei-scheduler-role` |
| Amazon CloudWatch | Keeps logs for 14 days, collects metrics, shows the dashboard and runs the alarms | `/sohei/app`, `/sohei/requests`, `/sohei/ops`, dashboard `Sohei` |
| Amazon SNS | Sends the alarm emails | `sohei-alerts` |
| AWS Lambda | Checks every 15 minutes that the live site answers | `sohei-healthcheck` |
| EventBridge Scheduler | Starts the health check every 15 minutes | `sohei-healthcheck-every-15min` |
| AWS CloudTrail | Records every action taken in the AWS account | Set up on day 1 |
| AWS Budgets | Emails at 85% and 100% of US$10 a month, and when the forecast passes 100% | `My Monthly Cost Budget` |
{: .wide}

Outside AWS: the **Google Gemini API** (`gemini-3.5-flash-lite`, free tier) writes the answers.

## Why it is built this way

- **One server keeps it simple and cheap.** The cost is that if the server fails, Sohei is down until it is fixed. See [Next steps]({{ '/next.html' | relative_url }}).
- **No SSH at all.** No port 22 and no key pair. Commands go through Systems Manager, which is logged.
- **Secrets never touch git.** The server builds its settings file from Parameter Store at every start and never prints it.
- **The server rebuilds itself from S3.** At start-up it downloads the latest config and scripts, so a redeploy is "upload, then restart".
