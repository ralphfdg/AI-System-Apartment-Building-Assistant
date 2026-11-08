---
title: "Runbook: disk full"
level: 6M
description: Steps for freeing the server's disk when a container log fills it. This floor hangs off level 6 as a mezzanine.
---

<dl class="facts">
  <dt>Owner</dt><dd>{{ site.student_name }}</dd>
  <dt>Last tested</dt><dd>8 Nov 2026, on the live server during the planned disk-full fault (<a href="{{ '/automation-incident.html' | relative_url }}">Automation &amp; incident</a>)</dd>
  <dt>Takes</dt><dd>About 5 minutes: 3 min 18 s to free the space in the test, and about 2 minutes more for the log limit</dd>
  <dt>Ask</dt><dd>{{ site.student_name }}</dd>
</dl>

All commands run on the server through **Systems Manager → Run Command** (document `AWS-RunShellScript`). There is no SSH.

## 1. What this is for

Freeing the server's disk when a container's log file has filled it, and stopping it from happening again.

## 2. How you know you need it

- The alarm **`sohei-disk-high`** emails you: the disk has been more than 85% full for 5 minutes.
- The "Disk used" graph on the `Sohei` dashboard climbs.
- Sometimes **`sohei-cpu-high`** fires first, because a container that writes non-stop also keeps the CPU busy.

Command that shows the problem:

```bash
df -h /
```

You should see `Use%` above 85% (88% in the test).

## 3. What it affects

While the disk still has some room, nobody notices. When it reaches 100%, MongoDB and Sohei can no longer save chats or log in users, so every resident is affected. MongoDB can also be damaged by a full disk.

## 4. How to do it

**Step 1: find the biggest container folder.**

```bash
sudo du -sh /var/lib/docker/containers/* | sort -h | tail
```

→ You should see one or more folders far bigger than the rest (1.1 GB each in the test). The long folder name is the container ID.

**Step 2: confirm that it is a log file.**

```bash
sudo ls -lhS /var/lib/docker/containers/*/*-json.log | head -3
```

→ You should see a `<id>-json.log` file of about the same size. (`docker system df` does **not** count these logs, so do not trust it here.)

**Step 3: find the container's name.**

```bash
docker ps -a --no-trunc | grep <container-id>
```

→ You should see one line with its name in the last column.

**Step 4: remove that container only.**

```bash
docker rm -f <name>
```

→ You should see the name printed back. `df -h /` drops at once (88% → 46% in the test). **Never** remove the four Sohei containers: `LibreChat-API`, `LibreChat-NGINX`, `chat-mongodb`, `chat-meilisearch`.

**Step 5: make sure the log limit is in place.**

{% raw %}
```bash
cat /etc/docker/daemon.json
docker inspect -f '{{json .HostConfig.LogConfig}}' LibreChat-API
```
{% endraw %}

→ You should see `"max-size": "10m"` and `"max-file": "3"` in both. If not, install it and recreate the containers (step 6).

**Step 6 (only if step 5 failed): install the limit.**

```bash
sudo install -m 644 /opt/sohei/app/deploy/daemon.json /etc/docker/daemon.json
sudo systemctl restart docker
cd /opt/sohei/LibreChat
docker compose -f deploy-compose.yml -f /opt/sohei/app/deploy/docker-compose.aws.yml up -d --force-recreate
docker ps
```

→ You should see **all 4** Sohei containers `Up`. The site is down for about 1 minute while Docker restarts.

## 5. How to check it worked

- [ ] `df -h /` is back to its normal level (46%), and `sohei-disk-high` sends its "OK" email.
- [ ] Ask the test question from the system card, "When do I put the general waste bins out?", and get "Tuesday night".
- [ ] No new alarms for 10 minutes, and the health check graph stays at 1.

## 6. How to undo it

- A removed test or noisy container is not needed. Do not start it again.
- If step 6 left the site down (a 502 error) or a container is missing in `docker ps`, run the `docker compose … up -d` line again.
- If the log limit causes a problem, delete `/etc/docker/daemon.json`, restart Docker and recreate the containers as in step 6.
- If MongoDB was damaged, restore the latest backup from S3 (see [Backup &amp; restore]({{ '/operations.html' | relative_url }}#backup--restore)).

## 7. Gotchas

- `df` can jump by 10–20% in seconds while a log file grows fast. The server's file system (XFS) reserves extra space for growing files, then gives it back.
- The disk alarm uses a **5-minute average**. A very fast fill (79% to 91% in about 4 minutes) can fill the disk before the alarm fires.
- `docker system df` shows almost nothing for containers, because it ignores their log files. Use `du` instead.
- The log limit only applies to containers created **after** Docker restarts with it. Old containers must be recreated.
- `up -d --force-recreate` right after a Docker restart can stop part-way with "No such container", leaving MongoDB stopped. Always check `docker ps`.

## 8. Change history

| Date | What changed and why |
| --- | --- |
| 7 Nov 2026 | First version, written before the fault test |
| 8 Nov 2026 | Rewritten to the Appendix D template after the real fault: exact fix steps, the log limit, and the gotchas found during the test |
{: .wide}
