// ---- 1. Password Generator ----
const pwLength = document.getElementById('pw-length');
const pwLengthVal = document.getElementById('pw-length-val');
if (pwLength) pwLength.addEventListener('input', () => pwLengthVal.textContent = pwLength.value);

function genPassword(){
  const len = parseInt(document.getElementById('pw-length').value, 10);
  const useUpper = document.getElementById('pw-upper').checked;
  const useLower = document.getElementById('pw-lower').checked;
  const useNum = document.getElementById('pw-numbers').checked;
  const useSym = document.getElementById('pw-symbols').checked;
  let charset = '';
  if (useUpper) charset += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  if (useLower) charset += 'abcdefghijkmnpqrstuvwxyz';
  if (useNum) charset += '23456789';
  if (useSym) charset += '!@#$%^&*()-_=+[]{}';
  const out = document.getElementById('pw-output');
  if (!charset){ out.textContent = 'Select at least one character type.'; return; }
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  let pw = '';
  for (let i = 0; i < len; i++) pw += charset[arr[i] % charset.length];
  out.textContent = pw;
}

function copyOut(id){
  const el = document.getElementById(id);
  navigator.clipboard.writeText(el.textContent).then(() => {
    const original = el.textContent;
    el.dataset.copied = 'true';
  }).catch(()=>{});
}

// ---- 2. Subnet Calculator ----
function calcSubnet(){
  const out = document.getElementById('subnet-output');
  const val = document.getElementById('subnet-input').value.trim();
  const match = val.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
  if (!match){ out.textContent = 'Enter a valid address like 192.168.1.10/24'; out.className='output alert'; return; }
  const octets = [1,2,3,4].map(i => parseInt(match[i],10));
  const cidr = parseInt(match[5],10);
  if (octets.some(o=>o>255) || cidr>32){ out.textContent = 'Invalid IP or CIDR range.'; out.className='output alert'; return; }
  out.className='output';
  const ipInt = (octets[0]<<24) + (octets[1]<<16) + (octets[2]<<8) + octets[3];
  const maskInt = cidr === 0 ? 0 : (~0 << (32-cidr)) >>> 0;
  const netInt = (ipInt & maskInt) >>> 0;
  const bcastInt = (netInt | (~maskInt >>> 0)) >>> 0;
  const toIp = n => [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].join('.');
  const totalHosts = cidr>=31 ? Math.pow(2,32-cidr) : Math.pow(2,32-cidr)-2;
  out.textContent =
`Network address:    ${toIp(netInt)}
Broadcast address:  ${toIp(bcastInt)}
Subnet mask:        ${toIp(maskInt)}
Usable hosts:       ${totalHosts.toLocaleString()}
First usable:       ${cidr>=31 ? toIp(netInt) : toIp(netInt+1)}
Last usable:        ${cidr>=31 ? toIp(bcastInt) : toIp(bcastInt-1)}`;
}

// ---- 3. DNS Lookup ----
async function dnsLookup(){
  const out = document.getElementById('dns-output');
  const domain = document.getElementById('dns-domain').value.trim();
  const type = document.getElementById('dns-type').value;
  if (!domain){ out.textContent = 'Enter a domain.'; out.className='output alert'; return; }
  out.textContent = 'Looking up...'; out.className='output';
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`);
    const data = await res.json();
    if (!data.Answer || data.Answer.length === 0){
      out.textContent = `No ${type} records found for ${domain}.`;
      return;
    }
    out.textContent = data.Answer.map(a => `${a.name}  ${type}  ${a.data}`).join('\n');
  } catch(e){
    out.textContent = 'Lookup failed — network error or blocked request.'; out.className='output alert';
  }
}

// ---- 4. IP Lookup ----
async function ipLookup(){
  const out = document.getElementById('ip-output');
  const ip = document.getElementById('ip-input').value.trim();
  out.textContent = 'Looking up...'; out.className='output';
  try {
    const url = ip ? `https://ipapi.co/${encodeURIComponent(ip)}/json/` : `https://ipapi.co/json/`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.error){ out.textContent = data.reason || 'Lookup failed.'; out.className='output alert'; return; }
    out.textContent =
`IP:        ${data.ip}
City:      ${data.city}, ${data.region}, ${data.country_name}
ISP/Org:   ${data.org || 'n/a'}
Timezone:  ${data.timezone}`;
  } catch(e){
    out.textContent = 'Lookup failed — network error or blocked request.'; out.className='output alert';
  }
}

// ---- 5. Base64 ----
function b64Encode(){
  const out = document.getElementById('b64-output');
  try { out.textContent = btoa(document.getElementById('b64-input').value); out.className='output'; }
  catch(e){ out.textContent = 'Could not encode — check input contains valid characters.'; out.className='output alert'; }
}
function b64Decode(){
  const out = document.getElementById('b64-output');
  try { out.textContent = atob(document.getElementById('b64-input').value.trim()); out.className='output'; }
  catch(e){ out.textContent = 'Could not decode — input is not valid Base64.'; out.className='output alert'; }
}

// ---- 6. Hash Generator ----
async function genHash(){
  const out = document.getElementById('hash-output');
  const text = document.getElementById('hash-input').value;
  const algo = document.getElementById('hash-algo').value;
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest(algo, enc);
  const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  out.textContent = hex;
}

// ---- 7. JSON Formatter ----
function formatJSON(){
  const out = document.getElementById('json-output');
  const raw = document.getElementById('json-input').value;
  try {
    const parsed = JSON.parse(raw);
    out.textContent = JSON.stringify(parsed, null, 2);
    out.className='output';
  } catch(e){
    out.textContent = 'Invalid JSON: ' + e.message;
    out.className='output alert';
  }
}

// ---- 8. Regex Tester ----
function testRegex(){
  const out = document.getElementById('regex-output');
  const pattern = document.getElementById('regex-pattern').value;
  const text = document.getElementById('regex-text').value;
  try {
    const re = new RegExp(pattern, 'g');
    const matches = [...text.matchAll(re)];
    if (matches.length === 0){ out.textContent = 'No matches.'; out.className='output'; return; }
    out.textContent = `${matches.length} match(es):\n` + matches.map(m => `"${m[0]}" at index ${m.index}`).join('\n');
    out.className='output';
  } catch(e){
    out.textContent = 'Invalid regular expression: ' + e.message;
    out.className='output alert';
  }
}

// ---- 9. Storage Converter ----
function convertStorage(){
  const out = document.getElementById('conv-output');
  const value = parseFloat(document.getElementById('conv-value').value) || 0;
  const unitBytes = parseFloat(document.getElementById('conv-unit').value);
  const totalBytes = value * unitBytes;
  const units = [['TB',1099511627776],['GB',1073741824],['MB',1048576],['KB',1024],['Bytes',1]];
  out.textContent = units.map(([name,size]) => `${name.padEnd(6)} ${(totalBytes/size).toLocaleString(undefined,{maximumFractionDigits:6})}`).join('\n');
}
if (document.getElementById('conv-value')) convertStorage();

// ---- 10. Text Diff ----
function diffText(){
  const out = document.getElementById('diff-output');
  const a = document.getElementById('diff-a').value.split('\n');
  const b = document.getElementById('diff-b').value.split('\n');
  const max = Math.max(a.length, b.length);
  let diffs = [];
  for (let i=0; i<max; i++){
    const lineA = a[i] ?? '';
    const lineB = b[i] ?? '';
    if (lineA !== lineB){
      diffs.push(`Line ${i+1}:\n- ${lineA}\n+ ${lineB}`);
    }
  }
  out.textContent = diffs.length ? diffs.join('\n\n') : 'No differences found.';
}
