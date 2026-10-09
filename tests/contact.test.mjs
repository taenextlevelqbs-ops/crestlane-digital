import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
import { createRequire } from "node:module";
const loadModule = createRequire(import.meta.url);
// Execute the real server implementation without changing the app's module configuration.
loadModule.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  module._compile(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
};
const { createContactHandler, createLimiter } = loadModule('../lib/contact-server.ts');
const { validateInquiry } = loadModule('../lib/contact-fields.ts');
const data = { name: 'Test Person', email: 'test@example.com', details: 'A new website', interests: ['Websites'] };
const env = { RESEND_API_KEY: 'test-only-placeholder', CONTACT_FROM_EMAIL: 'Crestlane <hello@example.com>', CONTACT_TO_EMAIL: 'sales@example.com', CONTACT_SITE_ORIGIN: 'https://crestlanedigital.com' };
const request = (body = data, headers = {}) => new Request('https://crestlanedigital.com/api/contact', { method: 'POST', headers: { origin: 'https://crestlanedigital.com', 'content-type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });
const handler = (send, settings = env, allow = () => true) => createContactHandler({ env: settings, send, allow });

test('rejects blank required fields, bad email, excessive text and unexpected services', () => {
  for (const overrides of [{name:' '}, {email:'bad'}, {details:' '}, {details:'x'.repeat(1801)}, {interests:['Invented']}, {name:12}, {website:'javascript://example.com'}]) {
    assert.ok(Object.keys(validateInquiry({...data,...overrides}).errors).length);
  }
});
test('requires a phone number when a call or text is requested', () => {
  assert.ok(validateInquiry({...data,contact:'Text message'}).errors.phone);
  assert.ok(validateInquiry({...data,contact:'Phone call',phone:'+1 (703) 555-0100'}).inquiry);
});
test('rejects cross-origin, malformed JSON, wrong media type, spam trap and oversize streams without sending', async () => {
  let calls = 0;
  const run = handler(async () => { calls++; throw new Error('must not send'); });
  assert.equal((await run(request(data,{origin:'https://attacker.example'}))).status,403);
  assert.equal((await run(request(data,{origin:''}))).status,403);
  assert.equal((await run(request('{'))).status,400);
  assert.equal((await run(request(data,{'content-type':'text/plain'}))).status,415);
  assert.equal((await run(request({...data,companyFax:'spam'}))).status,400);
  assert.equal((await run(request('x'.repeat(17000)))).status,413);
  assert.equal(calls,0);
});
test('returns structured validation errors',async()=>{
  const result=await handler()(request({...data,email:'bad'}));
  assert.equal(result.status,400);assert.ok((await result.json()).errors.email);
});
test('missing configuration fails closed and exposes no secrets',async()=>{
  const result=await handler(undefined,{})(request());
  assert.equal(result.status,503);assert.match((await result.json()).message,/not been sent/);
});
test('rate limiter blocks excess submissions without provider calls',async()=>{
  const limiter=createLimiter(1);
  const run=handler(undefined,{},limiter);
  assert.equal((await run(request())).status,503);
  const result=await run(request());assert.equal(result.status,429);assert.equal(result.headers.get('retry-after'),'60');
});
test('provider acceptance returns accepted, never delivered, and uses fixed recipient and reply-to',async()=>{
  let payload;
  const run=handler(async(url,options)=>{
    assert.equal(url,'https://api.resend.com/emails');
    payload=JSON.parse(options.body);assert.ok(options.headers['Idempotency-Key']);
    return Response.json({id:'provider-test-id'});
  });
  const result=await run(request());const body=await result.json();
  assert.equal(result.status,202);assert.equal(body.status,'accepted');assert.match(body.message,/delivery has not yet been confirmed/);
  assert.deepEqual(payload.to,['sales@example.com']);assert.equal(payload.reply_to,data.email);
  assert.ok(!JSON.stringify(body).includes(env.RESEND_API_KEY));assert.ok(!payload.text.includes('companyFax'));
});
test('provider errors, malformed responses and timeouts never report success or leak provider details',async()=>{
  for(const send of [async()=>Response.json({message:'private provider details'},{status:401}),async()=>Response.json({}),async()=>new Response('not JSON'),async()=>{throw new Error('private timeout detail');}]){
    const result=await handler(send)(request());const body=await result.json();
    assert.equal(result.status,502);assert.equal(body.status,undefined);assert.ok(!JSON.stringify(body).includes('private'));
  }
});
