---
layout: post
title: Postmortems - How to Write and Use Them Effectively
excerpt: How to write and use postmortems effectively.
---

## What Is a Postmortem?

A postmortem is a document written after the patient has died. In the context of software development, a postmortem is a document written after an incident or outage has occurred.

It details the incident's timeline, impact, root cause analysis, and corrective actions taken to prevent similar incidents in the future.

A postmortem is a __blameless document__. The goal is not to point fingers or assign blame. The goal is to understand what went wrong and how to prevent it from happening again.

A postmortem is a learning opportunity for the team to improve their incident response process and prevent similar incidents in the future.

## Why Are Postmortems Important?

* Keep everyone informed about how incident handling is progressing
* Communicate the incident to stakeholders
* Understand the impact of the incident on the business
* Really understand the root cause of the incident
* Great way to share knowledge and learn from mistakes
* Team learns to investigate incidents and improve their understanding of the system
* Make sure the same incident doesn't happen again

### Keep Everyone Informed About How Incident Handling Is Progressing

Writing the postmortem should start immediately when the incident is noticed.

The document should be updated as new information becomes available and should be shared with the team as soon as possible. This ensures that everyone is on the same page, knows who is handling the incident and can contribute to the incident response process.

### Communicate the Incident to Stakeholders

Postmortems are a great way to communicate the incident to stakeholders. They provide a detailed account of what happened, why it happened, and what steps are being taken to prevent similar incidents in the future. This helps build trust with stakeholders and shows that the team is taking the incident seriously.

### Really Understand the Root Cause of the Incident

Postmortems are an opportunity to dig deep into the root cause of the incident. They allow the team to investigate what went wrong, why it went wrong, and what can be done to prevent it from happening again. This helps the team learn from their mistakes, get a better understanding of their own systems and improve their incident response process.

During the postmortem we should really dig deep into the root cause of the incident. 5 Whys is a great technique to use here. It involves asking "why" five times to get to the root cause of the incident. This helps the team understand the underlying issues that led to the incident and identify corrective actions to prevent similar incidents in the future.

Example:
```
Order was shipped twice from the warehouse. 
  Q: Why did our system allow that? 
  A: Because the received order was processed twice. 
    Q: Why did the order processing system allow the same order to be processed multiple times?
    A: Because the system didn't have proper validation checks in place.
      Q: Why didn't the system have proper validation checks in place?
      A: The assumption was that the system would never allow submitting the same order twice.
        Q: Why was the assumption that the system would never allow submitting the same order twice?
        A: Assumption was that the called API would never allow submitting the same order twice.
          Q: Why did caller send the same order twice?
          A: According to the specification, the caller can send the same order multiple times and this is expected behavior.
            -> Fix by adding handling for idempotency
```

__NOTE:__ The point of the postmortem is not to blame anyone. Everyone makes mistakes and the goal is to learn from them.

## How to Write a Postmortem

A postmortem should include the following sections:
1. Incident summary
2. Timeline
3. (Business) Impact
4. Aftercare
5. Root cause analysis
6. Corrective actions
7. (Retrospective)

It is worth mentioning that these sections are not always present in the postmortem. They are not always necessary and it is up to the team to decide which sections to include.

In some companies non-technical stakeholders read the postmortem. In that case the postmortem should be written in an order and include topics that are relevant to the stakeholders. For example, they might be interested in the business impact and the aftercare, as those provide more relevant information for them.

The postmortem should also be tailored to the severity of the incident. If the incident is minor, the postmortem should be short and concise. If the incident is major, the postmortem should be more detailed and include more information.

[Postmortem template](https://docs.google.com/document/d/1UzovOVs4R6dWHhjR3DB9js8rl5Lhwlh1NsQ_L5_RaDc/edit?usp=sharing)

## Bonus: Premortem

A postmortem is performed on a dead patient — what was the cause of death?

A premortem is performed on a living patient — assume the patient died and ask why.

The purpose of the premortem is to think about what could cause the project to fail and try to prevent it from happening.

Guidance template for premortem session:
* We are not asking what might go wrong.
* We are assuming the project failed and ask what did go wrong.
* Over the next few minutes independently write down every reason you can think of for the failure
* We go over the reasons and consider whether there is still something we can do to save the project or patient
* Spend 3 minutes writing down reasons