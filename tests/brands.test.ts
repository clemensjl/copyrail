import {randomUUID} from 'node:crypto';
import {describe,expect,it} from 'vitest';
import {database} from '../src/lib/db';
import {createUser,getProfile,saveProfile,recordCheck,getHistory,getCheck,applyAndRecord} from '../src/lib/store';
import {createBrand,getBrand,listBrands,renameBrand} from '../src/lib/brands';
describe.skipIf(process.env.RUN_DATABASE_TESTS!=='1')('brand isolation and immutable reports in Postgres',()=>{
 it('migrates legacy guidelines, separates brands, preserves policy snapshots and denies other accounts',async()=>{
  const run=randomUUID(),ids:string[]=[];
  try {
   const a=await createUser({email:`brands-a-${run}@copyrail.test`,password:'strong-test-password-2026',name:'Brand test A'});ids.push(a.id);
   const b=await createUser({email:`brands-b-${run}@copyrail.test`,password:'strong-test-password-2026',name:'Brand test B'});ids.push(b.id);
   const legacy={mustUse:['Legacy'],mustAvoid:['synergy'],bannedClaims:[]};
   await database()`INSERT INTO copyrail_profiles (user_id,profile) VALUES (${a.id},${JSON.stringify(legacy)}::jsonb)`;
   expect(await getProfile(a.id)).toEqual(legacy);
   const first=(await listBrands(a.id))[0];expect(first.isDefault).toBe(true);
   const second=await createBrand(a.id,'Northstar Studio');
   await expect(recordCheck(a.id,'No guidelines',second.id)).rejects.toThrow('Add at least one');
   await saveProfile(a.id,{mustUse:['Northstar'],mustAvoid:['synergy'],bannedClaims:[]},second.id);
   const record=await recordCheck(a.id,'Northstar synergy helps writers.',second.id);
   expect(record.copy).toBe('Northstar synergy helps writers.');expect(record.result.pass).toBe(false);expect(record.profileRevision).toBe(2);
   expect(await getHistory(a.id,first.id)).toEqual([]);expect((await getHistory(a.id,second.id))[0].id).toBe(record.id);
   await saveProfile(a.id,{mustUse:['New rule'],mustAvoid:[],bannedClaims:[]},second.id);
   await renameBrand(a.id,second.id,'Renamed studio');
   const reloaded=await getCheck(a.id,record.id);
   expect(reloaded.brandName).toBe('Northstar Studio');expect(reloaded.profileSnapshot?.mustUse).toEqual(['Northstar']);expect(reloaded.profileRevision).toBe(2);expect(reloaded.result.pass).toBe(false);
   expect((await getBrand(a.id,second.id)).revision).toBe(3);
   await expect(getBrand(b.id,second.id)).rejects.toMatchObject({status:404});
   await expect(saveProfile(b.id,legacy,second.id)).rejects.toMatchObject({status:404});
   await expect(getHistory(b.id,second.id)).rejects.toMatchObject({status:404});
   await expect(getCheck(b.id,record.id)).rejects.toMatchObject({status:404});
   await saveProfile(a.id,{mustUse:[],mustAvoid:['synergy'],bannedClaims:[]},second.id);
   const removed=await applyAndRecord(a.id,'synergy',second.id);expect(removed.copy).toBe('');expect(removed.record.result.valid).toBe(false);
   const oldRecord={id:`chk_legacy_${run}`,createdAt:new Date().toISOString(),excerpt:'Legacy draft',copyLength:12,result:{score:100,pass:true,valid:true,passThreshold:80,violations:[]}};
   await database()`INSERT INTO copyrail_checks (id,user_id,record) VALUES (${oldRecord.id},${a.id},${JSON.stringify(oldRecord)}::jsonb)`;
   expect((await getHistory(a.id,first.id))[0].id).toBe(oldRecord.id);
   expect((await getHistory(a.id,second.id)).some(r=>r.id===oldRecord.id)).toBe(false);
  }finally{for(const id of ids)await database()`DELETE FROM copyrail_users WHERE id=${id}`;}
 },60000);
 it('enforces the five-brand capacity under concurrent creation',async()=>{
  const a=await createUser({email:`brands-race-${randomUUID()}@copyrail.test`,password:'strong-test-password-2026',name:'Capacity test'});
  try {await listBrands(a.id);const results=await Promise.allSettled(Array.from({length:8},(_,i)=>createBrand(a.id,`Client ${i}`)));expect(results.filter(r=>r.status==='fulfilled')).toHaveLength(4);expect(await listBrands(a.id)).toHaveLength(5);}
  finally{await database()`DELETE FROM copyrail_users WHERE id=${a.id}`;}
 },60000);
});
