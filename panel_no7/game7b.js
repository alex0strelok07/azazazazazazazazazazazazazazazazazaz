// game7b.js — этап 7: улица по стадиям CityState (мусор, повреждения, закрытые места, перекрытия), разговоры, техника по маршрутам.
(function(){'use strict';
const P=window.P7;if(!P||!P.CITY||!P.QUEST)return;
const $=i=>document.getElementById(i);
const CITY=P.CITY,QUEST=P.QUEST,sf=P.sf7,WS=P.WS7;
const X=()=>{try{return N[id]||{}}catch(e){return{}}};
const onStreet=()=>{const x=X();return!!(x.explore&&x.map==='street')&&!P.titleOn7()};
const paused=()=>P.PAUSE.on||P.CUT.on;

/* ---------- слой состояния улицы ---------- */
const rnd=seed=>{let r=seed;return()=>{r=(r*9301+49297)%233280;return r/233280}};
const LIT=(()=>{const r=rnd(77),a=[];for(let i=0;i<44;i++)a.push({x:2+r()*94,y:37+r()*58,k:Math.floor(r()*4),a:r()*6.28,s:.6+r()*.8});return a})();
let cv=null,key='';
function layer(){const w=$('world');if(!w)return null;if(!cv||!cv.isConnected){cv=document.createElement('canvas');cv.id='p7city';cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3';w.appendChild(cv);key=''}return cv}
function draw(L){const c=layer();if(!c)return;const W=c.clientWidth||960,H=c.clientHeight||540;const k=Math.round(L*20)+'|'+W+'x'+H;if(k===key)return;key=k;c.width=W;c.height=H;const g=c.getContext('2d');g.clearRect(0,0,W,H);if(L<=0.05)return;
 const px=x=>x/100*W,py=y=>y/100*H,u=Math.min(W,H)/100;
 g.fillStyle=`rgba(28,30,38,${.07*L})`;g.fillRect(0,0,W,H);
 const n=Math.round(LIT.length*Math.min(1,L/3));
 for(let i=0;i<n;i++){const o=LIT[i];g.save();g.translate(px(o.x),py(o.y));g.rotate(o.a);g.scale(o.s,o.s);g.strokeStyle='#1b1e22';g.lineWidth=.5;
  if(o.k===0){g.fillStyle='#e8e4d8';g.fillRect(-1.6*u,-1*u,3.2*u,2*u);g.strokeRect(-1.6*u,-1*u,3.2*u,2*u)}
  else if(o.k===1){g.fillStyle='#3f6b3a';g.fillRect(-1.4*u,-.4*u,2.8*u,.8*u);g.fillRect(1.4*u,-.25*u,.6*u,.5*u)}
  else if(o.k===2){g.fillStyle='#2a2b30';g.beginPath();g.ellipse(0,0,1.6*u,1.1*u,0,0,7);g.fill()}
  else{g.fillStyle='#d9c27a';g.fillRect(-1.3*u,-1.6*u,2.6*u,3.2*u);g.fillStyle='#6d5a2a';for(let j=0;j<3;j++)g.fillRect(-.9*u,(-1+j*.8)*u,1.8*u,.25*u)}
  g.restore()}
 if(L>=1.4){const a=Math.min(1,(L-1.4)/1.2);g.strokeStyle=`rgba(20,20,24,${.7*a})`;g.lineWidth=Math.max(1,u*.25);[[8,6,14,14,11,22],[30,4,27,12,33,19],[46,10,52,18,49,28]].forEach(p=>{g.beginPath();g.moveTo(px(p[0]),py(p[1]));g.lineTo(px(p[2]),py(p[3]));g.lineTo(px(p[4]),py(p[5]));g.stroke()});
  g.font=`bold ${3*u}px 'Courier New',monospace`;g.fillStyle=`rgba(170,40,40,${.75*a})`;g.save();g.translate(px(60),py(9));g.rotate(-.05);g.fillText('НЕТ СНОСУ!',0,0);g.restore()}
 if(L>=2){const a=Math.min(1,(L-2)/.6);g.globalAlpha=a;
  [[10,18],[30,18],[44,6]].forEach(p=>{g.fillStyle='#7a5a36';g.strokeStyle='#1b1e22';g.lineWidth=1;for(let j=0;j<3;j++){g.fillRect(px(p[0]),py(p[1]+j*1.6),px(7),py(1.2));g.strokeRect(px(p[0]),py(p[1]+j*1.6),px(7),py(1.2))}});
  g.fillStyle='rgba(40,42,46,.92)';g.fillRect(px(75.5),py(16),px(8),py(11));g.fillStyle='#e8e4d8';g.fillRect(px(76.5),py(19.5),px(6),py(3));g.fillStyle='#8a1f1f';g.font=`bold ${1.9*u}px 'Courier New',monospace`;g.fillText('ЗАКРЫТО',px(76.8),py(21.9));
  g.strokeStyle='#d6b03a';g.lineWidth=u*.6;g.beginPath();g.moveTo(px(58),py(16));g.lineTo(px(64),py(29));g.moveTo(px(64),py(16));g.lineTo(px(58),py(29));g.stroke();g.globalAlpha=1}
 if(L>=2.5){g.font=`bold ${2.6*u}px 'Courier New',monospace`;g.fillStyle='rgba(230,230,230,.75)';g.fillText('ВСЕ НА ПЛОЩАДЬ У ДК',px(8),py(31));
  const sm=g.createRadialGradient(px(88),py(0),0,px(88),py(0),px(40));sm.addColorStop(0,'rgba(90,90,95,.35)');sm.addColorStop(1,'rgba(90,90,95,0)');g.fillStyle=sm;g.fillRect(0,0,W,H)}
 if(L>=3){for(let j=0;j<6;j++){g.fillStyle=j%2?'#e8e4d8':'#b52a24';g.fillRect(px(65.8+j*1.4),py(57.5),px(1.4),py(3))}g.strokeStyle='#1b1e22';g.lineWidth=1;g.strokeRect(px(65.8),py(57.5),px(8.4),py(3));
  g.fillStyle='#e8e4d8';g.fillRect(px(66.5),py(53.5),px(7),py(3));g.fillStyle='#8a1f1f';g.font=`bold ${1.5*u}px 'Courier New',monospace`;g.fillText('ПРОХОД ЗАКРЫТ',px(66.8),py(55.6));
  [[14,44],[50,44]].forEach(p=>cop(g,px(p[0]),py(p[1]),u))}}
function cop(g,x,y,u){g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(x,y+.5*u,2.2*u,.8*u,0,0,7);g.fill();g.fillStyle='#253047';g.strokeStyle='#1b1e22';g.lineWidth=1;g.fillRect(x-1.6*u,y-7*u,3.2*u,7*u);g.strokeRect(x-1.6*u,y-7*u,3.2*u,7*u);g.fillStyle='#c9d94a';g.fillRect(x-1.6*u,y-4.4*u,3.2*u,.5*u);g.fillStyle='#e9c9a8';g.beginPath();g.arc(x,y-8.4*u,1.4*u,0,7);g.fill();g.stroke();g.fillStyle='#1f2a3e';g.fillRect(x-1.7*u,y-10*u,3.4*u,1*u)}
let barrier=false;
function setBarrier(on){if(on===barrier)return;barrier=on;const R={x1:65.8,y1:56,x2:74.2,y2:61,n:'заграждение',_p7:1};try{const M=P.COL&&P.COL.MAPS&&P.COL.MAPS.street;if(Array.isArray(M)){const i=M.findIndex(r=>r&&r._p7);if(on&&i<0)M.push(R);if(!on&&i>=0)M.splice(i,1)}}catch(e){}try{if(typeof STREET_BLOCKS!=='undefined'){const i=STREET_BLOCKS.findIndex(r=>r&&r._p7);if(on&&i<0)STREET_BLOCKS.push(Object.assign({},R));if(!on&&i>=0)STREET_BLOCKS.splice(i,1)}}catch(e){}}
function look(){const w=$('world');if(!w)return;const L=CITY.level;if(onStreet()){draw(L);if(cv)cv.style.display='';w.style.filter=L>0?`saturate(${(1-.11*L).toFixed(2)}) brightness(${(1-.05*L).toFixed(2)}) contrast(${(1+.03*L).toFixed(2)})`:'';setBarrier(CITY.state>=3);w.querySelectorAll('.npc,.streetNpc,.passer').forEach(n=>{n.style.opacity=L>=2.6&&!n.dataset.conflict?'0':''})}else{if(cv)cv.style.display='none';if(w.style.filter)w.style.filter='';setBarrier(false)}}

/* ---------- закрытые места и тексты по стадии ---------- */
const setT=(n,t)=>{if(!n)return;if(n._p7t===undefined)n._p7t=n.t;n.t=t;if('_t0' in n)n._t0=t};
const resT=n=>{if(n&&n._p7t!==undefined){n.t=n._p7t;if('_t0' in n)n._t0=n._p7t}};
const CLOSE=[['papers',2,'Газетный пункт закрыт. На двери листок: «Закрыто до особого распоряжения». Внутри темно.'],['market',3,'Барахолку разогнали. На снегу — сломанные ящики и обрывки газет. Вдалеке воет сирена.']];
const SQ=['Площадь у ДК — сюда стягиваются люди','dkSquare','!'];
function applyCity7(){const c=CITY.state,s=sf();try{CLOSE.forEach(([k,st,t])=>{const n=N[k];if(!n)return;if(c>=st){setT(n,t);if(n._p7c===undefined)n._p7c=n.c;const back=(n._p7c||[]).filter(o=>Array.isArray(o)&&/(назад|уйти|верн|выйти|карт)/i.test(o[0]));n.c=back.length?back:[['Вернуться к карте города','cityMap','←']]}else{resT(n);if(n._p7c!==undefined)n.c=n._p7c}})}catch(e){}
 try{const m=N.cityMap;if(m&&Array.isArray(m.c)){const has=m.c.some(o=>Array.isArray(o)&&o[1]==='dkSquare'&&o._p7);const want=QUEST.isActive('Quest_08')||(s.f&&s.f.squareDone);if(want&&!has){const o=SQ.slice();o._p7=1;m.c.splice(Math.max(0,m.c.length-1),0,o)}if(!want&&has)m.c=m.c.filter(o=>!o._p7)}}catch(e){}
 try{const d=N.dkSquare;if(d){if(d._p7t===undefined)d._p7t=d.t;const b=d._p7t;let t=b;
  if(s.f&&s.f.squareDone)t='Площадь опустела. Дым ещё висит между колоннами ДК, на снегу — сорванные плакаты и брошенные транспаранты. Где-то далеко затихает сирена.';
  else if(c>=3)t='Площадь у ДК не узнать: сотни людей, транспаранты, цепь милиции у ступеней. Над толпой висит пар от дыхания.';
  else if(c>=2)t=b+' Вдоль площади — милицейские машины. Люди говорят вполголоса и оглядываются.';
  else if(c>=1)t=b+' На колоннах ДК — свежие листовки «Руки прочь от нашей панели!».';
  d.t=t;if('_t0' in d)d._t0=t}}catch(e){}
 look()}
P.applyCity7=applyCity7;

/* ---------- разговоры прохожих по стадии (по кругу, не случайно) ---------- */
const TALK=[[],['«Говорят, наш дом в списке на снос…»','«В газетах пишут что угодно, только не правду»','«Мусор уже неделю не вывозят»'],['«Вчера милиция снова ходила по подъездам»','«Лучше детей на улицу не пускать…»','«Люди Ромы теперь везде»'],['«Все на площадь! Там решается всё!»','«Слышали? На улице техника…»','«Не стой тут, расходитесь!» — кричит милиционер']];
let tk=0,ti=0;
function talk(dt){if(!onStreet()||paused())return;const L=TALK[CITY.state]||[];if(!L.length)return;tk+=dt;if(tk<22)return;tk=0;const t=L[ti++%L.length];let b=$('p7talk');const w=$('world');if(!w)return;if(!b){b=document.createElement('div');b.id='p7talk';b.style.cssText="position:absolute;left:50%;bottom:4%;transform:translateX(-50%);z-index:6;pointer-events:none;background:rgba(232,228,216,.92);color:#1b1e22;border:2px solid #1b1e22;padding:4px 10px;font:13px 'Courier New',monospace;transition:opacity .4s;opacity:0;max-width:80%";w.appendChild(b)}b.textContent=t;b.style.opacity='1';clearTimeout(b._h);b._h=setTimeout(()=>b.style.opacity='0',4200)}

/* ---------- техника на дорогах: фиксированные маршруты и расписание по стадии города ---------- */
const LANE={A:{y:88,d:1},B:{y:79,d:-1}};
const SPEC={civ:{w:9,h:5.5,v:14,f:70,g:.05},police:{w:9.5,h:5.8,v:17,f:92,g:.06},truck:{w:15,h:8,v:9,f:46,g:.08},btr:{w:17,h:8.5,v:7,f:34,g:.11}};
const SCHED=[[['civ','A'],['civ','B']],[['civ','A'],['police','B'],['civ','B'],['civ','A']],[['police','T'],['truck','A'],['civ','B'],['police','B'],['truck','B']],[['police','A'],['btr','B'],['truck','A'],['police','T'],['btr','A'],['police','B'],['truck','B']]];
const GAP=[30,24,17,12];
const cars=[];let tq=8,si=0;
function paint(t,d){const c=document.createElement('canvas');c.width=200;c.height=100;const g=c.getContext('2d');g.lineWidth=3;g.strokeStyle='#1b1e22';g.save();if(d<0){g.translate(200,0);g.scale(-1,1)}
 const wh=xs=>xs.forEach(x=>{g.fillStyle='#16181b';g.beginPath();g.arc(x,82,13,0,7);g.fill();g.fillStyle='#55585e';g.beginPath();g.arc(x,82,5,0,7);g.fill()});
 if(t==='civ'||t==='police'){g.fillStyle=t==='police'?'#d9dde2':'#8b5a3c';g.fillRect(8,46,184,32);g.strokeRect(8,46,184,32);g.fillRect(44,22,100,26);g.strokeRect(44,22,100,26);g.fillStyle='#9fb4c4';g.fillRect(52,27,38,18);g.fillRect(96,27,40,18);if(t==='police'){g.fillStyle='#2b4a8a';g.fillRect(8,58,184,9);g.fillStyle='#b52a24';g.fillRect(80,12,14,10);g.fillStyle='#2b4a8a';g.fillRect(94,12,14,10)}g.fillStyle='#f3e3a0';g.fillRect(184,50,8,8);wh([44,156])}
 else if(t==='truck'){g.fillStyle='#5d6b3e';g.fillRect(6,20,120,58);g.strokeRect(6,20,120,58);g.fillStyle='#4f5c33';g.fillRect(130,30,60,48);g.strokeRect(130,30,60,48);g.fillStyle='#9fb4c4';g.fillRect(150,36,32,18);for(let i=0;i<5;i++){g.beginPath();g.moveTo(16+i*24,22);g.lineTo(16+i*24,76);g.stroke()}wh([34,96,164])}
 else{g.fillStyle='#4a5634';g.beginPath();g.moveTo(4,72);g.lineTo(14,40);g.lineTo(170,40);g.lineTo(196,60);g.lineTo(190,72);g.closePath();g.fill();g.stroke();g.fillStyle='#3d482b';g.fillRect(84,24,46,18);g.strokeRect(84,24,46,18);g.fillRect(128,30,46,5);wh([30,74,118,162])}
 g.restore();g.font='bold 15px Courier New,monospace';g.fillStyle='#e8e4d8';if(t==='police'){g.fillStyle='#e8e4d8';g.fillText('МИЛИЦИЯ',58,74)}if(t==='btr')g.fillText('217',d>0?40:130,62);return c}
function voice(c){const a=P.AUDIO&&P.AUDIO.ac&&P.AUDIO.ac();if(!a||!P.AUDIO.sfx)return;try{const s=SPEC[c.t],o=a.createOscillator(),f=a.createBiquadFilter(),e=a.createGain();o.type='sawtooth';o.frequency.value=s.f;f.type='lowpass';f.frequency.value=c.t==='btr'?220:420;e.gain.value=0;o.connect(f);f.connect(e);e.connect(P.AUDIO.sfx);o.start();c.au={o,e,n:[o]};
 if(c.t==='btr'||c.t==='truck'){const r=a.createOscillator(),rg=a.createGain();r.type='square';r.frequency.value=s.f/2;rg.gain.value=.35;r.connect(rg);rg.connect(f);r.start();c.au.n.push(r)}
 if(c.siren){const so=a.createOscillator(),sf2=a.createBiquadFilter(),se=a.createGain();so.type='square';so.frequency.value=660;sf2.type='lowpass';sf2.frequency.value=1800;se.gain.value=0;so.connect(sf2);sf2.connect(se);se.connect(P.AUDIO.sfx);so.start();c.au.so=so;c.au.se=se;c.au.n.push(so)}}catch(e){}}
function mute(c){if(!c.au)return;try{c.au.n.forEach(o=>o.stop())}catch(e){}c.au=null}
function heroes(){const w=WS()||{},r=[];['kirill','zhenya'].forEach(h=>{const o=w[h];if(o&&typeof o.x==='number'&&!o.hidden&&(!o.room||o.room==='street'))r.push(o)});return r}
function spawn(t,ln){const w=$('world');if(!w)return;const s=SPEC[t],T=ln==='T',L=T?LANE.B:LANE[ln];const c={t,d:L.d,y:L.y,w:s.w,h:s.h,v:s.v,x:L.d>0?-s.w-2:102,ph:'run',tm:0,rot:0,op:1,siren:t==='police'&&CITY.state>=2,turn:T,honk:0};
 const el=document.createElement('div');el.className='p7veh';el.style.cssText='position:absolute;pointer-events:none;z-index:4;transform-origin:50% 80%';el.appendChild(paint(t,c.d));el.firstChild.style.cssText='width:100%;height:100%;display:block';w.appendChild(el);c.el=el;voice(c);cars.push(c);place(c)}
function place(c){const e=c.el.style;e.left=c.x+'%';e.top=(c.y-c.h)+'%';e.width=c.w+'%';e.height=c.h+'%';e.opacity=c.op;e.transform=c.rot?`rotate(${c.rot}deg)`:''}
function clearCars(){cars.splice(0).forEach(c=>{mute(c);c.el.remove()});const sw=$('p7siren');if(sw)sw.style.opacity='0'}
function tickCars(dt){if(!onStreet()){if(cars.length)clearCars();tq=Math.max(tq,6);return}
 const P0=paused(),st=CITY.state;let sir=false;const H=heroes(),now=performance.now()/1000;
 if(!P0){tq-=dt;if(tq<=0&&cars.length<3){const L=SCHED[st]||SCHED[0],en=L[si%L.length],ln=en[1]==='T'?'B':en[1],ex=LANE[ln].d>0?0:100,yy=LANE[ln].y;
  if(H.some(h=>Math.abs(h.x-ex)<22&&Math.abs(h.y-yy)<14))tq=2;else{spawn(en[0],en[1]);si++;tq=GAP[st]||20}}}
 for(let i=cars.length-1;i>=0;i--){const c=cars[i];const cx=c.x+c.w/2;
  if(!P0){let v=c.v;if(c.ph==='run'){const blk=H.some(h=>{const dx=(h.x-cx)*c.d;return dx>0&&dx<c.w/2+6&&Math.abs(h.y-c.y)<6});if(blk){v=0;if(!c.honk&&c.t!=='btr'&&P.AUDIO){P.AUDIO.tone(420,400,.25,.12,'square');c.honk=1}}else c.honk=0;
    c.x+=v*c.d*dt;if(c.turn&&c.d<0&&cx<=52){c.ph='stop';c.tm=3.5;if(P.AUDIO)P.AUDIO.tone(500,950,.6,.09,'square')}}
   else if(c.ph==='stop'){c.tm-=dt;if(c.tm<=0)c.ph='turn'}
   else if(c.ph==='turn'){c.rot=Math.max(-90,c.rot-90*dt);c.x+=c.d*c.v*.35*dt;c.y+=c.v*.7*dt;if(c.y>97)c.op=Math.max(0,c.op-dt*1.5)}
   place(c)}
  if(c.au){const a=P.AUDIO.ac(),vol=P0?0:SPEC[c.t].g*Math.max(0,1-Math.abs(cx-50)/80)*c.op;c.au.e.gain.setTargetAtTime(vol,a.currentTime,.15);if(c.au.so){c.au.so.frequency.setTargetAtTime((now%.9)<.45?660:880,a.currentTime,.03);c.au.se.gain.setTargetAtTime(vol*.5,a.currentTime,.1)}}
  if(c.siren&&c.op>0&&cx>-5&&cx<105)sir=true;
  if(c.x>110||c.x<-c.w-10||c.op<=0){mute(c);c.el.remove();cars.splice(i,1)}}
 let sw=$('p7siren');const w=$('world');if(sir&&w&&!sw){sw=document.createElement('div');sw.id='p7siren';sw.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:5;transition:background .3s,opacity .5s;mix-blend-mode:screen';w.appendChild(sw)}
 if(sw){sw.style.opacity=sir&&!P0?'1':'0';sw.style.background=(now%.9)<.45?'rgba(200,40,40,.10)':'rgba(40,80,220,.10)'}}
P.TRAFFIC={get cars(){return cars.map(c=>({t:c.t,x:c.x,y:c.y,ph:c.ph}))},spawn,clear:clearCars,SCHED,LANE};

/* ---------- цикл и сюжетный флаг Quest_07 ---------- */
let seenT=0,lt=performance.now();
function loop(t){const dt=Math.min(.1,(t-lt)/1000);lt=t;try{tickCars(dt);talk(dt);
 if(onStreet()&&!paused()&&CITY.state>=3&&QUEST.isActive('Quest_07')){seenT+=dt;if(seenT>=6){const s=sf();s.f.sawFinalStreet=1;seenT=0;P.note7('Знакомая улица стала чужой. Все говорят про площадь у ДК.',3200);QUEST.upd();applyCity7();P.save&&P.save()}}}catch(e){}requestAnimationFrame(loop)}
requestAnimationFrame(loop);
const pr=P.onRender7;P.onRender7=x=>{try{pr&&pr(x)}catch(e){}applyCity7()};
CITY.on&&CITY.on(()=>applyCity7());
setInterval(look,700);window.addEventListener('resize',()=>{key=''});
applyCity7();
})();
