#!/usr/bin/env node

import { readFileSync } from "node:fs";

const { version } = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
);

const projects = [
  {
    name: "D1 Preflight",
    area: "RUST / DATABASES",
    detail: "Checks migration risks against disposable SQLite snapshots.",
    url: "https://github.com/ranajahanzaib/d1-preflight",
  },
  {
    name: "Ledger-to-Chain Reconciler",
    area: "GO / BLOCKCHAIN",
    detail: "Compares deposit ledgers with ERC-20 transfer evidence, read-only.",
    url: "https://github.com/ranajahanzaib/ledger-to-chain-reconciler",
  },
  {
    name: "Workers Aide",
    area: "TYPESCRIPT / CLOUDFLARE",
    detail: "Self-hosted business assistants with D1 and Durable Objects.",
    url: "https://github.com/ranajahanzaib/workers-aide",
  },
];

const contacts = [
  ["WORK", "https://workwithrana.com/work"],
  ["EMAIL", "work@withrana.com"],
  ["GITHUB", "https://github.com/ranajahanzaib"],
  ["LINKEDIN", "https://linkedin.com/in/workwithrana"],
  ["UPWORK", "https://www.upwork.com/freelancers/~01bbcf6edb91a8df5f"],
  ["CONTRA", "http://contra.com/ranajahanzaib"],
];

const useColor =
  Boolean(process.stdout.isTTY) &&
  !process.env.NO_COLOR &&
  process.env.TERM !== "dumb";
const palette = {
  accent: "\u001b[38;2;242;176;96m",
  link: "\u001b[38;2;119;208;213m",
  muted: "\u001b[38;2;150;161;177m",
  border: "\u001b[38;2;94;108;126m",
  bright: "\u001b[1;38;2;245;247;250m",
};
const reset = "\u001b[0m";
const paint = (text, tone) =>
  useColor && tone ? `${palette[tone]}${text}${reset}` : text;

function wrap(text, width) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (let word of words) {
    while (word.length > width) {
      if (line) {
        lines.push(line);
        line = "";
      }
      const fragment = word.slice(0, width);
      const slash = fragment.lastIndexOf("/");
      const cut = slash > 2 && slash < width - 3 ? slash + 1 : width;
      lines.push(word.slice(0, cut));
      word = word.slice(cut);
    }
    if (!word) continue;
    if (line && line.length + word.length + 1 > width) {
      lines.push(line);
      line = word;
    } else {
      line += (line ? " " : "") + word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function renderCard() {
  const requestedWidth = Number(process.stdout.columns || process.env.COLUMNS || 82);
  const width = Math.max(24, Math.min(requestedWidth - 1, 86));
  const inside = width - 2;
  const contentWidth = inside - 4;
  const compact = width < 42;
  const lines = [];

  function edge(left, right, label = "") {
    const title = label ? `─ ${label} ` : "";
    const fill = "─".repeat(inside - title.length);
    lines.push(paint(left + title + fill + right, "border"));
  }

  function row(text = "", tone) {
    const padding = " ".repeat(Math.max(0, contentWidth - text.length));
    lines.push(
      paint("│  ", "border") +
        paint(text, tone) +
        padding +
        paint("  │", "border"),
    );
  }

  function paragraph(text, indent = 0, tone) {
    for (const part of wrap(text, contentWidth - indent)) {
      row(" ".repeat(indent) + part, tone);
    }
  }

  edge("╭", "╮", "WORKWITHRANA");
  row();
  row("RANA JAHANZAIB", "accent");
  paragraph("Senior full-stack engineer", 0, "bright");
  paragraph("Backend · cloud · product", 0, "muted");
  row();
  paragraph(
    "I build business applications, developer tools, and cloud systems. My work spans independent delivery and technical leadership across products.",
  );
  row();

  edge("├", "┤", "SELECTED WORK");
  projects.forEach((project, index) => {
    row();
    if (compact) {
      row(String(index + 1).padStart(2, "0"), "accent");
      paragraph(project.name, 4, "bright");
    } else {
      paragraph(`${String(index + 1).padStart(2, "0")}  ${project.name}`, 0, "bright");
    }
    paragraph(project.area, 4, "accent");
    paragraph(project.detail, 4);
    if (!compact) paragraph(project.url, 4, "link");
  });
  row();

  edge("├", "┤", "CONNECT");
  row();
  for (const [label, value] of contacts) {
    const entry = `${label.padEnd(10)}${value}`;
    if (entry.length <= contentWidth) row(entry, "link");
    else {
      row(label, "accent");
      paragraph(value, 2, "link");
    }
  }
  row();
  edge("╰", "╯");

  console.log("\n" + lines.join("\n") + "\n");
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(
    "Usage: npx workwithrana [--help] [--version]\n\nPrint Rana Jahanzaib's engineering profile and selected projects.",
  );
} else if (args.includes("--version") || args.includes("-v")) {
  console.log(version);
} else if (args.length) {
  console.error(`Unknown option: ${args[0]}. Run with --help for usage.`);
  process.exitCode = 1;
} else {
  renderCard();
}
