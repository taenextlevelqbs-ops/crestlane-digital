import type { ReactNode } from "react";

export function Arrow({
  direction = "diagonal",
}: {
  direction?: "diagonal" | "right" | "down" | "up" | "left";
}) {
  const paths = {
    diagonal: "M6 18 18 6M6 6h12v12",
    right: "M4 12h16m-7-7 7 7-7 7",
    down: "M12 4v16m-7-7 7 7 7-7",
    up: "M12 20V4m-7 7 7-7 7 7",
    left: "M20 12H4m7-7-7 7 7 7",
  };
  return (
    <svg className="studio-arrow" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false">
      <path d={paths[direction]} />
    </svg>
  );
}

export function iconText(value: ReactNode): ReactNode {
  if (Array.isArray(value)) return value.map(iconText);
  if (typeof value !== "string") return value;

  const directions: Record<string, "diagonal" | "right" | "down" | "up" | "left"> = {
    "↗": "diagonal", "→": "right", "↓": "down", "↑": "up", "←": "left",
  };

  return value.split(/([↗→↓↑←][\uFE0E\uFE0F]?)/u).map((part, index) => {
    const direction = directions[part.charAt(0)];
    return direction
      ? <Arrow key={index} direction={direction} />
      : part;
  });
}
