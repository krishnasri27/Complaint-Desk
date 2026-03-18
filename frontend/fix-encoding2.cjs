const fs = require("fs");
const original = fs.readFileSync("src/App.jsx");

const doubleEncodedStr = original.toString("utf8");

let strToFix = doubleEncodedStr;
if (strToFix.charCodeAt(0) === 0xFEFF) {
  strToFix = strToFix.slice(1);
}

let fixedBuffer = Buffer.alloc(strToFix.length);
for (let i = 0; i < strToFix.length; i++) {
  fixedBuffer[i] = strToFix.charCodeAt(i) & 0xFF; // should be single byte
}

let recovered = fixedBuffer.toString("utf8");

console.log("Original includes Hindi?", recovered.includes("नमस्ते"));
console.log("Original includes speaker?", recovered.includes("🔊"));

fs.writeFileSync("src/App.jsx.recovered", recovered, "utf8");
console.log("Wrote src/App.jsx.recovered");
