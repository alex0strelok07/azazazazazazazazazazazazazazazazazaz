// Панель №7 — этап 5f: память NPC (п.9) и живые случайные события (п.10).
// Расширяет существующие системы (P.rel, P.quest, P.EV/addEvent, render) — ничего не переписывает.
(function(){'use strict';
const P=window.P7;if(!P||!P.S)return;
const $=i=>document.getElementById(i);
// ---------- 9. ПАМЯТЬ NPC ----------
// Хранится в P.S.flags.mem -> попадает в обычное сохранение localStorage.
function MEM(){const f=P.S.flags||(P.S.flags={});return f.mem||(f.mem={})}
P.mem=k=>{const m=MEM();return m[k]||(m[k]={t:0,h:0,r:0,g:0,k:0,q:0,last:''})};
P.remember=(k,what,v)=>{if(!k)return;const m=P.mem(k);if(what==='talk')m.t++;else if(what==='help')m.h++;else if(what==='refuse')m.r++;else if(what==='gave')m.g++,m.last=v||m.last;else if(what==='took')m.k++,m.last=v||m.last;else if(what==='quest')m.q++;else m[what]=v===undefined?1:v;return m};
P.recall=(k,what)=>{const m=MEM()[k];return m?(what?m[what]||0:m):null};
const cur=()=>{try{return N[id]}catch(e){return null}};
function npcsOf(x){if(!x)return[];const a=[];if(x.npc)a.push(x.npc);if(Array.isArray(x.npcs))x.npcs.forEach(k=>a.includes(k)||a.push(k));if(!a.length&&P.speakerNpc){const k=P.speakerNpc(x);if(k)a.push(k)}return a.filter(k=>k&&k!=='kirill'&&k!=='zhenya')}
P.npcsHere=()=>npcsOf(cur());
// перехват существующих функций: помощь/отказ, предметы, задания
if(P.rel){const _rel=P.rel;P.rel=function(k,d){if(d>0)P.remember(k,'help');else if(d<0)P.remember(k,'refuse');return _rel.apply(this,arguments)}}
if(P.quest){const _q=P.quest;P.quest=function(k,st){const was=P.S.quests&&P.S.quests[k]&&P.S.quests[k].s;const r=_q.apply(this,arguments);if(st==='done'&&was!=='done')P.npcsHere().forEach(n=>P.remember(n,'quest'));return r}}
function hookItems(){if(P.add&&!P.add._m){const _a=P.add;P.add=function(w,i){const r=_a.apply(this,arguments);P.npcsHere().forEach(n=>P.remember(n,'gave',i));return r};P.add._m=1}
if(P.take&&!P.take._m){const _t=P.take;P.take=function(i){const r=_t.apply(this,arguments);if(r!==false)P.npcsHere().forEach(n=>P.remember(n,'took',i));return r};P.take._m=1}}
hookItems();setTimeout(hookItems,500);
const party=x=>{try{const c=P.cast(x);return c.length>1?'both':c[0]}catch(e){return'both'}};
const nm=k=>(P.NPC&&P.NPC[k]&&P.NPC[k].n)||k;
const itn=i=>(P.ITEMS&&P.ITEMS[i]&&P.ITEMS[i].n.toLowerCase())||'то, что вы брали';
// реплики по состоянию памяти. {b,k,z} — варианты для «оба / только Кирилл / только Женя»
const ML={
michalych:{again:'Опять вы? Ну, здорово, молодёжь. Метла сама не метёт, а языком почесать — завсегда.',help:'Вы ж мне подсобили тогда. Михалыч добро помнит — если что, только свистните.',refuse:'А, это вы… Помню, как от работы отказались. Ладно, без обид. Почти.',gave:i=>`Ну что, пригодилось ${i}? Я ж не просто так отдал.`,quest:'Шура до сих пор всему дому про вас рассказывает. Герои, понимаешь.',solo:{k:'Кирилл, а Женька где? Без неё ты какой-то потерянный.',z:'Женечка, одна гуляешь? Смотри, сейчас неспокойно.'}},
shura:{again:'Деточки мои пришли! Я уж думала, забыли бабку.',help:{b:'Вы мне так помогли, золотые… Я за вас свечку поставила.',k:'Кирюша, ты ж мне помог тогда. Хороший ты парень, Жене повезло.',z:'Женечка, спасибо тебе ещё раз. Дай бог здоровья.'},refuse:'Ну что ж… Я понимаю, у молодых свои заботы. Не сержусь.',gave:i=>`Как там ${i}? Я ж от сердца.`,took:i=>`А ${i} я сберегла, не беспокойтесь.`,quest:'Мурка мурлычет, а я всё про вас думаю. Спасители мои!'},
nyura:{again:'Снова вы? Ну проходите, не стойте.',help:'За помощь спасибо. Я такое не забываю.',refuse:'Помню-помню, как вы отмахнулись. Ну да ладно.'},
vendor:{again:'О, постоянные клиенты! Вам как обычно?',gave:i=>`Как вам ${i}? Свежий был, сам проверял.`,help:'Друзьям — скидка. Шучу. Но улыбнусь бесплатно.',refuse:'Не торгуетесь больше? Ну и правильно.'},
seller:{again:'Опять вы. Только руками ничего не трогайте.',gave:i=>`${i[0].toUpperCase()+i.slice(1)} брали — назад не принимаю, имейте в виду.`,help:'Вы, ребята, нормальные. Не то что некоторые.',refuse:'Ходят тут, смотрят, а не берут…'},
pharm:{again:'Здравствуйте ещё раз. Кому-то хуже стало?',gave:i=>`${i[0].toUpperCase()+i.slice(1)} помогло? Принимать строго как написано.`,help:'Спасибо, что тогда выручили. Сейчас такое редкость.',solo:{k:'Вы один сегодня? А девушка ваша как себя чувствует?',z:'Вы одна сегодня? Передавайте молодому человеку, пусть бережёт себя.'}},
police:{again:'Опять вы мне на глаза попадаетесь. Документы при себе?',help:'Вы тогда помогли — я не забыл. Но и вы не наглейте.',refuse:'А, сознательные граждане… Помню вас. Нос держите чистым.'},
veteran:{again:'А, внучата! Присаживайтесь, расскажу ещё.',help:'Вы люди правильные. Таких на фронте ценили.',quest:'Слышал я, что вы сделали. Горжусь, хоть и не родные.'},
student:{again:'Привет снова! Слушайте, а у вас нет конспекта по политэкономии? Шучу.',help:'Вы меня тогда выручили, я ваш должник.',refuse:'Ну и ладно, сам справлюсь.'},
chess:{again:'Партийку? Сегодня я играю чёрными, чтобы вам было легче.',help:'Вы хорошие ребята. Ходите честно — и в жизни так же.',refuse:'Отказались — ваше право. Шахматы терпеливы.'},
gena:{again:'Тссс, это опять вы? Ну хорошо, свои.',help:'Вы мне помогли — я ваш человек. Только Аркадию ни слова!',refuse:'Не хотите — как хотите. Гена не обижается. Гена записывает.'},
lyuda:{again:'Опять за чаем? Садитесь, налью.',gave:i=>`Как ${i}? Я ж утром пекла.`,help:'Помогли — значит, вам без очереди.'},
tolik:{again:'Ребята! Друзья мои! Займите до получки… нет? Ну я так, проверить.',refuse:'Помню я, как вы мне не заняли. Ничего. Бог видит.'},
gopnik:{again:'Опять вы… Слышь, мы вас не трогаем — вы нас не трогаете.',refuse:'Чё уставились? Проходите.'},
kid:{again:'Это опять вы! А я голубей кормил!',help:'Спасибо вам! Я всем во дворе рассказал!',gave:i=>`А вам ${i} понравилось?`}
};
const GEN={again:['Снова вы? Здравствуйте.','А, знакомые лица.','Опять встретились, надо же.'],help:['Спасибо вам за тот раз.','Вас я помню — вы тогда помогли.'],refuse:['А, это вы… Ну-ну.','Помню, как вы отказались.'],quest:['Слышал, что вы сделали. Уважаю.']};
const pick=a=>Array.isArray(a)?a[Math.floor(Math.random()*a.length)]:a;
function byParty(v,p){if(!v)return null;if(typeof v==='object'&&!Array.isArray(v))return v[p==='both'?'b':p[0]]||v.b||null;return v}
function memLine(k,x){const m=P.recall(k);if(!m||!m.t)return null;const L=ML[k]||{},p=party(x);
if(p!=='both'&&L.solo&&Math.random()<.35)return byParty(L.solo,p);
const order=[];if(m.q)order.push('quest');if(m.r>m.h)order.push('refuse');if(m.h)order.push('help');if(m.g&&L.gave)order.push('gave');if(m.k&&L.took)order.push('took');order.push('again');
for(const s of order){let v=L[s]!==undefined?L[s]:GEN[s];if(typeof v==='function'){const it=m.last?itn(m.last):'это';v=v(it)}v=byParty(v,p);if(v)return pick(v)}return null}
P.memLine=memLine;
// ---------- плашка реплики (память и фоновые события) ----------
const css=document.createElement('style');css.textContent=`.p7chip{position:absolute;left:50%;top:9%;transform:translate(-50%,-8px);max-width:min(560px,86%);background:rgba(28,24,22,.9);color:#f1e8da;border:1px solid rgba(240,220,190,.25);border-radius:12px;padding:9px 14px;font:14px/1.35 Georgia,serif;box-shadow:0 6px 22px rgba(0,0,0,.35);opacity:0;transition:opacity .35s,transform .35s;z-index:60;pointer-events:none}.p7chip.on{opacity:1;transform:translate(-50%,0)}.p7chip b{display:block;font:600 11px/1.2 sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#e7b97a;margin-bottom:3px}.p7chip i{color:#cfc3b2}`;document.head.appendChild(css);
let chipEl=null,chipT=0;
function chip(name,text,ms){const host=$('game')||document.body;if(!chipEl){chipEl=document.createElement('div');chipEl.className='p7chip'}if(chipEl.parentNode!==host)host.appendChild(chipEl);chipEl.innerHTML='';const b=document.createElement('b');b.textContent=name;const s=document.createElement('span');s.textContent=text;chipEl.append(b,s);chipEl.classList.remove('on');void chipEl.offsetWidth;chipEl.classList.add('on');clearTimeout(chipT);chipT=setTimeout(()=>chipEl&&chipEl.classList.remove('on'),ms||5200)}
P.chip=chip;
// ---------- перехват render: учёт разговоров и реплика «по памяти» ----------
let lastId=null;
function afterRender(){const x=cur();if(!x)return;const nid=id;if(nid===lastId)return;lastId=nid;if(x.explore||x.end)return;const ks=npcsOf(x);if(!ks.length)return;
const k=ks[0],m=P.mem(k),line=memLine(k,x),sig=[m.h,m.r,m.g,m.k,m.q].join('');
ks.forEach(n=>P.remember(n,'talk'));
if(line&&(m.sig!==sig||m.t%3===2)){m.sig=sig;setTimeout(()=>chip(nm(k)+' · помнит вас',line),450)}}
if(typeof render==='function'){const _r=render;render=function(...a){const out=_r.apply(this,a);try{afterRender()}catch(e){console.warn('mem',e)}return out}}
// ---------- 10. НОВЫЕ СЛУЧАЙНЫЕ СОБЫТИЯ МЕЖДУ СЦЕНАМИ ----------
// тот же механизм, что в game4b/4d3 (P.addEvent + узел + evBack), но с учётом памяти и состава группы
const pt=()=>party(cur());
if(P.addEvent&&typeof N==='object'){
const EV=(k,grp,node,o,fx)=>{if(N[k])return;N[k]=Object.assign({room:'СЛУЧАЙНАЯ ВСТРЕЧА',next:'evBack'},node);P.addEvent(Object.assign({k,grp},o||{}));if(fx&&P.FX)P.FX(k,fx)};
EV('evShuraJam',['home','street'],{s:'Баба Шура',npc:'shura',t:'Баба Шура догоняет вас с банкой: «Вот, варенье смородиновое. За доброту вашу. И не спорьте!»'},{once:true,cond:()=>P.recall('shura','h')>0},()=>{if(P.add&&P.ITEMS&&P.ITEMS.jam&&P.once&&P.once('shuraJamGift'))P.add(P.who(),'jam',1);return{toast:'+ 🍯 Банка варенья'}});
EV('evMichGrudge',['street','home'],{s:'Дворник Михалыч',npc:'michalych',t:'Михалыч делает вид, что вас не замечает, и особенно усердно метёт прямо в вашу сторону. Держит обиду.'},{once:true,cond:()=>P.recall('michalych','r')>P.recall('michalych','h')});
EV('evPhoneStairs',['home'],{s:'Рассказчик',t:'За дверью соседей долго звонит телефон. Десять гудков, пятнадцать… Наконец кто-то срывает трубку: «Да! Нет, не приеду! Потому что на бензин денег нет!»'},{},()=>({t:N.evPhoneStairs._o4.t+(pt()==='both'?' Женя шепчет Кириллу: «Вот и у нас так будет, если не найдём работу».':pt()==='kirill'?' Кирилл хмыкает: кому-то хуже, чем ему.':' Женя спешит дальше — чужие ссоры ей слушать неловко.')}));
EV('evDoorCreak',['home'],{s:'Рассказчик',t:'На площадке приоткрывается дверь на цепочке. В щели — глаз и бигуди. «А, это вы…» — и дверь захлопывается.'});
EV('evVendorRegular',['street','center'],{s:'Продавец',npc:'vendor',t:'— Эй, постоянные клиенты! Отложил вам самое свежее, заходите потом.'},{once:true,cond:()=>P.recall('vendor','g')>=2});
EV('evGopRespect',['street','industry'],{s:'Рассказчик',npc:'gopnik',t:'У гаражей кучка парней в спортивках. Один узнаёт вас, толкает остальных локтем: «Этих не трогай, эти дерутся». Все делают вид, что изучают асфальт.'},{once:true,cond:()=>((P.S.flags.fought_kirill||0)+(P.S.flags.fought_zhenya||0))>0});
EV('evOldMen',['street','center'],{s:'Рассказчик',npcs:['veteran','chess'],t:'— А я тебе говорю, при Андропове порядок был! — Порядок был на доске, а ты мне ферзя зевнул. Два старика спорят так, будто от этого зависит судьба страны.'},{once:true});
EV('evPhotoNotice',['street','center','home'],{s:'Женя',w:'zhenya',e:'thinking',t:'Женя достаёт фотокарточку и долго смотрит. «Смотри, на обороте дата — восемьдесят четвёртый. И какая-то подпись… Думаешь, её кто-то ищет?»'},{once:true,cond:()=>P.has&&P.has('photo')&&pt()!=='kirill'});
EV('evKirillTools',['industry','street','home'],{s:'Кирилл',w:'kirill',e:'determined',t:'Кирилл перебирает инструменты в сумке: «С таким набором можно и на шабашку попроситься. Кран кому-нибудь починить…»'},{once:true,cond:()=>P.has&&P.has('tools')&&pt()!=='zhenya'});
EV('evKidsBall',['street','school'],{s:'Рассказчик',t:'Из-за угла выкатывается сдутый мяч, за ним — двое мальчишек. «Дядя, пните!»'},{},()=>({t:N.evKidsBall._o4.t+(pt()==='zhenya'?' Женя неловко пинает — мяч улетает в кусты. «Тётя, ну вы чего!»':' Кирилл ловко подбрасывает мяч и пасует. Мальчишки в восторге.'+(pt()==='both'?' Женя смеётся: «Тренер пропадает!»':'')),toast:'⚽'}));
}
P._u={cur,party,pick};
})();
