
const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
async function includePart(el){const file=el.dataset.include;if(!file)return;const res=await fetch(file);el.outerHTML=await res.text();}
function pageName(){const f=location.pathname.split('/').pop()||'index.html';return f;}
function titleFromFile(f){if(f==='index.html')return 'Home';return f.replace('.html','').replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());}
function activateNav(){const f=pageName();$$('.site-nav a').forEach(a=>{const href=a.getAttribute('href');if(href===f||(f===''&&href==='index.html'))a.classList.add('active')});}
function breadcrumbs(){const b=$('.breadcrumbs');if(!b)return;const f=pageName();const title=titleFromFile(f);b.innerHTML=f==='index.html'?'Home':`<a href="index.html">Home</a> / <span>${title}</span>`;}
function theme(){const saved=localStorage.getItem('punya-theme')||'light';document.documentElement.dataset.theme=saved;$$('[data-theme-toggle]').forEach(btn=>btn.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;localStorage.setItem('punya-theme',next)}));}
function lang(){const saved=localStorage.getItem('punya-lang')||'en';document.documentElement.lang=saved;$$('[data-lang-toggle]').forEach(btn=>btn.addEventListener('click',()=>{const next=document.documentElement.lang==='hi'?'en':'hi';document.documentElement.lang=next;localStorage.setItem('punya-lang',next);btn.textContent=next==='hi'?'Hindi / English':'English / Hindi'}));}
function navToggle(){const h=$('.site-header'),btn=$('.nav-toggle');if(btn&&h)btn.addEventListener('click',()=>{const open=h.classList.toggle('nav-open');btn.setAttribute('aria-expanded',String(open));});}
function year(){const y=$('[data-year]');if(y)y.textContent=new Date().getFullYear();}
async function renderHomeCards(){const boxes=$$('[data-content-cards]');if(!boxes.length)return;const res=await fetch('assets/data/content.json');const data=await res.json();boxes.forEach(box=>{const cat=box.dataset.contentCards;const limit=Number(box.dataset.limit||3);const list=data.items.filter(i=>!cat||i.category===cat).slice(0,limit);box.innerHTML=list.map(i=>`<article class="card"><img src="${i.image}" alt="${i.title}"><h3>${i.title}</h3><p>${i.description}</p><a class="btn" href="${i.url}">View details</a></article>`).join('');});}
function homeSearch(){const form=$('[data-home-search]');if(!form)return;form.addEventListener('submit',e=>{e.preventDefault();const q=form.querySelector('input').value.trim();location.href='search.html?q='+encodeURIComponent(q);});}
function init(){activateNav();breadcrumbs();theme();lang();navToggle();year();renderHomeCards();homeSearch();}
Promise.all($$('[data-include]').map(includePart)).then(init);
