(function(){
var l=document.createElement('link');
l.rel='stylesheet';
l.href='https://fonts.googleapis.com/css2?family=Lora:wght@400;500&family=Manrope:wght@400;500;600&display=swap';
document.head.appendChild(l);
var s=document.createElement('style');
s.textContent=
"body{font-family:'Manrope',system-ui,sans-serif!important}"+
"h1,h2,h3,.nm{font-family:'Lora',Georgia,serif!important;font-weight:500!important;letter-spacing:0!important}"+
".cd .no{display:none!important}"+
"header{background:rgba(246,242,234,.95)!important;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-bottom:1px solid #e6dfd0!important;box-shadow:none!important}"+
"header a{font-family:'Manrope',sans-serif!important;font-size:15px!important;font-weight:500!important;letter-spacing:0!important;text-transform:none!important;white-space:nowrap!important}"+
"header nav{gap:26px!important}"+
"header a[href^='tel']{border:1px solid #a9803f;border-radius:999px;padding:8px 18px!important;color:#8a6428!important;font-weight:600!important}"+
"[class*='btn'],button{border-radius:999px!important;text-transform:none!important;letter-spacing:.02em!important;font-family:'Manrope',sans-serif!important}"+
".cd .sc{border-radius:14px!important}";
document.head.appendChild(s);
function clean(){
var a=document.querySelectorAll('#app *');
for(var i=0;i<a.length;i++){
var e=a[i];
if(e.children.length)continue;
var t=e.textContent.trim();
if(/^№\s*\d+$/.test(t)||(t.length<14&&/^(лист|скролл|scroll)/i.test(t)))e.style.display='none';
}
}
var app=document.getElementById('app');
if(app)new MutationObserver(clean).observe(app,{childList:true,subtree:true});
clean();
})();
