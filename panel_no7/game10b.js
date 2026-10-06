/* Панель № 7 — этап 10 (b): единая система участников сцены (SceneParticipants).
   Проверка присутствия перед КАЖДОЙ репликой во всех сценах: базовые диалоги, сюжетные события,
   задания Q9, кат-сцены. Сохранение/загрузка присутствия и даты. Дополняет этапы 1–9 и 10a. */
(function(){'use strict';
const P=window.P7;if(!P||typeof N==='undefined')return;
const $=x=>document.getElementById(x),Z=P.Q9;
const HOME=['ГОСТИНАЯ','СПАЛЬНЯ','ПРИХОЖАЯ'];
const NAME={kirill:'Кирилл',zhenya:'Женя'},BY={'Кирилл':'kirill','Женя':'zhenya'};
const list=p=>p==='kirill'||p==='zhenya'?[p]:['kirill','zhenya'];

/* ================= SceneParticipants: один источник ================= */
function isHomeNode(x){x=x||{};if(x.map==='home')return true;if(x.map||x.explore==='street')return false;return HOME.includes(x.room||'')}
function world(x){try{if(typeof id!=='undefined'&&!x)x=N[id];return isHomeNode(x)?home:street}catch(e){return null}}
const SCENE={
 participants(x){const w=world(x);return list(w&&w.party)},
 isPresent(h,x){return SCENE.participants(x).includes(h)},
 // персонаж уходит из сцены: группа разделяется автоматически
 leave(h){const w=world();if(!w)return;const p=SCENE.participants();if(!p.includes(h))return;const rest=p.filter(x=>x!==h);w.party=rest.length===1?rest[0]:'both';log('leave',h)},
 // персонаж приходит: может снова участвовать
 join(h){const w=world();if(!w)return;const p=SCENE.participants();if(p.includes(h))return;w.party='both';log('join',h)},
 set(arr){const w=world();if(w)w.party=arr.length===1?arr[0]:'both'}
};
function log(t,h){try{const s=P.sf7&&P.sf7();if(s){s.p10log=(s.p10log||[]).slice(-19);s.p10log.push([t,h,Date.now()])}}catch(e){}}
P.SCENE=SCENE;
P.present=()=>SCENE.participants();

/* ================= одиночные версии сцен пролога ================= */
// Реплика/действие, написанное «на двоих», переписывается на того, кто реально в сцене.
const NR={s:'Рассказчик',w:'none',e:'neutral'};
const SOLO={
 leave:{kirill:{...NR,t:'Кирилл обходит площадь дворами. За спиной слышны крики, впереди видна пустая остановка.'},
  zhenya:{...NR,t:'Женя обходит площадь дворами. За спиной слышны крики, впереди видна пустая остановка.'},
  both:{...NR,t:'Они обходят площадь дворами. За спиной слышны крики, впереди видна пустая остановка.'}},
 courtyard:{kirill:{s:'Кирилл',w:'kirill',t:'Во дворе дети кидаются мокрым снегом. Один комок попадает прямо в плечо. «Вот засранцы».'},
  zhenya:{s:'Женя',w:'zhenya',t:'Во дворе дети кидаются мокрым снегом. Один комок попадает Жене в плечо. «Эй! Ну вы даёте».'}},
 bench:{kirill:{s:'Кирилл',w:'kirill',t:'Под лавкой лежит детская варежка. Кирилл кладёт её повыше, чтобы хозяин заметил.'}},
 puddle:{zhenya:{s:'Женя',w:'zhenya',t:'Женя наступает в ледяную лужу. «Блин… сапог насквозь».'}},
 help:{zhenya:{s:'Женя',w:'zhenya',t:'Женя помогает мужчине подняться и отводит его к стене дома, подальше от толпы.'}},
 help2:{kirill:{s:'Мужчина',w:'none',t:'Спасибо. А теперь уходи отсюда, парень, пока не поздно.'},zhenya:{s:'Мужчина',w:'none',t:'Спасибо, дочка. А теперь уходи отсюда, пока не поздно.'}}
};
const other=h=>h==='kirill'?'zhenya':'kirill';
function speaker(x){if(!x)return null;if(x.w==='kirill'||x.w==='zhenya')return x.w;return BY[x.s]||null}
// вернуть замену узла для текущего состава или null
function adapt(key,x,pr){const solo=pr.length===1?pr[0]:null,o=SOLO[key];
 if(o){const v=o[solo||'both'];if(v)return Object.assign({},x,v)}
 const sp=speaker(x);let y=null;
 if(sp&&!pr.includes(sp)){ // говорит отсутствующий — реплика переходит к присутствующему или рассказчику
  const t=String(x.t||'');y=Object.assign({},x,solo&&!new RegExp(NAME[solo],'i').test(t)?{s:NAME[solo],w:solo,e:x.e||'neutral'}:NR)}
 if(x.c&&solo){const ab=NAME[other(solo)];const c=x.c.filter(c=>!new RegExp('^\\s*'+ab+'\\s*:','i').test(String(c[0]||'')));if(c.length&&c.length!==x.c.length){y=y||Object.assign({},x);y.c=c}}
 return y}
// реплики сцен Q9 отсутствующего персонажа пропускаются (кроме последней — она даёт событие сцены)
function skippable(x,pr){const sp=speaker(x);return!!(x&&x.q9&&sp&&!pr.includes(sp)&&x.next&&!x.c&&!x.end9&&N[x.next])}

if(typeof render==='function'){const _r=render;render=function(){let k=null,bak=null,out;
 try{let n=0;while(n++<20&&skippable(N[id],SCENE.participants(N[id])))id=N[id].next;
  k=id;const x=N[k];if(x){const alt=adapt(k,x,SCENE.participants(x));if(alt){bak=x;N[k]=alt}}}catch(e){}
 try{out=_r.apply(this,arguments)}finally{if(bak)N[k]=bak}
 try{cast()}catch(e){}return out}}

/* ---- отображение: отсутствующий не показывается нигде (портрет, спрайт, мини, «говорит») ---- */
function cast(){const pr=SCENE.participants();
 [['kirill','dialogKirill','kirill','miniKirill'],['zhenya','dialogZhenya','zhenya','miniZhenya']].forEach(([h,...ids])=>{
  const on=pr.includes(h);ids.forEach(i=>{const el=$(i);if(!el)return;if(!on){el.style.display='none';el.classList.remove('speaking')}else if(el.style.display==='none'&&el.dataset.p10!=='1')el.style.display='';el.dataset.p10=on?'0':'1'})})}
if(typeof placeMini==='function'){const _pm=placeMini;placeMini=function(){const r=_pm.apply(this,arguments);try{cast()}catch(e){}return r}}

/* ================= сюжетные события (game6b): проверка перед каждой репликой ================= */
const ST=P.STORY;
if(ST&&ST.play){const _play=ST.play;
 const filt=(ev)=>{const L=ev.lines;if(!L)return ev;const pr=()=>list(ev.solo||SCENE.participants().length===1&&SCENE.participants()[0]||'both');
  const keep=l=>{if(!l)return false;if(P.banned10&&P.banned10(l.t))return false;const p=pr(),w=l.who;
   const h=w&&(w==='kirill'||w==='zhenya'?w:(w.id||w.key||BY[w.name]||BY[w]));
   if(h&&!p.includes(h))return false;
   if(l.emo)Object.keys(l.emo).forEach(e=>{if(!p.includes(e))delete l.emo[e]});
   if(l.choices&&l.choices.length)l.choices=l.choices.filter(c=>{const m=/^\s*(Кирилл|Женя)\s*:/.exec(c.t||'');return!m||p.includes(BY[m[1]])});
   return true};
  return Object.assign({},ev,{lines:typeof L==='function'?function(){return(L.apply(this,arguments)||[]).filter(keep)}:L.filter(keep)})};
 ST.play=function(ev,done){const g=$('game');if(g)g.classList.add('p10story');
  return _play.call(this,filt(ev||{}),function(){if(g)g.classList.remove('p10story');if(done)return done.apply(this,arguments)})}}
// окно события не перекрывает базовый диалог (картинка 1)
const css=document.createElement('style');css.textContent='.p10story #box,.p10story #choices{visibility:hidden!important}';document.head.appendChild(css);
setInterval(()=>{const g=$('game');if(g&&ST&&!ST.open)g.classList.remove('p10story')},700);

/* ================= задания учитывают присутствие ================= */
// Сцена задания, где говорит в основном один герой, требует его реального присутствия.
function needs(key){const cnt={kirill:0,zhenya:0};let i=0,k=key;while(N[k]&&i<40){const s=speaker(N[k]);if(s)cnt[s]++;k=key+'_'+(++i)}
 const tot=cnt.kirill+cnt.zhenya;if(!tot)return null;if(cnt.zhenya>=tot*0.6&&cnt.zhenya>=2)return'zhenya';if(cnt.kirill>=tot*0.6&&cnt.kirill>=2)return'kirill';return null}
P.SCENE.requires=needs;
if(typeof choose==='function'){const _c=choose;choose=function(key){try{const x=N[key];if(x&&x.q9===key){const h=needs(key),pr=SCENE.participants(x);
  if(h&&!pr.includes(h)){Z&&Z.toast&&Z.toast((h==='zhenya'?'Жени':'Кирилла')+' рядом нет — без '+(h==='zhenya'?'неё':'него')+' это не сделать.');return}}}catch(e){}
 return _c.apply(this,arguments)}}

/* ================= сохранение / загрузка ================= */
const SNAP=()=>{const w=(o)=>o&&{party:o.party,active:o.active,kirill:o.kirill&&{...o.kirill},zhenya:o.zhenya&&{...o.zhenya}};
 return{id:typeof id!=='undefined'?id:null,street:w(street),home:w(home),participants:SCENE.participants(),cal:P.CAL&&P.CAL.snapshot(),at:Date.now()}};
if(P.save){const _s=P.save;P.save=function(){try{const s=P.sf7&&P.sf7();if(s)s.p10=SNAP()}catch(e){}return _s.apply(this,arguments)}}
let restored=false,lastSf=null;
function restore(){try{const cur=P.sf7&&P.sf7();if(cur!==lastSf){lastSf=cur;restored=false}}catch(e){}if(restored)return;try{const s=P.sf7&&P.sf7(),v=s&&s.p10;if(!v||typeof id==='undefined'||v.id!==id)return;restored=true;
 ['street','home'].forEach(n=>{const o=n==='street'?street:home,q=v[n];if(!o||!q)return;o.party=q.party;['kirill','zhenya'].forEach(h=>{if(q[h]&&o[h])Object.assign(o[h],q[h])})});
 cast();typeof drawMini==='function'&&drawMini()}catch(e){}}
setInterval(()=>{try{const t=$('title');if(t&&t.style.display!=='none'&&!t.classList.contains('hide')&&getComputedStyle(t).display!=='none'){restored=false;return}restore();cast()}catch(e){}},500);
})();
