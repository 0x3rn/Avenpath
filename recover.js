const fs = require('fs');
const lines = fs.readFileSync('C:/Users/ernes/.gemini/antigravity-ide/brain/f58489b9-3803-4d5f-ae08-e82f4c790769/.system_generated/logs/transcript_full.jsonl', 'utf8').split('\n');
let latestContent = null;
for(const line of lines) {
  if(!line) continue;
  try {
    const obj = JSON.parse(line);
    if(obj.tool_calls) {
      for(const tc of obj.tool_calls) {
        const funcName = tc.name || (tc.function && tc.function.name);
        const argsStr = typeof tc.arguments === 'string' ? tc.arguments : (tc.function && tc.function.arguments);
        if(funcName === 'default_api:write_to_file' && argsStr && argsStr.includes('page.tsx')) {
          const args = JSON.parse(argsStr);
          if (args.TargetFile && args.TargetFile.endsWith('page.tsx')) {
            latestContent = args.CodeContent;
          }
        }
      }
    }
  } catch (e) {}
}
if (latestContent) {
  fs.writeFileSync('page-recovered.tsx', latestContent);
  console.log('Recovered to page-recovered.tsx');
} else {
  console.log('Not found');
}
