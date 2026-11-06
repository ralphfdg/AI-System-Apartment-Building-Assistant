# AI-System-South-East-University-Helpdesk

An AI helpdesk assistant for **South East University IT Services**, a made-up university.
It answers common IT questions (Wi-Fi, passwords, printing, VPN, email, opening hours).
All data in this project is invented. No real people or real student data are used.

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

Date	| What I did	
6 Nov 2026	| Root MFA, budget, IAM user and role, CloudTrail