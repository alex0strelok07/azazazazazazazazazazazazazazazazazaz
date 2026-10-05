// game7a2.js — этап 7 (часть 2): блокировка управления, ESC, расширенное сохранение/загрузка, удаление лавки, музыка по CityState.
(function(){'use strict';
const P=window.P7;if(!P||!P.PAUSE)return;
const SKEY='panel7_save';
const PAUSE=P.PAUSE,CUT=P.CUT,QUEST=P.QUEST,CITY=P.CITY,hud=P.questHud,pbuild=v=>PAUSE.build(v),popen=()=>PAUSE.open(),pclose=q=>PAUSE.close(q);
const titleOn=P.titleOn7,sf=P.sf7,WS=P.WS7,noDanger=P.noDanger,alleyScene=P.alleyScene,flush=P.flush7;
const X=()=>{try{return N[id]||{}}catch(e){return{}}};
/* ---------- блокировка управления во время паузы / кат-сцен ---------- */
const locked=()=>PAUSE.on||CUT.on;
try{if(typeof move==='function'){const _m=move;move=function(){if(locked())return;return _m.apply(this,arguments)}}}catch(e){}
try{if(typeof switchChar==='function'){const _s=switchChar;switchChar=function(){if(locked())return;return _s.apply(this,arguments)}}}catch(e){}
if(P.go){const _g=P.go;P.go=function(){const a=arguments;if(PAUSE.on){P._pend=()=>_g.apply(P,a);return}return _g.apply(this,a)}}

window.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&!e.shiftKey){if(titleOn()||P.invOpen)return;e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;
  if(PAUSE.on){if(PAUSE.view!=='main')pbuild('main');else pclose();return}
  if(P.fightingReal()){P.note7('Во время стычки пауза недоступна');return}
  if(CUT.on&&!CUT.pausable){P.note7('Меню будет доступно после сцены');return}
  popen();return}
 if(PAUSE.on&&e.key!=='F5'&&e.key!=='F9'){e.stopImmediatePropagation();if(!/^F\d/.test(e.key))e.preventDefault()}},true);

/* ---------- расширенное сохранение ---------- */
const clone=o=>{try{return JSON.parse(JSON.stringify(o))}catch(e){return null}};
function snap(){const w=WS()||{},s=sf();const pos={};['kirill','zhenya'].forEach(h=>{if(w[h])pos[h]={x:w[h].x,y:w[h].y,dir:w[h].dir,room:w[h].room}});
 return{v:7,at:Date.now(),id:(typeof id!=='undefined'?id:null),pos,party:w.party||null,active:w.active||null,S:clone(P.S),ch:s.ch,city:CITY.state,quest:{active:QUEST.active(),main:QUEST.main(),done:clone(s.q||{})},music:P.MUSIC?P.MUSIC.current:'',amb:P.AUDIO?P.AUDIO.amb:null,seen:clone(s.seen||{}),cuts:clone(s.cuts||{})}}
const _save=P.save;
P.save=function(){let r;try{r=_save?_save.apply(this,arguments):undefined}catch(e){}try{let o={};try{o=JSON.parse(localStorage.getItem(SKEY))||{}}catch(_){}if(!_save){o.id=id;o.S=P.S}o.x7=snap();o.at=o.x7.at;localStorage.setItem(SKEY,JSON.stringify(o))}catch(e){}return r};
P.snap7=snap;
function restore(){let o;try{o=JSON.parse(localStorage.getItem(SKEY))}catch(e){return}const x=o&&o.x7;if(!x)return;
 try{if(x.S&&P.S){for(const k in x.S)P.S[k]=x.S[k]}}catch(e){}
 const s=sf();if((s.city|0)<(x.city|0))s.city=x.city|0;s.q=Object.assign({},x.quest&&x.quest.done||{},s.q||{});s.seen=Object.assign({},x.seen||{},s.seen||{});s.cuts=Object.assign({},x.cuts||{},s.cuts||{});
 try{if(x.id&&N[x.id]&&!N[x.id].end){if(id!==x.id){id=x.id;render()}}}catch(e){}
 setTimeout(()=>{try{const w=WS();if(w){if(x.party&&'party' in w)w.party=x.party;if(x.active&&'active' in w)w.active=x.active;['kirill','zhenya'].forEach(h=>{if(w[h]&&x.pos[h])Object.assign(w[h],x.pos[h])})}if(typeof drawMini==='function')drawMini();P.COL&&P.COL.unstick&&P.COL.unstick()}catch(e){}
  applyWorld();QUEST.upd(true);P.note7('Игра загружена',1600)},120)}
P.restore7=restore;
const _ls=P.loadSlot;if(_ls)P.loadSlot=function(i){const r=_ls.apply(this,arguments);if(r)setTimeout(restore,420);return r};
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('.contBtn'))setTimeout(restore,420)},true);

/* ---------- Улица: лавка на дороге удалена полностью (спрайт, урна/ёлка замены, коллизия, подпись) ---------- */
const BENCH={x1:20,y1:72,x2:34,y2:96};
const inB=r=>r&&r.x1>=BENCH.x1-.5&&r.x2<=BENCH.x2+.5&&r.y1>=BENCH.y1-1.5&&r.y2<=BENCH.y2+.5;
function noBench(){try{const K=P._K;if(K&&K.item&&!K.item._nb){const prev=K.item;const f=function(a){if(Array.isArray(a)&&a[0]==='car'&&a[1]===20&&a[2]===74)return;if(Array.isArray(a)&&a[0]==='bench'&&a[1]===20&&a[2]===73)return;return prev.apply(this,arguments)};f._nb=1;K.item=f}}catch(e){}
 try{if(typeof STREET_BLOCKS!=='undefined'){for(let i=STREET_BLOCKS.length-1;i>=0;i--)if(inB(STREET_BLOCKS[i]))STREET_BLOCKS.splice(i,1)}}catch(e){}
 try{const M=P.COL&&P.COL.MAPS&&P.COL.MAPS.street;if(Array.isArray(M)){for(let i=M.length-1;i>=0;i--){const r=M[i];if(r&&(r.n==='скамейка'||r.n==='лавка'||r.n==='урна')&&inB(r))M.splice(i,1)}}}catch(e){}
 try{const sc=P._scenes;if(sc)for(const k in sc){const L=sc[k]&&sc[k].items;if(Array.isArray(L))for(let i=L.length-1;i>=0;i--){const a=L[i];if(Array.isArray(a)&&/^(bench|bin|tree|car)$/.test(a[0])&&a[1]>=19.5&&a[1]<=31&&a[2]>=72&&a[2]<=81&&/street/.test(k))L.splice(i,1)}}}catch(e){}
 try{document.querySelectorAll('#world [data-name="ЛАВКА"],#world [title="ЛАВКА"]').forEach(n=>n.remove())}catch(e){}}
P.noBench=noBench;

/* ---------- музыка: стадии города (один трек на общей шине game6a, кроссфейд 1.2–1.6 с) ---------- */
P.musicHook=()=>{if(PAUSE.on)return{keep:1};if(CUT.on&&CUT.mus)return{mus:CUT.mus,amb:CUT.amb||null};return null};
P.musicStage=(x,ind,out,talk,wet)=>{if(P.fightingReal())return null;const c=CITY.state;const amb=out?(wet?'rain':'city'):'home';if(c<=0)return null;if(talk)return{mus:c>=2?'anxious':'dialog',amb};
 if(c===1)return out?{mus:'anxious',amb}:null;return{mus:out?'crisis':'anxious',amb}};

/* ---------- мир по стадии + цикл ---------- */
function applyWorld(){noDanger();noBench();if(P.applyCity7)try{P.applyCity7()}catch(e){}}
if(typeof render==='function'){const _r=render;render=function(){if(PAUSE.on){const a=arguments;P._pend=()=>render.apply(this,a);return}const out=_r.apply(this,arguments);try{const s=sf(),x=X();s.seen=s.seen||{};if(x.map||x.title)s.seen[x.map||id]=1;
  if(id==='alley'&&!s.f.alleyDone&&QUEST.canFight('Quest_05'))setTimeout(()=>{if(id==='alley')alleyScene()},600);
  if(P.onRender7)P.onRender7(x)}catch(e){}hud();return out}}
setInterval(()=>{if(titleOn()){hud();return}const s=sf();CITY.sync();QUEST.upd();
 if((s.ch||1)>=6&&!s.f.squareDone)s.last=Date.now();
 if(PAUSE.on&&s.last)s.last+=1000},1000);
applyWorld();setTimeout(applyWorld,700);setTimeout(applyWorld,2000);
})();
