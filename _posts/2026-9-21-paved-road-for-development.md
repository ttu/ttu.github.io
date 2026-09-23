---
layout: post
title: Paved Road for Development
excerpt: The paved road is the base for developer experience. Environment, context, guardrails and feedback. And in the age of AI it matters more than ever.
---

The paved road is the foundation of developer experience.

It is a well-marked path like that makes work easier, faster and simply more pleasant.

> Make the safe, common way the easiest way, without making it the only way.

Depending on the scale you look at, a paved road means different things.
* For a whole organization it can cover how work is planned, how services are operated and how incidents are handled.
* For a single team it is the tooling, conventions and automation already in place in the repository, so a developer can focus on the actual problem instead of fighting the setup.

This post stays at the level of the code creation process: getting an environment up, writing the code, and getting it merged. It mainly covers 4 aspects: Environment, Context, Guardrails, and Feedback.



![Paved Road](/images/posts/paved-road/paved-road.png){: width="850" }

* **Environment:** everything needed to get from a fresh clone to running code, identically every time
* **Context:** the written-down knowledge that tells a newcomer how things are done and why
* **Guardrails:** automated checks that catch mistakes early
* **Feedback:** fast, visible signals about whether a change actually works before it reaches production

Funnily enough, in the age of AI this matters even more than before. An agent won't be happier for it, but it will produce working functionality with good enough quality, because the same road that keeps humans from getting lost keeps the agent on track.

## Environment

Everything needed to get from a fresh clone to running code, identically every time.

* **Devcontainer**
  * Consistent, reproducible dev setup: same OS, tools, versions, extensions for every human or agent
* **Dependency management**
  * Lockfiles & pinned versions: same package versions everywhere, no "works on my machine"
* **Secrets & config**
  * Standardized env vars / secrets injection: no hardcoded credentials, same access pattern for humans & agents
* **Seed data / fixtures**
  * Reproducible, realistic test data on spin-up: consistent starting state, not just tooling

## Context

The written-down knowledge that tells a newcomer, human or agent, how things are done here and why.

* **Rules**
  * Explicit constraints & conventions: coding standards, do's/don'ts
* **Documentation**
  * Why things are the way they are: architecture, decisions, how-tos
* **Agent instructions**
  * AGENTS.md style files: explicit, scoped guidance for AI coding agents specifically

## Guardrails

Automated checks that catch mistakes as early and as cheaply as possible.

* **Linters / Formatters**
  * Catch style & correctness issues automatically, before review
* **Type checking**
  * Static analysis of types: catches whole classes of bugs before runtime
* **Security & dependency scanning**
  * SAST + known-vulnerability checks: blocks risky code/packages before merge
* **Tests**
  * Verify behavior stays correct: unit, integration, etc.
* **Pre-commit / Pre-push hooks**
  * Fail fast, locally: before code even reaches CI

## Feedback

Fast, visible signals about whether a change actually works before it reaches production.

* **CI**
  * Automated build/test/lint runs on push: the shared source of truth
* **Review bots / PR comments**
  * Automated summaries, risk flags, suggestions surfaced inline on the PR
* **Automatic PR environments**
  * Ephemeral, real running instance per PR: see the change, not just diffs
* **Required reviews**
  * Human approval gate: even AI-authored changes get a second set of eyes

## Paved Road Extensions

As mentioned in the beginning, a paved road can cover much more than the code creation process. Once several teams share the same road, it pays to standardize a level higher, on the practices, tools and signals that apply across the whole development organization. Exactly which ones are worth paving depends on the organization and the projects it runs.

* **Process practices**
  * Shared workflows for how work moves from idea to production: branching, release cadence, incident handling. Consistent execution, less friction for both humans and agents
* **Documentation practices**
  * Agreed formats for ADRs, design docs and postmortems: decisions, designs and learnings are written down the same way everywhere, so they are findable later
* **Tooling**
  * A standardized, supported toolchain: everyone gets the same capabilities, and improvements to the tools reach everyone at once
* **Observability**
  * Common logging, metrics and tracing conventions: the same visibility into system behavior in every service, for whoever is debugging it
* **Build & quality dashboards**
  * Trends on flaky tests, CI duration and failure rates: the signal that tells you when the road itself needs fixing
