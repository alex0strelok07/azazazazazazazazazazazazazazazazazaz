// Панель №7 — этап 4 (часть 7в: подвал, крыша, случайные события, карта)
(function(){'use strict';
const P=window.P7;if(!P||!P.FX||!P.KZ)return;
const {K,Z,L}=P.KZ,FX=P.FX,ST=P.ST,BACK=P.BACK4,{job,find}=P.J4,S=P.addScene;
// ключи предметов из game3 находим по названию, чтобы не зависеть от имени ключа
const keyOf=(re,def)=>{for(const k in P.ITEMS){const it=P.ITEMS[k];if(re.test(k)||re.test((it&&it.n)||''))return k}return def};
const BREAD=()=>keyOf(/bread|хлеб|батон|бухан/i,'bread'),VOUCH=()=>keyOf(/vouch|вауч/i,'voucher');
const _has=P.has,_take=P.take;
P.has=i=>_has(i==='bread'?BREAD():i==='voucher'?VOUCH():i);
P.take=i=>_take(i==='bread'?BREAD():i==='voucher'?VOUCH():i);
FX('bsCat',()=>{if(P.has('cat')||P.flag('catBack'))return{t:'Здесь больше никого.'};if(P.has('jam')||P.has('pie')){P.add(P.who(),'cat');return{t:'Женя приседает и протягивает крошки пирога. Полосатая кошка осторожно выходит, нюхает — и даёт себя взять на руки. На ошейнике нацарапано: «Мурка».',big:true,toast:'+ 🐈 Мурка'}}return{t:'Кошка шипит и прячется глубже за бочку. Без угощения её не выманить — может, пирожок или что-то сладкое?'}});
FX('bsJunk',()=>P.once('bsParts')?(P.add(P.who(),'radioParts'),{t:'В коробке с надписью «РАДИОКРУЖОК» — лампы, конденсаторы, катушки. Кирилл: «Семён за такое душу отдаст».',toast:'+ 🔌 Радиодетали'}):{t:'Старые лыжи, санки без полоза, стопки «Огонька». Больше ничего полезного.'});
FX('roofAnt',()=>{if(P.flag('antenna'))return{t:'Антенна стоит крепко.'};if(!P.has('tools'))return{t:'Антенна свернулась набок, крепёж разболтался. Без ключей не затянуть.'};P.flag('antenna',1);P.rel('valya',1);P.rel('shura',1);P.note('Починили антенну — весь подъезд смотрит телевизор без помех.');return{t:'Кирилл держит мачту, Женя затягивает болты. Снизу, из открытой форточки, кто-то кричит: «Показывает! Показывает!»',toast:'Антенна починена'}});
FX('roofKid',()=>({t:P.flag('sevaGlove')?'А вы знаете, что голуби дорогу домой по солнцу находят? Я, когда вырасту, лётчиком буду. Или мастером как Семён.':'Тсс! Голубей не пугайте. А вы мою варежку не видели? Синюю, с снежинкой. Я её в школе потерял, мама ругаться будет.'}));
N.roofKid.once1=()=>{if(!P.flag('sevaGlove'))P.quest('seva','new','Найти варежку Севы (потерял в школе)')};
FX('roofGlove',()=>{if(!P.take('glove'))return{t:'Варежки нет.'};P.flag('sevaGlove',1);P.rel('kid',3);P.quest('seva','done');P.add(P.who(),'cassette');return{t:'Моя! Спасибо! Вот, возьмите кассету — там «Ласковый май». Я её у Ромы в переходе выменял. А ещё — я видел, как дядя из склада ящики в старый цех носил. Вот!',toast:'+ 📼 Кассета'}});
// ---------- случайные события ----------
const EV=(k,grp,node,o)=>{N[k]=Object.assign({room:'СЛУЧАЙНАЯ ВСТРЕЧА',next:'evBack'},node);P.addEvent(Object.assign({k,grp},o||{}))};
EV('evMichShura',['street','home'],{s:'Дворник Михалыч',npcs:['michalych','shura'],t:'— Шура, твоя Мурка опять мне все клумбы изрыла! — Да нет её, Михалыч, третий день нет! — Баба Шура всхлипывает. Дворник смущённо чешет затылок.'},{once:true,cond:()=>!P.flag('catBack')});
EV('evMichThanks',['street','home'],{s:'Дворник Михалыч',npc:'michalych',t:'Слышь, ребята! Шура всему дому рассказала, как вы ей Мурку вернули. Молодцы. Если что — меня зовите.'},{once:true,cond:()=>P.flag('catBack')});
EV('evCoin',['street','center','home','industry'],{s:'Рассказчик',t:'На асфальте что-то блестит. Женя наклоняется — смятая десятка и пятак. «Сегодня наш день!»'});FX('evCoin',()=>{if(P.once('evCoin_'+P.S.day))P.earn(15);return{toast:'+15 ₽'}});
EV('evLyudaTolik',['center'],{s:'Буфетчица Люда',npcs:['lyuda','tolik'],t:'— Толик, ты ещё за тот чай не отдал! — Людочка, вот с денег всё отдам, клянусь! — С каких денег, Толик? У тебя их с восемьдесят четвёртого не было. Кирилл с Женей переглядываются и прячут улыбки.'},{once:true});
EV('evPickWarn',['center','street'],{s:'Рассказчик',npc:'pick',t:'В толпе кто-то притирается слишком близко. Но Кирилл уже знает этот приём — держит карман и смотрит прямо в глаза карманнику. Тот быстро исчезает.'},{once:true,cond:()=>P.flag('knowPick')});
EV('evDog',['industry','street'],{s:'Рассказчик',t:'Из-за забора выходит рыжая дворняга с одним стоячим ухом. Провожает вас до угла, виляя хвостом, и садится ждать. Женя: «Давай назовём его Рыжик?»'},{once:true});
EV('evGenaVoucher',['home','street'],{s:'Сосед Гена',npc:'gena',t:'Ребята, вы в офисе у Аркадия были? Только тссс! Я ему все ваучеры отдал, а он денег до сих пор не вернул. Говорит — «после аукциона». Эх…'},{once:true,cond:()=>P.flag('knowDeal')||P.S.flags.ev_offPC});
EV('evVeteran',['street'],{s:'Старик с орденами',npc:'veteran',t:'А вы знаете, что на месте нашего двора до войны сад был? Яблони по сентябрю — сами в руки падали. Всё проходит, ребята. И плохое тоже.'});
EV('evSevaRun',['school','center'],{s:'Мальчик Сева',npc:'kid',t:'Мимо проносится мальчик в огромной шапке: «Извините! Я на крышу, голубей кормить!» — и на бегу теряет одну варежку… нет, её уже нет — вторая, видимо, потеряна раньше.'},{once:true,cond:()=>!P.flag('sevaGlove')});
EV('evPetrStep',['industry'],{s:'Кочегар Степаныч',npcs:['stepanych','petrovich'],t:'— Петрович, ты мне уголь вторую неделю обещаешь! — Да будет тебе уголь, не кричи… — Петрович нервно оглядывается на старый цех.'},{once:true});
EV('evNote',['street','home','center'],{s:'Рассказчик',t:'Под дворником машины — записка детским почерком: «Заметно! На крыше новые голуби. С.» Женя улыбается и засовывает её обратно.'},{once:true});
// ---------- карта города и группы событий ----------
if(N.cityMap&&Array.isArray(N.cityMap.c)){const add=[['Наш подъезд · 5 этаж','ourStairs','▲'],['Промзона и старый завод','industryGate','⚒'],['Офис «Восход-Инвест»','office','▣'],['Мастерская на Садовой','workshop','⚙']].filter(a=>!N.cityMap.c.some(c=>c[1]===a[1]));let i=N.cityMap.c.findIndex(c=>c[1]==='streetHub');if(i<0)i=N.cityMap.c.length;N.cityMap.c.splice(i,0,...add);N.cityMap._c0=N.cityMap.c.slice()}
['yard','alley','park','stop','booth','market','stairs','papers'].forEach(k=>{const x=N[k];if(x&&!x.ev){x.ev=true;x.evc=x.evc||.18;x.grp=x.grp||(k==='stairs'?'home':'street')}});
['streetHub','courtyard','square','busstop'].forEach(k=>{const x=N[k];if(x&&!x.ev&&!x.end){x.ev=true;x.evc=.12;x.grp='street'}});
})();

