// game7a.js — этап 7: CityState, сюжетные задания, драки только по сценарию, пауза на ESC, расширенное сохранение, удаление лавки.
(function(){'use strict';
const P=window.P7;if(!P)return;
const $=i=>document.getElementById(i);
const SKEY='panel7_save';
const X=()=>{try{return N[id]||{}}catch(e){return{}}};
const WS=()=>{try{return worldState()}catch(e){try{return street}catch(_){return null}}};
const SS=()=>{if(P.STORY&&P.STORY.S)return P.STORY.S();P.S=P.S||{};return P.S.story=P.S.story||{ch:1,done:{},f:{}}};
const sf=()=>{const s=SS();s.f=s.f||{};return s};
const titleOn=()=>{const t=$('title');return!!(t&&!t.classList.contains('hidden'))||(P.MENU&&P.MENU.open)||!!$('p7gate')};
const css=document.createElement('style');css.textContent=`
#p7note{position:fixed;left:50%;bottom:9%;transform:translateX(-50%) translateY(10px);z-index:9800;background:rgba(14,16,20,.92);color:#e9e4dc;border:1px solid #6d6a62;border-radius:6px;padding:9px 18px;font:15px Georgia,serif;letter-spacing:1px;opacity:0;transition:opacity .3s,transform .3s;pointer-events:none}
#p7note.show{opacity:1;transform:translateX(-50%)}
#p7q{position:absolute;left:12px;top:10px;z-index:30;max-width:340px;background:rgba(12,14,18,.72);color:#e6dfcf;border-left:3px solid #c9a24a;padding:6px 10px;font:12px 'Courier New',monospace;line-height:1.35;pointer-events:none;transition:opacity .3s}
#p7q b{color:#d6b865;letter-spacing:1px}#p7q.hide{opacity:0}
#p7pause{position:fixed;inset:0;z-index:9500;display:none;align-items:center;justify-content:center;background:rgba(5,5,8,.72);backdrop-filter:blur(2px);font-family:Georgia,serif;color:#e9e4dc}
#p7pause.on{display:flex}
#p7pause .box{min-width:340px;max-width:92vw;background:linear-gradient(#121117,#0b0a0e);border:1px solid #3a352f;box-shadow:0 20px 60px rgba(0,0,0,.7);padding:22px 26px 18px}
#p7pause h2{margin:0 0 14px;font-size:30px;letter-spacing:6px;color:#f1ece4;text-shadow:2px 2px 0 #6d1418}
#p7pause .l{display:flex;flex-direction:column;gap:4px}
#p7pause .row{display:flex;justify-content:space-between;align-items:center;gap:16px;font-size:16px;color:#cfc8bd;padding:4px 14px 4px 28px}
#p7pause input[type=range]{accent-color:#b8282e;width:150px}
#p7pause .hint{margin-top:12px;font-size:12px;color:#7d766c}`;document.head.appendChild(css);
let noteT=0;
P.note7=(t,ms)=>{let n=$('p7note');if(!n){n=document.createElement('div');n.id='p7note';document.body.appendChild(n)}n.textContent=t;n.classList.add('show');clearTimeout(noteT);noteT=setTimeout(()=>n.classList.remove('show'),ms||2000)};

/* ---------- CityState: 0 начало · 1 середина · 2 поздняя стадия · 3 финал. Только растёт, хранится в сохранении ---------- */
const CITY_NAMES=['Начало','Середина','Поздняя стадия','Финал'];
const cityFor=ch=>ch>=6?3:ch>=4?2:ch>=3?1:0;
const cityLs=[];
const CITY={names:CITY_NAMES,
 get state(){return Math.max(0,Math.min(3,SS().city|0))},
 set state(v){const s=SS(),o=s.city|0;s.city=Math.max(o,Math.min(3,v|0));if(s.city!==o)cityLs.forEach(f=>{try{f(s.city,o)}catch(e){}})},
 get level(){const s=SS(),c=this.state;if(c>=3)return 3;const ch=s.ch||1;if(cityFor(ch+1)<=c)return c;const ev=(P.STORY&&P.STORY.events||[]).filter(e=>e.ch===ch);if(!ev.length)return c;const d=ev.filter(e=>s.done&&s.done[e.id]).length;return Math.min(c+.85,c+.85*d/ev.length)},
 on(f){cityLs.push(f)},
 sync(){const s=SS();this.state=cityFor(s.ch||1)}};
P.CITY=CITY;
try{Object.defineProperty(window,'CityState',{configurable:true,get:()=>CITY.state,set:v=>{CITY.state=v}})}catch(e){}
CITY.on(c=>{P.note7('Город меняется… ('+CITY_NAMES[c]+')',2600)});

/* ---------- сюжетные задания ---------- */
const QL=[
 ['Quest_01','Обычный день','Осмотреться дома и во дворе',s=>s.ch>=2,()=>true],
 ['Quest_02','Странные записки','Разобраться, кто подбрасывает записки',s=>s.ch>=3,s=>s.ch>=2],
 ['Quest_03','Кому верить','Поговорить с соседями и Верой',s=>s.ch>=4,s=>s.ch>=3],
 ['Quest_04','Встреча с Ромой','Решить, что ответить Роме',s=>s.ch>=5,s=>s.ch>=4],
 ['Quest_05','Ответ Роме','Кирилл отказал Роме. Его люди ждут в подворотне (нужен Кирилл)',s=>!!s.f.alleyDone,s=>s.ch>=4&&!!s.f.kirRefused],
 ['Quest_06','Последствия','Узнать, что теперь будет с домом',s=>s.ch>=6,s=>s.ch>=5],
 ['Quest_07','Город на пределе','Выйти на улицу и увидеть, что стало с районом',s=>!!s.f.sawFinalStreet,s=>s.ch>=6],
 ['Quest_08','Площадь у ДК','Добраться до площади у ДК (карта города — M)',s=>!!s.f.squareDone,s=>!!s.f.sawFinalStreet],
 ['Quest_09','Финал','Сделать последний выбор',s=>!!s.ending,s=>!!s.f.squareDone]];
const QUEST={list:QL,
 isDone(q){const s=sf();s.q=s.q||{};return!!s.q[q]},
 isAvail(q){const s=sf(),r=QL.find(x=>x[0]===q);return!!r&&r[4](s)},
 isActive(q){return this.isAvail(q)&&!this.isDone(q)},
 active(){return QL.filter(r=>this.isActive(r[0])).map(r=>r[0])},
 main(){const a=this.active().filter(q=>q!=='Quest_05');return a[a.length-1]||null},
 title(q){const r=QL.find(x=>x[0]===q);return r?r[1]:q},
 upd(silent){const s=sf();s.q=s.q||{};let ch=false;for(const r of QL){if(!s.q[r[0]]&&r[4](s)&&r[3](s)){s.q[r[0]]=1;ch=true;if(!silent)P.note7('Задание выполнено: '+r[1],2400)}}
  const a=this.active().join(',');if(a!==s.qa){const nw=this.active().filter(q=>!(s.qa||'').split(',').includes(q));s.qa=a;if(!silent&&nw.length)setTimeout(()=>P.note7('Новое задание: '+this.title(nw[0]),2600),ch?2500:0)}hud();return ch},
 FIGHTS:{Quest_05:{loc:['alley'],need:['kirill'],cond:s=>!!s.f.kirRefused&&!s.f.alleyDone}},
 canFight(q){const r=this.FIGHTS[q];if(!r||!this.isActive(q))return false;if(r.loc&&!r.loc.includes(id))return false;const pr=present();if(r.need&&!r.need.every(h=>pr.includes(h)))return false;return!!r.cond(sf())}};
P.QUEST=QUEST;
function present(){try{if(P.party){const p=P.party();if(Array.isArray(p))return p;if(p&&p.heroes)return p.heroes}}catch(e){}const w=WS();const pt=w&&w.party;if(pt==='kirill'||pt==='zhenya')return[pt];return['kirill','zhenya']}
P.present=present;
function hud(){let h=$('p7q');const g=$('game');if(!g)return;if(!h){h=document.createElement('div');h.id='p7q';g.appendChild(h)}const m=QUEST.main(),side=QUEST.isActive('Quest_05')?'Quest_05':null;const r=QL.find(x=>x[0]===m);const rs=side&&QL.find(x=>x[0]===side);
 h.innerHTML=(r?`<b>ЗАДАНИЕ:</b> ${r[1]}<br>${r[2]}`:'')+(rs?`<br><b>•</b> ${rs[1]}: ${rs[2]}`:'');h.classList.toggle('hide',titleOn()||!(r||rs)||!!(P.CUT&&P.CUT.on))}
P.questHud=hud;

/* ---------- кат-сцены и пауза ---------- */
const CUT={on:false,pausable:true,mus:null,amb:null,start(o){o=o||{};this.on=true;this.pausable=o.pausable!==false;this.mus=o.mus||null;this.amb=o.amb||null;hud()},end(){this.on=false;this.mus=null;this.amb=null;hud();flush()}};
P.CUT=CUT;
let _fr=!!P.fighting;
try{Object.defineProperty(P,'fighting',{configurable:true,get(){return _fr||PAUSE.on||CUT.on},set(v){_fr=!!v}})}catch(e){}
P.fightingReal=()=>_fr;

/* ---------- драки только по сценарию ---------- */
const _sf=P.startFight;
P.startFight=function(o){if(!o||!o.story||!QUEST.canFight(o.quest))return false;return _sf?_sf.call(this,o):false};
function noDanger(){try{for(const k in N){const n=N[k];if(n&&n.danger)n.danger=0}}catch(e){}}

const ROMA='Человек Ромы';
function alleyScene(){const s=sf();if(s.f.alleyDone||!QUEST.canFight('Quest_05')||!P.STORY||P.STORY.open||PAUSE.on||CUT.on)return false;
 CUT.start({pausable:true,mus:'tense',amb:'city'});
 const ev={id:'q05_alley',ch:s.ch,lines:[
  {who:'narr',t:'В подворотне темнее обычного. От стены отделяются двое — те самые, что стояли за спиной Ромы на встрече.'},
  {who:'gopnik',name:ROMA,t:'— Кирилл, да? Рома просил передать: отказываться было невежливо.',enter:'gopnik'},
  {who:'kirill',emo:{kirill:'determined'},t:'— Передай Роме, что дом не продаётся. Ни за какие деньги.'},
  {who:'zhenya',emo:{zhenya:'afraid'},t:'— Кирилл, не надо… Пойдём отсюда.'},
  {who:'gopnik',name:ROMA,t:'— Ну, сам выбрал. Сейчас объясним по-другому.',sfx:'hit'}]};
 P.STORY.play(ev,()=>{CUT.end();
  const ok=P.startFight({story:true,quest:'Quest_05',title:'СТЫЧКА В ПОДВОРОТНЕ',foe:{n:'Гопник — '+ROMA.toLowerCase(),t:'«Последний раз по-хорошему!»'},
   winText:'Кирилл устоял. Люди Ромы отступают в темноту, ругаясь сквозь зубы.',loseText:'Кирилла сбивают в сугроб. Нападавшие уходят — предупреждение передано.',
   onEnd:win=>alleyAfter(win)});
  if(!ok)alleyAfter(null)});
 return true}
function alleyAfter(win){const s=sf();s.f.alleyDone=1;if(win)s.f.alleyWon=1;else if(win===false)s.f.alleyLost=1;
 const lines=win?[{who:'narr',t:'Тишина. Только капает с водостока.'},{who:'zhenya',emo:{zhenya:'worried'},t:'— Ты цел? Покажи руку… Рома этого так не оставит.'},{who:'kirill',emo:{kirill:'worried'},t:'— Знаю. Значит, дом им очень нужен.'}]
  :[{who:'narr',t:'Снег за шиворотом, звон в ушах. Шаги удаляются.'},{who:'zhenya',emo:{zhenya:'afraid'},t:'— Кирилл! Вставай, слышишь? Я тут.'},{who:'kirill',emo:{kirill:'sad'},t:'— Нормально… Это было предупреждение. Дальше будет хуже.'}];
 CUT.start({pausable:true,mus:'story'});
 P.STORY.play({id:'q05_after',ch:s.ch,lines,leave:'gopnik'},()=>{CUT.end();if(s.bond!=null&&present().length>1)s.bond=(s.bond||0)+1;QUEST.upd();try{P.save&&P.save()}catch(e){}})}
P.alleyScene=alleyScene;

/* ---------- пауза ---------- */
const PAUSE={on:false,view:'main',el:null};
P.PAUSE=PAUSE;
const B=(l,f,d)=>P.p7btn?P.p7btn(l,f,d):Object.assign(document.createElement('button'),{className:'p7b',textContent:l,onclick:f,disabled:!!d});
function slotTxt(i){try{const o=JSON.parse(localStorage.getItem('panel7_slot_'+i));if(!o)return null;const x=o.x7||{};const n=(N[o.id||x.id]&&(N[o.id||x.id].title||N[o.id||x.id].map))||x.id||o.id||'?';return`Слот ${i} · ${String(n).slice(0,18)} · гл. ${x.ch||'?'} · ${CITY_NAMES[x.city|0]} · ${new Date(x.at||o.at||0).toLocaleString().slice(0,16)}`}catch(e){return null}}
function pbuild(v){PAUSE.view=v;const el=PAUSE.el;el.innerHTML='';const box=document.createElement('div');box.className='box';el.appendChild(box);const h=document.createElement('h2');box.appendChild(h);const L=document.createElement('div');L.className='l';box.appendChild(L);
 if(v==='main'){h.textContent='ПАУЗА';L.append(B('ПРОДОЛЖИТЬ',()=>pclose()),B('СОХРАНИТЬ ИГРУ',()=>pbuild('save')),B('ЗАГРУЗИТЬ ИГРУ',()=>pbuild('load')),B('НАСТРОЙКИ',()=>pbuild('set')),B('ВЫЙТИ В ГЛАВНОЕ МЕНЮ',()=>{try{P.save&&P.save()}catch(e){}pclose(true);P.MENU&&P.MENU.show('main')}))}
 if(v==='save'){h.textContent='СОХРАНИТЬ';for(let i=1;i<=3;i++){const t=slotTxt(i);L.append(B(t||`Слот ${i} — пусто —`,()=>{if(P.saveSlot&&P.saveSlot(i)){P.note7('Игра сохранена');pbuild('save')}else P.note7('Не удалось сохранить')}))}L.append(B('НАЗАД',()=>pbuild('main')))}
 if(v==='load'){h.textContent='ЗАГРУЗИТЬ';for(let i=1;i<=3;i++){const t=slotTxt(i);L.append(B(t||`Слот ${i} — пусто —`,()=>{pclose(true);P.loadSlot&&P.loadSlot(i)},!t))}L.append(B('НАЗАД',()=>pbuild('main')))}
 if(v==='set'){h.textContent='НАСТРОЙКИ';const S=P.SETTINGS||{};const rng=(lab,k,bus)=>{const r=document.createElement('div');r.className='row';r.innerHTML=`<span>${lab}</span>`;const i=document.createElement('input');i.type='range';i.min=0;i.max=1;i.step=.05;i.value=S[k]??.6;i.oninput=()=>{S[k]=+i.value;P.saveSettings&&P.saveSettings();const b=P.AUDIO&&P.AUDIO[bus];if(b)b.gain.value=k==='music'?S[k]*.35:S[k]};r.appendChild(i);return r};L.append(rng('Громкость музыки','music','mus'),rng('Громкость эффектов','sfx','sfx'),B('НАЗАД',()=>pbuild('main')))}
 const hn=document.createElement('div');hn.className='hint';hn.textContent='ESC — назад / продолжить · F5 — быстрое сохранение · F9 — быстрая загрузка';box.appendChild(hn)}
function popen(){if(PAUSE.on)return;if(!PAUSE.el){PAUSE.el=document.createElement('div');PAUSE.el.id='p7pause';document.body.appendChild(PAUSE.el)}PAUSE.on=true;PAUSE.el.classList.add('on');pbuild('main');P.MUSIC&&P.MUSIC.duck&&P.MUSIC.duck(.35);hud()}
function pclose(quiet){if(!PAUSE.on)return;PAUSE.on=false;if(PAUSE.el)PAUSE.el.classList.remove('on');P.MUSIC&&P.MUSIC.duck&&P.MUSIC.duck(1);hud();if(!quiet)flush()}
PAUSE.open=popen;PAUSE.close=pclose;

P._pend=null;
function flush(){if(P._pend&&!PAUSE.on){const p=P._pend;P._pend=null;try{p()}catch(e){}}}
P.flush7=flush;PAUSE.build=pbuild;P.noDanger=noDanger;P.titleOn7=titleOn;P.sf7=sf;P.WS7=WS;
})();
