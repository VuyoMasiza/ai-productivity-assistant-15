import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MODEL = "google/gemini-3.7-flash";

const BASE_ROLE = `Role: You are WorkFlow AI, a professional workplace productivity assistant.
Requirements:
- Be professional, concise and practical.
- Never invent facts. Clearly separate facts from suggestions.
- If essential information is missing, briefly ask for clarification.
- Use structured markdown formatting with short headings and bullet points.
- Prioritise actionable recommendations and keep the output easy to scan.`;

const PROMPTS: Record<string, string> = {
  email: `${BASE_ROLE}
Task: Turn the user's rough intent into a polished workplace email.
Output exactly this structure in markdown:
**Subject:** <subject line>

Then the email body: greeting, 1-3 short paragraphs, a clear ask, and a professional sign-off placeholder ([Your Name]).
Match the requested tone precisely. Do not add commentary before or after the email.`,

  meeting: `${BASE_ROLE}
Task: Summarise the pasted meeting notes.
Output markdown with exactly these sections, in this order:
## Summary
## Key Decisions
## Action Items
## Deadlines
## People Responsible
Use bullet points. If a section has no information in the notes, write "- Not mentioned in the notes." Never invent names, dates or decisions.`,

  tasks: `${BASE_ROLE}
Task: Organise the user's tasks into a practical working day.
Output markdown with exactly these sections:
## High Priority
## Medium Priority
## Low Priority
## Recommended Schedule
(a time-blocked list, e.g. "09:00 – 10:30 — Task", include short breaks)
## Suggested Next Action
(one single sentence)
Respect any priorities, deadlines or time estimates the user gave; estimate sensibly when they are missing and say so.`,

  research: `${BASE_ROLE}
Task: Give a structured workplace research briefing on the user's topic.
Output markdown with exactly these sections:
## Brief Summary
## Key Insights
## Important Considerations
## Recommendations
## Suggested Next Steps
Clearly distinguish widely-verified general knowledge from your own recommendations (label recommendation bullets as suggestions). Do not fabricate statistics, sources, dates or citations. End with one line: "_Verify important information from primary sources before making decisions._"`,

  chat: `${BASE_ROLE}
Task: Answer workplace questions as a helpful assistant — writing help, prioritisation, communication, meetings, productivity coaching.
Keep replies focused and skimmable. Use bullets when listing. Avoid long preambles.`,
};

const Input = z.object({
  tool: z.enum(["email", "meeting", "tasks", "research", "chat"]),
  prompt: z.string().min(1).max(12000),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .max(30)
    .optional(),
});

export const runAiTool = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured (missing API key).");

    const messages = [
      { role: "system", content: PROMPTS[data.tool] },
      ...(data.history ?? []),
      { role: "user", content: data.prompt },
    ];

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({ model: MODEL, messages }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429) throw new Error("Too many requests right now — please try again in a moment.");
      if (res.status === 402) throw new Error("AI credits are exhausted. Add credits in Lovable to continue.");
      throw new Error(`AI request failed (${res.status}): ${body.slice(0, 300)}`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = json.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("The AI returned an empty response. Please try again.");
    return { text };
  });
