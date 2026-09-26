(() => {
  'use strict';
  const c = window.LtopicConfig || {};
  const ga = /^G-[A-Z0-9]+$/.test(c.ga4Id || '') ? c.ga4Id : '';
  const clarityId = /^[a-z0-9]{6,20}$/.test(c.clarityId || '') ? c.clarityId : '';
  const page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '');
  const language = document.documentElement.lang === 'en' ? 'en' : 'fr';
  const knownPages = ['index','services','vision','concept','contact','privacy'];
  const safePage = knownPages.includes(page) ? page : 'other';
  const contact = safePage === 'contact';
  let consent = {analytics:false,behavior:false}, gaLoaded = false, clarityLoaded = false, viewed = false;
  const sentOnce = new Set();
  const names = new Set(['page_view','view_services','contact_click','cta_click','email_click','phone_click','form_view','form_start','form_submit_attempt','form_error','generate_lead']);
  function cleanParams(params = {}) {
    const result = {page_name:safePage,site_language:language};
    for (const key of ['cta_id','placement','form_id','error_type']) {
      const value = params[key];
      const allowed = {
        cta_id:['contact','services','vision','concept','email','phone'],
        placement:['header','hero','content','footer','pagination'],
        form_id:['contact'],
        error_type:['network','timeout','rejected','configuration']
      };
      if (allowed[key].includes(value)) result[key] = value;
    }
    return result;
  }
  function tag(){ window.dataLayer.push(arguments); }
  function track(name, params, onceKey) {
    if (!names.has(name) || !gaLoaded || !consent.analytics || window['ga-disable-'+ga]) return false;
    if (onceKey && sentOnce.has(onceKey)) return false;
    if (onceKey) sentOnce.add(onceKey);
    tag('event', name, {...cleanParams(params),send_to:ga});
    return true;
  }
  function inject(src) {
    const script=document.createElement('script'); script.async=true;script.src=src;document.head.append(script);
  }
  function apply(next) {
    const revoke = (consent.analytics && !next.analytics) || (consent.behavior && !next.behavior);
    consent={analytics:!!next.analytics,behavior:!!next.behavior};
    if(ga) window['ga-disable-'+ga]=!consent.analytics;
    if(ga && consent.analytics && !gaLoaded) {
      gaLoaded=true;window.dataLayer=window.dataLayer||[];
      tag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
      tag('consent','update',{analytics_storage:'granted'});
      tag('js',new Date());
      // Only canonical paths and referrer origins; never URLs containing form values or arbitrary query strings.
      let referrer='';try {referrer=new URL(document.referrer).origin;} catch {}
      tag('config',ga,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,
        page_location:location.origin+(language==='en'?'/en/':'/')+(safePage==='other'?'':safePage+'.html'),
        page_referrer:referrer,page_title:'Ltopic — '+safePage});
      inject('https://www.googletagmanager.com/gtag/js?id='+ga);
      track('page_view',{},'page');
      if(safePage==='services')track('view_services',{},'services');
      if(viewed)track('form_view',{form_id:'contact'},'form_view');
    } else if(gaLoaded) tag('consent','update',{analytics_storage:consent.analytics?'granted':'denied'});
    // Never load recordings on Contact or on URLs with query strings/fragments.
    if(clarityId && consent.behavior && !contact && !location.search && !location.hash && !clarityLoaded) {
      clarityLoaded=true;
      window.clarity=window.clarity||function(){(window.clarity.q=window.clarity.q||[]).push(arguments);};
      window.clarity('consentv2',{ad_Storage:'denied',analytics_Storage:'granted'});
      inject('https://www.clarity.ms/tag/'+clarityId);
    }
    if(revoke) {
      clearCookies();
      // Unload an already-running recorder completely. Contact never has one, so entered text is preserved.
      if(clarityLoaded) location.reload();
    }
  }
  function clearCookies() {
    const domains=['',location.hostname,'.'+location.hostname,'.ltopic.ai'];
    const paths=['/','/en'];
    for(const cookie of document.cookie.split(';')) {
      const name=cookie.split('=')[0].trim();
      if(!/^(_ga(?:_|$)|_gid$|_gat|_clck$|_clsk$)/.test(name))continue;
      for(const domain of domains)for(const path of paths)document.cookie=name+'=; Max-Age=0; Path='+path+(domain?'; Domain='+domain:'')+'; SameSite=Lax; Secure';
    }
  }
  window.LtopicAnalytics=Object.freeze({track,applyConsent:apply,available:Object.freeze({analytics:!!ga,behavior:!!clarityId})});
  document.addEventListener('click',event=>{
    const a=event.target.closest('a');if(!a)return;
    let type=a.dataset.track;
    if(!type)return;
    const place=a.closest('header')?'header':a.closest('footer')?'footer':a.closest('.page-navigation')?'pagination':a.closest('.hero')?'hero':'content';
    track(type==='contact'?'contact_click':type==='email'?'email_click':type==='phone'?'phone_click':'cta_click',{cta_id:type,placement:place});
  });
  const form=document.getElementById('contact-form');
  if(form) {
    form.addEventListener('input',()=>track('form_start',{form_id:'contact'},'form_start'));
    if('IntersectionObserver' in window) {
      const observer=new IntersectionObserver(entries=>{
        if(entries.some(e=>e.isIntersecting)){viewed=true;track('form_view',{form_id:'contact'},'form_view');observer.disconnect();}
      },{threshold:.2});observer.observe(form);
    }
  }
})();
