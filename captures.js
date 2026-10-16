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
const gallery=document.createElement('section');
gallery.className='capture-gallery';
gallery.setAttribute('aria-labelledby','capture-gallery-title');
const galleryTitle=document.createElement('h3');
galleryTitle.id='capture-gallery-title';galleryTitle.textContent='Le produit, page par page';gallery.append(galleryTitle);
const note=document.createElement('p');note.className='gallery-note';
note.textContent='17 pages capturées le 16 octobre 2026 avec le jeu de démonstration existant, dans un compte local isolé. Les noms, coordonnées et dossiers sont fictifs. Chaque aperçu provient d’une capture desktop de 1440 × 1000 ; ouvre la page complète pour lire tous les détails. Les états vides sont conservés.';
gallery.append(note);
const grid=document.createElement('div');grid.className='capture-grid';gallery.append(grid);
function openDemoCapture(src,title,trigger){
 const dialog=document.getElementById('capture-dialog');
 document.getElementById('capture-title').textContent=title;
 const image=document.getElementById('capture-image');image.src=src;image.alt=title;
 dialog.showModal();document.body.classList.add('modal-open');
 dialog.addEventListener('close',()=>trigger.focus(),{once:true});
}
for(const [slug,title,caption] of demoCaptures){
 const figure=document.createElement('figure');figure.className='capture-card';figure.dataset.page=slug;
 const button=document.createElement('button');button.type='button';button.className='capture-open';button.setAttribute('aria-label',`Agrandir la page complète : ${title}`);
 const image=document.createElement('img');image.src=capturePath(slug);image.alt=`${title} — capture réelle sur données fictives`;image.width=1440;image.height=1000;image.loading='lazy';image.decoding='async';button.append(image);
 button.addEventListener('click',()=>openDemoCapture(capturePath(slug,'full'),`${title} · données fictives`,button));figure.append(button);
 const legend=document.createElement('figcaption');const badge=document.createElement('span');badge.className='capture-badge';badge.textContent='CAPTURE DU PRODUIT · DÉMONSTRATION';legend.append(badge);
 const heading=document.createElement('h4');heading.textContent=title;legend.append(heading);
 const description=document.createElement('p');description.textContent=caption;legend.append(description);
 const links=document.createElement('div');links.className='capture-links';
 for(const [variant,label] of [['desktop','Desktop 1440 × 1000'],['full','Page complète']]){
  const a=document.createElement('a');a.href=capturePath(slug,variant);a.textContent=label;a.target='_blank';a.rel='noopener';links.append(a);
 }
 legend.append(links);figure.append(legend);grid.append(figure);
}
document.querySelector('#produit .mini-features').replaceWith(gallery);
const actualPanels={
 loyers:['loyers','Suis les loyers.\nLis la situation du mois.','Le jeu fictif permet de voir les loyers attendus et les encaissements, sans utiliser les comptes de vrais locataires.',['Situation mensuelle des loyers','Dossiers et montants du jeu de démonstration','Capture complète accessible ci-dessous']],
 bail:['baux','Consulte le bail.\nRepère ce qui manque.','Le dossier d’Emma montre les conditions enregistrées et les contrôles de garantie. Aucune version générée n’est présente dans ce jeu.',['Loyer, charges et dépôt de garantie','Conditions déclarées et champs manquants','Contrôles de cohérence de la garantie']],
 documents:['documents','Retrouve les pièces.\nGarde leur contexte.','La bibliothèque présente les neuf pièces fictives déjà présentes dans le jeu de démonstration.',['Mises en demeure et état des lieux','Attestation et décompte du dépôt','Recherche et filtres visibles dans la capture']],
 fiscal:['comptabilite-fiscalite','Démarre la comptabilité.\nFixe ton point de départ.','Le jeu existant s’ouvre sur le démarrage de la comptabilité. Aucun résultat fiscal finalisé n’a été ajouté pour cette présentation.',['Écran « Mon année »','Explication du démarrage en trois questions','Commande « Commencer »']]
};
for(const [key,[slug,title,description,checks]] of Object.entries(actualPanels)){
 Object.assign(productData[key],{title,description,checks,image:capturePath(slug),caption:demoCaptures.find(c=>c[0]===slug)[1]+' · capture réelle sur données fictives',alt:demoCaptures.find(c=>c[0]===slug)[2]});
}
selectProduct('loyers');
document.getElementById('product-image').width=1440;document.getElementById('product-image').height=1000;
const hero=document.querySelector('.hero-capture');
if(hero){hero.dataset.capture=capturePath('vue-ensemble','full');hero.dataset.caption='Vue d’ensemble · capture réelle sur données fictives';const img=hero.querySelector('img');img.src=capturePath('vue-ensemble');img.width=1440;img.height=1000;img.alt=demoCaptures[0][2];}
const portal=document.querySelector('#portail');
if(portal){
 const badge=portal.querySelector('.status-pill');if(badge)badge.textContent='MAQUETTE — NON PUBLIÉE';
 const frame=portal.querySelector('iframe');if(frame)frame.title='Maquette du futur portail candidat et locataire — non publiée, actions simulées';
 const caption=portal.querySelector('.portal-caption');if(caption)caption.textContent='Maquette non publiée · actions simulées · données fictives. Cet aperçu est distinct des captures du produit ci-dessus.';
 const future=portal.querySelector('.future-note');if(future){const p=future.querySelector('p:not(.status-pill)');if(p)p.textContent='Cette maquette présente une interface prévue pour le parcours candidat et locataire. Elle n’est pas publiée ni connectée au produit ; les actions de l’aperçu sont simulées.';}
}
