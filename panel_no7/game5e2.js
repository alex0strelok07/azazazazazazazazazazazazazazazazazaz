// Панель №7 — живописный стиль (часть 2): лица, эмоции, одежда, сборка фигуры. Подключается после game5e.js, до game5c.js.
(function(){'use strict';
const P=window.P7;if(!P||!P.art||!P.art._pe)return;const A=P.art;
const {W,H,cx,BR,hash,ALIAS,PAL,LINE,rgb,hex,sh,mute,rng,look,IMG,pngFor,shape,hatch,ln,qc,el,rgba,strands,backHair,frontHair,hat,setG}=A._pe;
let g,R;
// ---------- лицо ----------
const OPEN={neutral:.85,talk:.85,happy:.42,sad:.7,worried:.85,angry:.62,annoyed:.45,determined:.66,surprised:1.2,afraid:1.12,tired:.38,thinking:.7,embarrassed:.6,smirk:.58,crying:.55};
const BRW={neutral:[0,0],talk:[0,-2],happy:[-4,-5],sad:[-9,6],worried:[-10,4],angry:[10,-7],annoyed:[7,-1],determined:[6,-4],surprised:[-13,-13],afraid:[-12,-1],tired:[2,6],thinking:[-2,-3],embarrassed:[-7,4],smirk:[0,-2],crying:[-11,7]};
function eye(x,y,s,ex,L,V,lk){const w=L.fem?23:24,o=OPEN[ex]||.85,h=12*o;let dx=lk*6,dy=0;if(ex==='thinking'){dx=-6;dy=-4}if(ex==='sad'||ex==='tired'||ex==='embarrassed'||ex==='crying')dy=3;
const p=new Path2D();p.moveTo(x-w,y);p.quadraticCurveTo(x,y-h*1.7,x+w,y);p.quadraticCurveTo(x,y+(ex==='happy'?2:h*1.1),x-w,y);
g.save();g.clip(p);g.fillStyle='#ddd3c4';g.fillRect(x-w,y-30,2*w,60);g.beginPath();g.arc(x+dx,y+dy+1,9.5,0,7);g.fillStyle=V.eye;g.fill();g.lineWidth=2;g.strokeStyle=sh(V.eye,-.5);g.stroke();
g.beginPath();g.arc(x+dx,y+dy+1,4.2,0,7);g.fillStyle='#141210';g.fill();g.beginPath();g.arc(x+dx-3,y+dy-2,2,0,7);g.fillStyle='rgba(240,236,228,.85)';g.fill();
g.fillStyle='rgba(60,45,40,.25)';g.fillRect(x-w,y-h*1.7,2*w,h*.7);g.restore();
g.beginPath();g.moveTo(x-w-2,y+1);g.quadraticCurveTo(x,y-h*1.7-1,x+w+2,y+1);g.lineWidth=4.2;g.strokeStyle=LINE;g.stroke();if(L.fem)ln([x+s*w,y,x+s*(w+8),y-6],2.4);
qc(x-w+4,y+3,x,y+(ex==='happy'?-2:h*1.15+2),x+w-4,y+3,1.6,'rgba(29,26,23,.55)');
const bag=ex==='tired'||ex==='crying'?.42:L.old?.32:.2;qc(x-w+2,y+h+8,x,y+h+20,x+w-2,y+h+8,4,`rgba(90,70,80,${bag})`);
if(L.old){qc(x+s*(w+4),y-2,x+s*(w+12),y+4,x+s*(w+8),y+12,1.6,'rgba(29,26,23,.45)')}}
function brow(x,y,s,ex,L,V){let b=BRW[ex]||[0,0];if(ex==='thinking'&&s<0)b=[-8,-9];if(ex==='smirk'&&s>0)b=[-6,-8];const ix=x-s*20,ox=x+s*24;
g.beginPath();g.moveTo(ix,y+b[0]);g.quadraticCurveTo(x,y-9+(b[0]+b[1])/2,ox,y+b[1]+3);g.lineWidth=(L.brow||4)*1.15+2;g.strokeStyle=sh(V.hair,-.25);g.stroke();
if(ex==='angry'||ex==='worried'||ex==='afraid')qc(cx-s*6,y+b[0]-8,cx-s*10,y+b[0]-2,cx-s*7,y+b[0]+4,1.6,'rgba(29,26,23,.5)')}
function mouth(ex,my,L,V){const w=L.fem?18:22,lip=L.fem?'#8a5552':'#6e4a44',D='#2a1a18';const fillP=(p,c)=>{g.fillStyle=c;g.fill(p);g.lineWidth=2.6;g.strokeStyle=LINE;g.stroke(p)};let p=new Path2D();
switch(ex){
case'happy':case'embarrassed':{const k=ex==='happy'?1:.6;p.moveTo(cx-w-6,my-4);p.quadraticCurveTo(cx,my+24*k,cx+w+6,my-4);p.quadraticCurveTo(cx,my+5,cx-w-6,my-4);fillP(p,D);if(ex==='happy')qc(cx-w,my-1,cx,my+5,cx+w,my-1,3,'#d8cfc0');break}
case'talk':p=el(cx,my+3,w*.6,8.5);fillP(p,D);qc(cx-w*.5,my,cx,my-2,cx+w*.5,my,2.5,'#cfc6b6');break;
case'angry':p.rect(cx-w,my-2,2*w,15);fillP(p,D);ln([cx-w+3,my+4,cx+w-3,my+4],3,'#cfc6b6');break;
case'surprised':p=el(cx,my+6,12,15);fillP(p,D);break;
case'afraid':case'crying':p.moveTo(cx-w,my+8);p.quadraticCurveTo(cx-w/2,my-4,cx,my+4);p.quadraticCurveTo(cx+w/2,my-4,cx+w,my+8);p.quadraticCurveTo(cx,my+18,cx-w,my+8);fillP(p,D);break;
case'sad':qc(cx-w,my+8,cx,my-6,cx+w,my+8,3.2);break;
case'worried':g.beginPath();g.moveTo(cx-w,my+4);g.bezierCurveTo(cx-w/3,my-4,cx+w/3,my+10,cx+w,my+2);g.lineWidth=3;g.strokeStyle=LINE;g.stroke();break;
case'annoyed':ln([cx-w,my+2,cx+w*.4,my+1,cx+w,my+6],3.4);break;
case'thinking':qc(cx-w*.3,my+3,cx+w*.4,my,cx+w,my-2,3);g.beginPath();g.arc(cx+w*.2,my+5,4,0,Math.PI);g.lineWidth=1.6;g.stroke();break;
case'smirk':qc(cx-w*.8,my+3,cx+w*.2,my+5,cx+w,my-6,3.2);break;
case'tired':qc(cx-w*.8,my+3,cx,my+5,cx+w*.8,my+3,2.8);break;
case'determined':ln([cx-w,my+2,cx+w,my+2],3.6);break;
default:qc(cx-w,my+1,cx,my+5,cx+w,my+1,3)}
qc(cx-w*.5,my+14,cx,my+19,cx+w*.5,my+14,3,rgba(lip,.45))}
function face(L,V,ex,hy,rx,ry,lk,head){const ey=hy+6,es=(L.es||36)+4,my=hy+ry*.6,a=L.acc||[];
g.save();g.clip(head);const sg=g.createLinearGradient(cx-rx,0,cx+rx,0);sg.addColorStop(0,'rgba(255,245,230,.10)');sg.addColorStop(.6,'rgba(0,0,0,0)');sg.addColorStop(1,'rgba(40,30,40,.32)');g.fillStyle=sg;g.fillRect(0,0,W,H);
const cg=g.createRadialGradient(cx,hy+ry,10,cx,hy+ry,90);cg.addColorStop(0,'rgba(50,35,35,.18)');cg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=cg;g.fillRect(0,0,W,H);
if(ex==='happy'||ex==='embarrassed'||(L.fem&&ex!=='afraid')){const k=ex==='embarrassed'?.4:ex==='happy'?.22:.1;[-1,1].forEach(s=>{const r=g.createRadialGradient(cx+s*rx*.55,hy+ry*.32,2,cx+s*rx*.55,hy+ry*.32,30);r.addColorStop(0,`rgba(190,90,90,${k})`);r.addColorStop(1,'rgba(190,90,90,0)');g.fillStyle=r;g.fillRect(0,0,W,H)})}
if(a.includes('stubble')||a.includes('beard')){for(let i=0;i<260;i++){const t=R()*Math.PI,rr=R();const x=cx+Math.cos(t)*rx*.8*rr*1.1,y=my-12+Math.sin(t)*ry*.45*(.5+rr*.6);g.fillStyle=rgba(sh(V.hair,-.2),.35);g.fillRect(x,y,2,2)}}
if(L.old){qc(cx-30,hy-ry*.5,cx,hy-ry*.55,cx+30,hy-ry*.5,1.6,'rgba(29,26,23,.35)');qc(cx-rx*.35,my-30,cx-rx*.42,my-10,cx-rx*.3,my+6,1.8,'rgba(29,26,23,.35)');qc(cx+rx*.35,my-30,cx+rx*.42,my-10,cx+rx*.3,my+6,1.8,'rgba(29,26,23,.35)')}
g.restore();
[-1,1].forEach(s=>{eye(cx+s*es,ey,s,ex,L,V,lk);brow(cx+s*es,ey-26,s,ex,L,V)});
const nl=(L.nose||.5)*10;g.beginPath();g.moveTo(cx+6,ey+8);g.quadraticCurveTo(cx+12,ey+30+nl,cx+10,ey+44+nl);g.lineWidth=5;g.strokeStyle='rgba(60,40,40,.18)';g.stroke();
qc(cx-10,ey+44+nl,cx,ey+52+nl,cx+12,ey+44+nl,2.4);qc(cx-12,ey+42+nl,cx-15,ey+47+nl,cx-9,ey+49+nl,1.8,'rgba(29,26,23,.6)');
if(a.includes('mustache')){const m=new Path2D();m.moveTo(cx-26,my+4);m.quadraticCurveTo(cx-14,my-16,cx,my-8);m.quadraticCurveTo(cx+14,my-16,cx+26,my+4);m.quadraticCurveTo(cx,my-2,cx-26,my+4);shape(m,V.hair,[0,my-16,0,my+4],2.6)}
mouth(ex,my,L,V);
if(a.includes('beard')){const b=new Path2D();b.moveTo(cx-rx*.85,my-24);b.quadraticCurveTo(cx-rx*.7,hy+ry+40,cx,hy+ry+52);b.quadraticCurveTo(cx+rx*.7,hy+ry+40,cx+rx*.85,my-24);b.quadraticCurveTo(cx+rx*.5,my+20,cx+24,my+12);b.quadraticCurveTo(cx,my+22,cx-24,my+12);b.quadraticCurveTo(cx-rx*.5,my+20,cx-rx*.85,my-24);shape(b,V.hair,[0,my,0,hy+ry+50],3.5,()=>strands(b,V.hair,my-20,hy+ry+60,40))}
if(a.includes('glasses')){[-1,1].forEach(s=>{const q=new Path2D();q.roundRect?q.roundRect(cx+s*es-28,ey-16,56,34,10):q.rect(cx+s*es-28,ey-16,56,34);g.fillStyle='rgba(220,230,235,.12)';g.fill(q);g.lineWidth=3.4;g.strokeStyle='#2a2420';g.stroke(q)});qc(cx-es+28,ey-4,cx,ey-12,cx+es-28,ey-4,3,'#2a2420')}
if(ex==='crying'||ex==='sad'){[-1,1].forEach(s=>{if(ex==='sad'&&s<0)return;g.beginPath();g.moveTo(cx+s*es-4,ey+16);g.quadraticCurveTo(cx+s*es-8,ey+50,cx+s*es-2,ey+70);g.lineWidth=3;g.strokeStyle='rgba(200,215,225,.55)';g.stroke()})}
if(ex==='afraid'||ex==='worried'){const d=new Path2D();d.moveTo(cx+rx-14,hy-ry*.4);d.quadraticCurveTo(cx+rx-4,hy-ry*.2,cx+rx-12,hy-ry*.12);d.quadraticCurveTo(cx+rx-22,hy-ry*.2,cx+rx-14,hy-ry*.4);g.fillStyle='rgba(210,225,235,.7)';g.fill(d)}
if(a.includes('clip')){const c=new Path2D();c.rect(cx-rx+6,hy-ry*.55,32,9);shape(c,'#b49a5c',[0,hy-ry*.6,0,hy-ry*.45],2.4)}}
// ---------- тело и одежда ----------
function body(L,V,hy,ry){const sw=V.sw,t=V.top,o=L.out,a=L.acc||[],sy=L.old?432:420;
const nk=new Path2D();nk.moveTo(cx-32,hy+ry-40);nk.lineTo(cx-36,sy+14);nk.quadraticCurveTo(cx,sy+34,cx+36,sy+14);nk.lineTo(cx+32,hy+ry-40);nk.closePath();
shape(nk,sh(V.skin,-.12),[cx-30,hy+ry-40,cx+30,sy+20],3.5,()=>{const gr=g.createLinearGradient(0,hy+ry-40,0,hy+ry+10);gr.addColorStop(0,'rgba(40,25,30,.45)');gr.addColorStop(1,'rgba(40,25,30,0)');g.fillStyle=gr;g.fillRect(0,0,W,H)});
const tp=new Path2D();tp.moveTo(cx-sw-30,H+4);tp.bezierCurveTo(cx-sw-16,590,cx-sw+2,sy+44,cx-72,sy);tp.quadraticCurveTo(cx,sy-10,cx+72,sy);tp.bezierCurveTo(cx+sw-2,sy+44,cx+sw+16,590,cx+sw+30,H+4);tp.closePath();
const folds=()=>{hatch(70,cx-sw,sy+20,cx+sw,H,rgba(sh(t,-.45),.35),60,Math.PI/2+.1,2.4);hatch(40,cx-sw,sy+20,cx-20,H,rgba(sh(t,.3),.3),50,Math.PI/2-.2,2);
[-1,1].forEach(s=>{qc(cx+s*(sw-40),sy+60,cx+s*(sw-60),620,cx+s*(sw-34),H,3,rgba(sh(t,-.5),.6))})};
const inner=o==='jacket'||o==='leather'||o==='coat'||o==='suit'||o==='white'||o==='uniform';
if(inner){const sp=new Path2D();sp.moveTo(cx-60,sy+4);sp.lineTo(cx+60,sy+4);sp.lineTo(cx+56,H);sp.lineTo(cx-56,H);sp.closePath();shape(sp,o==='suit'?'#cfc8bb':V.inner,[cx-60,sy,cx+60,H],3)}
const body=new Path2D(tp);if(inner){const cut=new Path2D();cut.moveTo(cx-40,sy+6);cut.quadraticCurveTo(cx-14,560,cx-(o==='jacket'?34:8),H+6);cut.lineTo(cx+(o==='jacket'?34:8),H+6);cut.quadraticCurveTo(cx+14,560,cx+40,sy+6);cut.closePath();
const m=new Path2D();m.rect(0,0,W,H);m.addPath(cut);g.save();g.clip(m,'evenodd');}
shape(tp,o==='white'?'#cdc8bc':t,[cx-sw,sy,cx+sw,H],4.5,folds);if(inner)g.restore();
if(inner){[-1,1].forEach(s=>{const e=o==='jacket'?34:8;g.beginPath();g.moveTo(cx+s*40,sy+6);g.quadraticCurveTo(cx+s*14,560,cx+s*e,H+6);g.lineWidth=4;g.strokeStyle=LINE;g.stroke();
if(o==='coat'||o==='suit'||o==='uniform'||o==='white'){const l=new Path2D();l.moveTo(cx+s*40,sy+6);l.lineTo(cx+s*86,sy+40);l.lineTo(cx+s*44,sy+120);l.quadraticCurveTo(cx+s*22,500,cx+s*22,520);l.quadraticCurveTo(cx+s*30,470,cx+s*40,sy+6);shape(l,sh(o==='white'?'#cdc8bc':t,-.06),[0,sy,0,520],3.5)}
if(o==='jacket'){for(let y=sy+30;y<H;y+=14)ln([cx+s*(36-(y-sy)*.004*0)-s*2,y,cx+s*(50),y+2],1.6,rgba(sh(t,-.5),.55))}});
if(o==='coat'||o==='uniform')for(let i=0;i<3;i++){shape(el(cx+50,560+i*62,7,7),sh(t,-.4),[0,0,0,1],2)}}
if(o==='sweater'||o==='blouse'||o==='track'){const c=new Path2D();c.moveTo(cx-62,sy+2);c.quadraticCurveTo(cx,sy+46,cx+62,sy+2);c.quadraticCurveTo(cx,sy+(o==='blouse'?20:26),cx-62,sy+2);shape(c,sh(t,-.12),[0,sy,0,sy+40],3.5);
if(o==='sweater')for(let x=cx-sw+20;x<cx+sw;x+=16)ln([x,sy+60,x+(x-cx)*.05,H],1.4,rgba(sh(t,-.4),.35));if(o==='track'){ln([cx,sy+36,cx,H],3,rgba(sh(t,-.55),.8));[-1,1].forEach(s=>ln([cx+s*(sw-28),sy+70,cx+s*(sw-8),H],5,'rgba(220,215,205,.55)'))}}
if(a.includes('scarfN')){const sc=new Path2D();sc.moveTo(cx-70,sy-6);sc.quadraticCurveTo(cx,sy+46,cx+70,sy-6);sc.lineTo(cx+64,sy-36);sc.quadraticCurveTo(cx,sy-4,cx-64,sy-36);sc.closePath();
shape(sc,V.scarf,[cx-70,sy-36,cx+70,sy+40],4,()=>{for(let x=cx-70;x<cx+70;x+=12)ln([x,sy-34,x+3,sy+30],1.6,rgba(sh(V.scarf,-.45),.5))});
const en=new Path2D();en.moveTo(cx+18,sy+24);en.lineTo(cx+50,sy+16);en.lineTo(cx+56,sy+150);en.lineTo(cx+26,sy+156);en.closePath();shape(en,V.scarf,[cx+20,sy,cx+56,sy+150],3.5);for(let x=cx+28;x<cx+56;x+=7)ln([x,sy+152,x,sy+168],2,sh(V.scarf,-.2))}
if(a.includes('medals'))for(let i=0;i<3;i++){shape(el(cx-90+i*20,sy+90,7,9),'#b8a060',[0,0,0,1],2);ln([cx-90+i*20,sy+60,cx-90+i*20,sy+80],5,['#7a2a2a','#2a4a6a','#c0a040'][i])}
if(a.includes('badge'))shape(el(cx-92,sy+80,11,13),'#b8a46a',[0,0,0,1],2.5);
if(a.includes('camera')){const c=new Path2D();c.rect(cx-70,sy+150,90,58);shape(c,'#2e2c2a',[0,sy+150,0,sy+210],3.5);shape(el(cx-25,sy+180,18,18),'#4a5560',[0,0,0,1],3)}
if(a.includes('strap')||a.includes('camera'))ln([cx-sw+50,sy+20,cx+70,sy+260],7,'#3a2e26')}
function arms(ex,V,hy,ry){if(ex!=='afraid'&&ex!=='crying'&&ex!=='surprised')return;const sk=V.skin,t=V.top,sw=V.sw;
const sides=ex==='surprised'?[-1]:[-1,1],y=ex==='surprised'?560:hy+ry+40;
sides.forEach(s=>{const hx=ex==='surprised'?cx-40:cx+s*78;g.beginPath();g.moveTo(hx+s*70,H);g.quadraticCurveTo(hx+s*60,y+120,hx+s*12,y+30);g.lineCap='round';g.lineWidth=54;g.strokeStyle=LINE;g.stroke();g.lineWidth=46;g.strokeStyle=t;g.stroke();
const h=el(hx,y,26,30,s*.3);shape(h,sk,[hx-26,y-30,hx+26,y+30],3.2);for(let i=-1;i<=1;i++)qc(hx+i*9,y-24,hx+i*9+2,y-10,hx+i*8,y+2,1.6,'rgba(29,26,23,.55)')})}
// ---------- сборка фигуры ----------
function headPath(rx,ry,j,hy){const p=new Path2D();p.moveTo(cx-rx,hy-8);p.bezierCurveTo(cx-rx,hy-ry*1.36,cx+rx,hy-ry*1.36,cx+rx,hy-8);
p.bezierCurveTo(cx+rx,hy+ry*.45,cx+rx*(.3+j*.55),hy+ry*.9,cx,hy+ry);p.bezierCurveTo(cx-rx*(.3+j*.55),hy+ry*.9,cx-rx,hy+ry*.45,cx-rx,hy-8);p.closePath();return p}
function fade(c){try{if(!c._drawn||!c.isConnected||!c.offsetWidth)return;const o=document.createElement('canvas');o.width=c.width;o.height=c.height;o.getContext('2d').drawImage(c,0,0);
const s=o.style;s.position='absolute';s.left=c.offsetLeft+'px';s.top=c.offsetTop+'px';s.width=c.offsetWidth+'px';s.height=c.offsetHeight+'px';s.pointerEvents='none';s.transform=getComputedStyle(c).transform;s.transition='opacity .24s ease';
c.parentNode.insertBefore(o,c.nextSibling);requestAnimationFrame(()=>requestAnimationFrame(()=>{s.opacity='0'}));setTimeout(()=>o.remove(),320)}catch(e){}}
function finish(){g.save();g.globalCompositeOperation='source-atop';const lg=g.createLinearGradient(80,60,520,800);lg.addColorStop(0,'rgba(255,240,220,.07)');lg.addColorStop(.55,'rgba(0,0,0,0)');lg.addColorStop(1,'rgba(12,12,18,.34)');g.fillStyle=lg;g.fillRect(0,0,W,H);
const bg=g.createLinearGradient(0,620,0,H);bg.addColorStop(0,'rgba(10,10,14,0)');bg.addColorStop(1,'rgba(10,10,14,.45)');g.fillStyle=bg;g.fillRect(0,0,W,H);
for(let i=0;i<900;i++){g.fillStyle=R()<.5?'rgba(255,250,240,.05)':'rgba(0,0,0,.06)';g.fillRect(R()*W,R()*H,2,2)}g.restore()}
function fig(ctx,L,ex,pose,lk){ex=ALIAS[ex]||ex||'neutral';if(!(ex in OPEN))ex='neutral';lk=+lk||0;
const c=ctx.canvas;if(c&&c._sig===[L.key,L.out,L.hat,ex,lk].join('|')&&c._drawn){return}fade(c);
g=ctx;g.clearRect(0,0,W,H);g.lineJoin='round';g.lineCap='round';const V=look(L);R=rng(hash((L.key||'x')+ex));setG(g,R);
const im=pngFor(L,ex);if(im){const k=Math.min(W/im.width,H/im.height),w=im.width*k,h=im.height*k;g.drawImage(im,(W-w)/2,H-h,w,h)}
else{const hy=V.kid?262:250,rx=(L.rx||86)*(V.kid?1.02:1),ry=(L.ry||106)*(V.kid?.95:1),j=L.jaw||.45;
const tilt={worried:.05,sad:.08,surprised:-.04,afraid:-.03,happy:.04,angry:-.02,thinking:.07,tired:.06,embarrassed:.07,smirk:-.03,crying:.09}[ex]||0;
g.save();g.translate(cx,H+40);g.scale(1.18,1.18);g.translate(-cx,-(H+40));
const rot=()=>{g.translate(cx,hy+150);g.rotate(tilt);g.translate(-cx,-(hy+150))};
g.save();rot();backHair(L,V,hy,rx,ry);g.restore();
body(L,V,hy,ry);
g.save();rot();[-1,1].forEach(s=>{shape(el(cx+s*rx,hy+14,15,24),sh(V.skin,-.08),[cx+s*rx-15,hy-10,cx+s*rx+15,hy+38],3.4)});
const hd=headPath(rx,ry,j,hy);shape(hd,V.skin,[cx-rx,hy-ry,cx+rx,hy+ry],4.2);
face(L,V,ex,hy,rx,ry,lk,hd);frontHair(L,V,hy,rx,ry);hat(L,V,hy,rx,ry);g.restore();
arms(ex,V,hy,ry);g.restore();finish()}
if(c){c._drawn=true;c._sig=[L.key,L.out,L.hat,ex,lk].join('|')}}
A.fig=fig;A.oldFig=A.oldFig||null;A.look=look;A.style='paint';
})();
