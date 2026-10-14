# Refonte commerciale Colokéo — 14 octobre 2026

## Objectif et parcours
Faire comprendre la valeur du produit, puis conduire vers l’inscription et l’utilisation du jeu fictif déjà implémenté. Nicolas a précisé que « demande de démo » désigne ce parcours autonome, pas un rendez-vous commercial.

CTA : https://app.colokeo.fr/inscription. À ce jour, la page GET ne lit pas de paramètre de présélection de la démo : la vitrine indique explicitement de cocher le jeu de données fictives. Aucun paramètre fictif ni formulaire intermédiaire ajouté.

## Étude menée
Lecture du code de la branche main de Neuk34/Colokeo-SaaS, des références de déploiement et des connecteurs ; inspection du site Neuk34/Site-Internet-Colokeo et de cinq captures produit. L’étude porte sur l’implémentation disponible dans Git, pas sur une recette de la production.
Tête applicative observée : 6e35b4865ec244398fd3dc7da10094d9f4594f53.
Base du site observée : dbaa71291f831b0d6a4dcbfaed0b90cf7eda6f59.

| Fonction | Preuve examinée | Traduction commerciale |
|---|---|---|
| Démonstration autonome | accounts/service.py, accounts/demonstration.py, connexion_web/app.py, templates/inscription.html | Inscription, choix des données fictives, découverte avant saisie réelle |
| Loyers et quittances | ui/rent_month_page.py | Paiements, historique mensuel, quittances lorsque le mois est soldé |
| Lecture et validation documentaire | application existante, interface documents, plan de migration | Informations proposées puis vérifiées par le bailleur |
| Contrôles avant signature | presignature/checks.py, ui/presignature_section.py | Dossier, bail, garanties, identité, assurance et diagnostics |
| Vérifications Visale | protection/visale.py, protection/lease_audits.py | Examen des pièces, montants et chronologie ; aucune promesse de couverture |
| Attestation CAF | cafcertificate/service.py | Fonction disponible identifiée ; pas utilisée comme argument principal du hero |
| Portail locataire | portal_web/app.py, portal_web/vues.py | Loyers, documents, ménage, logement, signalements, départ et photos EDL |
| Préparation comptable | ui/accounting_page.py, docs/comptabilite-fiscalite-lot2.md | Calculs et formulaires en brouillon, à vérifier avant dépôt |
| Banque et signature | docs/connexion-bancaire-ponto.md, docs/signature-yousign.md | Connecteurs conditionnés à activation et conditions des fournisseurs |

## Choix de refonte
- Identité officielle : logo, Geist, #594CFB, #071C50, #00C898.
- Une seule conversion principale : essayer avec la colocation fictive.
- Cinq parcours de produit illustrés par les captures existantes, affichage au clavier et agrandissement.
- Une section dédiée au contrôle du dossier ; pas de « conformité garantie ».
- Portail présenté comme fonction, avec une illustration HTML explicitement identifiée.
- Aucun faux avis, chiffre d’économie, client, certification ou gratuité d’abonnement.
- Tarif de développement 24,90 € omis comme offre ferme : la source le marque « indicatif, à confirmer ».
- Suppression du formulaire inactif de la première maquette.
- Pas de nouvelle collecte de prospects ni d’outil publicitaire. Les emplacements CTA portent des identifiants pour un éventuel raccordement ultérieur.

## Validation réalisée
- Syntaxe JavaScript : PASS.
- Ancres internes : aucun lien cassé.
- Ressources HTML : aucun fichier manquant.
- Identifiants HTML : aucun doublon.
- Sept liens d’inscription vers le parcours existant.
- Les cinq captures ont été inspectées avant intégration.
- Responsive : règles prévues aux seuils 1020, 850, 620 et 365 px ; rendu navigateur NON VÉRIFIÉ.
- Le serveur local et le navigateur de cette session sont indisponibles : sockets refusées / outil de navigateur en échec.
- L’adresse publique d’inscription n’a pas pu être ouverte. L’envoi du lien, le chargement du jeu fictif et le passage au compte réel restent à vérifier sur la production.
- Le code de l’application n’a pas été modifié ; aucune suite applicative revendiquée.

## Avant publication
1. Ouvrir l’inscription sur la production et tester la création d’un compte avec le jeu fictif, sans utiliser de données réelles.
2. Vérifier les onglets, l’agrandissement, le menu, le clavier et le rendu à 360, 768 et 1440 px.
3. Confirmer le périmètre de l’offre et les conditions des fournisseurs avant de publier un prix.
4. Finaliser les textes juridiques applicatifs : la source des mentions légales contient encore des champs à compléter. Les liens du footer utilisent les routes existantes ; leur contenu doit être validé avant mise en ligne.
5. Livrer la refonte sur une branche dédiée, puis publier après recette. Le site principal n’est pas écrasé dans cette session.

## Mesure à raccorder
Le code applicatif comporte déjà des événements d’inscription. Vérifier leur activation et leur disponibilité en production ; ne pas confondre existence du code avec collecte effective.
Mesurer : visites pertinentes → accès inscription → comptes confirmés avec jeu fictif → utilisation de la démo → passage à une vraie colocation → abonnements payants.
La hausse des ventes reste une hypothèse à mesurer, pas un résultat garanti par une refonte.

## Références de fichiers
- src/accounts/service.py — 61dee8e660ebb5e9e38c9637751566949a1ddb84
- src/connexion_web/app.py — fb2322c2adb55d9142f785d7840e98ec8fa7a809
- src/connexion_web/templates/inscription.html — aa18c8926691a5886bf9ed50a79b7339c648cacb
- src/ui/rent_month_page.py — 5e8f0cf1d099cd2e680efcd508236692eba07cb0
- src/protection/visale.py — 0581e581a43b90a142d970dd5e4e58f208cb9360
- src/presignature/checks.py — b82463ba7c9cb2eacd3dc264c1801cff01a9eaea
- src/cafcertificate/service.py — 4c83a66fb8d522f2f964105014a58b666ec01764
- src/ui/accounting_page.py — b9eee657ea67f707efc96e9342e9b6926214d42e
- src/portal_web/app.py — 2fdab4991df3d4b83a0499a210304c4069290a3e
- docs/connexion-bancaire-ponto.md — 1d75f1ce1cb188f58fb99cf220a9ebbc06cdbfdd
- docs/signature-yousign.md — 53cbf759ff5e92e9428f08b31c90b17376dc41eb
