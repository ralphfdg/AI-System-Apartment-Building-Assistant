"""Sohei health check (automation 2). AWS Lambda, run every 15 minutes by EventBridge Scheduler.

Calls the public HTTPS link, sends the metric Sohei/HealthCheckOK (1 = up, 0 = down),
and writes one log line: time, status code, milliseconds.
"""
import datetime
import json
import os
import time
import urllib.error
import urllib.request

import boto3

URL = os.environ["HEALTH_URL"]  # https://<cloudfront>/api/config
cloudwatch = boto3.client("cloudwatch")


def lambda_handler(event, context):
    start = time.time()
    status = 0
    error = None
    try:
        with urllib.request.urlopen(URL, timeout=10) as response:
            status = response.status
            body = response.read()
        ok = status == 200 and b"appTitle" in body
    except urllib.error.HTTPError as e:
        status = e.code
        ok = False
    except Exception as e:  # timeout, DNS, connection refused, ...
        error = type(e).__name__
        ok = False
    ms = int((time.time() - start) * 1000)

    cloudwatch.put_metric_data(
        Namespace="Sohei",
        MetricData=[{"MetricName": "HealthCheckOK", "Value": 1 if ok else 0, "Unit": "Count"}],
    )

    line = {
        "time": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "ok": ok,
        "status": status,
        "ms": ms,
    }
    if error:
        line["error"] = error
    print(json.dumps(line))
    return line
