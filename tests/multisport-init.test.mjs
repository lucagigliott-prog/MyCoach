import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const INIT = readFileSync(new URL('../skills/init/SKILL.md', import.meta.url), 'utf8');
const SPORTS = new URL('../templates/en/sports.md', import.meta.url);

test('sports.md template has the sections init fills and the dated check line', () => {
  assert.ok(existsSync(SPORTS), 'templates/en/sports.md is missing');
  const text = readFileSync(SPORTS, 'utf8');
  for (const h of ['## Activities', '## Priority', '## Fixed sessions and blackout days', '## Checked']) {
    assert.ok(text.includes(h), `sports.md template lacks ${h}`);
  }
});

test('init asks about other activities and a lifting-only answer keeps the old flow', () => {
  assert.match(INIT, /Besides lifting, which activities/);
  assert.match(INIT, /None skips items 9, 10 and 13, and no `sports\.md` is\s+written/);
});

test('init writes sports.md from the English template and never overwrites it silently', () => {
  assert.match(INIT, /templates\/en\/sports\.md/);
  assert.match(INIT, /`program\.md`, `sports\.md`, and any\s+`gym\.md` — ask/);
});

test('init keeps the age gate and the health screen ahead of the new questions', () => {
  assert.match(INIT, /Under 18: stop here/);
  assert.ok(INIT.indexOf('The health screen') < INIT.indexOf('Besides lifting, which activities'));
});

test('init does not repeat in sports.md what profile.md already holds', () => {
  assert.match(INIT, /Item 14 goes to `profile\.md`'s `## Schedule` and item 15 to its\s+`## Goal`/);
});

test('init marks the grappling extension of the cardio rules as an unverified default', () => {
  assert.match(INIT, /none covers grappling/);
});
