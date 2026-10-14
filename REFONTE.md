# Colokéo — proposition de valeur et refonte commerciale

## Proposition et formulation

Proposition donnée par Nicolas : « Automatise la gestion de ta colocation en garantissant la conformité juridique et fiscale en cas de pépin. »

La page place au premier plan l’automatisation, la conformité juridique/fiscale et la préparation aux imprévus. Formulation publique retenue : « Automatise ta gestion. Sécurise ta conformité. » Sous-titre : « Automatise la gestion de ta colocation. Sécurise ta conformité juridique et fiscale. Sois prêt en cas de pépin. »

Le mot « garantir » n’est pas transformé en une garantie contractuelle ou d’indemnisation : le code examiné montre des contrôles, des pièces et des calculs fiscaux en brouillon. Aucune garantie complète n’a été démontrée. L’objectif de conformité est central, avec des limites explicites sur la couverture et le dépôt fiscal.

## Principes de marketing appliqués

- Clarté immédiate : une cible, un bénéfice et une prochaine étape.
- Langage du propriétaire : assurance, bail, garanties, paiements, justificatifs, pépin.
- Démonstration avant engagement : parcours d’inscription existant, avec jeu fictif choisi par l’utilisateur.
- Preuve produit : captures existantes et anonymisées, recadrées sans modifier les textes ou chiffres.
- Objections traitées à proximité de la décision : prix indicatif, documents non nécessaires pour explorer, distinction portail publié/prototype, prestataires externes, fiscalité en brouillon.
- Pas de faux témoignage, de chiffre de gain inventé, de certification ou de partenaires fictifs.

Sources primaires consultées le 14 octobre 2026 :
- Nielsen Norman Group, Homepage Design: 5 Fundamental Principles : https://www.nngroup.com/articles/homepage-design-principles/
- CXL, SaaS Homepages: Is Yours as Optimized as You Think? : https://cxl.com/blog/saas-homepage-optimization/
- CXL, Building a B2B landing page infrastructure : https://cxl.com/blog/landing-page-infrastructure/

Ces principes guident la conception ; ils ne prouvent pas que la nouvelle page augmente les ventes. Le résultat doit être mesuré sur les visiteurs et clients Colokéo.

## Sources produit

Application : Neuk34/Colokeo-SaaS, tête main observée 6e35b4865ec244398fd3dc7da10094d9f4594f53.
Vitrine : Neuk34/Site-Internet-Colokeo, captures du commit dbaa71291f831b0d6a4dcbfaed0b90cf7eda6f59, dont le message précise l’anonymisation des noms, adresses et coordonnées.
Code relu : universal_import.py, accounts/service.py, connexion_web/app.py et inscription.html, rent_month_page.py, presignature/checks.py, protection/visale.py, cafcertificate/service.py, accounting_page.py, portal_web/app.py et vues.py. Références des connecteurs : connexion-bancaire-ponto.md et signature-yousign.md.

La présence du code ne vaut pas recette ou activation de la production.

## Portail validé, non publié

Source : colokeo-portail-valide-2026-10-14.zip, référence approuvée par Nicolas le 14 octobre 2026. L’archive a été récupérée et son fichier de référence lu pendant cette tâche.
La maquette originale est reprise dans portail-reference.html ; portail-apercu.html la présente sur l’accueil locataire. Les quatre onglets, la charte et les icônes sont conservés.
Les pages identifient explicitement cette interface comme non publiée et non connectée. Les parcours de candidature, visite et arrivée de la maquette ne sont pas vendus comme disponibles. Le portail actuel et ses fonctions sont décrits séparément.

## Captures

Cinq images du produit, recadrées pour retirer la navigation latérale et améliorer la lisibilité : pilotage, loyers, documents, préparation du bail, préparation fiscale. Conversion WebP ; aucun texte ni montant modifié. Voir assets/screens/provenance.json.
Le portail est un aperçu HTML interactif exact de la maquette validée, pas une nouvelle capture prétendument issue de la production. Les outils de navigateur de cette session n’ont pas permis de produire de nouvelles captures automatisées. La carte de partage social est une composition du logo, du message et d’une capture existante.

## Validation et publication

Syntaxe JavaScript, ressources locales, ancres, cibles JavaScript et unicité des identifiants vérifiées. Le tutoiement est cohérent. Les routes d’inscription et juridiques sont celles du code existant ; leur accessibilité en production reste à vérifier.
Le rendu réel ordinateur/mobile et les interactions doivent encore être examinés dans un navigateur : l’outil local ne s’est pas initialisé et Chrome n’a pas produit de capture pendant cette session.
La publication privée Sites a été tentée sur l’identité existante ; la préparation de la source a échoué. Aucun déploiement réussi n’est revendiqué.
Les mentions légales applicatives contiennent des informations à compléter. Finaliser ces textes et confirmer l’offre avant publication publique. Le prix de 24,90 € reste explicitement indicatif.

## Plan de mesure

Suivre les visites pertinentes, les accès à l’inscription, les comptes confirmés avec jeu fictif, l’utilisation de la démo, le passage à une vraie colocation et les abonnements payants. Les attributs data-conversion repèrent les emplacements ; aucun pixel ni collecte marketing n’est activé par la vitrine.
Premiers tests proposés : promesse conformité au hero ; lien vers l’essai autonome ; preuve par situation (impayé/sinistre/fiscalité). Comparer une hypothèse à la fois si le volume de trafic permet une conclusion ; sinon utiliser des entretiens et observations de prise en main.
