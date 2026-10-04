// Панель №7 — этап 5i: иллюстрации нападений на единых моделях (P.CHAR) и плавные переходы между локациями.
(function(){'use strict';
const P=window.P7;if(!P||!P.CHAR)return;
const CH=P.CHAR,game=document.getElementById('game');if(!game)return;
const st=document.createElement('style');st.textContent=`
.fightArt{display:block;width:100%;height:auto;aspect-ratio:520/230;margin:10px 0 4px;border:1px solid #5a3a2a;background:#1b1e22}
#p7fade{position:absolute;inset:0;z-index:60;pointer-events:none;background:#0b0c0b;opacity:0}
#p7fade.on{animation:p7fade .55s ease-out}
@keyframes p7fade{0%{opacity:.9}100%{opacity:0}}
#p7loc{position:absolute;left:50%;top:18px;transform:translateX(-50%);z-index:61;pointer-events:none;padding:6px 16px;border:1px solid #7d6c45;background:rgba(17,20,17,.85);color:#d8cfb6;font:700 13px 'Courier New',monospace;letter-spacing:.14em;opacity:0;transition:opacity .4s}
#p7loc.on{opacity:1}`;document.head.appendChild(st);
// ---------- 1. Нападения ----------
const FOE=[[/Гопник/,['gopnik']],[/Пьян/,['drunk']],[/подрост/i,['teen','teen2']],[/Карман/,['pick']]];
const safe=f=>{try{return f()}catch(e){return null}};
const body=(k,e,lk)=>safe(()=>CH.body(k,false,e,lk));
let cv=null,raf=0,S=null;
function ensure(card){if(cv&&cv.isConnected)return cv;cv=document.createElement('canvas');cv.className='fightArt';cv.width=520;cv.height=230;const t=card.querySelector('.fightText');card.insertBefore(cv,t||null);return cv}
function foesOf(name){for(const [re,k] of FOE)if(re.test(name))return k.filter(x=>P.KZ&&P.KZ.K&&P.KZ.K.NPC?x in P.KZ.K.NPC||true:true);return['gopnik']}
function partyBoth(){const ws=safe(()=>worldState());return !!(ws&&ws.party==='both')}
function begin(ov){const card=ov.querySelector('.fightCard');if(!card)return;ensure(card);const who=safe(()=>P.who())||'kirill';
S={who,other:who==='kirill'?'zhenya':'kirill',both:partyBoth(),foes:foesOf((ov.querySelector('.fightFoe')||{}).textContent||''),t0:performance.now(),hitT:-9,lastW:30,res:null,resT:0,fill:ov.querySelector('.fightFill'),txt:ov.querySelector('.fightText')};
cancelAnimationFrame(raf);raf=requestAnimationFrame(frame)}
function drawFig(g,c,x,yFoot,h,o){if(!c)return;const w=c.width*h/c.height;g.save();g.translate(x,yFoot);if(o.rot)g.rotate(o.rot);if(o.alpha!=null)g.globalAlpha=o.alpha;
g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(0,0,w*.36,6,0,0,Math.PI*2);g.fill();g.drawImage(c,-w/2,-h,w,h);g.restore()}
function bg(g,W,H,t){const sk=g.createLinearGradient(0,0,0,H);sk.addColorStop(0,'#2b3240');sk.addColorStop(.62,'#4a4f58');sk.addColorStop(.63,'#8d9096');sk.addColorStop(1,'#c9ccd1');g.fillStyle=sk;g.fillRect(0,0,W,H);
g.fillStyle='#3a3530';g.fillRect(0,40,150,104);g.fillRect(380,30,140,114);g.fillStyle='#e8c46a';for(let i=0;i<4;i++){g.fillRect(18+i*32,60,14,16);g.fillRect(398+i*30,52,12,15)}
g.fillStyle='rgba(255,255,255,.75)';for(let i=0;i<26;i++){const x=(i*73+t*.02*(1+i%3))%W,y=(i*41+t*.05*(1+i%2))%H;g.fillRect(x,y,2,2)}}
function frame(now){if(!S||!cv||!cv.isConnected)return;const g=cv.getContext('2d'),W=cv.width,H=cv.height,t=now-S.t0;
const w=parseFloat(S.fill&&S.fill.style.width)||0;if(w>S.lastW+.5)S.hitT=t;S.lastW=w;
if(!S.res&&S.txt&&/ДАЛЬШЕ/.test((S.txt.parentNode.querySelector('.fightBtn')||{}).textContent||'')){S.res=/отбил/.test(S.txt.textContent)?'win':'lose';S.resT=t}
bg(g,W,H,t);const foot=H-18,hh=168,since=t-S.hitT,hit=since<180?1-since/180:0,rt=S.res?Math.min(1,(t-S.resT)/700):0;
let he,fe,hx=150,fx=360,hrot=0,frot=0,fa=1;
if(!S.res){he=hit?'angry':'determined';fe=hit?'surprised':'angry';hx+=hit*48;fx+=hit*22;frot=hit*.12}
else if(S.res==='win'){he='happy';fe='afraid';fx+=rt*240;fa=1-rt*.8}
else{he='afraid';fe='smirk';hrot=-rt*1.25;hx-=rt*20}
if(S.both)drawFig(g,body(S.other,S.res==='win'?'happy':'afraid',1),80,foot-4,hh*.94,{});
S.foes.forEach((k,i)=>drawFig(g,body(k,fe,-1),fx+i*58,foot-i*3,hh*(i?.95:1),{rot:frot,alpha:fa}));
drawFig(g,body(S.who,he,1),hx,foot,hh,{rot:hrot});
if(hit){g.save();g.globalAlpha=hit;g.strokeStyle='#ffe08a';g.lineWidth=4;const cx=(hx+fx)/2+20,cy=foot-hh*.62;for(let a=0;a<8;a++){const r1=10,r2=26+hit*12,an=a*Math.PI/4;g.beginPath();g.moveTo(cx+Math.cos(an)*r1,cy+Math.sin(an)*r1);g.lineTo(cx+Math.cos(an)*r2,cy+Math.sin(an)*r2);g.stroke()}g.restore()}
raf=requestAnimationFrame(frame)}
function watch(){const ov=game.querySelector('.fightPanel');if(!ov)return false;let vis=!ov.classList.contains('hidden');if(vis)begin(ov);
new MutationObserver(()=>{const v=!ov.classList.contains('hidden');if(v&&!vis)begin(ov);if(!v&&vis){cancelAnimationFrame(raf);S=null}vis=v}).observe(ov,{attributes:true,attributeFilter:['class']});return true}
if(!watch()){let n=0;const iv=setInterval(()=>{if(watch()||++n>40)clearInterval(iv)},250)}
P.fightArt={begin,foesOf};
// ---------- 2. Переходы между локациями ----------
const fade=document.createElement('div');fade.id='p7fade';game.appendChild(fade);
const lab=document.createElement('div');lab.id='p7loc';game.appendChild(lab);
let lastPlace=null,labT=0;
const placeOf=x=>x?(x.map||x.room||null):null;
const _r=render;
render=function(...a){const out=_r.apply(this,a);try{const x=N[id],pl=placeOf(x);
if(pl&&lastPlace&&pl!==lastPlace&&!P.fighting){fade.classList.remove('on');void fade.offsetWidth;fade.classList.add('on');const name=x.room||'';if(name){lab.textContent=name;lab.classList.add('on');clearTimeout(labT);labT=setTimeout(()=>lab.classList.remove('on'),1600)}}
if(pl)lastPlace=pl}catch(e){}return out};
P.TRANS={fade,label:lab};
})();
