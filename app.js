'use strict';
document.querySelectorAll('[data-select]').forEach(a=>a.addEventListener('click',()=>window.selectProduct?.(a.dataset.select)));
const toggle=document.querySelector('.menu-button'),menu=document.getElementById('mobile-nav');
function closeMenu(){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Ouvrir le menu');menu.hidden=true}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');menu.hidden=!open});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){closeMenu();toggle.focus()}});
document.addEventListener('click',e=>{if(!menu.hidden&&!e.target.closest('.site-header'))closeMenu()});
window.matchMedia('(min-width:901px)').addEventListener('change',e=>{if(e.matches)closeMenu()});
const dialog=document.getElementById('capture-dialog');let lastOpener=null;
document.querySelectorAll('[data-capture]').forEach(opener=>opener.addEventListener('click',()=>{if(typeof dialog.showModal!=='function'){window.open(opener.dataset.capture,'_blank','noopener');return}lastOpener=opener;document.getElementById('capture-title').textContent=opener.dataset.caption;const image=document.getElementById('capture-image');image.src=opener.dataset.capture;image.alt=opener.dataset.caption;dialog.showModal();document.body.classList.add('modal-open');document.getElementById('capture-close').focus()}));
document.getElementById('capture-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close()}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');lastOpener?.focus()});
document.getElementById('year').textContent=new Date().getFullYear();
// data-conversion repère les emplacements. Aucun pixel publicitaire ou envoi
// de données n'est activé par cette vitrine.

