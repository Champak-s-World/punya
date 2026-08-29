(()=>{
  if(window.self!==window.top)return;

  const root=document.body.dataset.root||"./";
  const pages=[
    {title:"Welcome to Punya Yatra",url:root+"index.html"},
    {title:"Complete Pilgrimage Tours",url:root+"tours/"},
    {title:"The Visual Yatra",url:root+"gallery/"},
    {title:"Stories of Kashi",url:root+"stories/"},
    {title:"Plan and Book Your Journey",url:root+"book/"}
  ];
  const MUSIC_URL="https://programmer-s-picnic.github.io/json-images/music/Bhairavi%20-%20Sitarkhani%20-%20Aditya%20Verma,%20Subir%20Dev.mp3";
  const SLIDE_MS=24000;
  const IDLE_MS=60000;

  let index=0,idleTimer=null,slideTimer=null,scrollTimer=null,scrollDelay=null;
  let playing=true,musicWanted=true,lastFocused=null;

  const showMusic=new Audio(MUSIC_URL);
  showMusic.loop=true;
  showMusic.preload="auto";
  showMusic.volume=.34;

  const modal=document.createElement("div");
  modal.className="page-show";
  modal.setAttribute("role","dialog");
  modal.setAttribute("aria-modal","true");
  modal.setAttribute("aria-label","Explore Punya Yatra");
  modal.innerHTML=`
    <div class="page-show-dialog">
      <div class="page-show-bar">
        <div class="page-show-title"><small>DISCOVER PUNYA YATRA</small><strong></strong></div>
        <button class="page-show-control" data-prev type="button" aria-label="Previous page">‹</button>
        <button class="page-show-control" data-play type="button" aria-label="Pause automatic page show">Ⅱ</button>
        <button class="page-show-control page-show-music" data-music type="button" aria-label="Pause music" aria-pressed="true">♫</button>
        <button class="page-show-control" data-next type="button" aria-label="Next page">›</button>
        <a class="page-show-control page-show-open" data-open href="#">Open page</a>
        <button class="page-show-control" data-close type="button" aria-label="Close page show">×</button>
      </div>
      <div class="page-show-progress"><span></span></div>
      <iframe class="page-show-frame" tabindex="-1" title="Punya Yatra page preview"></iframe>
      <div class="page-show-hint">Pages scroll gently as the yatra continues · <span data-music-status>Music on</span></div>
    </div>`;

  const launch=document.createElement("button");
  launch.className="page-show-launch";
  launch.type="button";
  launch.innerHTML="<span>▶</span> Explore site";
  document.body.append(modal,launch);

  const frame=modal.querySelector("iframe");
  const title=modal.querySelector("strong");
  const openLink=modal.querySelector("[data-open]");
  const playButton=modal.querySelector("[data-play]");
  const musicButton=modal.querySelector("[data-music]");
  const musicStatus=modal.querySelector("[data-music-status]");

  function setMusicUI(actualPlaying){
    musicButton.setAttribute("aria-pressed",String(actualPlaying));
    musicButton.textContent=actualPlaying?"♫":"♩";
    musicButton.setAttribute("aria-label",actualPlaying?"Pause music":"Play music");
    musicButton.classList.toggle("active",actualPlaying);
    musicStatus.textContent=actualPlaying?"Bhairavi playing":(musicWanted?"Tap ♫ for music":"Music off");
  }

  async function attemptMusic(){
    if(!musicWanted||!modal.classList.contains("open")){showMusic.pause();setMusicUI(false);return}
    try{await showMusic.play();setMusicUI(true)}catch(error){setMusicUI(false)}
  }

  function stopAutoScroll(){
    clearInterval(scrollTimer);clearTimeout(scrollDelay);scrollTimer=null;scrollDelay=null;
  }

  function startAutoScroll(){
    stopAutoScroll();
    if(!playing||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    scrollDelay=setTimeout(()=>{
      try{
        const win=frame.contentWindow,doc=frame.contentDocument;
        if(!win||!doc)return;
        win.scrollTo({top:0,behavior:"auto"});
        scrollTimer=setInterval(()=>{
          if(!modal.classList.contains("open")||!playing)return;
          const max=Math.max(doc.documentElement.scrollHeight,doc.body?.scrollHeight||0)-win.innerHeight;
          if(max<=0)return;
          if(win.scrollY<max-2)win.scrollBy(0,1.6);
        },55);
      }catch(error){/* same-origin preview expected; fail quietly if unavailable */}
    },2200);
  }

  function restartSlides(){
    clearTimeout(slideTimer);
    modal.classList.remove("playing");
    void modal.offsetWidth;
    if(playing&&modal.classList.contains("open")){
      modal.classList.add("playing");
      slideTimer=setTimeout(()=>showPage(index+1),SLIDE_MS);
    }
  }

  function showPage(next){
    index=(next+pages.length)%pages.length;
    const page=pages[index];
    title.textContent=page.title;
    frame.src=page.url+(page.url.includes("?")?"&":"?")+"preview=1";
    openLink.href=page.url;
    stopAutoScroll();
    restartSlides();
  }

  function openShow(){
    clearTimeout(idleTimer);
    lastFocused=document.activeElement;
    document.querySelector("#journeyMusic")?.pause?.();
    modal.classList.add("open");
    document.body.classList.add("page-show-lock");
    showPage(index);
    modal.querySelector("[data-close]").focus();
    attemptMusic();
  }

  function closeShow(){
    modal.classList.remove("open","playing");
    document.body.classList.remove("page-show-lock");
    clearTimeout(slideTimer);
    stopAutoScroll();
    showMusic.pause();
    frame.src="about:blank";
    lastFocused?.focus?.();
    resetIdle();
  }

  function resetIdle(){
    clearTimeout(idleTimer);
    if(!modal.classList.contains("open"))idleTimer=setTimeout(openShow,IDLE_MS);
  }

  frame.addEventListener("load",startAutoScroll);
  modal.querySelector("[data-prev]").addEventListener("click",()=>showPage(index-1));
  modal.querySelector("[data-next]").addEventListener("click",()=>showPage(index+1));
  modal.querySelector("[data-close]").addEventListener("click",closeShow);

  playButton.addEventListener("click",()=>{
    playing=!playing;
    playButton.textContent=playing?"Ⅱ":"▶";
    playButton.setAttribute("aria-label",playing?"Pause automatic page show":"Play automatic page show");
    if(playing)startAutoScroll();else stopAutoScroll();
    restartSlides();
  });

  musicButton.addEventListener("click",async()=>{
    musicWanted=!musicWanted;
    if(musicWanted)await attemptMusic();
    else{showMusic.pause();setMusicUI(false)}
  });

  showMusic.addEventListener("play",()=>setMusicUI(true));
  showMusic.addEventListener("pause",()=>setMusicUI(false));
  launch.addEventListener("click",openShow);
  modal.addEventListener("click",e=>{if(e.target===modal)closeShow()});

  document.addEventListener("keydown",e=>{
    if(!modal.classList.contains("open"))return;
    if(e.key==="Escape")closeShow();
    else if(e.key==="ArrowRight")showPage(index+1);
    else if(e.key==="ArrowLeft")showPage(index-1);
    else if(e.key==="Tab"){
      const focusable=[...modal.querySelectorAll('button:not([disabled]),a[href]')].filter(el=>el.offsetParent!==null);
      if(!focusable.length)return;
      const first=focusable[0],last=focusable[focusable.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
    }
  });

  ["pointerdown","keydown","scroll","touchstart"].forEach(event=>document.addEventListener(event,resetIdle,{passive:true}));
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden){clearTimeout(idleTimer);clearTimeout(slideTimer);stopAutoScroll();showMusic.pause()}
    else if(modal.classList.contains("open")){restartSlides();startAutoScroll();attemptMusic()}
    else resetIdle();
  });

  setMusicUI(false);
  resetIdle();
})();
