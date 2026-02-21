---
layout: post
title: How DORA Metrics Help Teams Track Process Improvement
excerpt: A brief guide on DORA metrics and how they can be used to keep track of improvements in the software development process.
---

## The Fundamental Principle of Metrics

It is crucial to remember one fundamental principle when working with metrics:

> You get what you measure

Choose metrics that help your team improve and achieve their goals. Focus on measuring what matters most for success.

Using metrics to track individual performance often signals trust issues in the organization. Fix these trust issues first, as individual metrics can harm team spirit and collaboration.

## DORA Metrics to Help with Common Pain Points

Common issues that teams often discuss in retrospectives:

- We need more planning
- Long PR review times

Common engineering challenges that DORA metrics can help to address:

- Development workflow issues
  - Tasks that are too big to complete quickly
  - Unclear or missing requirements
  - Slow code reviews
  - Delays in getting code to production
- Quality and reliability concerns
  - Growing technical debt

To solve these challenges:

1. First, identify the root cause of each issue
2. Then, make targeted changes to your process
3. Use metrics to track if your changes are working

__DORA__ (_DevOps Research and Assessment_) metrics are a set of key performance indicators that measure software delivery performance to drive improvement in development and operational practices.

These metrics help track improvements in your development process. For more details, see [Swarmia's Practical guide to DORA metrics](https://www.swarmia.com/blog/dora-metrics/).

The basic principle of DORA metrics is to:

**Maximize your ability to iterate quickly while ensuring you don't sacrifice quality**

The four DORA metrics are:

1. **Deployment Frequency**
   - How often a software team pushes changes to production
   - Indicates development velocity and release confidence

2. **Change Lead Time**
   - The time it takes to get committed code to run in production
   - Reflects process efficiency and automation maturity

3. **Change Failure Rate**
   - Percentage of deployments causing incidents or requiring rollback
   - Measures code quality and testing effectiveness

4. **Time to Restore Service**
   - Duration to restore service in production after an incident
   - Indicates operational resilience and incident response capability

## Deployment Frequency

> How often we deploy to production.

**Benefits:**

- Smaller, more manageable tasks
    - Better team collaboration
    - Clearer visibility of progress
    - More effective planning
- Smaller pull requests
    - Faster and easier reviews
    - Fewer merge conflicts
- More frequent deployments
    - Lower risk per deployment
    - Quicker feedback from users

The ideal deployment frequency depends on your team and project. If daily production deployments aren't possible, start by deploying frequently to testing or staging environments.

**How to track:**

- Set a deployment frequency goal
- Review progress during iteration planning
- Adjust based on team feedback

**Guidelines:**

- Keep tasks small enough to complete in 1-2 days
- Ensure each PR can be deployed without breaking existing features
  - Partial functionality is fine if it's behind a feature flag or the functionality is not in use
  - If change is better than the current version, even if there could be some improvements, it is still better to deploy fast, make the changes and deploy again
- If tasks take a week or more, review your development process
  - Long-running PRs often indicate process issues
  - Consider breaking down large tasks into smaller pieces

## Change Lead Time

> The time it takes to get committed code to run in production.

Long PR review times are a common issue discussed in retrospectives.

**Benefits:**

- Faster code reviews
    - Quicker feedback cycles
    - Reduced context switching
    - Better team momentum
- Shorter fix iterations
    - Faster problem resolution
    - Less time spent on outdated PRs
- No stalled PRs
    - Continuous progress
    - Better workload distribution

**How to track:**

- Review time: How long it takes a PR to get reviewed
- Merge time: How long it takes to merge an approved PR
- Cycle time: Total time from PR creation to production deployment

**Guidelines:**

- Create draft PRs for early feedback
  - Share work-in-progress to get input early
  - Draft PRs don't count toward metrics
- Request reviews promptly
  - If no review within 1 day, follow up in e.g. daily standup
  - Assign reviewers to avoid confusion
- Organize dedicated PR review sessions when needed
  - Schedule focused review time for complex changes
  - Encourage team collaboration on difficult reviews

## Change Failure Rate

> Percentage of deployments causing incidents or requiring rollback.

This metric helps balance speed with quality. Moving too fast without proper safeguards can lead to production issues.

**Benefits:**

- Better quality control
    - Improved testing practices
    - More thorough code reviews
    - Better risk assessment
- Learning from failures
    - Identifying patterns in incidents
    - Improving development processes
    - Building team knowledge
- Balanced development approach
    - Speed without sacrificing stability
    - Informed decision-making about releases

**How to track:**

- Production incidents: Count deployments that cause user-facing issues
- Rollbacks: Track deployments that need to be reverted
- Hotfixes: Monitor emergency fixes required after deployment
- Severity levels: Categorize incidents by impact

**Guidelines:**

- Maintain a detailed incident log
  - Record all production issues with severity levels
  - Include root cause analysis for each incident
- Conduct blameless postmortems
  - Focus on process improvements, not individual blame
  - Share learnings across the team
- Review trends regularly
  - Analyze patterns monthly to identify systemic issues
  - Adjust processes based on findings
- Set realistic thresholds
  - Define acceptable failure rates for your context
  - Balance speed with quality based on your product needs

## Time to Restore Service

> Duration to restore service in production after an incident.

This metric measures how quickly your team can recover from production issues. Having a solid incident response process reduces stress and allows the team to focus on solving problems rather than figuring out how to respond.

**Benefits:**

- Faster incident resolution
    - Clear recovery procedures
    - Reduced downtime impact
    - Better customer experience
- Reduced stress during incidents
    - Team knows what steps to take
    - Less panic and confusion
    - More systematic problem-solving
- Improved operational confidence
    - Team feels prepared for issues
    - Willingness to deploy more frequently
    - Better risk management

**How to track:**

- Incident detection time: How quickly issues are identified
- Response time: Time from detection to team response
- Resolution time: Time from response to service restoration
- Total recovery time: End-to-end time from incident start to full resolution

**Recovery methods (from fastest to slowest):**

- Deployment rollback: Revert to previous deployment
  - Fastest option when possible
  - No additional CI steps required
- PR rollback: Revert the problematic code changes
  - Faster than new fixes
  - Can be done by developer or reviewer depending on process
- Fix commit: Deploy a new fix for the issue
  - Slowest option
  - Requires development, approval, CI, and deployment

**Guidelines:**

- Prepare rollback strategies in advance
  - Test rollback procedures regularly
  - Document rollback steps clearly
  - Consider rollback limitations (e.g., database migrations)
- Practice incident response
  - Run incident response drills
  - Keep incident playbooks updated
  - Train team members on procedures
- Consider change complexity when planning rollbacks
  - Database migrations may prevent deployment rollbacks
  - Frontend changes might require additional steps
  - Plan rollback strategy before deploying complex changes

## Conclusion

DORA metrics provide a proven framework for tracking and improving software delivery performance. When used correctly, they help teams identify bottlenecks, measure progress, and drive meaningful improvements in their development process.

**Key takeaways:**

- Use metrics to improve team performance, not evaluate individuals
- Focus on the four core metrics: Deployment Frequency, Change Lead Time, Change Failure Rate, and Time to Restore Service
- Start small and iterate - you don't need to perfect all metrics at once
- Remember the fundamental principle: you get what you measure, so choose wisely

**Getting started:**

1. Pick one metric that addresses your team's biggest pain point
2. Establish a baseline measurement
3. Make targeted process improvements
4. Track progress and adjust your approach
5. Gradually expand to include other metrics

The goal is continuous improvement, not perfect scores. Use DORA metrics as a compass to guide your team toward better software delivery practices while maintaining a focus on collaboration and learning.

### Links

- [Swarmia - Build: Elements of an Effective Software Organization](https://www.swarmia.com/build/)