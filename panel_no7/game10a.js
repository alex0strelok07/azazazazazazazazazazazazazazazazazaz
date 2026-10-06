/* Панель № 7 — этап 10 (a): единый календарь (дата + день недели + время),
   переход дня только через сон, единый QuestManager для HUD и журнала,
   удаление ошибочной надписи «Суббота. Город засыпан снегом…». Дополняет этапы 1–9. */
(function(){'use strict';
const P=window.P7;if(!P||!P.Q9||!P.TIME)return;
const $=x=>document.getElementById(x),Z=P.Q9,TM=P.TIME;

/* ================= 1–3. КАЛЕНДАРЬ: один источник ================= */
// Всё (HUD, заставка дня, журнал, задания, сохранения) берёт дату отсюда.
// Дата вычисляется из номера игрового дня через Date: день недели и число всегда связаны.
const UP=s=>String(s||'').toUpperCase();
const CAL={
 now(){return Z.cal()},                 // {day,d,m,mon,y,wd,h,mi,min,time,part}
 at(day){return Z.date(day)},           // дата любого игрового дня
 label(c){c=c||Z.cal();return c.d+' '+UP(c.mon)+' '+c.y+' · '+UP(c.wd)+' · '+c.time},
 snapshot(){const c=Z.cal();return{day:c.day,date:c.d,month:c.m,monthName:c.mon,year:c.y,weekday:c.wd,hours:c.h,minutes:c.mi,time:c.time}}
};
P.CAL=CAL;
function paintDate(){try{const c=Z.cal(),t=$('time');
  if(t){const want=CAL.label(c);if(t.textContent!==want){try{TM.show&&TM.show()}catch(e){}if(t.textContent.indexOf(UP(c.wd))<0||t.textContent.indexOf(c.d+' ')<0)t.textContent=want}}
  const k=document.querySelector('#title .kicker');if(k){const w='ПРОЛОГ · '+c.d+' '+UP(c.mon)+' '+c.y+' · '+UP(c.wd);if(k.textContent!==w)k.textContent=w}
 }catch(e){}}
P.paintDate10=paintDate;
// render базовой игры содержит зашитую строку «5 НОЯБРЯ 1993 · ПЯТНИЦА» — после каждого кадра
// она перезаписывается значением из календаря.
if(typeof render==='function'){const _r=render;render=function(){const r=_r.apply(this,arguments);paintDate();return r}}
// Новый день — только через существующий сон (Q9.sleep: затемнение → +1 день → утро → задания → NPC → город → заставка).
if(TM.newDay){const _nd=TM.newDay;TM.newDay=function(){try{if(Z.isSleeping())return;if(Z.canSleep())return Z.sleep();Z.toast('Сначала закончите важные дела этого дня.');return}catch(e){return _nd.apply(this,arguments)}}}
if(TM.chapterDay)TM.chapterDay=function(){/* отключено: день меняется только сном */};

/* ================= 4. Удалённая надпись ================= */
// Источник (событие c1_morning в game6b_ev.js) исправлен. Здесь — защита старых сохранений
// и любых сценариев: строка не попадает в очередь реплик.
const BAN=[/Город засыпан снегом, и впервые за неделю/i];
const banned=t=>BAN.some(r=>r.test(String(t||'')));
P.banned10=banned;
function cleanEv(ev){if(!ev||ev._p10)return ev;const L=ev.lines;
 if(typeof L==='function')ev.lines=function(){const a=L.apply(this,arguments)||[];return a.filter(l=>!banned(l&&l.t))};
 else if(Array.isArray(L))ev.lines=L.filter(l=>!banned(l&&l.t));ev._p10=1;return ev}
try{const E=P.STORY_EV;if(Array.isArray(E))E.forEach(cleanEv);else if(E&&typeof E==='object')Object.values(E).forEach(v=>Array.isArray(v)?v.forEach(cleanEv):cleanEv(v))}catch(e){}
try{Object.keys(N).forEach(k=>{if(N[k]&&banned(N[k].t))N[k].t=''})}catch(e){}

/* ================= 5–8. QuestManager ================= */
// Единый менеджер поверх единственного хранилища заданий (Q9: определения QS + состояние Q().st).
// И HUD, и журнал «Задания» читают задания отсюда по ID.
const S={LOCKED:'LOCKED',ACTIVE:'ACTIVE',COMPLETED:'COMPLETED',FAILED:'FAILED',HIDDEN:'HIDDEN'};
const p2=n=>(n<10?'0':'')+n;
const val=x=>typeof x==='function'?x():x;
const qid=o=>'quest_day_'+p2(o.day||1)+'_'+String(o.id).replace(/[^a-z0-9_]/gi,'_').toLowerCase();
function status(o){const s=(Z.Q().st||{})[o.id];
 if(s){if(s.s==='a')return S.ACTIVE;if(s.s==='d')return S.COMPLETED;if(s.s==='f')return S.FAILED}
 if(o.hidden||o.k==='hidden')return S.HIDDEN;return S.LOCKED}
function byId(id){return Z.QS.find(o=>qid(o)===id||o.id===id)||null}
function view(o){const st=status(o),sp=Z.cur(o),S0=(Z.Q().st||{})[o.id]||{};
 return{id:qid(o),key:o.id,title:val(o.n),main:o.k==='main',day:o.day,status:st,
  step:sp?val(sp.t):null,stepIndex:S0.k||0,steps:(o.s||[]).map(x=>val(x.t))}}
const subs=[];let sig='';
function signature(){try{const c=Z.cal();return c.day+'|'+JSON.stringify(Z.Q().st||{})}catch(e){return''}}
const QM={STATUS:S,
 all(){return Z.QS.map(view)},
 get(id){const o=byId(id);return o?view(o):null},
 status(id){const o=byId(id);return o?status(o):null},
 list(st){return Z.QS.filter(o=>status(o)===st).map(view)},
 // активные — только задания текущего дня (или «сквозные» с keep), открытые сюжетом
 active(){const d=Z.cal().day;return Z.QS.filter(o=>{if(status(o)!==S.ACTIVE)return false;const last=o.e==='keep'?(o.to||o.day):o.day;return d>=o.day&&d<=last})
  .sort((a,b)=>(b.k==='main')-(a.k==='main')).map(view)},
 complete(id){const o=byId(id);if(o&&status(o)===S.ACTIVE){Z.finish(o,'d');QM.refresh()}},
 fail(id,why){const o=byId(id);if(o&&status(o)===S.ACTIVE){Z.finish(o,'f',why);QM.refresh()}},
 subscribe(fn){subs.push(fn);return()=>{const i=subs.indexOf(fn);if(i>=0)subs.splice(i,1)}},
 refresh(force){const s=signature();if(!force&&s===sig)return;sig=s;subs.forEach(f=>{try{f(QM)}catch(e){}})}};
P.QM=P.QuestManager=QM;

/* ---- HUD: рисуется только из QuestManager (старый список Quest_01… больше не показывается) ---- */
const esc=s=>String(s==null?'':s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function hudHtml(){const a=QM.active();const m=a.find(q=>q.main)||a[0];if(!m)return'';const side=a.find(q=>q!==m);
 return'<div data-qid="'+m.id+'"><b>ЗАДАНИЕ:</b> '+esc(m.title)+(m.step?'<br>'+esc(m.step):'')+'</div>'+
  (side?'<div data-qid="'+side.id+'"><b>•</b> '+esc(side.title)+(side.step?': '+esc(side.step):'')+'</div>':'')}
let painting=0;
function hud(){const g=$('game');if(!g)return;let h=$('p7q');if(!h){h=document.createElement('div');h.id='p7q';g.appendChild(h)}
 const html=hudHtml();painting=1;if(h._p10html!==html||!h.querySelector('[data-p10]')&&html){h.innerHTML='<div data-p10="1">'+html+'</div>';h._p10html=html}else if(!html&&h.innerHTML){h.innerHTML='';h._p10html=''}
 let off=!html;try{off=off||(P.titleOn7&&P.titleOn7())||!!(P.CUT&&P.CUT.on)}catch(e){}
 h.classList.toggle('hide',!!off);painting=0}
P.questHud=hud;
QM.subscribe(hud);
// журнал (P.J9) и старый журнал этапа 8 открывают одно и то же окно
try{if(P.J9&&P.JOURNAL){P.JOURNAL.open=P.J9.open;P.JOURNAL.toggle=P.J9.toggle;if(P.JOURNAL.show)P.JOURNAL.show=P.J9.open}}catch(e){}
QM.subscribe(()=>{try{if(P.J9&&P.J9.isOpen()){P.J9.close();P.J9.open()}}catch(e){}});
function guard(){const h=$('p7q');if(!h||h._p10)return;h._p10=1;new MutationObserver(()=>{if(painting)return;const ours=!!h.querySelector('[data-p10]');if(!ours&&h.innerHTML){h._p10html=null;hud()}}).observe(h,{childList:true,subtree:true,characterData:true})}

/* ---- цикл синхронизации ---- */
setInterval(()=>{paintDate();guard();QM.refresh();hud()},400);
setTimeout(()=>{paintDate();guard();QM.refresh(true);hud()},50);
})();
