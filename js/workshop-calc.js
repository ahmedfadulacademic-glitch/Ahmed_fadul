// In-browser calculators. Everything runs on the visitor's device; nothing is sent anywhere.
const num = v => { v = String(v == null ? "" : v).trim(); if (v === "") return NaN; if (v.includes("/")) { const [a, b] = v.split("/"); return parseFloat(a) / parseFloat(b); } return parseFloat(v); };
const fx = (n, d = 3) => (isFinite(n) ? n.toFixed(d) : "–");
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
const rad = d => d * Math.PI / 180, deg = r => r * 180 / Math.PI;
const norm360 = a => ((a % 360) + 360) % 360;
function dms(a) { a = norm360(a); let d = Math.floor(a), m = Math.floor((a - d) * 60), s = Math.round(((a - d) * 60 - m) * 60 * 10) / 10; if (s >= 60) { s -= 60; m++; } if (m >= 60) { m -= 60; d++; } return d + "° " + String(m).padStart(2, "0") + "′ " + fx(s, 1).padStart(4, "0") + "″"; }
const inp = (id, label, val, extra = "") => `<label>${label}<input id="${id}" value="${val}" inputmode="decimal" ${extra}></label>`;
const table = (head, rows) => `<div class="tw"><table><thead><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const val = (el, id) => el.querySelector("#" + id).value;

const CALC = {};

/* ---------- levelling: rise and fall, misclosure, adjustment ---------- */
CALC.level = el => {
  el.innerHTML = `<p class="hint">${x("One row per point: Point, BS, IS, FS (leave blanks empty). A change point has both FS and BS.", "صف لكل نقطة: النقطة، BS، IS، FS (اترك الفراغ فارغًا). نقطة التحويل فيها FS وBS معًا.")}</p>
  <label>${x("Readings (metres)", "القراءات (بالمتر)")}<textarea id="rd" rows="7">BM1,1.425,,
P1,,1.862,
TP1,1.380,,2.115
P2,,0.915,
BM2,,,1.763</textarea></label>
  <div class="row">${inp("rl0", x("RL of the first point (m)", "منسوب النقطة الأولى (م)"), "100.000")}${inp("rlk", x("Known RL of the last point (optional)", "المنسوب المعلوم للنقطة الأخيرة (اختياري)"), "98.935")}${inp("tol", x("Tolerance constant C (mm), tolerance = C·√setups", "ثابت السماحية C (مم)، السماحية = C·√عدد المحطات"), "10")}</div>
  <button class="btn p" id="go" type="button">${x("Calculate", "احسب")}</button><div id="out" class="out"></div>`;
  el.querySelector("#go").onclick = () => {
    const rows = val(el, "rd").split("\n").map(l => l.trim()).filter(Boolean).map(l => { const [p, bs, is, fs] = l.split(",").map(s => s.trim()); return {p, bs: num(bs), is: num(is), fs: num(fs)}; });
    const out = el.querySelector("#out");
    if (rows.length < 2 || isNaN(rows[0].bs)) { out.innerHTML = `<p class="bad">${x("Start with a row that has a BS, and give at least two rows.", "ابدأ بصف فيه BS وأدخل صفين على الأقل.")}</p>`; return; }
    const rl0 = num(val(el, "rl0")); let rl = [rl0], rise = [NaN], fall = [NaN], sp = [0], s = 1, prevRead = rows[0].bs;
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i], cur = !isNaN(r.is) ? r.is : r.fs;
      if (isNaN(cur)) { out.innerHTML = `<p class="bad">${x("Row", "الصف")} ${i + 1}: ${x("needs an IS or an FS.", "يحتاج إلى IS أو FS.")}</p>`; return; }
      const d = prevRead - cur; rise.push(d > 0 ? d : NaN); fall.push(d < 0 ? -d : NaN); rl.push(rl[i - 1] + d); sp.push(s);
      if (!isNaN(r.fs) && !isNaN(r.bs)) { s++; prevRead = r.bs; } else prevRead = !isNaN(r.bs) ? r.bs : cur;
    }
    const setups = s, last = rl[rl.length - 1], known = num(val(el, "rlk"));
    const mis = last - (isNaN(known) ? rl0 : known), tol = num(val(el, "tol")) * Math.sqrt(setups) / 1000;
    const adj = rl.map((v, i) => v - mis * sp[i] / setups);
    const sBS = rows.reduce((a, r) => a + (r.bs || 0), 0), sFS = rows.reduce((a, r) => a + (r.fs || 0), 0);
    const ok = Math.abs(mis) <= tol;
    out.innerHTML = table(["Point", "BS", "IS", "FS", x("Rise", "صعود"), x("Fall", "هبوط"), "RL", x("Corr.", "تصحيح"), x("Adjusted RL", "المنسوب المصحح")],
      rows.map((r, i) => [esc(r.p), fx(r.bs), fx(r.is), fx(r.fs), fx(rise[i]), fx(fall[i]), fx(rl[i]), fx(-mis * sp[i] / setups, 4), `<b>${fx(adj[i])}</b>`])) +
      `<p class="sum">ΣBS − ΣFS = ${fx(sBS - sFS)} · ${x("Last RL − first RL", "المنسوب الأخير − الأول")} = ${fx(last - rl0)} ${Math.abs((sBS - sFS) - (last - rl0)) < 1e-6 ? "✓" : "✗"}<br>
      ${x("Misclosure", "خطأ الإقفال")} = ${fx(mis * 1000, 1)} mm · ${x("Allowable", "المسموح")} = ±${fx(tol * 1000, 1)} mm · ${x("Setups", "المحطات")} = ${setups}</p>
      <p class="${ok ? "ok" : "bad"}">${ok ? x("Within tolerance. The correction is distributed over the setups.", "ضمن السماحية. وُزّع التصحيح على المحطات.") : x("Outside tolerance: re-observe before adjusting.", "خارج السماحية: يجب إعادة الرصد قبل التصحيح.")}</p>`;
  };
  el.querySelector("#go").click();
};

/* ---------- horizontal and vertical curves ---------- */
CALC.curves = el => {
  el.innerHTML = `<h4>${x("Horizontal curve", "المنحنى الأفقي")}</h4>
  <div class="row">${inp("R", x("Radius R (m)", "نصف القطر R (م)"), "200")}${inp("D", x("Deflection angle Δ (°)", "زاوية الانحراف Δ (°)"), "40")}${inp("PI", x("Chainage of PI (m)", "مسافة نقطة التقاطع PI (م)"), "1250")}${inp("iv", x("Interval (m)", "المسافة بين النقاط (م)"), "20")}</div>
  <div class="row">${inp("pe", x("PC easting (optional)", "إحداثي PC الشرقي (اختياري)"), "")}${inp("pn", x("PC northing (optional)", "إحداثي PC الشمالي (اختياري)"), "")}${inp("az", x("Azimuth of the back tangent (°)", "سمت المماس الخلفي (°)"), "90")}
  <label>${x("Turns", "الاتجاه")}<select id="dir"><option value="1">${x("Right", "يمين")}</option><option value="-1">${x("Left", "يسار")}</option></select></label></div>
  <button class="btn p" id="goh" type="button">${x("Calculate", "احسب")}</button><div id="outh" class="out"></div>
  <h4>${x("Vertical curve", "المنحنى الرأسي")}</h4>
  <div class="row">${inp("g1", x("Entry grade g1 (%)", "الميل الداخل g1 (%)"), "2")}${inp("g2", x("Exit grade g2 (%)", "الميل الخارج g2 (%)"), "-1.5")}${inp("L", x("Curve length L (m)", "طول المنحنى L (م)"), "120")}</div>
  <div class="row">${inp("vch", x("Chainage of PVI (m)", "مسافة PVI (م)"), "500")}${inp("vel", x("Elevation of PVI (m)", "منسوب PVI (م)"), "100")}${inp("viv", x("Interval (m)", "المسافة بين النقاط (م)"), "20")}</div>
  <button class="btn p" id="gov" type="button">${x("Calculate", "احسب")}</button><div id="outv" class="out"></div>`;
  el.querySelector("#goh").onclick = () => {
    const R = num(val(el, "R")), D = num(val(el, "D")), PI = num(val(el, "PI")), iv = num(val(el, "iv")), out = el.querySelector("#outh");
    if (!(R > 0 && D > 0 && D < 180 && iv > 0)) { out.innerHTML = `<p class="bad">${x("Check R, Δ (0–180°) and the interval.", "تحقق من R وΔ (0–180°) والمسافة.")}</p>`; return; }
    const d = rad(D), T = R * Math.tan(d / 2), L = R * d, LC = 2 * R * Math.sin(d / 2), E = R * (1 / Math.cos(d / 2) - 1), M = R * (1 - Math.cos(d / 2)), pc = PI - T, pt = pc + L;
    const pe = num(val(el, "pe")), pn = num(val(el, "pn")), az = rad(num(val(el, "az"))), side = +val(el, "dir"), hasXY = isFinite(pe) && isFinite(pn) && isFinite(az);
    const ch = [pc]; for (let c = Math.ceil((pc + 1e-9) / iv) * iv; c < pt - 1e-9; c += iv) ch.push(c); ch.push(pt);
    const rows = ch.map((c, i) => { const l = c - pc, dl = deg(l / (2 * R)), chord = 2 * R * Math.sin(l / (2 * R)), a = l / R, xx = R * Math.sin(a), yy = R * (1 - Math.cos(a));
      const row = [fx(c, 2) + (i === 0 ? " (PC)" : i === ch.length - 1 ? " (PT)" : ""), fx(l, 2), dms(dl), fx(chord, 3)];
      if (hasXY) row.push(fx(pe + xx * Math.sin(az) + side * yy * Math.cos(az), 3), fx(pn + xx * Math.cos(az) - side * yy * Math.sin(az), 3)); return row; });
    out.innerHTML = `<p class="sum">T = ${fx(T)} · L = ${fx(L)} · LC = ${fx(LC)} · E = ${fx(E)} · M = ${fx(M)}<br>PC = ${fx(pc, 2)} · PT = ${fx(pt, 2)}</p>` +
      table([x("Chainage", "المسافة"), x("Arc from PC", "القوس من PC"), x("Deflection", "زاوية الانحراف"), x("Chord", "الوتر")].concat(hasXY ? ["E", "N"] : []), rows);
  };
  el.querySelector("#gov").onclick = () => {
    const g1 = num(val(el, "g1")), g2 = num(val(el, "g2")), L = num(val(el, "L")), pv = num(val(el, "vch")), ev = num(val(el, "vel")), iv = num(val(el, "viv")), out = el.querySelector("#outv");
    if (!(L > 0 && iv > 0 && isFinite(g1 + g2 + pv + ev))) { out.innerHTML = `<p class="bad">${x("Check the inputs.", "تحقق من المدخلات.")}</p>`; return; }
    const bvc = pv - L / 2, evc = pv + L / 2, eb = ev - g1 * L / 200, ee = ev + g2 * L / 200, A = g2 - g1;
    const xs = [0]; for (let c = Math.ceil((bvc + 1e-9) / iv) * iv; c < evc - 1e-9; c += iv) xs.push(c - bvc); xs.push(L);
    const elev = t => eb + g1 / 100 * t + A / (200 * L) * t * t;
    const xt = A !== 0 ? -g1 * L / A : NaN, tp = xt > 0 && xt < L ? `${x(A > 0 ? "Low point" : "High point", A > 0 ? "أدنى نقطة" : "أعلى نقطة")}: ${x("chainage", "المسافة")} ${fx(bvc + xt, 2)}, ${x("elevation", "المنسوب")} ${fx(elev(xt), 3)}` : x("No high or low point on the curve.", "لا توجد نقطة عليا أو دنيا على المنحنى.");
    out.innerHTML = `<p class="sum">BVC = ${fx(bvc, 2)} (${fx(eb)}) · EVC = ${fx(evc, 2)} (${fx(ee)})<br>${tp}</p>` +
      table([x("Chainage", "المسافة"), x("Tangent elev.", "منسوب المماس"), x("Curve elev.", "منسوب المنحنى")], xs.map(t => [fx(bvc + t, 2), fx(eb + g1 / 100 * t), `<b>${fx(elev(t))}</b>`]));
  };
  el.querySelector("#goh").click(); el.querySelector("#gov").click();
};

/* ---------- setting out: angle and distance from a station ---------- */
CALC.setout = el => {
  el.innerHTML = `<div class="row">${inp("se", x("Station E", "المحطة E"), "1000")}${inp("sn", x("Station N", "المحطة N"), "1000")}${inp("be", x("Reference (backsight) E", "نقطة المرجع E"), "1000")}${inp("bn", x("Reference (backsight) N", "نقطة المرجع N"), "1100")}</div>
  <label>${x("Design points: name, E, N (one per line)", "نقاط التصميم: الاسم، E، N (نقطة في كل سطر)")}<textarea id="pts" rows="4">P1,1050,1050
P2,1080,970
P3,940,1020</textarea></label>
  <button class="btn p" id="go" type="button">${x("Calculate", "احسب")}</button><div id="out" class="out"></div>`;
  el.querySelector("#go").onclick = () => {
    const se = num(val(el, "se")), sn = num(val(el, "sn")), be = num(val(el, "be")), bn = num(val(el, "bn")), out = el.querySelector("#out");
    if (![se, sn, be, bn].every(isFinite) || (se === be && sn === bn)) { out.innerHTML = `<p class="bad">${x("Check the station and reference coordinates.", "تحقق من إحداثيات المحطة والمرجع.")}</p>`; return; }
    const az = (e, n) => norm360(deg(Math.atan2(e - se, n - sn))), azb = az(be, bn);
    const rows = val(el, "pts").split("\n").map(l => l.trim()).filter(Boolean).map(l => { const [p, e, n] = l.split(",").map(s => s.trim()); const E = num(e), N = num(n); if (!isFinite(E + N)) return [esc(p), "–", "–", "–"]; const a = az(E, N); return [esc(p), dms(a), `<b>${dms(a - azb)}</b>`, `<b>${fx(Math.hypot(E - se, N - sn))}</b>`]; });
    out.innerHTML = `<p class="sum">${x("Azimuth to the reference", "السمت إلى المرجع")} = ${dms(azb)}</p>` + table([x("Point", "النقطة"), x("Azimuth", "السمت"), x("Angle to turn from reference (clockwise)", "الزاوية من المرجع (مع عقارب الساعة)"), x("Distance (m)", "المسافة (م)")], rows);
  };
  el.querySelector("#go").click();
};

/* ---------- flight planning ---------- */
CALC.flight = el => {
  el.innerHTML = `<p class="hint">${x("Flight lines run along the length of the area. Example values are for a common 1-inch-sensor drone camera; use your own camera data.", "خطوط الطيران تمتد على طول المنطقة. القيم مثال لكاميرا طائرة مسيّرة شائعة؛ استخدم بيانات كاميرتك.")}</p>
  <div class="row">${inp("aL", x("Area length (m)", "طول المنطقة (م)"), "2000")}${inp("aW", x("Area width (m)", "عرض المنطقة (م)"), "1500")}${inp("gsd", x("Ground resolution GSD (cm)", "دقة الأرض GSD (سم)"), "3")}</div>
  <div class="row">${inp("f", x("Focal length (mm)", "البعد البؤري (مم)"), "8.8")}${inp("sw", x("Sensor width (mm)", "عرض المستشعر (مم)"), "13.2")}${inp("nx", x("Image width (pixels)", "عرض الصورة (بكسل)"), "5472")}${inp("ny", x("Image height (pixels)", "ارتفاع الصورة (بكسل)"), "3648")}</div>
  <div class="row">${inp("fo", x("Forward overlap (%)", "التراكب الأمامي (%)"), "80")}${inp("so", x("Side overlap (%)", "التراكب الجانبي (%)"), "70")}</div>
  <button class="btn p" id="go" type="button">${x("Calculate", "احسب")}</button><div id="out" class="out"></div>`;
  el.querySelector("#go").onclick = () => {
    const g = k => num(val(el, k)), L = g("aL"), W = g("aW"), gsd = g("gsd") / 100, f = g("f"), sw = g("sw"), nx = g("nx"), ny = g("ny"), fo = g("fo") / 100, so = g("so") / 100, out = el.querySelector("#out");
    if (![L, W, gsd, f, sw, nx, ny].every(v => v > 0) || !(fo >= 0 && fo < 1 && so >= 0 && so < 1)) { out.innerHTML = `<p class="bad">${x("Check the inputs.", "تحقق من المدخلات.")}</p>`; return; }
    const px = sw / nx, H = gsd * f / px, across = nx * gsd, along = ny * gsd, base = along * (1 - fo), space = across * (1 - so);
    const strips = Math.max(1, Math.ceil((W - across) / space) + 1), perStrip = Math.max(1, Math.ceil((L - along) / base) + 1) + 2;
    out.innerHTML = table([x("Result", "النتيجة"), x("Value", "القيمة")], [
      [x("Pixel size", "حجم البكسل"), fx(px * 1000, 2) + " µm"], [x("Flying height above ground", "ارتفاع الطيران فوق الأرض"), `<b>${fx(H, 1)} m</b>`],
      [x("Photo footprint (across × along)", "مساحة تغطية الصورة (عرض × طول)"), fx(across, 1) + " × " + fx(along, 1) + " m"],
      [x("Distance between flight lines", "المسافة بين خطوط الطيران"), fx(space, 1) + " m"], [x("Distance between photos", "المسافة بين الصور"), fx(base, 1) + " m"],
      [x("Flight lines", "خطوط الطيران"), `<b>${strips}</b>`], [x("Photos per line (incl. 2 extra at the ends)", "الصور في كل خط (مع صورتين إضافيتين في الطرفين)"), perStrip], [x("Total photos", "العدد الكلي للصور"), `<b>${strips * perStrip}</b>`]]) +
      `<p class="hint">${x("A planning estimate. Real flights also depend on terrain, wind, battery and regulations.", "تقدير تخطيطي. الرحلات الفعلية تتأثر أيضًا بالتضاريس والرياح والبطارية واللوائح.")}</p>`;
  };
  el.querySelector("#go").click();
};

/* ---------- AHP weights + weighted score of one location ---------- */
CALC.ahp = el => {
  const RI = {3: 0.58, 4: 0.90, 5: 1.12}, defNames = ["Water", "Slope", "Roads", "Soil", "Land use"], defCmp = {"0-1": "3", "0-2": "5", "1-2": "2", "0-3": "3", "1-3": "2", "2-3": "1", "0-4": "4", "1-4": "3", "2-4": "2", "3-4": "1"};
  const build = n => {
    let h = `<label class="inl">${x("Number of criteria", "عدد المعايير")}<select id="n">${[3, 4, 5].map(k => `<option ${k === n ? "selected" : ""}>${k}</option>`).join("")}</select></label>
    <p class="hint">${x("Compare each pair: how much more important is the first criterion than the second (1 = equal, 9 = extremely; use 1/3 for the reverse).", "قارن كل زوج: كم مرة المعيار الأول أهم من الثاني (1 = متساويان، 9 = أهمية قصوى؛ استخدم 1/3 للعكس).")}</p><div class="row">`;
    for (let i = 0; i < n; i++) h += `<label>${x("Criterion", "المعيار")} ${i + 1}<input id="c${i}" value="${x(defNames[i], ["المياه", "الميل", "الطرق", "التربة", "استخدام الأرض"][i])}"></label>`;
    h += `</div><div class="row">`;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) h += `<label>${x("C", "م")}${i + 1} ${x("vs", "مقابل")} ${x("C", "م")}${j + 1}<input id="m${i}-${j}" value="${defCmp[i + "-" + j]}"></label>`;
    h += `</div><div id="w" class="out"></div>`;
    el.innerHTML = h; el.querySelector("#n").onchange = e => build(+e.target.value); el.querySelectorAll("input").forEach(i => i.oninput = calc); calc();
    function calc() {
      const A = Array.from({length: n}, () => Array(n).fill(1)); let bad = false;
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const v = num(el.querySelector(`#m${i}-${j}`).value); if (!(v > 0)) bad = true; A[i][j] = v; A[j][i] = 1 / v; }
      const w = el.querySelector("#w"); if (bad) { w.innerHTML = `<p class="bad">${x("Enter a positive number in every comparison.", "أدخل رقمًا موجبًا في كل مقارنة.")}</p>`; return; }
      let v = Array(n).fill(1 / n); for (let k = 0; k < 200; k++) { const nv = A.map(r => r.reduce((a, c, j) => a + c * v[j], 0)); const s = nv.reduce((a, b) => a + b, 0); v = nv.map(q => q / s); }
      const lam = A.map((r, i) => r.reduce((a, c, j) => a + c * v[j], 0) / v[i]).reduce((a, b) => a + b, 0) / n, CR = (lam - n) / (n - 1) / RI[n];
      const names = Array.from({length: n}, (_, i) => esc(el.querySelector("#c" + i).value));
      w.innerHTML = table([x("Criterion", "المعيار"), x("Weight", "الوزن"), x("Score of the location (1–5)", "درجة الموقع (1–5)")], names.map((nm, i) => [nm, `<b>${fx(v[i] * 100, 1)} %</b>`, `<input class="sc" data-i="${i}" value="4" inputmode="decimal">`])) +
        `<p class="${CR < 0.1 ? "ok" : "bad"}">${x("Consistency ratio", "نسبة الاتساق")} = ${fx(CR * 100, 1)} % — ${CR < 0.1 ? x("acceptable (below 10 %)", "مقبولة (أقل من 10%)") : x("too high: revise the comparisons", "مرتفعة: راجع المقارنات")}</p><p class="sum" id="res"></p>`;
      const upd = () => { const s = [...w.querySelectorAll(".sc")].reduce((a, e) => a + v[+e.dataset.i] * num(e.value), 0), c = Math.min(5, Math.max(1, Math.round(s))); res.innerHTML = `${x("Weighted score", "الدرجة الموزونة")} = <b>${fx(s, 2)}</b> → ${x(["", "Unsuitable", "Low", "Moderate", "High", "Ideal"][c], ["", "غير ملائم", "منخفضة", "متوسطة", "عالية", "مثالية"][c])}`; };
      const res = w.querySelector("#res"); w.querySelectorAll(".sc").forEach(e => e.oninput = upd); upd();
    }
  };
  build(3);
};
