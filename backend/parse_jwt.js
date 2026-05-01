const token = process.argv[2];
if(!token) process.exit(1);
const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
console.log(JSON.stringify(payload, null, 2));
console.log("Expiration:", new Date(payload.exp * 1000).toLocaleString());
