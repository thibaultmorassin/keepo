#!/usr/bin/env node
// Usage :
//  node upload.js <fichier> <url_api_complete> <token> [purchaseDate AAAA-MM-JJ] [warrantyMonths] [priceEuros] [--name "Aspirateur"]
// Ex :
//  node upload.js ./ticket.jpg https://<api-id>.execute-api.eu-west-3.amazonaws.com/default/receipts eyJ... 2025-08-17 24 129.99 --name "Aspirateur"

const fs = require('fs');
const path = require('path');

function parseFlags(argv){ const f={},pos=[]; for(let i=0;i<argv.length;i++){const a=argv[i];
  if(a.startsWith('--')){const e=a.indexOf('='); if(e>-1) f[a.slice(2,e)]=a.slice(e+1);
    else {const k=a.slice(2),n=argv[i+1]; if(n && !n.startsWith('-')){f[k]=n;i++;} else f[k]=true;}}
  else pos.push(a);} return {flags:f,positional:pos}; }

function guessType(p){ const ext=path.extname(p).toLowerCase();
  if(ext==='.jpg'||ext==='.jpeg')return 'image/jpeg';
  if(ext==='.png')return 'image/png';
  if(ext==='.webp')return 'image/webp';
  if(ext==='.pdf')return 'application/pdf';
  return 'application/octet-stream'; }

(async () => {
  const { flags, positional } = parseFlags(process.argv.slice(2));
  const [filePath, apiUrl, token, purchaseDate, warrantyMonthsStr, priceEurosStr] = positional;
  if(!filePath || !apiUrl || !token){
    console.error('Usage: node upload.js <fichier> <url_api_complete> <token> [purchaseDate] [warrantyMonths] [priceEuros] [--name "Nom"]');
    process.exit(1);
  }

  const itemName = flags.name;
  const fileName = path.basename(filePath);
  const contentType = guessType(filePath);
  const fileBase64 = fs.readFileSync(filePath).toString('base64');

  let amountCents;
  if (priceEurosStr !== undefined) {
    const euros = Number(priceEurosStr);
    if (!Number.isNaN(euros)) amountCents = Math.round(euros * 100);
  }

  const payload = {
    fileName, contentType, fileBase64,
    ...(itemName ? { itemName } : {}),
    ...(purchaseDate ? { purchaseDate } : {}),
    ...(warrantyMonthsStr ? { warrantyMonths: Number(warrantyMonthsStr) } : {}),
    ...(Number.isFinite(amountCents) ? { amountCents } : {})
  };

  try{
    const res = await fetch(apiUrl, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'Authorization': token }, // token tel qu’attendu (brut ou "Bearer ...")
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    console.log(res.status, res.statusText);
    try{ console.log(JSON.parse(text)); } catch{ console.log(text); }
    if(!res.ok) process.exit(1);
  }catch(e){
    console.error('Erreur:', e.message||e); process.exit(1);
  }
})();
