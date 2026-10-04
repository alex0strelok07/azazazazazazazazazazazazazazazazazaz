// Панель №7 — этап 5 (часть 2): диалоги в стиле «крупные светлые контурные персонажи на тёмном фоне».
// Персонажи рисуются по пояс, с эмоциями и позами; в кадре только те, кто физически присутствует в сцене.
(function(){'use strict';
const P=window.P7;if(!P)return;
const game=$('game');if(!game)return;
const CR='#efe6cf',INK='#0b0b0a',FA='rgba(239,230,207,.45)',W=600,H=800,cx=300;
function hex(c){c=(c||'#444').replace('#','');if(c.length===3)c=c.split('').map(v=>v+v).join('');const n=parseInt(c.slice(0,6),16)||0;return[n>>16&255,n>>8&255,n&255]}
function mix(c,a){const[r,gg,b]=hex(c),k=1-a;return'rgb('+(r*k|0)+','+(gg*k|0)+','+(b*k|0)+')'}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let s=seed||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return((s>>>0)%10000)/10000}}
// ---------- внешность ----------
const NPCS=()=>(P._K&&P._K.NPC)||{};
const HATS=['ushanka','cap','beret','police','whitecap','bobhat'];
const FEM=/(баба|торговк|продавщ|киоскёр|заведующ|старушк|буфетчиц|вахтёрш|ирин|нина|марин|валентин|секретар|фармацевт)/i;
const OLD=/(баба|старик|старушк|михалыч|петрович|степаныч|аркадий|семён|нина|клавди|валентин|дядя|ветеран)/i;
const OUT={pharm:'white',seller:'white',leather:'leather',gopnik:'track',teen:'track',teen2:'track',police:'uniform',controller:'uniform',guard:'coat',veteran:'coat',student:'sweater',musician:'leather',photo:'jacket',kid:'jacket',manager:'sweater',marina:'blouse',irina:'blouse',arkady:'suit',semyon:'sweater',michalych:'coat',vendor:'coat',valya:'blouse',lyuda:'white',nina:'sweater',klava:'sweater',roma:'track',tolik:'jacket',gena:'sweater',chess:'coat',pick:'jacket',stranger:'jacket',driver:'leather',drunk:'coat'};
const ACC={veteran:['medals'],photo:['camera'],musician:['strap'],michalych:['beard'],police:['badge'],drunk:['stubble'],chess:['glasses','beard'],semyon:['glasses'],arkady:['glasses','mustache'],ushanka:['mustache'],accordion:['mustache'],petrovich:['mustache'],nina:['glasses'],klava:['glasses'],stepanych:['stubble'],guard:['stubble'],gosha:['stubble'],tolik:['stubble']};
function npcLook(k){const o=NPCS()[k]||{},nm=o.n||k,r=rng(hash(k)),hs=o.hs||'short';
const fem=FEM.test(nm)||(['bun','curly','scarf'].includes(hs)&&!/(мужик|старик|дядя)/i.test(nm));
const acc=(o.acc||[]).filter(a=>['beard','glasses','mustache'].includes(a)).concat(ACC[k]||[]);
const L={n:nm,key:k,fem,old:OLD.test(nm)||/^#?[bcdef]/i.test((o.hair||'').replace('#','')),hair:o.hair||'#3a3a3a',top:o.top||'#4a4a4a',acc,
rx:80+r()*16,ry:100+r()*14,jaw:fem?.36+r()*.16:.5+r()*.26,es:32+r()*9,nose:r(),brow:fem?3.4:5+r()*3,out:OUT[k]||(r()<.5?'coat':'jacket')};
if(HATS.includes(hs)){L.hs='short';L.hat=hs;L.hatc=hs==='police'?'#2e3a46':hs==='whitecap'?'#e0dccf':o.bot||o.top}else L.hs=hs;
return L}
function heroLook(h,indoor){return h==='kirill'
?{n:'Кирилл',key:'kirill',fem:false,hs:'messy',hair:'#2e2924',top:indoor?'#4a4038':'#3a4450',out:indoor?'sweater':'coat',acc:indoor?['stubble']:['scarfN','stubble'],rx:90,ry:110,jaw:.56,es:38,nose:.3,brow:6.5}
:{n:'Женя',key:'zhenya',fem:true,hs:'long',hair:'#5e4130',top:indoor?'#5a4656':'#4e5a46',out:indoor?'sweater':'jacket',hat:indoor?null:'bobhat',hatc:'#7a3a3a',acc:indoor?['clip']:['scarfN'],rx:84,ry:104,jaw:.42,es:36,nose:.7,brow:3.6}}
// ---------- примитивы ----------
let g;
function st(lw,c){g.lineWidth=lw;g.strokeStyle=c||CR}
function fs(f,lw){g.fillStyle=f;g.fill();st(lw||5);g.stroke()}
function ell(x,y,a,b,r){g.beginPath();g.ellipse(x,y,a,b,r||0,0,Math.PI*2)}
function line(p,lw,c){g.beginPath();g.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)g.lineTo(p[i],p[i+1]);st(lw||3,c);g.stroke()}
function curve(x0,y0,qx,qy,x1,y1,lw,c){g.beginPath();g.moveTo(x0,y0);g.quadraticCurveTo(qx,qy,x1,y1);st(lw||3,c);g.stroke()}
function rr(x,y,w,h,r){g.beginPath();if(g.roundRect)g.roundRect(x,y,w,h,r);else g.rect(x,y,w,h)}
function limb(p,w,f){g.beginPath();g.moveTo(p[0],p[1]);g.quadraticCurveTo(p[2],p[3],p[4],p[5]);g.lineWidth=w+9;g.strokeStyle=CR;g.stroke();g.lineWidth=w;g.strokeStyle=f;g.stroke()}
function hand(x,y,r,fist){ell(x,y,r,r*.92);fs(INK,4);if(fist){for(let i=-1;i<=1;i++)curve(x+i*r*.45-6,y-r*.35,x+i*r*.45,y-r*.6,x+i*r*.45+6,y-r*.35,2.5)}else{line([x-r*.3,y-r*.2,x-r*.3,y+r*.5],2.5);line([x+r*.15,y-r*.25,x+r*.15,y+r*.55],2.5)}}
function star(x,y,r){g.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r*.45:r;g.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q)}g.closePath();g.fillStyle=CR;g.fill()}
// ---------- одежда ----------
function outfit(L,sw){const o=L.out,a=L.acc||[];
if(o==='coat'||o==='suit'||o==='leather'){line([cx-60,430,cx-14,600,cx-24,800],4);line([cx+60,430,cx+14,600,cx+24,800],4);line([cx-60,430,cx-112,520,cx-34,560],3.5);line([cx+60,430,cx+112,520,cx+34,560],3.5);for(let i=0;i<3;i++){ell(cx+46,640+i*60,6,6);fs(INK,3)}
if(o==='leather'){curve(cx-sw+30,520,cx-sw+52,600,cx-sw+40,720,3,'rgba(239,230,207,.6)');curve(cx+sw-30,520,cx+sw-52,600,cx+sw-40,720,3,'rgba(239,230,207,.6)')}
if(o==='suit'){g.beginPath();g.moveTo(cx-10,440);g.lineTo(cx+10,440);g.lineTo(cx+16,600);g.lineTo(cx,630);g.lineTo(cx-16,600);g.closePath();fs(mix('#6a2a2a',.4),3)}}
else if(o==='sweater'){for(let i=-4;i<=4;i++)if(i)curve(cx+i*36,470,cx+i*38,640,cx+i*40,800,2,'rgba(239,230,207,.3)');line([cx-sw+8,742,cx+sw-8,742],2,FA)}
else if(o==='jacket'||o==='track'){line([cx,440,cx,800],3.5);for(let y=470;y<800;y+=22)line([cx-6,y,cx+6,y],2);line([cx-sw+24,620,cx-60,630],3);line([cx+sw-24,620,cx+60,630],3);
if(o==='track')[-1,1].forEach(s=>{for(let k=0;k<3;k++)curve(cx+s*(92+k*14),436,cx+s*(sw-12+k*6),480,cx+s*(sw+4+k*6),800,3,CR)})}
else if(o==='white'){g.fillStyle='rgba(239,230,207,.2)';g.fill();line([cx,440,cx,800],3.5);rr(cx+50,600,60,50,4);st(3);g.stroke();line([cx+66,588,cx+66,630],4)}
else if(o==='uniform'){line([cx,440,cx,800],3.5);for(let i=0;i<4;i++){ell(cx+16,480+i*70,6,6);fs(INK,3)}[-1,1].forEach(s=>{rr(cx+s*122-30,436,60,20,4);fs(mix('#7a2a2a',.3),3)})}
else if(o==='blouse'){curve(cx-62,430,cx,522,cx+62,430,3.5);for(let i=0;i<3;i++){ell(cx,544+i*50,5,5);fs(INK,2.5)}}
if(a.includes('medals'))for(let i=0;i<3;i++){const x=cx-132+i*30;rr(x-10,520,20,24,2);fs(mix('#a03030',.3),2.5);ell(x,560,11,11);fs('#4a4030',2.5)}
if(a.includes('badge'))star(cx-104,540,17);
if(a.includes('camera')){line([cx-112,432,cx-44,596],3);line([cx+112,432,cx+44,596],3);rr(cx-62,590,124,78,8);fs(INK,4);ell(cx,629,27,27);fs(INK,4);ell(cx,629,12,12);st(2.5);g.stroke()}
if(a.includes('strap')){g.beginPath();g.moveTo(cx-122,436);g.lineTo(cx-92,430);g.lineTo(cx+sw+4,760);g.lineTo(cx+sw-26,792);g.closePath();fs(mix('#5a3a2a',.4),3)}}
function collar(L){const a=L.acc||[];
if(a.includes('scarfN')){const sc=L.key==='kirill'?mix('#7a2a2a',.3):mix('#c9a227',.45);g.beginPath();g.moveTo(cx-62,410);g.quadraticCurveTo(cx,470,cx+62,410);g.lineTo(cx+58,446);g.quadraticCurveTo(cx,502,cx-58,446);g.closePath();fs(sc,4);g.beginPath();g.moveTo(cx+18,474);g.lineTo(cx+52,470);g.lineTo(cx+62,624);g.lineTo(cx+28,628);g.closePath();fs(sc,4);for(let i=0;i<4;i++)line([cx+32+i*8,628,cx+30+i*8,646],2)}
else if(L.out==='sweater'){g.beginPath();g.moveTo(cx-46,414);g.quadraticCurveTo(cx,456,cx+46,414);st(12,CR);g.stroke();st(6,mix(L.top,.72));g.stroke()}
else if(L.out!=='blouse'&&L.out!=='white')[-1,1].forEach(s=>{g.beginPath();g.moveTo(cx+s*38,398);g.lineTo(cx+s*72,428);g.lineTo(cx+s*24,464);g.closePath();fs(mix(L.top,.6),3.5)})}
// ---------- руки и позы ----------
function arms(p,sw,f){const sx=sw-26;
switch(p){
case'angry':limb([cx-sx,500,cx-sx+10,664,cx+112,610],52,f);limb([cx+sx,500,cx+sx-10,642,cx-112,590],52,f);hand(cx+120,606,22);hand(cx-120,586,22);break;
case'worried':limb([cx+sx,500,cx+sx-6,700,cx+40,580],50,f);hand(cx+34,574,24);break;
case'determined':limb([cx-sx,500,cx-sx+6,700,cx-70,600],50,f);hand(cx-64,588,27,1);break;
case'talk':limb([cx-sx,500,cx-sx+16,724,cx-112,640],50,f);hand(cx-114,628,24);break;
case'happy':limb([cx+sx,500,cx+sx+44,360,cx+112,196],48,f);hand(cx+112,192,24);break;
case'afraid':limb([cx-sx,520,cx-sx+30,684,cx-122,432],48,f);limb([cx+sx,520,cx+sx-30,684,cx+122,432],48,f);hand(cx-122,418,26);hand(cx+122,418,26);break;
case'surprised':limb([cx+sx,520,cx+sx-14,690,cx+104,312],48,f);hand(cx+102,300,25);break;
default:[-1,1].forEach(s=>curve(cx+s*(sx-14),520,cx+s*(sx-24),660,cx+s*(sx-20),800,3.5))}}
// ---------- голова, волосы, головные уборы ----------
function back(L,hy,rx,ry,hair,hatc){
if(L.hs==='long'){g.beginPath();g.moveTo(cx-rx-6,hy-30);g.bezierCurveTo(cx-rx-40,hy+120,cx-rx-60,hy+230,cx-rx-34,hy+262);g.quadraticCurveTo(cx,hy+300,cx+rx+34,hy+262);g.bezierCurveTo(cx+rx+60,hy+230,cx+rx+40,hy+120,cx+rx+6,hy-30);g.closePath();fs(hair,5)}
if(L.hs==='hood'){ell(cx,hy-6,rx+44,ry+52);fs(hatc,5)}
if(L.hs==='scarf'){g.beginPath();g.moveTo(cx-rx-20,hy+ry*.6);g.bezierCurveTo(cx-rx-34,hy-ry*1.5,cx+rx+34,hy-ry*1.5,cx+rx+20,hy+ry*.6);g.quadraticCurveTo(cx+rx-10,hy+ry+30,cx,hy+ry+34);g.quadraticCurveTo(cx-rx+10,hy+ry+30,cx-rx-20,hy+ry*.6);g.closePath();fs(hatc,5)}
if(L.hs==='bun'){ell(cx,hy-ry*1.14,42,36);fs(hair,5);curve(cx-24,hy-ry*1.14,cx,hy-ry*1.3,cx+24,hy-ry*1.12,2,FA)}}
function hairFront(L,hy,rx,ry,hair){const hs=L.hs;if(hs==='hood'||hs==='scarf')return;
if(hs==='bald'){[-1,1].forEach(s=>{g.beginPath();g.moveTo(cx+s*(rx+2),hy+4);g.quadraticCurveTo(cx+s*(rx+10),hy-40,cx+s*(rx-14),hy-64);g.quadraticCurveTo(cx+s*(rx-6),hy-20,cx+s*(rx-8),hy+4);fs(hair,3.5)});curve(cx-40,hy-ry*.95,cx-10,hy-ry*1.08,cx+14,hy-ry*1.02,3,FA);return}
const top=hy-ry*1.36,fy=hy-ry*.42,end=hs==='long'?34:6;
g.beginPath();g.moveTo(cx-rx-8,hy+14);
if(hs==='messy')[[-rx-24,hy-ry*.7],[-rx*.8,hy-ry*1.05],[-rx*.85,top+6],[-rx*.4,top-4],[-rx*.3,top-30],[0,top-6],[rx*.25,top-34],[rx*.45,top-2],[rx*.9,top+4],[rx+26,hy-ry*.9],[rx+6,hy-ry*.55],[rx+22,hy-ry*.3],[rx+8,hy+14]].forEach(p=>g.lineTo(cx+p[0],p[1]));
else{const up=hs==='curly'?24:14;g.bezierCurveTo(cx-rx-16,top-up,cx+rx+16,top-up,cx+rx+8,hy+14)}
g.lineTo(cx+rx-4,fy+end);
const n=hs==='messy'?7:hs==='long'?3:5;
for(let i=0;i<n;i++){const xa=cx+rx-4-(2*rx-8)*i/n,xb=cx+rx-4-(2*rx-8)*(i+1)/n,xm=(xa+xb)/2;const dep=hs==='messy'?(i%2?46:30):hs==='long'?(i===1?14:48):hs==='short'?14:22;g.quadraticCurveTo(xm+6,fy+dep+10,xb,fy+(i===n-1?end:(i%2?-2:6)))}
g.lineTo(cx-rx-2,hy+14);g.closePath();fs(hair,4.5);
for(let i=-2;i<=2;i++)curve(cx+i*30,top+22,cx+i*36+8,hy-ry*.9,cx+i*30+6,fy+10,2,'rgba(239,230,207,.4)');
if(hs==='long')[-1,1].forEach(s=>{g.beginPath();g.moveTo(cx+s*(rx-8),fy+20);g.bezierCurveTo(cx+s*(rx+18),hy+80,cx+s*(rx+4),hy+190,cx+s*(rx+40),hy+262);g.lineTo(cx+s*(rx+66),hy+248);g.bezierCurveTo(cx+s*(rx+42),hy+170,cx+s*(rx+34),hy+40,cx+s*(rx+6),fy);g.closePath();fs(hair,4.5);curve(cx+s*(rx+20),hy+60,cx+s*(rx+26),hy+160,cx+s*(rx+50),hy+240,2,FA)});
if(hs==='curly')for(let i=0;i<11;i++){const a=Math.PI*(1.05+i*.09);ell(cx+Math.cos(a)*(rx+6),hy-20+Math.sin(a)*ry*1.05,18,16);fs(hair,3.5)}
if((L.acc||[]).includes('clip'))line([cx+rx*.42,fy+6,cx+rx*.76,fy-14],7)}
function hat(t,hy,rx,ry,c){const top=hy-ry*1.36,by=hy-ry*.5;
if(t==='ushanka'){[-1,1].forEach(s=>{g.beginPath();g.moveTo(cx+s*(rx-14),by);g.lineTo(cx+s*(rx+18),by);g.quadraticCurveTo(cx+s*(rx+28),hy+60,cx+s*(rx+10),hy+88);g.quadraticCurveTo(cx+s*(rx-8),hy+70,cx+s*(rx-10),by);fs(c,4.5)});
g.beginPath();g.moveTo(cx-rx-14,by);g.bezierCurveTo(cx-rx-20,top-44,cx+rx+20,top-44,cx+rx+14,by);g.closePath();fs(c,4.5);rr(cx-rx-22,by-38,2*rx+44,46,18);fs(mix('#8a7a66',.45),4.5);for(let i=0;i<14;i++){const x=cx-rx-12+i*(2*rx+24)/13;line([x,by-30,x-4,by-4],1.8,FA)}}
else if(t==='bobhat'){g.beginPath();g.moveTo(cx-rx-12,by+4);g.bezierCurveTo(cx-rx-12,top-36,cx+rx+12,top-36,cx+rx+12,by+4);g.closePath();fs(c,4.5);ell(cx,top-30,30,26);fs(c,4.5);rr(cx-rx-14,by-24,2*rx+28,32,8);fs(c,4.5);for(let i=1;i<12;i++){const x=cx-rx-14+i*(2*rx+28)/12;line([x,by-22,x,by+6],2,FA)}}
else if(t==='cap'||t==='police'){const hg=t==='police'?72:44;g.beginPath();g.moveTo(cx-rx-8,by);g.bezierCurveTo(cx-rx-6,by-hg-40,cx+rx+6,by-hg-40,cx+rx+8,by);g.closePath();fs(c,4.5);if(t==='police'){rr(cx-rx-8,by-24,2*rx+16,24,3);fs(mix('#8a2a2a',.35),4);star(cx,by-hg+10,15)}ell(cx,by+4,rx+18,15);fs(INK,4.5)}
else if(t==='beret'){ell(cx-10,top+16,rx+30,34,-.12);fs(c,4.5);ell(cx-6,top-20,6,8);fs(c,3)}
else if(t==='whitecap'){g.beginPath();g.moveTo(cx-rx+4,by-4);g.lineTo(cx-rx+24,top-4);g.lineTo(cx+rx-24,top-4);g.lineTo(cx+rx-4,by-4);g.closePath();fs('#3e3c38',4.5);line([cx-rx+14,by-26,cx+rx-14,by-26],2)}}
// ---------- лицо ----------
const BR={neutral:[0,0],talk:[0,0],angry:[13,-7],worried:[-11,6],sad:[-9,7],afraid:[-13,4],surprised:[-16,-14],determined:[7,-3],happy:[-5,-5]};
function eye(x,y,s,ex,L,d){d=(d||0)*6;
if(ex==='happy'){curve(x-18,y+4,x,y-14,x+18,y+4,4.5);return}
if(ex==='afraid'||ex==='surprised'){ell(x,y,17,17);st(3.5);g.stroke();ell(x+d*.5,y,5,5);g.fillStyle=CR;g.fill();return}
const ix=x-s*20,ox=x+s*20;let iy=y,oy=y,pk=-15;
if(ex==='angry'||ex==='determined'){iy=y+4;oy=y-6;pk=-8}else if(ex==='sad'||ex==='worried'){iy=y-6;oy=y+3;pk=-10}
g.save();g.beginPath();g.moveTo(ix,iy);g.quadraticCurveTo(x,y+pk,ox,oy);g.lineTo(ox,y+13);g.lineTo(ix,y+13);g.closePath();g.clip();ell(x+d,y+3,8.5,9.5);g.fillStyle=CR;g.fill();ell(x+d,y+3,3.6,3.6);g.fillStyle=INK;g.fill();g.restore();
g.beginPath();g.moveTo(ix,iy);g.quadraticCurveTo(x,y+pk,ox,oy);st(4.5);g.stroke();curve(x-14,y+11,x,y+15,x+14,y+11,2,'rgba(239,230,207,.6)');
if(L.fem)line([ox,oy,ox+s*9,oy-7],2.5)}
function mouth(ex,my,L){const w=L.fem?16:20;
switch(ex){
case'happy':g.beginPath();g.moveTo(cx-w-8,my-4);g.quadraticCurveTo(cx,my+26,cx+w+8,my-4);g.quadraticCurveTo(cx,my+6,cx-w-8,my-4);fs(INK,3.5);break;
case'talk':ell(cx,my+2,w*.62,8);fs(INK,3.5);break;
case'angry':g.beginPath();g.moveTo(cx-w,my+6);g.quadraticCurveTo(cx,my-6,cx+w,my+6);g.lineTo(cx+w-4,my+12);g.quadraticCurveTo(cx,my+4,cx-w+4,my+12);g.closePath();fs(INK,3.5);line([cx-w+6,my+6,cx+w-6,my+6],1.6);break;
case'afraid':ell(cx,my+6,12,16);fs(INK,3.5);break;
case'surprised':ell(cx,my+4,9,11);fs(INK,3.5);break;
case'worried':g.beginPath();g.moveTo(cx-w*.8,my+4);g.bezierCurveTo(cx-w*.3,my-4,cx+w*.2,my+8,cx+w*.8,my);st(3.5);g.stroke();break;
case'sad':curve(cx-w,my+8,cx,my-6,cx+w,my+8,3.5);break;
case'determined':line([cx-w,my+2,cx+w,my],4);line([cx+w,my,cx+w+5,my-4],3);break;
default:curve(cx-w,my,cx,my+5,cx+w,my,3.5)}
if(L.fem&&!['happy','afraid','surprised'].includes(ex))curve(cx-7,my+14,cx,my+17,cx+7,my+14,2,FA)}
function face(L,ex,hy,rx,ry,lk){const es=L.es,ey=hy+10,b=BR[ex]||[0,0],a=L.acc||[];
[-1,1].forEach(s=>{const x=cx+s*es;g.beginPath();g.moveTo(x-s*18,ey-30+b[0]);g.quadraticCurveTo(x+s*2,ey-38+(b[0]+b[1])/2,x+s*22,ey-30+b[1]);st(L.brow);g.stroke();eye(x,ey,s,ex,L,lk)});
const nx=cx+(L.nose-.5)*6;g.beginPath();g.moveTo(nx+2,ey+14);g.quadraticCurveTo(nx-8-L.nose*6,ey+40,nx-4,ey+46);g.quadraticCurveTo(nx+4,ey+50,nx+10,ey+45);st(3);g.stroke();
const my=hy+ry*.6;
if(a.includes('beard')){g.beginPath();g.moveTo(cx-rx+6,hy+ry*.25);g.quadraticCurveTo(cx-rx+10,hy+ry+40,cx,hy+ry+54);g.quadraticCurveTo(cx+rx-10,hy+ry+40,cx+rx-6,hy+ry*.25);g.quadraticCurveTo(cx+rx*.5,hy+ry*.82,cx+28,my+8);g.quadraticCurveTo(cx,my+2,cx-28,my+8);g.quadraticCurveTo(cx-rx*.5,hy+ry*.82,cx-rx+6,hy+ry*.25);fs(mix(L.hair,.35),4);for(let i=-3;i<=3;i++)curve(cx+i*16,hy+ry*.88,cx+i*18,hy+ry+10,cx+i*14,hy+ry+30,2,FA)}
mouth(ex,my,L);
if(a.includes('beard')||a.includes('mustache')){g.beginPath();g.moveTo(cx-34,my-4);g.quadraticCurveTo(cx-16,my-20,cx,my-10);g.quadraticCurveTo(cx+16,my-20,cx+34,my-4);g.quadraticCurveTo(cx,my-4,cx-34,my-4);fs(mix(L.hair,.35),3.5)}
if(a.includes('stubble')){g.fillStyle='rgba(239,230,207,.3)';for(let i=0;i<34;i++){const t=i/33,an=Math.PI*(.12+.76*t),xx=cx-Math.cos(an)*rx*.66,yy=hy+ry*.5+Math.sin(an)*ry*.36;g.fillRect(xx+(i%3)*3,yy-(i%2)*5,2.2,2.2)}}
if(L.old){curve(cx-30,hy-ry*.55,cx,hy-ry*.62,cx+30,hy-ry*.55,2,FA);curve(cx-22,hy-ry*.44,cx,hy-ry*.5,cx+22,hy-ry*.44,2,FA);[-1,1].forEach(s=>{line([cx+s*(es+26),ey-4,cx+s*(es+35),ey-9],2,FA);line([cx+s*(es+26),ey+5,cx+s*(es+35),ey+8],2,FA);curve(cx+s*24,ey+42,cx+s*36,ey+60,cx+s*32,ey+80,2,FA)})}
if(a.includes('glasses')){[-1,1].forEach(s=>{rr(cx+s*es-26,ey-18,52,36,10);st(3.5);g.stroke()});line([cx-es+26,ey-4,cx+es-26,ey-4],3)}
if(ex==='worried'||ex==='afraid'){const sx=cx+rx-20,sy=hy-ry*.55;g.beginPath();g.moveTo(sx,sy);g.quadraticCurveTo(sx+12,sy+20,sx,sy+26);g.quadraticCurveTo(sx-12,sy+20,sx,sy);st(2.5);g.stroke()}
if(ex==='angry')[-1,1].forEach(s=>line([cx+s*10,ey-40,cx+s*6,ey-26],2.5));
if(ex==='happy'&&L.fem)[-1,1].forEach(s=>{for(let i=0;i<3;i++){const x=cx+s*(es+4)+i*9-10;line([x,ey+36,x-6,ey+46],2.2,'rgba(240,170,170,.8)')}})}
function head(L,ex,hy,rx,ry,hair,hatc,lk){
[-1,1].forEach(s=>{ell(cx+s*(rx-2),hy+14,15,25);fs(INK,4);curve(cx+s*(rx-2),hy+4,cx+s*(rx+6),hy+14,cx+s*(rx-2),hy+26,2.5)});
const j=L.jaw;g.beginPath();g.moveTo(cx-rx,hy);g.bezierCurveTo(cx-rx,hy-ry*1.33,cx+rx,hy-ry*1.33,cx+rx,hy);g.bezierCurveTo(cx+rx,hy+ry*.7,cx+rx*j,hy+ry,cx,hy+ry);g.bezierCurveTo(cx-rx*j,hy+ry,cx-rx,hy+ry*.7,cx-rx,hy);fs(INK,5);
face(L,ex,hy,rx,ry,lk);hairFront(L,hy,rx,ry,hair);if(L.hat)hat(L.hat,hy,rx,ry,hatc);
if(L.hs==='hood'){g.beginPath();g.arc(cx,hy-6,rx+26,Math.PI*.8,Math.PI*2.2);st(16,CR);g.stroke();st(10,hatc);g.stroke();line([cx-30,hy+ry+8,cx-34,hy+ry+74],2.5);line([cx+30,hy+ry+8,cx+34,hy+ry+74],2.5)}
if(L.hs==='scarf'){const c=mix(L.hair,.4);g.beginPath();g.moveTo(cx-rx-6,hy-ry*.2);g.bezierCurveTo(cx-rx,hy-ry*1.22,cx+rx,hy-ry*1.22,cx+rx+6,hy-ry*.2);g.bezierCurveTo(cx+rx-6,hy-ry*.95,cx-rx+6,hy-ry*.95,cx-rx-6,hy-ry*.2);fs(c,4);ell(cx,hy+ry+22,22,15);fs(c,4);g.fillStyle=CR;for(let i=0;i<7;i++){ell(cx-rx*.7+i*rx*.23,hy-ry*.8+(i%2)*10,3,3);g.fill()}}}
function fig(ctx,L,ex,pose,lk){g=ctx;g.clearRect(0,0,W,H);g.lineJoin='round';g.lineCap='round';
const hy=250,rx=L.rx,ry=L.ry,sw=L.fem?160:188,top=mix(L.top,.72),hair=mix(L.hair,.5),hatc=L.hs==='scarf'?mix(L.hair,.45):mix(L.hatc||L.top,.6);
const tilt={worried:.05,sad:.09,surprised:-.04,afraid:-.03,happy:.04,angry:-.02}[ex]||0;
const rot=()=>{g.translate(cx,hy+140);g.rotate(tilt);g.translate(-cx,-(hy+140))};
g.save();rot();back(L,hy,rx,ry,hair,hatc);g.restore();
g.beginPath();g.moveTo(cx-sw-28,H+4);g.bezierCurveTo(cx-sw-14,580,cx-sw+4,455,cx-78,418);g.lineTo(cx+78,418);g.bezierCurveTo(cx+sw-4,455,cx+sw+14,580,cx+sw+28,H+4);g.closePath();fs(top,5);
outfit(L,sw);
g.beginPath();g.moveTo(cx-33,330);g.lineTo(cx-37,418);g.quadraticCurveTo(cx,446,cx+37,418);g.lineTo(cx+33,330);fs(INK,4);
collar(L);
const late=pose==='afraid'||pose==='surprised';if(!late)arms(pose,sw,top);
g.save();rot();head(L,ex,hy,rx,ry,hair,hatc,lk);g.restore();
if(late)arms(pose,sw,top)}
P.art={fig,heroLook,npcLook,BR,hash,W,H,NPCS};
})();
