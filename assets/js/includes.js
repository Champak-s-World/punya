(()=>{
  const root=document.body.dataset.root||"./";
  const page=document.body.dataset.page||"";
  let installPrompt=null;

  async function inject(selector,file){
    const host=document.querySelector(selector);
    if(!host)return;
    try{
      const response=await fetch(root+"includes/"+file+"?v=10",{cache:"no-cache"});
      if(!response.ok)throw new Error(response.status);
      host.innerHTML=(await response.text()).replaceAll("{{ROOT}}",root);
    }catch(error){
      host.innerHTML=`<div class="include-error">Unable to load ${file}. View this site through a web server.</div>`;
    }
  }

  function wireInstallButton(){
    const button=document.querySelector(".install-app");
    if(!button||!installPrompt)return;
    button.hidden=false;
    button.onclick=async()=>{
      installPrompt.prompt();
      await installPrompt.userChoice.catch(()=>null);
      installPrompt=null;
      button.hidden=true;
    };
  }

  window.addEventListener("beforeinstallprompt",event=>{
    event.preventDefault();
    installPrompt=event;
    wireInstallButton();
  });
  window.addEventListener("appinstalled",()=>{
    installPrompt=null;
    const button=document.querySelector(".install-app");
    if(button)button.hidden=true;
  });

  Promise.all([inject("#site-header","header.html"),inject("#site-footer","footer.html")]).then(()=>{
    document.querySelector(`[data-nav="${page}"]`)?.classList.add("current");
    const menu=document.querySelector(".menu"),nav=document.querySelector("header nav");
    menu?.addEventListener("click",()=>{
      const open=nav.classList.toggle("open");
      menu.setAttribute("aria-expanded",String(open));
    });
    nav?.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
      nav.classList.remove("open");menu?.setAttribute("aria-expanded","false");
    }));
    const header=document.querySelector("header");
    addEventListener("scroll",()=>header?.classList.toggle("scrolled",scrollY>40),{passive:true});
    wireInstallButton();
  });

  const pageShowStyle=document.createElement("link");
  pageShowStyle.rel="stylesheet";
  pageShowStyle.href=root+"assets/css/page-show.css?v=10";
  document.head.appendChild(pageShowStyle);

  const pageShowScript=document.createElement("script");
  pageShowScript.src=root+"assets/js/page-show.js?v=10";
  pageShowScript.defer=true;
  document.head.appendChild(pageShowScript);

  if("serviceWorker" in navigator&&location.protocol.startsWith("http")){
    window.addEventListener("load",()=>navigator.serviceWorker.register(root+"service-worker.js").catch(()=>{}));
  }
})();
