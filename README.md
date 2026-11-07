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

## Use of AI tools

I used Claude (Anthropic) to help plan the project, explain AWS steps, and help write
configuration and scripts. I checked its output by testing each step myself and
reading the AWS and LibreChat documentation.