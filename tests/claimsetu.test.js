const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');

function readFile(relPath) {
  return fs.readFileSync(path.join(rootDir, relPath), 'utf8');
}

const indexHtml = readFile('index.html');
const styleCss = readFile('style.css');
const scriptJs = readFile('script.js');
const readmeMd = readFile('README.md');

assert.ok(indexHtml.trim().length > 0, 'index.html must not be empty');
assert.ok(styleCss.trim().length > 0, 'style.css must not be empty');
assert.ok(scriptJs.trim().length > 0, 'script.js must not be empty');
assert.ok(readmeMd.trim().length > 0, 'README.md must not be empty');

// 1. Check key HTML structure and sections
assert.match(indexHtml, /<!DOCTYPE html>/i, 'index.html should declare HTML5 doctype');
assert.match(indexHtml, /ClaimSetu/i, 'index.html should include ClaimSetu branding');
assert.match(indexHtml, /Instant Demo Mode/i, 'index.html should include Instant Demo Mode');
assert.match(indexHtml, /Live Gemini AI/i, 'index.html should include Live Gemini AI mode');

// 2. Check all 4 presets and tab / jargon coverage
assert.match(scriptJs + indexHtml, /Preset 1/i, 'Preset 1 should be present');
assert.match(scriptJs + indexHtml, /Preset 2/i, 'Preset 2 should be present');
assert.match(scriptJs + indexHtml, /Preset 3/i, 'Preset 3 should be present');
assert.match(scriptJs + indexHtml, /Preset 4/i, 'Preset 4 should be present');
assert.match(indexHtml + scriptJs, /Rejection Decoder/i, 'Rejection Decoder tab/feature should be present');
assert.match(indexHtml + scriptJs, /Fine-Print X-Ray/i, 'Fine-Print X-Ray tab/feature should be present');

// 3. Check gemini-2.5-flash and localStorage usage + no hardcoded API keys
assert.match(scriptJs, /gemini-2\.5-flash/, 'script.js should reference gemini-2.5-flash');
assert.match(scriptJs, /localStorage/, 'script.js should use browser localStorage');
assert.match(scriptJs + readmeMd, /50,00,000|50 Lakhs/i, 'Ombudsman ₹50,00,000 / ₹50 Lakhs limit should be present');

for (const [fileName, content] of [
  ['index.html', indexHtml],
  ['style.css', styleCss],
  ['script.js', scriptJs],
  ['README.md', readmeMd]
]) {
  assert.doesNotMatch(content, /AIza[0-9A-Za-z\-_]{20,}/, `${fileName} must not contain a hardcoded Google API key`);
}

console.log('All ClaimSetu static checks passed.');