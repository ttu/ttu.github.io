---
layout: post
title: Current Process and Team Trends in Software Development - Motivations Behind Process Optimization
excerpt: This post is aimed to help engineers understand the business perspective and the reasons behind process and operational decisions
---

__Disclaimer:__ This post is based on my personal experiences and represents my personal opinion. It was originally a presentation I gave to my team, which I am now sharing with a wider audience.

This post is aimed to help __software engineers__ understand the business perspective and the reasons behind process and operational decisions. For a more in-depth exploration, refer to the recommended books.

The article has two parts:
1. Understanding the motivations behind process optimization: Explore the reasons why companies strive to optimize their processes and the benefits that can be achieved.
2. Introducing product teams, OKRs and processes: Delve into the concept of product teams and their role in achieving business objectives.

This is __the first part__, with the second part to be published later.

![AI generated image](/images/posts/process-optimization/ai-generated-title.png){: width="800" }

# Intro

Historically, larger companies have emulated trends from U.S. West Coast-based software companies and the startup scene, where innovative teams excel at delivering new functionality at an accelerated pace.

However, this often leads to a selective approach, where organizations cherry-pick elements that align with their existing processes while overlooking the broader context of these innovations. For example:

* __Agile:__ Companies may adopt Agile methodology without changing their organizational culture or structure, continuing to rely on rigid hierarchies, siloed teams, and top-down decision-making. This contradicts Agile principles of collaboration, self-organization, and customer feedback.
* __Scrum:__ Some companies treat Scrum as a rigid set of rules and rituals rather than a flexible, adaptive approach. The focus often shifts to following Scrum ceremonies and artifacts rather than delivering value and quality to customers.
* __Lean Startup:__ While applying Lean Startup principles, companies may continue to build products based on internal visions or intuition, instead of prioritizing customer feedback and data. This often results in product launches that lack Lean Startup’s essential cycles of experimentation and outcome measurement.
* __Kanban:__ Companies might implement Kanban systems but fail to review or update their processes regularly, neglecting the essential feedback loops and continuous improvement that Kanban facilitates.
* __Product Teams:__ Companies may establish product teams with the intention of granting autonomy to make decisions and solve problems, but the reality often falls short. These teams may operate as little more than renamed feature teams.
* __Objectives and Key Results (OKRs):__ Organizations may adopt OKRs to motivate and guide teams. However, OKRs are sometimes assigned without sufficient team input or discussion about direction, with key results being used solely as a metric for measuring performance rather than as a dynamic tool for driving progress.

Often, there is a reason for this selective approach, and as engineers, we must recognize that we may not have the full context behind decisions. We should strive to make processes work as best as possible within given constraints.

Some companies succeed without following specific practices, delivering successful products based on their expertise and skilled personnel. The outcome varies depending on the complexity of the product and the company’s talent.

For an example of this in practice, see how [Linear builds products](https://www.lennysnewsletter.com/p/how-linear-builds-product).

__TLDR;__

* Teams should be self-sufficient problem solvers, not just feature producers.
  * Teams need expertise in PO, design, analytics, and engineering to manage projects and handle problems from concept to launch.
  * Engineers should adopt a product-oriented mindset, understanding broader impact of their work.
* Prioritize rapid delivery to gather feedback quickly and start learning as soon as possible.
  * Teams should have autonomy to deliver complete features without external dependencies or support.
  * External stakeholders should actively participate in weekly team discussions to align expectations.
* Prioritize effectiveness over features. Swiftly eliminate or refine ideas that fail to deliver value.
  * Don't waste time on features that don’t bring value.
* Achieving effectiveness requires a cultural and mindset shift throughout the organization.
  * Trust is crucial for success.
  * The company must trust the product teams, and the teams must earn that trust through their actions.
* Individuals are capable of revising their opinions and making decisions that benefit the company.
  * People are flexible in their viewpoints and prioritize the company’s benefit.
* Employees are dedicated and consistently willing to give their full effort.
* Companies should see technology as an important enabler.
  * Engineering is not a cost center but an important stakeholder for the business.
  * Engineers understand that technology is a tool for solving business problems.
* Always deliver value.

Youtube - [I Have Delivered Value... But At What Cost?](https://www.youtube.com/watch?v=DYvhC_RdIwQ)

![Value for shareholders](/images/posts/process-optimization/the-planet-got-destroyed-tom-toro.jpg){: width="400" }

# Books Behind Theories

Key theories behind current trends can be found in various sources and books. In this summary, we focus mainly on the theories from “The Goal” and “Empowered.” 

__The Goal__ - How to optimize processes to reach the objectives.

![The Goal](/images/posts/process-optimization/the-goal-cover.png){: width="200" }

__Empowered__ - A guide to creating successful Product (Domain) Teams.

![Empowered](/images/posts/process-optimization/empowered-cover.png){: width="200" }

“The Goal” shares overall principles with the Toyota Production System, Lean: 

![Toyota Production System](/images/posts/process-optimization/toyota-lean-covers.png){: width="800" }

And Systems Thinking:

![Systems Thinking](/images/posts/process-optimization/systems-thinking-covers.png){: width="800" }

## Commonalities in The Goal, Toyota Production System, and Lean

* Focus on eliminating waste:
  * Non-value-added activities are considered waste.
  * Categories of waste include overproduction, inventory, waiting, transportation, processing, and rework.
* Emphasis on the flow of work:
  * Ensure a smooth, uninterrupted flow of work through the production process.
* Continuous improvement:
  * Foster a culture where employees are encouraged to identify and address problems and inefficiencies.

## Systems Thinking

Systems thinking is a holistic approach that focuses on how a system’s parts interrelate and how systems function over time within larger contexts.

* Understanding the system as a whole:
  * How processes interact. Changes in one part can create ripple effects throughout the system.

* Constraints and bottlenecks limit overall performance:
  * Identifying and managing constraints is key to optimizing system performance and improving efficiency.
  * By understanding the constraints that limit a system, we can develop strategies to improve efficiency, reduce waste, and achieve desired outcomes

* Common in most management practices:
  * Emphasize the importance of creating value for customers, identifying and eliminating waste, and continuously improving processes.

Best practices compile effective methods from various sources.

## Empowerment and Product-Minded Engineers

The recognition of the value of empowering people and product-focused engineers is not a recent development.

[27 years ago, Steve Jobs emphasized that the best employees focus on content (outcomes), not just processes.](https://www.inc-aus.com/jeff-haden/27-years-ago-steve-jobs-said-best-employees-focus-on-content-not-process-workplace-research-shows-he-was-right.html
)

Note: In the interview, “content” refers to what we now call “outcomes,” meaning the best employees focus on what’s important and get things done.

Although it is not mentioned often, it’s important to maintain a balance between a ‘get things done’ mentality and building something that is maintainable.

# The Goal

Published in 1984

> The Goal emphasizes the importance of identifying and overcoming bottlenecks to achieve operational efficiency and business success.

Let’s start with the background theory from _The Goal_. It’s an “oldie but goodie,” as are many things in IT and business.

_The Goal_ is written as an entertaining novel because Goldratt believed traditional management books were too boring. If a 300+ page novel feels long, _The Goal_ is also available as a comic book, which is quick to read.

![The Goal comic book](/images/posts/process-optimization/the-goal-comic-cover.png){: width="200" }

There’s also a great IT-focused book, _The Phoenix Project_, an homage to _The Goal_. It shows how Goldratt’s principles for manufacturing can improve technological processes too.

![Phoenix Project](/images/posts/process-optimization/the-phoenix-project-cover.png){: width="200" }

Reading list for engineers:
1. _"The Goal"_-comic
2. _"The Phoenix Project"_-book

## Brief Overview of the Main Theory in The Goal

__The Theory of Constraints__ (__TOC__) is a management philosophy focused on identifying and managing constraints within a system to achieve overall improvement.

The core idea is that every complex system, whether it's a manufacturing process or a business operation, __has bottlenecks or constraints that limit its overall performance__.

## The Goal & Key Measurements of Operational Performance

The goal of a company is ultimately to make money. If a company doesn’t make money, it will cease to exist.

> If a company doesn’t generate profit, it may not provide future work for its employees.

## 4 Measures: Goal, Throughput, Inventory, and Operational Expenses

These four measures assess the overall health and performance of a system. Understanding their interactions helps employees make informed decisions to achieve company goals. Examples are from manufacturing:

* __Goal:__ Make money through sales
* __Throughput:__ Products sold to the customer (not just manufactured).
* __Inventory:__ Products in production or waiting to be sold, materials for production, employee waiting time and unused potential from work etc.
* __Operational Expenses:__ All expenses related to creating inventory and generating throughput from inventory.

![The Goal - 4 measures](/images/posts/process-optimization/the-goal-4-measures.png){: width="400" }

The goal is to maximize throughput while minimizing inventory and operational expenses.

### Key components in Software Development

Key components, transferred from a business perspective to software development:

* __Goal:__ Deliver new and enhanced features that create value for the business and customer.
* __Throughput:__ Features successfully delivered.
* __Inventory:__ Includes work in progress, work on hold, tasks awaiting release, and any designs or plans not yet implemented.
* __Operational expenses:__ All expenses related to creating inventory and creating throughput from inventory

__Key takeaways:__ Delivered and value created. Nothing else matters. 
* A feature not in use is worthless. 
* A feature that doesn’t create value for the business is worthless.

### How to Achieve Operational Efficiency

The goal is to maximize throughput while minimizing inventory and operational expenses.

![The Goal - Achieve operational efficiency](/images/posts/process-optimization/the-goal-achieve-operational-efficiency.png){: width="400" }

__The Goal:__ Increase throughput while reducing both inventory and operating expenses.


* __Increase throughput:__ Deploy as quickly as possible, avoiding gatekeepers like long QA or approval boards.
* __Reduce inventory:__ Take features to production immediately and work on a few at a time.
* __Reduce operational expenses:__ Eliminate manual and unnecessary work, and avoid working on features before they’re ready for production.

In order to reduce inventory and operational expenses, go live as quickly as possible and stop working on features that do not add value.

Focus on lead time. How long does it take to go from the decision to start to work on a feature to get it live in production Eliminate non-value-added activities and improve flow of work.

## Example

A simplified example highlighting the concept:

Three employees, three features. Each feature takes four months to complete.

![Process- Example 1](/images/posts/process-optimization/process-example-1.png){: width="300" }

Initially, each employee works on a separate feature, causing work in progress (inventory) to grow. Throughput is not constant during the four months.

![Process - Example 2](/images/posts/process-optimization/process-example-2.png){: width="800" }

When employees work as a team and focus on one feature at a time, inventory stays smaller, and throughput becomes a more constant flow.

![Process - Example 3](/images/posts/process-optimization/process-example-3.png){: width="800" }

Features begin to bring value from the second month, allowing for iteration and validation immediately the feature goes live.

### Traditional Steps of the Development Process


![Traditional steps](/images/posts/process-optimization/process-traditional-steps.png){: width="1000" }

Multiple steps in the process can lead to inventory buildup and delays in delivery if disruptions occur. Every completed step counts as inventory, except for already delivered features (shown in orange and green).

### Optimized Product Team Setup with an Optimal Process for Empowered Teams

Brief note: Further details on teams and processes will be discussed in the second part of this post.

![Optimized steps](/images/posts/process-optimization/process-optimized-steps.png){: width="400" }

The team selects a few topics from the discovery phase to work on during the quarter.

* __Discovery:__ A continuous phase where the company identifies customer and business problems to address.
* __Delivery:__ (quarterly, sprints, agile etc.) This includes all required steps from the traditional process, with the team managing the entire development. The key difference is that all work should be completed from start to finish without interruptions, focusing on as few features as possible.

Goal is to 
* Do everything as late as possible (Just-In-Time)
* Optimize process steps requiring manual or acceptance work before going live, after implementation is complete.
* Ensure the team has all the necessary skills and capabilities to manage the process from discovery to bringing the feature into production.
* Lock in topics before the quarter/iteration begins, avoiding changes in prioritization during implementation. The team should maintain a strong focus on selected topics.
  * Priority shifts must be exceptionally well justified, considering cost and impact.
    * Justifications should include the reason, the impact of the new feature, a consultation with engineers on the time required, and a rationale for why it cannot wait.
    * If the product team is truly empowered, the individual requesting the change must convince the team of its necessity.
* Aim to go live as quickly as possible. The MVP should truly be a minimal product.

Minimize inventory, such as plans and designs that won’t be worked on soon:
* There’s a risk that some features may be scrapped before production, or that large features, once live, don’t create value.
* In both cases, the feature and the effort spent can be considered waste.
* Plan only when work is started. Start with a larger planning pahse, then continue with iterations.
  * Planning
  * Design / Develop
  * (Optional) Release
  * Repeat the process: Plan, Design/Develop, (Optional) Release, etc.

![Process - Iteration](/images/posts/process-optimization/process-iteration.png){: width="200" }

## Other Interesting Topics in Process Optimization

1. Identifying and fixing bottlenecks.
2. Constant flow vs batch processing.
3. Leveraging data to understand processes and make informed decisions.

### Identifying and Fixing Bottlenecks

Bottlenecks are a natural part of any process. It’s important to understand and visualize the entire process to identify and address them.


A bottleneck is any step, resource, or activity that prevents the process from achieving its desired outcome. It could be a task that takes too long to complete, a lack of capacity, or a communication breakdown. Any factor that slows down the overall flow of work and prevents the process from reaching its target performance is considered a bottleneck.

* __Bottlenecks:__ Resource's capacity is less than demand placed on them
* __Non-bottlenecks:__ Resource's capacity is more than demand placed on them

![Bottleneck](/images/posts/process-optimization/bottleneck.png){: width="600" }

Buffer in front of bottleneck.

![Buffer](/images/posts/process-optimization/bottleneck-buffer.png){: width="600" }

In any system, only the bottleneck should be 100% utilized. Keep non-bottlenecks open for important tasks and avoid filling them with unimportant work, so they don’t slow down the bottleneck.

Once a bottleneck is identified, it's crucial to understand its underlying cause. Based on root cause analysis, develop targeted solutions to address it. This may involve optimizing resource allocation, improving process steps, automating tasks, or introducing technology solutions. After implementation, monitor the situation. Fixing a bottleneck is not a one-time effort; continuously evaluate and refine the solution.

In software development, due to the variability in task durations, predicting bottlenecks upfront is challenging, making capacity planning more difficult. Product teams address this by having multi-role team members, where a single team member can handle planning, design, development, testing, and more.

### How to Understand the Significance and Cost of Each Step of the Process?

The cost of each step should be measured by carrying costs. If deploying to production is a manual step, the cost is not just the labor of that employee, but also the delay in features being used, making the actual cost the entire development cost.

_(TODO: Check the formula from the book)_

Releasing a feature takes 2 hours at a cost of 50€ per hour. The previous steps took a total of 300 hours at the same hourly rate. The total cost for releasing is calculated as 2 x 50€ + 300 x 50€ = 100€ + 15,000€ = 15,100€.

_TODO: something about these?_
* Dependent events that must occur before
* Statistical fluctuations

### Not from The Goal: Kanban

Kanban is a familiar tool for many software engineers.

Kanban is a lean management methodology that uses visual cues to manage workflow and inventory. It is a pull system, meaning work is pulled through the system as needed.

Kanban board with work-in-progress (WIP) limits helps manage bottlenecks and parallel work.

![Kanban with WIP limits](/images/posts/process-optimization/kanban-wip-limits.png){: width="600" }

Done sections on the board facilitate pulling tasks ready to be worked on.

![Kanban board don with done sections](/images/posts/process-optimization/kanban-done-sections.png){: width="800" }

1. WIP limits are important because they help identify potential bottlenecks in the process and limit the amount of parallel work.
2. Unfortunately, WIP limits are often disregarded.
3. It's common for teams to use a board to monitor progress and claim they are using Kanban, when in reality, they are simply using the board without following true Kanban practices.

## Flow vs. Batch Processing

Based on management theories, constant flow is better than batch flow. The benefits are slightly different in manufacturing versus software development, but the same principles apply.

Benefits:
* Easier identification of limitations and bottlenecks.
* Continuous release of work to production.
* Reduced inventory as there are no large batches waiting for processing.
* Lower investment in materials.
* Improved cash flow.

In software, while reducing materials and cash flow is less relevant, constant flow allows faster responses to changes, preventing wasted effort and promoting agility.

### Realities of a Perfectly Balanced Process and 100% Efficiency

Striving for 100% efficiency isn't always the most effective approach. While it may seem ideal, it can create inefficiencies elsewhere in the process. For instance, allowing time to address unexpected issues is crucial.

A perfectly balanced process, with just-in-time (JIT) operations, minimal inventory, and efficient employee utilization, can optimize cash flow and performance. However, this tightly managed system also increases vulnerability to disruptions, which could potentially cause significant financial issues, or even lead to bankruptcy.

### JIT (Just-In-Time)

The pandemic highlighted the potential issues with JIT systems, particularly when there are disruptions in the supply chain.

![JIT](/images/posts/process-optimization/jit.png){: width="800" }

* __Customer:__ Wants a product.
  * __Shops:__ Waiting for products.
    * __Product manufacturers:__ Waiting for parts.
      * __Part manufacturers:__ Waiting for raw materials.
        * __Raw material production:__ Facing delays.

A disruption in any step can slow down the entire process, especially if there are no optimal buffers or inventories in place.

### AOT (Ahead of Time)

AOT is not without its challenges, as predicting future demand can be difficult.

* Changes in demand → Too much inventory.

Customer behavior can change quickly. A company may be left with a large inventory, or a feature that’s been in development for years can become obsolete overnight if a competitor releases something that better meets customer needs.

## Utilizing Data to Understand Processes and Make Decisions

Effectively using data is key to understanding and resolving process issues while making strategic decisions. To harness data efficiently, certain prerequisites must be met:

* Data must be accurate.
* Data should be gathered from diverse sources.
* The relationships within the data must be understood.
* Data analysis skills are essential.
* Data must drive action.

Looking at the right data helps us identify where improvements are needed. Using incorrect data can cause us to miss bigger problems. It’s important to look at the whole picture, not just small parts. Good data is crucial for making decisions and monitoring progress. For example:

* __API requests:__ Responses were fast, but all responses had empty payloads.
* __API requests:__ Responses were fast, but all returned errors, and the monitoring system ignored the status codes.
* __Send rate:__ The success rate of sent emails was high, but the system failed to handle emails for a specific country.
* __Conversion rate:__ Increase one conversion but decrease the other at the same time. No guard metrics in use.
* __A/B testing:__ Missing data from collected metrics led to wrong conclusions.

Companies should cultivate a data-driven culture. This promotes the use and appreciation of data in employees daily tasks, leading to better-informed, more analytical problem-solving and decision-making.