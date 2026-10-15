import test from 'node:test';import assert from 'node:assert/strict';import {deck,meld,score,ensureOwned} from './rules.mjs';
const c=(suit,rank)=>({id:suit+rank,suit,rank});const j={id:'j',joker:true};
test('110 cards unique',()=>{const d=deck();assert.equal(d.length,110);assert.equal(new Set(d.map(c=>c.id)).size,110)});
test('group validation',()=>{assert.ok(meld([c('♠',8),c('♥',8),c('♦',8)]));assert.equal(meld([c('♠',8),c('♠',8),c('♦',8)]),null);assert.ok(meld([c('♠',8),j,c('♦',8)]))});
test('runs including joker',()=>{assert.ok(meld([c('♠',4),c('♠',5),c('♠',6)]));assert.ok(meld([c('♠',4),j,c('♠',6)]));assert.equal(meld([c('♠',12),c('♠',13),c('♠',2)]),null)});
test('ace as low or high',()=>{assert.ok(meld([c('♥',1),c('♥',2),c('♥',3)]));assert.ok(meld([c('♥',12),c('♥',13),c('♥',1)]))});
test('penalty calculation and ownership',()=>{assert.equal(score([c('♦',1),c('♥',10),j]),41);assert.throws(()=>ensureOwned([c('♦',1)],['bad']))});
