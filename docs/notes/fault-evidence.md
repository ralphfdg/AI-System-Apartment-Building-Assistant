# Fault evidence – disk full from container logs (E-15)

Planned fault on the live server `sohei-app` (`i-0f42c5b9e0e88a6ee`), 8 Nov 2026. All times UTC.
Commands were run through Systems Manager Run Command (no SSH). Full timeline: `facts-day2.md`, Part C.

## 1. During the fault – what CloudWatch recorded

`CWAgent` `disk_used_percent` (path `/`), maximum per minute. Times here are UTC+8, as CloudWatch printed them.

```
10:05 45.3  10:10 46.0  10:11 56.0  10:12 66.1  10:16 66.9  10:20 67.1  10:24 68.2
10:27 88.3  10:28 88.3  10:29 69.3  10:33 68.7  10:35 71.2  10:36 73.7  10:38 78.7
10:41 80.0  10:42 90.0  10:43 45.4  10:44 45.4
```

Safety guard log on the server (`/var/log/sohei-disk-guard.log`):

```
2026-11-08T02:14:01Z fast filler stopped at 87%
2026-11-08T02:14:02Z chatty-2..4 started
2026-11-08T02:27:50Z fast filler stopped again at 89%
2026-11-08T02:42:53Z chatty-steady paused at 91%
2026-11-08T02:42:59Z guard removed chatty containers at 91%
```

Log sizes measured while the fault ran:

| Time | Container | Log file size |
| --- | --- | --- |
| 02:08:20 | `chatty` (2 min 19 s old) | 32 MB |
| 02:34:19 | `chatty-steady` (30 s old) | 128 MB |

## 2. After the guard removed the containers – investigation (SSM `45088b62-e5ee-459a-b1a6-0528c1176b40`)

```
$ date -u
2026-11-08T02:45:48Z
$ df -h /
Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p1   20G  9.1G   11G  46% /
$ sudo du -sh /var/lib/docker/containers/* | sort -h | tail
64K	/var/lib/docker/containers/6b82f6257a8fd6ebf6209f5b4a94b29e3e8745c286853b712dd8d9687fdc13e2
116K	/var/lib/docker/containers/117af312aae185b1ac70ca21efad901dc8080bc2fb03b6233db5ac37a57e1bc5
240K	/var/lib/docker/containers/fc305580be6e6aa10fd98e5fd772b41591492c3f5a6729a020c537772b124a18
4.6M	/var/lib/docker/containers/a149297394738358f2995b5f4a4be28bad6930e502b26f7aa67d630e124443f8
$ docker system df
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          5         4         3.873GB   8.431MB (0%)
Containers      4         4         2.464kB   0B (0%)
Local Volumes   2         2         396B      0B (0%)
Build Cache     0         0         0B        0B
$ ls -lh /var/lib/docker/containers/*/*-json.log
-rw-r-----. 1 root root  61K Nov  7 13:18 /var/lib/docker/containers/117af312aae185b1ac70ca21efad901dc8080bc2fb03b6233db5ac37a57e1bc5/117af312aae185b1ac70ca21efad901dc8080bc2fb03b6233db5ac37a57e1bc5-json.log
-rw-r-----. 1 root root  15K Nov  7 13:18 /var/lib/docker/containers/6b82f6257a8fd6ebf6209f5b4a94b29e3e8745c286853b712dd8d9687fdc13e2/6b82f6257a8fd6ebf6209f5b4a94b29e3e8745c286853b712dd8d9687fdc13e2-json.log
-rw-r-----. 1 root root 4.2M Nov  8 02:45 /var/lib/docker/containers/a149297394738358f2995b5f4a4be28bad6930e502b26f7aa67d630e124443f8/a149297394738358f2995b5f4a4be28bad6930e502b26f7aa67d630e124443f8-json.log
-rw-r-----. 1 root root 194K Nov  8 02:40 /var/lib/docker/containers/fc305580be6e6aa10fd98e5fd772b41591492c3f5a6729a020c537772b124a18/fc305580be6e6aa10fd98e5fd772b41591492c3f5a6729a020c537772b124a18-json.log
$ docker info --format {{.LoggingDriver}}
json-file
$ cat /etc/docker/daemon.json
cat: /etc/docker/daemon.json: No such file or directory
$ cat /var/log/sohei-disk-guard.log
2026-11-08T02:14:01Z fast filler stopped at 87%
2026-11-08T02:14:02Z chatty-2..4 started
2026-11-08T02:27:50Z fast filler stopped again at 89%
2026-11-08T02:42:53Z chatty-steady paused at 91%
2026-11-08T02:42:59Z guard removed chatty containers at 91%
$ docker ps -a --format {{.Names}} {{.Status}}
LibreChat-NGINX Up 13 hours
LibreChat-API Up 13 hours
chat-meilisearch Up 13 hours
chat-mongodb Up 13 hours
$ systemctl is-active sohei-disk-guard sohei-fast-guard sohei-fast-guard2 sohei-pause-guard
inactive
inactive
inactive
inactive

```

## 3. What the evidence shows (facts for the student's explanation)

- Docker's log driver is `json-file` and there is no `/etc/docker/daemon.json`, so container logs have **no size limit**.
- One container that only prints lines grew its log by about 0.23 MB/s (`chatty`) to 4 MB/s (`chatty-steady`). The disk went from 46% to 91% in 37 minutes.
- When the containers were removed, their log files were deleted and the disk went straight back to 46% (9.1 GB used, 11 GB free): **all the extra space was container logs**.
- The server uses XFS. With fast-growing files, XFS reserves extra space ahead, so `df` and the CloudWatch metric jumped (68% → 88% → 69% at 10:27–10:29) and gave the space back when writing stopped.
- The app stayed up: `Sohei/HealthCheckOK` minimum = 1 in every 15-minute window 02:00–02:45.

## 4. Round 2 (student's request: make the disk alarm fire) – evidence while the disk was full

Measured fill: short-lived `chatty-fill-N` containers, each `yes 'fake log line from chatty-fill' | head -n <lines>` (up to about 1 GB of log each), then the disk held at 87–88% with nothing writing.

Fill log (`/var/log/sohei-disk-guard.log`):

```
2026-11-08T02:50:12Z round 2 started
2026-11-08T02:50:44Z chatty-fill-1 wrote up to 1024 MB, disk now 51%
2026-11-08T02:51:16Z chatty-fill-2 wrote up to 1024 MB, disk now 56%
2026-11-08T02:51:48Z chatty-fill-3 wrote up to 1024 MB, disk now 61%
2026-11-08T02:52:20Z chatty-fill-4 wrote up to 1024 MB, disk now 66%
2026-11-08T02:52:51Z chatty-fill-5 wrote up to 1024 MB, disk now 71%
2026-11-08T02:53:23Z chatty-fill-6 wrote up to 1024 MB, disk now 76%
2026-11-08T02:53:56Z chatty-fill-7 wrote up to 1024 MB, disk now 81%
2026-11-08T02:54:28Z chatty-fill-8 wrote up to 1024 MB, disk now 86%
2026-11-08T02:54:39Z chatty-fill-9 wrote up to 228 MB, disk now 88%
2026-11-08T02:54:39Z fill done, holding at 88%
```

CloudWatch `disk_used_percent` (UTC+8): `10:50 51.7  10:51 61.2  10:52 70.7  10:53 80.8  10:54 87.0  10:55 87.0  10:56 87.0`

Alarm history: `2026-11-08T10:58:53+08:00 Alarm updated from OK to ALARM` (`sohei-disk-high`).

Investigation, then stop (SSM `e8deac98-f052-4041-8c56-e4f76ef924b8`):

```
$ date -u
2026-11-08T03:02:11Z
$ df -h /
Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p1   20G   18G  2.6G  88% /
$ sudo du -sh /var/lib/docker/containers/* | sort -h | tail
4.6M	/var/lib/docker/containers/a149297394738358f2995b5f4a4be28bad6930e502b26f7aa67d630e124443f8
231M	/var/lib/docker/containers/278c2cf8c2a3ee57f0c32cd78e14e4a4013461c934d9b7bddcaef34a31e514c7
1.1G	/var/lib/docker/containers/1753c1f880377583feaae9199a5fee351f81579d8a9c20a5f4dbd4a2b536686b
1.1G	/var/lib/docker/containers/2cd4101843e6e935ee330560807def6d4f494bf259511bc8b4fa7e07713268e2
1.1G	/var/lib/docker/containers/733b4907502f29ae46ef1ff19e46b50e862ed99ff5cb369f88e15bf554bf469f
1.1G	/var/lib/docker/containers/7dd77d852d5e1a9f11c8c21678e4261c64235299d0a63fda62992af19638e514
1.1G	/var/lib/docker/containers/97f79044d141f9af755ee3c2894f3736d2cf20166adb03ee57cf32bc1229a7b5
1.1G	/var/lib/docker/containers/b6dee4fb9d987f4583eb4e5b93f8ead36d03c99e624c21786962e4154cca6d66
1.1G	/var/lib/docker/containers/d0ef7854d52af756a99dbb6411f1ce543c44a18c00ddd5cba77a22d2ceaab723
1.1G	/var/lib/docker/containers/eebdc8f8959ce615628ba72b1c8b61784b36b9ac8ce2696a4de8130fb3de505f
$ docker system df
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          5         5         3.873GB   0B (0%)
Containers      14        4         2.464kB   0B (0%)
Local Volumes   2         2         396B      0B (0%)
Build Cache     0         0         0B        0B
$ docker ps -a --filter name=chatty
chatty-fill-9 Exited (0) 7 minutes ago
chatty-fill-8 Exited (0) 7 minutes ago
chatty-fill-7 Exited (0) 8 minutes ago
chatty-fill-6 Exited (0) 8 minutes ago
chatty-fill-5 Exited (0) 9 minutes ago
chatty-fill-4 Exited (0) 9 minutes ago
chatty-fill-3 Exited (0) 10 minutes ago
chatty-fill-2 Exited (0) 10 minutes ago
chatty-fill-1 Exited (0) 11 minutes ago
chatty-fill-0 Exited (0) 11 minutes ago
$ ls -lh (largest container log)
-rw-r-----. 1 root root 1.1G Nov  8 02:51 /var/lib/docker/containers/2cd4101843e6e935ee330560807def6d4f494bf259511bc8b4fa7e07713268e2/2cd4101843e6e935ee330560807def6d4f494bf259511bc8b4fa7e07713268e2-json.log
-rw-r-----. 1 root root 1.1G Nov  8 02:53 /var/lib/docker/containers/97f79044d141f9af755ee3c2894f3736d2cf20166adb03ee57cf32bc1229a7b5/97f79044d141f9af755ee3c2894f3736d2cf20166adb03ee57cf32bc1229a7b5-json.log
-rw-r-----. 1 root root 1.1G Nov  8 02:52 /var/lib/docker/containers/b6dee4fb9d987f4583eb4e5b93f8ead36d03c99e624c21786962e4154cca6d66/b6dee4fb9d987f4583eb4e5b93f8ead36d03c99e624c21786962e4154cca6d66-json.log
$ docker rm -f chatty containers
10
2026-11-08T03:02:11Z
$ df -h / (after)
Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p1   20G  9.1G   11G  46% /

```

- 9 container log files of about 1.1 GB each (plus one of 231 MB) = about 9 GB, all under `/var/lib/docker/containers/`.
- `docker system df` shows the containers themselves as only 2.464 kB: the space is in their **logs**, which `docker system df` does not count.
- After `docker rm -f` of the 10 `chatty-fill` containers: 88% → 46% (18 GB → 9.1 GB used), about 9 GB back.

## 5. Proof that the fix works (step 7)

`chatty` started again at 03:12:05 UTC with the limit on (SSM `0987a395-7da4-4d14-a302-35294819c9d4`):

```
chatty log config: json-file {"max-file":"3","max-size":"10m"}
```

After 5 minutes (SSM `16730569-5cf5-4e32-a279-3d7302b323fd`):

```
2026-11-08T03:17:18Z
$ docker ps --filter name=chatty
chatty Up 5 minutes
$ ls -lh chatty log files
total 23M
-rw-r-----. 1 root root 2.9M Nov  8 03:17 8b45b17a35b83e415be28fa0bca18557abd21d9aad6c855a71b0598468a9c390-json.log
-rw-r-----. 1 root root 9.6M Nov  8 03:17 8b45b17a35b83e415be28fa0bca18557abd21d9aad6c855a71b0598468a9c390-json.log.1
-rw-r-----. 1 root root 9.6M Nov  8 03:16 8b45b17a35b83e415be28fa0bca18557abd21d9aad6c855a71b0598468a9c390-json.log.2
drwx------. 2 root root    6 Nov  8 03:12 checkpoints
-rw-------. 1 root root 2.7K Nov  8 03:12 config.v2.json
-rw-------. 1 root root 1.5K Nov  8 03:12 hostconfig.json
-rw-r--r--. 1 root root   13 Nov  8 03:12 hostname
-rw-r--r--. 1 root root  174 Nov  8 03:12 hosts
drwx--x---. 2 root root    6 Nov  8 03:12 mounts
-rw-r--r--. 1 root root  815 Nov  8 03:12 resolv.conf
-rw-r--r--. 1 root root   71 Nov  8 03:12 resolv.conf.hash
$ du -sh chatty folder
23M	/var/lib/docker/containers/8b45b17a35b83e415be28fa0bca18557abd21d9aad6c855a71b0598468a9c390
$ df -h /
Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p1   20G  9.1G   11G  46% /
$ docker rm -f chatty
chatty
2026-11-08T03:17:19Z
$ df -h / (after)
/dev/nvme0n1p1   20G  9.1G   11G  46% /

```

- Docker rotated the log: at most 3 files (`-json.log`, `.1`, `.2`), each up to about 10 MB; 23 MB in total after 5 minutes.
- Without the limit, the same container wrote 32 MB in the first 2 min 19 s (round 1).
- Disk stayed at 46% the whole time.
