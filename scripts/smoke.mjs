import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
const base = process.env.SMOKE_BASE_URL || 'http://localhost:3000';
const sql = neon(process.env.DATABASE_URL);
const created = [];
function client() {
  let cookie = '';
  return async function call(path, method = 'GET', body, extra = {}) {
    const response = await fetch(base + path, { method, headers: { ...(body !== undefined ? {'Content-Type':'application/json'} : {}), ...(cookie ? {cookie} : {}), ...extra }, body: body === undefined ? undefined : JSON.stringify(body), redirect:'manual', signal: AbortSignal.timeout(30000) });
    const set = response.headers.getSetCookie();
    if(set.length) cookie = set.map(value => value.split(';')[0]).join('; ');
    const data = await response.json().catch(() => null);
    return { status:response.status, data, headers:response.headers };
  };
}
(async () => {
  const run = randomUUID();
  const email = `smoke-a-${run}@copyrail.test`, password = 'smoke-test-password-2026';
  const a=client(), b=client(), guest=client();
  try {
    assert.equal((await guest('/api/history')).status,401);
    assert.equal((await guest('/api/auth/signup','POST',{email,password:'short',name:'Smoke'})).status,400);
    let res=await a('/api/auth/signup','POST',{email,password,name:'Smoke A'});
    assert.equal(res.status,200,JSON.stringify(res.data));created.push(res.data.id);
    assert.equal(res.data.passwordHash,undefined);
    assert.match(res.headers.get('set-cookie'),/HttpOnly/i);
    if(base.startsWith('https:')) assert.match(res.headers.get('set-cookie'),/Secure/i);
    res=await a('/api/profile','PUT',{mustUse:['Northstar'],mustAvoid:['synergy'],bannedClaims:['guaranteed cure']});assert.equal(res.status,200,JSON.stringify(res.data));
    res=await a('/api/check','POST',{copy:'Northstar synergy'});assert.equal(res.status,200,JSON.stringify(res.data));assert.equal(res.data.result.pass,false);
    res=await a('/api/check','POST',{copy:'Northstar helps teams review their writing.'});assert.equal(res.status,200);assert.equal(res.data.result.pass,true);
    const lastId=res.data.id;
    assert.equal((await a('/api/check','POST',{copy:''})).status,400);
    assert.equal((await a('/api/check','POST',{copy:123})).status,400);
    assert.equal((await a('/api/profile','PUT',{mustUse:[],mustAvoid:[],bannedClaims:[]},{origin:'https://untrusted.example'})).status,403);
    res=await a('/api/auth/logout','POST');assert.equal(res.status,200);
    assert.equal((await a('/api/history')).status,401);
    res=await a('/api/auth/login','POST',{email,password});assert.equal(res.status,200,JSON.stringify(res.data));
    assert.deepEqual((await a('/api/profile')).data.mustUse,['Northstar']);
    assert.equal((await a('/api/history')).data[0].id,lastId);
    res=await b('/api/auth/signup','POST',{email:`smoke-b-${run}@copyrail.test`,password,name:'Smoke B'});assert.equal(res.status,200,JSON.stringify(res.data));created.push(res.data.id);
    assert.deepEqual((await b('/api/history')).data,[]);
    assert.notDeepEqual((await b('/api/profile')).data.mustUse,['Northstar']);
    assert.equal((await guest('/api/history','GET',undefined,{cookie:'copyrail_session=forged.signature'})).status,401);
    console.log('PASS: production signup, session flags, input validation, saved guidelines, checks, logout/login persistence, tenant isolation, origin checks and forged-session rejection.');
  } finally {
    for(const id of created) await sql`DELETE FROM copyrail_users WHERE id = ${id}`;
    console.log(`Removed ${created.length} test accounts and their dependent test data.`);
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
