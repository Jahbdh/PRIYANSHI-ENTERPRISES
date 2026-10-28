import { json } from '../_utils.js';
export async function onRequestGet({env}) { const {results=[]}=await env.DB.prepare('SELECT id,name,description,price_paise FROM services WHERE active=1 ORDER BY id').all(); return json({services:results}); }
