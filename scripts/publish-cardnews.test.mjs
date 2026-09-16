import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { publish, validateWeek } from './publish-cardnews.mjs';

test('imports preserve archives, are idempotent, and reject invalid input before writing', () => {
  const site = fs.mkdtempSync(path.join(os.tmpdir(), 'cardnews-test-'));
  const write = (date, count = 1) => {
    const file = path.join(site, date + '.json');
    fs.writeFileSync(file, JSON.stringify({date, count, papers:[{title:'A paper',rating:4}]}));
    return file;
  };
  const old = write('2025-01-06');
  const recent = write('2026-09-15');
  publish({site, sources:[old]});
  assert.equal(publish({site, sources:[recent],dryRun:true}).weeks,2);
  assert.equal(publish({site}).weeks,1);
  assert.equal(publish({site,sources:[recent]}).weeks,2);
  assert.equal(publish({site,sources:[recent]}).changed,0);
  const generated = fs.readFileSync(path.join(site,'assets/js/cards-data.js'),'utf8');
  const bad = write('2026-09-16',2);
  assert.throws(()=>publish({site,sources:[bad]}), /count/);
  assert.equal(fs.readFileSync(path.join(site,'assets/js/cards-data.js'),'utf8'),generated);
  assert.throws(()=>validateWeek({date:'2026-02-30',papers:[]},'test'), /date/);
});

test('calendar cutoff, archive year/quarter selection and safe card markup', () => {
  const elements = new Map();
  function element(id) {
    if (!elements.has(id)) elements.set(id, {innerHTML:'', value:'', selectedIndex:0,
      addEventListener(event,fn){this[event]=fn;},setAttribute(){},querySelectorAll(){return [];}});
    return elements.get(id);
  }
  const paper = {title:'<img src=x onerror=alert(1)>',rating:5,emoji:'<script>',doi:'10.1234/example',pubmed:'javascript:alert(1)'};
  const context = {window:{CARDNEWS:['2026-05-31','2026-02-28','2026-02-27','2025-10-01'].map(date=>({date,papers:[paper]}))},
    document:{documentElement:{lang:'en'},getElementById:element,addEventListener(){}},URL,
    Date:class extends Date {constructor(...args){super(...(args.length?args:['2026-05-31T12:00:00']));}}};
  vm.runInNewContext(fs.readFileSync(new URL('../assets/js/render-cards.js',import.meta.url),'utf8'),context);
  assert.match(element('cardnews-week').innerHTML,/2026-02-28/);
  assert.doesNotMatch(element('cardnews-week').innerHTML,/2026-02-27/);
  assert.match(element('cardnews-grid').innerHTML,/https:\/\/doi.org\/10.1234\/example/);
  assert.doesNotMatch(element('cardnews-grid').innerHTML,/<img|<script|javascript:/);
  element('cardnews-period').click({target:{closest:()=>({getAttribute:()=> 'archive'})}});
  assert.match(element('cardnews-year').innerHTML,/2025/);
  assert.match(element('cardnews-week').innerHTML,/2026-02-27/);
  assert.doesNotMatch(element('cardnews-week').innerHTML,/2026-02-28/);
  element('cardnews-year').value='2025';element('cardnews-year').change();
  assert.match(element('cardnews-quarter').innerHTML,/Q4/);
  assert.match(element('cardnews-week').innerHTML,/2025-10-01/);
});
