// Панель №7 — этап 4 (часть 5): портреты в диалогах по тому, кто реально в сцене, сцены драки,
// иллюстрации действий, сохранение, отношения, дневник, случайные события.
(function(){'use strict';
const P=window.P7;if(!P||!P.paintScene)return;
const game=$('game');
const st=document.createElement('style');st.textContent=`
.dialogPortrait{transition:opacity .25s,transform .25s,left .25s,right .25s,filter .25s}
.dialogPortrait.solo{left:50%!important;right:auto!important;transform:translateX(-50%)}
.dialogPortrait.listening{filter:brightness(.62) saturate(.7)}
.dialogPortrait.talk{animation:talkPulse .35s ease-out}
.dialogPortrait.solo.talk{animation:talkPulseC .35s ease-out}
@keyframes talkPulse{0%{transform:translateY(0)}40%{transform:translateY(-10px)}100%{transform:translateY(0)}}
@keyframes talkPulseC{0%{transform:translate(-50%,0)}40%{transform:translate(-50%,-10px)}100%{transform:translate(-50%,0)}}
.npcPortrait{position:absolute;bottom:0;right:1.5vw;height:min(52vh,460px);z-index:3;pointer-events:none;object-fit:contain}
.npcPortrait.mid{right:auto;left:50%;transform:translateX(-50%);height:min(40vh,360px)}
.npcPortrait.hidden{display:none}
.fightArt{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border:1px solid #7d6c45;margin:0 0 12px}
#actionArt{display:none;width:min(340px,70vw);aspect-ratio:16/9;object-fit:cover;border:2px solid #d6b865;margin:0 auto 12px;box-shadow:0 10px 30px rgba(0,0,0,.6)}
#actionArt.show{display:block}#actionArt.big{width:min(760px,86vw)}
.journalBtn{position:absolute;top:304px;right:30px;z-index:7;border:1px solid #7d6c45;background:#11130f;color:#eee8d9;padding:9px 12px;cursor:pointer;font:700 12px 'Courier New',monospace}
.journalBtn:hover{background:#d6b865;color:#11130f}
.journal{position:absolute;right:30px;top:350px;z-index:30;width:min(380px,86vw);max-height:60vh;overflow:auto;background:#141713;border:2px solid #7d6c45;color:#eee8d9;padding:14px 16px;font:14px 'Courier New',monospace}
.journal.hidden{display:none}.journal h4{margin:10px 0 6px;color:#d6b865;letter-spacing:.1em}.journal .r{display:flex;justify-content:space-between;gap:8px;margin:3px 0}
.contBtn{margin-left:12px}
@media(max-width:700px){.journalBtn{top:288px;right:16px}.journal{right:16px;top:330px}}`;document.head.appendChild(st);

// ---------- отношения и память NPC ----------
P.S.rel=P.S.rel||{};P.S.quests=P.S.quests||{};P.S.notes=P.S.notes||[];
const _reset=P.reset;if(_reset)P.reset=function(...a){const r=_reset.apply(this,a);P.S.rel=P.S.rel||{};P.S.quests=P.S.quests||{};P.S.notes=P.S.notes||[];return r};
P.rel=(k,d)=>{if(!P.S.rel)P.S.rel={};const v=(P.S.rel[k]||0)+(d||0);P.S.rel[k]=Math.max(-5,Math.min(10,v));if(d){const n=(P.NPC[k]&&P.NPC[k].n)||k;P.toast((d>0?'♥ ':'💔 ')+n+(d>0?' стал относиться лучше':' обиделся'))}return P.S.rel[k]};
P.relOf=k=>(P.S.rel&&P.S.rel[k])||0;
P.flag=(f,v)=>{if(v!==undefined)P.S.flags[f]=v;return P.S.flags[f]};
P.quest=(k,state,title)=>{const q=P.S.quests[k]||(P.S.quests[k]={t:title||k,s:'new'});if(title)q.t=title;if(state&&q.s!==state){q.s=state;P.toast(state==='done'?'✔ Задание выполнено: '+q.t:'📝 Новое задание: '+q.t)}return q.s};
P.note=t=>{if(!P.S.notes.includes(t)){P.S.notes.push(t);P.toast('📓 Запись в дневнике')}};
P.dyn=(x,o)=>{for(const k of ['t','s','c']){if(!(k in o))continue;x[k]=o[k];if(('_'+k+'0') in x)x['_'+k+'0']=o[k]}if(o.w)x.w=o.w};

// ---------- дневник ----------
const jb=document.createElement('button');jb.className='journalBtn';jb.textContent='📓 ДНЕВНИК (J)';game.appendChild(jb);
const jp=document.createElement('div');jp.className='journal hidden';game.appendChild(jp);
function drawJournal(){const q=Object.values(P.S.quests||{}),rel=Object.entries(P.S.rel||{}).filter(e=>e[1]);
const hearts=v=>v>0?'♥'.repeat(Math.min(5,Math.ceil(v/2))):v<0?'💔':'·';
jp.innerHTML='<h4>ЗАДАНИЯ</h4>'+(q.length?q.map(z=>`<div class=r><span>${z.s==='done'?'✔':'•'} ${z.t}</span></div>`).join(''):'<div>Пока ничего. Поговори с людьми во дворе и на улице.</div>')+
'<h4>ОТНОШЕНИЯ</h4>'+(rel.length?rel.map(e=>`<div class=r><span>${(P.NPC[e[0]]&&P.NPC[e[0]].n)||e[0]}</span><span>${hearts(e[1])}</span></div>`).join(''):'<div>С тобой пока мало кто знаком.</div>')+
'<h4>ЗАПИСИ</h4>'+(P.S.notes.length?P.S.notes.map(n=>`<div>— ${n}</div>`).join(''):'<div>Пусто.</div>')}
P.toggleJournal=v=>{const show=v===undefined?jp.classList.contains('hidden'):v;if(show)drawJournal();jp.classList.toggle('hidden',!show)};
jb.addEventListener('click',e=>{e.stopPropagation();P.toggleJournal()});jp.addEventListener('click',e=>e.stopPropagation());
window.addEventListener('keydown',e=>{if(e.code==='KeyJ'&&!P.fighting){P.toggleJournal();e.preventDefault()}else if(e.code==='Escape'&&!jp.classList.contains('hidden'))P.toggleJournal(false)});

// ---------- убираем белый фон вокруг спрайтов (заливка от краёв картинки) ----------
const CLEAN=new Map(),BUSY=new Set();
function cleanImg(src,cb){if(CLEAN.has(src))return cb(CLEAN.get(src));if(BUSY.has(src))return;BUSY.add(src);const im=new Image();im.onload=()=>{try{const w=im.naturalWidth,h=im.naturalHeight,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(im,0,0);const d=x.getImageData(0,0,w,h),p=d.data,seen=new Uint8Array(w*h),q=[];
const white=i=>p[i*4+3]>10&&p[i*4]>226&&p[i*4+1]>226&&p[i*4+2]>226;
for(let a=0;a<w;a++){q.push(a,(h-1)*w+a)}for(let b=0;b<h;b++){q.push(b*w,b*w+w-1)}
while(q.length){const i=q.pop();if(seen[i])continue;seen[i]=1;if(!white(i))continue;p[i*4+3]=0;const a=i%w,b=(i-a)/w;if(a>0)q.push(i-1);if(a<w-1)q.push(i+1);if(b>0)q.push(i-w);if(b<h-1)q.push(i+w)}
x.putImageData(d,0,0);const u=c.toDataURL();CLEAN.set(src,u);cb(u)}catch(e){CLEAN.set(src,src)}};im.src=src}
function fixSprite(el){const s=el.getAttribute('src');if(!s||s.startsWith('data:'))return;if(CLEAN.has(s)){const u=CLEAN.get(s);if(u!==s)el.setAttribute('src',u);return}cleanImg(s,u=>{if(el.getAttribute('src')===s&&u!==s)el.setAttribute('src',u)})}
const SPR='img.mini,img.dialogPortrait,.mini img';
new MutationObserver(ms=>{for(const m of ms){const t=m.target;if(m.type==='attributes'&&t.matches&&t.matches(SPR))fixSprite(t);else if(m.addedNodes)m.addedNodes.forEach(n=>{if(n.nodeType===1){if(n.matches(SPR))fixSprite(n);n.querySelectorAll&&n.querySelectorAll(SPR).forEach(fixSprite)}})}}).observe(game,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
document.querySelectorAll(SPR).forEach(fixSprite);

// ---------- портреты: только те, кто физически в сцене ----------
const npcImg=document.createElement('img');npcImg.className='npcPortrait hidden';npcImg.alt='';game.appendChild(npcImg);
let lastSpeaker='';
function applyCast(x){const K=$('dialogKirill'),Z=$('dialogZhenya');if(!K||!Z)return;
const off=x.explore||x.end||P.fighting||!!x.noPortraits;
let cast=off?[]:P.cast(x);
const w=x.w==='kirill'||x.w==='zhenya'?x.w:null;
const npc=off?null:P.speakerNpc(x);
const total=cast.length+(npc?1:0);
[[K,'kirill'],[Z,'zhenya']].forEach(([el,h])=>{const on=cast.includes(h);el.classList.toggle('hidden',!on);el.classList.toggle('solo',on&&total===1);
const sp=on&&(w?w===h:false);el.classList.toggle('speaking',sp);el.classList.toggle('listening',on&&!sp&&(!!w||!!npc))});
if(npc){const u=P.npcPortrait(npc);if(npcImg.getAttribute('src')!==u)npcImg.src=u;npcImg.classList.remove('hidden');npcImg.classList.toggle('mid',cast.length===2);
// один герой + NPC: герой слева, NPC справа
if(cast.length===1){const el=cast[0]==='kirill'?K:Z;el.style.left='1.5vw';el.style.right='auto'}else{K.style.left=Z.style.left=K.style.right=Z.style.right=''}}
else{npcImg.classList.add('hidden');K.style.left=Z.style.left=K.style.right=Z.style.right=''}
const who=w||npc||'';if(who&&who!==lastSpeaker){const el=w==='kirill'?K:w==='zhenya'?Z:npcImg;el.classList.remove('talk');void el.offsetWidth;el.classList.add('talk')}lastSpeaker=who}
P.applyCast=applyCast;

// ---------- сцена драки: иллюстрация с конкретными героями и нападающим ----------
const FOEK=[[/гопник/i,['gopnik']],[/пьян/i,['drunk']],[/подрост/i,['teen','teen2']],[/карман/i,['pick']]];
const STREETBG=['street_front','alley','stop','kiosk','newspaper_street','entrance','yard'];
const VAR=[{h:'fight',f:'fight',n:'удар'},{h:'fight',f:'scared',n:'толчок'},{h:'scared',f:'fight',n:'уворот'},{h:'reach',f:'fight',n:'захват'},{h:'fight',f:'reach',n:'блок'}];
let FA=null,lastVar=-1;
function fightBg(){const x=N[id]||{};if(x.explore&&x.map==='street'){let k;do{k=STREETBG[Math.floor(Math.random()*STREETBG.length)]}while(k===FA?.bg&&STREETBG.length>1);return k}return P.lastKey||P.sceneKey(x)}
function fightPic(win){const pose={},npcs=[];FA.heroes.forEach(h=>pose[h]=win===undefined?FA.v.h:win?'stand':'fall');
const both=FA.heroes.length===2;const fp=win===undefined?FA.v.f:win?'fall':'stand';
FA.foes.forEach((f,i)=>npcs.push([f,both?47+i*8:72+i*12,both?94:90,fp,-1]));
return P.paintScene(FA.bg,{heroes:FA.heroes,pose,npcs,dark:win===false?.15:0})}
function initFight(){const panel=document.querySelector('.fightPanel');if(!panel){setTimeout(initFight,300);return}
const card=panel.querySelector('.fightCard'),btn=panel.querySelector('.fightBtn'),foeEl=panel.querySelector('.fightFoe'),fill=panel.querySelector('.fightFill');
const img=document.createElement('img');img.className='fightArt';img.alt='';card.insertBefore(img,card.firstChild);
new MutationObserver(()=>{if(panel.classList.contains('hidden')){FA=null;return}if(FA)return;const t=foeEl.textContent||'';const m=FOEK.find(f=>f[0].test(t));let vi;do{vi=Math.floor(Math.random()*VAR.length)}while(vi===lastVar);lastVar=vi;
const x=N[id]||{};let heroes=P.cast(x);if(x.explore&&x.map==='street'&&street.party!=='both')heroes=[street.party||P.who()];if(P.inApt(x)&&x.explore)heroes=[P.who()];
FA={heroes,foes:m?m[1]:['gopnik'],v:VAR[vi]};FA.bg=fightBg();img.src=fightPic()}).observe(panel,{attributes:true,attributeFilter:['class']});
new MutationObserver(()=>{if(!FA||FA.done)return;if(/ДАЛЬШЕ/.test(btn.textContent)){FA.done=1;const win=fill.style.width==='100%';img.src=fightPic(win);if(win)FA.heroes.forEach(h=>P.S.flags['fought_'+h]=(P.S.flags['fought_'+h]||0)+1)}}).observe(btn,{childList:true,characterData:true,subtree:true})}
initFight();

// ---------- иллюстрация при выборе действия ----------
const BIG=new Set(['square','clash','help','help2','leave','sleepMorning','exitBoth','exitKirill','exitZhenya','goBoth','partyChoice']);
const aImg=document.createElement('img');aImg.id='actionArt';aImg.alt='';
function actionArt(key){const box=$('action');if(!box)return;if(!aImg.parentNode)box.insertBefore(aImg,box.firstChild);const x=N[key];
if(!x||x.explore||x.noArt){aImg.classList.remove('show');return}
try{aImg.src=P.nodeArt(x);aImg.classList.add('show');aImg.classList.toggle('big',BIG.has(key)||!!x.big||!!x.end)}catch(e){aImg.classList.remove('show')}}
if(typeof choose==='function'){const _ch=choose;choose=function(key,...a){const r=_ch.call(this,key,...a);actionArt(key);return r}}
P.actionArt=actionArt;

// ---------- события между сценами ----------
P.EV=P.EV||[];P._evRet=null;let skipEv=false;
P.addEvent=e=>P.EV.push(e);
function pickEvent(x){const g=x.grp;const pool=P.EV.filter(e=>(!e.grp||e.grp.includes(g))&&!(e.once&&P.S.flags['ev_'+e.k])&&(!e.cond||e.cond(x)));if(!pool.length)return null;return pool[Math.floor(Math.random()*pool.length)]}
N.evBack={w:'none',s:'',t:'',next:'hub'};

// ---------- сохранение ----------
const SKEY='panel7_save';
const NOSAVE=/^(ev|bond|fight)/;
function save(){try{const x=N[id];if(!x||x.end||NOSAVE.test(id))return;const t=$('title');if(t&&!t.classList.contains('hidden'))return;localStorage.setItem(SKEY,JSON.stringify({v:4,id,currentTime:typeof currentTime!=='undefined'?currentTime:null,street,home:typeof home!=='undefined'?home:null,S:P.S,at:Date.now()}))}catch(e){}}
P.save=save;
function loadSave(){let s;try{s=JSON.parse(localStorage.getItem(SKEY)||'null')}catch(e){}return s&&s.v===4&&N[s.id]?s:null}
function addCont(){const sb=$('start');if(!sb||document.querySelector('.contBtn'))return;const s=loadSave();if(!s)return;const b=sb.cloneNode(false);b.removeAttribute('id');b.className=(sb.className||'')+' contBtn';b.textContent='ПРОДОЛЖИТЬ';sb.after(b);
b.addEventListener('click',e=>{e.stopPropagation();const sv=loadSave();if(!sv)return;sb.click();setTimeout(()=>{try{if(sv.street)Object.assign(street,sv.street);if(sv.home&&typeof home==='object'&&home)Object.assign(home,sv.home);if(sv.currentTime!=null)try{currentTime=sv.currentTime}catch(e){}
const S=sv.S||{};P.S.money=S.money;['kirill','zhenya'].forEach(h=>{if(S.inv&&S.inv[h])P.S.inv[h]=S.inv[h]});Object.assign(P.S.flags,S.flags||{});P.S.rel=S.rel||{};P.S.quests=S.quests||{};P.S.notes=S.notes||[];
if(P.updMoney)P.updMoney();skipEv=true;id=sv.id;render();P.toast('💾 Игра загружена')}catch(err){console.warn('load',err)}},120)})}
addCont();

// ---------- внешняя обёртка render ----------
const _r=render;
render=function(...a){
if(id==='evBack'){id=P._evRet&&N[P._evRet]?P._evRet:'hub';skipEv=true}
let x=N[id];
if(x&&x.ev&&!skipEv&&!x.explore&&Math.random()<(x.evc||.2)){const e=pickEvent(x);if(e&&N[e.k]){P._evRet=id;const n=N[e.k];n.room=n.room||x.room;if(!n.keepArt){n.art=P.sceneKey(x)}if(!n.cast)n._castFrom=1;n.party=x.party;if(e.once)P.S.flags['ev_'+e.k]=1;id=e.k;x=n}}
skipEv=false;
if(x&&x.call){const c=x.call.filter(o=>!o[3]||o[3](x)).map(o=>o.slice(0,3));P.dyn(x,{c})}
if(x&&typeof x.fx==='function'){try{x.fx(x)}catch(e){console.warn('fx',id,e)}}
const out=_r.apply(this,a);
const y=N[id];if(y){try{applyCast(y)}catch(e){}if(y.once1&&!P.S.flags['seen_'+id]){P.S.flags['seen_'+id]=1;try{y.once1(y)}catch(e){}}}
save();return out};
const t=$('title');if(t)new MutationObserver(addCont).observe(t,{attributes:true});
})();
