(()=>{
  const header=document.querySelector("header");
  addEventListener("scroll",()=>header?.classList.toggle("scrolled",scrollY>40),{passive:true});
  const revealTargets=document.querySelectorAll(".section-head,.booking-tour,.story-heading,.story-slider,.story-links,.book-grid>div,.book-grid form");
  revealTargets.forEach(element=>element.classList.add("reveal"));
  if("IntersectionObserver" in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:"0px 0px -35px"});revealTargets.forEach(element=>observer.observe(element))}else revealTargets.forEach(element=>element.classList.add("visible"));
  if(matchMedia("(pointer:fine) and (prefers-reduced-motion:no-preference)").matches){document.querySelectorAll(".booking-tour").forEach(card=>{card.addEventListener("pointermove",event=>{const box=card.getBoundingClientRect(),x=(event.clientX-box.left)/box.width-.5,y=(event.clientY-box.top)/box.height-.5;card.style.transform=`rotateX(${-y*7}deg) rotateY(${x*9}deg) translateY(-8px)`});card.addEventListener("pointerleave",()=>card.style.transform="")})}
})();
