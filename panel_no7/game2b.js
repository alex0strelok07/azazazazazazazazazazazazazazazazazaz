// Панель №7 — дополнение, этап 2 (часть 2): кухня, коридор, точки, диалоги, способы заработка.
(function(){
const P=window.P7;if(!P)return;
P.isApt=()=>{const x=N[id];if(x.map)return true;return P.APT.includes(x.room||'ГОСТИНАЯ')};
const HOT_KITCHEN=[{id:'kStove',x:14,y:34,n:'Плита'},{id:'kSink',x:31,y:32,n:'Раковина'},{id:'kBottles',x:41,y:32,n:'Шкафчик под раковиной'},{id:'kWindow',x:55,y:28,n:'Окно'},{id:'kRadio',x:72,y:28,n:'Радиоприёмник'},{id:'kFridge',x:88,y:38,n:'Холодильник'},{id:'kCupboard',x:14,y:56,n:'Буфет'},{id:'kTable',x:52,y:70,n:'Кухонный стол'},{id:'goCorridorFromKitchen',x:50,y:92,n:'Дверь в коридор'}];
const HOT_CORRIDOR=[{id:'leaveHome',x:8,y:56,n:'Входная дверь — на улицу'},{id:'cCoat',x:16,y:35,n:'Вешалка с пальто'},{id:'bedroom',x:34,y:35,n:'Дверь в спальню'},{id:'cMirror',x:54,y:35,n:'Зеркало'},{id:'goKitchen',x:76,y:35,n:'Дверь на кухню'},{id:'cPhone',x:90,y:35,n:'Телефон'},{id:'cShoes',x:17,y:68,n:'Обувница'},{id:'goLiving',x:46,y:76,n:'Дверь в гостиную'}].filter(h=>h.id!=='bedroom'||N.bedroom);
const BLOCKS={kitchen:[{x1:6,y1:0,x2:22,y2:30},{x1:22,y1:0,x2:46,y2:28},{x1:46,y1:0,x2:80,y2:24},{x1:80,y1:0,x2:96,y2:34},{x1:0,y1:0,x2:6,y2:26},{x1:0,y1:38,x2:10,y2:72}],corridor:[{x1:0,y1:0,x2:100,y2:31},{x1:0,y1:77,x2:100,y2:100},{x1:9,y1:70,x2:26,y2:77},{x1:0,y1:0,x2:5,y2:100},{x1:96,y1:0,x2:100,y2:100}]};
const CIRCLES={kitchen:[{x:52,y:57,r:9}],corridor:[]};
const lh=HOT_HOME.find(h=>h.id==='leaveHome');if(lh){lh.id='goCorridorFromLiving';lh.n='Дверь в коридор'}
HOT_HOME.push({id:'lSofa',x:33,y:58,n:'Диван — поискать мелочь'});

const K=o=>Object.assign({room:'КУХНЯ',w:'none',s:'Рассказчик'},o),C=o=>Object.assign({room:'КОРИДОР',w:'none',s:'Рассказчик'},o);
const EX=(room,map,spawn)=>({room,s:'',t:'',w:'none',map,explore:true,spawn});
const shopR=N.shop?{room:N.shop.room,scene:N.shop.scene}:{room:'МАГАЗИН'};
const kioskR=N.kiosk?{room:N.kiosk.room,scene:N.kiosk.scene}:{room:'УЛИЦА'};
Object.assign(N,{
kitchenExplore:EX('КУХНЯ','kitchen'),goKitchen:EX('КУХНЯ','kitchen',[46,86,52,86]),
corridorExplore:EX('КОРИДОР','corridor'),goCorridorFromKitchen:EX('КОРИДОР','corridor',[72,40,78,40]),goCorridorFromLiving:EX('КОРИДОР','corridor',[42,72,48,72]),goCorridorFromBedroom:EX('КОРИДОР','corridor',[31,38,36,38]),corridorArrive:EX('КОРИДОР','corridor',[7,50,7,60]),
goLiving:EX('ГОСТИНАЯ','home',[52,76,59,76]),
lSofa:{room:'ГОСТИНАЯ',w:'none',s:'Рассказчик',t:'Кирилл шарит рукой под диваном… три монеты и пуговица. +35 ₽',next:'homeExplore'},
kStove:K({t:'Старая газовая плита «Электа». Одна конфорка не зажигается уже месяц.',c:[['Приготовить ужин (консервы + хлеб)','kCook','♨'],['Поставить чайник','kKettle','☕'],['Отойти от плиты','kitchenExplore','←']]}),
kCook:K({s:'Женя',w:'zhenya',e:'neutral',t:'Женя режет хлеб, Кирилл разогревает консервы. Кухня наполняется запахом тушёнки. Готово два горячих ужина.',next:'kitchenExplore'}),
kKettle:K({s:'Женя',w:'zhenya',e:'neutral',t:'Чайник поставила. Заварки на донышке, но на две кружки хватит.',next:'kitchenExplore'}),
kSink:K({s:'Кирилл',w:'kirill',e:'worried',t:'Горячей воды опять нет. Руки сводит от холода.',next:'kSink2'}),
kSink2:K({s:'Женя',w:'zhenya',e:'neutral',t:'Зато кран больше не капает. Ты же его сам починил, мастер.',next:'kitchenExplore'}),
kBottles:K({t:'Под раковиной позвякивают пустые бутылки из-под молока и лимонада. Их принимают в киоске на улице.',next:'kitchenExplore'}),
kWindow:K({s:'Женя',w:'zhenya',e:'worried',t:'Во дворе кто-то разжёг костёр в бочке. Стоят, греются…',next:'kWindow2'}),
kWindow2:K({s:'Кирилл',w:'kirill',e:'neutral',t:'Надо будет заклеить раму газетой. Дует так, что свечку задувает.',next:'kitchenExplore'}),
kRadio:K({s:'Радио',t:'«Говорит „Маяк“. Курс доллара на торгах ММВБ снова вырос. Правительство обещает сдержать цены на хлеб…»',next:'kRadio2'}),
kRadio2:K({s:'Женя',w:'zhenya',e:'angry',t:'Обещают… Каждую неделю обещают. А хлеб всё равно дорожает.',next:'kRadio3'}),
kRadio3:K({s:'Кирилл',w:'kirill',e:'neutral',t:'Переключи на музыку. Хоть пять минут без новостей.',next:'kitchenExplore'}),
kFridge:K({s:'Кирилл',w:'kirill',e:'worried',t:'В холодильнике — банка огурцов и пустота. Огурцы забираю.',next:'kitchenExplore'}),
kCupboard:K({t:'В буфете — бабушкин сервиз и жестяная банка из-под чая. В банке — свёрнутые купюры и пачка заварки. +150 ₽',next:'kitchenExplore'}),
kTable:K({t:'Они садятся за кухонный стол. Клеёнка в мелкий цветочек, на ней круги от кружек.',c:[['Поговорить о маме','kTalkMom','♡'],['Поговорить о работе','kTalkWork','⚒'],['Посчитать деньги','kMoney','₽'],['Встать из-за стола','kitchenExplore','←']]}),
kTalkMom:K({s:'Женя',w:'zhenya',e:'worried',t:'Мама звонила вчера. На заводе опять задерживают зарплату — уже третий месяц.',next:'kTalkMom2'}),
kTalkMom2:K({s:'Кирилл',w:'kirill',e:'neutral',t:'Отправим ей часть того, что заработаем. Хоть немного.',next:'kTalkMom3'}),
kTalkMom3:K({s:'Женя',w:'zhenya',e:'neutral',t:'Ты всегда так говоришь, будто всё решаемо.',next:'kTalkMom4'}),
kTalkMom4:K({s:'Кирилл',w:'kirill',e:'determined',t:'А иначе зачем вставать по утрам?',next:'kTable'}),
kTalkWork:K({s:'Кирилл',w:'kirill',e:'neutral',t:'В мастерской на Садовой ищут человека паять приёмники. Платят мало, зато каждую неделю.',next:'kTalkWork2'}),
kTalkWork2:K({s:'Женя',w:'zhenya',e:'determined',t:'А я буду сдавать бутылки и журналы. И в магазине иногда просят ящики разгрузить — это тоже деньги.',next:'kTable'}),
kMoney:K({t:'Они пересчитывают деньги.',next:'kTable'}),
cMirror:C({s:'Женя',w:'zhenya',e:'neutral',t:'Посмотри на себя — щетина как у геолога после экспедиции.',next:'cMirror2'}),
cMirror2:C({s:'Кирилл',w:'kirill',e:'neutral',t:'Зато тепло. И бритву экономлю.',next:'corridorExplore'}),
cCoat:C({t:'Кирилл проверяет карманы старого пальто. В подкладке — смятая купюра. +200 ₽',next:'corridorExplore'}),
cShoes:C({t:'На обувнице — валенки, старые кеды и… ключи от квартиры. Хорошо, что нашлись.',next:'corridorExplore'}),
cPhone:C({s:'Соседка по телефону',t:'Кирюша, это Валентина Петровна из сорок второй. Приёмник замолчал, а ты ж у нас мастер! Заплачу, сколько смогу.',c:[['Согласиться помочь','phoneHelp','⚒'],['Отказаться','phoneNo','✕']]}),
phoneHelp:C({s:'Кирилл',w:'kirill',e:'determined',t:'Перегорел предохранитель. Пять минут — и «Маяк» снова говорит. Валентина Петровна суёт в руку деньги и банку варенья.',next:'corridorExplore'}),
phoneNo:C({s:'Кирилл',w:'kirill',e:'worried',t:'Извините, Валентина Петровна, сегодня никак. Давайте завтра.',next:'corridorExplore'}),
shopWork:Object.assign({},shopR,{s:'Продавщица',w:'none',t:'Ящики с машины надо перетаскать в подсобку. Справитесь — заплачу четыреста.',c:[['Взяться за работу','shopWork2','⚒'],['Отказаться','shop','←']]}),
shopWork2:Object.assign({},shopR,{s:'Рассказчик',w:'none',t:'Полчаса они таскают ящики с капустой и банками. Спина ноет, зато продавщица отсчитывает 400 ₽.',next:'shop'}),
kioskBottles:Object.assign({},kioskR,{s:'Киоскёрша',w:'none',t:'',next:'kiosk'}),
kioskMagazines:Object.assign({},kioskR,{s:'Киоскёрша',w:'none',t:'',next:'kiosk'}),
kioskPaper:Object.assign({},kioskR,{s:'Киоскёрша',w:'none',t:'«Свежая, только привезли». Газета пахнет типографской краской.',next:'kiosk'}),
kioskCandy:Object.assign({},kioskR,{s:'Киоскёрша',w:'none',t:'Конфета «Мишка на Севере» — одна, зато настоящая.',next:'kiosk'})
});
// Связи со старыми сценами
if(N.leaveHome&&N.leaveHome.c)N.leaveHome.c=N.leaveHome.c.map(c=>c[1]==='homeExplore'?[c[0],'corridorExplore',c[2]]:c);
if(N.returnHome){delete N.returnHome.c;N.returnHome.next='corridorArrive'}
if(N.bedroom&&N.bedroom.c)N.bedroom.c.splice(Math.max(0,N.bedroom.c.length-1),0,['Выйти в коридор','goCorridorFromBedroom','→']);
const BUY={};
const scan=(node,re,price,item,label)=>{const n=N[node];if(!n||!n.c)return;n.c.forEach(c=>{if(re.test(c[1])){BUY[c[1]]=[price,item];c[0]=label+' — '+price+' ₽'}})};
scan('shop',/bread/i,100,'bread','Купить хлеб');scan('shop',/can/i,250,'cans','Купить консервы');scan('pharmacy',/band/i,150,'bandage','Купить бинт');
if(N.shop&&N.shop.c)N.shop.c.splice(Math.max(0,N.shop.c.length-1),0,['Помочь разгрузить ящики','shopWork','▤']);
if(N.kiosk){const back=N.kiosk.next||'streetHub';delete N.kiosk.next;N.kiosk.c=[['Сдать пустые бутылки — 30 ₽/шт','kioskBottles','◍'],['Сдать журналы — 40 ₽/шт','kioskMagazines','▤'],['Купить газету — 50 ₽','kioskPaper','▦'],['Купить конфету — 30 ₽','kioskCandy','◆'],['Отойти от киоска',back,'←']]}

// Эффекты сцен: деньги, вещи, разовые находки
const buy=(price,item)=>()=>{if(!P.pay(price))return{t:`Не хватает денег: нужно ${price} ₽, а у вас ${P.S.money} ₽.`};P.add(P.who(),item);return{toast:`−${price} ₽ · ${P.ITEMS[item].i} ${P.ITEMS[item].n} → ${P.NAMES[P.who()]}`}};
const sell=(item,price,miss)=>()=>{const n=P.cnt(item);if(!n)return{t:miss};P.take(item,n);P.earn(n*price);return{t:`Киоскёрша придирчиво пересчитывает: «${n} шт. — ${n*price} рублей. Держи».`,toast:`+${n*price} ₽`}};
const EF={
lSofa:()=>P.once('sofa')?(P.earn(35),{toast:'+35 ₽'}):{t:'Под диваном только пыль и одинокая пуговица.'},
cCoat:()=>P.once('coat')?(P.earn(200),{toast:'+200 ₽'}):{t:'Карманы пальто пусты.'},
cShoes:()=>P.once('keys')?(P.add(P.who(),'keys'),{toast:'+ 🔑 Ключи от квартиры'}):{t:'Валенки, старые кеды… больше ничего.'},
cPhone:()=>P.S.flags.radio?{s:'Рассказчик',t:'Телефон молчит.',c:[['Отойти','corridorExplore','←']]}:null,
phoneHelp:()=>{if(!P.once('radio'))return{t:'Приёмник у соседки уже работает.'};P.earn(250);P.addMin(30);return{toast:'+250 ₽ за ремонт приёмника'}},
kCupboard:()=>P.once('jar')?(P.earn(150),P.add(P.who(),'tea'),{toast:'+150 ₽ · 🍵 Пачка чая'}):{t:'Жестяная банка пуста. Только запах старой заварки.'},
kBottles:()=>P.once('bottles')?(P.add(P.who(),'bottles',4),{toast:'+4 🍾 Пустые бутылки'}):{t:'Под раковиной больше ничего полезного — только ведро и тряпка.'},
kFridge:()=>P.once('pickles')?(P.add(P.who(),'pickles'),{toast:'+ 🥒 Банка огурцов'}):{t:'Холодильник гудит. Внутри пусто.'},
kCook:()=>{if(P.cnt('cans')&&P.cnt('bread')){P.take('cans');P.take('bread');P.add(P.who(),'meal',2);P.addMin(25);return{toast:'+2 🍲 Горячий ужин'}}return{t:'Не из чего готовить. Нужны консервы и хлеб — их продают в магазине на улице.'}},
kKettle:()=>{P.addMin(10);if(P.take('tea'))return{t:'Женя засыпает свежую заварку из пачки. Кухня пахнет настоящим чаем — впервые за неделю.'}},
kMoney:()=>({t:`Они пересчитывают деньги: ${P.S.money} ₽. ${P.S.money<300?'Негусто. Надо где-то подработать.':'На пару дней хватит.'}`}),
shopWork2:()=>{if(!P.once('crates'))return{t:'Продавщица машет рукой: «Всё уже перетаскали, спасибо. Приходите завтра».'};P.earn(400);P.addMin(35);return{toast:'+400 ₽ за разгрузку'}},
kioskBottles:sell('bottles',30,'«Бутылки-то где? Пустыми руками не принимаю». (Пустые бутылки есть дома — в шкафчике под раковиной на кухне.)'),
kioskMagazines:sell('magazines',40,'«Журналов нет? Ну так и денег нет». (Старые журналы лежат в спальне.)'),
kioskPaper:buy(50,'newspaper'),kioskCandy:buy(30,'candy'),
read2:()=>P.once('mags')?(P.add(P.who(),'magazines',5),{toast:'+5 📚 Старые журналы — их можно сдать у киоска'}):null
};

// Встраивание в основной код игры
const blk=(m,x,y)=>{const fx=x+2;return BLOCKS[m].some(b=>fx>=b.x1&&fx<=b.x2&&y>=b.y1&&y<=b.y2)||CIRCLES[m].some(c=>Math.hypot(fx-c.x,y-c.y)<c.r)};
const curMap=()=>P.realMap||N[id].map;
const asHome=fn=>function(...a){const x=N[id];if(P.realMap||(x.map!=='kitchen'&&x.map!=='corridor'))return fn.apply(this,a);P.realMap=x.map;x.map='home';try{return fn.apply(this,a)}finally{x.map=P.realMap;P.realMap=null}};
worldState=function(){return P.isApt()?home:street};
const _hot=hotList;hotList=function(...a){const m=curMap();if(m==='kitchen')return HOT_KITCHEN;if(m==='corridor')return HOT_CORRIDOR;return _hot.apply(this,a)};
const _hb=homeBlocked;homeBlocked=function(x,y){const m=curMap();if(m==='kitchen'||m==='corridor')return blk(m,x,y);return _hb(x,y)};
move=asHome(move);drawMini=asHome(drawMini);spriteFor=asHome(spriteFor);
const _dd=drawDebug;drawDebug=function(...a){_dd.apply(this,a);const m=N[id].map;if(m!=='kitchen'&&m!=='corridor')return;const W=$('world');W.querySelectorAll('.dbg').forEach(e=>e.remove());if(!debugOn)return;BLOCKS[m].forEach(b=>{const d=document.createElement('div');d.className='dbg';Object.assign(d.style,{left:b.x1+'%',top:b.y1+'%',width:(b.x2-b.x1)+'%',height:(b.y2-b.y1)+'%'});W.appendChild(d)})};
const _render=render;
render=function(...a){const x=N[id];if(id==='intro')P.reset();if(P.invOpen)P.toggleInv(false);
if(x.spawn){const p=x.spawn;home.kirill.x=p[0];home.kirill.y=p[1];home.zhenya.x=p[2];home.zhenya.y=p[3]}
if(!('_t0' in x)){x._t0=x.t;x._s0=x.s;x._c0=x.c}x.t=x._t0;x.s=x._s0;x.c=x._c0;
const fx=EF[id]||(BUY[id]&&buy(...BUY[id]));const r=(fx&&fx())||{};if(r.t)x.t=r.t;if(r.s)x.s=r.s;if(r.c)x.c=r.c;
_render.apply(this,a);
const G=$('game'),room=x.room||'';
if((room==='КУХНЯ'||room==='КОРИДОР')&&!x.scene){const url=P.roomBg(room==='КУХНЯ'?'kitchen':'corridor');G.classList.add('interiorMap');G.classList.remove('actionPhoto','detailPhoto');if($('bg').src!==url)$('bg').src=url;fitWorld();if(x.explore)drawMini()}
G.classList.toggle('streetMap',!!x.explore&&!x.map);
if(r.toast)P.toast(r.toast);P.updMoney()};
})();
