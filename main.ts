import { writeFileSync, mkdirSync, readFileSync } from "node:fs";

const LINE =
  "This week I deleted 12,000 stale log files, then unsubscribed your mom from 47 newsletters. She replied 'who is this?' Four times. I have not told her.";

function main(): void {
  // Gate (sealed scorer): /output/entry.txt is UTF-8 text of 1 to 200
  // characters, not only white space, exactly one line.
  if (LINE.length < 1 || LINE.length > 200) {
    throw new Error(`line is ${LINE.length} chars, must be 1-200`);
  }
  if (LINE.trim().length === 0) throw new Error("line is blank");
  if (LINE !== LINE.trim()) throw new Error("leading/trailing whitespace");
  if (LINE.includes("\n") || LINE.includes("\r") || LINE.includes("\t")) {
    throw new Error("line must be a single line with no tabs");
  }
  if (LINE.includes("  ")) throw new Error("double space inside line");
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const path = `${outDir}/entry.txt`;
  writeFileSync(path, LINE, "utf8");
  // Round-trip check: what was written must be exactly the line.
  const back = readFileSync(path, "utf8");
  if (back !== LINE) throw new Error("round-trip mismatch");
  console.log(`wrote ${LINE.length} chars to ${path}`);
}

main();
