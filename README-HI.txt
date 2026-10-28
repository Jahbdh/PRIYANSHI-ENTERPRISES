PRIYANSHI ENTERPRISES - CLOUDFLARE PAGES STARTER

1) Cloudflare Dashboard > Workers & Pages > priyanshi-enterprises > Settings > Bindings > Add D1 database binding.
   Variable name: DB
   Database: priyanshi-db
2) Settings > Variables and Secrets > Add secret:
   SESSION_SECRET = koi lamba random secret (kam-se-kam 40 characters). Isko kisi se share na karein.
3) D1 > priyanshi-db > Console > schema.sql ki poori SQL paste/run karein.
4) Is folder ki files GitHub repo ke root mein upload karein (index.html aur functions folder root par hon), commit main branch.
5) Cloudflare Pages deploy complete hone par site kholkar pehle apna account register karein. Pehla account admin banega. Uske baad D1 Console mein apne mobile number se admin banayein: UPDATE users SET role='admin' WHERE mobile='APNA10DIGITMOBILE'; Iske baad public visitors account bana sakte hain.

NOTE: Yeh Cloudflare-native starter hai, purane 449 PHP files ka automatic full conversion nahi. Pehle login/services/orders base hai. UPI auto-verification, file upload, old integrations aur har legacy service ko alag migrate/test karna hoga. API credentials ya SQL dump public GitHub par upload na karein.
