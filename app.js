/* app.js: фото из ssylki_na_foto.txt, страницы, кинопереходы, расчёт */
var $=function(s){return document.querySelector(s)};
var $$=function(s){return [].slice.call(document.querySelectorAll(s))};
var E=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var pad=function(n){return(n<10?'0':'')+n};
var TXT='ssylki_na_foto.txt',TM=[750,500];
var NAV=[['','Главная'],['c/k','Кухни'],['c/g','Гостиные'],['how','Как работаем'],['about','О нас'],['contacts','Контакты']];
var LB={what:'Планирую',lay:'Планировка',st:'Стиль',name:'Имя'};
var TONES=window.TONES||['Светлые','Тёмные','Дерево','Цветные'];
var OLD=window.MODELS||[],DESC=window.DESC||{},MODELS=[],TONE={};
var FS={k:[],g:[]},CS={i:0,a:{},done:false},CT='k',CM=null,CI=0,fr=0,busy=false,shown='',ready=false;
OLD.forEach(function(m){TONE[m.t+'|'+m.n.toLowerCase()]=m.tone});

var st=document.createElement('style');
st.textContent='.sc{background:#1d1b17}.sc::after{display:none}.sc img{transition:opacity .6s}.cd .sc{aspect-ratio:4/3}.mdl .gl{position:sticky;top:90px;align-self:start}.mdl .gl .sc{position:relative;top:0;aspect-ratio:3/2;cursor:pointer}.th{display:grid;grid-template-columns:repeat(auto-fill,minmax(72px,1fr));gap:6px;margin-top:8px}.th button{aspect-ratio:3/2;overflow:hidden;opacity:.5;border:1px solid transparent;transition:.25s}.th button.on{opacity:1;border-color:var(--br)}.th img{width:100%;height:100%;object-fit:cover}.dsc{color:#d4cdbd;margin:18px 0}@media(max-width:860px){.mdl .gl{position:relative;top:0}}';
document.head.appendChild(st);

function parseTxt(t){
 var ty='k',cur=null,out=[];
 t.split(/\r?\n/).forEach(function(s){
  s=s.trim();if(!s)return;
  if(s.indexOf('===')===0){ty=/гост/i.test(s)?'g':'k';cur=null;return}
  if(/^https?:/i.test(s)){if(cur)cur.u.push(s);return}
  cur={t:ty,n:s.replace(/^(Кухня|Гостиная)\s+/i,'').trim(),u:[]};out.push(cur);
 });
 return out.filter(function(m){return m.u.length});
}
function build(txt){
 var cnt={k:0,g:0};
 parseTxt(txt).forEach(function(r){
  cnt[r.t]++;
  MODELS.push({id:r.t+cnt[r.t],t:r.t,n:r.n,u:r.u,tone:TONE[r.t+'|'+r.n.toLowerCase()]||'Светлые',d:DESC[r.t+'|'+r.n]||''});
 });
}
function byId(id){return MODELS.filter(function(m){return m.id===id})[0]}
function ofType(t){return MODELS.filter(function(m){return m.t===t})}
function find(t,n){return ofType(t).filter(function(m){return m.n.toLowerCase()===n.toLowerCase()})[0]}
var TYPES=window.TYPES;
function full(m){return TYPES[m.t].one+' '+m.n}
function num(m){return MODELS.indexOf(m)+1}
function similar(m){
 var l=ofType(m.t),i=l.indexOf(m),r=[],k,x;
 for(k=1;k<l.length;k++){x=l[(i+k)%l.length];if(x.tone===m.tone)r.push(x)}
 for(k=1;k<l.length&&r.length<4;k++){x=l[(i+k)%l.length];if(r.indexOf(x)<0)r.push(x)}
 return r.slice(0,4);
}

function pic(m,i,eager){return '<div class="sc"><img src="'+E(m.u[i||0])+'" alt="'+E(full(m))+'"'+(eager?'':' loading="lazy"')+' decoding="async" onerror="this.style.opacity=0"></div>'}
function card(m){return '<a class="cd rv" href="#/m/'+m.id+'"><span class="no">№ '+pad(num(m))+'</span>'+pic(m)+'<div class="nm">'+E(full(m))+'</div><div class="mt">'+E(m.tone)+' · '+m.u.length+' фото</div></a>'}
function cta(){return '<section class="cta rv"><h2>Закажите расчёт стоимости</h2><p>Менеджер свяжется с вами в течение 15 минут</p><a class="btn" href="#/calc">Рассчитать стоимость</a></section>'}

function foot(){
 var l=NAV.map(function(a){return '<a href="#/'+a[0]+'">'+a[1]+'</a>'}).join('');
 return '<footer class="ft"><div class="in2"><div><a class="lg" href="#/"><b>СК</b><span>'+CFG.name+'</span></a><p style="margin-top:12px">'+BRANDS+'</p></div><div><h4>Разделы</h4>'+l+'</div><div><h4>Контакты</h4><a href="tel:'+CFG.tel+'">'+CFG.phone+'</a><a href="mailto:'+CFG.mail+'">'+CFG.mail+'</a><span>'+CFG.city+', '+CFG.addr+'</span></div></div><div class="cp">© '+CFG.name+' · '+CFG.ip+' · ИНН '+CFG.inn+' · Демонстрационная версия сайта</div></footer>';
}

function pgHome(){
 var hm=find('k','Пикарди')||MODELS[0];
 var f=['Пикарди','Арли','ANGORA','Капри','ARTIS','Симона'].map(function(n){return find('k',n)}).filter(Boolean);
 if(f.length<6)f=ofType('k').slice(0,6);
 return '<section class="hero">'+pic(hm,0,true)+'<div class="in"><div class="kick">'+CFG.city+' · '+CFG.sub+'</div><h1><span class="ln"><span>Кухни,</span></span><span class="ln"><span>в которых</span></span><span class="ln"><span>хочется жить</span></span></h1><p class="lead">Кухни и гостиные на заказ. Проект бесплатно, расчёт стоимости за 15 минут.</p><div class="btns"><a class="btn" href="#/c/k">Смотреть каталог</a><a class="btn g" href="#/calc">Расчёт стоимости</a></div></div><div class="cue">Листайте</div></section>'
 +'<section class="sec"><div class="in2"><div class="usp">'+FACTS.map(function(a){return '<div class="rv"><b>'+a[0]+'</b><span>'+a[1]+'</span></div>'}).join('')+'</div></div></section>'
 +'<section class="sec al"><div class="in2"><h2 class="rv">Два направления</h2><p class="sub rv">Выберите, с чего начать</p><div class="cats">'+['k','g'].filter(function(t){return ofType(t).length}).map(function(t){return '<a class="cat rv" href="#/c/'+t+'">'+pic(ofType(t)[0])+'<div><h3>'+TYPES[t].all+'</h3><p>'+ofType(t).length+' моделей</p></div></a>'}).join('')+'</div></div></section>'
 +'<section class="sec"><div class="in2"><h2 class="rv">Из каталога</h2><p class="sub rv">Шесть моделей на выбор. Остальные в каталоге.</p><div class="grid">'+f.map(card).join('')+'</div><div class="btns"><a class="btn g" href="#/c/k">Весь каталог</a></div></div></section>'
 +cta();
}

function pgCat(t){
 var tabs=['k','g'].map(function(x){return '<a class="chip'+(x===t?' on':'')+'" href="#/c/'+x+'">'+TYPES[x].all+' · '+ofType(x).length+'</a>'}).join('');
 return '<div class="top"><div class="kick">Каталог</div><h1>'+TYPES[t].all+'</h1></div><section class="sec"><div class="in2"><div class="flt" style="margin-bottom:26px">'+tabs+'</div><div id="cb"></div></div></section>'+cta();
}
function catBody(){
 var t=CT,F=FS[t];
 var h='<div class="fg"><small>Гамма</small><div class="flt">'+TONES.map(function(v){return '<button class="chip'+(F.indexOf(v)>-1?' on':'')+'" data-a="tf" data-v="'+E(v)+'">'+E(v)+'</button>'}).join('')+'</div></div>';
 var L=ofType(t).filter(function(m){return !F.length||F.indexOf(m.tone)>-1});
 return h+(L.length?'<div class="grid">'+L.map(card).join('')+'</div>':'<div class="emp">Нет подходящих моделей. <button class="chip" data-a="rs">Сбросить фильтр</button></div>');
}

function pgModel(m){
 CM=m;CI=0;
 var l=ofType(m.t),i=l.indexOf(m),p=l[(i+l.length-1)%l.length],n=l[(i+1)%l.length],k=m.t==='k';
 var rows=[['Раздел',TYPES[m.t].all],['Гамма',m.tone]];
 if(k){rows.push(['Проект','Бесплатно']);rows.push(['Гарантия','3 года'])}
 rows.push(['Стоимость','Рассчитаем за 15 минут']);
 var th=m.u.length>1?'<div class="th">'+m.u.map(function(u,j){return '<button class="'+(j?'':'on')+'" data-a="ph" data-i="'+j+'"><img src="'+E(u)+'" alt="" loading="lazy" decoding="async"></button>'}).join('')+'</div>':'';
 var sm=similar(m);
 return '<div class="mdl"><div class="gl" id="gl"><div id="gm" data-a="gn">'+pic(m,0,true)+'</div>'+th+'</div><div><div class="kick">Кадр '+pad(num(m))+' · '+TYPES[m.t].all+'</div><h1>'+E(full(m))+'</h1>'+(m.d?'<p class="dsc">'+E(m.d)+'</p>':'')+'<div class="spec">'+rows.map(function(r){return '<div><span>'+r[0]+'</span>'+E(r[1])+'</div>'}).join('')+'</div><div class="btns"><a class="btn" href="#/calc">Рассчитать стоимость</a><a class="btn g" href="tel:'+CFG.tel+'">Позвонить</a></div><div class="nx"><a href="#/m/'+p.id+'">← '+E(p.n)+'</a><a href="#/m/'+n.id+'">'+E(n.n)+' →</a></div></div></div>'
 +'<section class="sec al"><div class="in2"><h2 class="rv">Похожие '+(k?'кухни':'гостиные')+'</h2><p class="sub rv">Та же цветовая гамма</p><div class="grid">'+sm.map(card).join('')+'</div></div></section>'+cta();
}
function showPh(i){
 if(!CM)return;
 CI=(i+CM.u.length)%CM.u.length;
 var im=$('#gm img');if(im){im.style.opacity=1;im.src=CM.u[CI]}
 $$('.th button').forEach(function(b,j){b.classList.toggle('on',j===CI)});
}

function pgHow(){
 return '<div class="top"><div class="kick">Как работаем</div><h1>От заявки до установки</h1></div><section class="sec"><div class="in2"><div class="stp">'+STEPS.map(function(s){return '<div class="rv"><b>'+s[0]+'</b><span>'+s[1]+'</span></div>'}).join('')+'</div><p class="nt" style="margin-top:30px">'+NOTE+'</p></div></section>'+cta();
}
function pgAbout(){
 var x=FACTS.concat([['Бесплатный замер','В Санкт-Петербурге и Ленинградской области при заказе кухни'],['Своя доставка','Привезут, поднимут и установят наши специалисты'],['Договор','Прописана ответственность за задержку и недоставку']]);
 return '<div class="top"><div class="kick">О компании</div><h1>'+CFG.name+'</h1><p class="sub" style="margin-top:16px">'+(CFG.year?'Работаем с '+CFG.year+' года. ':'')+'Кухни и гостиные на заказ в Санкт-Петербурге. '+BRANDS+'</p></div><section class="sec"><div class="in2"><div class="usp">'+x.map(function(a){return '<div class="rv"><b>'+a[0]+'</b><span>'+a[1]+'</span></div>'}).join('')+'</div></div></section>'+cta();
}
function pgContacts(){
 var r=[['Адрес',CFG.city+', '+CFG.addr],['Телефон','<a href="tel:'+CFG.tel+'">'+CFG.phone+'</a>'],['Почта','<a href="mailto:'+CFG.mail+'">'+CFG.mail+'</a>']];
 if(CFG.hours)r.push(['Время работы',CFG.hours]);
 if(CFG.wa)r.push(['WhatsApp','<a href="https://wa.me/'+CFG.wa+'">Написать</a>']);
 if(CFG.tg)r.push(['Telegram','<a href="https://t.me/'+CFG.tg.replace('@','')+'">Написать</a>']);
 return '<div class="top"><div class="kick">Контакты</div><h1>Ждём вас</h1></div><section class="sec"><div class="in2 ct"><dl>'+r.map(function(a){return '<div><dt>'+a[0]+'</dt><dd>'+a[1]+'</dd></div>'}).join('')+'</dl><div><h2>Расчёт стоимости</h2><p class="sub">Оставьте номер, менеджер свяжется в течение 15 минут.</p><div class="btns"><a class="btn" href="#/calc">Заказать расчёт</a><a class="btn g" href="tel:'+CFG.tel+'">Позвонить</a></div></div></div></section>';
}

function pgCalc(){return '<div class="calc"><div class="kick">Расчёт стоимости</div><div id="cb"></div></div>'}
function stepTo(i,d){i+=d;while(CALC[i]&&CALC[i].k==='lay'&&CS.a.what==='Гостиная')i+=d;return i}
function msg(){var o=['Здравствуйте! Хочу расчёт стоимости.','Телефон: '+CS.a.tel];for(var k in LB)if(CS.a[k]&&!(k==='lay'&&CS.a.what==='Гостиная'))o.push(LB[k]+': '+CS.a[k]);return o.join('\n')}
function calcBody(){
 if(CS.done){
  var lk=CFG.wa?'https://wa.me/'+CFG.wa+'?text='+encodeURIComponent(msg()):(CFG.tg?'https://t.me/'+CFG.tg.replace('@',''):'');
  return '<div class="ok"><h2>Спасибо'+(CS.a.name?', '+E(CS.a.name):'')+'</h2><p class="sub" style="margin:0 auto 24px">Перезвоним на '+E(CS.a.tel)+' в течение 15 минут.</p>'+(lk?'<a class="btn" href="'+lk+'" target="_blank" rel="noopener">Написать в мессенджер</a> ':'')+'<a class="btn g" href="#/">На главную</a><p class="nt">Демо-версия: заявка пока никуда не отправляется. В рабочей версии она придёт в Telegram и на почту.</p></div>';
 }
 var s=CALC[CS.i],last=stepTo(CS.i,1)>=CALC.length,h='<div class="dots">'+CALC.map(function(x,i){return '<i'+(i<=CS.i?' class="on"':'')+'></i>'}).join('')+'</div><div class="q">'+s.q+'</div>';
 if(s.opts)h+='<div class="opts">'+s.opts.map(function(o){return '<button class="opt'+(CS.a[s.k]===o?' on':'')+'" data-a="o" data-v="'+E(o)+'">'+E(o)+'</button>'}).join('')+'</div>';
 else h+='<input class="f" id="inp" type="'+s.type+'" placeholder="'+s.ph+'" value="'+E(CS.a[s.k]||'')+'" autocomplete="'+(s.type==='tel'?'tel':'name')+'">';
 h+='<div class="nt" id="er" style="color:#e0a070"></div><div class="row">'+(CS.i?'<button class="btn g" data-a="bk">Назад</button>':'')+'<button class="btn" data-a="nx">'+(last?'Отправить':'Далее')+'</button></div>';
 if(last)h+='<p class="nt">Нажимая «Отправить», вы соглашаетесь на обработку персональных данных.</p>';
 return h;
}
function calcNext(){
 var s=CALC[CS.i],inp=$('#inp'),er='';
 if(inp)CS.a[s.k]=inp.value.trim();
 if(s.k==='tel'&&(CS.a.tel||'').replace(/\D/g,'').length<10)er='Введите номер полностью, с кодом';
 else if(s.opts&&!CS.a[s.k])er='Выберите вариант';
 if(er){$('#er').textContent=er;return}
 var j=stepTo(CS.i,1);
 if(j>=CALC.length)CS.done=true;else CS.i=j;
 $('#cb').innerHTML=calcBody();
}

function parse(){
 var p=location.hash.replace(/^#\/?/,'').split('/'),k=p[0],m;
 if(k==='c'){var t=p[1]==='g'?'g':'k';return{k:'c/'+t,t:TYPES[t].all,h:function(){CT=t;return pgCat(t)},b:catBody}}
 if(k==='m'&&(m=byId(p[1])))return{k:'c/'+m.t,t:full(m),h:function(){return pgModel(m)}};
 if(k==='calc')return{k:'calc',t:'Расчёт стоимости',h:function(){CS={i:0,a:{},done:false};return pgCalc()},b:calcBody};
 if(k==='how')return{k:'how',t:'Как работаем',h:pgHow};
 if(k==='about')return{k:'about',t:'О нас',h:pgAbout};
 if(k==='contacts')return{k:'contacts',t:'Контакты',h:pgContacts};
 return{k:'',t:CFG.name,h:pgHome};
}

var io=window.IntersectionObserver?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1}):null;
function reveal(){$$('.rv:not(.in)').forEach(function(el){io?io.observe(el):el.classList.add('in')})}
function closeMenu(){$('#mn').classList.remove('o');$('#hd').classList.remove('o')}

function draw(){
 var r=parse();
 $('#pg').innerHTML=r.h()+foot();
 var cb=$('#cb');if(cb&&r.b)cb.innerHTML=r.b();
 $$('[data-n]').forEach(function(a){a.classList.toggle('on',a.getAttribute('data-n')===r.k)});
 document.title=(r.k===''?CFG.name+' — кухни и гостиные':r.t+' — '+CFG.name);
 var d=document.documentElement;d.style.scrollBehavior='auto';window.scrollTo(0,0);d.style.scrollBehavior='';
 shown=location.hash;closeMenu();reveal();
}
function go(){
 if(busy)return;
 busy=true;
 var r=parse(),tr=$('#tr');
 $('#tr small').textContent='Кадр '+pad(++fr);
 $('#tr b').textContent=r.t;
 tr.classList.add('on');
 setTimeout(draw,TM[0]);
 setTimeout(function(){tr.classList.remove('on');busy=false;if(location.hash!==shown)go()},TM[0]+TM[1]);
}

function shell(){
 var nav=NAV.map(function(a){return '<a href="#/'+a[0]+'" data-n="'+a[0]+'">'+a[1]+'</a>'}).join('');
 $('#app').innerHTML='<header class="hd" id="hd"><a class="lg" href="#/"><b>СК</b><span>'+CFG.name+'</span></a><nav class="nv">'+nav+'</nav><a class="ph" href="tel:'+CFG.tel+'">'+CFG.phone+'</a><button class="bg" data-a="mn" aria-label="Меню"></button></header>'
 +'<div class="mn" id="mn">'+nav+'<p>'+CFG.city+', '+CFG.addr+'<br>'+CFG.phone+'</p></div><main id="pg"></main>'
 +'<div id="tr"><div class="tb t"></div><div class="tb b"></div><div class="tt"><small></small><b></b></div></div>'
 +'<div id="sp"><div><b>СК</b><small>'+CFG.name+'</small><u></u></div></div>';
}

document.addEventListener('click',function(e){
 if(e.target.closest('.mn a'))closeMenu();
 var t=e.target.closest('[data-a]');if(!t)return;
 var a=t.dataset.a;
 if(a==='mn'){$('#mn').classList.toggle('o');$('#hd').classList.toggle('o')}
 else if(a==='tf'){var l=FS[CT],i=l.indexOf(t.dataset.v);if(i<0)l.push(t.dataset.v);else l.splice(i,1);$('#cb').innerHTML=catBody();reveal()}
 else if(a==='rs'){FS[CT]=[];$('#cb').innerHTML=catBody();reveal()}
 else if(a==='ph')showPh(+t.dataset.i);
 else if(a==='gn')showPh(CI+1);
 else if(a==='o'){CS.a[CALC[CS.i].k]=t.dataset.v;$('#cb').innerHTML=calcBody();setTimeout(calcNext,260)}
 else if(a==='nx')calcNext();
 else if(a==='bk'){var j=stepTo(CS.i,-1);if(j>=0)CS.i=j;$('#cb').innerHTML=calcBody()}
});
document.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.id==='inp')calcNext()});
window.addEventListener('hashchange',function(){if(ready)go()});

function fail(){
 $('#sp').classList.add('h');
 $('#pg').innerHTML='<div class="top"><h1>Нет файла с фото</h1><p class="sub" style="margin-top:16px">Загрузите в репозиторий файл «'+TXT+'» (имя строго такое) и обновите страницу.</p></div>';
}

shell();
var t0=Date.now();
fetch(TXT+'?v=1').then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(t){
 build(t);
 if(!MODELS.length)throw 0;
 setTimeout(function(){draw();ready=true;$('#sp').classList.add('h')},Math.max(0,1000-(Date.now()-t0)));
}).catch(fail);
