// game7c.js — этап 7: финальная площадь у ДК — постановочная кат-сцена из 10 этапов (без графичного насилия).
(function(){'use strict';
const P=window.P7;if(!P||!P.CUT||!P.QUEST)return;
const $=i=>document.getElementById(i);
const CUT=P.CUT,QUEST=P.QUEST,CITY=P.CITY,sf=P.sf7;
const A=()=>P.AUDIO&&P.AUDIO.ac&&P.AUDIO.ac();
const T=[0,4,8,13,18,26,31,37,44];
const CAP=['','Из-за поворота открывается площадь у ДК. Людей больше, чем когда-либо.','Гул толпы нарастает. Кто-то скандирует: «Не отдадим панель!»','У края площади зажигаются мигалки первых милицейских машин.','Сирены со всех сторон. Люди подходят и подходят.','По дороге за площадью медленно ползёт БТР. Земля дрожит.','Цепь милиции со щитами встаёт у ступеней. «Разойдись!» — хрипит мегафон.','Толпа качнулась вперёд. Цепь двинулась навстречу. Крики, давка, дым.','Хлопок. Ещё один. Вспышки над крышей ДК — люди бросаются врассыпную.'];
const rnd=seed=>{let r=seed;return()=>{r=(r*9301+49297)%233280;return r/233280}};
const CROWD=(()=>{const r=rnd(1991),a=[];for(let i=0;i<130;i++)a.push({x:4+r()*92,y:62+r()*34,c:['#4a3b32','#2f3a4a','#5a2f2f','#3b4a3a','#55524c'][i%5],p:r()*6.28,s:.8+r()*.4,flag:i%17===0});a.sort((p,q)=>p.y-q.y);return a})();
const LINE=Array.from({length:14},(_,i)=>({x:22+i*4.3}));
const SHOTS=[38.2,39.6,40.1,41.8,42.9];
let cv,g,t0=0,raf=0,stage=0,au=null,shotI=0,flash=0,onStage=null;
function mk(){cv=$('p7cut');if(!cv){cv=document.createElement('canvas');cv.id='p7cut';cv.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;z-index:7900;background:#0d0f14;transition:opacity 1s;opacity:0';document.body.appendChild(cv);const cap=document.createElement('div');cap.id='p7cutcap';cap.style.cssText="position:fixed;left:50%;bottom:5%;transform:translateX(-50%);z-index:7901;max-width:76%;background:rgba(10,10,12,.78);color:#e8e4d8;border:2px solid #e8e4d8;padding:10px 16px;font:16px 'Courier New',monospace;text-align:center;transition:opacity .6s;opacity:0";document.body.appendChild(cap)}g=cv.getContext('2d')}
function fig(x,y,s,col,u,arm){g.fillStyle=col;g.fillRect(x-1.2*s*u,y-5.5*s*u,2.4*s*u,5.5*s*u);g.beginPath();g.arc(x,y-6.6*s*u,1.1*s*u,0,7);g.fill();if(arm){g.fillRect(x+1*s*u,y-8*s*u-arm*u,.5*s*u,3.5*s*u)}}
function frame(now){const t=(now-t0)/1000,W=cv.width=innerWidth,H=cv.height=innerHeight,u=Math.min(W,H)/100,px=x=>x/100*W,py=y=>y/100*H;
 const sky=g.createLinearGradient(0,0,0,H);const dk=Math.min(1,t/40);sky.addColorStop(0,`rgb(${40-20*dk},${46-24*dk},${66-30*dk})`);sky.addColorStop(1,'#1c1d22');g.fillStyle=sky;g.fillRect(0,0,W,H);
 g.fillStyle='#3a3833';g.fillRect(px(25),py(22),px(50),py(30));g.fillStyle='#4a4741';g.fillRect(px(22),py(18),px(56),py(5));for(let i=0;i<8;i++){g.fillStyle='#57534b';g.fillRect(px(28+i*6.2),py(24),px(2),py(26))}g.fillStyle='#c9b98a';g.font=`bold ${2.6*u}px Courier New,monospace`;g.textAlign='center';g.fillText('ДОМ КУЛЬТУРЫ',px(50),py(21.6));
 g.fillStyle='#2a2b2e';g.fillRect(0,py(52),W,py(6));g.fillStyle='#45464a';g.fillRect(0,py(58),W,py(42));
 if(stage>=3){[[6,55],[84,55],[70,56]].slice(0,stage>=4?3:1).forEach((c,i)=>{g.fillStyle='#d9dde2';g.fillRect(px(c[0]),py(c[1]-3),px(9),py(3));g.fillStyle='#2b4a8a';g.fillRect(px(c[0]),py(c[1]-2),px(9),py(.8));const on=((t*2+i)|0)%2;g.fillStyle=on?'#ff3b30':'#3060ff';g.beginPath();g.arc(px(c[0]+4.5),py(c[1]-3.4),u*(on?1.2:1),0,7);g.fill();const gl=g.createRadialGradient(px(c[0]+4.5),py(c[1]-3),0,px(c[0]+4.5),py(c[1]-3),px(12));gl.addColorStop(0,on?'rgba(255,50,40,.25)':'rgba(40,80,255,.25)');gl.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gl;g.fillRect(0,0,W,H)})}
 if(stage>=5){const bx=-25+(t-T[4])*15;if(bx<125){g.fillStyle='#4a5634';g.beginPath();g.moveTo(px(bx),py(57));g.lineTo(px(bx+2),py(52.5));g.lineTo(px(bx+18),py(52.5));g.lineTo(px(bx+21),py(55));g.lineTo(px(bx+20),py(57));g.fill();g.fillStyle='#3d482b';g.fillRect(px(bx+8),py(50.5),px(6),py(2.2));g.fillRect(px(bx+13.5),py(51.1),px(6),py(.6));g.fillStyle='#16181b';for(let k=0;k<4;k++){g.beginPath();g.arc(px(bx+3+k*4.6),py(57.3),u*1.1,0,7);g.fill()}}}
 const n=Math.min(CROWD.length,Math.round(30+(Math.min(t,T[4])/T[4])*100));const surge=stage===7?Math.sin(t*2.2)*2.2:stage>=8?0:0;const sc=stage>=8?Math.min(1,(t-T[7])/5):0;
 if(stage>=6){const fwd=stage>=7?Math.min(4,(t-T[6])*.8):0;LINE.forEach((l,i)=>{const x=px(l.x),y=py(61+fwd);fig(x,y,1,'#1f2a3e',u);g.fillStyle='rgba(170,190,210,.55)';g.fillRect(x-1.8*u,y-5.5*u,3.6*u,4.6*u)})}
 for(let i=0;i<n;i++){const c=CROWD[i];let x=c.x+Math.sin(t*1.3+c.p)*.4;let y=c.y+surge*(1-(c.y-62)/40);if(sc>0)x+=(c.x<50?-1:1)*sc*18*(1-(c.y-62)/50);fig(px(x),py(y),c.s,c.c,u,stage>=2&&i%6===0?Math.abs(Math.sin(t*3+c.p))*1.5:0);if(c.flag&&stage>=2){g.fillStyle='#e8e4d8';g.fillRect(px(x)-3*u,py(y)-13*u,6*u,2.6*u);g.fillStyle='#8a1f1f';g.font=`bold ${1.1*u}px Courier New,monospace`;g.fillText('НЕТ СНОСУ',px(x),py(y)-11.3*u)}}
 if(stage>=6){const k=Math.min(1,(t-T[5])/8);for(let i=0;i<7;i++){const sx=px(15+i*12+Math.sin(t*.3+i)*3),sy=py(58-((t*3+i*7)%25)),r=px(7+i%3*2);const sm=g.createRadialGradient(sx,sy,0,sx,sy,r);sm.addColorStop(0,`rgba(150,150,155,${.35*k})`);sm.addColorStop(1,'rgba(150,150,155,0)');g.fillStyle=sm;g.fillRect(0,0,W,H)}}
 if(flash>0){g.fillStyle=`rgba(255,240,200,${flash*.35})`;g.fillRect(0,0,W,H);g.fillStyle=`rgba(255,230,150,${flash})`;g.beginPath();g.arc(px(30+shotI*9%40),py(19),u*1.5,0,7);g.fill();flash=Math.max(0,flash-.08)}
 g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,0,W,py(6));g.fillRect(0,py(94),W,py(6));g.textAlign='left'}

/* ---------- звук площади: гул толпы, сирены, двигатель БТР (через шину эффектов game6a) ---------- */
function audioStart(){const a=A();if(!a||!P.AUDIO.sfx)return;try{const b=a.createBuffer(1,a.sampleRate*2,a.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){l=l*.97+(Math.random()*2-1)*.03;d[i]=l*6}
 const s=a.createBufferSource();s.buffer=b;s.loop=true;const f=a.createBiquadFilter();f.type='bandpass';f.frequency.value=520;f.Q.value=.6;const e=a.createGain();e.gain.value=0;s.connect(f);f.connect(e);e.connect(P.AUDIO.sfx);s.start();
 const so=a.createOscillator(),sl=a.createBiquadFilter(),se=a.createGain();so.type='square';so.frequency.value=600;sl.type='lowpass';sl.frequency.value=1600;se.gain.value=0;so.connect(sl);sl.connect(se);se.connect(P.AUDIO.sfx);so.start();
 const ro=a.createOscillator(),rl=a.createBiquadFilter(),re=a.createGain();ro.type='sawtooth';ro.frequency.value=34;rl.type='lowpass';rl.frequency.value=180;re.gain.value=0;ro.connect(rl);rl.connect(re);re.connect(P.AUDIO.sfx);ro.start();au={e,se,so,re,n:[s,so,ro]}}catch(e){au=null}}
function audioTick(t){if(!au)return;const a=A(),n=a.currentTime;au.e.gain.setTargetAtTime([0,.05,.09,.12,.17,.19,.24,.3,.32][stage]||.08,n,.4);au.se.gain.setTargetAtTime(stage>=4?.05:stage>=3?.025:0,n,.3);au.so.frequency.setTargetAtTime(750+250*Math.sin(t*2.6),n,.05);au.re.gain.setTargetAtTime(stage>=5&&stage<=6?Math.max(0,.13-Math.abs(t-T[4]-5)*.016):0,n,.3)}
function audioStop(){if(!au)return;const x=au;au=null;try{const n=A().currentTime;[x.e,x.se,x.re].forEach(g=>g.gain.setTargetAtTime(0,n,.4));setTimeout(()=>{try{x.n.forEach(o=>o.stop())}catch(e){}},1600)}catch(e){}}
const SCREAM=[32,33.8,35.4,39,41];const MEGA=[26.5,29];let scI=0,meI=0;
function sfx(t){const AU=P.AUDIO;if(!AU)return;const a=A();
 while(shotI<SHOTS.length&&t>=SHOTS[shotI]){flash=1;shotI++;try{AU.noise(a.currentTime,.16,.6,undefined,900);AU.tone(170,50,.25,.22,'square')}catch(e){}}
 while(scI<SCREAM.length&&t>=SCREAM[scI]){scI++;try{AU.tone(640,1060,.45,.035,'sawtooth')}catch(e){}}
 while(meI<MEGA.length&&t>=MEGA[meI]){meI++;try{AU.tone(310,290,.7,.05,'square')}catch(e){}}}
function setStage(k){if(k===stage)return;stage=k;const c=$('p7cutcap');if(c){c.style.opacity='0';setTimeout(()=>{c.textContent=CAP[k]||'';c.style.opacity='1'},250)}
 if(k===2){CUT.mus='square';try{if(P.MUSIC&&typeof P.MUSIC.play==='function')P.MUSIC.play('square')}catch(e){}}if(onStage)onStage(k)}
function skip(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();e.stopImmediatePropagation();if(stage>=1&&stage<=8)t0-=Math.max(0,T[stage]-(performance.now()-t0)/1000)*1000}}
function tick(now){if(!cv||stage>=9)return;const t=(now-t0)/1000;if(t>=T[8]){react();return}let k=1;for(let i=0;i<8;i++)if(t>=T[i])k=i+1;setStage(k);try{frame(now);audioTick(t);sfx(t)}catch(e){}raf=requestAnimationFrame(tick)}

/* ---------- запуск: Quest_08 активен + CityState 3 + локация «Площадь у ДК» + сцена ещё не сыграна ---------- */
function start(){const s=sf();if(CUT.on||(s.f&&s.f.squareDone))return false;CUT.start({pausable:false,mus:'tense',amb:'city'});mk();t0=performance.now();stage=0;shotI=0;scI=0;meI=0;flash=0;requestAnimationFrame(()=>{cv.style.opacity='1'});audioStart();addEventListener('keydown',skip,true);raf=requestAnimationFrame(tick);return true}
function react(){if(stage>=9)return;stage=9;if(onStage)onStage(9);cancelAnimationFrame(raf);removeEventListener('keydown',skip,true);const c=$('p7cutcap');if(c)c.style.opacity='0';if(cv)cv.style.opacity='.0';
 setTimeout(()=>{let pr=[];try{pr=P.present()||[]}catch(e){}const K=pr.indexOf('kirill')>=0,Z=pr.indexOf('zhenya')>=0;
  const L=[{who:'narr',t:'Толпа качнулась. Где-то совсем рядом хлопнул выстрел — люди бросились врассыпную.',sfx:'hit'}];
  if(K&&Z){L.push({who:'kirill',emo:'angry',t:'Женя, держись за мной! Не отпускай руку!'},{who:'zhenya',emo:'sad',t:'Там Шура! Его прижали к ступеням ДК!'},{who:'kirill',t:'Вижу. Либо сейчас, либо никогда.'},{who:'zhenya',t:'Только вместе. Слышишь? Только вместе.'})}
  else if(Z){L.push({who:'zhenya',emo:'sad',t:'Кирилл бы знал, что делать… Там Шура, у ступеней!'},{who:'zhenya',t:'Ладно. Сама. Главное — не бояться.'})}
  else{L.push({who:'kirill',t:'Женю бы сюда… Нет. Хорошо, что её здесь нет.'},{who:'kirill',emo:'angry',t:'Шура! У ступеней ДК! Держись!'})}
  L.push({who:'narr',t:'Решать нужно сейчас.',choices:[{t:'Пробиться к Шуре',fx(s){s.f.helpedShura=1;s.rep=(s.rep||0)+1}},{t:'Уйти дворами, пока не поздно',fx(s){s.f.leftSquare=1;if(K&&Z)s.bond=(s.bond||0)+1}}]});
  try{P.STORY.play({id:'q08_square',ch:sf().ch,lines:L},finish)}catch(e){finish()}},1100)}
function finish(){if(stage>=10)return;stage=10;if(onStage)onStage(10);const s=sf();s.f.squareDone=1;s.cuts=s.cuts||{};s.cuts.square=1;audioStop();const c=$('p7cutcap');setTimeout(()=>{try{cv&&cv.remove();c&&c.remove()}catch(e){}cv=null},1200);
 CUT.end();QUEST.upd();try{P.applyCity7&&P.applyCity7()}catch(e){}P.save&&P.save();
 setTimeout(()=>{try{const ev=(P.STORY.events||[]).find(e=>e&&e.id==='c6_final');const dn=s.done&&(Array.isArray(s.done)?s.done.indexOf('c6_final')>=0:s.done.c6_final);if(ev&&!dn&&!P.STORY.open)P.STORY.play(ev,()=>{try{P.STORY.showEnd&&P.STORY.showEnd()}catch(e){}})}catch(e){}},2200)}
function canStart(){try{const s=sf();return id==='dkSquare'&&QUEST.isActive('Quest_08')&&CITY.state>=3&&!(s.f&&s.f.squareDone)&&!CUT.on&&!P.PAUSE.on&&!P.STORY.open&&!P.titleOn7()}catch(e){return false}}
const pr=P.onRender7;P.onRender7=x=>{try{pr&&pr(x)}catch(e){}if(canStart())setTimeout(()=>{if(canStart())start()},700)};
setInterval(()=>{if(canStart())start()},1500);
P.SQUARE={start,canStart,get stage(){return stage},set onStage(f){onStage=f}};
})();
