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
- **Version used:** _to be added_

## AI model

- **Model:** Google Gemini (free tier), called through its API from outside AWS.
- Only invented data is sent to the model.

## How it runs (summary)

- **Compute:** one Amazon EC2 instance running LibreChat in Docker (region `ap-southeast-2`)
- **HTTPS:** Amazon CloudFront
- **Content and backups:** Amazon S3
- **Secrets:** AWS Systems Manager Parameter Store (no keys in this repository)
- **Monitoring:** Amazon CloudWatch, alerts by Amazon SNS email
- **Audit:** AWS CloudTrail

## Security note

No passwords, API keys or access keys are stored in this repository or its history.
All secrets live in AWS Parameter Store.

## Work log

I worked alone on this project.

| Date | What I did |
| --- | --- |
| 6 Nov 2026 | AWS account set up: root MFA, budget alert, IAM user with MFA, admin role, CLI profile, CloudTrail, tags. Created this repository.
| 6 Nov 2026 | Ran LibreChat v0.8.9-rc1 locally in Docker with its original look. Connected Gemini and tested a question. Took screenshot E-05. |

## Use of AI tools

I used Claude (Anthropic) to help plan the project, explain AWS steps, and help write
configuration and scripts. I checked its output by testing each step myself and
reading the AWS and LibreChat documentation.