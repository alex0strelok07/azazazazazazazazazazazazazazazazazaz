// Панель №7 — этап 5f (часть 2): фоновая жизнь города в режиме прогулки (п.10).
(function(){'use strict';
const P=window.P7;if(!P||!P._u||!P.chip)return;
const {cur,party,pick}=P._u,chip=P.chip,$=i=>document.getElementById(i);
// ---------- 10б. ФОНОВАЯ ЖИЗНЬ В РЕЖИМЕ ПРОГУЛКИ (не мешает сюжету) ----------
// Реестр P.AMB: {g:[группы], p:'both'|'kirill'|'zhenya'|нет, s:имя, t:текст|функция, c:условие, once}
P.AMB=P.AMB||[];P.addAmbient=a=>P.AMB.push(a);
const AM=(g,s,t,o)=>P.addAmbient(Object.assign({g,s,t},o||{}));
const ST_=['street'],HM=['home'],ALL=['street','home','center','industry','school'];
AM(ST_,'Прохожий','— Молодые люди, не подскажете, сколько времени? …А, часов нет? Такие времена.');
AM(ST_,'Две соседки','— А сахар опять подорожал! — Да что сахар, у меня зять третий месяц без зарплаты…');
AM(ST_,'Рассказчик','Из открытой форточки доносится «Время вперёд!» — начинаются новости.');
AM(ST_,'Рассказчик','С балкона на втором этаже тётя трясёт ковёр. Пыль оседает прямо на прохожих.');
AM(ST_,'Рассказчик','В телефонной будке трезвонит телефон. Никто не подходит — и он замолкает.');
AM(ST_,'Михалыч','— Ребята, вы там поаккуратнее! Я здесь только что подмёл!',{c:()=>P.recall('michalych','t')>0});
AM(ST_,'Баба Шура','Баба Шура машет вам из окна первого этажа и крестит вслед.',{c:()=>P.recall('shura','h')>0});
AM(ST_,'Гопник','— Э, слышь… А, это вы. Ладно, идите.',{c:()=>P.recall('gopnik','t')>0||(P.S.flags.fought_kirill||0)>0});
AM(HM,'Рассказчик','За стеной у соседей стучит перфоратор. Уже третий день.');
AM(HM,'Рассказчик','В коридоре звонит телефон. Два гудка — и тишина. Ошиблись номером.');
AM(HM,'Рассказчик','На кухне засвистел чайник.',{p:'both',t:()=>pick(['На кухне засвистел чайник. Женя: «Кирюш, выключи, а?» — «Уже иду…»','Сквозняк захлопывает форточку. Женя вздрагивает, Кирилл смеётся.'])});
AM(ALL,'Кирилл','Кирилл (про себя): «Надо бы Жене что-нибудь принести. Хоть пирожок.»',{p:'kirill'});
AM(ALL,'Женя','Женя поправляет шапку: «Одной тут как-то неуютно… Скорей бы к Кириллу».',{p:'zhenya'});
AM(ALL,'Женя','— Кирюш, смотри, какая собака! — Жень, не гладь, она блохастая. — Сам ты блохастый.',{p:'both',g:ST_});
AM(ALL,'Кирилл','Кирилл замечает на жилете дырку и молча прикрывает её рукой. Женя делает вид, что не видела.',{p:'both'});
AM(ALL,'Женя','— У нас варенье есть, помнишь? Может, чаю с ним попьём, когда вернёмся?',{p:'both',c:()=>P.has&&P.has('jam')});
AM(ALL,'Кирилл','Кирилл вертит в руках кассету «Кино»: «Перемен требуют наши сердца…» — напевает он под нос.',{c:()=>P.has&&P.has('cassette'),p:'kirill'});
AM(['center'],'Рассказчик','Троллейбус срывается с проводов — водительница в ватнике, ругаясь, лезет поправлять рога.');
AM(['industry'],'Рассказчик','Где-то за забором лязгает железо и стихает. Потом — собачий лай.');
AM(['school'],'Школьник','— А вы к кому? А у нас сегодня контрольная, а я сбежал!');
const fightOn=()=>{const f=document.querySelector('.fightPanel');return f&&!f.classList.contains('hidden')&&f.offsetParent!==null};
const titleOn=()=>{const t=$('title');return t&&!t.classList.contains('hidden')};
function grpOf(x){if(x.grp)return x.grp;try{if(P.inApt&&P.inApt(x))return'home'}catch(e){}return'street'}
let nextAt=Date.now()+30000;const used={};
function ambTick(){if(Date.now()<nextAt)return;const x=cur();nextAt=Date.now()+25000+Math.random()*25000;
if(!x||!x.explore||document.hidden||fightOn()||titleOn())return;if(Math.random()<.25)return;
const g=grpOf(x),p=party(x);
const pool=P.AMB.filter((a,i)=>(!a.g||a.g.includes(g))&&(!a.p||a.p===p)&&!(a.once&&used[i])&&(!a.c||a.c(x))&&used._last!==i);if(!pool.length)return;
const a=pool[Math.floor(Math.random()*pool.length)],i=P.AMB.indexOf(a);used[i]=1;used._last=i;
const t=typeof a.t==='function'?a.t(x):a.t;if(t)chip(a.s,t,6000)}
setInterval(()=>{try{ambTick()}catch(e){}},1000);
P._amb5f={ambTick,grpOf};
})();
