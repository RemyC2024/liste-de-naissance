🎁 Système de Liste de Cadeaux (Documentation)

Ce projet est un gestionnaire de liste de cadeaux léger et dynamique, utilisant du JavaScript pur (Vanilla JS) et un fichier de données JSON. Il permet de gérer des participations (cagnottes) et des réservations (achats directs).

🚀 Fonctionnement Technique

Le script utilise une architecture simple et robuste :

Rendu Dynamique : Une fonction helper el() génère le DOM de manière sécurisée.

Normalisation : Les entrées du JSON sont nettoyées (casse, accents) pour éviter les erreurs de saisie.

Injection de Styles : Les styles spécifiques aux composants (comme les modales) sont injectés dynamiquement.

📋 Configuration des Données (produits.json)

Le fichier JSON doit se situer dans content/produits.json. Voici les propriétés disponibles pour chaque objet de la liste items :

Propriété

Type

Description

title

string

Requis. Le nom du cadeau.

image

string

URL de l'image du produit.

price

string

Prix ou montant indicatif (ex: "50€").

description

string

Courte description du produit.

mode

string

participation (cagnotte) ou reservation (achat manuel).

status

string

disponible ou reserve (verrouille l'item).

product_link

string

Lien vers la boutique (pour le mode reservation).

reserved_note

string

Message affiché si l'objet est réservé (ex: "Offert par Julie").

order

number

Priorité d'affichage (ordre croissant).

⚙️ Options de Mode

Le site sépare automatiquement les produits en deux catégories basées sur le champ mode :

1. Participation (participation)

Utilisé pour les cagnottes ou les participations libres.

Bouton : Redirige vers paiement.html.

Comportement : Si le statut est reserve, le bouton est grisé et affiche "Déjà réservé 💛".

2. Réservation (reservation)

Utilisé quand l'invité doit acheter le cadeau lui-même.

Bouton "Acheter" : Ouvre le lien vers la boutique externe (product_link).

Bouton "Réserver" : Ouvre une fenêtre modale interne.

Modale : Affiche les instructions et contient un lien vers un formulaire Google (forms.gle) pour confirmer la réservation.

🎨 Personnalisation du Design

Le design est entièrement piloté par des variables CSS (:root). Vous pouvez modifier l'apparence globale sans toucher au code logique :

:root {
  --sage: #cfe7de;   /* Couleur "Disponible" */
  --pink: #f3c8d3;   /* Couleur "Réservé" */
  --ink: #1f2a27;    /* Couleur du texte principal */
  --radius: 18px;    /* Arrondi des cartes et boutons */
  --shadow: 0 12px 30px rgba(31,42,39,.08); /* Ombrage */
}


🛠️ Fonctions JavaScript principales

el(tag, attrs, children) : Créateur d'éléments DOM avec support pour les attributs html et les listes d'enfants.

normStatus / normMode : Fonctions de tolérance aux erreurs (ignorent la casse et les espaces superflus).

openReserveModal(itemTitle) : Gère la création et la destruction de la modale de confirmation.

renderItems(gridEl, items) : Boucle de génération des cartes avec gestion conditionnelle des boutons disabled.

📦 Installation & Déploiement

Hébergez les fichiers sur un serveur (ou via GitHub Pages).

Assurez-vous que la structure suivante est respectée :

/
├── index.html
├── paiement.html
├── content/
│   └── produits.json
└── img/
    └── ... (vos images)


Modifiez produits.json pour mettre à jour votre liste.
