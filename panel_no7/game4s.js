(function(){'use strict';
const P=window.P7;if(!P||!P._K||!P._K.chibi)return;const K=P._K;let g=null;
const {rnd,hash,X,Y,OL,R,SH,C,E,LN,T,TX,GLOW,wall,floor}=K;const item=(...a)=>K.item(...a),BOOKC=K.BOOKC;
const {LK,HERO,NPC,randLook}=K;const chibi=(x,y,s,lk,p,f)=>K.chibi(g,x,y,s,lk,p,f);
// ---------- сцены (фон + предметы + места для героев и NPC) ----------
const ST=[[38,90,'stand',1],[62,90,'stand',-1]];
const SCN={
living:{w:'stripe',f:'plank',hz:58,items:[['win',44,10,60,40,'ОКНО'],['tv',8,26,26,58,'ТЕЛЕВИЗОР'],['shelf',74,12,94,58,'СТЕЛЛАЖ'],['sofa',30,46,62,64,'ДИВАН'],['rug',50,70,80,86],['table',62,60,74,72,'СТОЛ','#8a7a5a'],['kettle',65,55,69,60],['rad',46,44,58,52],['clock',66,14,70,22]],h:ST},
tv:{w:'stripe',f:'plank',hz:58,dark:.35,glow:[[24,40,300,'rgba(190,215,220,.35)']],items:[['tv',12,24,34,60,'ТЕЛЕВИЗОР'],['win',60,10,76,40,null,'night'],['sofa',44,52,84,72,'ДИВАН'],['rug',20,72,60,90]],h:[[56,78,'sit',-1],[68,78,'sit',-1]]},
tea:{w:'tile',f:'check',hz:56,items:[['win',40,8,58,38,'ОКНО'],['stove',6,30,20,62,'ПЛИТА'],['kettle',9,25,15,31],['fridge',82,14,96,64,'ХОЛОДИЛЬНИК'],['table',36,56,66,74,'СТОЛ','#c8c0a8'],['cups',44,55,58,58],['bulb',51,4,51,6,null,340]],h:[[34,90,'stand',1],[68,90,'stand',-1]]},
sleep:{w:'wallpaper',f:'plank',hz:56,dark:.5,glow:[[70,22,260,'rgba(200,210,230,.25)']],items:[['win',62,8,80,38,'ОКНО','night'],['cab',84,14,98,62,'ШКАФ'],['bed',8,48,50,78,'КРОВАТЬ'],['mattress',52,74,90,88,'МАТРАС']],h:[[66,82,'lie',1],[30,62,'lie',1]]},
bedroom:{w:'wallpaper',f:'plank',hz:56,items:[['win',40,8,58,38,'ОКНО'],['cab',80,12,96,62,'ШКАФ'],['bed',4,46,36,74,'КРОВАТЬ'],['books',62,50,70,60,'ЖУРНАЛЫ'],['mattress',60,74,94,86],['poster',22,14,32,30,'КИНО']],h:ST},
hall:{w:'stripe',f:'brick',hz:58,items:[['coatrack',6,18,24,52,'ВЕШАЛКА'],['mirror',30,12,40,46,'ЗЕРКАЛО'],['door',44,10,58,58,'ВЫХОД'],['phone',64,22,70,32,'ТЕЛЕФОН'],['shoes',72,46,92,58,'ОБУВНИЦА'],['bulb',50,3,50,5]],h:ST},
exit:{w:'plaster',f:'concrete',hz:60,items:[['mail',4,18,22,40,'ПОЧТОВЫЕ ЯЩИКИ'],['mdoor',40,8,58,60,'ВЫХОД НА УЛИЦУ','open'],['stairs',70,36,98,62,'ЛЕСТНИЦА'],['note',26,22,32,30],['rad',24,44,36,54],['bulb',50,2,50,4],['graffiti',62,10,90,20,'КИНО']],h:ST},
street_front:{out:1,w:'out',f:'asphalt',hz:55,items:[['house',2,10,30,55],['house',60,6,98,55,null,'#8a857a'],['sign',33,26,57,33,'ПРОДУКТЫ'],['house',32,34,58,55,null,'#6e6a62'],['lamp',30,26,32,80],['tree',82,40,96,84],['snowpile',4,82,22,90],['wires',0,8,0,10]],h:ST},
square:{out:1,w:'out',f:'snow',hz:52,items:[['columns',20,8,80,52,'АДМИНИСТРАЦИЯ'],['flag',49,0,59,10],['crowd',4,52,96,74,null,14],['sign',30,40,48,46,'ХВАТИТ!','#7a2a22'],['sign',58,40,74,46,'ДАЙТЕ ХЛЕБ','#7a2a22']],h:[[34,92,'stand',1],[48,92,'stand',-1]],npc:[['police',78,86,'stand',-1],['man',60,90,'stand',-1]]},
stop:{out:1,w:'out',f:'asphalt',hz:55,items:[['house',0,12,40,55],['bus',60,30,98,58,'№7'],['sign',4,36,14,44,'№7 №3','#3a4a3a'],['bench',18,58,46,70,'ЛАВКА'],['lamp',50,22,52,80],['snowpile',80,84,96,92]],h:[[30,90,'stand',1],[44,90,'stand',-1]],npc:[['student',62,88,'stand',-1]]},
shop:{w:'tile',f:'tile',hz:58,items:[['shelf',4,10,30,56,'ПОЛКИ','empty'],['shelf',70,10,96,56,null,'empty'],['sign',36,8,64,15,'ХЛЕБ · МОЛОКО'],['counter',30,52,74,72,'ПРИЛАВОК'],['scale',38,46,46,52],['register',60,44,68,52],['bulb',50,2,50,4]],h:[[30,94,'stand',1],[18,94,'stand',1]],npc:[['seller',52,66,'stand',1]]},
pharmacy:{w:'tile',f:'tile',hz:58,items:[['shelf',4,10,30,56,'ЛЕКАРСТВА'],['shelf',70,10,96,56],['sign',40,8,60,15,'АПТЕКА','#2e5a3a'],['counter',30,54,74,72,null,'glass'],['plant',76,58,82,74]],h:[[30,94,'stand',1],[18,94,'stand',1]],npc:[['pharm',52,66,'stand',1]]},
alley:{out:1,w:'brick',f:'asphalt',hz:62,dark:.3,items:[['graffiti',8,10,40,24,'ЦОЙ ЖИВ'],['boxes',4,44,22,64,'ЯЩИКИ',5],['bin',70,40,88,64,'МУСОРКА'],['mdoor',44,20,54,62,'ДВЕРЬ'],['bulb',50,6,50,8,null,200],['puddle',30,80,50,88]],h:ST,npc:[['stranger',80,88,'stand',-1]]},
park:{out:1,w:'out',f:'snow',hz:50,items:[['tree',2,20,20,76],['tree',78,16,98,78],['tree',30,22,44,60],['bench',36,58,64,72,'ЛАВКА'],['lamp',70,20,72,78],['chess',12,74,24,86,'ШАХМАТЫ'],['pigeons',48,80,70,90,null,6]],h:[[42,90,'stand',1],[56,90,'stand',-1]],npc:[['chess',8,92,'stand',1]]},
yard:{out:1,w:'out',f:'snow',hz:50,items:[['house',0,4,46,50],['house',54,8,100,50,null,'#8a857a'],['swing',6,52,24,74,'КАЧЕЛИ'],['car',62,58,90,76,'«МОСКВИЧ»'],['bin',90,52,99,66,'БАКИ'],['bench',30,56,48,66],['barrel',50,62,55,72]],h:[[36,92,'stand',1],[50,92,'stand',-1]],npc:[['michalych',20,90,'stand',1],['shura',33,70,'sit',1],['nyura',43,70,'sit',-1]]},
entrance:{out:1,w:'plaster',f:'snow',hz:62,items:[['mdoor',38,10,56,62,'ПОДЪЕЗД №2'],['poster',62,20,76,40,'ОБЪЯВЛЕНИЕ'],['bench',6,56,30,68,'ЛАВКА'],['lamp',34,6,36,40],['snowpile',78,84,98,92]],h:ST},
stairwell:{w:'plaster',f:'concrete',hz:60,items:[['stairs',56,26,98,62,'ЛЕСТНИЦА'],['door',8,14,22,60,'КВ. 5'],['door',28,14,42,60,'КВ. 6'],['win',60,6,74,24],['rad',44,42,54,52],['bulb',40,2,40,4,null,180]],h:ST,npc:[['gena',78,90,'stand',-1]]},
kiosk:{out:1,w:'out',f:'asphalt',hz:55,items:[['house',0,8,36,55],['kiosk',40,20,70,62],['lamp',76,18,78,80],['snowpile',84,84,99,92]],h:[[30,92,'stand',1],[78,92,'stand',-1]],npc:[['kiosk',55,50,'stand',1]]},
papers:{w:'panel',f:'plank',hz:58,items:[['counter',20,50,80,70,'СТОЙКА'],['boxes',4,40,18,62,'ПАЧКИ ГАЗЕТ',4],['poster',30,12,44,34,'ПРАВДА'],['poster',56,12,70,34,'ТРУД'],['clock',84,14,88,22],['bulb',50,2,50,4]],h:ST,npc:[['manager',52,62,'stand',1]]},
newspaper_street:{out:1,w:'out',f:'asphalt',hz:55,items:[['house',0,8,60,55],['note',44,82,54,88,null,'#cfc6aa'],['puddle',60,78,84,88],['lamp',70,22,72,78]],h:ST},
market:{out:1,w:'out',f:'snow',hz:52,items:[['fence',0,30,100,52],['stall',4,48,30,70,'ЛОТОК'],['stall',70,48,96,70,'РАСКЛАДУШКА','#3a5a4a'],['barrel',44,60,50,72],['puddle',30,80,60,90]],h:[[38,92,'stand',1],[52,92,'stand',-1]],npc:[['vendor',16,72,'stand',1],['ushanka',62,74,'stand',-1],['veteran',88,74,'stand',-1]]},
booth:{out:1,w:'out',f:'snow',hz:55,items:[['house',50,6,100,55],['booth',20,20,40,80],['lamp',44,18,46,80],['snowpile',0,84,16,92]],h:[[54,92,'stand',-1],[68,92,'stand',-1]]},
window_home:{out:1,w:'out',f:'snow',hz:65,items:[['house',0,10,30,65],['house',34,20,62,65,null,'#8a857a'],['house',66,6,100,65],['tree',40,40,58,90],['car',62,72,84,86]],h:[]},
city:{out:1,w:'out',f:'snow',hz:70,dark:.25,items:[['house',0,20,18,70],['house',20,10,40,70,null,'#6e6a62'],['house',44,26,60,70],['house',62,14,80,70,null,'#8a857a'],['house',82,22,100,70],['smoke',90,0,93,22],['wires',0,30,0,32]],h:[]},
map_street:{map:1},map_home:{map:1}
};
const OUTK=new Set(Object.keys(SCN).filter(k=>SCN[k].out));
P.addScene=(k,d)=>{SCN[k]=d;if(d.out)OUTK.add(k)};
P.NPC=NPC;P.chibiLook=k=>NPC[k];

// ---------- кто физически в сцене ----------
const APTR=['ГОСТИНАЯ','СПАЛЬНЯ','КУХНЯ','КОРИДОР','ПРИХОЖАЯ'];
P.inApt=x=>!!(x&&((x.map&&x.map!=='street')||APTR.includes(x.room||'ГОСТИНАЯ')));
P.cast=(x,partyOverride)=>{x=x||N[id];if(x.cast)return x.cast.slice();if(P.inApt(x)&&!x.outdoor)return['kirill','zhenya'];const p=partyOverride||x.party||street.party||'both';return p==='both'?['kirill','zhenya']:[p]};

const SKEY={tea_photo:'tea',watch_tv:'tv',sleep:'sleep',exit_building:'exit',dress:'hall',protest:'square',busstop:'stop',street:'street_front',shop_inside:'shop',pharmacy_inside:'pharmacy',detail_alley:'alley',detail_bench:'park',detail_busstop:'stop',detail_courtyard:'yard',detail_kiosk:'kiosk',detail_protest:'square',detail_shop:'shop',detail_pharmacy:'pharmacy',detail_phone:'booth'};
const RKEY={'ГОСТИНАЯ':'living','СПАЛЬНЯ':'bedroom','ПРИХОЖАЯ':'hall','ПОДЪЕЗД':'exit','УЛИЦА':'street_front','ПЛОЩАДЬ':'square','ОСТАНОВКА':'stop','МАГАЗИН':'shop','АПТЕКА':'pharmacy','ДВОР':'yard','ПОДВОРОТНЯ':'alley','СКВЕР':'park','ГОРОД':'city'};
P.sceneKey=x=>{if(x.art)return x.art;const r=x.room||'ГОСТИНАЯ',s=x.scene||'';
if(s==='detail_newspaper')return r==='ГАЗЕТНЫЙ ПУНКТ'?'papers':'newspaper_street';
if(s==='detail_window')return r==='ГОРОД'?'city':'window_home';
if(s==='detail_puddle')return r.startsWith('ПУСТЫРЬ')?'market':'newspaper_street';
if(s==='detail_entrance')return r==='ПОДЪЕЗД'?'stairwell':'entrance';
if(SKEY[s])return SKEY[s];if(RKEY[r])return RKEY[r];if(r.startsWith('ТЕЛЕФОН'))return'booth';return P.inApt(x)?'living':'street_front'};

// ---------- отрисовка сцены ----------
const cache=new Map();
function drawScene(key,o){const d=SCN[key]||SCN.living;K.setSeed(hash(key));const hz=d.hz||58;
wall(d.w||'stripe',hz);floor(d.f||'brick',hz);(d.items||[]).forEach(it=>{try{item(it)}catch(e){}});
if(d.glow)d.glow.forEach(q=>GLOW(q[0],q[1],q[2],q[3]));
const out=o.out!==undefined?o.out:OUTK.has(key),ppl=[];
(o.npcs||[]).forEach(n=>{const lk=NPC[n[0]];if(lk)ppl.push({y:n[2],f:()=>{if(n[5]){g.fillStyle='rgba(239,228,198,.18)';g.beginPath();g.ellipse(X(n[1]),Y(n[2]),70,16,0,0,7);g.fill()}chibi(X(n[1]),Y(n[2]),o.sc||1.3,lk,n[3]||'stand',n[4]||1)}})});
const hs=o.heroes||[],pl=d.h&&d.h.length?d.h:ST;
hs.forEach((h,i)=>{let p=hs.length===1?(d.solo||[(pl[0][0]+(pl[1]||pl[0])[0])/2,pl[0][1],pl[0][2],pl[0][3]]):pl[h==='kirill'?0:1]||pl[0];if(o.pose&&o.pose[h])p=[p[0],p[1],o.pose[h],p[3]];const lk=HERO[h][out?'out':'in'];ppl.push({y:p[1]+(p[2]==='lie'?-30:0),f:()=>chibi(X(p[0]),Y(p[1]),o.sc||1.3,lk,p[2],p[3])})});
ppl.sort((a,b)=>a.y-b.y).forEach(p=>p.f());
if(out&&d.snow!==0){g.fillStyle='rgba(240,238,232,.75)';for(let i=0;i<140;i++){g.beginPath();g.arc(rnd()*1600,rnd()*900,1+rnd()*2.2,0,7);g.fill()}}
const dk=(d.dark||0)+(o.dark||0);if(dk){g.fillStyle=`rgba(10,8,6,${dk})`;g.fillRect(0,0,1600,900);if(d.glow){g.globalCompositeOperation='lighter';d.glow.forEach(q=>GLOW(q[0],q[1],q[2]*.8,q[3]));g.globalCompositeOperation='source-over'}}
if(o.title)T(o.title,50,6,22)}
P.paintScene=(key,o)=>{o=o||{};const ck=key+'|'+JSON.stringify(o);if(cache.has(ck))return cache.get(ck);const cv=document.createElement('canvas');cv.width=1600;cv.height=900;g=cv.getContext('2d');K.setG(g);
if(SCN[key]&&SCN[key].map)(key==='map_home'?drawHomeMap:drawStreetMap)();else drawScene(key,o);const url=cv.toDataURL('image/jpeg',.86);if(cache.size>60)cache.delete(cache.keys().next().value);cache.set(ck,url);return url};
P.npcsFor=(x,key)=>{const d=SCN[key]||{},list=(d.npc||[]).filter(n=>!(P.S&&P.S.flags&&P.S.flags['gone_'+n[0]])).map(n=>n.slice()),sp=P.speakerNpc(x);if(sp){const f=list.find(n=>n[0]===sp);if(f)f[5]=1;else{const s=d.spk||[76,90];list.push([sp,s[0],s[1],'stand',-1,1])}}if(x.npcs)x.npcs.forEach(n=>{if(!list.find(m=>m[0]===n[0]))list.push(n.slice())});return list};
P.nodeArt=(x,party)=>{const key=P.sceneKey(x);const heroes=P.cast(x,party);return P.paintScene(key,{heroes,npcs:P.npcsFor(x,key),pose:x.pose})};
P.npcPortrait=k=>{const ck='portrait|'+k;if(cache.has(ck))return cache.get(ck);const lk=NPC[k]||HERO[k]&&HERO[k].in;if(!lk)return'';const cv=document.createElement('canvas');cv.width=420;cv.height=560;g=cv.getContext('2d');K.setG(g);chibi(210,540,3.3,lk,'stand',-1);const u=cv.toDataURL('image/png');cache.set(ck,u);return u};
P._chibi=(ctx,x,y,s,lk,pose,face)=>{const o=g;g=ctx;chibi(x,y,s,lk,pose,face);g=o};P._hero=HERO;P._item=(ctx,it)=>{const o=K.getG();K.setG(ctx);item(it);K.setG(o)};P._scenes=SCN;

// ---------- карты для исследования (перерисованы под те же стены, точки и предметы) ----------
function drawHomeMap(){K.setSeed(hash('home'));R(0,0,100,100,'#2a231b');
g.save();g.beginPath();g.rect(X(15),Y(15),X(80),Y(78));g.clip();floor('plank',0);g.restore();
for(let i=15;i<95;i+=3){R(i,0,i+1.3,15,'#5f5850');R(i+1.3,0,i+3,15,'#57504a')}R(15,13.6,95,15,'#2a231b');R(0,0,15,100,'#3b3226');R(95,0,100,100,'#3b3226');R(0,93,100,100,'#3b3226');
item(['win',50,1,64,13]);T('ОКНО',57,17.5,17);
SH(20,20,37,41);R(20,20,37,41,'#5a3d24',OL);R(22,22,35,33,'#3a3632',OL);R(23.5,23.5,33.5,31,'#8fa3a8');GLOW(28.5,27,150,'rgba(190,215,220,.2)');T('ТЕЛЕВИЗОР',28.5,19,17);
SH(20,61,46,80);R(20,61,46,80,'#5a4a3e',OL);R(20,74,46,80,'#4a3a30',OL);R(20,61,23,80,'#4a3a30',OL);R(43,61,46,80,'#4a3a30',OL);R(24,63,32.5,73,'#6b5a4c',OL,2);R(33.5,63,42,73,'#6b5a4c',OL,2);T('ДИВАН',33,59.5,17);
SH(69,17,92,82);R(69,17,92,82,'#5a3d24',OL);for(let b=19;b<80;b+=6){R(70,b+4.6,91,b+5.4,'#3a2614');let a=70.6;while(a<90.4){const bw=.6+rnd()*1;R(a,b,a+bw,b+4.6,BOOKC[Math.floor(rnd()*6)]);a+=bw+.2}}T('СТЕЛЛАЖ',80.5,16,17);
E(50,47,X(5.5)*.95,Y(5.5)*1.55,'#8a5f3a',OL);E(50,47,X(4),Y(4)*1.5,'#d8d0b8');C(48.5,46,8,'#efe4c6',OL);C(52,48,8,'#efe4c6',OL);T('СТОЛ',50,38.5,17);
C(61,54,X(2.3)*.9,'#6b4a2c',OL);E(50,66,40,20,'#7a3a2e',OL);item(['kettle',48.6,63,51.4,67]);T('ЧАЙНИК',50,72.5,15);
R(46,91.5,58,95,'#6b4a2c',OL,3);T('СПАЛЬНЯ',52,90.5,16);R(28,91.5,40,95,'#6b4a2c',OL,3);T('КОРИДОР',34,90.5,16);
E(57,63,130,70,'rgba(122,58,46,.35)');item(['plant',89,84,93,92]);item(['rad',52,15.2,62,17.2]);}
function drawStreetMap(){K.setSeed(hash('street'));
R(0,0,100,100,'#56534d');for(let r=0;r*36<Y(34);r++);
g.save();g.beginPath();g.rect(0,Y(34),1600,Y(35));g.clip();floor('brick',34);g.restore();
R(0,68,100,70,'#8a8578',OL,2);R(0,70,100,100,'#55524c');for(let a=2;a<100;a+=8)R(a,84.5,a+4,85.5,'#d8d2c0');for(let i=0;i<12;i++)E(rnd()*100,72+rnd()*26,30+rnd()*70,6+rnd()*10,'rgba(205,203,195,.5)');
R(0,0,57,34,'#7d7a72',OL);for(let a=1;a<56;a+=3.6)for(let b=1.5;b<17;b+=5.5)R(a,b,a+2,b+3.4,rnd()<.3?'#d9c48a':'#3a3e44','#2a2a2a',1);
item(['mdoor',10,20,16,34]);T('ПОДЪЕЗД',13,19,15);
R(17,20,24,34,'#5d6e60',OL,3);R(18,24,23,33,'#9fb0b4');R(19.5,20.6,21.5,23.4,'#e8e4d8');R(20.2,21,20.8,23,'#2e7a3a');R(19.8,21.7,21.2,22.3,'#2e7a3a');T('АПТЕКА',20.5,18.6,15);
item(['arch',28,22,36,34]);T('АРКА ВО ДВОР',32,18.6,15);
R(42,20,55,34,'#6b5a48',OL,3);R(43,24,54,32,'#9fb0b4');for(let a=43.5;a<53.5;a+=1.6)R(a,29,a+1.2,32,['#c9b27a','#8a5a3a','#d8d0b8'][Math.floor(rnd()*3)]);item(['sign',43,20.4,54,23.4,'ПРОДУКТЫ']);
R(57,0,100,14,'#b3b4b0');item(['fence',57,6,86,14]);item(['fence',96,6,100,14]);item(['tree',60,0,68,13]);item(['tree',74,0,82,12]);R(86,0,96,14,'#8a8578');T('К ПЛОЩАДИ ↑',91,6,15);
item(['booth',58,16,64,31]);item(['kiosk',75,14,84,28]);item(['puddle',70,19.5,76,24.5]);
R(64,50,76,52,'#3a3a3a',OL,2);R(64.6,52,65.4,62,'#3a3a3a');R(74.6,52,75.4,62,'#3a3a3a');R(65.4,52,74.6,60,'rgba(170,190,195,.35)');item(['sign',66,52.6,73,55.2,'ОСТАНОВКА']);
item(['bench',80,60,88,66]);item(['note',50.6,56.6,53.6,59.6,null,'#cfc6aa']);
R(96,36,100,56,'#14110d');R(95,34,96,58,'#6a5a4c');T('ПЕРЕУЛОК',90,40,15);
R(0,50,3,62,'#7a2a22',OL,2);T('← МИТИНГ',8,49,15);
[[6,66],[40,66],[90,66]].forEach(p=>{R(p[0]-.3,p[1]-14,p[0]+.3,p[1],'#2e2e2e');GLOW(p[0],p[1]-14,170,'rgba(240,215,150,.22)')});
item(['car',20,74,34,84,null,'#6a5a4a']);item(['snowpile',38,64,46,68]);
g.fillStyle='rgba(240,238,232,.7)';for(let i=0;i<120;i++){g.beginPath();g.arc(rnd()*1600,rnd()*900,1+rnd()*2,0,7);g.fill()}}

// стены новой карты гостиной и улицы (добавляются к существующим препятствиям)
try{HOME_BLOCKS.push({x1:0,y1:0,x2:15,y2:100},{x1:95,y1:0,x2:100,y2:100},{x1:0,y1:0,x2:100,y2:15},{x1:0,y1:93.5,x2:100,y2:100});
STREET_BLOCKS.push({x1:58,y1:16,x2:64,y2:27},{x1:57,y1:0,x2:86,y2:13},{x1:96,y1:0,x2:100,y2:13})}catch(e){}

// ---------- подмена фона на нарисованную сцену ----------
const _ss=setScene;
setScene=function(x){_ss(x);try{applyArt(x)}catch(e){console.warn('art',e)}};
function applyArt(x){const G=$('game'),room=x.room||'ГОСТИНАЯ';G.classList.remove('artScene');
if(!x.scene&&!x.art&&(room==='КУХНЯ'||room==='КОРИДОР'))return;
if(x.explore&&x.map&&x.map!=='home')return;
let url;if(x.explore){url=P.paintScene(x.map==='home'?'map_home':'map_street');}
else{P.lastKey=P.sceneKey(x);url=P.nodeArt(x);G.classList.add('artScene','actionPhoto');G.classList.remove('interiorMap','detailPhoto','streetMap')}
if($('bg').getAttribute('src')!==url)$('bg').setAttribute('src',url);fitWorld()}
const st=document.createElement('style');st.textContent=`.game.artScene .mini{display:none!important}.game.artScene .bg{object-fit:cover!important;transform:none!important}`;document.head.appendChild(st);

})();
