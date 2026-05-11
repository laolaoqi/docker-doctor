#!/usr/bin/env node
const { execSync } = require('child_process');
function run(c) { try { return execSync(c,{timeout:8000}).toString().trim(); } catch { return ''; } }
const ok = '✓', warn = '⚠', err = '✗';
console.log(`\n  🐳 docker-doctor v1.0.0\n`);
const c = run('docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Image}}\t{{.Ports}}" --no-trunc');
console.log(`  ${c?ok:err} 容器状态`);
if(c) c.split('\n').slice(1).forEach(l => {
  const s = l.includes('Up') ? ok : l.includes('Exited') ? warn : err;
  console.log(`    ${s} ${l}`);
});
const d = run('docker system df');
console.log(`\n  ${d?ok:err} 磁盘使用`);
if(d) d.split('\n').forEach(l => console.log(`    ${l}`));
const st = run('docker ps -f status=exited -q | wc -l');
const da = run('docker images -f dangling=true -q | wc -l');
console.log(`\n  ${parseInt(st)>0?warn:ok} 已停止: ${st.trim()} | 悬空镜像: ${da.trim()}`);
console.log(`\n  🔗 https://github.com/laolaoqi/docker-doctor\n`);
