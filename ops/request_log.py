#!/usr/bin/env python3
"""Sohei request logger. Runs every 5 minutes from cron, as root.

Reads the answers saved since the last run from MongoDB and writes one JSON line
per answered question to /var/log/sohei/requests.log (the CloudWatch agent sends it on).
MongoDB stays private: we reach it with `docker exec` on the Mongo container.
"""
import datetime
import json
import subprocess

LOG_FILE = "/var/log/sohei/requests.log"
STATE_FILE = "/var/lib/sohei/request_log.state"  # time of the last answer we logged
APP_VERSION = "sohei-v1"

# Runs inside mongosh. Prints one JSON object per answer, oldest first.
QUERY = r"""
db.messages.find({isCreatedByUser: false, createdAt: {$gt: new Date(SINCE)}}).sort({createdAt: 1}).forEach(a => {
  const q = db.messages.findOne({messageId: a.parentMessageId});
  const part = p => (typeof p.text === 'string' ? p.text : (p.text && p.text.value) || '');
  const answer = a.text || (a.content || []).filter(p => p.type === 'text').map(part).join('');
  print(JSON.stringify({
    question: q ? (q.text || '') : '',
    question_time: q ? q.createdAt.toISOString() : null,
    answer: answer,
    answer_time: a.createdAt.toISOString(),
    error: !!a.error,
    unfinished: !!a.unfinished,
    model: a.model || ''
  }));
});
"""


def parse_time(text):
    return datetime.datetime.fromisoformat(text.replace("Z", "+00:00"))


def read_state():
    try:
        with open(STATE_FILE) as f:
            return f.read().strip()
    except FileNotFoundError:
        return "1970-01-01T00:00:00.000Z"  # first run: log everything so far


def main():
    since = read_state()
    script = "const SINCE = " + json.dumps(since) + ";\n" + QUERY
    result = subprocess.run(
        ["docker", "exec", "chat-mongodb", "mongosh", "LibreChat", "--quiet", "--eval", script],
        capture_output=True, text=True, check=True, timeout=120,
    )

    lines = []
    last = since
    for raw in result.stdout.splitlines():
        raw = raw.strip()
        if not raw.startswith("{"):
            continue
        m = json.loads(raw)
        latency = None
        if m["question_time"]:
            latency = round((parse_time(m["answer_time"]) - parse_time(m["question_time"])).total_seconds(), 2)
        success = not m["error"] and not m["unfinished"] and bool(m["answer"].strip())
        lines.append(json.dumps({
            "time": m["answer_time"],
            "question": m["question"][:200],
            "answer": m["answer"][:200],
            "latency_seconds": latency,
            "success": success,
            "app_version": APP_VERSION,
            "model": m["model"],
        }, ensure_ascii=False))
        last = m["answer_time"]

    if lines:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write("\n".join(lines) + "\n")
    with open(STATE_FILE, "w") as f:
        f.write(last)


if __name__ == "__main__":
    main()
