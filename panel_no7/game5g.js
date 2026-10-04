// Панель №7 — этап 2 (часть 1): интерактивные объекты и контекстные реакции.
// Объект описывается один раз и сам получает точку на карте (или пункт в меню локации).
// Реплики выбираются по тому, кто рядом: только Кирилл (k), только Женя (z) или оба (b).
// P.addObj({id,map:'home'|'kitchen'|'corridor'|'street',x,y,n, k:[...],z:[...],b:[...], r:{...}, v:[{c,k,z,b,a}], fx})
// или P.addObj({id,loc:'yard',n,i, ...}) — пункт меню городской локации.
// Строка реплики: ['k'|'z'|'n'|'Имя NPC', эмоция, текст].
(function(){
const P=window.P7;if(!P||typeof N==='undefined')return;
const OBJ=P.OBJ5={},BY={};
const BACKN={home:'homeExplore',kitchen:'kitchenExplore',corridor:'corridorExplore',street:'streetHub'};
const ROOMN={home:'ГОСТИНАЯ',kitchen:'КУХНЯ',corridor:'КОРИДОР',street:'УЛИЦА'};
const WHO={k:['Кирилл','kirill'],z:['Женя','zhenya'],n:['Рассказчик','none']};
const MAXL=6;
const fl=()=>(P.S&&P.S.flags)||{};
function curMap(){const x=N[id]||{};if(P.realMap)return P.realMap;if(x.map)return x.map;if(x.explore&&(id==='streetHub'||x.room==='УЛИЦА'))return 'street';return null}
function partyFor(o){try{const w=(o.map&&o.map!=='street'&&!o.loc)?home:street;const p=w&&w.party;return p==='kirill'||p==='zhenya'?p:'both'}catch(e){return 'both'}}
function pick(o,p){const n=fl()['o5n_'+o.id]||0;
for(const v of (o.v||[])){let ok=false;try{ok=!v.c||v.c(p,n)}catch(e){ok=false}if(!ok)continue;const L=v[p]||v.a;if(L)return L}
if(n>0&&o.r){const L=o.r[p]||o.r.a;if(L)return L}
return o[p]||o.a||o.b||o.k||o.z}
function setNode(nd,line){const w=line[0],h=WHO[w];nd.s=h?h[0]:w;nd.w=h?h[1]:'none';nd.e=line[1]||'neutral';nd.t=line[2]||'';nd.c=undefined;if('_t0' in nd){nd._t0=nd.t;nd._s0=nd.s;nd._c0=undefined}}
P.addObj=o=>{if(!o||!o.id)return;if(N[o.id]&&!OBJ[o.id])return;OBJ[o.id]=o;
const L0=o.loc&&N[o.loc];const base=L0?{room:L0.room,scene:L0.scene}:{room:o.room||ROOMN[o.map]||'УЛИЦА'};
const back=o.back||(o.loc||BACKN[o.map]||'streetHub');o._back=back;
for(let i=0;i<MAXL;i++){const k=i?o.id+'_'+i:o.id;N[k]=Object.assign({},base,{s:'Рассказчик',w:'none',t:'',next:back,o5:o.id,o5i:i})}
if(o.loc){if(L0&&L0.c&&!L0.c.some(c=>c[1]===o.id)){let at=L0.c.findIndex(c=>c[1]==='cityMap'||c[1]==='streetHub');if(at<0)at=L0.c.length;const ch=[o.n,o.id,o.i||'◇'];if(o.cond)ch.push(o.cond);L0.c.splice(at,0,ch)}}
else if(o.map)(BY[o.map]=BY[o.map]||[]).push(o)};
// точки на картах
const _h=hotList;hotList=function(...a){const b=_h.apply(this,a)||[];const m=curMap();const L=m&&BY[m];if(!L||!L.length)return b;const add=[];for(const o of L){let ok=true;try{ok=!o.cond||o.cond()}catch(e){ok=false}if(ok)add.push(o.hs||(o.hs={id:o.id,x:o.x,y:o.y,n:o.n}))}return add.length?b.concat(add):b};
// подготовка цепочки реплик при входе в объект
const _r=render;render=function(...a){const x=N[id];
if(x&&x.o5&&x.o5i===0&&OBJ[x.o5]){const o=OBJ[x.o5],p=partyFor(o),F=fl(),n=F['o5n_'+o.id]||0;
let L=pick(o,p)||[['n','neutral','Ничего интересного.']];L=L.slice(0,MAXL);
for(let i=0;i<L.length;i++){const nd=N[i?o.id+'_'+i:o.id];setNode(nd,L[i]);nd.cast=p==='both'?['kirill','zhenya']:[p];nd.next=i<L.length-1?o.id+'_'+(i+1):o._back}
if(P.S)F['o5n_'+o.id]=n+1;
if(o.fx){try{const t=o.fx(p,n);if(t)setTimeout(()=>{if(P.toast)P.toast(t)},90)}catch(e){}}}
return _r.apply(this,a)};
// удобные помощники для описаний объектов
P.o5={fl,give:(k,n=1)=>{if(!P.ITEMS||!P.ITEMS[k]||!P.add)return false;P.add(P.who?P.who():'kirill',k,n);return true},has:k=>{try{return P.has?!!P.has(k):(P.cnt?P.cnt(k)>0:false)}catch(e){return false}},cnt:k=>{try{return P.cnt?P.cnt(k):0}catch(e){return 0}},recall:(k,w)=>{try{return P.recall?(P.recall(k,w)||0):0}catch(e){return 0}}};
P._o5={pick,partyFor,curMap,BY,OBJ};
})();
