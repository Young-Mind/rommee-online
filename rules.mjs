import {randomInt} from 'node:crypto';
export const SUITS=['♣','♠','♥','♦'];
export function deck(){const cards=[];for(let d=0;d<2;d++)for(const suit of SUITS)for(let rank=1;rank<=13;rank++)cards.push({id:`${d}-${suit}-${rank}`,suit,rank});for(let j=0;j<6;j++)cards.push({id:`joker-${j}`,joker:true});return shuffle(cards)}
export function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=randomInt(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
export const value=c=>c.joker?20:c.rank===1?11:c.rank>=10?10:c.rank;
export function meld(cards){if(cards.length<3)return null;const non=cards.filter(c=>!c.joker),j=cards.length-non.length;if(!non.length)return null;
// same rank, different suit; jokers fill missing suits
if(cards.length<=4&&non.every(c=>c.rank===non[0].rank)&&new Set(non.map(c=>c.suit)).size===non.length)return {type:'group',points:cards.length*(non[0].rank===1?11:non[0].rank>=10?10:non[0].rank)};
// consecutive ranks within a suit, ace only low (1) OR high (14), never wrap around
if(non.every(c=>c.suit===non[0].suit)&&cards.length<=13){for(const aceHigh of [false,true]){const nums=non.map(c=>c.rank===1&&aceHigh?14:c.rank).sort((a,b)=>a-b);if(new Set(nums).size!==nums.length)continue;const lo=Math.max(aceHigh?2:1,nums.at(-1)-cards.length+1),hi=Math.min(aceHigh?14:13,nums[0]);for(let start=lo;start<=hi;start++){const ranks=Array.from({length:cards.length},(_,i)=>start+i);if(nums.every(n=>ranks.includes(n)))return {type:'run',points:ranks.reduce((s,n)=>s+(n===1||n===14?11:n>=10?10:n),0)};}}}
return null;}
export function score(cards){return cards.reduce((a,c)=>a+value(c),0)}
export function ensureOwned(hand,ids){if(!Array.isArray(ids)||!ids.length||new Set(ids).size!==ids.length)throw Error('Karten auswählen');const cards=ids.map(id=>hand.find(c=>c.id===id));if(cards.some(c=>!c))throw Error('Diese Karte gehört dir nicht');return cards}
