window.addEventListener('load',()=>{
  setTimeout(()=>{
    document.getElementById('preloader').classList.add('hidden');
  },1800);
});

const dot=document.getElementById('cursor-dot');
const ring=document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
(function animRing(){rx+=(mx-rx)*.14;ry+=(my-ry)*.14;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing)})();
document.addEventListener('mousedown',()=>dot.style.transform='translate(-50%,-50%) scale(1.6)');
document.addEventListener('mouseup',()=>dot.style.transform='translate(-50%,-50%) scale(1)');

const html=document.documentElement;
const toggleBtn=document.getElementById('theme-toggle');
const moonIcon='<i class="fa-solid fa-moon"></i>';
const sunIcon='<i class="fa-solid fa-sun"></i>';
toggleBtn.addEventListener('click',()=>{
  const isDark=html.getAttribute('data-theme')==='dark';
  html.setAttribute('data-theme',isDark?'light':'dark');
  toggleBtn.innerHTML=isDark?moonIcon:sunIcon;
});

const btt=document.getElementById('back-top');
window.addEventListener('scroll',()=>{btt.classList.toggle('show',window.scrollY>400)});

const aosEls=document.querySelectorAll('[data-aos]');
const aosObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const delay=e.target.dataset.aosDelay||0;
      setTimeout(()=>e.target.classList.add('aos-in'),+delay);
    }
  });
},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
aosEls.forEach(el=>aosObs.observe(el));

function animCounter(el){
  const target=+el.dataset.target;
  const suffix=el.dataset.suffix||'+';
  let start=0;
  const dur=1800;
  const startTime=performance.now();
  function step(now){
    const p=Math.min((now-startTime)/dur,1);
    const ease=1-Math.pow(1-p,4);
    start=Math.round(ease*target);
    el.textContent=start.toLocaleString()+suffix;
    if(p<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counterObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting&&!e.target.dataset.counted){
      e.target.dataset.counted='1';
      animCounter(e.target);
    }
  });
},{threshold:.5});
document.querySelectorAll('[data-target]').forEach(el=>counterObs.observe(el));

const cards=document.querySelectorAll('#cards-grid .card');
const searchInput=document.getElementById('search-input');
const filterBtns=document.querySelectorAll('.filter-btn');
let activeFilter='all';

function filterCards(){
  const q=searchInput.value.toLowerCase().trim();
  cards.forEach(c=>{
    const cat=c.dataset.cat;
    const title=c.querySelector('.card-title').textContent.toLowerCase();
    const tags=[...c.querySelectorAll('.tag')].map(t=>t.textContent.toLowerCase()).join(' ');
    const matchFilter=activeFilter==='all'||cat===activeFilter;
    const matchSearch=!q||title.includes(q)||tags.includes(q)||cat.includes(q);
    c.classList.toggle('hidden',!(matchFilter&&matchSearch));
  });
}
searchInput.addEventListener('input',filterCards);
filterBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    filterBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter=btn.dataset.filter;
    filterCards();
  });
});

const overlay=document.getElementById('modal-overlay');
function openModal(card){
  document.getElementById('modal-title').textContent=card.dataset.title;
  document.getElementById('modal-sub').textContent='VaultofCodes Internship Program - virtual, flexible and career-focused.';
  document.getElementById('modal-duration').textContent=card.dataset.duration;
  document.getElementById('modal-location').textContent=card.dataset.location;
  document.getElementById('modal-stipend').textContent=card.dataset.stipend;
  document.getElementById('modal-start').textContent=card.dataset.start;
  const iconEl=document.getElementById('modal-icon');
  iconEl.style.background=card.dataset.iconBg;
  iconEl.innerHTML=`<i class="${card.dataset.icon}" style="color:${card.dataset.iconColor};font-size:1.6rem"></i>`;
  const skillsEl=document.getElementById('modal-skills');
  skillsEl.innerHTML=card.dataset.skills.split(',').map(s=>`<span class="modal-skill">${s.trim()}</span>`).join('');
  document.getElementById('modal-apply-btn').href=card.dataset.link;
  overlay.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal(){
  overlay.classList.remove('open');
  document.body.style.overflow='';
}
overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

document.querySelectorAll('.faq-q').forEach(q=>{
  q.addEventListener('click',()=>{
    const item=q.parentElement;
    const isOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o=>{
      o.classList.remove('open');
      o.querySelector('.faq-a').style.maxHeight='0';
    });
    if(!isOpen){
      item.classList.add('open');
      item.querySelector('.faq-a').style.maxHeight=item.querySelector('.faq-a').scrollHeight+'px';
    }
  });
});

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}
  });
});