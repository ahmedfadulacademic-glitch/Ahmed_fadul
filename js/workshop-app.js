// My Workshop: cards, detail pages, request form, language switch.
const PORTFOLIO_URL = "index.html";
const FORM_KEY = "78dcbeaf-8f33-42e9-bc57-9137eafbff6a";  // free key from web3forms.com (see README). Empty: the form opens the visitor's email app.
const MY_EMAIL = "ahmedfadulacademic@gmail.com";

let lang = "en";
try { lang = localStorage.getItem("ws-lang") || "en"; } catch (e) {}
const x = (en, ar) => lang === "ar" ? ar : en;
const L = o => o[lang];
const app = document.getElementById("app");

const DIAGRAMS = {
level: `<svg viewBox="0 0 600 230" role="img" aria-label="Levelling with a level between two staffs"><g class="dg">
<path class="g" d="M20 190 L580 170" fill="none"/>
<rect class="g f" x="116" y="70" width="8" height="116"/><rect class="g f" x="476" y="82" width="8" height="92"/>
<line class="m" x1="124" y1="100" x2="476" y2="100" stroke-dasharray="6 5"/>
<rect class="g f" x="288" y="92" width="24" height="18" rx="3"/><path class="g" d="M300 110 L280 182 M300 110 L320 182 M300 110 L300 184" fill="none"/>
<path class="a" d="M142 102 V184 M142 102 l-4 8 M142 102 l4 8 M142 184 l-4 -8 M142 184 l4 -8" fill="none"/>
<path class="a" d="M458 102 V172 M458 102 l-4 8 M458 102 l4 8 M458 172 l-4 -8 M458 172 l4 -8" fill="none"/>
<text class="t" x="150" y="148">BS</text><text class="t" x="426" y="142">FS</text>
<text class="t s" x="120" y="212" text-anchor="middle">A (RL known)</text><text class="t s" x="480" y="212" text-anchor="middle">B (RL wanted)</text>
<text class="t" x="300" y="50" text-anchor="middle">RL B = RL A + BS − FS</text><text class="t s" x="300" y="82" text-anchor="middle">line of sight</text></g></svg>`,
curve: `<svg viewBox="0 0 600 260" role="img" aria-label="Horizontal curve elements"><g class="dg">
<path class="g" d="M128 133 L300 34 L472 133" fill="none"/><path class="a" d="M215 83 A170 170 0 0 1 385 83" fill="none" stroke-width="3"/>
<path class="g" d="M300 230 L215 83 M300 230 L385 83" fill="none" stroke-dasharray="5 5"/>
<circle class="f2" cx="215" cy="83" r="4"/><circle class="f2" cx="385" cy="83" r="4"/><circle class="f2" cx="300" cy="34" r="4"/><circle class="f2" cx="300" cy="230" r="3"/>
<text class="t" x="186" y="76">PC</text><text class="t" x="392" y="76">PT</text><text class="t" x="290" y="24">PI</text><text class="t s" x="308" y="246">O</text>
<text class="t" x="244" y="170">R</text><text class="t" x="340" y="170">R</text><text class="t" x="296" y="205">Δ</text><text class="t s" x="240" y="48">T</text><text class="t s" x="354" y="48">T</text><text class="t s" x="296" y="82">L</text></g></svg>`,
flight: `<svg viewBox="0 0 600 230" role="img" aria-label="Flight lines and photo overlap"><g class="dg">
<rect class="g" x="70" y="30" width="460" height="150" fill="none" stroke-dasharray="5 4"/>
<g class="fp"><rect x="90" y="22" width="90" height="56"/><rect x="140" y="22" width="90" height="56"/><rect x="190" y="22" width="90" height="56"/><rect x="240" y="22" width="90" height="56"/>
<rect x="90" y="55" width="90" height="56"/><rect x="140" y="55" width="90" height="56"/><rect x="190" y="55" width="90" height="56"/><rect x="240" y="55" width="90" height="56"/></g>
<path class="a" d="M80 50 H520 M520 83 H80 M80 116 H520 M520 149 H80" fill="none"/><path class="a" d="M514 46 l8 4 l-8 4 M86 79 l-8 4 l8 4 M514 112 l8 4 l-8 4 M86 145 l-8 4 l8 4" fill="none"/>
<text class="t s" x="340" y="46">forward overlap along the line</text><text class="t s" x="340" y="72">side overlap between lines</text><text class="t" x="300" y="206" text-anchor="middle">flight lines (strips) over the area</text></g></svg>`,
setout: `<svg viewBox="0 0 600 240" role="img" aria-label="Setting out from a station"><g class="dg">
<path class="g" d="M140 190 L140 40" fill="none"/><path class="a" d="M140 190 L440 80" fill="none" stroke-width="2.5"/><path class="m" d="M140 130 A60 60 0 0 1 196.3 169.4" fill="none" stroke-width="2.5"/>
<path class="g" d="M60 70 V30 M60 30 l-5 9 M60 30 l5 9" fill="none"/>
<circle class="f2" cx="140" cy="190" r="5"/><circle class="f2" cx="140" cy="40" r="4"/><circle class="f2" cx="440" cy="80" r="5"/>
<text class="t" x="54" y="86">N</text><text class="t" x="152" y="208">S (station)</text><text class="t" x="152" y="42">R (reference)</text><text class="t" x="448" y="76">P (design point)</text>
<text class="t s" x="204" y="150">β</text><text class="t s" x="280" y="124">d</text><text class="t s" x="300" y="226" text-anchor="middle">β = angle to turn from R · d = horizontal distance</text></g></svg>`
};

function setLang(l) { lang = l; try { localStorage.setItem("ws-lang", l); } catch (e) {} render(); }
function chrome() {
  document.documentElement.lang = lang; document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.getElementById("home").textContent = x("← Portfolio", "→ الملف الشخصي"); document.getElementById("home").href = PORTFOLIO_URL;
  document.getElementById("lg").textContent = lang === "ar" ? "English" : "العربية";
  document.getElementById("ft").innerHTML = "© 2026 Ahmed Fadul · " + x("Madinah, Saudi Arabia", "المدينة المنورة، المملكة العربية السعودية") + ` · <a href="mailto:${MY_EMAIL}">${MY_EMAIL}</a>`;
  document.title = x("My Workshop — Ahmed Fadul", "ورشة عملي — أحمد فضل");
}

function grid() {
  const cards = g => SV.filter(s => s.g === g).map(s => {
    const n = SV.indexOf(s) + 1, tag = s.calc ? `<span class="tag t1">${x("Try it here", "جرّب هنا")}</span>` : "";
    return `<a class="card" href="#s-${s.id}"><span class="no">${String(n).padStart(2, "0")}</span><b>${L(s).t}</b><span class="sd">${L(s).s}</span><span class="ct">${tag}${s.lvl ? `<span class="tag t2">${x("Foundations", "أساسيات")}</span>` : ""}${s.g === "built" ? `<span class="tag t3">${x("Built by me", "من صنعي")}</span>` : ""}<i>${x("Open", "افتح")} ${lang === "ar" ? "←" : "→"}</i></span></a>`;
  }).join("");
  app.innerHTML = `<section class="hero"><p class="kick">${x("What I can do, shown properly", "ما أستطيع فعله، مشروحًا بوضوح")}</p><h1>${x("My Workshop", "ورشة عملي")}</h1>
  <p class="lead">${x("Choose a service to see what it is, how I do it and the workflow behind it. Some services have a calculator that runs right here in your browser, so you can test the method with your own numbers.", "اختر خدمة لترى ما هي وكيف أنفذها وسير العمل خلفها. وبعض الخدمات فيها حاسبة تعمل هنا في متصفحك، لتجرّب الطريقة بأرقامك أنت.")}</p></section>` +
    Object.keys(GROUPS).map(g => `<h2 class="gh">${L(GROUPS[g])}</h2><div class="cards">${cards(g)}</div>`).join("");
}

function detail(s) {
  const d = L(s), idx = SV.indexOf(s);
  const tools = s.tools.length ? `<h3>${x("Tools", "الأدوات")}</h3><div class="tg">${s.tools.map(t => `<span class="tgi ${t[2]}">${x(t[0], t[1])}</span>`).join("")}</div>` : "";
  const wf = `<div class="wf">${d.st.map((t, i) => `<div class="node"><span class="n">${i + 1}</span><p>${t}</p></div>`).join("")}</div>`;
  const dg = DIAGRAMS[s.diagram] ? `<figure class="fig">${DIAGRAMS[s.diagram]}</figure>` : "";
  app.innerHTML = `<a class="back" href="#">${lang === "ar" ? "→" : "←"} ${x("All services", "كل الخدمات")}</a>
  <article class="dt"><p class="kick">${String(idx + 1).padStart(2, "0")} · ${L(GROUPS[s.g])}${s.lvl ? " · " + x("Foundations", "أساسيات") : ""}</p><h1>${d.t}</h1>
  <h3>${x("What it is", "ما هي")}</h3><p class="what">${d.w}</p>${tools}
  <h3>${x("How I do it", "كيف أنفذها")}</h3><ol class="steps">${d.st.map(t => `<li>${t}</li>`).join("")}</ol>
  <h3>${x("Workflow", "سير العمل")}</h3>${wf}${dg}
  ${s.calc ? `<section class="calc"><h3>${x("Try it here", "جرّبها هنا")}</h3><p class="hint">${x("This runs in your browser. Nothing you type is sent anywhere.", "تعمل هذه الحاسبة في متصفحك. لا يُرسل شيء مما تكتبه.")}</p><div id="calc"></div></section>` : ""}
  <section class="req"><h3>${x("Need this done?", "تحتاج هذه الخدمة؟")}</h3>
  <button class="btn p" id="rb" type="button">${x("Request this service", "اطلب مني هذه الخدمة")}</button>
  <form id="rf" hidden novalidate><label>${x("Your name", "اسمك")}<input name="name" required autocomplete="name"></label>
  <label>${x("Organisation / company", "الجهة / الشركة")} <small>(${x("optional", "اختياري")})</small><input name="org" autocomplete="organization"></label>
  <label>${x("Describe the work", "وصف العمل")}<textarea name="details" rows="5" required placeholder="${x("What is the job, where, how big, and when do you need it?", "ما العمل؟ وأين؟ وما حجمه؟ ومتى تحتاجه؟")}"></textarea></label>
  <input type="text" name="botcheck" tabindex="-1" autocomplete="off" style="display:none">
  <button class="btn p" type="submit">${x("Send request", "إرسال الطلب")}</button><p id="rm" class="rm" role="status" aria-live="polite"></p></form></section></article>`;
  if (s.calc) CALC[s.calc](document.getElementById("calc"));
  const rf = document.getElementById("rf"), rb = document.getElementById("rb");
  rb.onclick = () => { rf.hidden = false; rb.hidden = true; rf.querySelector("input").focus(); };
  rf.onsubmit = async e => {
    e.preventDefault(); const f = Object.fromEntries(new FormData(rf).entries()), m = document.getElementById("rm");
    if (f.botcheck) return;
    if (!f.name.trim() || !f.details.trim()) { m.className = "rm bad"; m.textContent = x("Please enter your name and describe the work.", "اكتب اسمك ووصف العمل."); return; }
    const subject = "Workshop request: " + s.en.t, body = `Service: ${s.en.t}\nName: ${f.name}\nOrganisation: ${f.org || "-"}\n\n${f.details}`;
    m.className = "rm"; m.textContent = x("Sending...", "جارٍ الإرسال...");
    if (FORM_KEY) {
      try {
        const r = await fetch("https://api.web3forms.com/submit", {method: "POST", headers: {"Content-Type": "application/json", "Accept": "application/json"}, body: JSON.stringify({access_key: FORM_KEY, subject, name: f.name, organisation: f.org || "-", service: s.en.t, message: f.details})});
        if ((await r.json()).success) { m.className = "rm ok"; m.textContent = x("Thank you. Your request was sent and I will reply by email.", "شكرًا. أُرسل طلبك وسأردّ عليك بالبريد الإلكتروني."); rf.reset(); return; }
      } catch (err) {}
    }
    m.textContent = x("Your email app should open with the request ready to send. If it does not, write to ", "سيفتح برنامج البريد والطلب جاهز للإرسال. وإن لم يفتح فراسلني على ") + MY_EMAIL;
    location.href = "mailto:" + MY_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  };
}

function render() {
  chrome(); const m = location.hash.replace("#", "").match(/^s-(.+)$/), s = m && SV.find(v => v.id === m[1]);
  s ? detail(s) : grid(); window.scrollTo(0, 0);
}
document.getElementById("lg").onclick = () => setLang(lang === "ar" ? "en" : "ar");
addEventListener("hashchange", render); render();
