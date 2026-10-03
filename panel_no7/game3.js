// Панель №7 — дополнение, этап 3 (часть 1): карта города, новые локации, предметы, НПС, подработки.
(function(){
const P=window.P7;if(!P)return;
Object.assign(P.ITEMS,{potatoes:{n:'Картошка',i:'🥔',food:'печёную картошку'},letter:{n:'Письмо от мамы',i:'✉️'},voucher:{n:'Фальшивый ваучер',i:'🎫'}});
P.go=k=>{if(!N[k])return;id=k;render()};
const BACK=[['Другое место в городе','cityMap','⌖'],['Вернуться на улицу','streetHub','←']];
const L=(room,scene)=>o=>Object.assign({room,scene,w:'none',s:'Рассказчик'},o);
const Y=L('ДВОР','detail_courtyard'),A=L('ПОДВОРОТНЯ','detail_alley'),B=L('СКВЕР','detail_bench'),T=L('ОСТАНОВКА','detail_busstop'),F=L('ТЕЛЕФОННАЯ БУДКА','detail_phone'),M=L('ПУСТЫРЬ · БАРАХОЛКА','detail_puddle'),S=L('ПОДЪЕЗД','detail_entrance'),G=L('ГАЗЕТНЫЙ ПУНКТ','detail_newspaper'),W=L('ГОРОД','detail_window');
const K=(t,e)=>({s:'Кирилл',w:'kirill',e:e||'neutral',t}),Z=(t,e)=>({s:'Женя',w:'zhenya',e:e||'neutral',t});
const loc=(f,t,items,danger)=>f({t,c:items.concat(BACK),danger});
Object.assign(N,{
cityMap:W({t:'Куда пойти? Город большой, холодный и шумный. Где-то можно подзаработать, где-то — нарваться на неприятности.',c:[['Двор за домом','yard','⌂'],['Подворотня','alley','▥'],['Сквер со скамейками','park','♣'],['Автобусная остановка','stop','▣'],['Телефонная будка','booth','☎'],['Пустырь с барахолкой','market','₽'],['Подъезд соседнего дома','stairs','▤'],['Газетный пункт','papers','▦'],['Назад на улицу','streetHub','←']]}),
// ДВОР
yard:loc(Y,'Двор-колодец. Ржавые качели, мусорные баки, «Москвич» без колёс. На лавке — бабушки, у подъезда дворник Михалыч с метлой.',[['Поговорить с дворником','yardJanitor','☺'],['Подсесть к бабушкам','yardGranny','☕'],['Заглянуть в мусорные баки','yardBins','▢'],['Осмотреть сломанный «Москвич»','yardCar','⚙'],['Покачаться на качелях','yardSwing','◠']],.08),
yardJanitor:Y({s:'Дворник Михалыч',t:'О, молодёжь! Метлу в руках держать умеете? Двор подметёте — заплачу полторы сотни. Мне спину ломит, сил нет.',c:[['Подмести двор','yardSweep','⚒'],['Расспросить о районе','yardJanitor2','?'],['Отказаться','yard','←']]}),
yardJanitor2:Y({s:'Дворник Михалыч',t:'В подворотню вечером не суйтесь — там шпана трётся. А на пустыре барахолка, всё продают: от носков до орденов.',next:'yardJanitor3'}),
yardJanitor3:Y(K('Спасибо, Михалыч. Будем осторожнее.')),
yardSweep:Y({t:'Сорок минут шарканья метлой. Листья, окурки, обрывки газет. Михалыч довольно кряхтит и отсчитывает деньги.',next:'yard'}),
yardGranny:Y({rand:['yardGranny1','yardGranny2','yardGranny3']}),
yardGranny1:Y({s:'Баба Шура',t:'Слыхали? В сорок пятой квартире опять свет отрезали. А у Зинки сын в кооператив ушёл — теперь на иномарке ездит!',next:'yardGranny4'}),
yardGranny2:Y({s:'Баба Нюра',t:'Женечка, какая ты худенькая! Кирилл, корми жену-то! Хлеб нынче по сто рублей, где ж это видано…',next:'yardGranny4'}),
yardGranny3:Y({s:'Баба Шура',t:'По телевизору говорят — всё наладится. А я с сорок первого слышу, что наладится. Ничего, внучки, переживём.',next:'yardGranny4'}),
yardGranny4:Y(Z('Спасибо вам. Берегите себя, на улице скользко.')),
yardBins:Y({t:'Кирилл морщится, но заглядывает в бак. Среди мусора — три целые стеклянные бутылки. Их можно сдать в киоске.',next:'yard'}),
yardCar:Y({s:'Хозяин «Москвича»',t:'Аккумулятор сел, а я в технике как свинья в апельсинах. Глянешь? Не обижу.',next:'yardCar2'}),
yardCar2:Y({t:'Кирилл копается под капотом, зачищает клеммы, подтягивает провод. Мотор чихает и заводится. Хозяин радостно суёт деньги.',next:'yard'}),
yardSwing:Y(Z('Помнишь, в детстве мы тут же качались? Ты ещё с качелей упал и сказал, что это я толкнула.')),
// ПОДВОРОТНЯ
alley:loc(A,'Тёмная подворотня. Пахнет сыростью и куревом. На стене — свежее граффити, в углу — пустые ящики. Возле мусорки трётся мутный тип в кожанке.',[['Рассмотреть граффити','alleyArt','✎'],['Порыться в ящиках','alleyBoxes','▢'],['Подойти к типу в кожанке','alleyDeal','☹']],.35),
alleyArt:A(Z('«Цой жив». И рядом кто-то дописал: «А мы?»… Кирилл, пойдём отсюда, мне здесь не нравится.','worried')),
alleyBoxes:A({t:'В размокших ящиках — стопка старых журналов «Огонёк». Пара ещё целая.',next:'alley'}),
alleyDeal:A({s:'Тип в кожанке',t:'Ваучеры нужны? Почти даром — две сотни штука. Через год миллионером будешь, отвечаю.',c:[['Купить ваучер за 200 ₽','alleyBuy','₽'],['Отказаться','alleyNo','✕']]}),
alleyBuy:A({t:'Тип суёт мятую бумажку и быстро исчезает. Женя вертит её в руках: печать нарисована от руки. Подделка.',next:'alley'}),
alleyNo:A(K('Спасибо, обойдёмся.','determined')),
// СКВЕР
park:loc(B,'Сквер с облезлыми скамейками. Старик раскладывает шахматы, голуби дерутся за крошки, на соседней скамейке кто-то забыл газету.',[['Сыграть в шахматы со стариком','parkChess','♞'],['Покормить голубей','parkPigeons','✿'],['Взять забытую газету','parkPaper','▦'],['Посидеть вдвоём на скамейке','parkSit','♡']],.06),
parkChess:B({s:'Старик-шахматист',t:'Партию? На интерес — полтинник. Предупреждаю: я в шестьдесят восьмом самому Талю проиграл всего за сорок ходов.',next:'park'}),
parkPigeons:B({t:'Женя крошит хлеб. Голуби слетаются со всего сквера, один садится Кириллу на плечо. Женя смеётся — впервые за день.',next:'park'}),
parkPaper:B({t:'Вчерашняя газета, но почти не мятая. Пригодится — почитать или продать на барахолке.',next:'park'}),
parkSit:B(Z('Давай просто посидим. Пять минут. Без денег, без новостей.')),
parkSit2:B(K('Давай. Знаешь… я рад, что мы вместе. Даже сейчас.')),
parkSit3:B(Z('Даже сейчас.')),
// ОСТАНОВКА
stop:loc(T,'Остановка с выбитым стеклом. Расписание выцвело, на лавке сидит студент с конспектами. Под лавкой что-то блестит.',[['Прочитать расписание','stopTable','☷'],['Поговорить со студентом','stopStudent','☺'],['Заглянуть под лавку','stopCoins','◎'],['Подождать автобус','stopWait','◷']],.1),
stopTable:T(K('«Автобус №7 — каждые 15 минут». Последний раз он был по расписанию, наверное, при Брежневе.')),
stopStudent:T({s:'Студент Лёша',t:'Стипендия — восемь тысяч. Это три буханки хлеба. Я вот по вечерам вагоны разгружаю, а днём сопромат учу.',next:'stopStudent2'}),
stopStudent2:T(Z('А в магазине на нашей улице тоже ящики разгружать зовут. Платят, кстати, неплохо.')),
stopStudent3:T({s:'Студент Лёша',t:'Серьёзно? Спасибо! Удачи вам, ребята.',next:'stop'}),
stopCoins:T({t:'Под лавкой — несколько монет, видно, кто-то выронил из кармана.',next:'stop'}),
stopWait:T({t:'Двадцать минут на ветру. Автобус так и не пришёл. Зато Кирилл с Женей успели поспорить, чья очередь мыть посуду.',next:'stop'}),
// ТЕЛЕФОННАЯ БУДКА
booth:loc(F,'Телефонная будка. Стекло треснуло, трубка на месте. На полочке — растрёпанный справочник.',[['Позвонить маме','boothCall','☎'],['Полистать справочник','boothBook','☷'],['Проверить лоток для монет','boothCoin','◎']],.1),
boothCall:F({s:'Мама Жени',t:'Женечка! Как вы там? Не голодаете? У нас на заводе опять задерживают зарплату, но огород выручает. Я вам картошки передам.',next:'boothCall2'}),
boothCall2:F(Z('Мам, у нас всё хорошо. Правда. Кирилл работу ищет, я тоже. Не волнуйся.')),
boothCall3:F({s:'Мама Жени',t:'Берегите друг друга. Кириллу привет передай. И шапки носите!',next:'booth'}),
boothBook:F(K('«Ремонт телерадиоаппаратуры — ул. Садовая, 12». Надо бы зайти туда, может, возьмут на работу.')),
boothCoin:F({t:'В лотке для возврата завалялись монеты.',next:'booth'}),
// БАРАХОЛКА
market:loc(M,'Пустырь за домами превратился в барахолку. Люди продают всё, что есть: носки, самовары, книги, ордена. Пахнет жареными семечками.',[['Купить картошку — 80 ₽','marketPotato','🥔'],['Купить консервы — 200 ₽','marketCans','▢'],['Продать банку огурцов — 120 ₽','marketPickles','₽'],['Продать газету — 30 ₽','marketPaper','₽'],['Поговорить со стариком с орденами','marketVet','★']],.15),
marketPotato:M({s:'Торговка',t:'Картошечка своя, с дачи! Бери, не пожалеешь.',next:'market'}),
marketCans:M({s:'Торговка',t:'Тушёнка армейская, ГОСТ! Дешевле, чем в магазине.',next:'market'}),
marketPickles:M({s:'Торговка',t:'Огурчики домашние? Давай, возьму.',next:'market'}),
marketPaper:M({s:'Мужик в ушанке',t:'Газетка? Давай, мне на растопку и почитать.',next:'market'}),
marketVet:M({s:'Старик с орденами',t:'Этот — за Сталинград. Этот — за Будапешт. Продаю… а что делать? Пенсии на хлеб не хватает.',next:'marketVet2'}),
marketVet2:M(K('Не продавайте, дед. Это же ваша жизнь.','worried')),
marketVet3:M({s:'Старик с орденами',t:'Спасибо, сынок. Хороший ты парень. Береги девушку свою.',next:'market'}),
// ПОДЪЕЗД
stairs:loc(S,'Подъезд соседнего дома. Лифт не работает, лампочка мигает. Почтовые ящики исписаны. Сверху доносится пыхтение — кто-то тащит холодильник.',[['Проверить почтовый ящик','stairsMail','✉'],['Помочь соседу с холодильником','stairsFridge','⚒'],['Погреться у батареи','stairsHeat','♨']],.08),
stairsMail:S({t:'Среди рекламы кооперативов — письмо от мамы Жени, его по ошибке бросили в этот ящик.',next:'stairs'}),
stairsFridge:S({s:'Сосед Гена',t:'Ребят, подсобите! На пятый этаж, а лифт — сами видите. Три с половиной сотни дам.',next:'stairsFridge2'}),
stairsFridge2:S({t:'Пять этажей, два перекура и одно чуть не отдавленное колено. Холодильник «ЗиЛ» наконец на месте.',next:'stairs'}),
stairsHeat:S(Z('Батарея еле тёплая, но хоть что-то. Дай руки, у тебя совсем ледяные.')),
stairsHeat2:S(K('Вот так лучше. Спасибо.')),
// ГАЗЕТЫ
papers:loc(G,'Газетный пункт. Пачки свежих газет перетянуты бечёвкой. Заведующая ищет, кого бы отправить разносить почту по району.',[['Взяться за разноску газет','papersWork','⚒'],['Поговорить с заведующей','papersTalk','☺']],.06),
papersWork:G({t:'Час беготни по подъездам. Кирилл берёт нечётные дома, Женя — чётные. Ноги гудят, зато заведующая платит сразу.',next:'papers'}),
papersTalk:G({s:'Заведующая',t:'Раньше «Правду» все выписывали, а сейчас — кто «Спид-инфо», кто «Коммерсант». Время такое, всё с ног на голову.',next:'papers'})
});
// цепочки диалогов
const CH={yardJanitor3:'yard',yardGranny4:'yard',yardSwing:'yard',alleyArt:'alley',alleyNo:'alley',parkSit:'parkSit2',parkSit2:'parkSit3',parkSit3:'park',stopTable:'stop',stopStudent2:'stopStudent3',boothCall2:'boothCall3',boothBook:'booth',marketVet2:'marketVet3',stairsHeat:'stairsHeat2',stairsHeat2:'stairs'};
for(const k in CH)N[k].next=CH[k];
Object.values(N).forEach(n=>{if(n&&n.rand)delete n.next});

const buy=(price,item,n=1)=>()=>{if(!P.pay(price))return{t:`Не хватает денег: нужно ${price} ₽, а у вас ${P.S.money} ₽.`};P.add(P.who(),item,n);return{toast:`−${price} ₽ · ${P.ITEMS[item].i} ${P.ITEMS[item].n}`}};
const sell=(item,price,miss)=>()=>{if(!P.take(item))return{t:miss};P.earn(price);return{toast:`+${price} ₽`}};
const job=(flag,sum,min,again)=>()=>{if(!P.once(flag))return{t:again};P.earn(sum);P.addMin(min);return{toast:`+${sum} ₽`}};
const find=(flag,fn,toast,again)=>()=>{if(!P.once(flag))return{t:again};fn();return{toast}};
const EF3={
yardSweep:job('sweep',150,40,'Михалыч машет рукой: «Двор чистый, спасибо. Завтра приходите».'),
yardBins:find('bins',()=>P.add(P.who(),'bottles',3),'+3 🍾 Пустые бутылки','В баках больше ничего полезного.'),
yardCar2:job('car',300,45,'«Москвич» уже бодро тарахтит по двору. Хозяин сигналит вам и машет рукой.'),
alleyBoxes:find('alleyMags',()=>P.add(P.who(),'magazines',2),'+2 📚 Старые журналы','В ящиках только мокрый картон.'),
alleyBuy:()=>{if(!P.pay(200))return{t:'«Денег нет? Ну и вали отсюда», — тип сплёвывает и отворачивается.'};P.add(P.who(),'voucher');return{toast:'−200 ₽ · 🎫 Фальшивый ваучер'}},
parkChess:()=>{P.addMin(30);if(Math.random()<.5){P.earn(100);return{t:'Кирилл ставит мат конём на тридцать втором ходу. Старик крякает: «Ишь! Держи, заслужил». (+100 ₽)',toast:'+100 ₽'}}if(P.pay(50))return{t:'Старик съедает ферзя и ставит мат. «Учись, молодой». (−50 ₽)',toast:'−50 ₽'};return{t:'Кирилл проигрывает, но платить нечем. Старик машет рукой: «Ладно, в долг. Приходи отыгрываться».'}},
parkPigeons:()=>P.take('bread')?{toast:'−1 🍞 Хлеб'}:{t:'Кормить голубей нечем — хлеба нет. Голуби смотрят с укором.'},
parkPaper:find('parkPaper',()=>P.add(P.who(),'newspaper'),'+ 📰 Газета','На скамейке больше ничего не осталось.'),
stopCoins:job('stopCoins',20,0,'Под лавкой только окурки.'),
stopWait:()=>{P.addMin(20)},
boothCall:()=>P.pay(15)?{toast:'−15 ₽ за жетон'}:{toast:'Жетон нашёлся в кармане'},
boothCoin:job('boothCoin',15,0,'Лоток пуст.'),
marketPotato:buy(80,'potatoes',3),marketCans:buy(200,'cans'),
marketPickles:sell('pickles',120,'Огурцов нет. (Банка огурцов стоит в холодильнике на кухне.)'),
marketPaper:sell('newspaper',30,'Газеты нет. (Одну можно найти в сквере или купить в киоске.)'),
stairsMail:find('letter',()=>P.add(P.who(),'letter'),'+ ✉️ Письмо от мамы','В ящике только реклама.'),
stairsFridge2:job('fridge',350,40,'Сосед Гена уже пьёт чай на пятом этаже. Холодильник на месте.'),
papersWork:job('papers',200,50,'Заведующая: «На сегодня всё разнесли. Завтра приходите пораньше».')
};
const LETTER='«Дорогие мои! Посылаю вам немного денег, не отказывайтесь. Берегите друг друга. Мама.» В конверте — 100 ₽.';
const _use=P.toast;
const _r=render;
render=function(...a){let x=N[id];if(x&&x.rand){id=x.rand[Math.floor(Math.random()*x.rand.length)];x=N[id]}
const f=EF3[id];if(f){if(!x._o3)x._o3={t:x.t,s:x.s,c:x.c};const r=f()||{};for(const k of ['t','s','c']){const v=r[k]!==undefined?r[k]:x._o3[k];x[k]=v;if('_t0' in x)x['_'+k+'0']=v}if(r.toast)setTimeout(()=>P.toast(r.toast),60)}
return _r.apply(this,a)};
// письмо можно открыть из инвентаря: деньги внутри
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-use]');if(!b)return;const [w,k]=b.dataset.use.split(':');if(k==='letter'&&P.takeFrom(w,'letter')){P.earn(100);setTimeout(()=>P.toast(LETTER),80)}if(k==='voucher')setTimeout(()=>P.toast('Печать нарисована шариковой ручкой. Эта бумажка ничего не стоит.'),80)},true);
// кнопка «Город» на улице
const st=document.createElement('style');st.textContent=`.cityBtn{position:absolute;top:212px;right:30px;z-index:7;display:none;border:1px solid #7d6c45;background:#111411;color:#d8cfb6;padding:9px 12px;cursor:pointer;font:700 12px 'Courier New',monospace}.cityBtn:hover{background:#b89a5c;color:#11130f}#game.streetMap .cityBtn{display:block}@media(max-width:700px){.cityBtn{top:196px;right:16px}}`;document.head.appendChild(st);
const btn=document.createElement('button');btn.className='cityBtn';btn.textContent='🗺 ГОРОД (M)';$('game').appendChild(btn);
btn.addEventListener('click',e=>{e.stopPropagation();if(!P.fighting)P.go('cityMap')});
window.addEventListener('keydown',e=>{if(e.code!=='KeyM'||P.invOpen||P.fighting)return;if(!$('game').classList.contains('streetMap'))return;e.preventDefault();e.stopImmediatePropagation();P.go('cityMap')},true);
const help=document.querySelector('.exploreHelp');if(help)help.textContent+=' · M — ГОРОД';
})();
