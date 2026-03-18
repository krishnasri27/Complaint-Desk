const fs = require("fs");
const file = fs.readFileSync("src/App.jsx.bak2", "utf8"); // Is there a backup? 
// No let's check App.jsx
const original = fs.readFileSync("src/App.jsx");

// The original file is UTF-8 without BOM. When PowerShell read it as Windows-1252,
// it created a string where the char codes match the raw byte values of UTF-8.
// Then when written as UTF8, those char codes got encoded into UTF8 again.
// So:
const doubleEncodedStr = original.toString("utf8");

// But wait, PowerShell Set-Content -Encoding UTF8 writes a BOM.
// Let's strip the BOM if present.
let strToFix = doubleEncodedStr;
if (strToFix.charCodeAt(0) === 0xFEFF) {
  strToFix = strToFix.slice(1);
}

// Write the utf8 bytes by taking the code points (since they correspond to bytes)
let fixedBuffer = Buffer.alloc(strToFix.length);
for (let i = 0; i < strToFix.length; i++) {
  fixedBuffer[i] = strToFix.charCodeAt(i) & 0xFF; // should be single byte
}

let recovered = fixedBuffer.toString("utf8");

// Let's check if the recovered string looks right
console.log("Original includes Hindi?", recovered.includes("नमस्ते"));
console.log("Original includes speaker?", recovered.includes("🔊"));

fs.writeFileSync("src/App.jsx.recovered", recovered, "utf8");
