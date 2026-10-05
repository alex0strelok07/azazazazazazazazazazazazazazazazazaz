// game8a.js — этап 8 (часть 1): единая система времени и дней, заставка нового дня, часы в HUD,
// время суток на улицах, зависимость событий от времени (слишком рано / опоздал), связь с главами и CityState.
(function(){'use strict';
const P=window.P7;if(!P||!P.QUEST||!P.sf7)return;
const sf=P.sf7,QUEST=P.QUEST,CITY=P.CITY,$=x=>document.getElementById(x);
const MON=['ЯНВАРЯ','ФЕВРАЛЯ','МАРТА','АПРЕЛЯ','МАЯ','ИЮНЯ','ИЮЛЯ','АВГУСТА','СЕНТЯБРЯ','ОКТЯБРЯ','НОЯБРЯ','ДЕКАБРЯ'];
const WD=['ВОСКРЕСЕНЬЕ','ПОНЕДЕЛЬНИК','ВТОРНИК','СРЕДА','ЧЕТВЕРГ','ПЯТНИЦА','СУББОТА'];
const BASE=[1993,10,5]; // День 1 — 5 ноября 1993, пятница (как в прологе)
const DAYSTART=[0,494,510,495,540,480,555,520,500]; // начало дня по главам: 08:14, 08:30, 08:15, 09:00 ...
const SUB=['Обычное утро. Во дворе пахнет снегом и печным дымом.','В очередях говорят тише обычного. На столбах — новые листовки.','По улицам чаще проезжают патрули. Люди стараются не задерживаться.','Город будто затаил дыхание. На перекрёстках стоит техника.'];
const pm=t=>{const m=/(\d{1,2}):(\d{2})/.exec(t||'');return m?(+m[1])*60+(+m[2]):null};
const p2=n=>String(n).padStart(2,'0');
const curT=()=>{try{return currentTime}catch(e){return''}};
function T(){const s=sf();if(!s.tm||typeof s.tm.min!=='number'){const c=s.ch||1;s.tm={day:c,min:pm(curT())??494,chd:c,log:[]}}return s.tm}
function dt(day){const x=new Date(BASE[0],BASE[1],BASE[2]);x.setDate(x.getDate()+day-1);return{d:x.getDate(),mon:x.getMonth()+1,monName:MON[x.getMonth()],y:x.getFullYear(),wd:WD[x.getDay()]}}
function part(min){const h=Math.floor(min/60)%24;return h>=5&&h<12?'УТРО':h>=12&&h<17?'ДЕНЬ':h>=17&&h<23?'ВЕЧЕР':'НОЧЬ'}
const hhmm=m=>{m=m??T().min;return p2(Math.floor(m/60)%24)+':'+p2(m%60)};

/* ---------- стиль (тот же, что у меню паузы и заметок этапа 7) ---------- */
const st=document.createElement('style');st.textContent=`
#p8day{position:fixed;inset:0;z-index:9800;display:grid;place-content:center;text-align:center;background:#050606;color:#eee8d9;opacity:0;transition:opacity .7s ease;pointer-events:none}
#p8day.show{opacity:1;pointer-events:auto}#p8day .k{color:#d6b865;font:700 13px 'Courier New',monospace;letter-spacing:.3em}
#p8day .d{font:800 clamp(44px,6.5vw,86px) Georgia,serif;letter-spacing:.06em;margin:8px 0 2px}#p8day .dt{font:700 clamp(16px,1.6vw,22px) 'Courier New',monospace;letter-spacing:.16em;color:#e9e4dc}
#p8day .tm{font:700 clamp(30px,3.6vw,48px) 'Courier New',monospace;color:#d6b865;margin-top:18px}#p8day .pt{font:700 13px 'Courier New',monospace;letter-spacing:.4em;color:#a89b7c;margin-top:6px}
#p8day .sb{margin:26px auto 0;max-width:560px;padding-top:16px;border-top:1px solid #7d6c45;font:italic 17px Georgia,serif;color:#c8c1b0}
#p8big{position:fixed;left:50%;top:18%;transform:translateX(-50%);z-index:9500;text-align:center;padding:16px 34px;background:rgba(14,16,20,.92);border:1px solid #7d6c45;opacity:0;transition:opacity .8s;pointer-events:none}
#p8big.show{opacity:1}#p8big .tm{font:700 40px 'Courier New',monospace;color:#d6b865}#p8big .t{font:italic 17px Georgia,serif;color:#e9e4dc;margin-top:6px}
#p8sky{position:absolute;inset:0;z-index:1;pointer-events:none;transition:background 1.6s}
#p8gate{position:fixed;inset:0;z-index:9600;display:none;place-content:center;background:rgba(5,6,6,.55)}#p8gate.show{display:grid}
#p8gate .bx{min-width:min(520px,88vw);padding:26px 30px;background:rgba(14,16,20,.94);border:1px solid #7d6c45;text-align:center}
#p8gate .w{font:700 12px 'Courier New',monospace;color:#d6b865;letter-spacing:.18em}#p8gate .l{font:18px Georgia,serif;color:#eee8d9;margin:12px 0 18px}
#p8gate button{display:block;width:100%;margin:8px 0 0;padding:11px 14px;border:1px solid #7d6c45;background:#141713;color:#eee8d9;font:700 13px 'Courier New',monospace;letter-spacing:.06em;cursor:pointer}
#p8gate button:hover,#p8gate button:focus{background:#d6b865;color:#11130f;outline:none}
#time .p8h{color:#d6b865}`;document.head.appendChild(st);
const mk=(i,h)=>{let e=$(i);if(!e){e=document.createElement('div');e.id=i;if(h)e.innerHTML=h;document.body.appendChild(e)}return e};

/* ---------- блокировка ввода на время заставок ---------- */
window.addEventListener('keydown',e=>{if(P._p8block){e.stopImmediatePropagation();e.preventDefault()}},true);

/* ---------- HUD-часы ---------- */
function show(){const el=$('time');if(!el)return;const t=T(),d=dt(t.day);const html='ДЕНЬ '+t.day+' · '+d.d+' '+d.monName+' '+d.y+' · '+d.wd+' | <span class="p8h">'+hhmm()+'</span> · '+part(t.min);if(el.innerHTML!==html)el.innerHTML=html;sky()}
function sky(){const g=$('game');if(!g)return;let k=$('p8sky');if(!k){k=document.createElement('div');k.id='p8sky';const bg=$('bg');bg&&bg.nextSibling?g.insertBefore(k,bg.nextSibling):g.appendChild(k)}
 const p=part(T().min),bgc=p==='НОЧЬ'?'rgba(8,14,34,.42)':p==='ВЕЧЕР'?'rgba(70,38,12,.2)':p==='УТРО'?'rgba(150,160,175,.06)':'rgba(0,0,0,0)';if(k.style.background!==bgc)k.style.background=bgc;
 g.classList.toggle('p8night',p==='НОЧЬ');g.classList.toggle('p8evening',p==='ВЕЧЕР')}

/* ---------- ядро времени ---------- */
function busy(){try{return P.PAUSE.on||P.CUT.on||(P.STORY&&P.STORY.open)||P.titleOn7()}catch(e){return false}}
function add(n){const t=T();t.min=Math.max(0,Math.min(1439,t.min+Math.round(n||0)));try{currentTime=hhmm()}catch(e){}show()}
function to(target,nextDayOk){const t=T();if(target>t.min){t.min=target;try{currentTime=hhmm()}catch(e){}show();return true}if(nextDayOk){newDay(target,'Время прошло незаметно.');return true}return false}
function card(sub,done){const t=T(),d=dt(t.day),c=mk('p8day');
 c.innerHTML='<div class="k">ПАНЕЛЬ № 7</div><div class="d">ДЕНЬ '+t.day+'</div><div class="dt">'+d.d+' '+d.monName+' '+d.y+' · '+d.wd+'</div><div class="tm">'+hhmm()+'</div><div class="pt">'+part(t.min)+'</div>'+(sub?'<div class="sb">'+sub+'</div>':'');
 P._p8block=true;void c.offsetWidth;c.classList.add('show');clearTimeout(card._t);
 card._t=setTimeout(()=>{c.classList.remove('show');setTimeout(()=>{P._p8block=false;done&&done()},750)},3200)}
function big(time,txt,ms){const b=mk('p8big');b.innerHTML='<div class="tm">'+(time||hhmm())+'</div>'+(txt?'<div class="t">'+txt+'</div>':'');void b.offsetWidth;b.classList.add('show');clearTimeout(big._t);big._t=setTimeout(()=>b.classList.remove('show'),ms||3600)}
// Новый день: дата → мир (город, музыка, задания, отношения, дневные события) → заставка → управление
function newDay(start,sub,done){const s=sf(),t=T();t.day++;t.min=start??DAYSTART[Math.min(DAYSTART.length-1,t.day)]??500;
 try{P.S.day=t.day}catch(e){} // дневные события базовой игры (evCoin_<day> и т.п.) обновляются сами
 try{const w=P.WS7&&P.WS7();if(typeof s.bond==='number'&&w&&w.party==='both')s.bond+=1}catch(e){}
 t.log=(t.log||[]).slice(-30);t.log.push({day:t.day,ch:s.ch||1,city:CITY?CITY.state:0});
 try{CITY.sync()}catch(e){}try{P.applyCity7&&P.applyCity7()}catch(e){}try{QUEST.upd(true)}catch(e){}
 try{currentTime=hhmm()}catch(e){}show();P._p8day=1;
 card(sub||SUB[Math.max(0,Math.min(3,CITY?CITY.state:0))],()=>{try{P.save&&P.save()}catch(e){}done&&done()})}
// новая глава сюжета = новый день
function chapterDay(ch,done){const t=T();ch=ch||sf().ch||1;if(ch>(t.chd||1)){t.chd=ch;newDay(null,null,done);return true}return false}

/* ---------- render: время идёт от действий, без отката назад ---------- */
const O={};const keep=k=>{if(N[k]&&!O[k])O[k]={t:N[k].t,c:N[k].c}};
function byTime(){const h=Math.floor(T().min/60),night=h>=22||h<6,set=(k,t,c)=>{if(!N[k])return;keep(k);N[k].t=t??O[k].t;N[k].c=c===undefined?O[k].c:c};
 set('kiosk',night?'Киоск закрыт. За мутным стеклом темно, только кот спит на пачках газет.':null);
 set('shop',(h>=21||h<8)?'Магазин закрыт. На двери листок: «Работаем с 8 до 21».':null,(h>=21||h<8)?[['Отойти от двери','streetHub','←']]:undefined);
 set('pharmacy',(h>=20||h<8)?'Аптека закрыта. В окошке темно, только табличка «Ночной звонок».':null,(h>=20||h<8)?[['Отойти','streetHub','←']]:undefined);
 set('pharmacyAspirin',h>=13?'После обеда привезли аспирин. Фармацевт отсчитывает последнюю пачку.':null);
 set('courtyard',h>=17||h<7?'Во дворе пусто. Дети давно разошлись по домам, только качели скрипят на ветру.':null);
 set('busstop',night?'Последний автобус ушёл. До утра остановка будет пустой.':null)}
let ref=null;
if(typeof render==='function'){const _r=render;render=function(){try{byTime()}catch(e){}
 const out=_r.apply(this,arguments);
 try{if(P.PAUSE.on)return out;const t=T(),s=sf(),x=N[id]||{};
  if(ref!==t){ref=t;P._p8prev=id} // после загрузки — только синхронизация, без накрутки времени
  else if(id!==P._p8prev){P._p8prev=id;const nt=pm(x.time);
   if(id==='morning'&&t.min>=17*60)newDay(nt||507,'После долгой ночи — серое утро.');
   else if(nt!=null&&nt>t.min&&nt-t.min<420)t.min=nt;
   else t.min=Math.min(1439,t.min+(x.explore?4:1))}
  s.vis8=s.vis8||{};s.vis8[id]=Math.max(s.vis8[id]||0,s.ch||1);
  if(x.s&&!/^(Рассказчик|Новости)$/.test(x.s)){s.talk8=s.talk8||{};s.talk8[String(x.s).toLowerCase()]=1}
  currentTime=hhmm();show()}catch(e){}return out}}
if(typeof P.addMin==='function'){const _a=P.addMin;P.addMin=function(m){let r;try{r=_a.apply(this,arguments)}catch(e){}add(+m||0);return r}}

/* ---------- сюжетные сцены: новая глава → заставка дня → сцена; длинная сцена сдвигает время ---------- */
function names(o,acc,d){if(!o||d>4)return acc;if(Array.isArray(o)){o.forEach(v=>names(v,acc,d+1));return acc}if(typeof o==='object'){if(typeof o.name==='string')acc.push(o.name);else if(typeof o.who==='string')acc.push(o.who);for(const k in o)if(o[k]&&typeof o[k]==='object')names(o[k],acc,d+1)}return acc}
function lines(o){let n=0;(function w(v,d){if(!v||d>4)return;if(Array.isArray(v)){v.forEach(x=>{if(x&&typeof x==='object'&&typeof x.t==='string')n++;w(x,d+1)})}else if(typeof v==='object')for(const k in v)if(v[k]&&typeof v[k]==='object')w(v[k],d+1)})(o,0);return n}
if(P.STORY&&typeof P.STORY.play==='function'){const _p=P.STORY.play;P.STORY.play=function(ev,done){const self=this,a=arguments;
 try{const s=sf();s.talk8=s.talk8||{};names(ev,[],0).forEach(n=>{n=String(n).toLowerCase();if(n&&!/(рассказчик|narr)/.test(n))s.talk8[n]=1});
  const m=/^c(\d+)_/.exec(ev&&ev.id||'');add(Math.max(5,Math.min(90,lines(ev)*2)));
  if(m&&!P._p8block&&chapterDay(+m[1],()=>_p.apply(self,a)))return}catch(e){}
 return _p.apply(this,a)}}

/* ---------- время и сюжет: «слишком рано» / «опоздал» только для сюжетных встреч ---------- */
const F=()=>{const s=sf();return s.f||{}};
const GATES={
 alley:{need:()=>!F().alleyDone&&QUEST.isActive('Quest_05')&&QUEST.canFight('Quest_05'),from:17*60,late:23*60+30,
  early:'Ещё слишком рано. Лучше прийти вечером.',lateT:'Похоже, я опоздал. В переулке уже никого. Придётся прийти завтра вечером.'},
 dkSquare:{need:()=>QUEST.isActive('Quest_08')&&!F().squareDone,from:16*60+30,
  early:'Ещё слишком рано. Люди собираются на площади к вечеру.',bigT:'Через несколько часов всё изменится.'}};
function speaker(){try{const w=P.WS7&&P.WS7();return w&&w.active==='zhenya'?'ЖЕНЯ':'КИРИЛЛ'}catch(e){return'КИРИЛЛ'}}
function gatePanel(line,btns){const g=mk('p8gate','<div class="bx"><div class="w"></div><div class="l"></div><div class="b"></div></div>');
 g.querySelector('.w').textContent=speaker();g.querySelector('.l').textContent='«'+line+'»';const b=g.querySelector('.b');b.innerHTML='';
 btns.forEach(([t,f])=>{const e=document.createElement('button');e.textContent=t;e.onclick=ev=>{ev.stopPropagation();g.classList.remove('show');P._p8gate=0;f&&f()};b.appendChild(e)});
 g.classList.add('show');P._p8gate=1;setTimeout(()=>{const f=b.querySelector('button');f&&f.focus()},50)}
function gate(key,go){const G=GATES[key];if(!G||P._p8pass)return false;let need=false;try{need=G.need()}catch(e){}if(!need)return false;const t=T();
 const pass=()=>{P._p8pass=1;try{go()}finally{P._p8pass=0}};
 if(G.late&&t.min>=G.late){gatePanel(G.lateT,[['☾ ВЕРНУТЬСЯ ДОМОЙ И ДОЖДАТЬСЯ УТРА',()=>newDay(null,'Ночь прошла в тревожном полусне.')],['← УЙТИ',null]]);return true}
 if(t.min<G.from){gatePanel(G.early,[['◷ ПОДОЖДАТЬ ДО '+hhmm(G.from),()=>{to(G.from);if(G.bigT)big(hhmm(),G.bigT);setTimeout(pass,G.bigT?1400:200)}],['← УЙТИ',null]]);return true}
 if(G.bigT&&!sf()['big8_'+key]){sf()['big8_'+key]=1;big(hhmm(),G.bigT)}return false}
window.addEventListener('keydown',e=>{if(P._p8gate&&e.key==='Escape'){e.stopImmediatePropagation();e.preventDefault();$('p8gate').classList.remove('show');P._p8gate=0}else if(P._p8gate&&!/^(Enter|Tab|Space)$/.test(e.code)){e.stopImmediatePropagation();e.preventDefault()}},true);
if(typeof choose==='function'){const _c=choose;choose=function(key){const self=this,a=arguments;if(!busy()&&gate(key,()=>_c.apply(self,a)))return;return _c.apply(this,a)}}
if(typeof P.go==='function'){const _g=P.go;P.go=function(key){const self=this,a=arguments;if(typeof key==='string'&&!busy()&&gate(key,()=>_g.apply(self,a)))return;return _g.apply(this,a)}}

/* ---------- сохранение: время дублируется явно (основная копия — P.S.story.tm) ---------- */
if(typeof P.snap7==='function'){const _s=P.snap7;P.snap7=function(){const r=_s.apply(this,arguments);try{if(r&&typeof r==='object'){const i=TIME.info();r.time8=Object.assign({},i,{tm:JSON.parse(JSON.stringify(T()))})}}catch(e){}return r}}

/* ---------- цикл: синхронизация HUD, новая глава, длительные сцены ---------- */
setInterval(()=>{try{if(P.titleOn7())return;const t=T(),f=F();try{currentTime=hhmm()}catch(e){}show();try{if(P.S.day!==t.day)P.S.day=t.day}catch(e){}
 if(f.alleyDone&&!t.al){t.al=1;add(40)}if(f.squareDone&&!t.sq){t.sq=1;add(150)}
 if(!busy()&&!P._p8block&&!P._p8gate)chapterDay()}catch(e){}},1000);
// старт новой игры — заставка первого дня (один раз)
document.addEventListener('click',e=>{if(e.target&&e.target.id==='start'){setTimeout(()=>{const t=T();if(t.day===1&&!t.c1){t.c1=1;card('Ночь. Кирилл и Женя третий день не выходят из квартиры.')}},250)}},true);

const TIME={get day(){return T().day},get min(){return T().min},get h(){return Math.floor(T().min/60)},get m(){return T().min%60},get part(){return part(T().min)},
 info(){const t=T(),d=dt(t.day);return{day:t.day,date:d.d,month:d.mon,monthName:d.monName,year:d.y,weekday:d.wd,h:Math.floor(t.min/60),m:t.min%60,time:hhmm(),part:part(t.min)}},
 hhmm,add,to,newDay,chapterDay,card,big,show,state:T,GATES};
P.TIME=TIME;show();
})();
