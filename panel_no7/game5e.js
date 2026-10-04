// Панель №7 — единый живописный стиль персонажей (по референсу): один шаблон, одна камера, один свет
// для героев и всех NPC; новые эмоции; поддержка готовых PNG-портретов (папка chars/).
// Подключается после game5b.js и до game5c.js — заменяет отрисовку фигуры P.art.fig.
(function(){'use strict';
const P=window.P7;if(!P||!P.art)return;
const A=P.art,W=A.W||600,H=A.H||800,cx=300,BR=A.BR,hash=A.hash||(s=>{let h=7;for(const c of String(s))h=(h*31+c.charCodeAt(0))>>>0;return h});
Object.assign(BR,{annoyed:[9,-2],tired:[-3,4],thinking:[4,-6],embarrassed:[-8,5],smirk:[3,-3],crying:[-12,8]});
const ALIAS={irritated:'annoyed',thoughtful:'thinking',joy:'happy',scared:'afraid',fear:'afraid',shy:'embarrassed',calm:'neutral'};
const PAL={line:'#1d1a17',ink:'#2a2622',faint:'rgba(29,26,23,.45)',skin:'#cdb9a3'};
A.PAL=PAL;A.EMOTIONS=Object.keys(BR);A.ALIAS=ALIAS;
const LINE=PAL.line;
function rgb(c){c=String(c||'#555');if(c[0]!=='#'){const m=c.match(/\d+/g)||[85,85,85];return m.slice(0,3).map(Number)}c=c.slice(1);if(c.length===3)c=c.split('').map(v=>v+v).join('');const n=parseInt(c.slice(0,6),16)||0;return[n>>16&255,n>>8&255,n&255]}
const hex=a=>'#'+a.map(v=>Math.max(0,Math.min(255,v|0)).toString(16).padStart(2,'0')).join('');
function sh(c,k){return hex(rgb(c).map(v=>k<0?v*(1+k):v+(255-v)*k))}
function mute(c,d,l){const a=rgb(c),m=(a[0]+a[1]+a[2])/3;return sh(hex(a.map(v=>v+(m-v)*d)),l)}
function rng(s){s=(s>>>0)||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
const SKIN=['#d4c0aa','#cbb49c','#d9c8b4','#c0a68e','#cfb9a2','#c7ae95'];
const EYES=['#4a3a2a','#55606a','#4d5a44','#3a2e24','#66707a','#5a4632'];
const HERO={kirill:{skin:'#ccb59e',eye:'#5d6b72',inner:'#2e2a28',scarf:'#6a3030'},zhenya:{skin:'#d6c3ae',eye:'#5a4632',inner:'#5e2c32',scarf:'#7a3a3a'}};
const KIDS=/^(kid|teen|teen2|student|roma)$/;
function look(L){const k=L.key||L.n||'x',r=rng(hash(k)),h=HERO[k]||{};
return{r,skin:h.skin||mute(SKIN[r()*SKIN.length|0],.1,L.old?-.04:0),eye:h.eye||EYES[r()*EYES.length|0],
top:mute(L.top||'#4a4a4a',.22,.1),hair:mute(L.hair||'#333',.15,.04),inner:h.inner||mute(L.top||'#444',.3,-.35),
scarf:h.scarf||mute(L.hatc||'#6a3a34',.2,0),hatc:mute(L.hatc||L.top||'#444',.2,.05),
sw:(L.fem?148:174)+((L.rx||88)-88)*1.6+(KIDS.test(k)?-16:0)+(L.old?-6:0),kid:KIDS.test(k)}}
// ---------- готовые PNG-портреты: chars/list.json = ["zhenya_happy.png", "kirill.png", ...] ----------
const IMG={};A.png=IMG;
function refresh(){document.querySelectorAll('.p7ch').forEach(el=>{const c=el._c||el.querySelector('canvas');if(!c)return;const pr=(el.dataset.sig||'').split('|'),k=el.dataset.k;if(!pr[2])return;
let ind=false;try{ind=!!P.inApt(N[id])}catch(e){}const hero=k==='kirill'||k==='zhenya';const L=hero?A.heroLook(k,ind):A.npcLook(k);A.fig(c.getContext('2d'),L,pr[2],pr[2],+pr[3]||0);el._my=null})}
try{fetch('chars/list.json').then(r=>r.ok?r.json():[]).then(list=>{let n=list.length;const done=()=>{if(--n<=0)refresh()};list.forEach(f=>{const im=new Image();im.onload=()=>{IMG[String(f).replace(/\.png$/i,'')]=im;done()};im.onerror=done;im.src='chars/'+f})}).catch(()=>{})}catch(e){}
function pngFor(L,ex){const k=L.key;if(!k)return null;const ind=L.out==='sweater'&&(k==='kirill'||k==='zhenya')?'home':'street';
return IMG[k+'_'+ind+'_'+ex]||IMG[k+'_'+ex]||(ex==='talk'&&(IMG[k+'_'+ind+'_neutral']||IMG[k+'_neutral']))||IMG[k+'_'+ind]||IMG[k]||null}
// ---------- примитивы ----------
let g,R;
function shape(p,base,box,w,tex){g.save();g.clip(p);const gr=g.createLinearGradient(box[0],box[1],box[2],box[3]);gr.addColorStop(0,sh(base,.16));gr.addColorStop(.5,base);gr.addColorStop(1,sh(base,-.36));g.fillStyle=gr;g.fillRect(0,0,W,H);if(tex)tex();g.restore();
if(w){g.save();g.translate(1.6,1.1);g.lineWidth=w*.6;g.strokeStyle='rgba(29,26,23,.35)';g.stroke(p);g.restore();g.lineWidth=w;g.strokeStyle=LINE;g.stroke(p)}}
function hatch(n,x0,y0,x1,y1,col,len,ang,wd){for(let i=0;i<n;i++){const x=x0+R()*(x1-x0),y=y0+R()*(y1-y0),a=ang+(R()-.5)*.35,l=len*(.6+R()*.8);g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.lineWidth=(wd||2)*(.5+R());g.strokeStyle=col;g.stroke()}}
function ln(pts,w,c){g.beginPath();g.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)g.lineTo(pts[i],pts[i+1]);g.lineWidth=w;g.strokeStyle=c||LINE;g.stroke()}
function qc(x0,y0,qx,qy,x1,y1,w,c){g.beginPath();g.moveTo(x0,y0);g.quadraticCurveTo(qx,qy,x1,y1);g.lineWidth=w;g.strokeStyle=c||LINE;g.stroke()}
function el(x,y,a,b,rot){const p=new Path2D();p.ellipse(x,y,a,b,rot||0,0,Math.PI*2);return p}
const rgba=(c,a)=>{const v=rgb(c);return`rgba(${v[0]},${v[1]},${v[2]},${a})`};
// ---------- волосы и головные уборы ----------
function strands(p,base,y0,y1,n){g.save();g.clip(p);hatch(n||70,cx-130,y0,cx+130,y1,rgba(sh(base,.28),.55),46,Math.PI/2,2.2);hatch(n||70,cx-130,y0,cx+130,y1,rgba(sh(base,-.45),.6),40,Math.PI/2+.15,2);g.restore()}
function backHair(L,V,hy,rx,ry){const hs=L.hs,c=V.hair;let p=null;
if(hs==='long'){p=new Path2D();p.moveTo(cx-rx-6,hy-50);p.bezierCurveTo(cx-rx-34,hy+60,cx-rx-30,hy+170,cx-rx-8,hy+205);p.quadraticCurveTo(cx,hy+225,cx+rx+8,hy+205);p.bezierCurveTo(cx+rx+30,hy+170,cx+rx+34,hy+60,cx+rx+6,hy-50);p.closePath()}
else if(hs==='bun'){p=el(cx+6,hy-ry-6,40,34)}
else if(hs==='curly'){p=new Path2D();for(let i=0;i<14;i++){const a=Math.PI*(.95+i/13*1.1);p.moveTo(cx+Math.cos(a)*(rx+14)+22,hy-20+Math.sin(a)*(ry+10));p.arc(cx+Math.cos(a)*(rx+14),hy-20+Math.sin(a)*(ry+10),22,0,Math.PI*2)}}
else if(hs==='scarf'){p=new Path2D();p.moveTo(cx-rx-22,hy-30);p.bezierCurveTo(cx-rx-30,hy-ry*1.5,cx+rx+30,hy-ry*1.5,cx+rx+22,hy-30);p.bezierCurveTo(cx+rx+40,hy+90,cx+rx+30,hy+170,cx+rx-10,hy+190);p.lineTo(cx-rx+10,hy+190);p.bezierCurveTo(cx-rx-30,hy+170,cx-rx-40,hy+90,cx-rx-22,hy-30);shape(p,V.hatc,[cx-rx,hy-ry,cx+rx,hy+190],4);return}
if(p){shape(p,sh(c,-.12),[cx-rx,hy-ry,cx+rx,hy+200],4,()=>strands(p,c,hy-ry,hy+220,60))}}
function frontHair(L,V,hy,rx,ry){const hs=L.hs,c=V.hair;if(hs==='scarf')return scarfFront(V,hy,rx,ry);
const p=new Path2D(),top=hy-ry*1.02,fl=hy-ry*.42;
if(hs==='bald'){p.moveTo(cx-rx-4,hy+5);p.quadraticCurveTo(cx-rx-6,hy-ry*.55,cx-rx*.55,hy-ry*.8);p.quadraticCurveTo(cx-rx*.7,hy-ry*.4,cx-rx+8,hy+8);p.closePath();p.moveTo(cx+rx+4,hy+5);p.quadraticCurveTo(cx+rx+6,hy-ry*.55,cx+rx*.55,hy-ry*.8);p.quadraticCurveTo(cx+rx*.7,hy-ry*.4,cx+rx-8,hy+8);p.closePath()}
else{p.moveTo(cx-rx-7,hy+(hs==='long'?60:8));p.bezierCurveTo(cx-rx-14,top-40,cx+rx+14,top-40,cx+rx+7,hy+(hs==='long'?60:8));
if(hs==='messy'){let x=cx+rx+4;const st=(2*rx+8)/7;for(let i=0;i<7;i++){const y=fl+(i%2?-14:12)+(R()-.5)*8;p.quadraticCurveTo(x-st*.3,fl-24,x-st*.55,y+18);x-=st;p.lineTo(x,fl-6)}}
else if(hs==='long'){p.quadraticCurveTo(cx+rx-6,fl-10,cx-12,top+30);p.quadraticCurveTo(cx-rx*.6,fl+4,cx-rx+2,hy+40);}
else if(hs==='curly'){for(let i=0;i<6;i++){const x=cx+rx-i*(2*rx/6);p.arc(x-rx/6,fl,rx/6+2,0,Math.PI,false)}}
else if(hs==='bun'){p.quadraticCurveTo(cx+rx*.4,fl-26,cx,fl-30);p.quadraticCurveTo(cx-rx*.4,fl-26,cx-rx+2,hy+4)}
else{p.quadraticCurveTo(cx+rx*.5,fl+8,cx+8,fl-6);p.quadraticCurveTo(cx-rx*.4,fl-16,cx-rx+2,hy+4)}
p.closePath()}
shape(p,c,[cx-rx,top,cx+rx*.6,fl+40],4,()=>strands(p,c,top-30,hy+80,80));
if(hs==='long'){[-1,1].forEach(s=>{const q=new Path2D();q.moveTo(cx+s*(rx-4),hy-20);q.quadraticCurveTo(cx+s*(rx+18),hy+90,cx+s*(rx+6),hy+175);q.lineTo(cx+s*(rx-22),hy+150);q.quadraticCurveTo(cx+s*(rx-8),hy+60,cx+s*(rx-20),hy);q.closePath();shape(q,c,[cx+s*rx,hy,cx+s*rx,hy+170],3.5,()=>strands(q,c,hy-20,hy+180,30))})}}
function scarfFront(V,hy,rx,ry){const p=new Path2D();p.moveTo(cx-rx-14,hy+60);p.bezierCurveTo(cx-rx-26,hy-ry*1.45,cx+rx+26,hy-ry*1.45,cx+rx+14,hy+60);p.quadraticCurveTo(cx+rx-6,hy-ry*.2,cx,hy-ry*.55);p.quadraticCurveTo(cx-rx+6,hy-ry*.2,cx-rx-14,hy+60);p.closePath();
shape(p,V.hatc,[cx-rx,hy-ry,cx+rx,hy],4,()=>{for(let i=0;i<26;i++){g.beginPath();g.arc(cx-rx+R()*rx*2,hy-ry*1.1+R()*ry*1.1,3+R()*3,0,7);g.fillStyle=rgba(sh(V.hatc,.45),.55);g.fill()}});
const k=new Path2D();k.moveTo(cx+rx*.55,hy+ry+20);k.quadraticCurveTo(cx+rx*.95,hy+ry+6,cx+rx*.9,hy+ry+48);k.quadraticCurveTo(cx+rx*.7,hy+ry+42,cx+rx*.55,hy+ry+20);shape(k,V.hatc,[0,hy+ry,0,hy+ry+50],3.5);shape(el(cx+rx*.6,hy+ry+16,12,10),sh(V.hatc,-.1),[0,hy+ry,0,hy+ry+30],3.5)}
function hat(L,V,hy,rx,ry){const t=L.hat;if(!t)return;const c=V.hatc,top=hy-ry*1.08;let p=new Path2D();
if(t==='bobhat'||t==='beret'){p.moveTo(cx-rx-12,hy-ry*.38);p.bezierCurveTo(cx-rx-14,top-70,cx+rx+14,top-70,cx+rx+12,hy-ry*.38);p.closePath();
shape(p,c,[cx-rx,top-60,cx+rx,hy-ry*.4],4,()=>{for(let x=cx-rx;x<cx+rx;x+=9)ln([x,top-40,x+4,hy-ry*.3],2,rgba(sh(c,-.4),.5))});
if(t==='bobhat'){const b=new Path2D();b.moveTo(cx-rx-14,hy-ry*.36);b.lineTo(cx+rx+14,hy-ry*.36);b.lineTo(cx+rx+12,hy-ry*.62);b.quadraticCurveTo(cx,hy-ry*.72,cx-rx-12,hy-ry*.62);b.closePath();shape(b,sh(c,-.08),[0,hy-ry*.7,0,hy-ry*.3],4);shape(el(cx+6,top-48,26,22),sh(c,.1),[cx-20,top-70,cx+30,top-26],4)}}
else if(t==='ushanka'){[-1,1].forEach(s=>{const f=new Path2D();f.moveTo(cx+s*(rx-6),hy-30);f.quadraticCurveTo(cx+s*(rx+34),hy+20,cx+s*(rx+16),hy+92);f.quadraticCurveTo(cx+s*(rx-4),hy+86,cx+s*(rx-10),hy+20);f.closePath();shape(f,c,[0,hy-30,0,hy+90],4,()=>hatch(40,cx+s*rx-30,hy-30,cx+s*rx+30,hy+90,rgba(sh(c,.35),.5),12,Math.PI/2,2))});
p.moveTo(cx-rx-18,hy-ry*.3);p.bezierCurveTo(cx-rx-22,top-70,cx+rx+22,top-70,cx+rx+18,hy-ry*.3);p.closePath();shape(p,c,[cx-rx,top-50,cx+rx,hy-ry*.3],4,()=>hatch(110,cx-rx-20,top-60,cx+rx+20,hy-ry*.3,rgba(sh(c,.35),.5),12,Math.PI/2,2))}
else{const vis=t==='police'||t==='cap';const cc=t==='whitecap'?'#d9d4c8':c;p.moveTo(cx-rx-6,hy-ry*.42);p.bezierCurveTo(cx-rx-6,top-(t==='police'?40:60),cx+rx+6,top-(t==='police'?40:60),cx+rx+6,hy-ry*.42);p.closePath();shape(p,cc,[cx-rx,top-50,cx+rx,hy-ry*.4],4);
if(t==='police'){const b=new Path2D();b.rect(cx-rx-6,hy-ry*.62,2*rx+12,26);shape(b,'#6a2a2a',[0,hy-ry*.62,0,hy-ry*.4],3.5);shape(el(cx,hy-ry*.75,12,14),'#b8a46a',[0,hy-ry*.9,0,hy-ry*.6],2.5)}
if(vis){const v=new Path2D();v.moveTo(cx-rx+4,hy-ry*.42);v.quadraticCurveTo(cx,hy-ry*.42+34,cx+rx+30,hy-ry*.36);v.quadraticCurveTo(cx+rx,hy-ry*.48,cx-rx+4,hy-ry*.42);shape(v,sh(cc,-.3),[0,hy-ry*.5,0,hy-ry*.3],3.5)}}}
A._pe={W,H,cx,BR,hash,ALIAS,PAL,LINE,rgb,hex,sh,mute,rng,look,IMG,pngFor,shape,hatch,ln,qc,el,rgba,strands,backHair,frontHair,hat,setG:(c,r)=>{g=c;R=r}};
})();
