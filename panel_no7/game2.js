// Панель №7 — дополнение (этап 2): кухня, коридор с выходом на улицу, инвентарь, деньги и подработки.
// Подключается в index.html после основного скрипта и дополняет его, не переписывая.
(function(){
const APT=['ГОСТИНАЯ','СПАЛЬНЯ','КУХНЯ','КОРИДОР','ПРИХОЖАЯ'];
const NAMES={kirill:'Кирилл',zhenya:'Женя'};
const gnd=(w,m,f)=>w==='zhenya'?f:m;
const ITEMS={bread:{n:'Хлеб',i:'🍞',food:'ломоть хлеба'},cans:{n:'Консервы',i:'🥫'},pickles:{n:'Банка огурцов',i:'🥒',food:'пару солёных огурцов'},meal:{n:'Горячий ужин',i:'🍲',food:'горячий ужин'},candy:{n:'Конфета',i:'🍬',food:'конфету'},tea:{n:'Пачка чая',i:'🍵'},bandage:{n:'Бинт',i:'🩹'},bottles:{n:'Пустая бутылка',i:'🍾'},magazines:{n:'Старый журнал',i:'📚'},newspaper:{n:'Газета',i:'📰'},keys:{n:'Ключи от квартиры',i:'🔑'}};
const HEAD=['Цены на хлеб выросли вдвое за месяц','Шахтёры Кузбасса грозят забастовкой','Ваучер: вложить или продать?','Курс доллара на ММВБ — 1190 рублей','В городе открылся первый коммерческий банк'];
let S,invOpen=false;

// ---------- стили и элементы интерфейса ----------
const st=document.createElement('style');st.textContent=`
.invBtn{position:absolute;top:166px;right:30px;z-index:7;border:1px solid #7d6c45;background:#111411;color:#d8cfb6;padding:9px 12px;cursor:pointer;font:700 12px 'Courier New',monospace}
.invBtn:hover{background:#b89a5c;color:#11130f}
.money{position:absolute;top:76px;left:30px;z-index:7;border:1px solid #7d6c45;background:rgba(17,20,17,.94);padding:8px 14px;font:700 13px 'Courier New',monospace;color:#d6b865}
.invPanel{position:absolute;inset:0;z-index:30;display:grid;place-items:center;background:rgba(5,6,5,.78);backdrop-filter:blur(3px)}
.invPanel.hidden{display:none}
.invCard{width:min(860px,92vw);max-height:84vh;overflow:auto;background:#141713;border:2px solid #c0a76b;padding:22px 26px;box-shadow:0 20px 60px rgba(0,0,0,.6);color:#eee8d9}
.invHead{display:flex;justify-content:space-between;align-items:center;font:700 18px 'Courier New',monospace;color:#d6b865;letter-spacing:.12em}
.invHead button{background:none;border:1px solid #7d6c45;color:#eee8d9;cursor:pointer;padding:4px 10px}
.invMoney{margin:10px 0 16px;font:700 15px 'Courier New',monospace}
.invMoney b{color:#d6b865}
.invCols{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.invCol{border:1px solid #4a4130;padding:12px;background:#1a1d18}
.invTop{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.invTop img{width:54px;height:54px;object-fit:cover;object-position:50% 15%;border:1px solid #7d6c45;background:#292a26}
.invName{font:700 15px 'Courier New',monospace}
.invItem{display:flex;align-items:center;gap:8px;padding:7px 0;border-top:1px solid #2c2a22;font-size:14px}
.invIco{font-size:20px;width:26px;text-align:center}
.invN{flex:1}
.invItem button{background:#232720;border:1px solid #7d6c45;color:#eee8d9;cursor:pointer;padding:5px 8px;font:700 11px 'Courier New',monospace}
.invItem button:hover{background:#b89a5c;color:#11130f}
.invEmpty{color:#8e836b;font-style:italic;padding:8px 0}
.invHint{margin-top:14px;color:#8e836b;font:700 11px 'Courier New',monospace}
.toast{position:absolute;left:50%;top:22%;transform:translateX(-50%);z-index:25;background:rgba(17,20,17,.96);border:1px solid #d6b865;padding:12px 18px;font:700 14px 'Courier New',monospace;color:#eee8d9;pointer-events:none;animation:toastIn 2.6s ease forwards;text-align:center;max-width:80vw}
@keyframes toastIn{0%{opacity:0;transform:translate(-50%,8px)}12%,80%{opacity:1;transform:translate(-50%,0)}100%{opacity:0}}
@media(max-width:700px){.invBtn{top:150px;right:16px}.money{left:16px;top:62px}.invCols{grid-template-columns:1fr}}
`;document.head.appendChild(st);
const game=$('game');
const invBtn=document.createElement('button');invBtn.className='invBtn';invBtn.id='invBtn';invBtn.textContent='🎒 ИНВЕНТАРЬ (I)';game.appendChild(invBtn);
const money=document.createElement('div');money.className='money';money.id='money';game.appendChild(money);
const panel=document.createElement('div');panel.className='invPanel hidden';panel.id='invPanel';game.appendChild(panel);
const help=document.querySelector('.exploreHelp');if(help)help.textContent+=' · I — ИНВЕНТАРЬ';

// ---------- состояние: деньги, вещи, разовые находки ----------
function updMoney(){if(S)money.textContent='₽ '+S.money}
function resetState(){S={money:800,inv:{kirill:{},zhenya:{}},flags:{}};updMoney()}
function isApt(){const x=N[id];if(x.map)return true;return APT.includes(roomFor(x))}
function who(){const w=isApt()?home:street;if(w.party==='kirill'||w.party==='zhenya')return w.party;return w.active}
function cnt(k){return (S.inv.kirill[k]||0)+(S.inv.zhenya[k]||0)}
function add(w,k,n=1){S.inv[w][k]=(S.inv[w][k]||0)+n}
function takeFrom(w,k,n=1){if((S.inv[w][k]||0)<n)return false;S.inv[w][k]-=n;if(!S.inv[w][k])delete S.inv[w][k];return true}
function take(k,n=1){if(cnt(k)<n)return false;const a=who(),b=a==='kirill'?'zhenya':'kirill';let need=n;for(const w of [a,b]){const h=Math.min(need,S.inv[w][k]||0);if(h){takeFrom(w,k,h);need-=h}}return true}
function pay(sum){if(S.money<sum)return false;S.money-=sum;updMoney();return true}
function earn(sum){S.money+=sum;updMoney()}
function once(f){if(S.flags[f])return false;S.flags[f]=true;return true}
function addMin(m){const [h,mm]=currentTime.split(':').map(Number);const t=h*60+mm+m;currentTime=String(Math.floor(t/60)%24).padStart(2,'0')+':'+String(t%60).padStart(2,'0');$('time').textContent='5 НОЯБРЯ 1993 · ПЯТНИЦА · '+currentTime}
function toast(msg){const d=document.createElement('div');d.className='toast';d.textContent=msg;game.appendChild(d);setTimeout(()=>d.remove(),2700)}

// ---------- инвентарь ----------
function renderInv(){const col=w=>{const items=Object.keys(S.inv[w]);const rows=items.length?items.map(k=>`<div class='invItem'><span class='invIco'>${ITEMS[k].i}</span><span class='invN'>${ITEMS[k].n} ×${S.inv[w][k]}</span><button data-use='${w}:${k}'>ИСПОЛЬЗОВАТЬ</button><button data-give='${w}:${k}'>ПЕРЕДАТЬ</button></div>`).join(''):`<div class='invEmpty'>Пусто</div>`;return `<div class='invCol'><div class='invTop'><img src='assets/${w}_neutral.png' alt=''><div class='invName'>${NAMES[w].toUpperCase()}</div></div>${rows}</div>`};panel.innerHTML=`<div class='invCard'><div class='invHead'>ИНВЕНТАРЬ<button id='invClose'>✕</button></div><div class='invMoney'>Деньги семьи: <b>${S.money} ₽</b></div><div class='invCols'>${col('kirill')}${col('zhenya')}</div><div class='invHint'>I или ESC — закрыть · деньги общие · вещи можно передавать друг другу, когда персонажи рядом</div></div>`}
function toggleInv(force){invOpen=typeof force==='boolean'?force:!invOpen;if(invOpen)renderInv();panel.classList.toggle('hidden',!invOpen)}
function useItem(w,k){const it=ITEMS[k];if(it.food){takeFrom(w,k);toast(`${NAMES[w]} ${gnd(w,'съел','съела')} ${it.food}. Стало теплее.`);return}
if(k==='newspaper'){toast('«'+HEAD[Math.floor(Math.random()*HEAD.length)]+'»');return}
if(k==='bandage'){toast('Бинт пригодится, если кто-то пострадает.');return}
if(k==='tea'){toast('Заварку лучше заварить на кухне — у плиты.');return}
if(k==='bottles'||k==='magazines'){toast('Это можно сдать у киоска на улице.');return}
if(k==='keys'){toast('Ключи на месте. Можно спокойно выходить.');return}
toast('Сейчас это не пригодится.')}
panel.addEventListener('click',e=>{e.stopPropagation();if(e.target===panel){toggleInv(false);return}const b=e.target.closest('button');if(!b)return;if(b.id==='invClose'){toggleInv(false);return}if(b.dataset.use){const [w,k]=b.dataset.use.split(':');useItem(w,k)}else if(b.dataset.give){const [w,k]=b.dataset.give.split(':'),o=w==='kirill'?'zhenya':'kirill';if(!isApt()&&street.party!=='both'){toast('Они сейчас не рядом — передать не получится.')}else if(takeFrom(w,k)){add(o,k);toast(`${NAMES[w]} → ${NAMES[o]}: ${ITEMS[k].i} ${ITEMS[k].n}`)}}renderInv()});
invBtn.addEventListener('click',e=>{e.stopPropagation();toggleInv()});
window.addEventListener('keydown',e=>{if(e.code==='KeyI'){e.preventDefault();e.stopImmediatePropagation();if(!$('title').classList.contains('hidden'))return;toggleInv();return}if(invOpen){if(e.code==='Escape')toggleInv(false);e.preventDefault();e.stopImmediatePropagation()}},true);

// ---------- фоны кухни и коридора (рисуются прямо в игре) ----------
const BG={};
function roomBg(kind){if(BG[kind])return BG[kind];const c=document.createElement('canvas');c.width=1600;c.height=900;const g=c.getContext('2d'),X=v=>v*16,Y=v=>v*9;
const R=(x1,y1,x2,y2,f,s)=>{g.fillStyle=f;g.fillRect(X(x1),Y(y1),X(x2-x1),Y(y2-y1));if(s){g.strokeStyle=s;g.lineWidth=4;g.strokeRect(X(x1),Y(y1),X(x2-x1),Y(y2-y1))}};
const SH=(x1,y1,x2,y2)=>R(x1+.6,y1+1.4,x2+.6,y2+1.4,'rgba(0,0,0,.35)');
const T=(s,x,y,size=20)=>{g.font=`700 ${size}px Courier New`;g.textAlign='center';const w=g.measureText(s).width+16;g.fillStyle='rgba(20,16,10,.78)';g.fillRect(X(x)-w/2,Y(y)-size,w,size+9);g.fillStyle='#efe4c6';g.fillText(s,X(x),Y(y))};
const CIR=(x,y,r,f)=>{g.fillStyle=f;g.beginPath();g.arc(X(x),Y(y),r,0,7);g.fill()};
g.fillStyle='#231d16';g.fillRect(0,0,1600,900);
if(kind==='kitchen'){
for(let i=0;i<41;i++)for(let j=0;j<24;j++){g.fillStyle=(i+j)%2?'#8c7c5f':'#b3a383';g.fillRect(i*40,Y(22)+j*40,40,40)}
R(0,0,100,22,'#4a3f30');for(let i=0;i<100;i+=3)R(i,0,i+1,22,'rgba(0,0,0,.12)');R(0,21,100,22.5,'#2a2018');
R(0,22,4,100,'#3b3226');R(96,22,100,100,'#3b3226');R(0,96,100,100,'#3b3226');
R(47,1,63,17,'#2b241b');R(48,2,62,16,'#a9b7b6');R(54.6,2,55.4,16,'#2b241b');R(48,8.6,62,9.4,'#2b241b');R(46,16,64,20,'#6b5236');
SH(8,10,20,30);R(8,10,20,30,'#d8d1c0','#3a3226');[[11,15],[17,15],[11,24],[17,24]].forEach(([a,b])=>{g.fillStyle='#2a2520';g.beginPath();g.ellipse(X(a),Y(b),34,30,0,0,7);g.fill();g.strokeStyle='#777';g.lineWidth=3;g.stroke()});
SH(22,10,44,28);R(22,10,44,28,'#7c5b3a','#3a2a1a');R(25,13,36,24,'#9e9d97','#55524c');R(27,15,34,22,'#6f706c');CIR(30.5,18.5,8,'#2b2b2b');R(38,13,43,25,'#5e4429','#3a2a1a');
SH(66,10,78,22);R(66,10,78,22,'#6b4a2c','#3a2a1a');R(68,12,76,20,'#4a2e1c','#20140c');CIR(73.5,16,14,'#c9b27a');R(68.8,13,71.5,19,'#2a1a10');
SH(82,8,94,34);R(82,8,94,34,'#e4e0d3','#5b574c');R(82,18,94,18.6,'#8f8a7c');R(92,11,93,16,'#8f8a7c');R(92,21,93,30,'#8f8a7c');
SH(2,38,10,72);R(2,38,10,72,'#6b4a2c','#2e2013');R(2,55,10,55.6,'#2e2013');R(5.7,40,6.3,70,'#2e2013');
g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(X(53),Y(57.5),X(9),Y(10),0,0,7);g.fill();g.fillStyle='#8a5f3a';g.beginPath();g.ellipse(X(52),Y(55),X(9),Y(10),0,0,7);g.fill();g.strokeStyle='#3a2414';g.lineWidth=5;g.stroke();g.fillStyle='#c8b48a';g.beginPath();g.ellipse(X(52),Y(55),X(6.5),Y(7),0,0,7);g.fill();
[[40,55],[64,55],[52,42]].forEach(([a,b])=>CIR(a,b,26,'#5a3d24'));CIR(49,54,12,'#efe4c6');CIR(55,56,12,'#efe4c6');
R(44,95,56,100,'#6b4a2c','#2e2013');
T('ПЛИТА',14,7);T('РАКОВИНА',31,7);T('ОКНО',55,21.5,17);T('РАДИО',72,7);T('ХОЛОДИЛЬНИК',88,6);T('БУФЕТ',6,36);T('СТОЛ',52,66,17);T('В КОРИДОР',50,93,17);
}else{
for(let r=0;r<14;r++)for(let i=0;i<20;i++){const off=r%2?45:0;g.fillStyle=(i+r)%3===0?'#7a5a38':(i+r)%3===1?'#86643f':'#6f5133';g.fillRect(i*90-off,Y(30)+r*36,88,34)}
R(0,0,100,30,'#4d4232');for(let i=0;i<100;i+=4)R(i,0,i+1.4,30,'rgba(230,210,160,.08)');R(0,29.5,100,31,'#2a2018');
R(0,78,100,100,'#3b3226');R(0,77,100,78,'#2a2018');R(0,30,4,78,'#3b3226');R(96,30,100,78,'#3b3226');
R(0,38,5,70,'#4a2618','#1e0f08');for(let a=40;a<70;a+=4)for(const b of [1.2,3.6])CIR(b,a,4,'#b8995a');
R(28,16,40,30,'#6b4a2c','#2e2013');CIR(38.5,23,6,'#c9b27a');R(70,16,82,30,'#6b4a2c','#2e2013');CIR(80.5,23,6,'#c9b27a');R(40,78,52,90,'#6b4a2c','#2e2013');
R(10,21,22,23,'#3a2a1a');[[12,'#5b4a3a'],[16,'#3e4a52'],[20,'#6b3a2a']].forEach(([a,col])=>R(a-1.6,22,a+1.6,31,col,'#1a140e'));
R(50,11,58,28,'#8e8a7e','#3a2a1a');R(51,12.5,57,26.5,'#c9d0cc');
SH(86,22,94,31);R(86,22,94,31,'#6b4a2c','#2e2013');R(88,24,92,28,'#8c1f1a','#3a0c0a');
SH(10,71,25,77);R(10,71,25,77,'#5a3d24','#2e2013');[[12.5,'#2a2a2a'],[16.5,'#6a5a4a'],[20.5,'#3a3a5a']].forEach(([a,col])=>R(a-1.4,72,a+1.4,76,col));
T('ВЫХОД',8,36,17);T('ВЕШАЛКА',16,19);T('СПАЛЬНЯ',34,14);T('ЗЕРКАЛО',54,9);T('КУХНЯ',76,14);T('ТЕЛЕФОН',90,20);T('ОБУВНИЦА',17.5,83,17);T('ГОСТИНАЯ',46,95,17);
}
BG[kind]=c.toDataURL('image/jpeg',.9);return BG[kind]}

// ---------- карты, точки и стены новых комнат ----------
const HOT_KITCHEN=[{id:'kStove',x:14,y:34,n:'Плита'},{id:'kSink',x:31,y:32,n:'Раковина'},{id:'kBottles',x:41,y:32,n:'Шкафчик под раковиной'},{id:'kWindow',x:55,y:28,n:'Окно'},{id:'kRadio',x:72,y:28,n:'Радиоприёмник'},{id:'kFridge',x:88,y:38,n:'Холодильник'},{id:'kCupboard',x:14,y:56,n:'Буфет'},{id:'kTable',x:52,y:70,n:'Кухонный стол'},{id:'goCorridorFromKitchen',x:50,y:92,n:'Дверь в коридор'}];
const HOT_CORRIDOR=[{id:'leaveHome',x:8,y:56,n:'Входная дверь — на улицу'},{id:'cCoat',x:16,y:35,n:'Вешалка с пальто'},{id:'bedroom',x:34,y:35,n:'Дверь в спальню'},{id:'cMirror',x:54,y:35,n:'Зеркало'},{id:'goKitchen',x:76,y:35,n:'Дверь на кухню'},{id:'cPhone',x:90,y:35,n:'Телефон'},{id:'cShoes',x:17,y:68,n:'Обувница'},{id:'goLiving',x:46,y:76,n:'Дверь в гостиную'}];
const BLOCKS={kitchen:[{x1:6,y1:0,x2:22,y2:30},{x1:22,y1:0,x2:46,y2:28},{x1:46,y1:0,x2:80,y2:24},{x1:80,y1:0,x2:96,y2:34},{x1:0,y1:0,x2:6,y2:26},{x1:0,y1:38,x2:10,y2:72}],corridor:[{x1:0,y1:0,x2:100,y2:31},{x1:0,y1:77,x2:100,y2:100},{x1:9,y1:70,x2:26,y2:77},{x1:0,y1:0,x2:5,y2:100},{x1:96,y1:0,x2:100,y2:100}]};
const CIRCLES={kitchen:[{x:52,y:57,r:9}]};
const lh=HOT_HOME.find(h=>h.id==='leaveHome');if(lh){lh.id='goCorridorFromLiving';lh.n='Дверь в коридор'}
HOT_HOME.push({id:'lSofa',x:33,y:58,n:'Диван — поискать мелочь'});

// ---------- новые сцены и диалоги ----------
const K=(o)=>Object.assign({room:'КУХНЯ',w:'none',s:'Рассказчик'},o),C=(o)=>Object.assign({room:'КОРИДОР',w:'none',s:'Рассказчик'},o);
Object.assign(N,{
kitchenExplore:{room:'КУХНЯ',s:'',t:'',w:'none',map:'kitchen',explore:true},
goKitchen:{room:'КУХНЯ',s:'',t:'',w:'none',map:'kitchen',explore:true,spawn:[46,86,52,86,'up']},
corridorExplore:{room:'КОРИДОР',s:'',t:'',w:'none',map:'corridor',explore:true},
goCorridorFromKitchen:{room:'КОРИДОР',s:'',t:'',w:'none',map:'corridor',explore:true,spawn:[72,40,78,40,'down']},
goCorridorFromLiving:{room:'КОРИДОР',s:'',t:'',w:'none',map:'corridor',explore:true,spawn:[42,72,48,72,'up']},
goCorridorFromBedroom:{room:'КОРИДОР',s:'',t:'',w:'none',map:'corridor',explore:true,spawn:[31,38,36,38,'down']},
corridorArrive:{room:'КОРИДОР',s:'',t:'',w:'none',map:'corridor',explore:true,spawn:[7,50,7,60,'right']},
goLiving:{room:'ГОСТИНАЯ',s:'',t:'',w:'none',map:'home',explore:true,spawn:[52,76,59,76,'up']},
lSofa:{room:'ГОСТИНАЯ',s:'Рассказчик',w:'none',t:'Кирилл шарит рукой под диваном… три монеты и пуговица. +35 ₽',next:'homeExplore'},
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
kTalkMom3:K({s:'Женя',w:'zhenya',e:'neutral',t:'Ты всегда говоришь так, будто всё решаемо.',next:'kTalkMom4'}),
kTalkMom4:K({s:'Кирилл',w:'kirill',e:'determined',t:'А иначе зачем вставать по утрам?',next:'kTable'}),
kTalkWork:K({s:'Кирилл',w:'kirill',e:'neutral',t:'В мастерской на Садовой ищут человека паять приёмники. Платят мало, зато каждую неделю.',next:'kTalkWork2'}),
kTalkWork2:K({s:'Женя',w:'zhenya',e:'determined',t:'А я буду сдавать бутылки и журналы. И в магазине иногда просят ящики разгрузить — это тоже деньги.',next:'kTable'}),
kMoney:K({t:'Они пересчитывают деньги.',next:'kTable'}),
cMirror:C({s:'Женя',w:'zhenya',e:'neutral',t:'Посмотри на себя — щетина как у геолога после экспедиции.',next:'cMirror2'}),
cMirror2:C({