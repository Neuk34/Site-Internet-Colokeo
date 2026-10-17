# Captures réelles du jeu de démonstration — 16 octobre 2026

Les 17 pages ont été ouvertes avec Playwright et les helpers de
`tests/playwright/nav_keys.py`, depuis Colokeo-SaaS à la révision
`93b70506b3de7234f4151d419e1fd4c9c391761e`.
Le code applicatif est identique à cette révision ; le checkout de test contient
en plus un test SQL d’isolation des inscriptions.

Un compte SaaS de démonstration a été créé **localement**, puis chargé avec
`src/accounts/jeu_demonstration.zip`, au moyen de `accounts.demonstration.charger`.
L’application écoute uniquement sur `127.0.0.1`. Les variables de configuration
LMNP, PostgreSQL, SMTP et Yousign héritées ont été retirées avant son lancement.
Aucune connexion à la base de production n’a été utilisée. Le bandeau du produit
confirme que les données sont fictives et les envois simulés.
Les noms, téléphones et adresses affichés proviennent du jeu fictif livré avec
l’application. Aucun fichier `.env` n’a été lu ou publié.

## Formats et provenance

- Vue desktop originale : PNG, **1440 × 1000**, facteur de pixels 1.
- Page complète : largeur 1440, hauteur adaptée au contenu réellement rendu.
  La hauteur du viewport est augmentée pour ouvrir le conteneur de défilement
  Streamlit ; aucun contenu ni CSS du produit n’est modifié.
- WebP sans perte pour les deux vues ; égalité des pixels avec le PNG vérifiée.
- Fin du chargement vérifiée avant capture : navigation, disparition des
  squelettes, fin d’exécution Streamlit et chargement des polices.
- Les empreintes SHA-256, dimensions et sélections se trouvent dans
  [le manifeste](assets/screens/demo-20261016/manifest.json).
- Les anciens noms d’assets utilisés par la page pointent également vers les
  nouvelles captures réelles, pour éviter de servir les anciennes images.

## Pages couvertes et limites visibles

| Page | Dossier / ce qui est réellement montré |
| --- | --- |
| Vue d’ensemble | Maison Angers ; occupation, encaissements, alertes du mois. |
| Ma colocation | Maison Angers ; dossier du bien incomplet, diagnostics à fournir ou à vérifier. |
| Locataires | Les cinq dossiers fictifs et leurs étapes de parcours. |
| Fiches locataires | Emma Bernard ; coordonnées fictives, parcours, assurance, garantie et documents. |
| Baux | Emma ; conditions enregistrées, contrôles de garantie ; aucune version de bail générée. |
| Dépôts de garantie | Emma ; versement de 600 €, remboursement de 480 €, retenue de 120 €. |
| États des lieux | Emma ; entrée finalisée, six espaces renseignés, aucune photo jointe. |
| Chambres | Chambre 2 ; Thomas Martin, équipements et loyer de 500 € charges comprises. |
| Parties communes | Cuisine ; trois pièces, aucune tâche ni équipement configuré. |
| Planning d’entretien | Semaine du 12 au 18 octobre ; répartition des pièces, sans tâches détaillées. |
| Revenus et charges | Octobre 2026 ; deux écritures et évolution annuelle, aucune dépense réglée. |
| Loyers | Cinq échéances ; une payée, commandes visibles ; aucune quittance générée. |
| Charges | État vide, filtres et commande d’ajout ; aucune charge enregistrée en octobre. |
| Sinistres et impayés | Quatre dossiers d’impayés ; aucun sinistre déclaré. |
| Travaux et entretiens | État vide et commandes de création ; aucune intervention ni entretien configuré. |
| Documents | Neuf pièces fictives, recherche et filtres. |
| Comptabilité et fiscalité | Écran « Démarrer la comptabilité » ; compte non initialisé, aucun résultat fiscal finalisé. |

**Pages inaccessibles : aucune parmi ces 17 pages.** Les erreurs de navigation
initiales du script ont été corrigées avant les exports finaux ; elles ne sont
pas présentées comme des défauts d’accès du produit.

Un PDF du jeu, `devis-peinture.pdf` (193 octets), est invalide pour le lecteur PDF
local. Sa ligne apparaît dans la bibliothèque ; aucune prévisualisation valide
n’est prétendue. Les pièces manquantes et états vides n’ont pas été complétés
artificiellement pour rendre les captures plus riches.

## Portail candidat / locataire

L’aperçu mobile et sa page indépendante sont une **maquette non publiée**,
avec actions simulées et données fictives. Ils sont séparés de la galerie des
captures du produit. Ce travail ne publie ni ne connecte ce futur portail.

## Vérification de la vitrine

La section « Voici ce que tu peux prendre en main » utilise une navigation
unique : cinq rubriques (Pilotage, Locataires, Logement, Finances, Documents),
puis les pages de la rubrique choisie. Une seule capture grand format est
affichée à la fois, avec sa légende et ses liens desktop/page complète.
Les quatre anciens onglets et la galerie répétitive ont été supprimés.
Les liens de découverte présents ailleurs dans la vitrine ouvrent directement
la page correspondante dans cette section.

Playwright vérifie les 17 images et leurs pages complètes, les cinq rubriques,
les trois liens directs existants, le clavier, les fenêtres d’agrandissement, l’absence de débordement horizontal à
1440 et 390 pixels, les avertissements de maquette et les erreurs JavaScript.
Les originaux PNG et leurs WebP sont exportés ensemble dans une archive de
livraison distincte du site ; le site utilise les WebP sans perte.

La publication de la vitrine utilise la procédure existante GitHub Pages :
branche `main`, dossier `/`, domaine `colokeo.fr`, HTTPS activé.
Les trois points de douleur et leurs réponses demandés ont été ajoutés avant
publication. Aucun déploiement de Colokéo-SaaS ni changement des données réelles
n’est nécessaire.
