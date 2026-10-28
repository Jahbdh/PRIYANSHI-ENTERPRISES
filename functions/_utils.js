const enc = new TextEncoder();
export function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}
export async function readJson(request) {
  try { return await request.json(); } catch { return {}; }
}
export async function hashPassword(password, saltHex) {
  const salt = saltHex || Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2,'0')).join('');
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: Uint8Array.from(salt.match(/.{2}/g), x => parseInt(x,16)), iterations: 150000, hash: 'SHA-256' }, key, 256);
  const hash = Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2,'0')).join('');
  return `${salt}:${hash}`;
}
export async function verifyPassword(password, stored) {
  if (!stored || !stored.includes(':')) return false;
  return (await hashPassword(password, stored.split(':')[0])) === stored;
}
async function sign(payload, secret) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const data = btoa(String.fromCharCode(...enc.encode(JSON.stringify(payload)))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
  const signature = btoa(String.fromCharCode(...sig)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  return `${data}.${signature}`;
}
export async function makeSession(user, secret) {
  return sign({ id:user.id, name:user.name, role:user.role, exp:Date.now()+7*24*60*60*1000 }, secret);
}
export async function getUser(request, env) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i,'') || '';
  const parts = token.split('.');
  if (parts.length !== 2 || !env.SESSION_SECRET) return null;
  const key = await crypto.subtle.importKey('raw', enc.encode(env.SESSION_SECRET), { name:'HMAC', hash:'SHA-256' }, false, ['verify']);
  const sig = parts[1].replace(/-/g,'+').replace(/_/g,'/');
  let bytes; try { bytes = Uint8Array.from(atob(sig + '='.repeat((4-sig.length%4)%4)), c=>c.charCodeAt(0)); } catch { return null; }
  if (!await crypto.subtle.verify('HMAC', key, bytes, enc.encode(parts[0]))) return null;
  try {
    const encoded = parts[0].replace(/-/g,'+').replace(/_/g,'/');
    const p = JSON.parse(decodeURIComponent(escape(atob(encoded + '='.repeat((4-encoded.length%4)%4)))));
    if (p.exp < Date.now()) return null;
    return p;
  } catch { return null; }
}
export async function requireUser(request, env) {
  const user = await getUser(request, env);
  if (!user) return { error: json({error:'Login required'},401) };
  return { user };
}
