// Панель №7 — дополнение, этап 3 (часть 2): стычки и взаимодействия персонажей.
// Этап 7: случайные нападения УДАЛЕНЫ. Драка запускается только из сценария: P.startFight({story:true,quest,foe,onEnd}).
(function(){
const P=window.P7;if(!P)return;
const st=document.createElement('style');st.textContent=`
.fightPanel{position:absolute;inset:0;z-index:40;display:grid;place-items:center;background:rgba(50,4,0,.6)}
.fightPanel.hidden{display:none}
.fightCard{width:min(560px,90vw);background:#141713;border:2px solid #b5452f;padding:22px 26px;text-align:center;color:#eee8d9;font-family:'Courier New',monospace;box-shadow:0 20px 60px rgba(0,0,0,.7)}
.fightCard.shake{animation:fshake .12s}
@keyframes fshake{0%{transform:translate(0)}33%{transform:translate(-5px,2px)}66%{transform:translate(5px,-2px)}100%{transform:translate(0)}}
.fightTitle{font:700 20px 'Courier New',monospace;color:#e06a4f;letter-spacing:.12em}
.fightFoe{margin-top:8px;font-weight:700;color:#d6b865}
.fightText{margin:10px 0 16px;font-size:16px;line-height:1.4}
.fightBar{height:22px;border:1px solid #7d6c45;background:#2a1a14}
.fightFill{height:100%;width:30%;background:linear-gradient(90deg,#b5452f,#d6b865)}
.fightTimer{margin:8px 0 14px;color:#8e836b;font-weight:700}
.fightBtn{border:2px solid #d6b865;background:#3a1a12;color:#fff;padding:14px 26px;font:700 18px 'Courier New',monospace;cursor:pointer}
.fightBtn:active{background:#b5452f}
.bondBtn{position:absolute;top:258px;right:30px;z-index:7;display:none;border:1px solid #9a5a6a;background:#1a1114;color:#f0d6dc;padding:9px 12px;cursor:pointer;font:700 12px 'Courier New',monospace}
.bondBtn.show{display:block}.bondBtn:hover{background:#c27a8c;color:#11130f}
@media(max-width:700px){.bondBtn{top:242px;right:16px}}`;document.head.appendChild(st);
const game=$('game');
const ov=document.createElement('div');ov.className='fightPanel hidden';ov.innerHTML=`<div class='fightCard'><div class='fightTitle'>СТЫЧКА</div><div class='fightFoe'></div><div class='fightText'></div><div class='fightBar'><div class='fightFill'></div></div><div class='fightTimer'></div><button class='fightBtn'>УДАР! (F)</button></div>`;game.appendChild(ov);
const card=ov.querySelector('.fightCard'),ttl=ov.querySelector('.fightTitle'),foeEl=ov.querySelector('.fightFoe'),txt=ov.querySelector('.fightText'),fill=ov.querySelector('.fightFill'),tim=ov.querySelector('.fightTimer'),fbtn=ov.querySelector('.fightBtn');
// противники по умолчанию (имена используются game5i для арта); сценарий передаёт своего foe
const FOES=[{n:'Гопник в спортивном костюме',t:'«Слышь, есть чё? Мелочь гони, быстро!»'},{n:'Пьяный мужик',t:'«Ты чё тут ходишь?! А ну стоять!»'}];
let F=null,loop=null,result=false,resTimer=null,OPT=null;
const G=w=>w==='zhenya'?'а':'';
// запуск ТОЛЬКО сюжетный: без o.story драка не начинается
function start(o){if(!o||!o.story)return false;if(F||result)return false;if(P.invOpen&&P.toggleInv)P.toggleInv(false);OPT=o;const foe=o.foe||FOES[0];F={p:30,end:Date.now()+(o.time||7000)};P.fighting=true;ttl.textContent=o.title||'СТЫЧКА';foeEl.textContent=foe.n;txt.textContent=foe.t+' — быстро жми F (или кнопку), чтобы отбиться!';fbtn.style.display='';fbtn.textContent='УДАР! (F)';ov.classList.remove('hidden');loop=setInterval(tick,50);tick();return true}
P.startFight=start;
function tick(){if(!F)return;if(P.PAUSE&&P.PAUSE.on){F.end+=50;return}F.p-=.6;fill.style.width=Math.max(0,F.p)+'%';const left=Math.max(0,F.end-Date.now());tim.textContent='Осталось: '+(left/1000).toFixed(1)+' с';if(F.p>=100)end(true);else if(F.p<=0||left<=0)end(false)}
function hit(){if(!F)return;F.p=Math.min(100,F.p+7);card.classList.remove('shake');void card.offsetWidth;card.classList.add('shake');if(P.SFX&&P.SFX.hit)P.SFX.hit();tick()}
// итог сюжетной стычки: без случайных кошельков и потерь — последствия задаёт сценарий (onEnd)
function end(win){clearInterval(loop);F=null;P.fighting=false;result={win};const w=P.who(),n=P.NAMES[w];let m;
if(win)m=(OPT&&OPT.winText)||`${n} отбил${G(w)}сь! Нападавший отступает.`;
else{m=(OPT&&OPT.loseText)||'Не получилось… Толкнули в сугроб.';if(P.take&&P.take('bandage'))m+=' Ссадину перевязали бинтом (−1 🩹).';else if(P.addMin){P.addMin(20);m+=' Бинта нет — пришлось долго приходить в себя (+20 мин).'}}
fill.style.width=win?'100%':'0%';txt.textContent=m;tim.textContent='';fbtn.textContent='ДАЛЬШЕ (Enter)';resTimer=setTimeout(close,5000)}
function close(){clearTimeout(resTimer);const r=result;result=false;ov.classList.add('hidden');const o=OPT;OPT=null;if(o&&o.onEnd)try{o.onEnd(!!(r&&r.win))}catch(e){}}
fbtn.addEventListener('click',e=>{e.stopPropagation();if(F)hit();else if(result)close()});
ov.addEventListener('click',e=>e.stopPropagation());
window.addEventListener('keydown',e=>{if(!F&&!result)return;if(F&&(e.code==='KeyF'||e.code==='Space')&&!e.repeat)hit();else if(result&&(e.code==='Enter'||e.code==='Space'))close();e.preventDefault();e.stopImmediatePropagation()},true);
const titleOff=()=>{const t=$('title');return !t||t.classList.contains('hidden')};
// (этап 7) случайные нападения при прогулке по улице и при входе в «опасные» локации удалены.

// взаимодействия Кирилла и Жени
const ACC={kirill:'Кирилла',zhenya:'Женю'};
const other=w=>w==='kirill'?'zhenya':'kirill';
const ACT={
Hug:{t:(a,b)=>`${P.NAMES[a]} подходит и крепко обнимает ${ACC[b]}. На секунду становится тепло, даже среди этого холодного ноября.`,r:{kirill:'Ты чего?.. Ладно. Не отпускай пока.',zhenya:'Вот так бы и стояла весь день.'}},
Cheek:{t:(a,b)=>`${P.NAMES[a]} быстро целует ${ACC[b]} в щёку.`,r:{kirill:'Эй… это нечестно, я не успел подготовиться.',zhenya:'Ой… Ты сегодня какой-то особенно милый.'}},
Forehead:{t:(a,b)=>`${P.NAMES[a]} осторожно притягивает ${ACC[b]} к себе и нежно целует в лоб.`,r:{kirill:'Тёплая ты. А я думал, это у меня температура.',zhenya:'Как в детстве, когда мама целовала перед сном…'}},
Pat:{t:(a,b)=>`${P.NAMES[a]} ласково гладит ${ACC[b]} по голове.`,r:{kirill:'Я тебе что, котёнок?.. Ладно, продолжай.',zhenya:'Мрр. Ещё немножко — и я замурлычу.'}}
};
const BOND=['bondMenu'];
N.bondMenu={w:'none',s:'Рассказчик',t:'Кирилл и Женя стоят рядом. Что сделать?',c:[['Обнять','bondHug','♡'],['Поцеловать в щёку','bondCheek','❤'],['Поцеловать в лоб','bondForehead','❦'],['Погладить по голове','bondPat','✋'],['Просто улыбнуться друг другу','bondBack','←']]};
for(const k in ACT){N['bond'+k]={w:'none',s:'Рассказчик',t:'',next:'bond'+k+'R',act:k};N['bond'+k+'R']={w:'kirill',s:'Кирилл',t:'',next:'bondBack',actR:k};BOND.push('bond'+k,'bond'+k+'R')}
N.bondBack={w:'none',s:'',t:'',next:'homeExplore'};
let actor='kirill';
const setDyn=(x,o)=>{for(const k of ['t','s']){x[k]=o[k];if('_t0' in x)x['_'+k+'0']=o[k]}if(o.w)x.w=o.w};
const _r=render;
render=function(...a){if(id==='bondBack')id=N[P.bondReturn]?P.bondReturn:'homeExplore';const x=N[id];
if(x.act){actor=P.who();setDyn(x,{t:ACT[x.act].t(actor,other(actor)),s:'Рассказчик'})}
if(x.actR){const b=other(actor);setDyn(x,{t:ACT[x.actR].r[b],s:P.NAMES[b],w:b});setTimeout(()=>P.toast('💕'),60)}
return _r.apply(this,a)};
const bbtn=document.createElement('button');bbtn.className='bondBtn';bbtn.textContent='💞 ВМЕСТЕ (R)';game.appendChild(bbtn);
function near(){const x=N[id];if(!x||!x.explore||F||result||P.invOpen||!titleOff()||(P.PAUSE&&P.PAUSE.on)||(P.CUT&&P.CUT.on))return false;let ws;try{ws=worldState()}catch(e){return false}if(!ws||!ws.kirill||!ws.zhenya||ws.kirill.x==null)return false;if(ws.party&&ws.party!=='both')return false;return Math.hypot(ws.kirill.x-ws.zhenya.x,ws.kirill.y-ws.zhenya.y)<14}
setInterval(()=>bbtn.classList.toggle('show',near()),250);
function openBond(){if(!near())return;const x=N[id];const base={kitchen:'kitchenExplore',corridor:'corridorExplore',home:'homeExplore'};P.bondReturn=x.spawn&&base[x.map]?base[x.map]:id;BOND.forEach(k=>{N[k].room=x.room;N[k].scene=x.scene});P.go('bondMenu')}
bbtn.addEventListener('click',e=>{e.stopPropagation();openBond()});
window.addEventListener('keydown',e=>{if(e.code!=='KeyR'||F||result||P.invOpen)return;if(!near())return;e.preventDefault();e.stopImmediatePropagation();openBond()},true);
const help=document.querySelector('.exploreHelp');if(help)help.textContent+=' · R — ВМЕСТЕ';
})();
