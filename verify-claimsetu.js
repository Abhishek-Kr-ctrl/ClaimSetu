const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const rootDir = __dirname;
const requiredFiles = ["index.html", "style.css", "script.js", "README.md"];

const contents = {};
for (const file of requiredFiles) {
  const fullPath = path.join(rootDir, file);
  assert.ok(fs.existsSync(fullPath), `Missing required file: ${file}`);
  contents[file] = fs.readFileSync(fullPath, "utf8");
  assert.ok(contents[file].trim().length > 0, `File is empty: ${file}`);
}

// Core tabs, modes, and Indian regulatory/preset checks
assert.match(contents["index.html"], /Rejection Decoder/i);
assert.match(contents["index.html"], /Policy Fine-Print X-Ray/i);
assert.match(contents["script.js"], /gemini-2\.5-flash/);
assert.match(contents["script.js"], /localStorage/);
assert.match(contents["script.js"], /50,00,000|5000000/);

// Guard against accidental hardcoded API keys
assert.doesNotMatch(contents["script.js"], /AIza[0-9A-Za-z_-]{35}/);
assert.doesNotMatch(contents["index.html"], /AIza[0-9A-Za-z_-]{35}/);

console.log("ClaimSetu static checks passed.");