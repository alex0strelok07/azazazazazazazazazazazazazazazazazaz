// Панель №7 — этап 5 (часть 1): группа персонажей, совместное передвижение, анимация ходьбы, событие с лужей.
(function(){'use strict';
const P=window.P7;if(!P)return;
const HEROES=['kirill','zhenya'],NM={kirill:'Кирилл',zhenya:'Женя'};
const ws=()=>{try{return worldState()}catch(e){return street}};
const cur=()=>N[id]||{};
const F=()=>P.S.flags;
// ---------- группа (хранится в флагах → попадает в сохранение) ----------
P.PT={get split(){return !!F().ptSplit},get npc(){return (F().ptNpc||[]).slice()}};
P.party=function(){const w=ws();const p=w.party||'both';const heroes=p==='both'?HEROES.slice():[p];
const leader=heroes.includes(w.active)?w.active:heroes[0];const together=heroes.length>1&&!P.PT.split;const npc=P.PT.npc;
const names=heroes.map(h=>NM[h]).concat(npc.map(n=>(P.NAMES&&P.NAMES[n])||n));
return{members:heroes.concat(npc),heroes,npc,leader,followers:together?heroes.filter(h=>h!==leader):[],absent:HEROES.filter(h=>!heroes.includes(h)),together,label:'['+names.join('+')+']'}};
P.inParty=who=>P.party().members.includes(who);
P.partyIs=(...m)=>{const a=P.party().members;return m.length===a.length&&m.every(v=>a.includes(v))};
P.joinNpc=k=>{const a=F().ptNpc||[];if(!a.includes(k))a.push(k);F().ptNpc=a;upd()};
P.leaveNpc=k=>{F().ptNpc=(F().ptNpc||[]).filter(v=>v!==k);upd()};

// ---------- анимации чибиков ----------
const st=document.createElement('style');st.textContent=`
.mini.p7walk{animation:p7step .36s ease-in-out infinite}
.mini.p7turn{animation:p7turn .18s ease-out}
.mini.p7walk.p7turn{animation:p7step .36s ease-in-out infinite,p7turn .18s ease-out}
.mini.p7hop{animation:p7hop .55s ease-out}
.mini.p7startle{animation:p7startle .5s ease-in-out}
@keyframes p7step{0%,100%{translate:0 0;rotate:0deg}25%{translate:0 -5px;rotate:-3deg}50%{translate:0 0;rotate:0deg}75%{translate:0 -5px;rotate:3deg}}
@keyframes p7turn{0%{scale:.84 1}100%{scale:1 1}}
@keyframes p7hop{0%,100%{translate:0 0}45%{translate:0 -18px}}
@keyframes p7startle{0%,100%{translate:0 0}20%{translate:-3px -6px}40%{translate:3px -6px}60%{translate:-3px -3px}80%{translate:2px 0}}
.p7splash{position:absolute;width:0;height:0;z-index:6;pointer-events:none}
.p7splash:before{content:'';position:absolute;left:-28px;top:-9px;width:56px;height:18px;border:2px solid rgba(205,225,232,.95);border-radius:50%;animation:p7ring .75s ease-out forwards}
.p7splash i{position:absolute;left:-3px;top:-4px;width:6px;height:8px;border-radius:50%;background:#c4d8e0;animation:p7drop .75s cubic-bezier(.2,.7,.5,1) forwards}
@keyframes p7drop{0%{transform:translate(0,0);opacity:1}100%{transform:translate(var(--dx),var(--dy));opacity:0}}
@keyframes p7ring{0%{transform:scale(.3);opacity:1}100%{transform:scale(1.9);opacity:0}}
.p7pt{position:absolute;top:258px;right:30px;z-index:7;display:none;border:1px solid #7d6c45;background:#111411;color:#d8cfb6;padding:9px 12px;cursor:pointer;font:700 12px 'Courier New',monospace}
.p7pt:hover{background:#b89a5c;color:#11130f}
@media(max-width:700px){.p7pt{top:242px;right:16px}}`;document.head.appendChild(st);
const EL=h=>document.getElementById(h==='kirill'?'miniKirill':'miniZhenya');
const tm={},lastDir={};
function walk(h,dir){const e=EL(h);if(!e)return;if(!e.classList.contains('p7walk')){e.style.animationDelay=-(performance.now()%360)+'ms';e.classList.add('p7walk')}
if(dir&&lastDir[h]&&lastDir[h]!==dir){e.classList.remove('p7turn');void e.offsetWidth;e.classList.add('p7turn');setTimeout(()=>e.classList.remove('p7turn'),200)}
if(dir)lastDir[h]=dir;clearTimeout(tm[h]);tm[h]=setTimeout(()=>{e.classList.remove('p7walk');e.style.animationDelay=''},170)}
function react(h,cls){const e=EL(h);if(!e)return;e.classList.remove('p7walk',cls);void e.offsetWidth;e.classList.add(cls);setTimeout(()=>e.classList.remove(cls),600)}
P.react=react;

// ---------- следование за лидером ----------
const GAP=5.5,T={k:null,pts:[]};let lock=false;
const mkey=()=>{const x=cur();return x.explore?(x.map||'m')+':'+(x.room||''):null};
const clamp=p=>{p.x=Math.max(3,Math.min(95,p.x));p.y=Math.max(10,Math.min(95,p.y))};
function seed(){const pt=P.party(),w=ws();T.k=mkey();T.pts=[];pt.followers.slice().reverse().forEach(f=>{if(w[f])T.pts.push({x:w[f].x,y:w[f].y})});const L=w[pt.leader];if(L)T.pts.push({x:L.x,y:L.y})}
P.resetFollow=seed;
function trailPoint(D){let acc=0;for(let j=T.pts.length-1;j>0;j--){const a=T.pts[j],b=T.pts[j-1],s=Math.hypot(a.x-b.x,a.y-b.y);if(s>0&&acc+s>=D){const r=(D-acc)/s;return{x:a.x+(b.x-a.x)*r,y:a.y+(b.y-a.y)*r}}acc+=s}return null}
function follow(fast,mvx,mvy){const pt=P.party(),w=ws(),L=w[pt.leader];if(!L)return;const un=Math.hypot(mvx||0,mvy||0)||1,ux=(mvx||0)/un,uy=(mvy||0)/un;if(T.k!==mkey())seed();
const last=T.pts[T.pts.length-1];if(!last||Math.hypot(last.x-L.x,last.y-L.y)>.05)T.pts.push({x:L.x,y:L.y});if(T.pts.length>240)T.pts.splice(0,T.pts.length-240);
pt.followers.forEach((f,i)=>{const Fp=w[f];if(!Fp)return;const D=GAP*(i+1),tp=trailPoint(D),dl=Math.hypot(Fp.x-L.x,Fp.y-L.y);
if(dl>28){if(tp){Fp.x=tp.x;Fp.y=tp.y}return}
const lim=(fast?2.4:.8)*1.7,ax=Fp.x-L.x,ay=Fp.y-L.y;
if(dl<GAP&&(ax*ux+ay*uy>.3||dl<2.6)){let px=-uy,py=ux;if(px*ax+py*ay<0){px=-px;py=-py}if(Math.abs(px*ax+py*ay)<3.2){Fp.x+=px*lim*.7;Fp.y+=py*lim*.7;clamp(Fp);const d=Math.abs(px)>Math.abs(py)?(px>0?'right':'left'):(py>0?'down':'up');Fp.dir=d;walk(f,d)}return}
if(!tp||dl<D*.85)return;
let mx=tp.x-Fp.x,my=tp.y-Fp.y;const s=Math.hypot(mx,my);if(s<.04)return;if(s>lim){mx*=lim/s;my*=lim/s}
Fp.x+=mx;Fp.y+=my;const d=Math.abs(mx)>Math.abs(my)?(mx>0?'right':'left'):(my>0?'down':'up');Fp.dir=d;walk(f,d)})}
const _mv=move;
move=function(dx,dy,fast){if(lock)return;const pt=P.party(),L=ws()[pt.leader],bx=L?L.x:0,by=L?L.y:0;const r=_mv.apply(this,arguments);
try{const L2=ws()[pt.leader];if(L2&&(Math.abs(L2.x-bx)>.01||Math.abs(L2.y-by)>.01)){walk(pt.leader,L2.dir);if(pt.together)follow(fast,L2.x-bx,L2.y-by);drawMini();checkPuddle()}}catch(e){console.warn('follow',e)}return r};
if(typeof switchChar==='function'){const _sw=switchChar;switchChar=function(...a){if(lock)return;const r=_sw.apply(this,a);try{seed();upd()}catch(e){}return r}}

// ---------- вместе / порознь (T) ----------
const btn=document.createElement('button');btn.className='p7pt';btn.type='button';
function upd(){const x=cur(),pt=P.party(),g=$('game');if(!g)return;if(!btn.parentNode)g.appendChild(btn);
btn.style.display=x.explore&&pt.heroes.length>1?'block':'none';btn.textContent=pt.together?'👫 ВМЕСТЕ (T)':'🧍 ПОРОЗНЬ (T)';g.dataset.party=pt.label}
function toggleSplit(){const pt=P.party(),w=ws();if(pt.heroes.length<2){P.toast('Сейчас здесь только '+NM[pt.heroes[0]]+'.');return}
if(P.PT.split){const d=Math.hypot(w.kirill.x-w.zhenya.x,w.kirill.y-w.zhenya.y);if(d>16){P.toast('Подойдите друг к другу ближе, чтобы идти вместе.');return}F().ptSplit=0;seed();P.toast('👫 Кирилл и Женя снова идут вместе. Ведёт '+NM[pt.leader]+'.')}
else{F().ptSplit=1;const o=pt.followers[0];P.toast('🧍 '+NM[o]+' остаётся ждать здесь. Q — переключиться, T — снова вместе.')}
upd();try{P.save&&P.save()}catch(e){}}
P.toggleSplit=toggleSplit;
btn.addEventListener('click',e=>{e.stopPropagation();toggleSplit()});
window.addEventListener('keydown',e=>{if(e.code!=='KeyT'||e.repeat||P.invOpen||P.fighting||lock)return;if(!cur().explore)return;e.preventDefault();e.stopImmediatePropagation();toggleSplit()},true);
const help=document.querySelector('.exploreHelp');if(help)help.textContent+=' · T — ВМЕСТЕ/ПОРОЗНЬ';

// ---------- лужа на улице ----------
const PUD={x:73,y:22};let lastSnd=0;
const nearPud=p=>p&&Math.hypot(p.x+2-PUD.x,(p.y-PUD.y)*1.3)<4.2;
function splashSnd(){const now=Date.now();if(now-lastSnd<1500)return;lastSnd=now;
try{const C=P._ac||(P._ac=new (window.AudioContext||window.webkitAudioContext)());if(C.state==='suspended')C.resume();
const n=C.sampleRate*.55|0,b=C.createBuffer(1,n,C.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++){const t=i/n;d[i]=(Math.random()*2-1)*Math.pow(1-t,3)*(t<.02?t/.02:1)}
const s=C.createBufferSource();s.buffer=b;const f=C.createBiquadFilter();f.type='bandpass';f.frequency.setValueAtTime(1900,C.currentTime);f.frequency.exponentialRampToValueAtTime(380,C.currentTime+.45);f.Q.value=.8;
const g=C.createGain();g.gain.value=.75;s.connect(f);f.connect(g);g.connect(C.destination);s.start()}catch(e){}}
function splashFx(x,y){const wd=$('world');if(!wd)return;const d=document.createElement('div');d.className='p7splash';d.style.left=x+'%';d.style.bottom=(100-y)+'%';
for(let i=0;i<12;i++){const s=document.createElement('i'),a=Math.PI*(i/11);s.style.setProperty('--dx',(Math.cos(a)*38).toFixed(1)+'px');s.style.setProperty('--dy',(-(Math.sin(a)*34+6)).toFixed(1)+'px');d.appendChild(s)}
wd.appendChild(d);setTimeout(()=>d.remove(),900)}
P.splash=(x,y)=>{splashFx(x,y);splashSnd()};
function splashEvent(){lock=true;const w=ws(),K=w.kirill;K.x=PUD.x-2;K.y=PUD.y;K.dir='down';drawMini();
splashFx(PUD.x,PUD.y);splashSnd();react('kirill','p7startle');setTimeout(()=>react('zhenya','p7hop'),150);
setTimeout(()=>{lock=false;id='puddle';render()},950)}
function checkPuddle(){const x=cur();if(!x.explore||x.map!=='street')return;const pt=P.party(),w=ws();
if(pt.heroes.length===2){if(!pt.together||F().puddleDone)return;if(pt.heroes.some(h=>nearPud(w[h])))splashEvent();return}
const h=pt.heroes[0];if(!nearPud(w[h])||F()['pud_'+h])return;F()['pud_'+h]=1;
if(h==='zhenya'){react('zhenya','p7turn');P.toast('Женя аккуратно обходит лужу по краю бордюра.')}else{react('kirill','p7hop');P.toast('Кирилл перешагивает лужу по половинке кирпича.')}}
const PS={room:'УЛИЦА',scene:'detail_puddle'};
N.puddleZ=Object.assign({s:'Женя',w:'zhenya',e:'worried',t:'Женя сначала прыскает в кулак, потом спохватывается: «Ой… Кирилл, прости! Ты как? Давай потом ботинки на батарею, а то завтра сляжешь с температурой».',next:'puddleK2'},PS);
N.puddleK2=Object.assign({s:'Кирилл',w:'kirill',e:'neutral',t:'«Смейся-смейся. В следующий раз перенесу тебя через неё на руках — сама пожалеешь». В ботинке противно хлюпает.',next:'streetHub'},PS);
if(N.puddle){const o=N.puddle,ofx=o.fx;o.fx=n=>{if(ofx)try{ofx(n)}catch(e){}const h=P.party().heroes;let r;
if(h.length===1&&h[0]==='zhenya')r={s:'Женя',w:'zhenya',e:'neutral',t:'Женя видит широкую ледяную лужу и аккуратно обходит её по бордюру, придерживаясь за столб. «Нет уж, сегодня без приключений».',next:'streetHub'};
else if(h.length===1)r={s:'Кирилл',w:'kirill',e:'neutral',t:'Кирилл прикидывает расстояние и перешагивает лужу по половинке кирпича. Ботинки сухие. «Не сегодня».',next:'streetHub'};
else if(!F().puddleDone){F().puddleDone=1;splashSnd();r={s:'Кирилл',w:'kirill',e:'angry',t:'Кирилл засматривается на Женю и с размаху наступает в ледяную лужу. Брызги летят во все стороны, Женя отскакивает. «Сука… ботинок насквозь».',next:'puddleZ'}}
else r={s:'Женя',w:'zhenya',e:'neutral',t:'Кирилл обходит лужу широкой дугой, глядя под ноги. Женя хихикает: «Учишься!»',next:'streetHub'};
P.dyn(n,{t:r.t,s:r.s,w:r.w});n.e=r.e;n.next=r.next}}

// ---------- после каждой сцены: расстановка при входе на карту ----------
const _r=render;
render=function(...a){const out=_r.apply(this,a);try{after()}catch(e){console.warn('party',e)}return out};
function after(){upd();const x=cur();if(!x.explore){T.k=null;return}if(T.k===mkey())return;
const pt=P.party(),w=ws(),L=w[pt.leader];
if(L&&pt.together)pt.followers.forEach((f,i)=>{const Fp=w[f];if(!Fp)return;if(Math.hypot(Fp.x-L.x,Fp.y-L.y)>14){Fp.x=L.x+(L.x>50?-4:4)*(i+1);Fp.y=L.y;Fp.dir=L.dir;clamp(Fp)}});
seed();try{drawMini()}catch(e){}}
upd();
})();
// ---------- улица без машины: на её месте лавка, урна, ёлка и сугроб ----------
(function(){const P=window.P7,K=P&&P._K;if(!K||!K.item)return;const _it=K.item;
K.item=function(a,...r){if(a&&a[0]==='car'){if(a[1]===20&&a[2]===74){[['bench',20,73,29,79,'ЛАВКА'],['bin',30,72,33.5,80],['tree',22,80,30,96]].forEach(b=>_it.call(this,b,...r));return _it.call(this,['snowpile',31,86,37,90],...r)}
if(a[1]===62&&a[2]===72)return _it.call(this,['snowpile',62,80,84,88],...r)}return _it.call(this,a,...r)};
try{STREET_BLOCKS.push({x1:20,y1:73,x2:33.5,y2:80})}catch(e){}
if(N.evNote&&N.evNote.t)N.evNote.t=N.evNote.t.replace('Под дворником машины','На скамейке у остановки')})();
