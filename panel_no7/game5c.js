// Панель №7 — этап 5 (часть 3): сцена диалога — расстановка персонажей, вход/выход, подсветка говорящего.
(function(){'use strict';
const P=window.P7;if(!P||!P.art)return;
const game=$('game');if(!game)return;
const {fig,heroLook,npcLook,BR,hash,W,H,NPCS}=P.art;
// ---------- сцена диалога ----------
const css=document.createElement('style');css.textContent=`
#p7stage{position:absolute;inset:0;z-index:5;pointer-events:none;overflow:hidden}
.p7ch{position:absolute;bottom:-2vh;height:min(76vh,690px);aspect-ratio:3/4;translate:-50% 0;transition:left .5s cubic-bezier(.3,.7,.3,1),opacity .4s,filter .35s}
.p7ch .p7s{width:100%;height:100%;transition:transform .45s cubic-bezier(.3,.7,.3,1)}
.p7ch .p7b{width:100%;height:100%;transform-origin:50% 100%;animation:p7breath 4.2s ease-in-out infinite}
.p7ch canvas{width:100%;height:100%;display:block}
.p7ch.flip canvas{transform:scaleX(-1)}
.p7ch.dim{filter:brightness(.42) saturate(.6)}
.p7ch.spk{z-index:2}.p7ch.spk .p7s{transform:translateY(-1.2vh) scale(1.03)}
.p7ch.say .p7b{animation:p7say .42s ease-out,p7breath 4.2s ease-in-out .42s infinite}
.p7ch.in,.p7ch.out{opacity:0}.p7ch.in .p7s,.p7ch.out .p7s{transform:translateX(var(--from))}
@keyframes p7breath{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.01)}}
@keyframes p7say{0%{transform:translateY(0)}35%{transform:translateY(-14px)}100%{transform:translateY(0)}}
#game.p7dlg .bg{filter:grayscale(1) contrast(1.1) brightness(.2)!important;transition:filter .4s}
#game.p7dlg .dialogPortrait,#game.p7dlg .npcPortrait,#game.p7dlg .mini{visibility:hidden!important}
#game.p7box .box{background:rgba(6,6,5,.82)!important;border:1px solid rgba(239,230,207,.28)!important;box-shadow:0 18px 60px rgba(0,0,0,.7)!important;left:21vw!important;right:21vw!important;padding:52px 40px 30px!important;border-radius:4px!important}
#game.p7box .box .name{top:14px!important;background:none!important;border:none!important;box-shadow:none!important;color:var(--p7c,#efe6cf)!important;font:700 17px Georgia,serif!important;letter-spacing:.14em;padding:0!important}
#game.p7box .box .text{color:var(--p7c,#efe6cf)!important;font-family:Georgia,'Times New Roman',serif!important;text-shadow:0 1px 0 #000}
#game.p7box .box.narr .text{font-style:italic}
#game.p7box .box .hint{color:rgba(239,230,207,.45)!important}
@media(max-width:700px){.p7ch{height:52vh;bottom:22vh}#game.p7box .box{left:12px!important;right:12px!important}}`;
document.head.appendChild(css);
const stage=document.createElement('div');stage.id='p7stage';game.insertBefore(stage,$('box'));
const EL=new Map();let lastSpk='';
const SLOTS={1:[50],2:[25,75],3:[17,50,83],4:[12,37,63,88]};
const COL={kirill:'#d4e2ec',zhenya:'#f2c4cc'};
const npcCol=k=>'hsl('+(hash(k)%360)+',42%,80%)';
const EXN={scared:'afraid',fear:'afraid',smile:'happy',joy:'happy',glad:'happy',shock:'surprised',surprise:'surprised',sorrow:'sad',cry:'sad',tired:'sad',serious:'determined',mad:'angry'};
function normE(e){e=e||'neutral';e=EXN[e]||e;return BR[e]?e:'neutral'}
function npcExpr(t){if(/(спасибо|рад|хорош|молодц|ха-ха|улыб)/i.test(t))return'happy';if(/(вали|чёрт|черт|пошли вон|хрен|стоять|куда пр)/i.test(t))return'angry';if(/(ой|помогите|боже|страшн)/i.test(t))return'afraid';if(/(жаль|умер|горе|тяжел)/i.test(t))return'sad';if(/!\s*$/.test(t))return'determined';return'neutral'}
function mk(k){const d=document.createElement('div');d.className='p7ch';d.dataset.k=k;d.innerHTML='<div class="p7s"><div class="p7b"></div></div>';const c=document.createElement('canvas');c.width=W;c.height=H;d.querySelector('.p7b').appendChild(c);d._c=c;return d}
function clear(){EL.forEach(el=>{clearTimeout(el._t);el.remove()});EL.clear();lastSpk=''}
function castOf(x){let heroes=[];try{heroes=(P.cast?P.cast(x):['kirill','zhenya'])||[]}catch(e){heroes=['kirill','zhenya']}
heroes=heroes.filter(h=>h==='kirill'||h==='zhenya');
let sp=null;try{sp=P.speakerNpc?P.speakerNpc(x):null}catch(e){}
const npcs=[];if(sp&&NPCS()[sp])npcs.push(sp);
[].concat(x.with||[],(P.PT&&P.PT.npc)?[P.PT.npc]:[]).forEach(k=>{if(k&&!npcs.includes(k)&&NPCS()[k])npcs.push(k)});
return{heroes,npcs,sp:npcs.includes(sp)?sp:null}}
function update(){const x=(typeof N!=='undefined'&&N[id])||{};const box=$('box');
if(x.explore||P.fighting||x.noPortraits){clear();game.classList.remove('p7dlg','p7box');return}
game.classList.add('p7box');
const c=castOf(x);const w=(x.w==='kirill'||x.w==='zhenya')&&c.heroes.includes(x.w)?x.w:null;
const spk=w||c.sp||'';
const illu=!spk&&game.classList.contains('actionPhoto');
const list=illu?[]:c.heroes.concat(c.npcs).slice(0,4);
const voice=x.w==='kirill'||x.w==='zhenya'?x.w:'';
if(box){box.style.setProperty('--p7c',spk?(COL[spk]||npcCol(spk)):voice?COL[voice]:(x.s?'#e6dcc4':'#cfc6b0'));box.classList.toggle('narr',!spk&&!voice&&!x.s)}
game.classList.toggle('p7dlg',list.length>0);
let indoor=false;try{indoor=P.inApt?!!P.inApt(x):false}catch(e){}
const ex0=normE(x.e);const spE=!spk?'neutral':(w||x.e)?ex0:npcExpr(x.t||'');
const pos=SLOTS[list.length]||[];const seen=new Set();
list.forEach((k,i)=>{seen.add(k);const left=pos[i],isS=k===spk;
let e=isS?spE:(spE==='angry'||spE==='afraid'?'worried':spE==='happy'?'happy':spE==='sad'?'sad':'neutral');
if(isS&&e==='neutral')e='talk';
const flip=left>50;let lk=0;if(spk&&!isS){const si=list.indexOf(spk);if(si>=0)lk=pos[si]>left?1:-1}if(flip)lk=-lk;
const L=k==='kirill'||k==='zhenya'?heroLook(k,indoor):npcLook(k);
const sig=[L.out,L.hat,e,lk].join('|');
let el=EL.get(k);
if(!el){el=mk(k);EL.set(k,el);el.style.left=left+'%';el.style.setProperty('--from',(left<50?-14:14)+'vw');el.classList.add('in');stage.appendChild(el);requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.remove('in')))}
else{if(el.classList.contains('out')){el.classList.remove('out');clearTimeout(el._t)}el.style.left=left+'%'}
if(el.dataset.sig!==sig){el.dataset.sig=sig;fig(el._c.getContext('2d'),L,e,e,lk)}
el.classList.toggle('flip',flip);el.classList.toggle('spk',isS);el.classList.toggle('dim',!!spk&&!isS);
if(isS&&spk!==lastSpk){el.classList.remove('say');void el.offsetWidth;el.classList.add('say')}});
EL.forEach((el,k)=>{if(!seen.has(k)&&!el.classList.contains('out')){el.classList.remove('spk','say');el.classList.add('out');el._t=setTimeout(()=>{el.remove();if(EL.get(k)===el)EL.delete(k)},450)}});
lastSpk=spk}
const _render=render;render=function(){const r=_render.apply(this,arguments);try{update()}catch(e){console.warn('p7 stage',e)}return r};
P.stage={update,fig,heroLook,npcLook,clear};
try{update()}catch(e){}
})();
