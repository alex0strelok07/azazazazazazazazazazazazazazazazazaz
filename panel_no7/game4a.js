(function(){'use strict';
const P=window.P7;if(!P||!P._K||!P._K.item)return;const K=P._K;let g=null;
const {rnd,hash,X,Y,OL,R,SH,C,E,LN,T,TX,GLOW,wall,floor}=K;const item=(...a)=>K.item(...a),BOOKC=K.BOOKC;
// ---------- чибики ----------
const LK=o=>Object.assign({skin:'#e8c9a6',hair:'#3a2a1e',hs:'short',top:'#6a6258',bot:'#3a3530',acc:[]},o);
const HERO={kirill:{in:LK({hs:'messy',hair:'#2a1f18',top:'#cdbb9c',bot:'#5a4636'}),out:LK({hs:'messy',hair:'#2a1f18',top:'#4e4236',bot:'#3a3028',acc:['scarf','coat']})},zhenya:{in:LK({hs:'bob',hair:'#1e1a17',top:'#e6dfd0',bot:'#6a6a6a',skin:'#efd2b4'}),out:LK({hs:'bobhat',hair:'#1e1a17',top:'#6b6f78',bot:'#3e3e44',skin:'#efd2b4',acc:['coat'],hat:'#8a3a3a'})}};
const NPC={
michalych:LK({n:'Дворник Михалыч',hair:'#8a8378',hs:'ushanka',top:'#b8682e',bot:'#3e3a34',acc:['beard','broom']}),
shura:LK({n:'Баба Шура',hs:'scarf',hair:'#9c3b2e',top:'#5a4a6a',bot:'#4a3a3a',acc:['glasses'],skin:'#e0c0a0'}),
nyura:LK({n:'Баба Нюра',hs:'scarf',hair:'#3e5a7a',top:'#6b5236',bot:'#3a3a3a',acc:['cane'],skin:'#e0c0a0'}),
carman:LK({n:'Хозяин «Москвича»',hs:'cap',hair:'#2e2e2e',top:'#3e4a3a',bot:'#2a2a2a',acc:['mustache']}),
leather:LK({n:'Тип в кожанке',hs:'bald',top:'#1e1c1a',bot:'#2a2a3a',acc:['leather','stubble']}),
chess:LK({n:'Старик-шахматист',hs:'beret',hair:'#dddad0',top:'#5a5040',acc:['beard','glasses'],hat:'#2a2a3a'}),
student:LK({n:'Студент Лёша',hs:'long',hair:'#6a4a2a',top:'#3a4e6a',bot:'#2a3a5a',acc:['glasses','books']}),
vendor:LK({n:'Торговка',hs:'scarf',hair:'#c9a227',top:'#7a3a3a',acc:['apron']}),
ushanka:LK({n:'Мужик в ушанке',hs:'ushanka',hair:'#4a3a2a',top:'#4a4a3a',acc:['beard']}),
veteran:LK({n:'Старик с орденами',hs:'cap',hair:'#555',top:'#4a4a4a',acc:['medals','mustache']}),
gena:LK({n:'Сосед Гена',hs:'short',hair:'#7a5a3a',top:'#2f5a7a',acc:['mustache']}),
manager:LK({n:'Заведующая',hs:'bun',hair:'#6a3a2a',top:'#7a6a5a',acc:['glasses']}),
kiosk:LK({n:'Киоскёрша',hs:'bun',hair:'#c98a3a',top:'#5a6a5a',acc:['apron']}),
pharm:LK({n:'Фармацевт',hs:'bun',hair:'#2a2a2a',top:'#e8e6e0',acc:['glasses']}),
seller:LK({n:'Продавщица',hs:'whitecap',hair:'#7a4a2a',top:'#e0dccf',acc:['apron']}),
stranger:LK({n:'Незнакомец',hs:'hood',hair:'#2a2a2a',top:'#3a3a3a',acc:['stubble']}),
man:LK({n:'Мужчина',hs:'short',hair:'#4a3a2a',top:'#5a4a3a',acc:['bandage']}),
police:LK({n:'Милиционер',hs:'police',hair:'#3a4a5a',top:'#4a5a6a',bot:'#2e3a46'}),
valya:LK({n:'Валентина Петровна',hs:'curly',hair:'#b0a8a0',top:'#7a4a5a',acc:['glasses'],skin:'#e0c0a0'}),
lyuda:LK({n:'Буфетчица Люда',hs:'bun',hair:'#c9a227',top:'#8a3a4a',acc:['apron']}),
tolik:LK({n:'Толик',hs:'messy',hair:'#5a4a3a',top:'#5a5a3a',acc:['stubble','rednose']}),
klava:LK({n:'Вахтёрша Клавдия Ивановна',hs:'curly',hair:'#8a6a9a',top:'#4a4a5a',acc:['glasses'],skin:'#e0c0a0'}),
irina:LK({n:'Ирина Сергеевна',hs:'long',hair:'#6a3a1a',top:'#3a5a5a',bot:'#2a2a3a'}),
nina:LK({n:'Библиотекарь Нина Павловна',hs:'bun',hair:'#9a9a9a',top:'#5a4a3a',acc:['glasses']}),
marina:LK({n:'Секретарь Марина',hs:'long',hair:'#d8b060',top:'#8a2a4a',bot:'#1e1e1e'}),
arkady:LK({n:'Аркадий Борисович',hs:'bald',top:'#3a3a5a',bot:'#2a2a3a',acc:['tie','mustache']}),
petrovich:LK({n:'Кладовщик Петрович',hs:'cap',hair:'#6a6a6a',top:'#4a5a3a',acc:['beard']}),
stepanych:LK({n:'Кочегар Степаныч',hs:'short',hair:'#3a3a3a',top:'#3a3a36',acc:['soot','mustache']}),
semyon:LK({n:'Мастер Семён Аркадьевич',hs:'bald',hair:'#cfcac0',top:'#5a6a7a',acc:['glasses','apron','beard']}),
musician:LK({n:'Музыкант Сергей',hs:'long',hair:'#1e1a17',top:'#2a2a2a',acc:['guitar']}),
roma:LK({n:'Рома-кассетник',hs:'cap',hair:'#3a2a1a',top:'#6a2a2a',bot:'#2a2a5a',acc:['stripes']}),
beggar:LK({n:'Старушка в переходе',hs:'scarf',hair:'#5a5a4a',top:'#4a4036',acc:['cane'],skin:'#d8b898'}),
accordion:LK({n:'Дядя Вася',hs:'ushanka',hair:'#5a5a5a',top:'#5a3a2a',acc:['mustache','accordion']}),
photo:LK({n:'Фотограф Феликс',hs:'beret',hair:'#3a2a1a',top:'#6a5a3a',acc:['camera','mustache'],hat:'#5a2a2a'}),
gosha:LK({n:'Гоша',hs:'ushanka',hair:'#3a3a2a',top:'#3e3a30',acc:['beard','soot']}),
kid:LK({n:'Мальчик Сева',hs:'bobhat',hair:'#6a4a2a',top:'#3a6a8a',bot:'#2a3a4a',acc:['small'],hat:'#c46a2a'}),
controller:LK({n:'Контролёр',hs:'cap',hair:'#3a3a3a',top:'#3a3a3a',acc:['badge']}),
driver:LK({n:'Водитель',hs:'cap',hair:'#2a2a2a',top:'#5a4a3a',acc:['mustache']}),
guard:LK({n:'Сторож',hs:'ushanka',hair:'#2a2a2a',top:'#2e3a2e',acc:['stubble']}),
gopnik:LK({n:'Гопник',hs:'cap',hair:'#1e1e1e',top:'#2a3a7a',bot:'#2a3a7a',acc:['stripes','stubble']}),
drunk:LK({n:'Пьяный мужик',hs:'ushanka',hair:'#4a3a2a',top:'#4a3e30',acc:['rednose','stubble']}),
teen:LK({n:'Подросток',hs:'hood',hair:'#2a2a2a',top:'#4a2a2a',bot:'#2a2a2a',acc:['small']}),
teen2:LK({n:'Подросток',hs:'cap',hair:'#2a2a2a',top:'#2a4a3a',bot:'#2a2a2a',acc:['small']}),
pick:LK({n:'Карманник',hs:'hood',hair:'#1a1a1a',top:'#2e2e34',acc:['stubble']})
};
// имя говорящего -> NPC (только те, кто физически рядом; голоса по телефону и радио не рисуются)
const SPEAK={};for(const k in NPC)SPEAK[NPC[k].n.toLowerCase()]=k;
Object.assign(SPEAK,{'дворник':'michalych','михалыч':'michalych','старушка':'shura','старик':'chess','продавец':'seller','аптекарь':'pharm','гена':'gena','студент':'student','киоскёрша':'kiosk','милиционер':'police','незнакомец':'stranger'});
const NOTPHYS=/(по телефону|радио|новост|диктор|телевизор|мама жени|голос|трубк)/i;
P.speakerNpc=x=>{if(!x)return null;if(x.npc!==undefined)return x.npc||null;const s=(x.s||'').toLowerCase().trim();if(!s||x.w==='kirill'||x.w==='zhenya'||NOTPHYS.test(s))return null;if(SPEAK[s])return SPEAK[s];for(const k in SPEAK)if(s.startsWith(k)||k.startsWith(s))return SPEAK[k];return null};
const RL={hs:['short','cap','ushanka','scarf','bald','hood','beret','long','curly','bun'],top:['#4a4a3a','#5a3a2a','#3a4a5a','#6a5a4a','#3e3e44','#5a5a4a','#4a3a4a','#6b4e30'],hair:['#2a2a2a','#5a4a3a','#8a8378','#3a2a1e','#a08060']};
function randLook(){const p=a=>a[Math.floor(rnd()*a.length)];return LK({hs:p(RL.hs),top:p(RL.top),hair:p(RL.hair),bot:'#2e2e2e',acc:rnd()<.3?['beard']:rnd()<.3?['glasses']:[]})}

function chibi(x,y,s,lk,pose,face){pose=pose||'stand';face=face||1;g.save();g.translate(x,y);
const sm=lk.acc.includes('small')?.82:1;g.scale(s*face*sm,s*sm);g.lineJoin='round';
const rr=(a,b,w,h,f,r)=>{g.fillStyle=f;g.strokeStyle=OL;g.lineWidth=3;g.beginPath();g.roundRect(a,b,w,h,r||4);g.fill();g.stroke()};
const ci=(a,b,r,f,st)=>{g.fillStyle=f;g.beginPath();g.arc(a,b,r,0,7);g.fill();if(st!==false){g.strokeStyle=OL;g.lineWidth=3;g.stroke()}};
g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(0,0,pose==='lie'?60:30,8,0,0,7);g.fill();
if(pose==='lie'){g.translate(0,-18);g.rotate(-Math.PI/2)}else if(pose==='fall'){g.translate(-10,-6);g.rotate(-1.25)}else if(pose==='fight')g.rotate(-.08);else if(pose==='scared')g.rotate(.06);
const sit=pose==='sit';
if(sit){rr(-18,-36,16,14,lk.bot);rr(2,-36,16,14,lk.bot);rr(-18,-24,14,22,lk.bot);rr(4,-24,14,22,lk.bot)}else if(pose==='fight'){rr(-22,-32,12,32,lk.bot);rr(8,-30,12,30,lk.bot)}else{rr(-14,-32,12,32,lk.bot);rr(2,-32,12,32,lk.bot)}
rr(sit?-20:(pose==='fight'?-26:-17),-6,16,8,'#231d18',3);rr(sit?4:(pose==='fight'?6:1),-6,16,8,'#231d18',3);
const coat=lk.acc.includes('coat');rr(-21,-74,42,coat?52:46,lk.top,11);
if(lk.acc.includes('apron'))rr(-14,-60,28,34,'#e8e2d2',4);
if(lk.acc.includes('stripes')){g.strokeStyle='#e8e4d8';g.lineWidth=3;g.beginPath();g.moveTo(-19,-70);g.lineTo(-19,-30);g.moveTo(19,-70);g.lineTo(19,-30);g.stroke()}
if(lk.acc.includes('leather')){g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=2;g.beginPath();g.moveTo(0,-72);g.lineTo(0,-28);g.moveTo(-12,-66);g.lineTo(-6,-50);g.stroke()}
if(lk.acc.includes('tie')){g.fillStyle='#8a2a2a';g.beginPath();g.moveTo(0,-72);g.lineTo(-4,-60);g.lineTo(0,-44);g.lineTo(4,-60);g.fill()}
if(lk.acc.includes('medals'))[[-10,-60,'#c9a227'],[-3,-60,'#a02a1a'],[-10,-52,'#c9a227']].forEach(m=>ci(m[0],m[1],3.5,m[2]));
if(lk.acc.includes('badge'))rr(6,-64,10,7,'#c9a227',2);
if(lk.acc.includes('scarf'))rr(-18,-78,36,10,'#8a3a2e',5);
const skin=lk.skin;
if(pose==='fight'){rr(16,-70,34,12,lk.top,6);ci(54,-64,8,skin);rr(-34,-86,12,30,lk.top,6);ci(-28,-88,8,skin)}
else if(pose==='hug'||pose==='reach'){rr(16,-68,30,11,lk.top,6);ci(48,-63,7,skin);rr(-28,-70,10,30,lk.top,5);ci(-23,-38,6,skin)}
else if(pose==='scared'){rr(-34,-90,10,28,lk.top,5);rr(24,-90,10,28,lk.top,5);ci(-29,-92,7,skin);ci(29,-92,7,skin)}
else{rr(-29,-70,10,32,lk.top,5);rr(19,-70,10,32,lk.top,5);ci(-24,-36,6,skin);ci(24,-36,6,skin)}
if(lk.acc.includes('broom')){g.strokeStyle='#6b4a2c';g.lineWidth=5;g.beginPath();g.moveTo(26,-100);g.lineTo(30,-4);g.stroke();g.fillStyle='#a08040';g.beginPath();g.moveTo(22,-10);g.lineTo(38,-10);g.lineTo(42,4);g.lineTo(18,4);g.fill()}
if(lk.acc.includes('cane')){g.strokeStyle='#3a2614';g.lineWidth=4;g.beginPath();g.moveTo(-26,-38);g.lineTo(-30,0);g.stroke()}
if(lk.acc.includes('books'))rr(18,-46,14,18,'#6b3a2a',2);
if(lk.acc.includes('guitar')){g.fillStyle='#8a5a2a';g.strokeStyle=OL;g.lineWidth=3;g.beginPath();g.ellipse(4,-40,18,13,-.5,0,7);g.fill();g.stroke();g.beginPath();g.moveTo(14,-48);g.lineTo(40,-76);g.stroke()}
if(lk.acc.includes('accordion'))rr(-22,-56,44,22,'#7a2a22',3);
if(lk.acc.includes('camera'))rr(-10,-62,20,13,'#1e1e1e',3);
ci(0,-102,30,skin);
const H=lk.hair,hat=lk.hat||H;g.fillStyle=H;g.strokeStyle=OL;g.lineWidth=3;
const cap=(f,a,b)=>{g.fillStyle=f;g.beginPath();g.arc(0,-104,a||32,Math.PI*1.02,Math.PI*1.98);g.closePath();g.fill();g.stroke()};
switch(lk.hs){
case'messy':cap(H,32);for(let i=-3;i<=3;i++){g.beginPath();g.moveTo(i*9-6,-118);g.lineTo(i*9,-140+Math.abs(i)*3);g.lineTo(i*9+6,-118);g.fill()}g.fillRect(-28,-112,56,10);break;
case'bob':case'bobhat':cap(H,33);g.fillStyle=H;g.beginPath();g.roundRect(-33,-110,14,40,6);g.fill();g.stroke();g.beginPath();g.roundRect(19,-110,14,40,6);g.fill();g.stroke();g.fillRect(-26,-114,52,9);if(lk.hs==='bobhat'){cap(hat,34);ci(0,-138,7,hat)}break;
case'long':cap(H,33);g.beginPath();g.roundRect(-34,-110,13,52,6);g.fill();g.stroke();g.beginPath();g.roundRect(21,-110,13,52,6);g.fill();g.stroke();break;
case'short':cap(H,31);g.fillRect(-26,-112,52,7);break;
case'bald':g.fillStyle=H;g.beginPath();g.arc(-28,-100,6,0,7);g.arc(28,-100,6,0,7);g.fill();g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.ellipse(-8,-124,9,4,-.3,0,7);g.fill();break;
case'cap':cap(H,31);cap(lk.top==='#2a3a7a'?'#1e1e1e':'#3a3a3a',33);g.fillStyle='#2a2a2a';g.fillRect(face>0?0:-40,-110,40,6);break;
case'police':cap('#3a4a5a',34);g.fillStyle='#2a2a2a';g.fillRect(-32,-112,64,7);ci(0,-122,5,'#c9a227');break;
case'ushanka':cap('#5a4a3a',36);g.fillStyle='#6a5a48';g.beginPath();g.roundRect(-38,-110,14,30,6);g.fill();g.stroke();g.beginPath();g.roundRect(24,-110,14,30,6);g.fill();g.stroke();g.fillStyle='#7a6a58';g.fillRect(-34,-116,68,9);break;
case'scarf':g.fillStyle=H;g.beginPath();g.moveTo(-36,-80);g.arc(0,-104,35,Math.PI*.85,Math.PI*2.15);g.lineTo(36,-80);g.closePath();g.fill();g.stroke();ci(0,-74,7,H);g.fillStyle=skin;g.beginPath();g.ellipse(0,-96,22,22,0,0,7);g.fill();break;
case'beret':cap(H,30);g.fillStyle=hat;g.beginPath();g.ellipse(-4,-130,30,10,-.15,0,7);g.fill();g.stroke();break;
case'bun':cap(H,32);ci(0,-138,12,H);break;
case'curly':for(let i=0;i<9;i++)ci(-28+i*7,-122+Math.abs(i-4)*3,9,H,false);break;
case'hood':g.fillStyle=lk.top;g.beginPath();g.arc(0,-102,38,Math.PI*.8,Math.PI*2.2);g.closePath();g.fill();g.stroke();g.fillStyle=skin;g.beginPath();g.ellipse(0,-98,24,24,0,0,7);g.fill();break;
case'whitecap':cap(H,31);cap('#efeae0',30);break;}
const ey=lk.hs==='scarf'||lk.hs==='hood'?-96:-100;
if(pose==='lie'){g.strokeStyle=OL;g.lineWidth=3;g.beginPath();g.moveTo(-14,ey);g.lineTo(-6,ey);g.moveTo(6,ey);g.lineTo(14,ey);g.stroke()}
else if(pose==='fall'){g.strokeStyle=OL;g.lineWidth=3;[-10,10].forEach(a=>{g.beginPath();g.moveTo(a-4,ey-4);g.lineTo(a+4,ey+4);g.moveTo(a+4,ey-4);g.lineTo(a-4,ey+4);g.stroke()})}
else{ci(-10,ey,4,OL,false);ci(10,ey,4,OL,false);ci(-9,ey-1.5,1.4,'#fff',false);ci(11,ey-1.5,1.4,'#fff',false);
if(pose==='fight'){g.strokeStyle=OL;g.lineWidth=3;g.beginPath();g.moveTo(-16,ey-9);g.lineTo(-5,ey-5);g.moveTo(16,ey-9);g.lineTo(5,ey-5);g.stroke()}}
g.strokeStyle=OL;g.lineWidth=2.5;g.beginPath();if(pose==='scared'||pose==='fall')g.arc(0,ey+16,4,0,7);else if(pose==='fight'){g.moveTo(-6,ey+15);g.lineTo(6,ey+13)}else g.arc(0,ey+11,5,.2,Math.PI-.2);g.stroke();
ci(-17,ey+8,4.5,'rgba(220,120,110,.35)',false);ci(17,ey+8,4.5,'rgba(220,120,110,.35)',false);
if(lk.acc.includes('glasses')){g.strokeStyle=OL;g.lineWidth=2;g.beginPath();g.arc(-10,ey,7,0,7);g.moveTo(17,ey);g.arc(10,ey,7,0,7);g.moveTo(-3,ey);g.lineTo(3,ey);g.stroke()}
if(lk.acc.includes('beard')){g.fillStyle=lk.hair==='#dddad0'||lk.hs==='ushanka'?'#c8c2b4':H;g.beginPath();g.moveTo(-24,ey+4);g.quadraticCurveTo(0,ey+40,24,ey+4);g.quadraticCurveTo(0,ey+20,-24,ey+4);g.fill()}
if(lk.acc.includes('mustache')){g.fillStyle='#4a3a2a';g.beginPath();g.ellipse(-5,ey+8,7,3,.2,0,7);g.ellipse(5,ey+8,7,3,-.2,0,7);g.fill()}
if(lk.acc.includes('stubble')){g.fillStyle='rgba(40,30,20,.25)';g.beginPath();g.ellipse(0,ey+16,16,9,0,0,7);g.fill()}
if(lk.acc.includes('rednose'))ci(0,ey+6,4,'#c0584a',false);
if(lk.acc.includes('soot')){g.fillStyle='rgba(30,30,30,.3)';g.beginPath();g.ellipse(12,ey+10,7,4,0,0,7);g.fill()}
if(lk.acc.includes('bandage')){g.fillStyle='#efe9dc';g.fillRect(-26,ey-20,52,8)}
g.restore()}


K.LK=LK;K.HERO=HERO;K.NPC=NPC;K.randLook=randLook;K.chibi=(ctx,x,y,s,lk,p,f)=>{const o=g;g=ctx;try{chibi(x,y,s,lk,p,f)}finally{g=o}};
})();
