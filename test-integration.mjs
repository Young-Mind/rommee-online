import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {setTimeout as wait} from 'node:timers/promises';

const port=18000+Math.floor(Math.random()*10000);
const tmp=mkdtempSync(join(tmpdir(),'rommee-test-'));
const proc=spawn(process.execPath,[resolve('server.mjs')],{env:{...process.env,PORT:String(port),DATA_FILE:join(tmp,'data.json')},stdio:'pipe'});
const url=`http://127.0.0.1:${port}`;
async function ready(){for(let i=0;i<50;i++){try{const r=await fetch(url);if(r.ok)return}catch{}await wait(100)}throw Error('Server startet nicht')}
const clients=Array.from({length:3},()=>({cookie:''}));
async function request(n,path,body){const c=clients[n],r=await fetch(url+path,{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json'}:{}),...(c.cookie?{Cookie:c.cookie}:{})},body:body?JSON.stringify(body):undefined});const set=r.headers.get('set-cookie');if(set)c.cookie=set.split(';')[0];const data=await r.json();return {status:r.status,...data}}
try{
await test('Gastkonto, sechsstelliger Raum, drei Spieler und verdeckte Karten',async()=>{
 await ready();
 for(let i=0;i<3;i++){const g=await request(i,'/api/action',{type:'guest',name:['Chris','Alex','Sam'][i]});assert.equal(g.status,200);assert.ok(clients[i].cookie.startsWith('session='));}
 let created=await request(0,'/api/action',{type:'create'});assert.match(created.room,/^[0-9]{6}$/);const room=created.room;
 for(let i=1;i<3;i++)assert.equal((await request(i,'/api/action',{type:'join',room})).status,200);
 let lobby=await request(0,'/api/room/'+room);assert.equal(lobby.room.players.length,3);
 assert.equal((await request(0,'/api/action',{type:'start',room})).status,200);
 const rooms=await Promise.all(clients.map((_,i)=>request(i,'/api/room/'+room)));
 for(const {room:r} of rooms){assert.equal(r.game.round,1);assert.equal(r.game.hand.length,13);assert.equal(r.game.stockCount,70);assert.ok(r.game.discardTop);assert.equal(r.game.handCounts[Object.keys(r.game.hands||{})[0]],undefined)}
 assert.notDeepEqual(rooms[0].room.game.hand,rooms[1].room.game.hand);
 assert.equal((await request(1,'/api/action',{type:'draw',room})).status,400);
 assert.equal((await request(0,'/api/action',{type:'draw',room,from:'stock'})).status,200);
 const after=await request(0,'/api/room/'+room);assert.equal(after.room.game.hand.length,14);
 const invalid=await request(0,'/api/action',{type:'open',room,groups:[[...after.room.game.hand.slice(0,3).map(c=>c.id)]]});assert.equal(invalid.status,400);
 assert.equal((await request(0,'/api/action',{type:'discard',room,id:after.room.game.hand[0].id})).status,200);
 assert.equal((await request(1,'/api/action',{type:'draw',room,from:'discard'})).status,200);
});
}finally{proc.kill();rmSync(tmp,{recursive:true,force:true})}
