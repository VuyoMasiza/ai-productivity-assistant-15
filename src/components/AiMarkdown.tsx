import { Fragment } from "react";

function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_|`[^`]+`)/g).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**"))
      return (
        <strong key={i} className="font-semibold text-foreground">
          {p.slice(2, -2)}
        </strong>
      );
    if (p.startsWith("_") && p.endsWith("_"))
      return (
        <em key={i} className="text-muted-foreground">
          {p.slice(1, -1)}
        </em>
      );
    if (p.startsWith("`") && p.endsWith("`"))
      return (
        <code key={i} className="rounded bg-secondary px-1 py-0.5 text-[0.85em]">
          {p.slice(1, -1)}
        </code>
      );
    return <Fragment key={i}>{p}</Fragment>;
  });
}

export function AiMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];

  const flush = (key: string) => {
    if (list.length) {
      blocks.push(
        <ul key={key} className="my-2 space-y-1.5 pl-1">
          {list.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground/90">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{inline(item)}</span>
            </li>
          ))}
        </ul>,
      );
      list = [];
    }
  };

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    const bullet = line.match(/^\s*(?:[-*•]|\d+\.)\s+(.*)$/);
    if (bullet) {
      list.push(bullet[1]!);
      return;
    }
    flush(`l${idx}`);
    if (!line.trim()) return;
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      blocks.push(
        <h3
          key={idx}
          className="mt-5 mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary first:mt-0"
        >
          {inline(h[2]!)}
        </h3>,
      );
      return;
    }
    blocks.push(
      <p key={idx} className="my-2 text-sm leading-relaxed text-foreground/90">
        {inline(line)}
      </p>,
    );
  });
  flush("last");

  return <div className="max-w-none">{blocks}</div>;
}
