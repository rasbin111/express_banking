import speakeasy from 'speakeasy';

const secret = speakeasy.generateSecret({ length: 20 });

const token = speakeasy.totp({
  secret: secret.base32,
  encoding: 'base32',
});

const verified = speakeasy.totp.verify({
  secret: secret.base32,
  encoding: 'base32',
  token: token,
  window: 1,
});

console.log("Secret (base32):", secret.base32);
console.log("Token:", token);
console.log("Verified:", verified); // should be true

