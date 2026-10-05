// game8b.js — этап 8 (часть 2): журнал «Задания» (кнопка в интерфейсе, клавиша З/P и пункт меню ESC),
// этапы заданий с автоотметками, скрытие неизвестного, уведомление «НОВОЕ ЗАДАНИЕ», связь со временем и днями.
(function(){'use strict';
const P=window.P7;if(!P||!P.QUEST||!P.PAUSE||!P.TIME)return;
const sf=P.sf7,QUEST=P.QUEST,PAUSE=P.PAUSE,TIME=P.TIME,$=x=>document.getElementById(x);
const esc=t=>String(t??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* ---------- данные заданий (названия — как в списке заданий этапа 7) ---------- */
const s_=()=>sf(),f_=()=>s_().f||{};
const V=(k,c)=>((s_().vis8||{})[k]||0)>=(c||1);
const TK=n=>Object.keys(s_().talk8||{}).some(k=>k.indexOf(n)>=0);
const TC=()=>Object.keys(s_().talk8||{}).filter(k=>!/(кирилл|женя|рассказчик|новости)/.test(k)).length;
const CL=()=>{const c=s_().clues;return Array.isArray(c)?c.length:c&&typeof c==='object'?Object.keys(c).length:+c||0};
const CH=()=>s_().ch||1,DONE=q=>{try{return QUEST.isDone(q)}catch(e){return false}};
const party=()=>{try{const w=P.WS7&&P.WS7();return w&&w.party||'both'}catch(e){return'both'}};
const Y=()=>true;
const QD={
 Quest_01:{t:'Обычный день',d:'Пережить пятницу: прийти в себя после бессонной ночи и осмотреться.',w:['Квартира, двор и улица у дома',Y],who:['Женя, Кирилл',Y],what:'Осмотреться дома, выйти во двор и узнать, что нового на улице.',
  st:[['Осмотреться в квартире',()=>V('homeExplore')],['Посмотреть новости или выпить чаю',()=>V('tvSit')||V('tea')||V('newsEnd')],['Выйти на улицу',()=>V('streetHub')],['Зайти в магазин, аптеку или к киоску',()=>V('shop')||V('pharmacy')||V('kiosk')]]},
 Quest_02:{t:'Странные записки',d:'Кто-то подбрасывает записки. Нужно разобраться, кто и зачем.',w:['Подъезд и двор',Y],who:['Соседи',()=>TC()>0],what:'Расспросить соседей и собрать улики.',
  st:[['Прочитать записку',()=>CH()>=2],['Расспросить соседей',()=>TC()>=1],['Найти улики',()=>CL()>=1],['Сложить картину целиком',()=>DONE('Quest_02')]]},
 Quest_03:{t:'Кому верить',d:'У каждого в доме своя версия. Нужно решить, кому верить.',w:['Подъезд, двор',Y],who:['Вера и соседи',Y],what:'Поговорить с соседями и Верой, затем сделать выбор.',
  st:[['Поговорить с Верой',()=>TK('вера')],['Выслушать соседей',()=>TC()>=2],['Решить, кому верить',()=>DONE('Quest_03')]]},
 Quest_04:{t:'Встреча с Ромой',d:'Рома ждёт ответа.',w:['Двор и улица у дома',()=>TK('ром')],who:['Рома',()=>TK('ром')||CH()>=4],what:'Выслушать Рому и решить, что ему ответить.',
  st:[['Встретиться с Ромой',()=>TK('ром')],['Решить, что ответить',()=>DONE('Quest_04')]]},
 Quest_05:{t:'Ответ Роме',d:'Рома получил отказ. Разговор продолжится в переулке.',w:['Переулок — вечером',Y],who:['Рома и его люди (рядом должен быть Кирилл)',Y],what:'Прийти в переулок вечером и разобраться с людьми Ромы.',gate:'alley',
  st:[['Взять с собой Кирилла',()=>party()!=='zhenya'],['Дождаться вечера',()=>TIME.h>=17||!!f_().alleyDone],['Прийти в переулок',()=>V('alley',5)||!!f_().alleyDone],['Разобраться с людьми Ромы',()=>!!f_().alleyDone]]},
 Quest_06:{t:'Последствия',d:'После случившегося нужно узнать, что теперь будет с домом.',w:['Дом, подъезд',Y],who:['Соседи',Y],what:'Вернуться домой и узнать новости.',
  st:[['Вернуться домой',()=>V('homeExplore',5)],['Узнать, что будет с домом',()=>DONE('Quest_06')]]},
 Quest_07:{t:'Город на пределе',d:'С улицы доносятся сирены. Нужно увидеть своими глазами, что происходит.',w:['Улица у дома',Y],who:['—',Y],what:'Выйти на улицу и осмотреться.',
  st:[['Выйти на улицу',()=>V('streetHub',6)||!!f_().sawFinalStreet],['Увидеть, что стало с городом',()=>!!f_().sawFinalStreet]]},
 Quest_08:{t:'Площадь у ДК',d:'Весь город идёт к ДК. Надо быть там.',w:['Площадь у ДК (карта города — M), вечером',Y],who:['Кирилл и Женя — держаться вместе',Y],what:'Добраться до площади у ДК.',gate:'dkSquare',
  st:[['Открыть карту города',()=>V('cityMap',6)||V('dkSquare',6)],['Дождаться вечера',()=>TIME.min>=990||V('dkSquare',6)],['Добраться до площади у ДК',()=>V('dkSquare',6)],['Пережить этот вечер',()=>!!f_().squareDone]]},
 Quest_09:{t:'Финал',d:'Всё решается сейчас.',w:['Дом',Y],who:['Кирилл и Женя',Y],what:'Сделать последний выбор.',
  st:[['Сделать последний выбор',()=>!!s_().ending]]}};
const IDS=Object.keys(QD);

/* ---------- этапы: отметки «липкие» и хранятся в P.S.story.qs8 (попадают в сохранение) ---------- */
const ACT=q=>{try{return QUEST.isActive(q)}catch(e){return false}};
function steps(q,quiet){const s=s_(),d=QD[q];if(!d)return[];s.qs8=s.qs8||{};const m=s.qs8[q]=s.qs8[q]||{};const done=DONE(q);
 return d.st.map(([t,fn],i)=>{let ok=!!m[i]||done;if(!ok){try{ok=!!fn()}catch(e){}if(ok){m[i]=TIME.day+'|'+TIME.hhmm();if(!quiet&&ACT(q))tick(t)}}return{t,ok}})}
function cur(q){const a=steps(q,true);const i=a.findIndex(x=>!x.ok);return i<0?null:a[i].t}
function stamp(q){const s=s_();s.qd8=s.qd8||{};if(DONE(q)&&!s.qd8[q])s.qd8[q]={day:TIME.day,time:TIME.hhmm()};return s.qd8[q]}
/* ---------- стиль журнала (как меню паузы) ---------- */
const st=document.createElement('style');st.textContent=`
.p8qbtn{position:absolute;top:166px;right:30px;z-index:30;border:1px solid #7d6c45;background:#111411;color:#d8cfb6;padding:9px 12px;font:700 12px 'Courier New',monospace;cursor:pointer}
.p8qbtn:hover{background:#d6b865;color:#11130f}.p8qbtn.new::after{content:' ●';color:#d6b865}
.p8j{max-height:64vh;overflow:auto;text-align:left;padding-right:6px;margin:6px 0 10px}.p8j::-webkit-scrollbar{width:6px}.p8j::-webkit-scrollbar-thumb{background:#7d6c45}
.p8tabs{display:flex;gap:8px;margin:4px 0 12px}.p8tabs button{flex:1;margin:0!important}.p8tabs button.on{background:#d6b865!important;color:#11130f!important}
.p8q{border:1px solid #3a3426;background:rgba(20,23,19,.85);padding:14px 16px;margin-bottom:12px}.p8q.main{border-color:#7d6c45}
.p8q h3{margin:0 0 4px;font:700 18px Georgia,serif;color:#eee8d9}.p8q .ds{font:italic 14px Georgia,serif;color:#c8c1b0;margin-bottom:10px}
.p8q .r{font:13px 'Courier New',monospace;color:#d8cfb6;margin:3px 0}.p8q .r b{color:#d6b865;font-weight:700}.p8q .un{color:#7b7464;font-style:italic}
.p8q .ss{margin-top:10px;padding-top:8px;border-top:1px dashed #3a3426}.p8q .s{font:13px 'Courier New',monospace;color:#eee8d9;margin:4px 0}.p8q .s.ok{color:#8f9a7a}.p8q .s.ok em{color:#d6b865;font-style:normal;font-size:11px;margin-left:6px}
.p8q .stt{margin-top:8px;font:700 11px 'Courier New',monospace;letter-spacing:.14em;color:#a89b7c}
.p8d{font:13px 'Courier New',monospace;color:#8f9a7a;padding:7px 0;border-bottom:1px dashed #2c281e}.p8d b{color:#d8cfb6}.p8d span{float:right;color:#7b7464}
.p8e{font:italic 14px Georgia,serif;color:#7b7464;padding:12px 0}
#p8qn{position:fixed;right:30px;bottom:110px;z-index:9400;min-width:260px;padding:12px 18px;background:rgba(14,16,20,.92);border:1px solid #7d6c45;border-left:3px solid #d6b865;opacity:0;transform:translateX(20px);transition:.5s;pointer-events:none}
#p8qn.show{opacity:1;transform:none}#p8qn .k{font:700 11px 'Courier New',monospace;letter-spacing:.24em;color:#d6b865}#p8qn .t{font:17px Georgia,serif;color:#eee8d9;margin-top:4px}
#p7q .p8s{display:block;margin-top:4px;font:12px 'Courier New',monospace;color:#c8c1b0}`;document.head.appendChild(st);
/* ---------- уведомления (не блокируют игру) ---------- */
const Qn=[];function qn(k,t){Qn.push([k,t]);if(Qn.length===1)qrun()}
function qrun(){if(!Qn.length)return;let e=$('p8qn');if(!e){e=document.createElement('div');e.id='p8qn';document.body.appendChild(e)}const[k,t]=Qn[0];
 e.innerHTML='<div class="k">'+esc(k)+'</div><div class="t">'+esc(t)+'</div>';void e.offsetWidth;e.classList.add('show');
 setTimeout(()=>{e.classList.remove('show');setTimeout(()=>{Qn.shift();qrun()},550)},k==='ЭТАП ВЫПОЛНЕН'?2200:3500)}
function tick(t){qn('ЭТАП ВЫПОЛНЕН','☑ '+t)}
if(typeof P.note7==='function'){const _n=P.note7;P.note7=function(t,ms){const m=/^Новое задание:\s*(.+)$/.exec(t||''),d=/^Задание выполнено:\s*(.+)$/.exec(t||'');
 if(m){qn('НОВОЕ ЗАДАНИЕ',m[1]);const b=document.querySelector('.p8qbtn');b&&b.classList.add('new');if(/пределе/i.test(m[1]))setTimeout(()=>TIME.big(TIME.hhmm(),'Через несколько часов всё изменится.'),3800);return}
 if(d){qn('ЗАДАНИЕ ВЫПОЛНЕНО',d[1]);return}return _n.apply(this,arguments)}}

/* ---------- журнал ---------- */
let TAB='cur';
function knowRow(lbl,pair){let k=false;try{k=pair[1]()}catch(e){}return'<div class="r"><b>'+lbl+':</b> '+(k?esc(pair[0]):'<span class="un">пока неизвестно</span>')+'</div>'}
function status(q,a){const d=QD[q],n=a.filter(x=>x.ok).length;let t='В ПРОЦЕССЕ · '+n+' ИЗ '+a.length;
 try{const G=d.gate&&TIME.GATES[d.gate];if(G&&G.need()){if(G.late&&TIME.min>=G.late)t+=' · СЕГОДНЯ УЖЕ ПОЗДНО';else if(TIME.min<G.from)t+=' · ДОСТУПНО С '+TIME.hhmm(G.from)}}catch(e){}return t}
function cardQ(q,main){const d=QD[q],a=steps(q,true);let v=-1;a.some((x,i)=>{if(!x.ok){v=i;return true}return false});const shown=v<0?a:a.slice(0,v+1);
 return'<div class="p8q'+(main?' main':'')+'"><h3>Задание: «'+esc(d.t)+'»'+(main?'':' <span class="un" style="font-size:12px">(дополнительно)</span>')+'</h3><div class="ds">'+esc(d.d)+'</div>'+
 knowRow('Куда идти',d.w)+knowRow('С кем поговорить',d.who)+'<div class="r"><b>Что сделать:</b> '+esc(d.what)+'</div>'+
 '<div class="ss">'+shown.map(x=>'<div class="s'+(x.ok?' ok':'')+'">'+(x.ok?'☑ ':'☐ ')+esc(x.t)+(x.ok?'<em>Выполнено</em>':'')+'</div>').join('')+(v>=0&&v<a.length-1?'<div class="s un">…</div>':'')+'</div>'+
 '<div class="stt">'+status(q,a)+'</div></div>'}
function html(){const act=IDS.filter(q=>ACT(q)&&!DONE(q)),dn=IDS.filter(q=>DONE(q));let main=null;try{main=QUEST.main&&QUEST.main()}catch(e){}if(main&&main.id)main=main.id;
 act.sort((a,b)=>(b===main)-(a===main));const i=TIME.info();
 let h='<div class="r" style="font:12px Courier New,monospace;color:#a89b7c;margin-bottom:8px">ДЕНЬ '+i.day+' · '+i.date+' '+i.monthName+' · '+i.time+' · '+i.part+'</div>';
 h+='<div class="p8tabs"><button data-t="cur" class="'+(TAB==='cur'?'on':'')+'">ТЕКУЩИЕ ('+act.length+')</button><button data-t="done" class="'+(TAB==='done'?'on':'')+'">ВЫПОЛНЕННЫЕ ('+dn.length+')</button></div><div class="p8j">';
 if(TAB==='cur')h+=act.length?act.map(q=>cardQ(q,q===main||act.length===1)).join(''):'<div class="p8e">Сейчас нет активных заданий. Посмотрите, что происходит вокруг.</div>';
 else h+=dn.length?dn.map(q=>{const t=stamp(q);return'<div class="p8d">☑ <b>'+esc(QD[q].t)+'</b><span>'+(t?'День '+String(t.day)+' · '+t.time:'')+'</span></div>'}).join(''):'<div class="p8e">Пока ничего не завершено.</div>';
 return h+'</div>'}
function box(){const el=PAUSE.el||$('p7pause');return el&&(el.querySelector('.box')||el)}
function btnCls(){const b=box();const x=b&&b.querySelector('button:not(.p8x)');return x?x.className:''}
function drawJ(){const b=box();if(!b)return;const c=btnCls();PAUSE.view='quests';P._p8j=1;
 b.innerHTML='<h2>ЗАДАНИЯ</h2>'+html()+'<button class="'+c+' p8x p8back">← '+(P._p8direct?'ПРОДОЛЖИТЬ':'НАЗАД')+'</button>';
 b.querySelectorAll('.p8tabs button').forEach(e=>{e.className=c+' p8x'+(e.dataset.t===TAB?' on':'');e.onclick=ev=>{ev.stopPropagation();TAB=e.dataset.t;drawJ()}});
 b.querySelector('.p8back').onclick=ev=>{ev.stopPropagation();closeJ()};const qb=document.querySelector('.p8qbtn');qb&&qb.classList.remove('new')}
function closeJ(){P._p8j=0;if(P._p8direct){P._p8direct=0;try{PAUSE.close()}catch(e){}}else{try{PAUSE.build('main')}catch(e){}}}
function openJ(){if(P._p8block||P._p8gate)return;try{if(P.titleOn7())return}catch(e){}
 if(!PAUSE.on){P._p8direct=1;try{PAUSE.open()}catch(e){return}}TAB='cur';setTimeout(drawJ,0)}
/* ---------- встраивание в меню ESC ---------- */
function inject(){if(!PAUSE.on||P._p8j)return;const b=box();if(!b)return;const bs=[...b.querySelectorAll('button')];
 bs.forEach(e=>{if(/ВЫЙТИ В ГЛАВНОЕ МЕНЮ/i.test(e.textContent))e.textContent=e.textContent.replace(/ВЫЙТИ В ГЛАВНОЕ МЕНЮ/i,'ВЫЙТИ В МЕНЮ')});
 const cont=bs.find(e=>/ПРОДОЛЖИТЬ/i.test(e.textContent));if(!cont||b.querySelector('.p8inj'))return;
 const q=document.createElement('button');q.className=cont.className+' p8inj';q.textContent='ЗАДАНИЯ';q.onclick=ev=>{ev.stopPropagation();P._p8direct=0;TAB='cur';drawJ()};cont.after(q)}
new MutationObserver(()=>inject()).observe(document.body,{childList:true,subtree:true});
window.addEventListener('keydown',e=>{if(P._p8block||P._p8gate)return;
 if(PAUSE.on&&P._p8j&&e.key==='Escape'){e.stopImmediatePropagation();e.preventDefault();closeJ();return}
 if(e.code==='KeyP'&&!e.ctrlKey&&!e.metaKey&&!e.altKey){const t=e.target;if(t&&/^(INPUT|TEXTAREA)$/.test(t.tagName))return;
  e.stopImmediatePropagation();e.preventDefault();if(PAUSE.on&&P._p8j)closeJ();else if(!PAUSE.on&&!(P.STORY&&P.STORY.open)&&!(P.CUT&&P.CUT.on))openJ()}},true);
/* ---------- кнопка в игровом интерфейсе ---------- */
function mkBtn(){const g=$('game')||document.body;if(g.querySelector('.p8qbtn'))return;const b=document.createElement('button');b.className='p8qbtn';b.textContent='▤ ЗАДАНИЯ (P)';b.title='Журнал заданий';b.onclick=e=>{e.stopPropagation();openJ()};g.appendChild(b)}
/* ---------- следующий шаг под плашкой текущего задания ---------- */
function hudStep(){const h=$('p7q');if(!h)return;let m=null;try{m=QUEST.main&&QUEST.main()}catch(e){}if(m&&m.id)m=m.id;if(!m||!QD[m]){const a=IDS.filter(q=>ACT(q)&&!DONE(q));m=a[0]}
 const t=m&&cur(m),txt=t?'→ '+t:'';let e=h.querySelector('.p8s');if(!txt){e&&e.remove();return}if(!e){e=document.createElement('span');e.className='p8s';h.appendChild(e)}if(e.textContent!==txt)e.textContent=txt}
const ho=$('p7q');if(ho)new MutationObserver(()=>{if(!ho.querySelector('.p8s'))hudStep()}).observe(ho,{childList:true});
/* ---------- цикл: отметки этапов, открытый журнал, плашка ---------- */
let last='';setInterval(()=>{try{if(P.titleOn7())return;mkBtn();IDS.forEach(q=>{if(ACT(q)||DONE(q)){steps(q,P.PAUSE.on);stamp(q)}});hudStep();
 if(PAUSE.on&&P._p8j){const k=TAB+JSON.stringify(s_().qs8||{})+TIME.hhmm()+IDS.map(ACT).join();if(k!==last){last=k;const sc=box()&&box().querySelector('.p8j'),y=sc?sc.scrollTop:0;drawJ();const n=box().querySelector('.p8j');if(n)n.scrollTop=y}}
 if(!PAUSE.on)P._p8j=0}catch(e){}},1000);
P.JOURNAL={open:openJ,close:closeJ,draw:drawJ,steps,cur,QD};
})();
