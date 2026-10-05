// game6a.js — экран 16+, главное меню в стиле референса, настройки, слоты сохранений, музыка и звуки.
// Ничего не удаляет: «Новая игра» нажимает существующую кнопку #start, «Продолжить» — .contBtn / сохранение game4b.
// Этап 7: добавлены темы anxious/crisis/square, хуки P.musicHook/P.musicStage (пауза, кат-сцены, CityState), P.AUDIO, P.MUSIC.duck.
(function(){
const P=window.P7=window.P7||{};
const $=id=>document.getElementById(id);
const SET_KEY='panel7_settings',SKEY='panel7_save',SLOT='panel7_slot_';
const SET=Object.assign({music:.6,sfx:.7,full:false,lang:'ru'},(()=>{try{return JSON.parse(localStorage.getItem(SET_KEY))||{}}catch(e){return{}}})());
const saveSet=()=>{try{localStorage.setItem(SET_KEY,JSON.stringify(SET))}catch(e){}};
const T={ru:{ng:'НОВАЯ ИГРА',cont:'ПРОДОЛЖИТЬ',load:'ЗАГРУЗИТЬ',set:'НАСТРОЙКИ',exit:'ВЫХОД',mus:'Громкость музыки',sfx:'Громкость эффектов',full:'Полноэкранный режим',lang:'Язык',back:'НАЗАД',on:'ВКЛ',off:'ВЫКЛ',empty:'— пусто —',slot:'Слот',save:'СОХРАНИТЬ',bye:'Спасибо за игру. Окно можно закрыть.',warn:'Игра содержит зрелые темы, напряжённые сцены, конфликты, грубую лексику и другие элементы, рассчитанные на взрослую аудиторию. Все персонажи и события вымышлены.',sub:'зимний город · двое · одно решение за другим'},
en:{ng:'NEW GAME',cont:'CONTINUE',load:'LOAD',set:'SETTINGS',exit:'EXIT',mus:'Music volume',sfx:'Effects volume',full:'Fullscreen',lang:'Language',back:'BACK',on:'ON',off:'OFF',empty:'— empty —',slot:'Slot',save:'SAVE',bye:'Thanks for playing. You can close the window.',warn:'This game contains mature themes, tense scenes, conflict, strong language and other elements intended for an older audience. All characters and events are fictional.',sub:'winter city · two of them · one choice after another'}};
const t=k=>(T[SET.lang]||T.ru)[k];
P.SETTINGS=SET;P.t=t;P.saveSettings=saveSet;

let AC=null,musBus=null,sfxBus=null,cur=null,curName='';
function ac(){if(!AC){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;AC=new C();musBus=AC.createGain();musBus.gain.value=SET.music;musBus.connect(AC.destination);sfxBus=AC.createGain();sfxBus.gain.value=SET.sfx;sfxBus.connect(AC.destination)}if(AC.state==='suspended')AC.resume();return AC}
const THEMES={
 menu:{root:45,scale:[0,3,7,10,12,15],bpm:56,wave:'triangle',dens:.5,pad:true},
 explore:{root:50,scale:[0,2,3,7,9,12],bpm:84,wave:'triangle',dens:.6,pad:false},
 calm:{root:48,scale:[0,4,7,9,11,12],bpm:66,wave:'sine',dens:.45,pad:true},
 dialog:{root:52,scale:[0,3,5,7,10],bpm:72,wave:'sine',dens:.35,pad:true},
 tense:{root:41,scale:[0,1,3,6,7,8],bpm:118,wave:'sawtooth',dens:.8,pad:false},
 story:{root:43,scale:[0,3,7,8,10,12],bpm:60,wave:'triangle',dens:.4,pad:true},
 final:{root:47,scale:[0,4,7,11,12,16],bpm:52,wave:'sine',dens:.5,pad:true},
 anxious:{root:46,scale:[0,1,5,7,8,12],bpm:76,wave:'triangle',dens:.5,pad:true},
 crisis:{root:40,scale:[0,1,3,6,7,10],bpm:128,wave:'sawtooth',dens:.85,pad:false},
 square:{root:38,scale:[0,3,5,6,7,10,12],bpm:70,wave:'sawtooth',dens:.6,pad:true}};
const hz=m=>440*Math.pow(2,(m-69)/12);
function makeTrack(name){const a=ac();if(!a)return null;const th=THEMES[name];const g=a.createGain();g.gain.value=0;g.connect(musBus);let step=0,next=a.currentTime+.1,alive=true;const beat=60/th.bpm/2;
 function note(m,at,len,vol,wave){const o=a.createOscillator(),e=a.createGain(),f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=wave==='sawtooth'?1400:2200;o.type=wave;o.frequency.value=hz(m);e.gain.setValueAtTime(0,at);e.gain.linearRampToValueAtTime(vol,at+.02);e.gain.exponentialRampToValueAtTime(.0001,at+len);o.connect(f);f.connect(e);e.connect(g);o.start(at);o.stop(at+len+.05)}
 const seed=[...name].reduce((s,c)=>s+c.charCodeAt(0),0);let r=seed;const rnd=()=>{r=(r*9301+49297)%233280;return r/233280};
 const melody=Array.from({length:16},()=>rnd()<th.dens?th.scale[Math.floor(rnd()*th.scale.length)]:null);
 const timer=setInterval(()=>{if(!alive)return;while(next<a.currentTime+.3){const i=step%16,bar=Math.floor(step/16)%4,shift=[0,-2,3,-4][bar]*(name==='tense'?.5:1)|0;
  if(i%8===0)note(th.root-12+shift,next,beat*7,.12,'sine');
  if(th.pad&&i===0)[0,th.scale[2],th.scale[3]].forEach(s=>note(th.root+shift+s,next,beat*15,.035,'sine'));
  const m=melody[(i+bar*3)%16];if(m!==null)note(th.root+12+shift+m,next,beat*(th.pad?3:1.6),.05,th.wave);
  if((name==='tense'||name==='crisis')&&i%2===0)noise(next,.03,.03,g,6000);
  if((name==='crisis'||name==='square')&&i%4===0)note(th.root-24,next,beat*1.5,.16,'sine');
  if(name==='square'&&i%8===4)noise(next,.12,.05,g,300);
  step++;next+=beat}},90);
 return{name,g,stop(){alive=false;clearInterval(timer);try{g.disconnect()}catch(e){}}}}
function playMusic(name){if(!THEMES[name]||name===curName)return;const a=ac();if(!a)return;curName=name;const old=cur;const nt=makeTrack(name);cur=nt;const now=a.currentTime;
 if(old){old.g.gain.cancelScheduledValues(now);old.g.gain.setValueAtTime(old.g.gain.value,now);old.g.gain.linearRampToValueAtTime(0,now+1.2);setTimeout(()=>old.stop(),1400)}
 nt.g.gain.setValueAtTime(0,now);nt.g.gain.linearRampToValueAtTime(1,now+1.6)}
function duck(v){const a=AC;if(!a||!musBus)return;const n=a.currentTime;musBus.gain.cancelScheduledValues(n);musBus.gain.setValueAtTime(musBus.gain.value,n);musBus.gain.linearRampToValueAtTime(SET.music*(v==null?1:v),n+.4)}
P.MUSIC={play:playMusic,get current(){return curName},themes:Object.keys(THEMES),active:()=>cur?1:0,duck};
function noise(at,len,vol,dest,freq){const a=ac();if(!a)return;const n=Math.floor(a.sampleRate*len),b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const s=a.createBufferSource();s.buffer=b;const f=a.createBiquadFilter();f.type='bandpass';f.frequency.value=freq||1200;const e=a.createGain();e.gain.value=vol;s.connect(f);f.connect(e);e.connect(dest||sfxBus);s.start(at)}
function tone(f1,f2,len,vol,wave){const a=ac();if(!a)return;const o=a.createOscillator(),e=a.createGain(),n=a.currentTime;o.type=wave||'sine';o.frequency.setValueAtTime(f1,n);o.frequency.exponentialRampToValueAtTime(f2,n+len);e.gain.setValueAtTime(vol,n);e.gain.exponentialRampToValueAtTime(.0001,n+len);o.connect(e);e.connect(sfxBus);o.start(n);o.stop(n+len+.02)}
const SFX={ui:()=>tone(880,660,.07,.08,'square'),click:()=>tone(520,300,.09,.1,'triangle'),hover:()=>tone(1200,1100,.03,.025,'sine'),
 step:(soft)=>{const a=ac();if(a)noise(a.currentTime,.06,soft?.05:.09,null,soft?500:900)},
 snow:()=>{const a=ac();if(a)noise(a.currentTime,.09,.07,null,2600)},
 door:()=>{tone(140,70,.25,.18,'sawtooth');const a=ac();if(a)noise(a.currentTime+.05,.2,.08,null,300)},
 item:()=>{tone(660,990,.12,.08,'sine');setTimeout(()=>tone(990,1320,.1,.06,'sine'),90)},
 hit:()=>{tone(180,60,.15,.2,'square');const a=ac();if(a)noise(a.currentTime,.12,.18,null,800)},
 splash:()=>{const a=ac();if(a){noise(a.currentTime,.35,.2,null,700);noise(a.currentTime+.08,.25,.12,null,1800)}},
 phone:()=>{[0,180,360].forEach(d=>setTimeout(()=>tone(1320,1320,.12,.06,'square'),d))}};
P.SFX=SFX;
let amb=null;
function ambience(kind){const a=ac();if(!a)return;if(amb&&amb.kind===kind)return;if(amb){const o=amb;o.g.gain.linearRampToValueAtTime(0,a.currentTime+1);setTimeout(()=>{try{o.s.stop()}catch(e){}},1200);amb=null}if(!kind)return;
 const n=a.sampleRate*3,b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<n;i++){const w=Math.random()*2-1;l=kind==='city'?(l*.985+w*.015):w;d[i]=l*(kind==='city'?3:1)}
 const s=a.createBufferSource();s.buffer=b;s.loop=true;const f=a.createBiquadFilter();f.type=kind==='rain'?'highpass':'lowpass';f.frequency.value=kind==='rain'?2500:kind==='home'?200:700;const g=a.createGain();g.gain.value=0;s.connect(f);f.connect(g);g.connect(sfxBus);s.start();g.gain.linearRampToValueAtTime(kind==='home'?.03:.06,a.currentTime+1.5);amb={kind,s,g}}
P.AMBIENCE=ambience;
P.AUDIO={ac,noise,tone,get sfx(){return sfxBus},get mus(){return musBus},get amb(){return amb?amb.kind:null}};

const css=document.createElement('style');css.textContent=`
#p7gate,#p7menu{position:fixed;inset:0;z-index:9000;background:#07060a;color:#e9e4dc;font-family:Georgia,'Times New Roman',serif;display:flex;user-select:none}
#p7gate{flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:22px;opacity:1;transition:opacity .6s}
#p7gate .age{font-size:96px;font-weight:bold;letter-spacing:4px;color:#b8282e;border:4px solid #b8282e;border-radius:12px;padding:0 26px;line-height:1.2}
#p7gate p{max-width:560px;font-size:18px;line-height:1.6;color:#cfc8bd;margin:0 20px}
#p7menu canvas{position:absolute;inset:0;width:100%;height:100%}
#p7menu .logo{position:absolute;left:7%;top:9%;font-size:clamp(38px,6vw,74px);font-weight:bold;color:#f1ece4;text-shadow:3px 3px 0 #6d1418,0 0 24px rgba(184,40,46,.35);letter-spacing:2px;line-height:1}
#p7menu .logo small{display:block;font-size:15px;font-weight:normal;color:#9b9387;letter-spacing:3px;margin-top:12px;text-shadow:none;font-style:italic}
#p7menu .list{position:absolute;left:7%;bottom:12%;display:flex;flex-direction:column;gap:6px;min-width:300px}
.p7b{all:unset;cursor:pointer;font-family:Georgia,serif;font-size:22px;letter-spacing:3px;color:#cfc8bd;padding:6px 14px 6px 28px;position:relative;transition:color .18s,transform .18s,background .18s;border-radius:3px}
.p7b:before{content:'▶';position:absolute;left:6px;top:50%;transform:translateY(-50%) scale(.5);opacity:0;color:#b8282e;font-size:14px;transition:opacity .18s,transform .18s}
.p7b:hover,.p7b:focus-visible{color:#fff;transform:translateX(6px);background:linear-gradient(90deg,rgba(184,40,46,.22),transparent)}
.p7b:hover:before,.p7b:focus-visible:before{opacity:1;transform:translateY(-50%) scale(1)}
.p7b:active{transform:translateX(9px) scale(.97);color:#ff8a8f}
.p7b[disabled]{opacity:.35;pointer-events:none}
#p7menu .row{display:flex;align-items:center;justify-content:space-between;gap:18px;font-size:18px;color:#cfc8bd;padding:4px 14px 4px 28px}
#p7menu input[type=range]{accent-color:#b8282e;width:160px}
#p7menu .ver{position:absolute;right:2%;bottom:2%;font-size:12px;color:#5d574f}
#p7menu .bye{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:22px;background:#07060a}
`;document.head.appendChild(css);
const click=f=>e=>{SFX.click();f(e)};
function btn(label,f,dis){const b=document.createElement('button');b.className='p7b';b.textContent=label;if(dis)b.disabled=true;b.onmouseenter=()=>SFX.hover();b.onclick=click(f);return b}
P.p7btn=btn;
function hasSave(){try{return!!localStorage.getItem(SKEY)}catch(e){return false}}
function slotInfo(i){try{const s=JSON.parse(localStorage.getItem(SLOT+i));if(!s)return null;const n=(typeof N!=='undefined'&&N[s.id]&&(N[s.id].title||N[s.id].map))||s.id;return{s,txt:`${t('slot')} ${i} · ${String(n).slice(0,22)} · ${new Date(s.at||0).toLocaleString().slice(0,16)}`}}catch(e){return null}}
P.saveSlot=i=>{try{P.save&&P.save();const s=localStorage.getItem(SKEY);if(s){localStorage.setItem(SLOT+i,s);SFX.item();return true}}catch(e){}return false};
P.loadSlot=i=>{try{const s=localStorage.getItem(SLOT+i);if(!s)return false;localStorage.setItem(SKEY,s);hideMenu();continueGame();return true}catch(e){return false}};
function continueGame(){const c=document.querySelector('.contBtn');if(c){c.click();return}const sb=$('start');if(sb)sb.click()}
let menu=null,anim=0;
function drawBg(cv){const g=cv.getContext('2d');const W=cv.width=cv.clientWidth||960,H=cv.height=cv.clientHeight||540;const flakes=Array.from({length:70},()=>({x:Math.random()*W,y:Math.random()*H,v:.3+Math.random()*.8,r:.6+Math.random()*1.6}));
 let heroes=[];try{if(P.CHAR&&P.CHAR.body)heroes=[P.CHAR.body('kirill',false,'neutral',0),P.CHAR.body('zhenya',false,'worried',0)]}catch(e){heroes=[]}
 let tk=0;function frame(){if(!menu||!cv.isConnected)return;tk++;g.fillStyle='#07060a';g.fillRect(0,0,W,H);
  const flick=.85+.15*Math.sin(tk*.05)+(Math.random()<.02?-.3:0);const lg=g.createRadialGradient(W*.68,H*.42,20,W*.68,H*.45,H*.7);lg.addColorStop(0,`rgba(120,90,70,${.32*flick})`);lg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=lg;g.fillRect(0,0,W,H);
  g.fillStyle='#14121a';g.fillRect(W*.52,H*.12,W*.32,H*.36);g.fillStyle=`rgba(70,90,130,${.25*flick})`;g.fillRect(W*.53,H*.135,W*.145,H*.33);g.fillRect(W*.685,H*.135,W*.145,H*.33);
  g.fillStyle='#0d0b10';g.fillRect(0,H*.8,W,H*.2);
  heroes.forEach((c,i)=>{if(!c||!c.width)return;const h=H*.62,w=c.width*h/c.height,x=W*(.57+i*.14)-w/2,y=H*.83-h+Math.sin(tk*.03+i)*2;g.save();g.globalAlpha=.95;g.filter='brightness(.8) contrast(1.05)';g.drawImage(c,x,y,w,h);g.restore()});
  const v=g.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.9);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.75)');g.fillStyle=v;g.fillRect(0,0,W,H);
  g.fillStyle='rgba(230,230,240,.7)';flakes.forEach(f=>{f.y+=f.v;f.x+=Math.sin((f.y+tk)*.01)*.3;if(f.y>H){f.y=-4;f.x=Math.random()*W}g.beginPath();g.arc(f.x,f.y,f.r,0,7);g.fill()});
  anim=requestAnimationFrame(frame)}frame()}
function build(view){if(!menu)return;menu.innerHTML='';const cv=document.createElement('canvas');menu.appendChild(cv);const logo=document.createElement('div');logo.className='logo';logo.innerHTML=`ПАНЕЛЬ № 7<small>${t('sub')}</small>`;menu.appendChild(logo);const L=document.createElement('div');L.className='list';menu.appendChild(L);
 const ver=document.createElement('div');ver.className='ver';ver.textContent='v7 · 16+';menu.appendChild(ver);cancelAnimationFrame(anim);drawBg(cv);
 if(view==='main'){L.append(btn(t('ng'),()=>{hideMenu();if(P.STORY&&P.STORY.reset)P.STORY.reset();const sb=$('start');if(sb)sb.click()}),btn(t('cont'),()=>{hideMenu();continueGame()},!hasSave()),btn(t('load'),()=>build('load')),btn(t('set'),()=>build('set')),btn(t('exit'),()=>{const d=document.createElement('div');d.className='bye';d.textContent=t('bye');menu.appendChild(d);try{window.close()}catch(e){}}))}
 if(view==='load'){for(let i=1;i<=3;i++){const s=slotInfo(i);L.append(btn(s?s.txt:`${t('slot')} ${i} ${t('empty')}`,()=>P.loadSlot(i),!s))}L.append(btn(t('back'),()=>build('main')))}
 if(view==='set'){const rng=(lab,key,bus)=>{const r=document.createElement('div');r.className='row';r.innerHTML=`<span>${lab}</span>`;const i=document.createElement('input');i.type='range';i.min=0;i.max=1;i.step=.05;i.value=SET[key];i.oninput=()=>{SET[key]=+i.value;saveSet();const b=bus();if(b)b.gain.value=SET[key]};i.onchange=()=>SFX.ui();r.appendChild(i);return r};
  L.append(rng(t('mus'),'music',()=>musBus),rng(t('sfx'),'sfx',()=>sfxBus));
  L.append(btn(`${t('full')}: ${document.fullscreenElement?t('on'):t('off')}`,async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch(e){}SET.full=!!document.fullscreenElement;saveSet();setTimeout(()=>build('set'),150)}));
  L.append(btn(`${t('lang')}: ${SET.lang==='ru'?'РУССКИЙ':'ENGLISH'}`,()=>{SET.lang=SET.lang==='ru'?'en':'ru';saveSet();build('set')}),btn(t('back'),()=>build('main')))}}
function showMenu(view){if(!menu){menu=document.createElement('div');menu.id='p7menu';document.body.appendChild(menu)}menu.style.display='flex';build(view||'main');playMusic('menu');ambience(null)}
function hideMenu(){if(menu){menu.style.display='none';cancelAnimationFrame(anim)}}
P.MENU={show:showMenu,hide:hideMenu,get open(){return!!menu&&menu.style.display!=='none'}};
function gate(){const g=document.createElement('div');g.id='p7gate';g.innerHTML=`<div class="age">16+</div><p>${t('warn')}</p>`;const b=btn(t('cont'),()=>{ac();g.style.opacity=0;setTimeout(()=>{g.remove();showMenu('main')},600)});g.appendChild(b);document.body.appendChild(g);P.GATE=g}
function sceneState(){try{if(P.MENU.open||$('p7gate'))return{mus:'menu',amb:null};const ti=$('title');if(ti&&!ti.classList.contains('hidden'))return{mus:'menu',amb:null};
 if(P.musicHook){const h=P.musicHook();if(h)return h.keep?{mus:curName||'explore',amb:amb?amb.kind:null}:h}
 const x=(typeof N!=='undefined'&&N[id])||{};if(x.end)return{mus:'final',amb:null};if(P.fighting||x.tense||(P.STORY&&P.STORY.tense()))return{mus:'tense',amb:'city'};
 if(x.story||(P.STORY&&P.STORY.big()))return{mus:'story',amb:null};
 const ind=P.inApt?P.inApt(x):/home|kitchen|corridor|кварт/.test(String(x.map||id));const out=!ind&&(x.outdoor||x.map||/street|улиц/i.test(id));
 const talk=x.speaker&&x.speaker!=='narr'&&!x.map;const wet=P.STORY&&P.STORY.rain&&P.STORY.rain();
 if(P.musicStage){const sg=P.musicStage(x,ind,out,talk,wet);if(sg)return sg}
 return{mus:talk?'dialog':ind?'calm':'explore',amb:out?(wet?'rain':'city'):'home'}}catch(e){return{mus:'explore',amb:null}}}
let lastLoc='';setInterval(()=>{if(!AC)return;const s=sceneState();playMusic(s.mus);ambience(s.amb);
 try{const x=(typeof N!=='undefined'&&N[id])||{};const loc=String(x.map||'')+'|'+(typeof home!=='undefined'&&home?home.room||'':'')+'|'+id.split('_')[0];if(lastLoc&&loc.split('|')[0]+loc.split('|')[1]!==lastLoc.split('|')[0]+lastLoc.split('|')[1])SFX.door();lastLoc=loc}catch(e){}},400);
let lastStep=0;document.addEventListener('keydown',e=>{if(!AC||P.MENU.open)return;const k=e.key.toLowerCase();if(!/^(w|a|s|d|ц|ф|ы|в|arrowup|arrowdown|arrowleft|arrowright)$/.test(k))return;const now=Date.now(),gap=e.shiftKey?190:300;if(now-lastStep<gap)return;lastStep=now;let out=false;try{const x=N[id]||{};out=!(P.inApt&&P.inApt(x))}catch(_){}out?SFX.snow():SFX.step(true);try{if(typeof street!=='undefined'&&street.party==='both')setTimeout(()=>out?SFX.snow():SFX.step(true),gap/2)}catch(_){}},true);
document.addEventListener('click',e=>{if(!AC)return;const b=e.target.closest&&e.target.closest('button,.choice,.opt');if(b&&!b.classList.contains('p7b'))SFX.ui()},true);
const boot=()=>{if(!$('p7gate')&&!menu)gate()};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
document.addEventListener('keydown',e=>{const busy=P.CUT&&P.CUT.on;if(e.key==='Escape'&&e.shiftKey&&!P.MENU.open&&!busy){P.PAUSE&&P.PAUSE.on&&P.PAUSE.close();P.save&&P.save();showMenu('main')}if(e.key==='F5'){e.preventDefault();if(!busy&&P.saveSlot(1)&&P.note7)P.note7('Игра сохранена')}if(e.key==='F9'){e.preventDefault();if(!busy)P.loadSlot(1)}});
})();
