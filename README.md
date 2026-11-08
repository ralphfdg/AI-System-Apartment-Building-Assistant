# AI-System-Apartment-Building-Assistant

**Sohei** (from **So**uth **Hei**ghts) is an AI assistant for residents of
**South Heights Apartments**, a made-up apartment building.
It answers everyday questions: bin day, parking, laundry room, gym hours, moving in,
booking the lift, noise rules, pets, and how to report a repair.
All data in this project is invented. No real people, addresses or resident data are used.
The assistant only gives information. It does not make decisions about residents.

Final project for **SAM10 – Systems Administration and Maintenance**.

## Base system and credit

This project is a reskin of **LibreChat**. I did not write LibreChat; I changed it and run it on AWS.

- **Name:** LibreChat
- **Source:** https://github.com/LibreChat-AI/LibreChat
- **Author:** Danny Avila and the LibreChat contributors
- **Licence:** MIT – https://github.com/LibreChat-AI/LibreChat/blob/main/LICENSE
- **Version used:** v0.8.9-rc1, image `registry.librechat.ai/librechat-ai/librechat:v0.8.9-rc1` (digest `sha256:26e3290c82002fd5e4d5e0fd8f7de4d2f2a430f12049d82190d1e4a80f2a3cb2`)

## AI model

- **Model:** Google Gemini `gemini-3.5-flash-lite` (free tier), called through its API from outside AWS.
- Only invented data is sent to the model.

## How it runs (summary)

- **Live link:** https://d3jo5rdo8zr7zb.cloudfront.net
- **Compute:** one Amazon EC2 `t3.medium` (Amazon Linux 2023) running LibreChat in Docker, region `ap-southeast-2`.
  No SSH: the server is managed with AWS Systems Manager.
- **HTTPS:** Amazon CloudFront. The server only accepts port 80 from CloudFront, so it cannot be reached directly.
- **Content and backups:** Amazon S3 (private, versioned, encrypted)
- **Secrets:** AWS Systems Manager Parameter Store. The server reads them at start-up (no keys in this repository)
- **Monitoring:** Amazon CloudWatch, alerts by Amazon SNS email
- **Audit:** AWS CloudTrail

How to deploy and redeploy: [deploy/README.md](deploy/README.md). Everything created in AWS: [deploy/aws-resources.md](deploy/aws-resources.md).

## Security note

No passwords, API keys or access keys are stored in this repository or its history.
The server's secrets live in AWS Parameter Store and are never printed or written to git.

## Work log

I worked alone on this project.

| Date | What I did |
| --- | --- |
| 6 Nov 2026 | AWS account set up: root MFA, budget alert, IAM user with MFA, admin role, CLI profile, CloudTrail, tags. Created this repository.
| 6 Nov 2026 | Ran LibreChat v0.8.9-rc1 locally in Docker with its original look. Connected Gemini and tested a question. Took screenshot E-05. |
| 6 Nov 2026 | Reskinned LibreChat as Sohei: theme, logo, footer, building handbook and Gemini model spec. Tested answers and refusals. Took screenshot E-01. |
| 7 Nov 2026 | Deployed Sohei to AWS: private S3 bucket, secrets in Parameter Store, EC2 role, CloudFront-only security group, EC2 server with Elastic IP, CloudFront HTTPS. Tested the HTTPS link, then closed registration. Took screenshots E-13 and E-02. |
| 7 Nov 2026 | Logging and automations: CloudWatch agent (memory, disk, app logs), request logger every 5 minutes with 3 metric filters, backup to S3 every 6 hours, health-check Lambda every 15 minutes. Log retention 14 days. Tested each once by hand. |
| 7 Nov 2026 | Monitoring: SNS email topic, `Sohei` dashboard (6 widgets), 5 CloudWatch alarms. Cost alerts use the existing US$10 AWS Budget because the organization blocks `us-east-1` billing alarms. Real alert test (UTC+8): app stopped 20:40:16, ALARM 20:56:53, restarted 21:18:42, OK 21:26:53. |
| 7 Nov 2026 | Project website started in `docs/` (Jekyll, Bootstrap 5, "Lobby Directory" design): 11 pages, architecture diagram (E-18), screenshot slots and visible to-dos for Day 2 Parts B–D. Checked locally in Docker. Not published yet. |
| 8 Nov 2026 | Restore test: marker chat on the live site, backup run by hand, restored onto the laptop with `mongorestore` (82 documents, 0 failed), marker chat found. Restore time 2 min 31 s; RPO up to 6 hours. S3 handbook version restored from an older version ID. Facts in `docs/notes/facts-day2.md`. |
| 8 Nov 2026 | Disk-full fault on the live server with noisy containers (no Docker log limit). Round 1: CPU alarm 02:16 UTC, safety guard stopped it at 91% before the disk alarm (5-minute average). Round 2: disk held at 87%, `sohei-disk-high` fired 02:58:53 UTC, space back 03:02. Fix: `deploy/daemon.json` (3 × 10 MB logs), installed by `bootstrap.sh`; proven with a 5-minute test (log capped at 23 MB). Evidence in `docs/notes/fault-evidence.md`. |
| 8 Nov 2026 | Quality and security checks: 10 test questions asked on the live site (suggested 10 of 10 correct, average answer 1.27 s); security controls checked live with read-only commands; gitleaks scan of the full history found no leaks; Well-Architected and cost facts collected. Notes in `docs/notes/`. |

## Use of AI tools

I used Claude (Anthropic) to help plan the project, explain AWS steps, and help write
configuration and scripts. I checked its output by testing each step myself and
reading the AWS and LibreChat documentation.
At my request, Claude also drafted the RPO and RTO sentences for the restore test;
I checked them against the measured facts and edited them.