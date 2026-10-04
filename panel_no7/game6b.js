// game6b.js — правило «в диалоге только те, кто в сцене», выделение говорящего, двор без машины, лужа,
// сюжет из 6 глав с выборами и 4 концовками. Состояние хранится в P.S.story и сохраняется вместе с игрой (game4b).
(function(){
const P=window.P7=window.P7||{};const $=i=>document.getElementById(i);
const X=()=>(typeof N!=='undefined'&&N[id])||{};
const party=()=>{try{return(typeof worldState==='function'&&worldState().party)||(typeof street!=='undefined'&&street.party)||'both'}catch(e){return'both'}};
const heroes=p=>p==='both'?['zhenya','kirill']:[p];
/* 1. ДИАЛОГИ: состав героев = те, кто физически в сцене */
const origCast=P.cast;
P.cast=(x,po)=>{x=x||X();if(x.cast)return x.cast.slice();if(po)return heroes(po);if(x.party)return heroes(x.party);
 if(x.map||x.outdoor||!(P.inApt&&P.inApt(x)))return heroes(party());
 return origCast?origCast(x,po):heroes(party())};
const css=document.createElement('style');css.textContent=`
#p7stage .p7ch{transition:filter .25s,transform .25s,opacity .25s}
#p7stage .p7ch.p7dim{filter:brightness(.6) saturate(.8)}
#p7stage .p7ch.p7spk{transform:translateY(-6px) scale(1.06);z-index:3}
#p7story{position:fixed;inset:0;z-index:8000;display:none;align-items:flex-end;justify-content:center;background:linear-gradient(transparent 30%,rgba(5,4,8,.85));font-family:Georgia,serif}
#p7story .card{width:min(900px,96vw);margin-bottom:3vh;color:#ece6dc}
#p7story canvas{display:block;width:100%;height:auto}
#p7story .txt{background:rgba(12,10,16,.94);border:1px solid #3a3038;border-top:3px solid #b8282e;padding:14px 20px;font-size:18px;line-height:1.5;min-height:70px}
#p7story .nm{color:#ff9aa0;font-weight:bold;letter-spacing:2px;font-size:14px;margin-bottom:4px}
#p7story .ch{display:flex;flex-direction:column;gap:4px;margin-top:10px}
#p7story .ch button{all:unset;cursor:pointer;padding:6px 12px;border-radius:3px;color:#cfc8bd;transition:background .15s,transform .15s}
#p7story .ch button:hover{background:rgba(184,40,46,.25);color:#fff;transform:translateX(5px)}
#p7story .ch button:active{transform:translateX(8px) scale(.98)}
#p7story .chap{position:absolute;top:8%;left:0;right:0;text-align:center;font-size:30px;letter-spacing:6px;color:#f1ece4;text-shadow:2px 2px 0 #6d1418}
`;document.head.appendChild(css);
const NAME={zhenya:'ЖЕНЯ',kirill:'КИРИЛЛ',narr:''};
setInterval(()=>{const st=$('p7stage');if(!st)return;const sp=X().speaker;const ch=[...st.querySelectorAll('.p7ch')];const vis=ch.filter(c=>c.style.display!=='none'&&c.style.opacity!=='0');
 vis.forEach(c=>{const me=c.dataset.k===sp;c.classList.toggle('p7spk',me&&vis.length>1);c.classList.toggle('p7dim',!!sp&&sp!=='narr'&&!me&&vis.length>1)});
 // автораскладка без наложений: равные промежутки, Женя слева, Кирилл справа от героев, NPC по краям
 if(vis.length>=3){const ord=vis.slice().sort((a,b)=>rank(a.dataset.k)-rank(b.dataset.k));const w=100/ord.length;ord.forEach((c,i)=>{c.style.left=(w*i+w/2)+'%';c.style.maxWidth=(w*.98)+'%'})}},200);
const rank=k=>k==='zhenya'?1:k==='kirill'?2:k&&k.startsWith('npc')?0:3;
/* 7. ДВОР: машина убрана полностью (картинка, осмотр и коллизия), лужа остаётся */
function noCar(){try{const S=P._scenes||{};Object.values(S).forEach(sc=>{if(sc&&Array.isArray(sc.items))sc.items=sc.items.filter(it=>it[0]!=='car');if(sc&&sc.items&&!sc.items.some(it=>it[0]==='puddle')&&sc===S.yard)sc.items.push(['puddle',62,74,86,84])});
 const M=P.COL&&P.COL.MAPS;if(M)Object.values(M).forEach(m=>{if(Array.isArray(m))for(let i=m.length-1;i>=0;i--)if(/car|машин|москвич/i.test(m[i].n||''))m.splice(i,1)})}catch(e){}}
noCar();setTimeout(noCar,500);
/* сюжетное состояние */
function S(){P.S=P.S||{};const s=P.S.story=P.S.story||{ch:1,done:{},f:{},bond:0,rep:0,clues:0,last:0,ending:null};return s}
let open=false,busy=0;
function box(){let b=$('p7story');if(!b){b=document.createElement('div');b.id='p7story';b.innerHTML='<div class="chap"></div><div class="card"><canvas width="900" height="300"></canvas><div class="txt"><div class="nm"></div><div class="tx"></div><div class="ch"></div></div></div>';document.body.appendChild(b)}return b}
function drawCast(cast,spk,emo){const cv=box().querySelector('canvas'),g=cv.getContext('2d');g.clearRect(0,0,900,300);const n=cast.length;if(!n)return;const w=900/n;
 cast.forEach((k,i)=>{let c=null;try{c=P.CHAR&&P.CHAR.body?P.CHAR.body(k,false,(emo&&emo[k])||'neutral',0):null}catch(e){}if(!c||!c.width)return;const h=290,cw=Math.min(c.width*h/c.height,w*.95),ch=c.height*cw/c.width;
  g.save();if(spk&&k!==spk&&n>1)g.filter='brightness(.6)';const x=w*i+w/2;if(i<n/2-.01&&n>1){g.translate(x,0);g.scale(-1,1);g.translate(-x,0)}g.drawImage(c,x-cw/2,300-ch+(k===spk?-4:4),cw,ch);g.restore()})}
// в сюжетной сцене тоже действует правило состава: герои = кто рядом, + NPC сцены только пока он в ней
function play(ev,done){open=true;const b=box();b.style.display='flex';const s=S();const p=ev.solo||party();let present=heroes(p);let i=0;
 const chap=b.querySelector('.chap');chap.textContent=ev.chapTitle||'';chap.style.opacity=ev.chapTitle?1:0;
 const lines=typeof ev.lines==='function'?ev.lines(s,p):ev.lines;
 function step(){const L=lines[i];if(!L){finish();return}
  if(L.enter&&!present.includes(L.enter))present.push(L.enter);if(L.leave)present=present.filter(k=>k!==L.leave);
  if(L.who&&L.who!=='narr'&&!present.includes(L.who)){if(L.who==='zhenya'||L.who==='kirill'){i++;step();return}present.push(L.who)}
  drawCast(present,L.who,L.emo);if(L.sfx&&P.SFX&&P.SFX[L.sfx])P.SFX[L.sfx]();
  b.querySelector('.nm').textContent=NAME[L.who]!==undefined?NAME[L.who]:(L.name||'').toUpperCase();b.querySelector('.tx').textContent=L.t;
  const C=b.querySelector('.ch');C.innerHTML='';const opts=L.choices?L.choices.filter(o=>!o.if||o.if(s,p)):[{t:'…',go:1}];
  opts.forEach(o=>{const bt=document.createElement('button');bt.textContent=o.t==='…'?'▶ дальше':'▸ '+o.t;bt.onclick=()=>{if(o.fx)o.fx(s,p);if(o.line){lines.splice(i+1,0,...o.line)}i++;step()};C.appendChild(bt)})}
 function finish(){b.style.display='none';chap.style.opacity=0;open=false;s.done[ev.id]=1;s.last=Date.now();try{P.save&&P.save()}catch(e){}if(done)done()}
 step()}
P.STORY={S,play,get open(){return open},tense:()=>open&&!!curEv&&!!curEv.tense,big:()=>open&&!!curEv&&!curEv.tense,rain:()=>S().ch>=3&&S().ch<=4,reset:()=>{if(P.S)delete P.S.story}};
let curEv=null;
const EV=P.STORY_EV||[];const Z='zhenya',K='kirill',NR='narr';
/* КОНЦОВКИ — строго по решениям, без случайности */
function ending(s){if(s.clues>=4&&s.f.checked&&s.f.trustVera&&s.f.contract)return'secret';
 if(s.f.trustRoma||(s.f.lied&&s.bond<0)||s.rep<=-2)return'bad';
 if(s.bond>=2&&s.rep>=2&&(s.f.helpedOld||s.f.spoke)&&!s.f.lied)return'good';return'neutral'}
const END={good:['ХОРОШАЯ КОНЦОВКА · «Наш дом»','Жильцы не подписали ничего. Рома уехал ни с чем. Женя и Кирилл сидят на кухне, и молчать вдвоём наконец не страшно.'],
 neutral:['НЕЙТРАЛЬНАЯ КОНЦОВКА · «До весны»','Дом пока стоит, но половина соседей уже собирает коробки. Женя и Кирилл не знают, что будет дальше — но знают, что будут рядом.'],
 bad:['ПЛОХАЯ КОНЦОВКА · «Пустые окна»','Подписи собраны. Свет в окнах панели № 7 гаснет одно за другим. Кирилл и Женя уезжают в разные стороны города.'],
 secret:['СЕКРЕТНАЯ КОНЦОВКА · «Почерк»','Записки, сообщение, история старика и договор ложатся на стол следователя. Вера улыбается впервые. А на обороте договора — тот же дрожащий почерк… и дата из будущего.']};
function showEnd(){const s=S();s.ending=s.ending||ending(s);const e=END[s.ending];const b=box();b.style.display='flex';open=true;curEv={tense:0};
 b.querySelector('.chap').textContent=e[0];b.querySelector('.chap').style.opacity=1;drawCast(s.ending==='bad'?heroes(party()==='both'?'zhenya':party()):['zhenya','kirill'],null,{zhenya:s.ending==='bad'?'sad':'happy',kirill:s.ending==='bad'?'sad':'happy'});
 b.querySelector('.nm').textContent='';b.querySelector('.tx').textContent=e[1]+`  (доверие: ${s.bond}, двор: ${s.rep}, улики: ${s.clues})`;
 const C=b.querySelector('.ch');C.innerHTML='';[['В ГЛАВНОЕ МЕНЮ',()=>{P.MENU&&P.MENU.show()}],['ПРОДОЛЖИТЬ ГУЛЯТЬ',()=>{}]].forEach(([t,f])=>{const bt=document.createElement('button');bt.textContent='▸ '+t;bt.onclick=()=>{b.style.display='none';open=false;curEv=null;f()};C.appendChild(bt)});try{P.save&&P.save()}catch(e){}}
P.STORY.ending=()=>ending(S());P.STORY.showEnd=showEnd;P.STORY.events=EV;
/* ЛУЖА: первый вход в двор/переулок/улицу; реакция зависит от состава группы, один раз на каждый состав */
const locKey=x=>String(x.scene||x.scn||x.loc||x.map||'');
const PUD={both:{id:'pud_both',lines:[{who:K,emo:{kirill:'surprised'},t:'— Ай! Чёрт, прямо в лужу… И она не замёрзла.',sfx:'splash'},{who:Z,emo:{zhenya:'happy'},t:'Ты же сам говорил: «смотри под ноги». Давай, дома носки высушим.'},{who:K,emo:{kirill:'embarrassed'},t:'Никому не рассказывай.'}]},
 zhenya:{id:'pud_z',lines:[{who:Z,emo:{zhenya:'thinking'},t:'Лужа под снегом. Хорошо, что Кирилла тут нет — он бы точно в неё влез. Обхожу.'}]},
 kirill:{id:'pud_k',lines:[{who:K,emo:{kirill:'annoyed'},t:'Лужа. Нет уж, сегодня я не попадусь. Перешагиваю.'}]}};
let lastLoc='';
function tick(){try{if(open||(P.MENU&&P.MENU.open)||$('p7gate')||P.fighting)return;const ti=$('title');if(ti&&!ti.classList.contains('hidden'))return;
 const x=X(),lk=locKey(x),s=S(),p=party();
 if(lk!==lastLoc){lastLoc=lk;if(/yard|alley|street|двор|улиц/i.test(lk)){const ev=PUD[p];if(ev&&!s.done[ev.id]){curEv=ev;play(ev,()=>{curEv=null});return}}}
 if(!x.map&&!x.scene&&!x.outdoor)return; // сюжет не перебивает чужие диалоги — только во время свободного исследования
 const gap=s.last?(P.STORY_GAP??70000):(P.STORY_FIRST??15000);if(!s.started){s.started=Date.now();s.last=0}if(Date.now()-(s.last||s.started)<gap)return;
 const pool=EV.filter(e=>e.ch===s.ch&&!s.done[e.id]);const ev=pool.find(e=>!e.if||e.if(s,p));
 if(!ev){if(pool.length){pool.forEach(e=>s.done[e.id]='skip')}if(s.ch<6){s.ch++;s.last=Date.now()-gap+4000}else if(!s.ending)showEnd();return}
 curEv=ev;play(ev,()=>{curEv=null;if(ev.id==='c6_final')showEnd()})}catch(e){}}
setInterval(tick,1000);
/* журнал (J/О): глава и найденное, без спойлеров про числа */
document.addEventListener('keydown',e=>{if(!/^(j|о)$/i.test(e.key)||open||(P.MENU&&P.MENU.open))return;const s=S();const notes=[s.f.note1&&'Записка у подъезда',s.f.note2&&'Записка из подвала',s.f.oldStory&&'История старика',s.f.contract&&'Договор с фамилией Ромы'].filter(Boolean);
 const ch=['','Обычный день','Первые странности','Конфликт','Разделение','Последствия','Финал'][s.ch];
 curEv=null;play({id:'journal_'+Date.now(),lines:[{who:NR,t:`ЖУРНАЛ · Глава ${s.ch}: ${ch}. Найдено: ${notes.length?notes.join(', '):'пока ничего'}.`}]},()=>{delete S().done[Object.keys(S().done).find(k=>k.startsWith('journal_'))]})});
})();
