import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
fs.mkdirSync('qa',{recursive:true});
const browser = await chromium.launch({headless:true});
const context = await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page = await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
const results=[];
const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:5174/';
async function check(name,run){try{await run();results.push({name,status:'passed'});}catch(e){results.push({name,status:'failed',error:e.message});}}
await page.goto(baseUrl,{waitUntil:'networkidle'});
await check('Exactly three featured project folders',async()=>assert.equal(await page.locator('.folder').count(),3));
await check('English default',async()=>assert.equal(await page.locator('html').getAttribute('lang'),'en'));
await check('Desktop has no horizontal overflow',async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)));
await page.screenshot({path:'qa/desktop.png',fullPage:true});
await page.locator('#projects').screenshot({path:'qa/folders.png'});
await check('Timeline expands with keyboard',async()=>{const item=page.locator('.timeline-card').nth(1);await item.locator('summary').focus();await page.keyboard.press('Enter');assert(await item.getAttribute('open')!==null);});
await check('All case routes load directly, survive refresh, show galleries',async()=>{for(const id of ['cyber-investigation-assistant','legal-research-assistant','najm-voice-agent']){await page.goto(`${baseUrl}#/projects/${id}`);await page.reload();await page.locator('.case-study h1').waitFor();assert(await page.locator('.gallery-image').count()>0);assert(await page.locator('.case-content>section').count()>=6);}});
await page.goto(baseUrl+'#/projects/cyber-investigation-assistant');
await page.locator('.case-cover img').waitFor();
await page.screenshot({path:'qa/case-study.png',fullPage:true});
await check('Lightbox opens, navigates, traps focus and closes with Escape',async()=>{await page.locator('.gallery-image').first().click();assert(await page.locator('dialog').evaluate(el=>el.open));await page.keyboard.press('ArrowRight');assert.match(await page.locator('.lightbox-toolbar').innerText(),/2 \/ 2/);for(let i=0;i<5;i++)await page.keyboard.press('Tab');assert(await page.evaluate(()=>!!document.activeElement?.closest('dialog')));await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').evaluate(el=>el.open),false);assert.equal(await page.locator('body').evaluate(el=>el.style.overflow),'');});
await check('All project images load',async()=>{for(const id of ['cyber-investigation-assistant','legal-research-assistant','najm-voice-agent']){await page.goto(`${baseUrl}#/projects/${id}`);for(const img of await page.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());assert(await img.evaluate(el=>el.naturalWidth>0));}}});
await page.goto(baseUrl+'#home');
await check('Folder keyboard navigation',async()=>{await page.locator('.folder').first().focus();await page.keyboard.press('Enter');await page.locator('.case-study').waitFor();assert(page.url().includes('cyber-investigation-assistant'));});
await check('Arabic switch, RTL, persistence and translated case',async()=>{await page.getByRole('button',{name:'Switch to Arabic'}).click();assert.equal(await page.locator('html').getAttribute('dir'),'rtl');assert.match(await page.locator('h1').innerText(),/التحقيق/);await page.reload();assert.equal(await page.locator('html').getAttribute('lang'),'ar');});
await page.goto(baseUrl+'#home');
await page.screenshot({path:'qa/desktop-ar.png',fullPage:true});
await page.setViewportSize({width:390,height:844});
await check('Mobile RTL menu and navigation',async()=>{await page.getByRole('button',{name:'فتح قائمة التنقل'}).click();await page.locator('nav').getByRole('link',{name:'المشاريع',exact:true}).click();await expect(page.getByRole('button',{name:'فتح قائمة التنقل'})).toHaveAttribute('aria-expanded','false');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));});
await page.goto(baseUrl+'#home');
await page.screenshot({path:'qa/mobile-ar.png',fullPage:true});
await page.getByRole('button',{name:'التبديل إلى الإنجليزية'}).click();
await page.screenshot({path:'qa/mobile.png',fullPage:true});
await check('Mobile LTR and all case pages fit',async()=>{assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));for(const id of ['cyber-investigation-assistant','legal-research-assistant','najm-voice-agent']){await page.goto(`${baseUrl}#/projects/${id}`);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}});
await check('Invalid project route has recovery',async()=>{await page.goto(baseUrl+'#/projects/missing');assert.equal(await page.locator('.not-found').count(),1);await page.getByRole('link',{name:'Back to projects',exact:true}).click();await expect(page.locator('.folder')).toHaveCount(3);});
await check('Contact and internal links are valid',async()=>{assert.equal(await page.locator('a[href="mailto:maztsla@gmail.com"]').count(),1);const bad=await page.locator('a[href^="#"]').evaluateAll(links=>links.map(a=>a.getAttribute('href')).filter(h=>!h.startsWith('#/')&&!document.getElementById(h.slice(1))));assert.deepEqual(bad,[]);});
await check('Reduced motion disables logo animation',async()=>assert.equal(await page.locator('.hero-logo').evaluate(el=>getComputedStyle(el).animationName),'none'));
await check('No JavaScript runtime errors',async()=>assert.deepEqual(errors,[]));
await check('Missing media has a readable fallback',async()=>{await page.route('**/cyber-investigation-assistant/dashboard.webp',route=>route.abort());await page.goto(baseUrl+'#/projects/cyber-investigation-assistant');await expect(page.locator('.case-cover .media-fallback')).toBeVisible();await page.unroute('**/cyber-investigation-assistant/dashboard.webp');});
await browser.close();
fs.writeFileSync('qa/results.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
if(results.some(r=>r.status==='failed'))process.exitCode=1;



