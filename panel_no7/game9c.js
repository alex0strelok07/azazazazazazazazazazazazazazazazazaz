// Панель №7 — этап 9 (часть 3): журнал заданий «АКТИВНЫЕ / ВЫПОЛНЕННЫЕ / ПРОВАЛЕННЫЕ»
// и отдельная кнопка «Задания», которая никогда не накладывается на «Инвентарь».
(function(){'use strict';
const P=window.P7;if(!P||!P.Q9)return;const Z=P.Q9;
const css=`.p8qbtn{display:none!important}
#p9qbtn{position:fixed;z-index:31;border:1px solid #7d6c45;background:#111411;color:#d8cfb6;padding:9px 12px;font:700 12px 'Courier New',monospace;cursor:pointer;white-space:nowrap;box-sizing:border-box}
#p9qbtn:hover{background:#d6b865;color:#111}#p9qbtn.new::after{content:' ●';color:#d6b865}#p9qbtn:hover.new::after{color:#111}
#p9j{position:fixed;inset:0;z-index:90;display:none;background:rgba(0,0,0,.55);font-family:'Courier New',monospace;color:#eee8d9}
#p9j.on{display:flex;align-items:center;justify-content:center}
#p9j .bx{width:min(760px,94vw);max-height:88vh;display:flex;flex-direction:column;background:rgba(14,16,20,.96);border:1px solid #7d6c45;box-shadow:0 10px 40px rgba(0,0,0,.6)}
#p9j .hd{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #3a3426}
#p9j .hd b{font:700 16px Georgia,serif;color:#d6b865;letter-spacing:.08em}#p9j .cal{font-size:12px;color:#8fb0a0}
#p9j .x{background:none;border:1px solid #7d6c45;color:#d8cfb6;cursor:pointer;font:700 12px 'Courier New';padding:4px 9px}
#p9j .tb{display:flex;gap:6px;padding:10px 16px;flex-wrap:wrap}
#p9j .tb button{flex:1;min-width:120px;background:#111411;border:1px solid #3a3426;color:#a89c80;padding:7px;font:700 12px 'Courier New';cursor:pointer}
#p9j .tb button.on{border-color:#d6b865;color:#d6b865}
#p9j .ls{overflow:auto;padding:4px 16px 16px}
#p9j h4{margin:14px 0 6px;font:700 12px 'Courier New';color:#7d6c45;letter-spacing:.15em;border-bottom:1px dashed #3a3426;padding-bottom:4px}
#p9j .q{border-left:3px solid #7d6c45;padding:8px 10px;margin:8px 0;background:rgba(255,255,255,.03)}
#p9j .q.main{border-color:#d6b865}#p9j .q .n{font:700 15px Georgia,serif;color:#eee8d9}
#p9j .q .d{font-size:12px;color:#c9bfa6;margin:4px 0 6px;line-height:1.4}
#p9j .q .r{font-size:12px;margin:2px 0}#p9j .q .r i{font-style:normal;color:#8fb0a0}
#p9j .q .pg{font-weight:700;color:#d6b865;margin:6px 0 3px;font-size:12px}
#p9j .q .s{font-size:12px;margin:1px 0;color:#a89c80}#p9j .q .s.ok{color:#8fb0a0}#p9j .q .s.now{color:#eee8d9;font-weight:700}
#p9j .q .tm{font-size:11px;color:#d6b865;margin-top:4px}
#p9j .em{font-size:12px;color:#6f6650;padding:6px 0}`;
const stl=document.createElement('style');stl.textContent=css;document.head.appendChild(stl);
const esc=s=>String(s==null?'':s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'})[c]);
const val=v=>{try{return typeof v==='function'?v():v}catch(e){return ''}};
const hm=m=>{try{return Z.hm(m)}catch(e){return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')}};
function calText(){const t=Z.T();try{const c=Z.cal&&Z.cal();if(typeof c==='string')return c;if(c&&typeof c==='object'){const s=c.text||c.label||[c.dayLabel,c.date,c.wd].filter(Boolean).join(' · ');if(s)return s}}catch(e){}
 let d='';try{d=val(Z.date&&Z.date(t.day))}catch(e){}return 'ДЕНЬ '+t.day+(d&&typeof d==='string'?' · '+d:'')+' · '+hm(t.min)}
// ---------- кнопка ----------
const btn=document.createElement('button');btn.id='p9qbtn';btn.type='button';btn.textContent='Задания (J)';btn.title='Журнал заданий';
btn.addEventListener('click',e=>{e.stopPropagation();toggle()});document.body.appendChild(btn);
const vis=el=>{if(!el||el===btn||btn.contains(el)||el.closest('#p9j'))return null;const r=el.getBoundingClientRect();if(r.width<4||r.height<4)return null;const cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden'||+cs.opacity===0)return null;return r};
function invEl(){const all=document.querySelectorAll('button,[role=button],div,span,a');for(const el of all){if(el.children.length>2)continue;const tx=(el.textContent||'').trim();if(tx.length>40)continue;if(/инвентар|inventory/i.test(tx)||/inv/i.test(el.id||'')){const r=vis(el);if(r&&r.width<400&&r.height<140)return el}}return null}
function hudRects(){const out=[];document.querySelectorAll('button,[role=button],[id*=Btn],[class*=btn]').forEach(el=>{const r=vis(el);if(!r||r.width>420||r.height>160)return;let p=el,fx=false;while(p&&p!==document.body){const ps=getComputedStyle(p).position;if(ps==='fixed'||ps==='absolute'){fx=true;break}p=p.parentElement}if(fx)out.push(r)});const inv=invEl();if(inv)out.push(inv.getBoundingClientRect());return out}
const hit=(a,b,m)=>!(a.r+m<=b.left||a.l-m>=b.right||a.b+m<=b.top||a.t-m>=b.bottom);
let lastPos='';
function place(){const W=innerWidth,H=innerHeight,bw=btn.offsetWidth||110,bh=btn.offsetHeight||34,mob=W<700;const rs=hudRects(),inv=invEl(),ir=inv&&inv.getBoundingClientRect();
 const C=[];const st=mob?10:16,step=bh+12;
 for(let y=st;y<H-bh-8;y+=step)C.push([W-bw-(mob?10:16),y]);
 for(let y=st;y<H-bh-8;y+=step)C.push([mob?10:16,y]);
 for(let x=(mob?10:16);x<W-bw;x+=bw+12)C.push([x,H-bh-(mob?10:16)]);
 let pick=null;for(const [x,y] of C){const a={l:x,t:y,r:x+bw,b:y+bh};if(rs.some(b=>hit(a,b,12)))continue;if(ir&&hit(a,ir,18))continue;pick=[x,y];break}
 if(!pick)pick=[W-bw-16,H-bh-16];const k=pick.join(',');if(k!==lastPos){lastPos=k;btn.style.left=pick[0]+'px';btn.style.top=pick[1]+'px';btn.style.right='auto';btn.style.bottom='auto'}}
addEventListener('resize',()=>{lastPos='';place()});setInterval(place,1200);setTimeout(place,50);
// ---------- журнал ----------
const ov=document.createElement('div');ov.id='p9j';ov.innerHTML='<div class="bx"><div class="hd"><div><b>ЖУРНАЛ ЗАДАНИЙ</b><div class="cal"></div></div><button class="x" type="button">ЗАКРЫТЬ ✕</button></div><div class="tb"><button data-t="a" class="on">АКТИВНЫЕ</button><button data-t="d">ВЫПОЛНЕННЫЕ</button><button data-t="f">ПРОВАЛЕННЫЕ</button></div><div class="ls"></div></div>';
document.body.appendChild(ov);let tab='a',open=false,sig='';
ov.addEventListener('click',e=>{if(e.target===ov)close()});ov.querySelector('.x').onclick=close;
ov.querySelectorAll('.tb button').forEach(b=>b.onclick=()=>{tab=b.dataset.t;ov.querySelectorAll('.tb button').forEach(x=>x.classList.toggle('on',x===b));sig='';draw()});
function list(s){const q=Z.Q().st||{};return Z.QS.filter(o=>q[o.id]&&q[o.id].s===s)}
function card(o){const S=Z.Q().st[o.id]||{},main=o.k==='main',steps=o.s||[],k=Math.min(S.k||0,steps.length);let h='<div class="q'+(main?' main':'')+'"><div class="n">'+esc(val(o.n))+'</div>';
 const d=val(o.d);if(d)h+='<div class="d">'+esc(d)+'</div>';
 if(S.s==='a'){h+='<div class="r"><i>Куда идти:</i> '+esc(val(o.w)||'—')+'</div><div class="r"><i>С кем поговорить:</i> '+esc(val(o.p)||'—')+'</div><div class="r"><i>Цель:</i> '+esc(val(o.g)||'—')+'</div>';
  const cs=steps[k];if(cs)h+='<div class="r"><i>Текущий этап:</i> '+esc(val(cs.t))+'</div>';
  h+='<div class="pg">Прогресс: '+k+'/'+steps.length+'</div>';
  steps.forEach((sp,i)=>{h+='<div class="s'+(i<k?' ok':i===k?' now':'')+'">'+(i<k?'☑ ':'☐ ')+esc(val(sp.t))+'</div>'});
  if(cs&&cs.tm)h+='<div class="tm">⏰ Время: '+hm(cs.tm[0])+'–'+hm(cs.tm[1])+'</div>';
  if(cs&&cs.need&&/^t:\d+$/.test(cs.need))h+='<div class="tm">⏰ Не раньше '+hm(+cs.need.slice(2))+'</div>';
  if(o.dl)h+='<div class="tm">⌛ Успеть до '+hm(o.dl)+'</div>';
  if(o.e==='keep'&&o.to&&o.to<90)h+='<div class="tm">📅 Можно выполнить до дня '+o.to+'</div>'}
 else{h+='<div class="pg">Прогресс: '+(S.s==='d'?steps.length:k)+'/'+steps.length+'</div>';steps.forEach((sp,i)=>{const ok=S.s==='d'||i<k;h+='<div class="s'+(ok?' ok':'')+'">'+(ok?'☑ ':'☐ ')+esc(val(sp.t))+'</div>'});
  h+='<div class="tm">'+(S.s==='d'?'✔ Выполнено':'✖ Провалено')+(S.end?' — день '+S.end:'')+(S.at?', '+esc(S.at):'')+(S.why?' · '+esc(S.why):'')+'</div>'}
 return h+'</div>'}
function draw(){if(!open)return;const t=Z.T(),arr=list(tab),q=Z.Q();const s=tab+'|'+t.day+'|'+t.min+'|'+JSON.stringify(q.st||{});if(s===sig)return;sig=s;
 ov.querySelector('.cal').textContent=calText()+(q.fin&&q.fin.name?' · ФИНАЛ «'+q.fin.name+'»':'');
 const tabs=ov.querySelectorAll('.tb button');tabs[0].textContent='АКТИВНЫЕ ('+list('a').length+')';tabs[1].textContent='ВЫПОЛНЕННЫЕ ('+list('d').length+')';tabs[2].textContent='ПРОВАЛЕННЫЕ ('+list('f').length+')';
 let h='';[['main','ОСНОВНЫЕ'],['side','ДОПОЛНИТЕЛЬНЫЕ']].forEach(([k,l])=>{let a=arr.filter(o=>(o.k==='main')===(k==='main'));if(tab!=='a')a=a.slice().sort((x,y)=>((q.st[y.id]||{}).end||0)-((q.st[x.id]||{}).end||0));h+='<h4>'+l+'</h4>'+(a.length?a.map(card).join(''):'<div class="em">'+(tab==='a'?(k==='main'?'Основных заданий сейчас нет. Можно лечь спать.':'Дополнительных заданий сейчас нет.'):'Пока пусто.')+'</div>')});
 ov.querySelector('.ls').innerHTML=h}
function show(){open=true;P._p9j=1;P._p8j=1;ov.classList.add('on');sig='';draw();btn.classList.remove('new');seen=actSig()}
function close(){if(!open)return;open=false;P._p9j=0;P._p8j=0;ov.classList.remove('on')}
function toggle(){open?close():show()}
// новые задания — точка на кнопке
const actSig=()=>list('a').map(o=>o.id+':'+((Z.Q().st[o.id]||{}).k||0)).join(',');let seen=actSig();
setInterval(()=>{try{if(open)draw();else if(actSig()!==seen)btn.classList.add('new')}catch(e){}},500);
addEventListener('keydown',e=>{const tg=e.target;if(tg&&(tg.tagName==='INPUT'||tg.tagName==='TEXTAREA'))return;
 if((e.code==='KeyJ'||e.code==='KeyP')&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();e.stopImmediatePropagation();toggle();return}
 if(open&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close()}},true);
if(P.JOURNAL){P.JOURNAL._old8={open:P.JOURNAL.open,close:P.JOURNAL.close};P.JOURNAL.open=show;P.JOURNAL.close=close;P.JOURNAL.draw=()=>{sig='';draw()}}
P.J9={open:show,close,toggle,place,btn,isOpen:()=>open};
})();
