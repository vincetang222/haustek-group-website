/* =====================================================================
   HAUSTEK — HÀNH VI DÙNG CHUNG
   Nạp ở cuối <body>, TRƯỚC script riêng của trang. Lo bốn việc mà trang
   nào cũng cần: menu điện thoại, hiện dần khi cuộn, nhớ ngôn ngữ giữa các
   trang, và dịch phần khung chung (thanh điều hướng, menu, chân trang).
   Chữ riêng của từng trang vẫn do bảng I18N của trang đó lo.
   ===================================================================== */
(function(){
  const CHROME={
    vi:{
      skip:"Bỏ qua điều hướng, tới nội dung chính",
      nav_services:"Dịch vụ",nav_artists:"Nghệ sĩ",nav_events:"Sự kiện",nav_faq:"Hỏi đáp",nav_cta:"Liên hệ",
      m_home:"Trang chủ",
      f_tag:"Để nhạc Việt vang xa hơn.",
      f_desc:"Music label &amp; distribution từ 2017 — đưa nhạc của nghệ sĩ Việt trong nước và hải ngoại lên hơn 200 cửa hàng nhạc số.",
      f_explore:"Khám phá",f_legal:"Pháp lý",f_follow:"Theo dõi",
      f_terms:"Điều khoản sử dụng",f_privacy:"Quyền riêng tư",f_cookies:"Cookie",f_a11y:"Khả năng tiếp cận",
      menu_open:"Mở menu",menu_close:"Đóng menu",lang_aria:"Switch to English"
    },
    en:{
      skip:"Skip navigation, go to main content",
      nav_services:"Services",nav_artists:"Artists",nav_events:"Events",nav_faq:"FAQ",nav_cta:"Contact",
      m_home:"Home",
      f_tag:"Made in Vietnam. Heard worldwide.",
      f_desc:"Music label &amp; distribution since 2017 — taking music by Vietnamese artists at home and abroad to 200+ digital stores.",
      f_explore:"Explore",f_legal:"Legal",f_follow:"Follow",
      f_terms:"Terms of use",f_privacy:"Privacy",f_cookies:"Cookies",f_a11y:"Accessibility",
      menu_open:"Open menu",menu_close:"Close menu",lang_aria:"Chuyển sang tiếng Việt"
    }
  };

  /* ---------- ngôn ngữ ----------
     Khoá hk_lang dùng chung cho mọi trang. Cố ý dùng sessionStorage chứ
     không phải localStorage: chính sách cookie (legal.html#cookies) cam kết
     lựa chọn ngôn ngữ "chỉ tồn tại trong bộ nhớ tạm của tab; đóng tab là
     mất". Chuyển trang trong cùng tab vẫn nhớ — đủ cho việc cần làm.
     try/catch: trình duyệt chặn lưu trữ thì ném lỗi — khi đó cứ về VI. */
  function loadLang(){try{return sessionStorage.getItem('hk_lang')==='en'?'en':'vi';}catch(e){return 'vi';}}
  function saveLang(l){try{sessionStorage.setItem('hk_lang',l);}catch(e){}}

  let lang='vi';
  const menuBtn=document.getElementById('menuBtn');
  const menu=document.getElementById('menu');

  function paintChrome(l){
    const d=CHROME[l];
    document.querySelectorAll('[data-t]').forEach(el=>{const v=d[el.dataset.t];if(v!==undefined)el.innerHTML=v;});
    const btn=document.getElementById('langBtn');
    if(btn){btn.textContent=l==='vi'?'EN':'VI';btn.setAttribute('aria-label',d.lang_aria);}
    if(menuBtn)menuBtn.setAttribute('aria-label',menu&&menu.classList.contains('on')?d.menu_close:d.menu_open);
    document.documentElement.lang=l;
  }

  /* Trang gọi HK.lang(apply): apply(l) dựng lại chữ riêng của trang.
     Hàm trả về ngôn ngữ đang dùng; bấm nút EN/VI tự lưu và gọi lại apply. */
  function bindLang(apply){
    lang=loadLang();
    const btn=document.getElementById('langBtn');
    const set=l=>{lang=l;paintChrome(l);if(apply)apply(l);};
    if(btn)btn.addEventListener('click',()=>{const l=lang==='vi'?'en':'vi';saveLang(l);set(l);});
    set(lang);
    return lang;
  }

  /* ---------- menu điện thoại ---------- */
  function setMenu(open){
    if(!menu||!menuBtn)return;
    menu.classList.toggle('on',open);
    menu.setAttribute('aria-hidden',open?'false':'true');
    menuBtn.setAttribute('aria-expanded',open?'true':'false');
    menuBtn.setAttribute('aria-label',CHROME[lang][open?'menu_close':'menu_open']);
    document.body.classList.toggle('menu-open',open);
  }
  if(menu&&menuBtn){
    menuBtn.addEventListener('click',()=>setMenu(!menu.classList.contains('on')));
    menu.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false);});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('on')){setMenu(false);menuBtn.focus();}});
    /* xoay ngang sang khổ desktop thì menu ẩn bằng CSS — đóng luôn để
       trang không bị khoá cuộn */
    matchMedia('(min-width:960px)').addEventListener('change',e=>{if(e.matches)setMenu(false);});
  }

  /* ---------- hiện dần khi cuộn ---------- */
  let io=null;
  function reveal(root){
    const els=(root||document).querySelectorAll('.rv:not(.in)');
    if(!('IntersectionObserver' in window)){els.forEach(el=>el.classList.add('in'));return;}
    if(!io)io=new IntersectionObserver(es=>{
      es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
    },{threshold:.08,rootMargin:'0px 0px -6% 0px'});
    els.forEach(el=>io.observe(el));
  }
  reveal();

  const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- số chạy lên khi cuộn tới ----------
     <dd data-count="114" data-suffix="M+">114M+</dd> — chữ gốc nằm sẵn trong
     HTML (máy tắt JS vẫn đọc được), JS chỉ chạy lại từ 0 lúc nó hiện ra. */
  function count(root){
    if(REDUCED||!('IntersectionObserver' in window))return;
    const els=(root||document).querySelectorAll('[data-count]');
    const o=new IntersectionObserver(es=>es.forEach(e=>{
      if(!e.isIntersecting)return;o.unobserve(e.target);
      const el=e.target,to=+el.dataset.count,suf=el.dataset.suffix||'',t0=performance.now(),dur=1300;
      const fmt=v=>v>=1000?v.toLocaleString(lang==='vi'?'vi-VN':'en-US'):String(v);
      (function tick(t){const p=Math.min(1,(t-t0)/dur);el.textContent=fmt(Math.round(to*(1-Math.pow(1-p,3))))+suf;if(p<1)requestAnimationFrame(tick);})(t0);
    }),{threshold:.5});
    els.forEach(el=>o.observe(el));
  }

  /* ---------- nghiêng 3D theo chuột ----------
     Chỉ cho chuột thật: trên màn cảm ứng không có "rê", nghiêng theo ngón
     tay khi đang cuộn chỉ gây chóng mặt. */
  function tilt(sel,max){
    if(REDUCED||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
    max=max||9;
    document.querySelectorAll(sel).forEach(el=>{
      el.style.transition='transform .5s var(--ease)';
      el.addEventListener('pointermove',e=>{
        const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        el.style.transition='transform .08s linear';
        el.style.transform=`perspective(900px) rotateX(${(-y*max).toFixed(2)}deg) rotateY(${(x*max).toFixed(2)}deg) scale(1.02)`;
      });
      el.addEventListener('pointerleave',()=>{el.style.transition='transform .5s var(--ease)';el.style.transform='';});
    });
  }

  /* ---------- trường sóng 3D ở đầu trang con ----------
     Trang nào có <canvas class="field"> trong .page-hero và đã nạp
     assets/field.js (trước file này) thì tự bật; không vẽ được thì
     hoạ tiết SVG tĩnh vẫn ở đó. */
  (function(){
    const ph=document.querySelector('.page-hero'),cv=ph&&ph.querySelector('.field');
    if(!cv||!window.HKField)return;
    const phone=matchMedia('(max-width:759px)').matches;
    const f=HKField.mount(cv,{lite:true,pointer:ph,
      center:phone?[3,-26]:[15,-9],eye:phone?[0,14,30]:[0,12,26],target:phone?[0,-10,-14]:[0,-4,-18]});
    if(f)ph.classList.add('gl-on');
    ph.addEventListener('hk-gl-lost',()=>ph.classList.remove('gl-on'));
  })();

  window.HK={lang:bindLang,current:()=>lang,reveal:reveal,loadLang:loadLang,saveLang:saveLang,count:count,tilt:tilt,reduced:REDUCED};
})();
