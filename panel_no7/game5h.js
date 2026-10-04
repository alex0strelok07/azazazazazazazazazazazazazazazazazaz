// Панель №7 — единая система персонажей: Character → Base Model → Emotions → Poses → Animations.
// Одна базовая модель (P.art.fig, стиль эталона) используется в мире, диалогах, действиях, сценах и нападениях.
// Старые PNG-чибики с белым фоном больше не показываются; любые загруженные PNG очищаются от белого фона.
(function(){'use strict';
const P=window.P7;if(!P||!P.art)return;
const A=P.art,K=P._K||{},CH={};P.CHAR=CH;
const HEROES=['kirill','zhenya'];
const PANTS={kirill:'#2b2724',zhenya:'#34302e'},BOOT='#1d1a17',LINE=(A.PAL&&A.PAL.line)||'#1d1a17';
const normE=e=>{e=(A.ALIAS&&A.ALIAS[e])||e||'neutral';return A.BR&&A.BR[e]?e:'neutral'};
function isIn(){try{const x=N[id];const m=P.realMap||x.map;if(m)return m==='home'||m==='kitchen'||m==='corridor';return !!P.inApt(x)}catch(e){return true}}
function look(k,ind){return HEROES.includes(k)?A.heroLook(k,ind):A.npcLook(k)}
function trim(c){const g=c.getContext('2d'),W=c.width,H=c.height,d=g.getImageData(0,0,W,H).data;let x0=W,y0=H,x1=0,y1=0;
for(let y=0;y<H;y+=2)for(let x=0;x<W;x+=2)if(d[(y*W+x)*4+3]>10){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
if(x1<=x0)return c;x0=Math.max(0,x0-3);y0=Math.max(0,y0-3);x1=Math.min(W-1,x1+3);y1=Math.min(H-1,y1+3);
const o=document.createElement('canvas');o.width=x1-x0+1;o.height=y1-y0+1;o.getContext('2d').drawImage(c,x0,y0,o.width,o.height,0,0,o.width,o.height);return o}
const cache=new Map();const mem=(k,f)=>{if(cache.has(k))return cache.get(k);const v=f();if(cache.size>220)cache.delete(cache.keys().next().value);cache.set(k,v);return v};
// базовая модель (портрет) — тот же рисунок, что в диалогах
CH.base=(k,ind,e,lk)=>mem(['b',k,!!ind,normE(e),lk||0].join('|'),()=>{const c=document.createElement('canvas');c.width=A.W||600;c.height=A.H||800;
try{A.fig(c.getContext('2d'),look(k,ind),normE(e),normE(e),lk||0)}catch(err){console.warn('fig',k,err)}return trim(c)});
// фигура в полный рост для мира и сцен: та же модель + ноги
CH.body=(k,ind,e,lk)=>mem(['f',k,!!ind,normE(e),lk||0].join('|'),()=>{const b=CH.base(k,ind,e,lk),W=300,bw=268,bh=Math.round(b.height*bw/b.width),legs=118,H=bh+legs-36;
const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');const L=look(k,ind)||{};
const pants=PANTS[k]||(L.fem?'#3a3532':'#2e2b28');g.lineJoin='round';g.lineWidth=7;g.strokeStyle=LINE;
const leg=(x)=>{g.fillStyle=pants;g.beginPath();g.roundRect(x,bh-60,46,legs,12);g.fill();g.stroke();g.fillStyle=BOOT;g.beginPath();g.roundRect(x-8,H-30,62,28,12);g.fill();g.stroke()};
leg(W/2-52);leg(W/2+6);g.drawImage(b,(W-bw)/2,0,bw,bh);return c});
CH.url=c=>c._url||(c._url=c.toDataURL('image/png'));
CH.mini=(k,ind,dir)=>{const lk=dir==='left'?-1:dir==='right'?1:0;return CH.url(CH.body(k,ind,'neutral',lk))};
CH.portrait=(k,ind,e)=>CH.url(CH.base(k,ind,e||'neutral',0));
// ---------- мир: чибики героев = та же модель ----------
const css=document.createElement('style');css.textContent=`
#game .mini{height:96px!important;width:auto!important;max-width:none!important;object-fit:contain;filter:drop-shadow(0 4px 3px rgba(0,0,0,.5))!important;background:none!important}
#game .mini.active{filter:drop-shadow(0 0 6px rgba(240,220,160,.55)) drop-shadow(0 4px 3px rgba(0,0,0,.5))!important}
#game .dialogPortrait,#game .sprite,#game .portrait{display:none!important}
.switchCard img{object-fit:contain!important;object-position:50% 0!important;background:#292a26}
.invTop img{object-fit:cover!important;object-position:50% 8%!important}
@media(max-width:700px){#game .mini{height:70px!important}}`;document.head.appendChild(css);
const _sf=spriteFor;
spriteFor=function(who,p){try{if(HEROES.includes(who))return CH.mini(who,isIn(),p&&p.dir)}catch(e){console.warn('mini',e)}return _sf.apply(this,arguments)};
// ---------- все прочие картинки героев (карточки смены, инвентарь, старые портреты) ----------
const RX=/assets\/(?:(?:mini|home|dialog)_)?(kirill|zhenya)(?:_([a-z]+))?(?:_(?:up|down|left|right))?\.png/i;
function fixImg(im){if(!im||im.tagName!=='IMG'||im.classList.contains('mini'))return;const s=im.getAttribute('src')||'';const m=s.match(RX);if(!m)return;
const e=['up','down','left','right'].includes(m[2])?'neutral':(m[2]||'neutral');try{im.setAttribute('src',CH.portrait(m[1].toLowerCase(),isIn(),e))}catch(err){}}
function scan(root){(root.querySelectorAll?root.querySelectorAll('img'):[]).forEach(fixImg);if(root.tagName==='IMG')fixImg(root)}
new MutationObserver(ms=>ms.forEach(m=>{if(m.type==='attributes')fixImg(m.target);else m.addedNodes.forEach(n=>{if(n.nodeType===1)scan(n)})})).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
scan(document.body);
// портреты NPC — из той же системы
P.npcPortrait=k=>{try{return CH.portrait(k,false,'neutral')}catch(e){return''}};
// ---------- сюжетные сцены, действия, нападения: K.chibi рисует ту же модель ----------
const REV=new Map();
function indexLooks(){if(K.HERO)for(const k in K.HERO){const h=K.HERO[k];if(h.in)REV.set(h.in,[k,true]);if(h.out)REV.set(h.out,[k,false])}if(K.NPC)for(const k in K.NPC)REV.set(K.NPC[k],[k,false])}
indexLooks();
const POSE_E={fight:'angry',scared:'afraid',fall:'afraid',lie:'tired',hug:'happy',reach:'neutral',sit:'neutral',stand:'neutral'};
if(K.chibi){const _ch=K.chibi;
K.chibi=function(ctx,x,y,s,lk,pose,face){const r=REV.get(lk);if(!r)return _ch.apply(this,arguments);
try{pose=pose||'stand';face=face||1;const sp=CH.body(r[0],r[1],POSE_E[pose]||'neutral',face>0?1:-1);
const sm=lk.acc&&lk.acc.includes('small')?.82:1,h=150*s*sm*(pose==='sit'?.86:1),w=h*sp.width/sp.height;
ctx.save();ctx.translate(x,y);ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(0,0,(pose==='lie'?60:30)*s,8*s,0,0,7);ctx.fill();
if(pose==='lie'){ctx.translate(-h*.45,-18*s);ctx.rotate(-Math.PI/2)}else if(pose==='fall'){ctx.translate(-10*s,-6*s);ctx.rotate(-1.25)}else if(pose==='fight')ctx.rotate(-.08);else if(pose==='scared')ctx.rotate(.06);
ctx.drawImage(sp,-w/2,-h,w,h);ctx.restore()}catch(e){console.warn('chibi',e);return _ch.apply(this,arguments)}};
if(P._chibi)P._chibi=(ctx,x,y,s,lk,pose,face)=>K.chibi(ctx,x,y,s,lk,pose,face)}
// ---------- очистка белого фона у любых PNG (chars/, старые ассеты) ----------
function cleanImage(im){const W=im.naturalWidth||im.width,H=im.naturalHeight||im.height;const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.drawImage(im,0,0);
let d;try{d=g.getImageData(0,0,W,H)}catch(e){return null}const p=d.data,n=W*H,bg=new Uint8Array(n),q=new Int32Array(n);let qh=0,qt=0;
const light=i=>{const r=p[i*4],gg=p[i*4+1],b=p[i*4+2],a=p[i*4+3];if(a<30)return true;const mx=Math.max(r,gg,b),mn=Math.min(r,gg,b);return mn>198&&mx-mn<42};
const push=i=>{if(!bg[i]&&light(i)){bg[i]=1;q[qt++]=i}};
for(let x=0;x<W;x++){push(x);push((H-1)*W+x)}for(let y=0;y<H;y++){push(y*W);push(y*W+W-1)}
while(qh<qt){const i=q[qh++],x=i%W;if(x>0)push(i-1);if(x<W-1)push(i+1);if(i>=W)push(i-W);if(i<n-W)push(i+W)}
for(let i=0;i<n;i++)if(bg[i])p[i*4+3]=0;
// края: убираем белый ореол (смягчение альфы + очистка цвета от белого)
for(let i=0;i<n;i++){if(bg[i])continue;const x=i%W;const nb=(x>0&&bg[i-1])||(x<W-1&&bg[i+1])||(i>=W&&bg[i-W])||(i<n-W&&bg[i+W]);if(!nb)continue;
const r=p[i*4],gg=p[i*4+1],b=p[i*4+2],l=(r+gg+b)/3;if(l>150){const a=Math.max(0,Math.min(1,(255-l)/105));p[i*4+3]=Math.round(p[i*4+3]*a);if(a>0){for(let k=0;k<3;k++)p[i*4+k]=Math.max(0,Math.min(255,Math.round((p[i*4+k]-255*(1-a))/a)))}}}
g.putImageData(d,0,0);c.naturalWidth=W;c.naturalHeight=H;c.complete=true;c._clean=1;return c}
CH.cleanImage=cleanImage;
function cleanPngs(){const I=A.png;if(!I)return;let ch=0;for(const k in I){const im=I[k];if(im&&!im._clean&&im.tagName==='IMG'&&im.complete&&im.naturalWidth){const c=cleanImage(im);if(c){I[k]=c;ch=1}else im._clean=1}}if(ch){cache.clear();try{P.stage&&P.stage.clear&&P.stage.clear();render()}catch(e){}}}
let tries=0;const iv=setInterval(()=>{cleanPngs();if(++tries>40)clearInterval(iv)},600);
const CL={};const BLANK='data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
cleanSrc=function(src){if(CL[src])return CL[src]==='p'?BLANK:CL[src];CL[src]='p';const im=new Image();im.onload=()=>{const c=cleanImage(im);CL[src]=c?c.toDataURL():src;try{if(N[id].explore)drawMini()}catch(e){}};im.onerror=()=>{CL[src]=src};im.src=src;return BLANK};
// перерисовать при смене одежды (дом/улица) и при входе на карту
const _r=render;render=function(){const out=_r.apply(this,arguments);try{if(N[id].explore)drawMini()}catch(e){}return out};
CH.list=()=>HEROES.concat(Object.keys(K.NPC||{}));
})();
