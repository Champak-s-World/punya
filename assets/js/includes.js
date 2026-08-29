(()=>{
  const root=document.body.dataset.root||"./";
  const page=document.body.dataset.page||"";
  async function inject(selector,file){
    const host=document.querySelector(selector);if(!host)return;
    try{const response=await fetch(root+"includes/"+file+"?v=7",{cache:"no-cache"});if(!response.ok)throw new Error(response.status);host.innerHTML=(await response.text()).replaceAll("{{ROOT}}",root)}
    catch(error){host.innerHTML=`<div class="include-error">Unable to load ${file}. View this site through GitHub Pages or a local web server.</div>`}
  }
  Promise.all([inject("#site-header","header.html"),inject("#site-footer","footer.html")]).then(()=>{
    document.querySelector(`[data-nav="${page}"]`)?.classList.add("current");
    const menu=document.querySelector(".menu"),nav=document.querySelector("header nav");
    menu?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open))});
    const header=document.querySelector("header");addEventListener("scroll",()=>header?.classList.toggle("scrolled",scrollY>40),{passive:true});
  });
})();
