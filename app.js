/* app.js: страницы, кинопереходы, фильтры, расчёт */
var $=function(s){return document.querySelector(s)};
var $$=function(s){return [].slice.call(document.querySelectorAll(s))};
var E=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var pad=function(n){return(n<10?'0':'')+n};
var TM=[750,500];
var NAV=[['','Главная'],['c/k','Кухни'],['c/g','Гостиные'],['how','Как работаем'],['about','О нас'],['contacts','Контакты']];
var LB={what:'Планирую',lay:'Планировка',st:'Стиль',name:'Имя'};
var FS={k:{m:[],s:[]},g:{m:[],s:[]}},CS={i:0,a:{},done:false},CT='k',fr=0,busy=false,shown='';

function byId(id){return MODELS.filter(function(m){return m.id===id})[0]}
function ofType(t){return MODELS.filter(function(m){return m.t===t})}
function full(m){return TYPES[m.t].one+' '+m.n}
function num(m){return MODELS.indexOf(m)+1}

function sc(m){var c=m.c;return '<div class="sc" style="--a:'+c[0]+';--b:'+c[1]+';--c:'+c[2]+';--d:'+c[3]+'"><i></i><i></i><i></i><i></i><img src="img/'+m.id+'.jpg" alt="'+(m.t?E(full(m)):'')+'" loading="lazy" onerror="this.remove()"></div>'}
function card(m){return '<a class="cd rv" href="#/m/'+m.id+'"><span class="no">№ '+pad(num(m))+'</span>'+sc(m)+'<div class="nm">'+E(full(m))+'</div><div class="mt">'+E(m.m.join(' · '))+'</div></a>'}
function cta(){return '<section class="cta rv"><h2>Закажите расчёт стоимости</h2><p>Менеджер свяжется с вами в течение 15 минут</p><a class="btn" href="#/calc">Рассчитать стоимость</a></section>'}

function foot(){
 var l=NAV.map(function(a){return '<a href="#/'+a[0]+'">'+a[1]+'</a>'}).join('');
 return '<footer class="ft"><div class="in2"><div><a class="lg" href="#/"><b>СК</b><span>'+CFG.name+'</span></a><p style="margin-top:12px">'+BRANDS+'</p></div><div><h4>Разделы</h4>'+l+'</div><div><h4>Контакты</h4><a href="tel:'+CFG.tel+'">'+CFG.phone+'</a><a href="mailto:'+CFG.mail+'">'+CFG.mail+'</a><span>'+CFG.city+', '+CFG.addr+'</span></div></div><div class="cp">© '+CFG.name+' · '+CFG.ip+' · ИНН '+CFG.inn+' · Демонстрационная версия сайта</div></footer>';
}

function pgHome(){
 var f=['picardi','arli','angora','capri','artis','simona'].map(byId);
 return '<section class="hero">'+sc({id:'hero',c:MODELS[0].c})+'<div class="in"><div class="kick">'+CFG.city+' · '+CFG.sub+'</div><h1><span class="ln"><span>Кухни,</span></span><span class="ln"><span>в которых</span></span><span class="ln"><span>хочется жить</span></span></h1><p class="lead">Кухни и гостиные на заказ. Проект бесплатно, расчёт стоимости за 15 минут.</p><div class="btns"><a class="btn" href="#/c/k">Смотреть каталог</a><a class="btn g" href="#/calc">Расчёт стоимости</a></div></div><div class="cue">Листайте</div></section>'
 +'<section class="sec"><div class="in2"><div class="usp">'+FACTS.map(function(a){return '<div class="rv"><b>'+a[0]+'</b><span>'+a[1]+'</span></div>'}).join('')+'</div></div></section>'
 +'<section class="sec al"><div class="in2"><h2 class="rv">Два направления</h2><p class="sub rv">Выберите, с чего начать</p><div class="cats">'+['k','g'].map(function(t){return '<a class="cat rv" href="#/c/'+t+'">'+sc(ofType(t)[0])+'<div><h3>'+TYPES[t].all+'</h3><p>'+TYPES[t].d+'</p></div></a>'}).join('')+'</div></div></section>'
 +'<section class="sec"><div class="in2"><h2 class="rv">Из каталога</h2><p class="sub rv">Шесть моделей на выбор. Остальные в каталоге.</p><div class="grid">'+f.map(function(m){return card(m)}).join('')+'</div><div class="btns"><a class="btn g" href="#/c/k">Весь каталог</a></div></div></section>'
 +cta();
}

function pgCat(t){
 var tabs=['k','g'].map(function(x){return '<a class="chip'+(x===t?' on':'')+'" href="#/c/'+x+'">'+TYPES[x].all+'</a>'}).join('');
 return '<div class="top"><div class="kick">Каталог</div><h1>'+TYPES[t].all+'</h1></div><section class="sec"><div class="in2"><div class="flt" style="margin-bottom:26px">'+tabs+'</div><div id="cb"></div></div></section>'+cta();
}
function catBody(){
 var t=CT,F=FS[t],h='';
 [['m','Материал'],['s','Стиль']].forEach(function(g){
  var A=FILT[t][g[0]];if(!A.length)return;
  h+='<div class="fg"><small>'+g[1]+'</small><div class="flt">'+A.map(function(v){return '<button class="chip'+(F[g[0]].indexOf(v)>-1?' on':'')+'" data-a="tf" data-g="'+g[0]+'" data-v="'+E(v)+'">'+E(v)+'</button>'}).join('')+'</div></div>';
 });
 var L=ofType(t).filter(function(m){return(!F.m.length||m.m.some(function(x){return F.m.indexOf(x)>-1}))&&(!F.s.length||F.s.indexOf(m.st)>-1)});
 return h+(L.length?'<div class="grid">'+L.map(function(m){return card(m)}).join('')+'</div>':'<div class="emp">Нет подходящих моделей. <button class="chip" data-a="rs">Сбросить фильтры</button></div>');
}

function pgModel(m){
 var l=ofType(m.t),i=l.indexOf(m),p=l[(i+l.length-1)%l.length],n=l[(i+1)%l.length],k=m.t==='k';
 var rows=[['Каталог',TYPES[m.t].all]];
 if(m.st)rows.push(['Стиль',m.st]);
 rows.push(['Материалы',m.m.join(', ')]);
 if(k){rows.push(['Проект','Бесплатно']);rows.push(['Гарантия','3 года'])}
 rows.push(['Стоимость','Рассчитаем за 15 минут']);
 return '<div class="mdl">'+sc(m)+'<div><div class="kick">Кадр '+pad(num(m))+' · '+TYPES[m.t].all+'</div><h1>'+E(full(m))+'</h1><div class="spec">'+rows.map(function(r){return '<div><span>'+r[0]+'</span>'+E(r[1])+'</div>'}).join('')+'</div><div class="btns"><a class="btn" href="#/calc">Рассчитать стоимость</a><a class="btn g" href="tel:'+CFG.tel+'">Позвонить</a></div><div class="nx"><a href="#/m/'+p.id+'">← '+E(p.n)+'</a><a href="#/m/'+n.id+'">'+E(n.n)+' →</a></div></div></div>';
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

var io=window.IntersectionObserver?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12}):null;
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
 else if(a==='tf'){var l=FS[CT][t.dataset.g],i=l.indexOf(t.dataset.v);if(i<0)l.push(t.dataset.v);else l.splice(i,1);$('#cb').innerHTML=catBody();reveal()}
 else if(a==='rs'){FS[CT]={m:[],s:[]};$('#cb').innerHTML=catBody();reveal()}
 else if(a==='o'){CS.a[CALC[CS.i].k]=t.dataset.v;$('#cb').innerHTML=calcBody();setTimeout(calcNext,260)}
 else if(a==='nx')calcNext();
 else if(a==='bk'){var j=stepTo(CS.i,-1);if(j>=0)CS.i=j;$('#cb').innerHTML=calcBody()}
});
document.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.id==='inp')calcNext()});

shell();
setTimeout(draw,1000);
setTimeout(function(){$('#sp').classList.add('h')},1300);
window.addEventListener('hashchange',function(){if(shown!==''||$('#pg').innerHTML)go()});
