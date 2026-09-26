(() => {
  'use strict';
  const api=window.LtopicAnalytics;if(!api)return;
  const available=api.available, version=window.LtopicConfig?.consentVersion||1;
  const key='ltopic-consent',ttl=180*24*60*60*1000;
  const en=document.documentElement.lang==='en';
  const t=en?{
    title:'Your privacy choices',intro:'With your permission, Google Analytics measures visits and Microsoft Clarity analyses browsing through heatmaps and session recordings. The contact form works without these tools.',
    accept:'Accept all',reject:'Reject all',settings:'Customise',save:'Save my choices',close:'Close',audience:'Audience measurement · Google Analytics',behavior:'Browsing analysis · Microsoft Clarity',privacy:'Privacy policy',saved:'Choices saved.'
  }:{title:'Vos choix de confidentialité',intro:'Avec votre accord, Google Analytics mesure les visites et Microsoft Clarity analyse la navigation par cartes thermiques et enregistrements de sessions. Le formulaire de contact fonctionne sans ces outils.',
    accept:'Tout accepter',reject:'Tout refuser',settings:'Personnaliser',save:'Enregistrer mes choix',close:'Fermer',audience:'Mesure d’audience · Google Analytics',behavior:'Analyse de navigation · Microsoft Clarity',privacy:'Politique de confidentialité',saved:'Choix enregistrés.'};
  function read(){try{const v=JSON.parse(localStorage.getItem(key));if(v?.version===version&&Date.now()-v.time<ttl&&v.time<=Date.now())return {analytics:v.analytics===true&&available.analytics,behavior:v.behavior===true&&available.behavior};}catch{}return null;}
  let choice=read();api.applyConsent(choice||{});
  if(!available.analytics&&!available.behavior)return;
  const banner=document.createElement('section');banner.className='consent-banner';banner.setAttribute('aria-label',t.title);
  const dialog=document.createElement('dialog');dialog.className='consent-dialog';dialog.setAttribute('aria-labelledby','consent-title');
  // All markup uses fixed translations; no user data is inserted.
  banner.innerHTML='<p>'+t.intro+'</p><div class="consent-actions"><button data-choice="reject">'+t.reject+'</button><button data-choice="accept">'+t.accept+'</button><button data-choice="settings">'+t.settings+'</button></div>';
  dialog.innerHTML='<h2 id="consent-title">'+t.title+'</h2><p>'+t.intro+'</p><label><input type="checkbox" name="analytics"> '+t.audience+'</label><label><input type="checkbox" name="behavior"> '+t.behavior+'</label><p><a href="privacy.html">'+t.privacy+'</a></p><div class="consent-actions"><button data-choice="reject">'+t.reject+'</button><button data-choice="accept">'+t.accept+'</button><button data-choice="save">'+t.save+'</button><button data-choice="close">'+t.close+'</button></div>';
  document.body.append(banner,dialog);banner.hidden=!!choice;
  const a=dialog.querySelector('[name="analytics"]'),b=dialog.querySelector('[name="behavior"]');
  a.disabled=!available.analytics;b.disabled=!available.behavior;
  function open(){a.checked=!!choice?.analytics;b.checked=!!choice?.behavior;dialog.showModal();}
  function save(value){choice={analytics:!!value.analytics&&available.analytics,behavior:!!value.behavior&&available.behavior};try{localStorage.setItem(key,JSON.stringify({...choice,time:Date.now(),version}));}catch{}banner.hidden=true;dialog.close();api.applyConsent(choice);}
  function click(event){const action=event.target.closest('[data-choice]')?.dataset.choice;
    if(action==='accept')save({analytics:true,behavior:true});
    if(action==='reject')save({});
    if(action==='settings')open();
    if(action==='save')save({analytics:a.checked,behavior:b.checked});
    if(action==='close')dialog.close();
  }
  banner.addEventListener('click',click);dialog.addEventListener('click',click);
  document.querySelectorAll('[data-consent-settings]').forEach(button=>{button.hidden=false;button.addEventListener('click',open);});
  window.addEventListener('storage',event=>{if(event.key===key){choice=read();banner.hidden=!!choice;api.applyConsent(choice||{});}});
})();
