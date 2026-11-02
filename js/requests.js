// Requests page: choose a service, describe the job (or ask for a small trial), send it to my email.
// To receive requests as emails without opening the visitor's mail app, create a free access key at
// https://web3forms.com (enter my email there) and paste it below. With no key, the form opens the visitor's email app instead.
const FORM_KEY = "";
const MY_EMAIL = "ahmedfadulacademic@gmail.com";

(function(){
  const sel = document.getElementById("rq-service"), f = document.getElementById("rq-form"), out = document.getElementById("rq-msg");
  sel.innerHTML = '<option value="">Choose a service</option>' + WS.map(g => '<optgroup label="' + g.g + '">' +
    g.items.map(i => '<option value="' + i.id + '">' + i.t + '</option>').join('') + '</optgroup>').join('') + '<option value="other">Something else</option>';
  window.rqPreselect = () => { if (window.wsPick) { sel.value = window.wsPick; window.wsPick = null; } };
  const label = v => { const o = sel.querySelector('option[value="' + v + '"]'); return o ? o.textContent : v; };
  f.addEventListener("submit", async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f).entries());
    if (d.botcheck) return;
    const type = d.type === "trial" ? "Small practical test first" : "Project / quote";
    const subject = "Portfolio request: " + label(d.service);
    const body = "Service: " + label(d.service) + "\nType: " + type + "\nName: " + d.name + "\nEmail: " + d.email + "\n\n" + d.details;
    out.className = "rqm"; out.textContent = "Sending...";
    if (FORM_KEY) {
      try {
        const r = await fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ access_key: FORM_KEY, subject, name: d.name, email: d.email, service: label(d.service), type, message: d.details }) });
        const j = await r.json();
        if (j.success) { out.className = "rqm ok"; out.textContent = "Thank you. Your request was sent and I will reply by email."; f.reset(); return; }
      } catch (err) {}
    }
    out.className = "rqm"; out.textContent = "Your email app should open with the request ready to send. If it does not, write to " + MY_EMAIL + ".";
    location.href = "mailto:" + MY_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });
})();
