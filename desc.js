(function(){
var D=window.DESC||{};
try{
var x=new XMLHttpRequest();
x.open('GET','opisaniya_kuhon.txt?v=2',false);
x.overrideMimeType('text/plain; charset=utf-8');
x.send();
if(x.status==200||x.status==0){
var t='k',name=null,cur='',mode=0;
var save=function(){
if(name&&cur){
D[t+'|'+name]=cur;
D[t+'|'+name.toLowerCase()]=cur;
}
name=null;cur='';mode=0;
};
var L=x.responseText.split(/\r?\n/);
for(var i=0;i<L.length;i++){
var s=L[i].trim(),m;
if((m=s.match(/^###\s*(.+?)\s*###$/))){
save();
t=/ГОСТИН/i.test(m[1])?'g':'k';
continue;
}
if((m=s.match(/^\[\d+\]\s+(.+)$/))){
save();
name=m[1].replace(/^(Кухня|Гостиная)\s+/i,'').trim();
continue;
}
if(!name)continue;
if(s.indexOf('Описание:')==0){
mode=1;
cur=s.slice(9).trim();
}else if(/^(Характеристики:|Фото|Страница:|-{5,})/.test(s)){
mode=0;
}else if(mode==1&&s){
cur+=' '+s;
}
}
save();
}
}catch(e){}
window.DESC=D;
})();
