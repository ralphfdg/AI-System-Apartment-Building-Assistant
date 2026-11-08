---
title: Next steps
level: "8"
description: My next fixes for Sohei, most important first.
---

## In priority order

The order follows the [Well-Architected review]({{ '/well-architected.html' | relative_url }}#the-gap-to-fix-first): the gap that would keep residents offline longest comes first.

1. **Survive a server failure.**
   Today one failure takes Sohei offline. Start with the free and cheap steps: the EC2 recover action on the status-check alarm, daily disk snapshots, and backups copied to a second region. Then run a second server in another Availability Zone behind a load balancer.

2. **Put AWS WAF in front of CloudFront, and raise the minimum TLS version.**
   A web application firewall blocks common attacks and floods of requests before they reach the one server. Today nothing filters traffic, and CloudFront still accepts the old `TLSv1`.

3. **Describe everything as code.**
   Write the AWS setup in CloudFormation or Terraform, so the whole system can be rebuilt from git in minutes instead of by hand.

4. **Use a managed database.**
   A managed service such as Amazon DocumentDB or MongoDB Atlas would handle backups and failover, instead of a script on the server.

5. **Test more answers.**
   Ten questions is a small test, and it found only one weak answer. A set of 50 or more, marked automatically after every change to the handbook or the rules, would catch mistakes early. An alarm on failed answers would also catch a Gemini outage, which the health check cannot see.
