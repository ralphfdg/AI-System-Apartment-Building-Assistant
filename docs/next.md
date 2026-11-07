---
title: Next steps
level: "8"
description: What would make Sohei safer and more reliable next, in order of priority.
---

## In priority order

{% include todo.html text="Confirm this order after the Well-Architected review" %}

1. **Put AWS WAF in front of CloudFront.**
   A web application firewall blocks common attacks and floods of requests before they reach the one server. Today nothing filters traffic.

2. **Survive a server failure.**
   Run a second server in another Availability Zone behind a load balancer, or at least keep a tested script that builds a new server and restores the latest backup. Today one failure takes Sohei offline.

3. **Describe everything as code.**
   Write the AWS setup in CloudFormation or Terraform, so the whole system can be rebuilt from git in minutes instead of by hand.

4. **Use a managed database.**
   A managed service such as Amazon DocumentDB or MongoDB Atlas would handle backups and failover, instead of a script on the server.

5. **Test the answers properly.**
   Ten questions is a small test. A set of 50 or more, marked automatically after every change to the handbook or the rules, would catch mistakes early.
