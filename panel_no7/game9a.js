/* Панель № 7 — этап 9 (a): единый календарь, СОН = единственный переход на новый день, движок ежедневных заданий.
   Дополняет этапы 1–8 и ничего в них не удаляет. Данные заданий: game9b.js, game9b2.js, game9b3.js. Журнал и кнопки: game9c.js. */
(function(){'use strict';
const P=window.P7;if(!P||!P.TIME||!P.sf7)return;
const $=x=>document.getElementById(x),sf=P.sf7,TM=P.TIME;
const MON=['ЯНВАРЯ','ФЕВРАЛЯ','МАРТА','АПРЕЛЯ','МАЯ','ИЮНЯ','ИЮЛЯ','АВГУСТА','СЕНТЯБРЯ','ОКТЯБРЯ','НОЯБРЯ','ДЕКАБРЯ'];
const WD=['ВОСКРЕСЕНЬЕ','ПОНЕДЕЛЬНИК','ВТОРНИК','СРЕДА','ЧЕТВЕРГ','ПЯТНИЦА','СУББОТА'];
const BASE=[1993,10,5],FINAL_DAY=8,MORNING=8*60;
const p2=n=>String(n).padStart(2,'0'),hm=m=>p2(Math.floor(m/60)%24)+':'+p2(m%60);

/* ---------- календарь: день → число, месяц, год, день недели (через Date, поэтому переход месяца/года всегда верный) ---------- */
function T(){const t=TM.state();
 // день меняет только сон: блокируем старую смену дня «по главам» этапа 8
 if(t&&!t._l9){try{Object.defineProperty(t,'chd',{get:()=>9999,set(){},enumerable:true,configurable:true});Object.defineProperty(t,'_l9',{value:1,configurable:true})}catch(e){}}return t}
function date(day){const x=new Date(BASE[0],BASE[1],BASE[2]+day-1);return{d:x.getDate(),m:x.getMonth()+1,mon:MON[x.getMonth()],y:x.getFullYear(),wd:WD[x.getDay()]}}
function part(min){const h=Math.floor(min/60);return h>=5&&h<12?'УТРО':h>=12&&h<17?'ДЕНЬ':h>=17&&h<23?'ВЕЧЕР':'НОЧЬ'}
function cal(){const t=T(),d=date(t.day);return Object.assign({day:t.day,h:Math.floor(t.min/60),mi:t.min%60,min:t.min,time:hm(t.min),part:part(t.min)},d)}

/* ---------- состояние этапа 9 (лежит в сохранении вместе с сюжетом) ---------- */
function Q(){const s=sf();let q=s.q9;if(!q||q.v!==1){const t=T();q=s.q9={v:1,day:t.day||1,lastMin:t.min,st:{},f:{},rel:{},loc:{},seen:{},dec:[],warn:{},fin:null,city:0,first:(t.day>1||t.min>=300)?1:0}}return q}
const QS=[],EFF={},DAYS={},AMB={},L9={
 market9:{x:40,y:76,n:'Дорога к рынку',r:'РЫНОК',sc:'busstop'},
 school9:{x:60,y:86,n:'Школа № 12',r:'ШКОЛА',sc:'street'},
 garages9:{x:88,y:84,n:'Гаражи · мастерская',r:'ГАРАЖИ',sc:'street'},
 post9:{x:26,y:66,n:'Почта · редакция',r:'ПОЧТА',sc:'street'},
 boiler9:{x:6,y:84,n:'Котельная',r:'КОТЕЛЬНАЯ',sc:'busstop'}};
const st=id=>{const s=Q().st[id];return s?s.s:null};
const who={'К':['Кирилл','kirill'],'Ж':['Женя','zhenya'],'Р':['Рассказчик','none']},emo={'~':'worried','!':'determined','^':'afraid','*':'angry'};
function parse(ln){const m=/^([^|]{1,24})\|([\s\S]*)$/.exec(ln||'');let s='Рассказчик',w='none',e='neutral',t=ln||'';
 if(m){let k=m[1];t=m[2];const last=k.slice(-1);if(emo[last]){e=emo[last];k=k.slice(0,-1)}if(who[k]){s=who[k][0];w=who[k][1]}else s=k}return{s,w,e,t}}
const back=o=>o.home?'homeExplore':'streetHub';
// сцена: цепочка реплик → (выборы | возврат). Конец сцены даёт событие «e:ключ».
function scene(key,o,lines,ch){o=o||{};const n=lines.length;
 lines.forEach((ln,i)=>{const k=i?key+'_'+i:key,x={room:o.r||(o.home?'ГОСТИНАЯ':'УЛИЦА'),scene:o.sc,w:'none',q9:key};
  if(typeof ln==='function')x.v9=ln;else Object.assign(x,parse(ln));
  if(i<n-1)x.next=key+'_'+(i+1);else{x.end9=key;
   if(ch)x.c=ch.map(c=>{if(c[3])EFF[c[1]]=c[3];if(c[4])EFF['?'+c[1]]=c[4];return[c[0],c[1]||back(o),c[2]||'→']});else x.next=o.next||back(o)}
  N[k]=x})}
function defQ(o){o.s=o.s||[];QS.push(o);return o}

/* ---------- условия: v: посещён узел, c: выбор, e: сцена завершена, f: флаг, q:/qf:/qr: задание, t:/tb: время, h — дома, r:имя>N, d: день ---------- */
function isHome(){try{const x=N[id]||{};return x.map==='home'||['ГОСТИНАЯ','СПАЛЬНЯ','ПРИХОЖАЯ'].includes(x.room||'ГОСТИНАЯ')&&!x.explore||x.map==='home'}catch(e){return false}}
function atom(p,ev){let neg=p[0]==='!';if(neg)p=p.slice(1);const r=atom0(p,ev);return neg?!r:r}
function atom0(p,ev){const i=p.indexOf(':'),k=i<0?p:p.slice(0,i),v=i<0?'':p.slice(i+1),q=Q(),t=T();
 switch(k){case'v':case'c':case'e':return!!ev&&ev.t===k&&v.split('|').includes(ev.v);
  case'f':return v.split('|').some(x=>!!q.f[x]);case'q':return st(v)==='d';case'qf':return st(v)==='f';case'qr':return st(v)==='d'||st(v)==='f';
  case't':return t.min>=+v;case'tb':return t.min<+v;case'd':return t.day>=+v;case'h':return isHome();
  case'r':{const a=v.split('>');return(q.rel[a[0]]||0)>+a[1]}case'i':try{return!!(P.has&&P.has(v))}catch(e){return false}}return false}
function has(c,ev){if(!c)return true;return String(c).split('&').every(p=>atom(p.trim(),ev))}
function cond(sp){if(sp.c)return sp.c;if(sp.go)return'e:'+[sp.go,sp.late].filter(Boolean).join('|');return''}

/* ---------- последствия: f:флаг u:снять r:имя+N o:локация t:минуты city:+N ---------- */
function apply(str){if(!str)return;const q=Q();String(str).split(';').forEach(p=>{p=p.trim();if(!p)return;const i=p.indexOf(':'),k=p.slice(0,i),v=p.slice(i+1);
 if(k==='f')q.f[v]=1;else if(k==='u')delete q.f[v];
 else if(k==='r'){const m=/^(\w+)([+-]\d+)$/.exec(v);if(m){q.rel[m[1]]=(q.rel[m[1]]||0)+ +m[2];if(m[1]==='zhenya')try{const s=sf();if(typeof s.bond==='number')s.bond+= +m[2]}catch(e){}}}
 else if(k==='o')openLoc(v);else if(k==='t')TM.add(+v);else if(k==='city')q.city=(q.city||0)+ +v})}
function openLoc(v){if(!L9[v])return;Q().loc[v]=1;ensureHot()}
function ensureHot(){try{const q=Q();let ch=false;Object.keys(q.loc).forEach(k=>{if(L9[k]&&!HOT.some(h=>h.id===k)){HOT.push({id:k,x:L9[k].x,y:L9[k].y,n:L9[k].n});ch=true}});
 if(ch){const ex=$('explore');if(ex)ex.dataset.map='';if(N[id]&&N[id].explore&&N[id].map!=='home')drawMini()}}catch(e){}}
// узлы новых локаций (если там сейчас нет сюжетной сцены — фоновые реплики по дням)
Object.keys(L9).forEach(k=>{const L=L9[k];N[k]={room:L.r,scene:L.sc,s:'Рассказчик',w:'none',t:'',next:'streetHub',amb9:k}});

/* ---------- жизненный цикл заданий ---------- */
let quiet=null;
function say(t){if(quiet){quiet.push(t);return}try{P.note7?P.note7(t):0}catch(e){}}
function toast(t,ms){let e=$('p9toast');if(!e){e=document.createElement('div');e.id='p9toast';document.body.appendChild(e)}e.textContent=t;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),ms||3200)}
function finish(q,res,why){const S=Q().st[q.id];if(!S||S.s!=='a')return;S.s=res;S.end=T().day;S.at=hm(T().min);if(why)S.why=why;
 apply(res==='d'?q.fx:q.ffx);say((res==='d'?'Задание выполнено: ':'Задание провалено: ')+q.n)}
function activate(){const q=Q(),t=T();if(q.fin)return;QS.forEach(o=>{if(q.st[o.id])return;const last=o.e==='keep'?(o.to||o.day):o.day;
 if(t.day<o.day||t.day>last)return;if(!has(o.req||'',null))return;q.st[o.id]={s:'a',k:0,day:t.day,vs:[]};say('Новое задание: '+o.n)})}
function check(ev){const q=Q(),t=T();
 QS.forEach(o=>{const S=q.st[o.id];if(!S||S.s!=='a')return;let e=ev,n=0;
  while(S.s==='a'&&n++<12){const sp=o.s[S.k];if(!sp){finish(o,'d');break}const c=cond(sp);let ok;
   if(c.startsWith('n:')){const a=c.split(':');S.vs=S.vs||[];if(e&&e.t==='v'&&a[2].split('|').includes(e.v)&&!S.vs.includes(e.v))S.vs.push(e.v);ok=S.vs.length>=+a[1]}else ok=has(c,e);
   if(!ok)break;S.k++;e=null;if(S.k>=o.s.length)finish(o,'d');else say('Этап: ☑ '+sp.t)}
  if(S.s==='a'&&o.dl&&t.min>=o.dl)finish(o,'f','Не успели до '+hm(o.dl))});
 activate()}
function ev(t,v){try{check({t,v})}catch(e){console.warn('q9',e)}}
const order=()=>QS.filter(o=>o.k==='main').concat(QS.filter(o=>o.k!=='main'));
function cur(o){const S=Q().st[o.id];return S&&S.s==='a'?o.s[S.k]:null}
function targets(){const r={};QS.forEach(o=>{const sp=cur(o);if(sp&&sp.at)sp.at.split('|').forEach(a=>{if(!r[a]||o.k==='main')r[a]=o.k})});return r}
// сюжетная сцена вместо обычного посещения места + проверка времени встречи
function redirect(key){const t=T();for(const o of order()){const sp=cur(o);if(!sp||!sp.at||!sp.go||!sp.at.split('|').includes(key))continue;
 if(sp.need&&!has(sp.need,null))continue;
 if(sp.tm){if(t.min<sp.tm[0]){toast('«'+o.n+'»: похоже, мы пришли слишком рано. Встреча в '+hm(sp.tm[0])+'.');continue}
  if(t.min>sp.tm[1]){if(sp.late)return sp.late;finish(o,'f','Опоздали: встреча была в '+hm(sp.tm[0]));continue}}
 return sp.go}return null}
const mainLeft=()=>QS.filter(o=>o.k==='main'&&st(o.id)==='a');
function canSleep(){const t=T();if(t.day>=FINAL_DAY&&st('d8_final')!=='d')return false;return t.min<300||t.min>=18*60||!mainLeft().length}

/* ---------- сон: единственный способ начать новый день ---------- */
let sleeping=0;
function rollover(){const q=Q(),nd=T().day+1;QS.forEach(o=>{const S=q.st[o.id];if(!S||S.s!=='a')return;if(o.e==='keep'&&nd<=(o.to||o.day))return;
 if(o.e==='auto')finish(o,'d',o.auto||'Завершилось само собой по ходу событий');else finish(o,'f',o.why||'День закончился — шанс упущен')})}
function el(idn,html){let e=$(idn);if(!e){e=document.createElement('div');e.id=idn;document.body.appendChild(e)}if(html!=null)e.innerHTML=html;return e}
function morningCard(sub,done){const c=cal(),e=el('p9card','<div class=k>ПАНЕЛЬ № 7</div><div class=d>ДЕНЬ '+c.day+'</div><div class=dt>'+c.d+' '+c.mon+' '+c.y+'</div><div class=wd>'+c.wd+'</div><div class=tm>'+hm(MORNING)+'</div><div class=pt>УТРО</div>'+(sub?'<div class=sb>'+sub+'</div>':''));
 e.className='show';setTimeout(()=>e.classList.add('p2'),1500);setTimeout(()=>{e.classList.add('out');setTimeout(()=>{e.className='';done&&done()},800)},4600)}
function doSleep(){if(sleeping)return;if(T().day>=FINAL_DAY&&st('d8_final')!=='d'){toast('Сегодня не до сна — всё решится у котельной.');return}sleeping=1;P._p8block=true;const q=Q(),t=T(),c0=cal(),first=!q.first&&t.min<300;
 const f=el('p9fade','<div class=m>☾</div><div class=l>ДЕНЬ '+c0.day+' · '+c0.d+' '+c0.mon+' · '+c0.time+'</div><div class=s>Кирилл и Женя засыпают. День заканчивается.</div><div class=r></div>');
 f.className='show';
 setTimeout(()=>{quiet=[];if(!first)rollover();const sum=quiet.filter(x=>/^Задание/.test(x)).map(x=>x.replace('Задание выполнено: ','☑ ').replace('Задание провалено: ','✕ '));quiet=null;
  if(sum.length)f.querySelector('.r').innerHTML='<b>ИТОГИ ДНЯ</b><br>'+sum.join('<br>')}, 1100);
 setTimeout(()=>{if(first)q.first=1;else{t.day++;}t.min=MORNING;q.day=t.day;q.lastMin=MORNING;q.warn={};
  try{P.S.day=t.day}catch(e){}try{P.CITY&&P.CITY.sync&&P.CITY.sync()}catch(e){}try{P.applyCity7&&P.applyCity7()}catch(e){}try{P.QUEST&&P.QUEST.upd&&P.QUEST.upd(true)}catch(e){}
  try{if(typeof home==='object'&&home)home.party='both'}catch(e){}
  quiet=[];activate();const fresh=quiet.slice();quiet=null;document.body.dataset.day9=t.day;
  id='wake9';try{render()}catch(e){}t.min=MORNING;try{currentTime=hm(MORNING);TM.show()}catch(e){}
  morningCard((DAYS[t.day]||{}).sub,()=>{P._p8block=false;sleeping=0;fresh.forEach(say);try{P.save&&P.save()}catch(e){}});
  setTimeout(()=>f.className='',300)},sumDelay());
 function sumDelay(){return 3600}}

/* ---------- узлы сна ---------- */
N.sleep9n={room:'СПАЛЬНЯ',scene:'sleep',s:'Рассказчик',w:'none',t:'Женя забирается под одеяло, Кирилл выключает свет и ложится на матрас. За окном гаснут окна соседних домов.',c:[]};
N.sleepNo9={room:'СПАЛЬНЯ',scene:'sleep',s:'Женя',w:'zhenya',e:'worried',t:'',v9:()=>'Ж~|Спать ещё рано — только '+hm(T().min)+'. Сегодня не закончены дела: '+mainLeft().map(o=>'«'+o.n+'»').join(', ')+'. Лечь можно с 18:00 или когда главное сделано.',
 c:[['Отдохнуть до вечера (18:00)','rest9','◷'],['Вернуться в квартиру','homeExplore','←']]};
N.rest9n={room:'СПАЛЬНЯ',scene:'sleep',s:'Рассказчик',w:'none',t:'Они дремлют под бормотание радио. Когда же встают — за окном уже синие сумерки.',next:'bedroom'};
N.wake9={room:'СПАЛЬНЯ',scene:'sleep',s:'Женя',w:'zhenya',t:'',v9:()=>(DAYS[T().day]||{}).wake||'Ж|Утро. Новый день — новые дела.',next:'homeExplore'};

/* ---------- встраивание в choose / render / drawMini (поверх этапов 1–8) ---------- */
const B0=N.bedroom&&Array.isArray(N.bedroom.c)?N.bedroom.c.slice():[['Вернуться','homeExplore','←']];
function bedroomC(){const t=T(),c=[['Лечь спать — закончить день','sleep9','☾']];if(t.min>=300&&t.min<18*60)c.push(['Отдохнуть до вечера (18:00)','rest9','◷']);
 N.bedroom.c=c.concat(B0.filter(x=>x[1]!=='sleepMorning'))}
function amb(k){const A=AMB[k]||{};let d=T().day;while(d>0&&!A[d])d--;return A[d]||'Здесь тихо. Никого знакомого.'}
const _c=choose;
choose=function(key,label,icon){if(sleeping)return;try{
 if(key==='sleepMorning'||key==='sleep9'){if(!canSleep())return _c.call(this,'sleepNo9',label,icon);ev('c','sleep9');const r=_c.call(this,'sleep9n',label,icon);setTimeout(doSleep,1700);return r}
 if(key==='rest9'){const t=T();if(t.min<18*60){try{TM.to(18*60)}catch(e){t.min=18*60}}return _c.call(this,'rest9n',label,icon)}
 const r=redirect(key);if(r)key=r;
 if(EFF[key]){apply(EFF[key]);const q=Q();q.dec.push({d:T().day,t:hm(T().min),l:EFF['?'+key]||label||key});if(q.dec.length>80)q.dec.shift()}
 ev('c',key)}catch(e){console.warn('q9',e)}return _c.call(this,key,label,icon)};
const _r=render;
render=function(){try{const x=N[id];if(x){if(id==='bedroom')bedroomC();if(x.v9){const p=parse(x.v9(Q()));x.s=p.s;x.w=p.w;x.e=p.e;x.t=p.t}if(x.amb9)x.t=amb(x.amb9)}}catch(e){}
 const r=_r.apply(this,arguments);
 try{const x=N[id]||{};if(x.q9)Q().seen[x.q9]=T().day;ev('v',id);if(x.end9)ev('e',x.end9);marks()}catch(e){}return r};
function hsKey(h){if(h.dataset.id)return h.dataset.id;const tx=(h.title||h.textContent||'').trim();const all=(typeof HOT!=='undefined'?HOT:[]).concat(typeof HOT_HOME!=='undefined'?HOT_HOME:[]);const f=all.find(x=>x.n&&tx.indexOf(x.n)>=0);return f?f.id:''}
function marks(){const tg=targets();document.querySelectorAll('.hotspot').forEach(h=>{const k=hsKey(h);h.classList.toggle('q9t',!!tg[k]);h.classList.toggle('q9s',!!tg[k]&&tg[k]!=='main')})}
if(typeof drawMini==='function'){const _d=drawMini;drawMini=function(){const r=_d.apply(this,arguments);try{marks()}catch(e){}return r}}

/* ---------- фоновая проверка: время, условия, защита от «смены дня без сна» ---------- */
let lastS=null;
function tick(){try{const s=sf();if(s!==lastS){lastS=s;Q();ensureHot()}const t=T(),q=Q();document.body.dataset.day9=t.day;
 if(sleeping)return;
 if(t.day!==q.day){if(t.day>q.day){t.day=q.day;t.min=q.lastMin;try{P.S.day=q.day}catch(e){}const c=$('p8day');if(c)c.className='';try{TM.show()}catch(e){}}else q.day=t.day}
 q.lastMin=t.min;try{if(P.titleOn7&&P.titleOn7())return}catch(e){}
 check(null);
 QS.forEach(o=>{const sp=cur(o);if(sp&&sp.tm&&!q.warn[o.id]&&t.min>=sp.tm[0]-30&&t.min<sp.tm[0]){q.warn[o.id]=1;toast('◷ Скоро встреча «'+o.n+'» — в '+hm(sp.tm[0])+', '+(o.w||''),4200)}});
 if(t.min>=22*60&&!q.warn._late){q.warn._late=1;toast('Уже поздно. Пора домой — лечь спать в спальне. Новый день начнётся только после сна.',5000)}
 q.cal=(()=>{const c=cal();return{day:c.day,d:c.d,m:c.m,mon:c.mon,y:c.y,wd:c.wd,time:c.time,part:c.part}})()}catch(e){console.warn('q9 tick',e)}}
setInterval(tick,400);
if(typeof P.snap7==='function'){const _s=P.snap7;P.snap7=function(){const r=_s.apply(this,arguments);try{r.q9=JSON.parse(JSON.stringify(Q()));r.cal9=cal()}catch(e){}return r}}

const css=document.createElement('style');css.textContent=`
#p9fade,#p9card{position:fixed;inset:0;z-index:9000;background:#07080a;color:#eee8d9;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .9s;font-family:'Courier New',monospace;text-align:center}
#p9fade.show,#p9card.show{opacity:1;pointer-events:auto}#p9card.out{opacity:0;pointer-events:none!important}
#p9fade .m{font-size:46px;color:#d6b865;margin-bottom:14px}#p9fade .l{letter-spacing:4px;font-size:15px;color:#d8cfb6}#p9fade .s{margin-top:10px;font-family:Georgia,serif;font-style:italic;color:#9c917a}
#p9fade .r{margin-top:22px;font-size:13px;line-height:1.8;color:#d8cfb6;max-width:520px}#p9fade .r b{color:#d6b865;letter-spacing:3px}
#p9card .k{font-size:11px;letter-spacing:6px;color:#7d6c45;margin-bottom:22px}#p9card .d{font-size:46px;letter-spacing:10px;color:#d6b865}
#p9card .dt{font-size:20px;letter-spacing:6px;margin-top:10px}#p9card .wd{font-size:16px;letter-spacing:8px;color:#d8cfb6;margin-top:6px}
#p9card .tm{font-size:30px;letter-spacing:6px;margin-top:18px}#p9card .pt{font-size:22px;letter-spacing:14px;color:#d6b865;margin-top:22px;opacity:0;transform:translateY(8px);transition:all .9s}
#p9card.p2 .pt{opacity:1;transform:none}#p9card .sb{margin-top:16px;font-family:Georgia,serif;font-style:italic;color:#9c917a;max-width:560px;opacity:0;transition:opacity 1s .4s}#p9card.p2 .sb{opacity:1}
#p9toast{position:fixed;left:50%;top:84px;transform:translate(-50%,-10px);z-index:8000;background:rgba(14,16,20,.94);border:1px solid #7d6c45;color:#eee8d9;padding:10px 18px;font:13px 'Courier New',monospace;max-width:80vw;opacity:0;pointer-events:none;transition:all .4s}
#p9toast.show{opacity:1;transform:translate(-50%,0)}
.hotspot.q9t{opacity:1!important;filter:none!important;box-shadow:0 0 0 2px #d6b865,0 0 14px rgba(214,184,101,.7)!important}
.hotspot.q9t::before{content:'!';position:absolute;top:-9px;right:-9px;width:16px;height:16px;border-radius:50%;background:#d6b865;color:#141713;font:bold 12px/16px 'Courier New';text-align:center;z-index:2}
.hotspot.q9s{box-shadow:0 0 0 2px #8fb0a0,0 0 12px rgba(143,176,160,.6)!important}.hotspot.q9s::before{background:#8fb0a0}`;
document.head.appendChild(css);
P.Q9={defQ,scene,DAYS,AMB,L9,EFF,QS,Q,T,cal,date,hm,has,apply,finish,check,activate,st,cur,cond,targets,openLoc,sleep:doSleep,canSleep,mainLeft,FINAL_DAY,toast,parse,ev,morningCard,isSleeping:()=>!!sleeping};
})();
