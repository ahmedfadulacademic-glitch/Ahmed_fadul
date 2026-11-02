const $=id=>document.getElementById(id);
// name letters
$("name").innerHTML="Ahmed Fadul".split("").map((c,i)=>'<span style="animation-delay:'+(i*.05+.1)+'s">'+(c===" "?"&nbsp;":c)+'</span>').join("");
$("tk").innerHTML=Array(2).fill(["ArcGIS Pro","QGIS","Remote sensing","Spatial analysis","Site selection","Python","Surveying","SQL &amp; Oracle","Urban planning"].map(x=>"<span>"+x+"</span>").join("")).join("");
// typing
const W=["GIS Specialist","Remote Sensing Enthusiast","Surveying Engineer","Teaching Assistant"],T=$("typed"),RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
let wi=0,ci=0,del=false;
function type(){const w=W[wi];T.textContent=w.slice(0,ci);
if(!del&&ci===w.length){del=true;return setTimeout(type,1600)}
if(del&&ci===0){del=false;wi=(wi+1)%W.length}
ci+=del?-1:1;setTimeout(type,del?35:75)}
RM?T.textContent=W[0]:type();
// views
function route(){const x=location.hash.replace("#",""),m={projects:"projects","city-site-selection":"city",workspace:"workspace",requests:"requests"},p=m[x]||"home";
["home","projects","city","workspace","requests"].forEach(k=>$("v-"+k).classList.toggle("on",k===p));
$("n-home").classList.toggle("on",p==="home");$("n-projects").classList.toggle("on",p==="projects"||p==="city");$("n-workspace").classList.toggle("on",p==="workspace");$("n-requests").classList.toggle("on",p==="requests");
if(p==="requests"&&window.rqPreselect)rqPreselect();
window.scrollTo(0,0);observe()}
let io;function observe(){io&&io.disconnect();io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".view.on .rv").forEach(el=>{el.classList.remove("in");io.observe(el)})}
addEventListener("hashchange",route);route();
addEventListener("scroll",()=>{const h=document.documentElement;$("bar").style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight||1)*100)+"%"},{passive:true});
// contour canvas: living topography that bends toward the cursor
const cv=$("bg"),cx=cv.getContext("2d");let W0,H0,mx=.65,my=.4,tx=.65,ty=.4,dpr=Math.min(devicePixelRatio||1,2);
function size(){W0=innerWidth;H0=innerHeight;cv.width=W0*dpr;cv.height=H0*dpr;cx.setTransform(dpr,0,0,dpr,0,0)}
addEventListener("resize",size);size();
addEventListener("pointermove",e=>{tx=e.clientX/W0;ty=e.clientY/H0},{passive:true});
function draw(t){const cs=getComputedStyle(document.documentElement),line=cs.getPropertyValue("--line").trim(),teal=cs.getPropertyValue("--teal").trim();
mx+=(tx-mx)*.04;my+=(ty-my)*.04;cx.clearRect(0,0,W0,H0);const N=30,S=Math.max(W0,H0)/340,time=t*.00028;
for(let k=1;k<=N;k++){const r=k*15*S,ox=W0*(.62+(mx-.5)*.18)+k*2.4*(mx-.5)*6,oy=H0*(.42+(my-.5)*.18)+k*1.6*(my-.5)*6,idx=k%5===0;
cx.beginPath();for(let i=0;i<=120;i++){const a=i/120*Math.PI*2;
const w=1+.15*Math.sin(3*a+time*2+k*.07)+.09*Math.sin(5*a-time*3+k*.05)+.05*Math.sin(9*a+time*4+k*.1);
const x=ox+Math.cos(a)*r*w*1.3,y=oy+Math.sin(a)*r*w*.9;i?cx.lineTo(x,y):cx.moveTo(x,y)}
cx.closePath();cx.strokeStyle=idx?teal:line;cx.globalAlpha=idx?.75:.38;cx.lineWidth=idx?1.7:1;cx.stroke()}
cx.globalAlpha=1;if(!RM)requestAnimationFrame(draw)}
RM?draw(0):requestAnimationFrame(draw);
