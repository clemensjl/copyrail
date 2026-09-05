import {chromium,expect} from '@playwright/test';
import {randomUUID} from 'node:crypto';
import {neon} from '@neondatabase/serverless';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname=path.dirname(fileURLToPath(import.meta.url));
const base=process.env.SMOKE_BASE_URL||'https://copyrail.vercel.app';
const email=`browser-${randomUUID()}@copyrail.test`;
const password='browser-test-password-2026';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const out=path.join(__dirname,'../artifacts');fs.mkdirSync(out,{recursive:true});
 try {
  await page.goto(base);await expect(page.getByRole('heading',{name:'Keep AI copy on the brand rail.'})).toBeVisible();
  await page.screenshot({path:path.join(out,'landing-desktop.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.join(out,'landing-mobile.png'),fullPage:true});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.goto(base+'/signup');
  await page.getByLabel('Name',{exact:true}).fill('Browser verification');await page.getByLabel('Email',{exact:true}).fill(email);await page.getByLabel('Password',{exact:true}).fill(password);
  await page.getByRole('button',{name:'Create account',exact:true}).click();await page.waitForURL('**/app');
  await page.getByRole('link',{name:'Rails',exact:true}).click();
  await expect(page.getByRole('button',{name:'Save rails'})).toBeEnabled();
  await page.getByLabel('Must-use terms').fill('Northstar');await page.getByLabel('Must-avoid terms').fill('synergy');await page.getByLabel('Banned claims').fill('guaranteed cure');
  await page.getByRole('button',{name:'Save rails'}).click();await expect(page.getByText('Rails saved.',{exact:false})).toBeVisible();
  await page.getByRole('link',{name:'Checker',exact:true}).click();await page.getByLabel('Copy',{exact:true}).fill('Northstar synergy helps writers.');await page.getByRole('button',{name:'Run check',exact:true}).click();
  await expect(page.getByText('Needs changes before it clears your guidelines.')).toBeVisible();
  await page.screenshot({path:path.join(out,'checker-mobile.png'),fullPage:true});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:'Remove flagged phrases',exact:true}).click();await expect(page.getByRole('button',{name:'Undo phrase removal'})).toBeVisible();
  await expect(page.getByLabel('Copy',{exact:true})).toHaveValue('Northstar helps writers.');
  await page.getByRole('button',{name:'Undo phrase removal'}).click();await expect(page.getByLabel('Copy',{exact:true})).toHaveValue('Northstar synergy helps writers.');
  await page.setViewportSize({width:1440,height:1000});await page.getByRole('button',{name:'Run check',exact:true}).click();await expect(page.getByText('Needs changes before it clears your guidelines.')).toBeVisible();
  await page.screenshot({path:path.join(out,'checker-desktop.png'),fullPage:true});
  await page.getByRole('link',{name:'History',exact:true}).click();await expect(page.getByText('Northstar synergy helps writers.',{exact:true}).first()).toBeVisible();
  expect(errors).toEqual([]);
  console.log('PASS: desktop/mobile rendering, no horizontal overflow, browser signup, save guidelines, check, phrase removal/undo, history, no JavaScript errors.');
 } catch(error) {
  await page.screenshot({path:path.join(out,"browser-failure.png"),fullPage:true});
  console.log("Failure URL",page.url());
  console.log("Visible page",(await page.locator("body").innerText()).slice(0,1800));
  throw error;
 } finally {
  const sql=neon(process.env.DATABASE_URL);await sql`DELETE FROM copyrail_users WHERE email=${email}`;await browser.close();
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
