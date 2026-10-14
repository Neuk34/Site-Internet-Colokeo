'use strict';
const products={
piloter:{eyebrow:"Vue d’ensemble",title:"Les priorités, dès l’ouverture.",description:"Loyers du mois, chambres occupées, documents et échéances : vous savez où porter votre attention.",points:["Voir les montants enregistrés et les restes à suivre","Repérer les pièces et échéances à traiter","Ouvrir la fiche concernée depuis le tableau de bord"],image:"assets/screens/screen-1.png",alt:"Vue d’ensemble : priorités et situation de la colocation"},
loyers:{eyebrow:"Revenus et charges",title:"Chaque paiement retrouve sa place.",description:"Suivez les loyers par chambre, les dépenses et les justificatifs. Les quittances et les reçus s’inscrivent dans le parcours de paiement.",points:["Retrouver l’historique par locataire et par mois","Préparer une quittance quand le mois est soldé","Distinguer les loyers, les charges et les dépenses"],image:"assets/screens/screen-14.png",alt:"Revenus et charges Colokéo : encaissements, dépenses et solde mensuel"},
documents:{eyebrow:"Documents du bien et des locataires",title:"Les pièces que vous cherchez sont déjà réunies.",description:"Les documents sont classés et rattachés à leur dossier. La lecture automatique propose les informations utiles, que vous vérifiez avant de les appliquer.",points:["Regrouper les baux, assurances, garanties et quittances","Retrouver les documents par catégorie et locataire","Contrôler les informations proposées après analyse"],image:"assets/screens/screen-17.png",alt:"Bibliothèque documentaire Colokéo : catégories, locataires et statuts"},
bail:{eyebrow:"Préparation du bail",title:"Un parcours avant la signature.",description:"Les informations du bien et du locataire servent à préparer le bail. Les contrôles exposent les sujets à examiner avant son envoi.",points:["Rassembler les données et les pièces du dossier","Prévisualiser le bail préparé","Examiner la garantie, l’identité, l’assurance et les diagnostics"],image:"assets/screens/screen-23.png",alt:"Préparation du bail Colokéo : dossier, version générée et points à vérifier"},
fiscal:{eyebrow:"Comptabilité et fiscalité",title:"Votre gestion nourrit la préparation de l’année.",description:"Loyers, charges, crédit, travaux et meubles alimentent la préparation comptable. Les calculs et formulaires restent des brouillons à vérifier avant déclaration.",points:["Retrouver les recettes et les dépenses de l’année","Examiner les calculs et les contrôles proposés","Préparer le dossier avant votre propre dépôt fiscal"],image:"assets/screens/screen-19.png",alt:"Module Mon année : calculs et contrôles avant préparation de la déclaration"}
};
const tabs=Array.from(document.querySelectorAll('[data-product]'));
function selectProduct(key){
 const data=products[key]; if(!data)return;
 document.getElementById('product-eyebrow').textContent=data.eyebrow;
 document.getElementById('product-title').textContent=data.title;
 document.getElementById('product-description').textContent=data.description;
 const points=document.getElementById('product-points');points.replaceChildren();
 data.points.forEach(text=>{const li=document.createElement('li');li.textContent=text;points.append(li)});
 const img=document.getElementById('product-image');img.src=data.image;img.alt=data.alt;
 const opener=document.getElementById('product-open');opener.dataset.image=data.image;opener.dataset.title=data.eyebrow;
 opener.setAttribute('aria-label','Agrandir : '+data.eyebrow);
 document.getElementById('product-panel').setAttribute('aria-labelledby','tab-'+key);
 tabs.forEach(tab=>{const active=tab.dataset.product===key;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1});
}
tabs.forEach(tab=>{tab.addEventListener('click',()=>selectProduct(tab.dataset.product));tab.addEventListener('keydown',event=>{
 let index=tabs.indexOf(tab);
 if(event.key==='ArrowRight')index=(index+1)%tabs.length;
 else if(event.key==='ArrowLeft')index=(index+tabs.length-1)%tabs.length;
 else if(event.key==='Home')index=0;
 else if(event.key==='End')index=tabs.length-1;
 else return;
 event.preventDefault();selectProduct(tabs[index].dataset.product);tabs[index].focus();
})});
const toggle=document.querySelector('.menu-toggle');const mobile=document.getElementById('mobile-nav');
function closeMenu(){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Ouvrir le menu');mobile.hidden=true}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');mobile.hidden=!open});
mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobile.hidden){closeMenu();toggle.focus()}});
document.addEventListener('click',event=>{if(!mobile.hidden&&!event.target.closest('header'))closeMenu()});
const desktopQuery=window.matchMedia('(min-width:851px)');desktopQuery.addEventListener('change',event=>{if(event.matches)closeMenu()});
const dialog=document.getElementById('screen-dialog');let lastOpener=null;
document.querySelectorAll('[data-image]').forEach(opener=>opener.addEventListener('click',()=>{
 if(typeof dialog.showModal!=='function'){window.open(opener.dataset.image,'_blank','noopener');return}
 lastOpener=opener;document.getElementById('dialog-title').textContent=opener.dataset.title;
 const image=document.getElementById('dialog-image');image.src=opener.dataset.image;image.alt=opener.dataset.title+' — capture agrandie de démonstration';
 dialog.showModal();document.body.classList.add('dialog-open');document.getElementById('dialog-close').focus();
}));
document.getElementById('dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close()}});
dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');if(lastOpener)lastOpener.focus()});
document.getElementById('year').textContent=new Date().getFullYear();
// Sans collecte marketing : les attributs data-conversion identifient les emplacements
// pour un futur raccordement, après choix de la mesure et de sa politique de confidentialité.
