// Панель №7 — этап 4 (часть 1): единый рисованный стиль всех локаций, чибики героев и NPC, иллюстрации сцен.
// Все фоны рисуются в коде в стиле коридора (полосатые обои, плитка, таблички) — поэтому все локации выглядят одинаково.
(function(){
const P=window.P7;if(!P)return;
let g=null,seed=1;
const rnd=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
const hash=s=>{let h=7;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%2147483647;return h||1};
const X=v=>v*16,Y=v=>v*9,OL='#221c15';
const R=(x1,y1,x2,y2,f,s,lw)=>{g.fillStyle=f;g.fillRect(X(x1),Y(y1),X(x2-x1),Y(y2-y1));if(s){g.strokeStyle=s;g.lineWidth=lw||4;g.strokeRect(X(x1),Y(y1),X(x2-x1),Y(y2-y1))}};
const SH=(x1,y1,x2,y2)=>R(x1+.5,y1+1.1,x2+.5,y2+1.1,'rgba(0,0,0,.32)');
const C=(x,y,r,f,s)=>{g.fillStyle=f;g.beginPath();g.arc(X(x),Y(y),r,0,7);g.fill();if(s){g.strokeStyle=s;g.lineWidth=3;g.stroke()}};
const E=(x,y,rx,ry,f,s)=>{g.fillStyle=f;g.beginPath();g.ellipse(X(x),Y(y),rx,ry,0,0,7);g.fill();if(s){g.strokeStyle=s;g.lineWidth=3;g.stroke()}};
const LN=(x1,y1,x2,y2,c,w)=>{g.strokeStyle=c;g.lineWidth=w||3;g.beginPath();g.moveTo(X(x1),Y(y1));g.lineTo(X(x2),Y(y2));g.stroke()};
const T=(s,x,y,size)=>{size=size||19;g.font=`700 ${size}px Courier New`;g.textAlign='center';const w=g.measureText(s).width+16;g.fillStyle='rgba(20,16,10,.82)';g.fillRect(X(x)-w/2,Y(y)-size,w,size+9);g.strokeStyle='rgba(239,228,198,.25)';g.lineWidth=1;g.strokeRect(X(x)-w/2,Y(y)-size,w,size+9);g.fillStyle='#efe4c6';g.fillText(s,X(x),Y(y))};
const TX=(s,x,y,size,col,font)=>{g.font=`700 ${size}px ${font||'Courier New'}`;g.textAlign='center';g.fillStyle=col;g.fillText(s,X(x),Y(y))};
const GLOW=(x,y,r,col)=>{const gr=g.createRadialGradient(X(x),Y(y),0,X(x),Y(y),r);gr.addColorStop(0,col);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(X(x)-r,Y(y)-r,r*2,r*2)};

// ---------- стены ----------
function wall(t,hz){
if(t==='out'){const gr=g.createLinearGradient(0,0,0,Y(hz));gr.addColorStop(0,'#7f858a');gr.addColorStop(1,'#b3b4b0');g.fillStyle=gr;g.fillRect(0,0,1600,Y(hz));
for(let i=0;i<9;i++){const x=i*12-3+rnd()*4,w=8+rnd()*6,h=hz*(.35+rnd()*.35);R(x,hz-h,x+w,hz,'#6c6e6e');for(let a=x+1;a<x+w-1;a+=2.2)for(let b=hz-h+2;b<hz-1;b+=3.4)R(a,b,a+1.1,b+1.6,rnd()<.25?'#cdb980':'#555a5e')}return}
const base={stripe:'#5f5850',brick:'#6a5a4c',tile:'#c9c4b8',plaster:'#8a8273',panel:'#6b5236',concrete:'#5a5852',wallpaper:'#6a5f52'}[t]||'#5f5850';R(0,0,100,hz,base);
if(t==='stripe'){for(let i=0;i<100;i+=3){R(i,0,i+1.3,hz,'rgba(255,255,255,.06)');R(i+1.3,0,i+1.5,hz,'rgba(0,0,0,.18)')}}
else if(t==='wallpaper'){for(let i=0;i<100;i+=4)for(let j=2;j<hz;j+=6)C(i+(j%12?2:0),j,4,'rgba(230,210,170,.12)')}
else if(t==='brick'){for(let r=0;r*30<Y(hz);r++)for(let i=-1;i<20;i++){const off=r%2?40:0;g.fillStyle=['#74624f','#665545','#5e4f41'][(i+r*3)%3];g.fillRect(i*80+off,r*30,76,26)}}
else if(t==='tile'){for(let i=0;i<1600;i+=50)R(i/16,0,i/16+.08,hz*.5,'#a9a497');for(let j=0;j<Y(hz*.5);j+=50)g.fillRect(0,j,1600,2);R(0,hz*.5,100,hz,'#6e7766');R(0,hz*.5-.4,100,hz*.5+.4,'#4a5246')}
else if(t==='plaster'){R(0,hz*.5,100,hz,'#5e6a5c');R(0,hz*.5-.4,100,hz*.5+.4,'#3e463c');for(let i=0;i<14;i++)E(rnd()*100,rnd()*hz*.5,20+rnd()*40,10+rnd()*20,'rgba(60,50,40,.12)')}
else if(t==='panel'){for(let i=0;i<100;i+=5){R(i,0,i+.25,hz,'rgba(0,0,0,.28)');R(i+.25,0,i+2,hz,'rgba(255,230,180,.04)')}R(0,hz*.55,100,hz*.57,'#3a2a1a')}
else if(t==='concrete'){for(let i=0;i<100;i+=20)R(i,0,i+.3,hz,'rgba(0,0,0,.3)');R(0,hz*.5,100,hz*.5+.3,'rgba(0,0,0,.3)');for(let i=0;i<18;i++)E(rnd()*100,rnd()*hz,10+rnd()*40,6+rnd()*30,'rgba(40,36,30,.16)')}
R(0,hz-1.4,100,hz,'#2a231b')}
// ---------- полы ----------
function floor(t,hz){const y0=Y(hz),H=900-y0;
if(t==='brick'){for(let r=0;r*36<H;r++)for(let i=-1;i<20;i++){const off=r%2?45:0;g.fillStyle=['#8f8676','#a39a88','#7f776a'][(i*7+r*3)%3];g.fillRect(i*90+off,y0+r*36,86,32);g.strokeStyle='#3a342d';g.lineWidth=2;g.strokeRect(i*90+off,y0+r*36,86,32)}}
else if(t==='plank'){for(let r=0;r*34<H;r++){g.fillStyle=['#7a5a38','#86643f','#6f5133'][r%3];g.fillRect(0,y0+r*34,1600,32);for(let i=(r%2)*120;i<1600;i+=260)g.fillRect(i,y0+r*34,3,32)}}
else if(t==='check'){for(let i=0;i<41;i++)for(let j=0;j*40<H;j++){g.fillStyle=(i+j)%2?'#8c7c5f':'#b3a383';g.fillRect(i*40,y0+j*40,40,40)}}
else if(t==='tile'){for(let i=0;i<32;i++)for(let j=0;j*50<H;j++){g.fillStyle=(i+j)%2?'#b9b4a8':'#a8a397';g.fillRect(i*50,y0+j*50,49,49)}}
else if(t==='parquet'){for(let i=0;i<40;i++)for(let j=0;j*24<H;j++){g.fillStyle=(i+j)%2?'#7a5434':'#8a6440';g.fillRect(i*40+(j%2)*20,y0+j*24,38,22)}}
else if(t==='concrete'){g.fillStyle='#625f58';g.fillRect(0,y0,1600,H);for(let i=0;i<1600;i+=200)g.fillRect(i,y0,3,H);for(let i=0;i<10;i++)E(rnd()*100,hz+rnd()*(100-hz),30+rnd()*60,8+rnd()*12,'rgba(30,28,24,.25)')}
else if(t==='snow'||t==='asphalt'){g.fillStyle=t==='snow'?'#cfccc2':'#56534d';g.fillRect(0,y0,1600,H);for(let i=0;i<22;i++)E(rnd()*100,hz+rnd()*(100-hz),20+rnd()*90,5+rnd()*16,t==='snow'?'rgba(150,145,135,.35)':'rgba(205,203,195,.55)');if(t==='asphalt')for(let i=0;i<8;i++)LN(rnd()*100,hz+rnd()*(100-hz),rnd()*100,hz+rnd()*(100-hz),'rgba(20,18,15,.35)',2)}
else{g.fillStyle='#7a6f60';g.fillRect(0,y0,1600,H)}
const sh=g.createLinearGradient(0,y0,0,y0+60);sh.addColorStop(0,'rgba(0,0,0,.35)');sh.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=sh;g.fillRect(0,y0,1600,60)}


P._K={rnd,hash,X,Y,OL,R,SH,C,E,LN,T,TX,GLOW,wall,floor,setG:c=>{g=c},getG:()=>g,setSeed:s=>{seed=s}};
})();
