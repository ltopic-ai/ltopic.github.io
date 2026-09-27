(() => {
  'use strict';
  const form=document.getElementById('contact-form');if(!form)return;
  const endpoint=window.LtopicConfig?.formEndpoint||'';
  const allowed=/^https:\/\/formsubmit\.co\/ajax\/[a-f0-9]{32}$/i.test(endpoint);
  const button=form.querySelector('[type="submit"]'),fieldset=form.querySelector('fieldset'),status=document.getElementById('contact-status'),notice=document.getElementById('mail-help');
  const en=document.documentElement.lang==='en';
  const t=en?{send:'Send my enquiry',sending:'Sending…',success:'Your enquiry has been accepted by our delivery service. Thank you. We will get back to you.',error:'Your enquiry could not be sent. Your text is preserved; please try again later.',uncertain:'We could not confirm delivery. Your enquiry may have been accepted. Your text is preserved; avoid sending it again immediately.',busy:'Sending your enquiry…',privacy:'Your details are used to respond to your enquiry and are never included in analytics events.'}:{send:'Envoyer ma demande',sending:'Envoi en cours…',success:'Votre demande a été acceptée par notre service d’envoi. Merci, nous reviendrons vers vous.',error:'Votre demande n’a pas pu être envoyée. Votre texte est conservé ; réessayez plus tard.',uncertain:'Nous n’avons pas pu confirmer l’envoi. Votre demande a peut-être été acceptée. Votre texte est conservé ; évitez de la renvoyer immédiatement.',busy:'Envoi de votre demande…',privacy:'Vos coordonnées servent à répondre à votre demande et ne sont jamais incluses dans les événements Analytics.'};
  let pending=false,submitted=false;
  const track=(name,params={},once)=>window.LtopicAnalytics?.track(name,{form_id:'contact',...params},once);
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(!allowed||pending||submitted||!form.reportValidity())return;
    const honey=form.querySelector('[name="_honey"]');if(honey?.value)return;
    const payload={};for(const key of ['Demande','Nom','Poste','Entreprise','email','Telephone'])payload[key]=form.elements.namedItem(key).value.trim();
    payload._subject='Ltopic — Nouvelle demande';payload._template='table';
    pending=true;button.disabled=true;button.textContent=t.sending;status.textContent=t.busy;form.setAttribute('aria-busy','true');
    track('form_submit_attempt');
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
    try {
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(payload),signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer'});
      const result=await response.json();
      if(!response.ok||!(result.success===true||result.success==='true')){track('form_error',{error_type:'rejected'});status.textContent=t.error;return;}
      submitted=true;fieldset.disabled=true;status.textContent=t.success;track('generate_lead',{},'contact-success');
    }catch(error){status.textContent=t.uncertain;track('form_error',{error_type:error.name==='AbortError'?'timeout':'network'});}
    finally{clearTimeout(timeout);pending=false;form.removeAttribute('aria-busy');button.disabled=submitted;button.textContent=submitted?(en?'Enquiry sent':'Demande envoyée'):t.send;}
  });
  if(!allowed)return;
  fieldset.disabled=false;button.disabled=false;button.textContent=t.send;notice.textContent=t.privacy;
})();
