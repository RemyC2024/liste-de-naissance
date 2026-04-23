============================================================
🎁 LISTE DE CADEAUX - DOCUMENTATION RÉSUMÉE

Gestionnaire léger en Vanilla JS utilisant un fichier JSON.

CONFIGURATION (content/produits.json)

Chaque objet "item" accepte :

title : [Requis] Nom du cadeau.

image : URL ou chemin local.

price : Prix indicatif (ex: "50€").

description : Court texte descriptif.

mode : "participation" (cagnotte) ou "reservation" (achat).

status : "disponible" ou "reserve" (bloque l'item).

product_link : Lien boutique (mode reservation).

reserved_note : Note si réservé.

order : Position (ordre croissant).

MODES DE FONCTIONNEMENT

A. Participation :

Redirige vers "paiement.html".

Bouton grisé si "reserve".

B. Réservation :

Lien "Acheter" vers la boutique.

Bouton "Réserver" ouvrant une modale avec lien vers Google Forms.

PERSONNALISATION (CSS Variables)

Modifiez ces valeurs dans le :root :
--sage: #cfe7de; (Disponible)
--pink: #f3c8d3; (Réservé)
--radius: 18px;  (Arrondi)

STRUCTURE DU PROJET

/
├── index.html       (Page principale)
├── paiement.html    (Page de paiement)
├── content/
│   └── produits.json (Données)
└── img/             (Images)

============================================================
Fin de la documentation
