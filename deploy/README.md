# Deploying Sohei

Sohei runs on one EC2 server, `sohei-app`. Visitors reach it only through CloudFront (HTTPS).
There is no SSH: commands go through AWS Systems Manager (Run Command).

## The files

| File | What it does |
| --- | --- |
| `bootstrap.sh` | Runs once on first boot: installs Docker, adds swap, downloads LibreChat and our files, installs the service |
| `start.sh` | Runs at every start: gets the latest files from S3, builds `.env` from Parameter Store, starts the containers |
| `sohei.service` | Makes the server run `start.sh` when it boots |
| `docker-compose.aws.yml` | Server settings for LibreChat: pinned version, our config and logo, only the containers we need |
| `docker-compose.override.yml` | The same idea for running on a laptop. Not used on the server |
| `aws-resources.md` | List of everything created in AWS |

## First deploy

1. Upload `config/`, `deploy/` and `ops/` to `s3://<bucket>/app/`.
2. Launch the server with user data that downloads and runs `bootstrap.sh` from the bucket.
3. Create CloudFront, then save its address in `/sohei/DOMAIN` and restart the service.

## Redeploy after a change

1. Upload the changed files to S3 (run from the repo folder):

   ```bash
   aws s3 sync config s3://<bucket>/app/config --delete --profile ai-sys-sam10-admin
   aws s3 sync deploy s3://<bucket>/app/deploy --delete --profile ai-sys-sam10-admin
   ```

2. Restart the service on the server, using Run Command: `systemctl restart sohei`

The restart gets the new files from S3 and recreates the app and nginx containers. MongoDB keeps running, so no data is lost.

## Change a setting or secret

Change the value in Parameter Store (under `/sohei/`), then restart the service. Secrets are never stored in this repository.
