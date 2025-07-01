# INF1430 – Comparaison des performances : JavaScript vs WebAssembly

## Description

Ce projet a pour but de comparer les performances de deux algorithmes implémentés en JavaScript et en WebAssembly :  
- Le tri à bulles (bubble sort)  
- La multiplication de matrices

## Lien Démo en ligne
https://thierrybab.github.io/INF-1430/

## Lien Présentation en ligne
https://youtu.be/DDeJaGjcc0s

## Arborescence du projet

```
INF-1430/
├── js/
│   ├── main.js             # Point d'entrée principal
│   ├── charts.js           # Gestion des graphiques Chart.js
│   ├── calculs.js          # Fonctions JavaScript : tri et multiplication
│   ├── tests.js            # Fonctions de test de performance
│   ├── events.js           # Événements utilisateur
│   ├── storage.js          # Sauvegarde et chargement des résultats
│   └── ui.js               # Fonctions utilitaires
├── tri_tableau.cpp         # Implémentation C++ du tri
├── tri_tableau.js/wasm     # Compilation WebAssembly du tri
├── multiplication_matrice.cpp     # Implémentation C++ de la multiplication
├── multiplication_matrice.js/wasm # Compilation WebAssembly de la mutliplication
├── index.html              # Interface web

```

## Instructions pour lancer le projet

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/thierrybab/INF-1430.git
   cd INF-1430
   ```

2. **Démarrer un serveur local :**  
   WebAssembly ne fonctionne pas correctement en ouvrant directement le fichier `index.html`.  
   Il faut utiliser un serveur local comme :

   - Avec VS Code + extension Live Server
   - Ou tout autre serveur local HTTP (comme Node.js, PHP, etc.)

3. **Utiliser l’interface web :**
   - Générer un tableau ou deux matrices
   - Lancer les tests JavaScript et WebAssembly
   - Visualiser les performances et résultats dans les graphiques

## Technologies utilisées
- JavaScript 
- WebAssembly
- C++
- HTML/CSS

## Compilation WebAssembly (facultatif, les fichiers compiliés sont déja présent)

Voici les commandes utilisées pour compiler les fichiers C++ en WebAssembly :

- Pour le tri :
  ```bash
  emcc tri_tableau.cpp -O3 -s WASM=1 -s EXPORTED_FUNCTIONS='["_bubbleSort"]' -o tri_tableau.js
  ```

- Pour la multiplication :
  ```bash
  emcc multiplication_matrice.cpp -O3 -s WASM=1 -s EXPORTED_FUNCTIONS='["_multiplyMatrices"]' -o multiplication_matrice.js
  ```

## Résultats

Les tests sont effectués automatiquement via l’interface. Les performances sont mesurées en millisecondes et affichées :
- Sous forme de graphique
- Sous forme tabulaire
- Avec calcul des moyennes par catégorie (tri JS/WASM, matrices JS/WASM)


Thierry Babault  
Projet INF1430 – Hiver 2025
