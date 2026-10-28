import { json } from '../_utils.js';
export async function onRequestGet({env}) { const {results=[]}=await env.DB.prepare("SELECT key,value FROM app_settings WHERE key IN ('business_name','upi_id','upi_name','support_mobile')").all(); return json(Object.fromEntries(results.map(x=>[x.key,x.value]))); }
