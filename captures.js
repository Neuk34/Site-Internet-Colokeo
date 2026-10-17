'use strict';
// Captures Playwright réelles, compte local créé avec le jeu livré par Colokéo.
const demoCaptures = [
 ['vue-ensemble','Vue d’ensemble','Occupation, encaissements du mois, actions à traiter et prochaines échéances pour Maison Angers.'],
 ['ma-colocation','Ma colocation','Identité du bien, bailleur fictif et pièces du dossier : les informations manquantes et les diagnostics à vérifier restent signalés.'],
 ['locataires','Locataires','Les cinq dossiers fictifs, leur chambre, leur statut et les étapes bail, dépôt, assurance et état des lieux.'],
 ['fiches-locataires','Fiches locataires','Dossier d’Emma : coordonnées fictives, situation du parcours, dépôt restitué, assurance et état des lieux. Les onglets donnent accès à l’état civil, à la garantie et aux documents.'],
 ['baux','Baux','Conditions du bail d’Emma, loyer, charges, dépôt et contrôles de garantie. Le jeu ne contient aucune version de bail générée pour ce dossier.'],
 ['depots-garantie','Dépôts de garantie','Dépôt d’Emma : 600 € versés, 480 € remboursés et une retenue de 120 € pour la peinture. Le statut et l’historique de restitution sont visibles.'],
 ['etats-lieux','États des lieux','État des lieux d’entrée finalisé d’Emma : six espaces renseignés, accès aux compteurs et aux médias. Aucune photo n’est jointe.'],
 ['chambres','Chambres','Chambre 2 : caractéristiques, équipements, loyer et locataire fictif Thomas Martin.'],
 ['parties-communes','Parties communes','Cuisine sélectionnée parmi les trois pièces communes : attribution de la semaine et accès au planning. Aucun équipement ni tâche d’entretien n’est configuré.'],
 ['planning-entretien','Planning d’entretien','Répartition hebdomadaire de la cuisine, du salon et de la salle de bain entre les locataires. Aucune tâche détaillée n’est configurée.'],
 ['revenus-charges','Revenus et charges','Encaissements, solde mensuel, évolution annuelle et deux écritures d’octobre. Aucune dépense n’est réglée dans ce jeu.'],
 ['loyers','Loyers','Cinq échéances d’octobre, dont une payée : montants, statuts et commandes d’encaissement et de génération de quittance. Aucune quittance n’est encore générée.'],
 ['charges','Charges','Indicateurs, filtres et commande d’ajout d’une charge. Le jeu existant ne contient aucune dépense pour octobre 2026.'],
 ['sinistres-impayes','Sinistres et impayés','Quatre dossiers d’impayés avec montants et prochaine étape de suivi. Aucun sinistre n’est déclaré.'],
 ['travaux-entretiens','Travaux et entretiens','Commandes de création d’une intervention et d’un entretien périodique. Le jeu existant ne contient aucune intervention ni aucun entretien suivi.'],
 ['documents','Documents','Neuf pièces fictives : mises en demeure, état des lieux et documents de dépôt. Recherche et filtres par catégorie, locataire, année et statut.'],
 ['comptabilite-fiscalite','Comptabilité et fiscalité','Écran de démarrage de la comptabilité. Le compte de démonstration n’est pas initialisé : aucun calcul ni formulaire fiscal finalisé n’est montré.']
];
const capturePath=(slug,variant='desktop')=>`assets/screens/demo-20261016/${slug}-${variant}.webp`;
const captureGroups=[
 {id:'pilotage',label:'Pilotage',pages:['vue-ensemble','ma-colocation']},
 {id:'locataires',label:'Locataires',pages:['locataires','fiches-locataires','baux','depots-garantie','etats-lieux']},
 {id:'logement',label:'Logement',pages:['chambres','parties-communes','planning-entretien','travaux-entretiens']},
 {id:'finances',label:'Finances',pages:['revenus-charges','loyers','charges','sinistres-impayes','comptabilite-fiscalite']},
 {id:'documents',label:'Documents',pages:['documents']}
];
const categoryNav=document.getElementById('capture-categories');
const pageNav=document.getElementById('capture-pages');
const categoryPanel=document.getElementById('capture-category-panel');
let currentGroup=null;
function showCapture(slug){
 const data=demoCaptures.find(c=>c[0]===slug);
 const group=captureGroups.find(g=>g.pages.includes(slug));
 if(!data||!group)return;
 if(currentGroup!==group.id){
  currentGroup=group.id;pageNav.replaceChildren();pageNav.hidden=group.pages.length===1;
  for(const pageSlug of group.pages){
   const button=document.createElement('button');button.type='button';
   button.dataset.capturePage=pageSlug;button.textContent=demoCaptures.find(c=>c[0]===pageSlug)[1];
   button.addEventListener('click',()=>showCapture(pageSlug));pageNav.append(button);
  }
 }
 categoryNav.querySelectorAll('button').forEach(button=>{
  const active=button.dataset.captureGroup===group.id;
  button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;
 });
 categoryPanel.setAttribute('aria-labelledby','capture-group-'+group.id);
 pageNav.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.capturePage===slug)));
 document.getElementById('showcase-title').textContent=data[1];
 document.getElementById('showcase-description').textContent=data[2];
 const image=document.getElementById('showcase-image');
 image.src=capturePath(slug);image.alt=data[1]+' — capture réelle sur données fictives';
 const opener=document.getElementById('showcase-open');
 opener.dataset.capture=capturePath(slug,'full');opener.dataset.caption=data[1]+' · données fictives';
 opener.setAttribute('aria-label','Agrandir la page complète : '+data[1]);
 document.getElementById('showcase-caption').textContent=data[1]+' · capture desktop 1440 × 1000';
 document.getElementById('showcase-desktop').href=capturePath(slug);
 document.getElementById('showcase-full').href=capturePath(slug,'full');
 categoryPanel.dataset.activePage=slug;
}
for(const group of captureGroups){
 const button=document.createElement('button');button.type='button';button.id='capture-group-'+group.id;
 button.dataset.captureGroup=group.id;button.setAttribute('role','tab');button.setAttribute('aria-controls','capture-category-panel');
 const label=document.createElement('span');label.textContent=group.label;
 const count=document.createElement('span');count.className='capture-count';count.textContent=group.pages.length;
 button.append(label,count);button.addEventListener('click',()=>showCapture(group.pages[0]));
 button.addEventListener('keydown',event=>{
  const buttons=[...categoryNav.querySelectorAll('button')];let index=buttons.indexOf(button);
  if(event.key==='ArrowRight')index=(index+1)%buttons.length;
  else if(event.key==='ArrowLeft')index=(index+buttons.length-1)%buttons.length;
  else if(event.key==='Home')index=0;else if(event.key==='End')index=buttons.length-1;else return;
  event.preventDefault();buttons[index].click();buttons[index].focus();
 });categoryNav.append(button);
}
// Les liens de la vitrine gardent leur accès direct au bon écran.
window.selectProduct=key=>showCapture(({loyers:'loyers',bail:'baux',documents:'documents',fiscal:'comptabilite-fiscalite'})[key]||key);
showCapture('vue-ensemble');
const hero=document.querySelector('.hero-capture');
if(hero){hero.dataset.capture=capturePath('vue-ensemble','full');hero.dataset.caption='Vue d’ensemble · capture réelle sur données fictives';const img=hero.querySelector('img');img.src=capturePath('vue-ensemble');img.width=1440;img.height=1000;img.alt=demoCaptures[0][2];}
const portal=document.querySelector('#portail');
if(portal){
 const badge=portal.querySelector('.status-pill');if(badge)badge.textContent='MAQUETTE — NON PUBLIÉE';
 const frame=portal.querySelector('iframe');if(frame)frame.title='Maquette du futur portail candidat et locataire — non publiée, actions simulées';
 const caption=portal.querySelector('.portal-caption');if(caption)caption.textContent='Maquette non publiée · actions simulées · données fictives. Cet aperçu est distinct des captures du produit ci-dessus.';
 const future=portal.querySelector('.future-note');if(future){const p=future.querySelector('p:not(.status-pill)');if(p)p.textContent='Cette maquette présente une interface prévue pour le parcours candidat et locataire. Elle n’est pas publiée ni connectée au produit ; les actions de l’aperçu sont simulées.';}
}
