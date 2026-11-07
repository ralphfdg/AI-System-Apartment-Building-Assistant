---
title: "Runbook: disk full"
level: 6M
description: What to do when the server's disk fills up because a container's log file grew without a limit. Level 6M is the mezzanine above Automation & incident.
---

{% include todo.html text="Rewrite each step in my own words after Day 2 Part C, and check the headings against Appendix D of the brief" %}

All commands run on the server through **Systems Manager → Run Command** (document `AWS-RunShellScript`). There is no SSH.

## Symptoms

- An email from the alarm `sohei-disk-high`: the disk has been more than 85% full for 5 minutes.
- The "Disk used" graph on the `Sohei` dashboard climbs steadily.
- Later: Sohei stops saving chats, and the health check may start failing.

## First checks

These commands only read. They change nothing.

```bash
df -h /
sudo du -sh /var/lib/docker/containers/* | sort -h | tail
docker system df
```

Then list the largest container log file found by the second command:

```bash
ls -lh /var/lib/docker/containers/<container-id>/*-json.log
```

## Fix steps

{% include todo.html text="Exact fix steps, as done in Day 2 Part C" %}

Never remove the Sohei containers (`LibreChat-API`, `LibreChat-NGINX`, `chat-mongodb`, `chat-meilisearch`). Only remove the container whose log is filling the disk.

## How to confirm it is fixed

- `df -h /` shows the disk back to its normal level.
- The alarm `sohei-disk-high` sends its "OK" email.
- The health check graph stays at 1.

## Prevention

Give Docker a log size limit in `/etc/docker/daemon.json`, then recreate the containers so they pick it up:

```json
{"log-driver": "json-file", "log-opts": {"max-size": "10m", "max-file": "3"}}
```

{% include todo.html text="Confirm the limit is installed by bootstrap.sh and proven with a test" %}

## Last tested

{% include todo.html text="Date, and who followed this runbook" %}
