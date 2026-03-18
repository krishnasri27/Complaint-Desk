const fs = require('fs');
const path = 'src/pages/Dashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '<AudioGuide text={Dashboard for . You have  total complaints. Check the list below for details.} />',
  '<AudioGuide text={Dashboard for  + role + . You have  + mockIssues.length +  total complaints. Check the list below for details.} />'
);

content = content.replace(
  /<div key=\{issue\.id\} className=\{.*?\}>/,
  '<div key={issue.id} className={	ransition-colors  + (expandedIssue === issue.id ? "bg-slate-50" : "bg-white hover:bg-slate-50")}>'
);

content = content.replace(
  /<p className=\{inline-block mt-2 font-bold px-3 py-1 rounded-full text-sm \}>/,
  '<p className={inline-block mt-2 font-bold px-3 py-1 rounded-full text-sm  + (issue.status === "Resolved" ? "bg-green-100 text-green-700" : issue.status === "Under Review" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700")}>'
);

fs.writeFileSync(path, content);
console.log('Fixed dashboard');
