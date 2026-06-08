/* ============================================================
   AHMET TRANSFER — Main script
   • Edit business details in CONFIG below.
   • i18n: elements use data-i18n / data-i18n-ph / data-i18n-html
   ============================================================ */

/* ---- 1) EDIT YOUR BUSINESS DETAILS HERE ---- */
const CONFIG = {
  phoneDisplay: "0539 606 6576",
  phoneIntl:    "+905396066576",   // for tel: links
  whatsapp:     "905396066576",    // for wa.me (no +, no spaces)
  email:        "ahmettransfer@hotmail.com",
  brand:        "Ahmet Transfer",
  defaultLang:  "en"               // en | tr | no | de | ru
};

const FLAGS = { en:"🇬🇧", tr:"🇹🇷", no:"🇳🇴", de:"🇩🇪", ru:"🇷🇺" };

/* ---- 2) i18n engine ---- */
const I18N = window.I18N || {};
function t(key, lang){
  const l = lang || currentLang();
  return (I18N[l] && I18N[l][key]) || (I18N.en && I18N.en[key]) || key;
}
function currentLang(){
  return localStorage.getItem("at_lang") || CONFIG.defaultLang;
}
function applyI18n(lang){
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    el.textContent = t(el.getAttribute("data-i18n"), lang);
  });
  document.querySelectorAll("[data-i18n-html]").forEach(el=>{
    el.innerHTML = t(el.getAttribute("data-i18n-html"), lang);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el=>{
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph"), lang));
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(el=>{
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"), lang));
  });
  // reflect in switcher
  const cur = document.querySelector("[data-lang-current]");
  if(cur){ cur.textContent = FLAGS[lang] + " " + lang.toUpperCase(); }
  document.querySelectorAll("[data-set-lang]").forEach(b=>{
    b.classList.toggle("active", b.getAttribute("data-set-lang")===lang);
  });
}
function setLang(lang){
  localStorage.setItem("at_lang", lang);
  applyI18n(lang);
}

/* ---- 3) Build language menu ---- */
function buildLangMenu(){
  const menu = document.querySelector("[data-lang-menu]");
  if(!menu) return;
  const langs = ["en","tr","no","de","ru"];
  menu.innerHTML = langs.map(l=>
    `<button data-set-lang="${l}"><span class="lang__flag">${FLAGS[l]}</span>${(I18N[l]&&I18N[l]["lang.name"])||l.toUpperCase()}</button>`
  ).join("");
  menu.querySelectorAll("[data-set-lang]").forEach(b=>{
    b.addEventListener("click",()=>{
      setLang(b.getAttribute("data-set-lang"));
      document.querySelector(".lang")?.classList.remove("open");
    });
  });
}

/* ---- 4) WhatsApp / call / email link wiring ---- */
function wireContactLinks(){
  const wa = "https://wa.me/" + CONFIG.whatsapp;
  document.querySelectorAll("[data-wa]").forEach(a=>{ a.href = wa; });
  document.querySelectorAll("[data-tel]").forEach(a=>{ a.href = "tel:"+CONFIG.phoneIntl; });
  document.querySelectorAll("[data-mail]").forEach(a=>{ a.href = "mailto:"+CONFIG.email; });
  document.querySelectorAll("[data-phone-text]").forEach(el=>{ el.textContent = CONFIG.phoneDisplay; });
  document.querySelectorAll("[data-mail-text]").forEach(el=>{ el.textContent = CONFIG.email; });
}

/* ---- 5) Header scroll, burger, lang dropdown ---- */
function wireChrome(){
  const header = document.querySelector(".site-header");
  const onScroll = ()=> header && header.classList.toggle("is-scrolled", window.scrollY>20);
  onScroll(); window.addEventListener("scroll", onScroll, {passive:true});

  const burger = document.querySelector(".burger");
  const mnav = document.querySelector(".mobile-nav");
  burger && burger.addEventListener("click", ()=>{
    const open = mnav.classList.toggle("open");
    burger.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  mnav && mnav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
    mnav.classList.remove("open"); burger?.classList.remove("is-open"); document.body.style.overflow="";
  }));

  const lang = document.querySelector(".lang");
  const langBtn = document.querySelector(".lang__btn");
  langBtn && langBtn.addEventListener("click", e=>{ e.stopPropagation(); lang.classList.toggle("open"); });
  document.addEventListener("click", ()=> lang && lang.classList.remove("open"));
}

/* ---- 6) FAQ accordion ---- */
function wireFaq(){
  document.querySelectorAll(".faq__item").forEach(item=>{
    const q = item.querySelector(".faq__q");
    const a = item.querySelector(".faq__a");
    q && q.addEventListener("click", ()=>{
      const open = item.classList.toggle("open");
      a.style.maxHeight = open ? a.scrollHeight + "px" : 0;
    });
  });
}

/* ---- 7) Reveal on scroll (bulletproof: never leaves content hidden) ---- */
function wireReveal(){
  const els = [...document.querySelectorAll(".reveal")];
  if(!els.length) return;
  const reveal = ()=>{
    const vh = window.innerHeight || document.documentElement.clientHeight;
    els.forEach(e=>{
      if(e.dataset.shown) return;
      const r = e.getBoundingClientRect();
      if(r.top < vh*0.94 && r.bottom > 0){
        e.dataset.shown = "1";
        // double rAF so the browser registers the start frame and the transition actually runs
        requestAnimationFrame(()=>requestAnimationFrame(()=>e.classList.add("in")));
      }
    });
  };
  reveal();
  window.addEventListener("scroll", ()=>requestAnimationFrame(reveal), {passive:true});
  window.addEventListener("resize", reveal);
  // GUARANTEED fallback — force every element visible with inline styles (beats any
  // stuck/never-completing transition). Content is never left at opacity:0.
  const force = ()=>els.forEach(e=>{
    e.classList.add("in");
    e.style.transition = "none";
    e.style.opacity = "1";
    e.style.transform = "none";
  });
  setTimeout(force, 1400);
  window.addEventListener("load", ()=>setTimeout(force, 1400));
}

/* ---- 8) Booking / quote forms → WhatsApp ---- */
function buildMessage(form){
  const L = currentLang();
  const g = name => { const el = form.querySelector(`[name="${name}"]`); return el ? el.value.trim() : ""; };
  const lines = [];
  lines.push(`🚖 ${CONFIG.brand} — ${L==="tr"?"Rezervasyon talebi":"Booking request"}`);
  const map = [
    ["service", t("qb.service",L)], ["from", t("qb.from",L)], ["to", t("qb.to",L)],
    ["date", t("qb.date",L)], ["time", t("book.time",L)], ["pax", t("qb.pax",L)],
    ["flight", t("book.flight",L)], ["name", t("book.name",L)], ["phone", t("book.phone",L)],
    ["email", t("book.email",L)], ["return", t("book.return",L)], ["notes", t("book.notes",L)]
  ];
  map.forEach(([n,label])=>{
    const v = g(n);
    if(v) lines.push(`• ${label}: ${v}`);
  });
  return encodeURIComponent(lines.join("\n"));
}
function wireForms(){
  document.querySelectorAll("[data-wa-form]").forEach(form=>{
    form.addEventListener("submit", e=>{
      e.preventDefault();
      const msg = buildMessage(form);
      window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`, "_blank");
    });
  });
}

/* ---- 9) Footer year ---- */
function wireYear(){
  document.querySelectorAll("[data-year]").forEach(el=> el.textContent = new Date().getFullYear());
}

/* ---- init ---- */
document.addEventListener("DOMContentLoaded", ()=>{
  buildLangMenu();
  applyI18n(currentLang());
  wireContactLinks();
  wireChrome();
  wireFaq();
  wireReveal();
  wireForms();
  wireYear();
});
