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

  const SLIDE_MS=20000;
  const IDLE_MS=60000;

  let index=0;
  let idleTimer=null;
  let slideTimer=null;
  let scrollTimer=null;
  let activityTimer=null;

  let playing=true;
  let activityPaused=false;
  let musicWanted=true;
  let lastFocused=null;

  let autoScrolling=false;
  let suppressActivity=false;
  let ignoreFrameScrollUntil=0;

  const showMusic=new Audio(MUSIC_URL);

  showMusic.loop=true;
  showMusic.preload="auto";
  showMusic.volume=.34;


  /* =====================================================
     ALWAYS-VISIBLE ANALOG CLOCK
     ===================================================== */

  const clock=document.createElement("div");

  clock.className="punya-analog-clock";
  clock.setAttribute("role","img");

  clock.innerHTML=`
    <canvas
      width="240"
      height="240"
      aria-hidden="true">
    </canvas>

    <div
      class="punya-clock-date"
      aria-hidden="true">
    </div>
  `;

  document.body.appendChild(clock);

  const clockCanvas=clock.querySelector("canvas");
  const clockDate=clock.querySelector(".punya-clock-date");
  const clockContext=clockCanvas.getContext("2d");


  function drawClock(){

    if(!clockContext)return;

    const ctx=clockContext;

    const size=240;
    const c=120;
    const r=106;

    const now=new Date();

    ctx.clearRect(0,0,size,size);

    ctx.save();

    ctx.translate(c,c);


    /* Clock face */

    const face=ctx.createRadialGradient(
      -28,
      -34,
      12,
      0,
      0,
      r
    );

    face.addColorStop(0,"#fffdf7");
    face.addColorStop(1,"#f2e1c7");

    ctx.beginPath();

    ctx.arc(
      0,
      0,
      r,
      0,
      Math.PI*2
    );

    ctx.fillStyle=face;

    ctx.fill();


    /* Outer border */

    ctx.lineWidth=7;
    ctx.strokeStyle="#5b2c31";

    ctx.stroke();


    /* Inner border */

    ctx.beginPath();

    ctx.arc(
      0,
      0,
      r-8,
      0,
      Math.PI*2
    );

    ctx.lineWidth=2;
    ctx.strokeStyle="#d3a75b";

    ctx.stroke();


    /* Minute / hour ticks */

    for(let i=0;i<60;i++){

      const a=i*Math.PI/30;

      const major=i%5===0;

      const inner=r-(major?20:12);

      ctx.beginPath();

      ctx.moveTo(
        Math.sin(a)*inner,
        -Math.cos(a)*inner
      );

      ctx.lineTo(
        Math.sin(a)*(r-5),
        -Math.cos(a)*(r-5)
      );

      ctx.lineWidth=major?4:1.4;

      ctx.strokeStyle=
        major
          ? "#5b2c31"
          : "#9f8067";

      ctx.stroke();
    }


    /* Clock numbers */

    ctx.fillStyle="#4c2630";

    ctx.font=
      "700 18px Georgia,serif";

    ctx.textAlign="center";
    ctx.textBaseline="middle";

    [
      ["12",0,-72],
      ["3",74,0],
      ["6",0,74],
      ["9",-74,0]
    ].forEach(
      ([n,x,y])=>{
        ctx.fillText(
          n,
          x,
          y
        );
      }
    );


    const seconds=
      now.getSeconds()
      +
      now.getMilliseconds()/1000;

    const minutes=
      now.getMinutes()
      +
      seconds/60;

    const hours=
      (now.getHours()%12)
      +
      minutes/60;


    function hand(
      angle,
      length,
      width,
      color
    ){

      ctx.save();

      ctx.rotate(angle);

      ctx.beginPath();

      ctx.moveTo(
        0,
        8
      );

      ctx.lineTo(
        0,
        -length
      );

      ctx.lineCap="round";

      ctx.lineWidth=width;

      ctx.strokeStyle=color;

      ctx.stroke();

      ctx.restore();
    }


    /* Hour hand */

    hand(
      hours*Math.PI/6,
      52,
      9,
      "#402029"
    );


    /* Minute hand */

    hand(
      minutes*Math.PI/30,
      73,
      6,
      "#5b2c31"
    );


    /* Second hand */

    hand(
      seconds*Math.PI/30,
      82,
      2.2,
      "#b04e39"
    );


    /* Centre pin */

    ctx.beginPath();

    ctx.arc(
      0,
      0,
      7,
      0,
      Math.PI*2
    );

    ctx.fillStyle="#d3a75b";

    ctx.fill();

    ctx.lineWidth=2;

    ctx.strokeStyle="#5b2c31";

    ctx.stroke();


    ctx.restore();


    /* Date */

    clockDate.textContent=
      new Intl.DateTimeFormat(
        "en-IN",
        {
          weekday:"short",
          day:"2-digit",
          month:"short"
        }
      ).format(now);


    /* Accessibility */

    clock.setAttribute(
      "aria-label",
      "Current local time "
      +
      new Intl.DateTimeFormat(
        "en-IN",
        {
          hour:"numeric",
          minute:"2-digit",
          second:"2-digit"
        }
      ).format(now)
    );
  }


  drawClock();

  setInterval(
    drawClock,
    1000
  );


  /* =====================================================
     PAGE SHOW
     ===================================================== */

  const modal=document.createElement("div");

  modal.className="page-show";

  modal.setAttribute(
    "role",
    "dialog"
  );

  modal.setAttribute(
    "aria-modal",
    "true"
  );

  modal.setAttribute(
    "aria-label",
    "Explore Punya Yatra"
  );


  modal.innerHTML=`
    <div class="page-show-dialog">

      <div class="page-show-bar">

        <div class="page-show-title">

          <small>
            DISCOVER PUNYA YATRA
          </small>

          <strong></strong>

        </div>

        <button
          class="page-show-control"
          data-prev
          type="button"
          aria-label="Previous page">
          ‹
        </button>

        <button
          class="page-show-control"
          data-play
          type="button"
          aria-label="Pause automatic page show">
          Ⅱ
        </button>

        <button
          class="page-show-control page-show-music"
          data-music
          type="button"
          aria-label="Pause music"
          aria-pressed="true">
          ♫
        </button>

        <button
          class="page-show-control"
          data-next
          type="button"
          aria-label="Next page">
          ›
        </button>

        <a
          class="page-show-control page-show-open"
          data-open
          href="#">
          Open page
        </a>

        <button
          class="page-show-control"
          data-close
          type="button"
          aria-label="Close page show">
          ×
        </button>

      </div>


      <div class="page-show-progress">
        <span></span>
      </div>


      <iframe
        class="page-show-frame"
        tabindex="-1"
        title="Punya Yatra page preview">
      </iframe>


      <div class="page-show-hint">

        <span data-auto-status>
          Auto show running
        </span>

        · 20-second full-page scroll ·

        <span data-music-status>
          Music on
        </span>

      </div>

    </div>
  `;


  const launch=document.createElement("button");

  launch.className="page-show-launch";

  launch.type="button";

  launch.innerHTML=
    "<span>▶</span> Explore site";

  document.body.append(
    modal,
    launch
  );


  const frame=
    modal.querySelector(
      "iframe"
    );

  const title=
    modal.querySelector(
      "strong"
    );

  const openLink=
    modal.querySelector(
      "[data-open]"
    );

  const playButton=
    modal.querySelector(
      "[data-play]"
    );

  const musicButton=
    modal.querySelector(
      "[data-music]"
    );

  const musicStatus=
    modal.querySelector(
      "[data-music-status]"
    );

  const autoStatus=
    modal.querySelector(
      "[data-auto-status]"
    );


  const autoActive=()=>(
    playing
    &&
    !activityPaused
    &&
    modal.classList.contains("open")
    &&
    !document.hidden
  );


  /* =====================================================
     MUSIC
     ===================================================== */

  function setMusicUI(
    actualPlaying
  ){

    musicButton.setAttribute(
      "aria-pressed",
      String(actualPlaying)
    );

    musicButton.textContent=
      actualPlaying
        ? "♫"
        : "♩";

    musicButton.setAttribute(
      "aria-label",
      actualPlaying
        ? "Pause music"
        : "Play music"
    );

    musicButton.classList.toggle(
      "active",
      actualPlaying
    );

    musicStatus.textContent=
      actualPlaying
        ? "Bhairavi playing"
        : (
            musicWanted
              ? "Tap ♫ for music"
              : "Music off"
          );
  }


  async function attemptMusic(){

    if(
      !musicWanted
      ||
      !modal.classList.contains(
        "open"
      )
    ){

      showMusic.pause();

      setMusicUI(false);

      return;
    }


    try{

      await showMusic.play();

      setMusicUI(true);

    }catch(error){

      setMusicUI(false);

    }
  }


  /* =====================================================
     AUTO-SHOW STATUS
     ===================================================== */

  function setAutoUI(){

    if(!playing){

      playButton.textContent=
        "▶";

      playButton.setAttribute(
        "aria-label",
        "Play automatic page show"
      );

      autoStatus.textContent=
        "Auto show paused";

    }

    else if(activityPaused){

      playButton.textContent=
        "▶";

      playButton.setAttribute(
        "aria-label",
        "Resume automatic page show"
      );

      autoStatus.textContent=
        "Paused by activity · resumes after 60s idle";

    }

    else{

      playButton.textContent=
        "Ⅱ";

      playButton.setAttribute(
        "aria-label",
        "Pause automatic page show"
      );

      autoStatus.textContent=
        "Auto show running";
    }
  }


  /* =====================================================
     AUTO SCROLL
     ===================================================== */

  function stopAutoScroll(){

    if(scrollTimer){

      cancelAnimationFrame(
        scrollTimer
      );
    }

    scrollTimer=null;

    autoScrolling=false;
  }


  function startAutoScroll(
    resetToTop=true
  ){

    stopAutoScroll();


    if(
      !autoActive()
      ||
      matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ){
      return;
    }


    try{

      const win=
        frame.contentWindow;

      const doc=
        frame.contentDocument;


      if(
        !win
        ||
        !doc
      ){
        return;
      }


      const max=
        Math.max(
          doc.documentElement.scrollHeight,
          doc.body?.scrollHeight||0
        )
        -
        win.innerHeight;


      const startY=
        resetToTop
          ? 0
          : Math.max(
              0,
              Math.min(
                win.scrollY,
                max
              )
            );


      autoScrolling=true;

      ignoreFrameScrollUntil=
        performance.now()
        +
        250;


      if(resetToTop){

        win.scrollTo({
          top:0,
          behavior:"auto"
        });
      }


      const started=
        performance.now();


      const step=now=>{

        if(!autoActive()){

          scrollTimer=null;

          autoScrolling=false;

          return;
        }


        const currentMax=
          Math.max(
            doc.documentElement.scrollHeight,
            doc.body?.scrollHeight||0
          )
          -
          win.innerHeight;


        const progress=
          Math.min(
            (now-started)
            /
            SLIDE_MS,
            1
          );


        if(currentMax>0){

          win.scrollTo(
            0,
            startY
            +
            (
              currentMax-startY
            )
            *
            progress
          );
        }


        if(progress<1){

          scrollTimer=
            requestAnimationFrame(
              step
            );

        }else{

          if(currentMax>0){

            win.scrollTo(
              0,
              currentMax
            );
          }


          ignoreFrameScrollUntil=
            performance.now()
            +
            300;


          scrollTimer=null;

          autoScrolling=false;
        }
      };


      scrollTimer=
        requestAnimationFrame(
          step
        );

    }catch(error){

      autoScrolling=false;

    }
  }


  /* =====================================================
     AUTO SLIDES
     ===================================================== */

  function stopAutomation(){

    clearTimeout(
      slideTimer
    );

    slideTimer=null;

    stopAutoScroll();

    modal.classList.remove(
      "playing"
    );
  }


  function restartSlides(){

    clearTimeout(
      slideTimer
    );

    slideTimer=null;

    modal.classList.remove(
      "playing"
    );


    void modal.offsetWidth;


    if(autoActive()){

      modal.classList.add(
        "playing"
      );

      slideTimer=setTimeout(
        ()=>{
          showPage(
            index+1
          );
        },
        SLIDE_MS
      );
    }
  }


  /* =====================================================
     USER ACTIVITY
     ===================================================== */

  function resumeAfterIdle(){

    clearTimeout(
      activityTimer
    );

    activityTimer=null;


    if(
      !playing
      ||
      !modal.classList.contains("open")
      ||
      document.hidden
    ){
      return;
    }


    activityPaused=false;

    setAutoUI();


    startAutoScroll(
      false
    );


    restartSlides();
  }


  function scheduleActivityResume(){

    clearTimeout(
      activityTimer
    );

    activityTimer=null;


    if(
      playing
      &&
      modal.classList.contains("open")
      &&
      !document.hidden
    ){

      activityTimer=setTimeout(
        resumeAfterIdle,
        IDLE_MS
      );
    }
  }


  function pauseForActivity(){

    if(
      !modal.classList.contains(
        "open"
      )
    ){
      return;
    }


    activityPaused=true;

    stopAutomation();

    setAutoUI();

    scheduleActivityResume();
  }


  function resetIdle(){

    clearTimeout(
      idleTimer
    );


    if(
      !modal.classList.contains(
        "open"
      )
    ){

      idleTimer=setTimeout(
        openShow,
        IDLE_MS
      );
    }
  }


  function noteActivity(
    event,
    fromFrame=false
  ){

    if(suppressActivity){
      return;
    }


    /*
      Programmatic slideshow scrolling
      must NOT count as user activity.
    */

    if(
      fromFrame
      &&
      event?.type==="scroll"
      &&
      (
        autoScrolling
        ||
        performance.now()
        <
        ignoreFrameScrollUntil
      )
    ){
      return;
    }


    if(
      modal.classList.contains(
        "open"
      )
    ){

      pauseForActivity();

    }else{

      resetIdle();

    }
  }


  /*
    Detect activity inside the preview iframe.

    This is important because interactions inside
    an iframe do not bubble to the parent document.
  */

  function bindFrameActivity(){

    try{

      const win=
        frame.contentWindow;

      const doc=
        frame.contentDocument;


      if(
        !win
        ||
        !doc
      ){
        return;
      }


      [
        "pointerdown",
        "pointermove",
        "touchstart",
        "wheel",
        "click"
      ].forEach(
        type=>{

          doc.addEventListener(
            type,
            event=>{
              noteActivity(
                event,
                true
              );
            },
            {
              capture:true,
              passive:true
            }
          );
        }
      );


      [
        "keydown",
        "focusin"
      ].forEach(
        type=>{

          doc.addEventListener(
            type,
            event=>{
              noteActivity(
                event,
                true
              );
            },
            true
          );
        }
      );


      win.addEventListener(
        "scroll",
        event=>{
          noteActivity(
            event,
            true
          );
        },
        {
          capture:true,
          passive:true
        }
      );

    }catch(error){

      /*
        Same-origin preview expected.
      */

    }
  }


  /* =====================================================
     PAGE CHANGE
     ===================================================== */

  function showPage(
    next
  ){

    index=
      (
        next
        +
        pages.length
      )
      %
      pages.length;


    const page=
      pages[index];


    title.textContent=
      page.title;


    frame.src=
      page.url
      +
      (
        page.url.includes("?")
          ? "&"
          : "?"
      )
      +
      "preview=1";


    openLink.href=
      page.url;


    stopAutomation();
  }


  /* =====================================================
     OPEN / CLOSE
     ===================================================== */

  function openShow(){

    clearTimeout(
      idleTimer
    );


    clearTimeout(
      activityTimer
    );


    activityPaused=false;


    lastFocused=
      document.activeElement;


    document
      .querySelector(
        "#journeyMusic"
      )
      ?.pause?.();


    modal.classList.add(
      "open"
    );


    document.body.classList.add(
      "page-show-lock"
    );


    showPage(
      index
    );


    setAutoUI();


    /*
      Focusing the close button is done
      programmatically and must not count
      as user activity.
    */

    suppressActivity=true;


    modal
      .querySelector(
        "[data-close]"
      )
      .focus({
        preventScroll:true
      });


    setTimeout(
      ()=>{
        suppressActivity=false;
      },
      0
    );


    attemptMusic();
  }


  function closeShow(){

    modal.classList.remove(
      "open",
      "playing"
    );


    document.body.classList.remove(
      "page-show-lock"
    );


    clearTimeout(
      slideTimer
    );


    clearTimeout(
      activityTimer
    );


    activityTimer=null;

    activityPaused=false;


    stopAutoScroll();


    showMusic.pause();


    frame.src=
      "about:blank";


    suppressActivity=true;


    lastFocused
      ?.focus?.({
        preventScroll:true
      });


    setTimeout(
      ()=>{
        suppressActivity=false;
      },
      0
    );


    resetIdle();
  }


  /* =====================================================
     IFRAME LOAD
     ===================================================== */

  frame.addEventListener(
    "load",
    ()=>{

      if(
        !modal.classList.contains(
          "open"
        )
      ){
        return;
      }


      bindFrameActivity();


      startAutoScroll(
        true
      );


      restartSlides();
    }
  );


  /* =====================================================
     CONTROLS
     ===================================================== */

  modal
    .querySelector(
      "[data-prev]"
    )
    .addEventListener(
      "click",
      ()=>{
        showPage(
          index-1
        );
      }
    );


  modal
    .querySelector(
      "[data-next]"
    )
    .addEventListener(
      "click",
      ()=>{
        showPage(
          index+1
        );
      }
    );


  modal
    .querySelector(
      "[data-close]"
    )
    .addEventListener(
      "click",
      closeShow
    );


  /*
    Play button:

    If the slideshow was paused because of
    user interaction, clicking Play resumes
    immediately.

    Otherwise it acts as a normal
    play/pause control.
  */

  playButton.addEventListener(
    "click",
    ()=>{

      if(
        playing
        &&
        activityPaused
      ){

        clearTimeout(
          activityTimer
        );

        activityTimer=null;

        activityPaused=false;

        setAutoUI();

        startAutoScroll(
          false
        );

        restartSlides();

        return;
      }


      playing=!playing;

      activityPaused=false;


      clearTimeout(
        activityTimer
      );

      activityTimer=null;


      if(playing){

        startAutoScroll(
          false
        );

        restartSlides();

      }else{

        stopAutomation();

      }


      setAutoUI();
    }
  );


  musicButton.addEventListener(
    "click",
    async()=>{

      musicWanted=
        !musicWanted;


      if(musicWanted){

        await attemptMusic();

      }else{

        showMusic.pause();

        setMusicUI(false);

      }
    }
  );


  showMusic.addEventListener(
    "play",
    ()=>{
      setMusicUI(true);
    }
  );


  showMusic.addEventListener(
    "pause",
    ()=>{
      setMusicUI(false);
    }
  );


  launch.addEventListener(
    "click",
    openShow
  );


  modal.addEventListener(
    "click",
    e=>{

      if(
        e.target===modal
      ){

        closeShow();

      }
    }
  );


  /* =====================================================
     KEYBOARD CONTROL
     ===================================================== */

  document.addEventListener(
    "keydown",
    e=>{

      if(
        !modal.classList.contains(
          "open"
        )
      ){
        return;
      }


      if(e.key==="Escape"){

        closeShow();

      }

      else if(
        e.key==="ArrowRight"
      ){

        showPage(
          index+1
        );

      }

      else if(
        e.key==="ArrowLeft"
      ){

        showPage(
          index-1
        );

      }

      else if(
        e.key==="Tab"
      ){

        const focusable=[
          ...modal.querySelectorAll(
            'button:not([disabled]),a[href]'
          )
        ].filter(
          el=>
            el.offsetParent!==null
        );


        if(
          !focusable.length
        ){
          return;
        }


        const first=
          focusable[0];

        const last=
          focusable[
            focusable.length-1
          ];


        if(
          e.shiftKey
          &&
          document.activeElement
          ===
          first
        ){

          e.preventDefault();

          last.focus();

        }

        else if(
          !e.shiftKey
          &&
          document.activeElement
          ===
          last
        ){

          e.preventDefault();

          first.focus();

        }
      }
    }
  );


  /* =====================================================
     STOP AT THE SLIGHTEST USER INTERACTION
     ===================================================== */

  [
    "pointerdown",
    "pointermove",
    "touchstart",
    "wheel",
    "click"
  ].forEach(
    type=>{

      document.addEventListener(
        type,
        event=>{

          noteActivity(
            event,
            false
          );

        },
        {
          capture:true,
          passive:true
        }
      );

    }
  );


  [
    "keydown",
    "focusin"
  ].forEach(
    type=>{

      document.addEventListener(
        type,
        event=>{

          noteActivity(
            event,
            false
          );

        },
        true
      );

    }
  );


  document.addEventListener(
    "scroll",
    event=>{

      noteActivity(
        event,
        false
      );

    },
    {
      capture:true,
      passive:true
    }
  );


  /* =====================================================
     TAB / VISIBILITY CHANGES
     ===================================================== */

  document.addEventListener(
    "visibilitychange",
    ()=>{

      if(
        document.hidden
      ){

        clearTimeout(
          idleTimer
        );


        clearTimeout(
          activityTimer
        );


        activityTimer=null;


        if(
          modal.classList.contains(
            "open"
          )
        ){

          activityPaused=true;

        }


        stopAutomation();

        showMusic.pause();

        setAutoUI();

      }

      else if(
        modal.classList.contains(
          "open"
        )
      ){

        setAutoUI();

        scheduleActivityResume();

        attemptMusic();

      }

      else{

        resetIdle();

      }
    }
  );


  setMusicUI(false);

  setAutoUI();

  resetIdle();

})();