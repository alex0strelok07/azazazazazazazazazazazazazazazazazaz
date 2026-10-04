// Панель №7 — этап 5 (часть 4): взаимодействия Кирилла, Жени и совместные, анимации реакций,
// предметы в руках и характер (настроение лица) у NPC в диалогах.
(function(){'use strict';
const P=window.P7;if(!P||!P.stage)return;
const NM={kirill:'Кирилл',zhenya:'Женя'};
const other=w=>w==='kirill'?'zhenya':'kirill';
const css=document.createElement('style');css.textContent=`
.p7ch .p7s{transform-origin:50% 100%}
.p7ch.a-shake .p7s{animation:p7shake .5s ease-in-out}
.p7ch.a-jump .p7s{animation:p7jump .55s cubic-bezier(.3,.7,.3,1)}
.p7ch.a-tremble .p7s{animation:p7tremble .6s linear}
.p7ch.a-sink .p7s{animation:p7sink 1.1s ease-in-out}
.p7ch.a-lift .p7s{animation:p7lift 1.6s ease-in-out}
.p7ch.a-lean .p7s{animation:p7lean 1.2s ease-out forwards}
@keyframes p7shake{0%,100%{rotate:0deg}20%{rotate:-2.5deg}40%{rotate:2.5deg}60%{rotate:-1.5deg}80%{rotate:1deg}}
@keyframes p7jump{0%,100%{translate:0 0}40%{translate:0 -4vh}70%{translate:0 .6vh}}
@keyframes p7tremble{0%,100%{translate:0 0}10%,50%,90%{translate:-5px 0}30%,70%{translate:5px 0}}
@keyframes p7sink{0%,100%{translate:0 0}50%{translate:0 2.4vh}}
@keyframes p7lift{0%,100%{translate:0 0;rotate:0deg}35%,65%{translate:0 -9vh;rotate:-5deg}}
@keyframes p7lean{to{rotate:var(--lean,3deg)}}
.p7heart{position:absolute;bottom:50vh;font-size:34px;color:#f2c4cc;opacity:0;pointer-events:none;animation:p7heart 1.8s ease-out forwards;text-shadow:0 0 12px rgba(242,196,204,.6)}
@keyframes p7heart{0%{opacity:0;transform:translateY(0) scale(.6)}20%{opacity:1}100%{opacity:0;transform:translateY(-22vh) scale(1.2)}}
.p7snow{position:absolute;width:22px;height:22px;margin-left:-11px;border-radius:50%;background:#efe6cf;bottom:48vh;pointer-events:none;animation:p7throw .7s ease-in forwards}
@keyframes p7throw{0%{transform:translate(0,0)}50%{transform:translate(calc(var(--dx)/2),-12vh)}100%{transform:translate(var(--dx),0);opacity:.15}}`;
document.head.appendChild(css);
// ---------- взаимодействия ----------
// [ключ, кнопка, значок, текст рассказчика, ответ, анимация, где (in/out), кто отвечает, лица]
const ACTS={
kirill:[
['Warm','Согреть Жене руки','🧤','Кирилл берёт Женины ладони в свои и дышит на них, пока пальцы не перестают быть ледяными.','Ты как печка. Можно я так всю зиму буду греться?','close',0,'zhenya'],
['HatFix','Поправить Жене шапку','🧶','Кирилл поправляет сползшую Жене на глаза шапку и заправляет под неё выбившуюся прядь.','Ну вот, теперь я снова вижу мир. И тебя заодно.','close','out','zhenya'],
['Lift','Подхватить Женю на руки','⤴','Кирилл неожиданно подхватывает Женю на руки и делает с ней круг. Женя визжит и хватается за его шею.','Кирилл! Поставь меня! …Ладно, ещё один круг.','close lift',0,'zhenya',{zhenya:'surprised',kirill:'happy'}],
['Joke','Рассмешить Женю','🤡','Кирилл с серьёзным лицом пародирует диктора прогноза погоды: «В ближайшие пять лет ожидается ноябрь».','Ха-ха! Прекрати, у меня щёки замёрзли смеяться!','jump',0,'zhenya',{zhenya:'happy',kirill:'determined'}]],
zhenya:[
['Arm','Взять Кирилла под руку','🤝','Женя берёт Кирилла под руку и прижимается к нему плечом.','Так и теплее, и не так скользко. Не отпускай.','close',0,'kirill'],
['Shoulder','Положить голову на плечо','💤','Женя кладёт голову Кириллу на плечо и ненадолго закрывает глаза.','Устала? Стой так сколько хочешь. Я никуда не спешу.','close lean',0,'kirill',{zhenya:'happy',kirill:'neutral'}],
['Scarf','Поправить Кириллу шарф','🧣','Женя перевязывает Кириллу шарф потуже, чтобы не продувало горло, и подтыкает концы под пальто.','Спасибо, мам. …Шучу! Спасибо, Жень.','close','out','kirill'],
['Tea','Заварить Кириллу чай','☕','Женя наливает Кириллу горячий чай с сахаром и ставит кружку прямо ему в ладони.','Три ложки сахара? Ты меня слишком хорошо знаешь.','close','in','kirill']],
both:[
['Hands','Взяться за руки','✋','Кирилл и Женя молча берутся за руки. Варежка в варежке.','Пошли дальше так, ладно?','close',0,0],
['Laugh','Вспомнить смешное','😄','Кирилл и Женя вспоминают, как в восьмом классе прогуляли химию и попались директору прямо у ларька. Оба хохочут до слёз.','Его лицо я не забуду никогда. «А вот и наши химики!»','jump',0,0],
['Snow','Поиграть в снежки','❄','Кирилл и Женя устраивают короткую перестрелку снежками. Снег летит за шиворот обоим.','Всё, сдаюсь! У меня в рукаве целый сугроб!','snow','out',0],
['Dance','Потанцевать под радио','♪','По радио играет что-то медленное. Кирилл и Женя неловко топчутся посреди комнаты, потом смеются и танцуют уже по-настоящему.','Ты мне на ногу наступил. Дважды. Но это было здорово.','close','in','zhenya'],
['Window','Смотреть в окно на снег','☁','Кирилл и Женя стоят у окна и смотрят, как под фонарём кружится снег. Никто не говорит ни слова.','Знаешь… с тобой даже ноябрь не такой страшный.','close lean','in',0,{kirill:'neutral',zhenya:'neutral'}]]};
const ALL={};
for(const grp in ACTS)ACTS[grp].forEach(a=>{const o={k:a[0],label:a[1],ic:a[2],t:a[3],r:a[4],anim:a[5],where:a[6]||'',by:a[7]||'',faces:a[8]||{kirill:'happy',zhenya:'happy'},grp};ALL[o.k]=o;
N['bx'+o.k]={w:'none',s:'Рассказчик',t:o.t,next:'bx'+o.k+'R',p7act:o.k,p7anim:o.anim,faces:o.faces};
N['bx'+o.k+'R']={w:'zhenya',s:'Женя',e:'happy',t:o.r,next:'bondBack',p7actR:o.k,p7anim:'close hearts'}});
const ORIG=(N.bondMenu&&N.bondMenu.c||[]).slice();
N.bxSoft={w:'none',s:'Рассказчик',t:'Нежности. Что сделать?',c:ORIG.filter(c=>c[1]!=='bondBack').concat([['Назад','bondMenu','←']])};
N.bxSolo={w:'none',s:'Рассказчик',t:'',c:[]};
N.bxJoint={w:'none',s:'Рассказчик',t:'Что сделать вдвоём?',c:[]};
let actor='kirill';
const who=()=>{try{return P.who()||'kirill'}catch(e){return'kirill'}};
const indoorBond=()=>{try{return !!P.inApt(N[P.bondReturn]||N.bondMenu)}catch(e){return false}};
function dyn(x,o){if(P.dyn)P.dyn(x,o);else Object.assign(x,o)}
function prep(){const x=N[id];if(!x)return;
if(id==='bondMenu'&&ORIG.length){const w=who();x.c=[['Нежности: обнять, поцеловать, погладить','bxSoft','♡'],['Только '+NM[w]+'…','bxSolo','★'],['Вдвоём','bxJoint','👫'],ORIG.find(c=>c[1]==='bondBack')||['Назад','bondBack','←']]}
if(!/^bx/.test(id))return;
const bm=N.bondMenu||{};x.room=bm.room;x.scene=bm.scene;const ind=indoorBond();
if(id==='bxSolo'){const w=who();x.t='Что сделает '+NM[w]+'?';x.c=ACTS[w].filter(o=>!o[6]||(o[6]==='in')===ind).map(o=>[o[1],'bx'+o[0],o[2]]).concat([['Назад','bondMenu','←']])}
if(id==='bxJoint')x.c=ACTS.both.filter(o=>!o[6]||(o[6]==='in')===ind).map(o=>[o[1],'bx'+o[0],o[2]]).concat([['Назад','bondMenu','←']]);
if(x.p7act)actor=who();
if(x.p7actR){const o=ALL[x.p7actR];const sp=o.by||other(actor);dyn(x,{t:o.r,s:NM[sp],w:sp});x.e='happy';setTimeout(()=>{try{P.toast('💕')}catch(e){}},60)}}
// ---------- характер и предметы NPC ----------
const MOOD={michalych:'determined',shura:'worried',nyura:'worried',beggar:'sad',drunk:'happy',gopnik:'angry',police:'determined',controller:'determined',guard:'determined',kid:'happy',musician:'happy',accordion:'happy',stranger:'worried',carman:'worried',veteran:'sad',chess:'determined',leather:'determined',teen:'happy',klava:'worried',stepanych:'sad'};
const PROP={vendor:'bag',seller:'bag',klava:'avoska',nyura:'avoska',shura:'avoska',pharm:'box',kiosk:'paper',petrovich:'paper',arkady:'paper',gosha:'paper',musician:'guitar',accordion:'accordion',beggar:'cup',drunk:'bottle',student:'books',irina:'books',teen:'phone',teen2:'phone',manager:'phone',police:'baton',guard:'torch',controller:'ticket',driver:'keys',chess:'pawn',kid:'snowball',ushanka:'thermos',stepanych:'thermos',marina:'folder',gena:'wrench',tolik:'wrench',valya:'ladle',nina:'knit',man:'briefcase',carman:'wallet',pick:'wallet',leather:'cig',gopnik:'cig',michalych:'cig',semyon:'books',lyuda:'cup',roma:'snowball'};
const HOLD=['neutral','talk','determined','sad'];
const CR='#efe6cf',INK='#0b0b0a',FA='rgba(239,230,207,.45)';
function mixc(c,a){c=(c||'#444').replace('#','');if(c.length===3)c=c.split('').map(v=>v+v).join('');const n=parseInt(c.slice(0,6),16)||0,k=1-a;return'rgb('+((n>>16&255)*k|0)+','+((n>>8&255)*k|0)+','+((n&255)*k|0)+')'}
let g;
const S=(w,c)=>{g.lineWidth=w;g.strokeStyle=c||CR;g.stroke()};
const Fl=(f,w)=>{g.fillStyle=f;g.fill();S(w||4)};
const R=(x,y,w,h,r)=>{g.beginPath();if(g.roundRect)g.roundRect(x,y,w,h,r||0);else g.rect(x,y,w,h)};
const E=(x,y,a,b)=>{g.beginPath();g.ellipse(x,y,a,b,0,0,Math.PI*2)};
const Ln=(p,w,c)=>{g.beginPath();g.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)g.lineTo(p[i],p[i+1]);S(w||3,c)};
const DRAW={
bag:(x,y)=>{Ln([x-14,y+4,x-12,y+40],3);Ln([x+14,y+4,x+12,y+40],3);R(x-46,y+36,92,100,8);Fl('#2a2620');Ln([x-30,y+72,x+30,y+72],2,FA)},
avoska:(x,y)=>{Ln([x-10,y+6,x-22,y+40],3);Ln([x+10,y+6,x+22,y+40],3);E(x-50,y+96,18,18);Fl('#3a2a20',3);E(x-10,y+108,22,20);Fl('#4a3a24',3);E(x+28,y+92,16,30);Fl('#3a3424',3);g.beginPath();g.moveTo(x-34,y+40);g.quadraticCurveTo(x-90,y+150,x,y+150);g.quadraticCurveTo(x+80,y+150,x+34,y+40);S(3);for(let i=-2;i<=2;i++)Ln([x+i*16,y+44,x+i*24,y+146],1.6,FA);for(let j=0;j<4;j++)Ln([x-50+j*4,y+70+j*22,x+50-j*4,y+70+j*22],1.6,FA)},
box:(x,y)=>{R(x-56,y-62,104,70,6);Fl(INK);Ln([x-4,y-44,x-4,y-12],6);Ln([x-20,y-28,x+12,y-28],6)},
paper:(x,y)=>{g.save();g.translate(x,y);g.rotate(-.12);R(-30,-150,104,170,3);Fl('#16150f');Ln([-18,-130,60,-130],5);for(let i=0;i<7;i++)Ln([-18,-108+i*16,i%3?60:20,-108+i*16],2,FA);R(26,-100,34,30,0);S(2,FA);g.restore()},
guitar:(x,y)=>{E(x-70,y+170,120,96);Fl(INK,5);E(x-70,y+160,30,30);S(3);g.beginPath();g.moveTo(x-6,y+40);g.lineTo(x+86,y-260);S(26,CR);S(18,'#2a2016');R(x+68,y-320,40,70,6);Fl('#2a2016');for(let i=0;i<3;i++)Ln([x-60-i*6,y+150,x+90-i*4,y-260],1.2,FA)},
accordion:(x,y)=>{R(x-190,y-50,70,130,8);Fl('#4a1e1e');R(x-60,y-50,70,130,8);Fl('#4a1e1e');g.beginPath();g.moveTo(x-120,y-46);for(let i=0;i<6;i++){g.lineTo(x-110+i*10,y-46+(i%2?0:0))}R(x-120,y-46,60,122,0);Fl('#1a1612',3);for(let i=1;i<6;i++)Ln([x-120+i*10,y-44,x-120+i*10,y+74],2.5);for(let i=0;i<5;i++){E(x-170,y-24+i*22,6,6);Fl(CR,1)}},
cup:(x,y)=>{R(x-34,y-70,68,64,6);Fl('#3a3832');E(x,y-70,34,9);Fl(INK,3);E(x-8,y-72,7,3);g.fillStyle=CR;g.fill();E(x+10,y-70,7,3);g.fill()},
bottle:(x,y)=>{R(x-17,y-120,34,128,10);Fl('#1d2a1d');R(x-8,y-160,16,44,3);Fl('#1d2a1d');R(x-17,y-80,34,36,0);Fl('#d6cba8',2);Ln([x-9,y-62,x+9,y-62],2,INK)},
books:(x,y)=>{[[0,'#3a2a2a'],[-30,'#2a3a46'],[-58,'#3a3424']].forEach((b,i)=>{R(x-66+i*4,y-32+b[0],128,30,3);Fl(b[1]);Ln([x+40+i*4,y-28+b[0],x+40+i*4,y-6+b[0]],2,FA)})},
phone:(x,y)=>{R(x-22,y-80,44,84,7);Fl(INK);R(x-15,y-70,30,56,3);g.fillStyle='rgba(200,225,240,.55)';g.fill()},
baton:(x,y)=>{g.beginPath();g.moveTo(x-6,y-30);g.lineTo(x+18,y+180);S(22,CR);S(14,'#1a1a1a');Ln([x-14,y+20,x+12,y+14],4)},
torch:(x,y)=>{R(x-16,y-96,32,110,5);Fl('#2a2a2a');R(x-22,y-120,44,30,6);Fl('#2a2a2a');E(x,y-122,18,7);Fl('#f0e2a0',3);g.beginPath();g.moveTo(x-18,y-128);g.lineTo(x-70,y-260);g.lineTo(x+70,y-260);g.lineTo(x+18,y-128);g.fillStyle='rgba(240,226,160,.12)';g.fill()},
ticket:(x,y)=>{g.save();g.translate(x,y);g.rotate(-.2);R(-10,-86,80,46,3);Fl('#2a2620');Ln([2,-72,58,-72],2,FA);Ln([2,-58,40,-58],2,FA);E(52,-52,5,5);S(2);g.restore()},
keys:(x,y)=>{E(x+4,y+40,14,14);S(4);Ln([x+12,y+52,x+20,y+92,x+30,y+92],5);Ln([x-6,y+52,x-16,y+96,x-26,y+96],5)},
pawn:(x,y)=>{E(x,y-86,14,14);Fl(CR,3);g.beginPath();g.moveTo(x-12,y-72);g.lineTo(x-24,y-24);g.lineTo(x+24,y-24);g.lineTo(x+12,y-72);Fl(CR,3)},
snowball:(x,y)=>{E(x-2,y-32,28,26);Fl('#d8d2c2',4);Ln([x-14,y-40,x-6,y-44],2,INK);Ln([x+4,y-24,x+12,y-26],2,INK)},
thermos:(x,y)=>{R(x-22,y-130,44,150,12);Fl('#33402f');R(x-26,y-150,52,26,6);Fl('#5a2a22');Ln([x-22,y-60,x+22,y-60],2,FA)},
folder:(x,y)=>{g.save();g.translate(x,y);g.rotate(.1);R(-64,-110,116,150,4);Fl('#3a3428');R(-44,-90,76,22,2);Fl('#d6cba8',2);g.restore()},
wrench:(x,y)=>{g.beginPath();g.moveTo(x,y+10);g.lineTo(x+14,y-140);S(22,CR);S(14,'#3a3a3a');g.beginPath();g.arc(x+15,y-160,22,Math.PI*.15,Math.PI*1.85);S(8,CR)},
ladle:(x,y)=>{g.beginPath();g.moveTo(x,y+10);g.lineTo(x-12,y-130);S(14,CR);S(8,'#6a6a62');E(x-14,y-152,34,20);Fl('#6a6a62')},
knit:(x,y)=>{E(x-80,y+30,30,28);Fl('#7a2a3a',3);for(let i=-1;i<=1;i++)Ln([x-100,y+30+i*12,x-60,y+30+i*8],2,FA);Ln([x-40,y-70,x+40,y+40],4);Ln([x+40,y-70,x-30,y+40],4);R(x-30,y-40,60,40,6);Fl('#7a2a3a',3)},
briefcase:(x,y)=>{g.beginPath();g.arc(x,y+30,20,Math.PI,0);S(6);R(x-70,y+30,140,96,8);Fl('#2a2016');Ln([x-70,y+58,x+70,y+58],2,FA);R(x-8,y+50,16,14,2);Fl(CR,2)},
wallet:(x,y)=>{R(x-34,y-46,68,44,5);Fl('#3a2618');Ln([x-34,y-26,x+34,y-26],2,FA)},
cig:(x,y)=>{Ln([x+20,y-8,x+56,y-16],6);E(x+58,y-16,3,3);g.fillStyle='#e06a4f';g.fill();g.beginPath();g.moveTo(x+60,y-24);g.bezierCurveTo(x+40,y-60,x+80,y-90,x+60,y-130);S(2,FA)}};
function prop(ctx,t,L){g=ctx;const sw=L.fem?160:188,sx=sw-26,hx=372,hy=612;g.save();g.lineJoin='round';g.lineCap='round';
g.beginPath();g.moveTo(300+sx,500);g.quadraticCurveTo(300+sx+8,700,hx+6,hy+12);S(59,CR);S(50,mixc(L.top,.72));
try{DRAW[t](hx,hy)}catch(e){}
E(hx,hy,24,22);Fl(INK,4);Ln([hx-8,hy-12,hx-8,hy+10],2.5);Ln([hx+6,hy-14,hx+6,hy+12],2.5);g.restore()}
P.stage.props=PROP;P.stage.mood=MOOD;
// ---------- анимации на сцене ----------
const ANIMS=['a-shake','a-jump','a-tremble','a-sink','a-lift','a-lean'];
const EXA={angry:'a-shake',surprised:'a-jump',happy:'a-jump',afraid:'a-tremble',sad:'a-sink'};
function play(el,c){if(!el)return;el.classList.remove(c);void el.offsetWidth;el.classList.add(c)}
function hearts(stage,l){for(let i=0;i<6;i++){const h=document.createElement('span');h.className='p7heart';h.textContent=i%2?'♡':'♥';h.style.left='calc('+l+'% + '+((i-2.5)*26)+'px)';h.style.animationDelay=(i*.16)+'s';stage.appendChild(h);setTimeout(()=>h.remove(),2800)}}
function snow(stage,a,b){const W=stage.clientWidth||1000;for(let i=0;i<4;i++){const s=document.createElement('span');s.className='p7snow';const from=i%2?b:a,to=i%2?a:b;s.style.left=from+'%';s.style.setProperty('--dx',((to-from)/100*W).toFixed(0)+'px');s.style.animationDelay=(i*.35)+'s';stage.appendChild(s);setTimeout(()=>s.remove(),2400)}}
let lastId=null;
function post(){const x=N[id]||{};const stage=$('p7stage');if(!stage)return;const els=[...stage.querySelectorAll('.p7ch')].filter(e=>!e.classList.contains('out'));
let indoor=false;try{indoor=!!P.inApt(x)}catch(e){}
els.forEach(el=>{const k=el.dataset.k,sig=el.dataset.sig||'';if(!sig)return;const pr=sig.split('|'),e=pr[2],lk=+pr[3]||0,hero=k==='kirill'||k==='zhenya';
let want=e;if(x.faces&&x.faces[k])want=x.faces[k];else if(!hero&&e==='neutral'&&!el.classList.contains('spk')&&MOOD[k])want=MOOD[k];
const my=sig+'>'+want+(hero?'':'>'+(PROP[k]||''));if(el._my===my)return;
const L=hero?P.stage.heroLook(k,indoor):P.stage.npcLook(k);const c=el.querySelector('canvas');if(!c)return;const ctx=c.getContext('2d');
if(want!==e||el._mod)P.stage.fig(ctx,L,want,want,lk);el._mod=want!==e;
if(!hero&&PROP[k]&&HOLD.includes(want)){prop(ctx,PROP[k],L);el._mod=true}
el._my=my});
if(lastId===id)return;lastId=id;
els.forEach(el=>{ANIMS.forEach(a=>el.classList.remove(a));el.style.removeProperty('--lean')});
const A=(x.p7anim||'').split(' ').filter(Boolean),K=els.find(e=>e.dataset.k==='kirill'),Z=els.find(e=>e.dataset.k==='zhenya');
const pos=el=>parseFloat(el.style.left)||50;
if(A.includes('close')&&K&&Z&&els.length===2){const kl=pos(K)<pos(Z);K.style.left=(kl?39:61)+'%';Z.style.left=(kl?61:39)+'%'}
if(A.includes('lift'))play(Z,'a-lift');
if(A.includes('lean')&&K&&Z){Z.style.setProperty('--lean',(pos(Z)>pos(K)?-4:4)+'deg');play(Z,'a-lean');K.style.setProperty('--lean',(pos(K)>pos(Z)?-2:2)+'deg');play(K,'a-lean')}
if(A.includes('jump'))els.forEach((el,i)=>setTimeout(()=>play(el,'a-jump'),i*140));
if(A.includes('hearts')&&K&&Z)setTimeout(()=>hearts(stage,(pos(K)+pos(Z))/2),250);
if(A.includes('snow')&&K&&Z)snow(stage,pos(K),pos(Z));
if(!A.length){const s=els.find(e=>e.classList.contains('spk'));if(s){const a=EXA[(s.dataset.sig||'').split('|')[2]];if(a)setTimeout(()=>play(s,a),60)}}}
const _r=render;
render=function(...a){try{prep()}catch(e){console.warn('p7 bond',e)}const out=_r.apply(this,a);try{post()}catch(e){console.warn('p7 anim',e)}return out};
try{post()}catch(e){}
})();
