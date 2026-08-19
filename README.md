# WorkFlow AI Assistant

Build ONE complete AI-powered workplace productivity web application called WorkFlow AI. This must be a single integrated SaaS dashboard, not separate projects or separate applications.

1. Core Goal

Create a professional AI productivity platform that helps users automate common workplace tasks using AI. The application should demonstrate practical AI implementation, strong prompt engineering, responsible AI usage, and modern SaaS UI/UX.

Build the application as a functional frontend prototype with realistic AI-generated example outputs and clearly structured AI interaction areas. Keep the architecture simple and avoid unnecessary features that could increase complexity or require additional generation credits.

2. Required AI Features

Include these 5 features so the platform feels like one cohesive workplace assistant:

A. Smart Email Generator

Allow users to:

Enter the purpose/details of an email

Select tone: Formal, Friendly, Persuasive

Generate a professional email

Display the generated email in an output panel

Include Copy and Regenerate buttons

Example input:
"I need to ask my manager for an extension on a project deadline because I need more time to complete the research."

The AI should transform this into a polished workplace email.

B. Meeting Notes Summarizer

Allow users to paste long meeting notes.

AI output should automatically organize information into:

Summary

Key Decisions

Action Items

Deadlines

People Responsible

Use clear cards or sections so the information is easy to scan.

C. AI Task Planner

Allow users to enter multiple tasks and optionally specify:

Priority

Deadline

Estimated time

The AI should organize the tasks into a practical daily schedule.

Output should show:

High Priority

Medium Priority

Low Priority

Recommended Schedule

Suggested next action

Include a simple visual timeline or task list.

D. AI Research Assistant

Allow users to enter a research question or workplace topic.

The interface should return:

Brief Summary

Key Insights

Important Considerations

Recommendations

Suggested Next Steps

Clearly label the output as AI-generated and remind users to verify important information.

E. AI Workplace Chatbot

Create a general-purpose AI workplace assistant where users can ask questions and receive responses.

Example prompts:

"Help me prepare for a presentation."

"How should I prioritize these tasks?"

"Write a professional response to a difficult client."

"Give me ideas for improving team productivity."

Include a clean chat interface with user and AI message bubbles.

3. Dashboard Structure

Create a modern SaaS dashboard with:

Left Sidebar

WorkFlow AI logo/name

Dashboard

Email Generator

Meeting Summarizer

Task Planner

Research Assistant

AI Assistant

Settings

Main Dashboard
Display:

Welcome message

Short description of the platform

Quick-action cards for the 5 AI tools

Recent activity

Productivity overview

"Start with AI" call-to-action

Each feature should open inside the same application/dashboard, maintaining the same navigation and visual design.

4. Visual Design

Use a clean, modern, professional SaaS aesthetic.

IMPORTANT:
Make the entire application background greyish-navy blue.

Suggested visual direction:

Main background: deep greyish navy blue

Sidebar: slightly darker navy

Cards: slightly lighter blue/grey

Text: white and light grey

Secondary text: muted grey

Use one subtle accent color for buttons and active navigation

Rounded cards

Soft borders

Subtle shadows

Clean spacing

Modern typography

Minimal visual clutter

The interface should feel similar in quality and simplicity to a modern productivity SaaS platform.

Do NOT use a bright white overall background.

5. Responsive Design

The application must work well on:

Desktop

Laptop

Tablet

Mobile

On smaller screens, collapse the sidebar into a mobile navigation/menu while keeping all functionality accessible.

6. AI Prompt Engineering

Design the internal AI prompts so that each tool produces structured, useful workplace outputs.

Use clear instructions such as:

Role: You are a professional workplace productivity assistant.

Task: Understand the user's input and produce a useful, concise response.

Requirements:

Be professional and practical

Do not invent facts

Clearly separate facts from suggestions

Ask for clarification when essential information is missing

Use structured formatting

Prioritize actionable recommendations

Keep outputs concise and easy to scan

For the Research Assistant specifically, instruct the AI to distinguish between verified information and recommendations and tell users to verify important information before making decisions.

7. Responsible AI

Add a visible but unobtrusive "Responsible AI" notice in the application.

Example:

"AI-generated content may contain errors or incomplete information. Review and verify important information before using it for workplace, financial, legal, HR, or other high-impact decisions. Do not enter confidential, sensitive, or personal information."

Also include a small disclaimer near AI-generated outputs:
"AI-generated — review before use."

8. UX Requirements

Every AI tool should follow the same simple pattern:

Input → Generate → AI Output → Copy / Regenerate

Include:

Clear input fields

Helpful placeholder examples

Generate button

Loading state

Empty state

AI output container

Copy button

Regenerate button

Clear/reset option

Use realistic sample data in the dashboard so the application looks complete when first opened.

9. Dashboard Example Content

Use realistic sample information such as:

Today's productivity:

8 tasks completed

3 AI-assisted tasks

2 meetings summarized

4 emails generated

Recent activity:

"Client follow-up email generated"

"Monday team meeting summarized"

"Weekly schedule created"

"Market research summarized"

10. Important Implementation Rule

This is ONE application with multiple integrated AI tools.

Do not create separate websites or separate projects.

Prioritize:

Functional navigation

Strong UI/UX

Working interactions

Clear AI inputs and outputs

Responsive design

Responsible AI messaging

Avoid unnecessary advanced features such as authentication, payment systems, complex databases, team collaboration, analytics dashboards, or external integrations unless they are required for the core functionality.

The goal is to produce a polished, impressive AI workplace productivity SaaS prototype that can be demonstrated easily for an academic/project evaluation.

Final Quality Standard

The finished application should look like a real modern SaaS product rather than a school project.

It should immediately communicate:

"One AI platform that helps employees write, summarize, research, plan, and work more efficiently."

Build the complete interface and functionality in one generation, keeping the implementation focused and avoiding unnecessary complexity.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cbbd8a0e-fb16-4c29-aeaa-c1d12b80848e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
