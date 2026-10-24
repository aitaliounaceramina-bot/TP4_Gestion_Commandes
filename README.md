
# TP4 — Application JavaScript structurée

## Description
Application web de gestion des commandes, des clients et des produits.

## Technologies utilisées
- HTML5
- CSS
- Bootstrap
- JavaScript
- JSON
- Fetch API
- Git et GitHub

## Fonctionnalités
- Chargement des clients, produits et commandes depuis des fichiers JSON.
- Affichage des indicateurs.
- Recherche par nom du client.
- Filtrage par statut et catégorie du produit.
- Combinaison des filtres.
- Affichage des détails d'une commande.
- Calcul du montant de chaque ligne et du total de chaque commande.
- Gestion des erreurs de chargement.

## Structure du projet
- `index.html` : structure de la page.
- `css/style.css` : styles de l'application.
- `js/app.js` : initialisation et événements.
- `js/state.js` : état de l'application.
- `js/dataService.js` : chargement des données.
- `js/selectors.js` : recherche, filtres et calculs.
- `js/view.js` : affichage des données.
- `data/customers.json` : données des clients.
- `data/products.json` : données des produits.
- `data/orders.json` : données des commandes.

## Lancement
Ouvrir le dossier du projet dans Visual Studio Code, puis lancer
`index.html` avec l'extension Live Server.
