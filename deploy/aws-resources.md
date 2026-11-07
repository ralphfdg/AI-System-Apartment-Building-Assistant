# AWS resources

Everything created for Sohei. Region `ap-southeast-2` unless noted. No secrets in this file.
Tags on everything that supports them: `Project=SAM10`, `Owner=Ethan`.

Account: `411145868626`

## Storage

| Resource | Name | Notes |
| --- | --- | --- |
| S3 bucket | `sohei-909927` | Private (all four public blocks on), versioning on, SSE-S3 encryption |
| S3 lifecycle rule | `sohei-delete-old-backups` | Under `backups/`: delete after 7 days, old versions after 7 days |

Folders: `app/` (server files), `content/` (building handbook), `backups/`.

## Parameter Store

Path `/sohei/`. Values are never written down or shown.

| Parameter | Type | Notes |
| --- | --- | --- |
| `/sohei/GOOGLE_KEY` | SecureString | Gemini key |
| `/sohei/CREDS_KEY` | SecureString | Random, server only |
| `/sohei/CREDS_IV` | SecureString | Random, server only |
| `/sohei/JWT_SECRET` | SecureString | Random, server only |
| `/sohei/JWT_REFRESH_SECRET` | SecureString | Random, server only |
| `/sohei/MEILI_MASTER_KEY` | SecureString | Random, server only |
| `/sohei/DOMAIN` | String | Site address. Placeholder until CloudFront exists |
| `/sohei/ALLOW_REGISTRATION` | String | `true` for now, `false` after test users exist |

## Permissions

| Resource | Name / ARN | Notes |
| --- | --- | --- |
| IAM role | `arn:aws:iam::411145868626:role/sohei-ec2-role` | Trusted by EC2 only |
| Inline policy | `sohei-ec2-access` | Read `/sohei/*` parameters, list the bucket, read and write its objects |
| Managed policies | `AmazonSSMManagedInstanceCore`, `CloudWatchAgentServerPolicy` | Run Command and Session Manager, CloudWatch agent |
| Instance profile | `arn:aws:iam::411145868626:instance-profile/sohei-ec2-role` | Attaches the role to the server |

## Network

| Resource | Name / ID | Notes |
| --- | --- | --- |
| Default VPC | `vpc-0343e6a641f4c65bd` | Already existed |
| Security group | `sohei-web-sg` / `sg-00c36f88e0771f16f` | Inbound TCP 80 from CloudFront only. No other inbound rules |
| CloudFront prefix list | `pl-b8a742d1` | AWS managed: `com.amazonaws.global.cloudfront.origin-facing` |
| Elastic IP | `sohei-eip` / `eipalloc-02246b85f3fc5e325` | `13.238.13.39`, DNS `ec2-13-238-13-39.ap-southeast-2.compute.amazonaws.com` |

## Server

| Resource | Name / ID | Notes |
| --- | --- | --- |
| EC2 instance | `sohei-app` / `i-0f42c5b9e0e88a6ee` | Amazon Linux 2023, `t3.medium`, no key pair, IMDSv2 required, `ap-southeast-2b` |
| EBS volume | `sohei-app-disk` / `vol-0c6cddc10c387b75b` | 20 GB gp3, encrypted |

## HTTPS

| Resource | Name / ID | Notes |
| --- | --- | --- |
| CloudFront distribution | `sohei-cdn` / `E2UIHSZ4WECRY4` | `arn:aws:cloudfront::411145868626:distribution/E2UIHSZ4WECRY4` |
| Public link | `https://d3jo5rdo8zr7zb.cloudfront.net` | HTTP redirects to HTTPS. Caching off. Origin is the Elastic IP's DNS name, HTTP port 80 |
