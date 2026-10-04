// Панель №7 — единая система столкновений P.COL.
// Визуальные стены/мебель рисуются картой, а физика — отдельные невидимые прямоугольники/эллипсы.
// Стопы персонажа проверяются несколькими точками; ведомый тоже учитывает стены и не входит в ведущего. Клавиша G показывает коллизии.
(function(){'use strict';
const P=window.P7;if(!P)return;
const R=(x1,y1,x2,y2,n)=>({t:'r',x1,y1,x2,y2,n}),E=(x,y,rx,ry,n)=>({t:'e',x,y,rx,ry,n});
const MAPS={
home:[R(0,0,15.5,100,'левая стена'),R(94.5,0,100,100,'правая стена'),R(0,0,100,17,'верхняя стена'),R(0,92.5,100,100,'нижняя стена'),
R(20,19,37,41,'тумба с ТВ'),R(20,61,46,80,'диван'),R(69,16,92,82,'стенка'),E(50,47,5.6,8.6,'стол'),E(61,54,2.3,3.8,'табурет'),R(89,84,93,92,'цветок')],
kitchen:[R(0,0,100,24,'верхняя стена'),R(0,0,4.5,100,'левая стена'),R(95.5,0,100,100,'правая стена'),R(0,95,100,100,'нижняя стена'),
R(6,0,22,31,'плита'),R(22,0,46,29,'мойка'),R(80,0,96,35,'холодильник'),R(0,37,10.5,73,'буфет'),
E(52,55,9.5,11,'стол'),E(40,55,1.8,3.2,'стул'),E(64,55,1.8,3.2,'стул'),E(52,42,1.8,3.2,'стул')],
corridor:[R(0,0,100,31,'верхняя стена'),R(0,77,100,100,'нижняя стена'),R(0,0,4.5,100,'левая стена'),R(95.5,0,100,100,'правая стена'),R(9,70,26,77.5,'обувница')],
street:[R(0,0,57,34,'дом'),R(57,0,86,14,'забор'),R(96,0,100,14,'забор'),R(58,15,64,30,'будка'),R(75,14,84,28,'киоск'),
R(96,14,100,36,'стена'),R(96,56,100,100,'стена'),R(20,73,33.5,80,'скамейка'),R(80,60,88,66,'скамейка'),R(38,64,46,68,'сугроб'),
R(64.2,57,65.8,62,'стойка'),R(74.2,57,75.8,62,'стойка'),R(5.4,63.5,6.6,66.5,'фонарь'),R(39.4,63.5,40.6,66.5,'фонарь'),R(89.4,63.5,90.6,66.5,'фонарь'),R(0,50,2.5,62,'стенд')]};
const HOME_LIKE=['home','kitchen','corridor'];
const mapNow=()=>{try{return P.realMap||N[id].map||'street'}catch(e){return'street'}};
const W=()=>{const w=document.getElementById('world')||document.getElementById('game');return w&&w.clientWidth||1000};
function halfW(){const el=document.getElementById('miniKirill')||document.getElementById('miniZhenya');const ew=el&&el.offsetWidth;return ew?Math.max(1.2,Math.min(3.5,ew/W()*50)):2.5}
function inShape(s,x,y){if(s.t==='r')return x>s.x1&&x<s.x2&&y>s.y1&&y<s.y2;const dx=(x-s.x)/s.rx,dy=(y-s.y)/s.ry;return dx*dx+dy*dy<1}
// точки стоп: центр и края ботинок (x = левый край спрайта, y = низ)
function feet(x,y,hw){const c=x+hw,f=Math.min(1.3,hw*.55);return[[c,y],[c-f,y],[c+f,y],[c,y-1]]}
function hitMap(m,x,y,hw){const L=MAPS[m];if(!L)return null;if(hw==null)hw=halfW();const pts=feet(x,y,hw);
for(const[a,b]of pts){if(a<.5||a>99.5||b<6||b>98.5)return true;for(const s of L)if(inShape(s,a,b))return s}return false}
const _hb=homeBlocked,_sb=streetBlocked;
homeBlocked=function(x,y){const m=mapNow();const r=hitMap(HOME_LIKE.includes(m)?m:'home',x,y);return r===null?_hb.apply(this,arguments):!!r};
streetBlocked=function(x,y){const m=mapNow();const r=hitMap(m==='home'?'street':m,x,y);return r===null?_sb.apply(this,arguments):!!r};
function blocked(p){const m=mapNow();return HOME_LIKE.includes(m)?homeBlocked(p.x,p.y):streetBlocked(p.x,p.y)}
const free=(x,y)=>!blocked({x,y});
// ближайшая свободная точка (спираль)
function nearestFree(x,y,avoid){for(let r=.5;r<30;r+=.5)for(let a=0;a<24;a++){const t=a/24*Math.PI*2,nx=x+Math.cos(t)*r,ny=y+Math.sin(t)*r*1.6;
if(nx<3||nx>95||ny<10||ny>95)continue;if(free(nx,ny)&&(!avoid||dist({x:nx,y:ny},avoid)>=MIN))return{x:nx,y:ny}}return null}
function unstick(p,avoid){if(!p||!blocked(p))return false;const q=nearestFree(p.x,p.y,avoid);if(q){p.x=q.x;p.y=q.y;return true}return false}
const MIN=3.2,dist=(a,b)=>Math.hypot(a.x-b.x,(a.y-b.y)*.56);
function ws(){try{return worldState()}catch(e){return null}}
function heroes(w){if(!w)return[];const pa=w.party||'both';return pa==='both'?['kirill','zhenya'].filter(h=>w[h]):[pa].filter(h=>w[h])}
function separate(w,hs,pre){if(hs.length<2)return;const L=w.active||hs[0],F=hs.find(h=>h!==L);const a=w[L],b=w[F];if(!a||!b||dist(a,b)>=MIN)return;
// ведомый встаёт позади/рядом с ведущим, в свободное место
const mv=pre&&pre[L]?{x:a.x-pre[L].x,y:a.y-pre[L].y}:{x:0,y:0},l=Math.hypot(mv.x,mv.y)||1;
const cand=[];if(pre&&pre[F]&&dist(pre[F],a)>=MIN)cand.push(pre[F]);
const bx=-mv.x/l,by=-mv.y/l;[[bx,by],[by,-bx],[-by,bx],[-1,0],[1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{if(dx||dy)cand.push({x:a.x+dx*(MIN+.6),y:a.y+dy*(MIN+.6)/.56})});
for(const c of cand)if(c.x>=3&&c.x<=95&&c.y>=10&&c.y<=95&&free(c.x,c.y)&&dist(c,a)>=MIN){b.x=c.x;b.y=c.y;return}
const q=nearestFree(b.x,b.y,a);if(q){b.x=q.x;b.y=q.y}}
function fix(w,hs,pre){hs.forEach(h=>{const p=w[h],o=pre&&pre[h];if(!blocked(p))return;
if(o){const t1={x:p.x,y:o.y},t2={x:o.x,y:p.y};if(!blocked(t1)){p.x=t1.x;p.y=t1.y;return}if(!blocked(t2)){p.x=t2.x;p.y=t2.y;return}if(!blocked(o)){p.x=o.x;p.y=o.y;return}}unstick(p)});
separate(w,hs,pre);hs.forEach(h=>unstick(w[h]))}
const onMap=()=>{try{return !!N[id].explore}catch(e){return false}};
const _mv=move;
move=function(dx,dy,fast){if(!onMap())return _mv.apply(this,arguments);const w=ws(),hs=heroes(w);hs.forEach(h=>unstick(w[h]));
const pre={};hs.forEach(h=>pre[h]={x:w[h].x,y:w[h].y});const r=_mv.apply(this,arguments);const w2=ws()||w;fix(w2,heroes(w2),pre);try{drawMini()}catch(e){}return r};
const _r=render;render=function(){const out=_r.apply(this,arguments);if(onMap()){const w=ws(),hs=heroes(w);if(hs.length){fix(w,hs,null);try{drawMini()}catch(e){}}}return out};
// отладка: G показывает невидимые коллизии
const _dd=typeof drawDebug==='function'?drawDebug:null;
drawDebug=function(){if(_dd)try{_dd.apply(this,arguments)}catch(e){}let lay=document.getElementById('p7col');const L=MAPS[mapNow()];
if(!debugOn||!onMap()||!L){if(lay)lay.remove();return}const host=document.getElementById('world');if(!host)return;
if(!lay){lay=document.createElement('div');lay.id='p7col';lay.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:40';host.appendChild(lay)}
lay.innerHTML=L.map(s=>s.t==='r'?`<div title="${s.n||''}" style="position:absolute;left:${s.x1}%;top:${s.y1}%;width:${s.x2-s.x1}%;height:${s.y2-s.y1}%;background:rgba(255,40,40,.22);outline:1px solid #f44"></div>`:
`<div title="${s.n||''}" style="position:absolute;left:${s.x-s.rx}%;top:${s.y-s.ry}%;width:${s.rx*2}%;height:${s.ry*2}%;border-radius:50%;background:rgba(255,160,40,.25);outline:1px solid #fa4"></div>`).join('')};
P.COL={MAPS,hitMap,blocked,free,unstick,nearestFree,separate,fix,feet,add:(m,s)=>{(MAPS[m]=MAPS[m]||[]).push(s.rx?E(s.x,s.y,s.rx,s.ry,s.n):R(s.x1,s.y1,s.x2,s.y2,s.n))},MIN};
})();
