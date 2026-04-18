# [NOM DU PROJET — TBD] — Design Document

> Document vivant. Version 0.4. À faire évoluer à chaque session.

---

## 🎯 Pitch

Un incremental idle **long-format** où tu reconstruis une guilde de mercenaires déchue à sa gloire passée. Tu assignes tes mercs à des tâches (récolte, artisanat, soutien, contrats) — et les combos de skills qu'ils accumulent révèlent des **classes cachées** à découvrir, chacune apportant un **buff de mentor unique** qui renforce ta guilde. Cible de rétention : plusieurs mois de présence légère, 2-4 check-ins par jour.

---

## 🧭 Pilier de design central

**LA DÉCOUVERTE DE CLASSES PAR EXPÉRIMENTATION.**

Tout le reste est au service de ça. Le joueur ne progresse pas en optimisant des chiffres, il progresse en **révélant** un compendium. Chaque classe découverte **ouvre un buff de mentor unique** qui renforce durablement la guilde. Les ressources, les combats, la renommée sont des outils pour alimenter cette découverte.

**Chaque classe apporte un buff fixe** (mentor) + **des stats d'actif** distinctes. Plus ton compendium grandit, plus tu peux composer une guilde puissante et spécialisée.

Si une feature ne sert pas ce pilier, elle dégage.

---

## 🎮 Genre & plateforme

- **Genre :** Incremental / Idle long-format, gestion de guilde
- **Plateforme V1 :** PWA / Web
- **Stack dev :** à trancher (vanilla JS / Svelte / React) — sera fait avec Claude Code
- **Dev :** solo
- **Multi :** non. Feel "MMO simulé" uniquement (guildes IA nommées, marché PNJ, events scriptés)

---

## 📚 Références

| Référence | Ce qu'on prend |
|-----------|----------------|
| **Melvor Idle** | Architecture taux (prod/h, XP/h), progression offline par segments |
| **IdleMMO** | Feel de guilde vivante, zones = packages de contenu |
| **Super Fantasy Kingdom** | Unités polyvalentes qui se spécialisent selon la tâche |
| **Potion Craft / Doodle God** | Joie de la découverte de recettes cachées |
| **Darkest Dungeon** | Attachement aux vétérans, guilde qu'on reconstruit |
| **Cookie Clicker / A Dark Room** | Onboarding dense, puis ralentissement progressif, puis explosion des chiffres |
| **Incrementals de fond** | Le fun = voir les chiffres exploser et empiler les multiplicateurs |

---

## ⚙️ Architecture moteur (DÉCIDÉE)

**Tout est taux continu, pas de ticks discrets.**

- Chaque merc assigné → `prod/h` + `XP/h` sur les skills de la tâche
- Modulé par : niveau du merc, équipement, upgrades du poste, aura de poste, mentors du poste, (plus tard) bien-être
- **Progression offline** = recalculée par segments à chaque changement de palier (fidèle à Melvor)
- Le joueur check quand il veut, pas de tick forcé
- **Zéro stochasticité** : tout est déterministe et prévisible

**Découverte de classe :**
- Déclenchée par seuils XP cumulés sur un combo de skills
- Ex : "Sylvain = Bûcheronnage 100 XP + Garde 80 XP"
- Calcul à l'update, pas besoin d'être en ligne

**Principe idle assumé :**
- Pas de plafond artificiel sur les niveaux — un merc peut atteindre niveau 1000+
- Courbe exponentielle : chaque niveau coûte plus, apporte plus
- **Le plaisir du jeu = voir les chiffres exploser, empiler les multiplicateurs, découvrir les synergies**

---

## 🔄 Boucle de gameplay

### Boucle courte (minutes/heures)
1. **Assigner** un merc à un poste ou à un contrat
2. **Laisser tourner** : production + XP
3. **Check-in** : voir les ressources, découvrir des classes, réassigner

### Boucle moyenne (jours)
4. **Reconstruire** : débloquer de nouveaux postes avec tes ressources
5. **Recruter** (journée de recrutement, cooldown 24h)
6. **Prendre des contrats** plus ambitieux

### Boucle longue (semaines/mois)
7. **Plafonner** : tes meilleurs mercs stagnent à cause de la courbe exponentielle
8. **Convertir en mentor** : les vétérans deviennent figures fixes du poste, leur classe donne un buff unique qui s'empile
9. **Former la relève** : les nouveaux, boostés par les mentors, dépassent leurs maîtres
10. **Spécialiser la guilde** : chaque poste devient une école avec ses générations de mentors

### Boucle méta (mois)
11. **Monter la renommée** → débloquer nouvelles zones, nouveaux contrats, meilleures recrues
12. **Découvrir les postes ésotériques** → classes uniques, auras rares
13. **Faire monter le Chef** → plus de slots de mercs → guilde plus grande

---

## ✅ Règles fondamentales

### Design
- **Un seul verbe joueur : assigner.** Toute interaction passe par ça.
- **Un merc = un merc.** Pas de split civil/combat. Ce qu'il FAIT définit ce qu'il devient.
- **Spécialisations cumulables avec ponts logiques.** Bûcheron → Milicien-à-la-hache ✅. Cuisinier → Archer ❌.
- **Pas de mort permanente.** Les mercs peuvent partir à long terme (négligence prolongée) mais pas mourir.
- **Meta-progression via Renommée + Mentors.** Les zones et postes se débloquent par renommée/conditions. Les buffs de guilde montent par accumulation de mentors de classes diverses.
- **Déterminisme** : pas de chance. Tout est calculable, prévisible, visible avant de s'engager.
- **Incremental assumé** : les chiffres explosent, les multiplicateurs s'empilent, c'est souhaité.

### Mercs
- **Stats de base lisibles.** Skills + salaire attendu + classe actuelle + 1-2 traits visibles.
- **Pas de passé caché, pas de potentiel mystérieux.** Ce qu'on voit = ce qu'on a.
- **Traits** cosmétiques + petits modifiers (pool de 10-20 traits).
- **Attachement aux anciens** : les premiers mercs deviennent les piliers narratifs de la guilde.

### Tension V1
- **Survie économique (salaires)** = pilier principal.
- **Coût d'opportunité** naturel.
- **Saturation infirmerie** = conséquence situationnelle.
- **Le combat ne s'acquiert qu'en contrat** — pas de poste de grind combat pur.

---

## 👑 Chef de guilde

### Rôle

- **Premier merc** de la guilde, créé au J1
- **Nommé par le joueur** à la création (identité personnelle forte)
- **Immortel** et **indémissionnable** — c'est l'incarnation du joueur
- **Hors compendium** : n'a pas de classe au sens classique, pas de mentorat possible

### Bureau du Chef (poste unique)

- Poste **dédié au Chef uniquement**, accessible dès le J1
- **Non-productif** (pas de ressource générée)
- Le Chef y gagne des **points de chef** (= niveau de Chef) :
  - **Principal** : temps passé au Bureau (taux XP/h)
  - **Bonus** : paliers de renommée, contrats majeurs complétés
  - **Boost** : auras des autres postes peuvent accélérer le gain (synergie guilde ↔ Chef)

### Effet du niveau de Chef

- **Niveau du Chef = nombre de slots de mercs débloqués** dans la guilde
- Niv 1 = 1 merc possible, Niv 5 = 5 mercs, Niv 20 = 20 mercs, etc.
- **Remplace un plafond V1 arbitraire** par une progression dynamique

### Upgrade du Bureau

- Upgradable via ressources
- Accélère la vitesse de gain de points de chef
- Peut débloquer des auras passives secondaires (à définir)

---

## 💼 Système de postes

### Tout poste = multifonctions (3 rôles simultanés)

Chaque poste productif apporte **3 choses** en parallèle :

1. **Production** : une ressource générée (ou un service comme rations, équipement)
2. **XP pour le merc actif** : développement du skill correspondant
3. **Aura passive à la guilde** : bonus modulé par le niveau de skill du merc assigné

L'aura contribue à l'empilement de multiplicateurs qui fait le "fun idle" du jeu.

### Slots par poste

Chaque poste possède :
- **Slots actifs** (mercs qui bossent, produisent, gagnent XP)
- **Slots mentors** (mercs figés, donnent un buff)
- Les deux types de slots scalent avec le **niveau du poste** (upgrades)

### Upgrades

- 2-3 niveaux max par poste en V1
- Chaque niveau augmente : capacité d'accueil (actifs et mentors), rendement de base, éventuellement débloque des produits supérieurs
- Coût en ressources progressif

### Auras entre postes

- Toutes les auras de postes contribuent à la guilde
- **Elles s'empilent** (c'est voulu — un idle récompense l'accumulation)
- Certaines peuvent booster le gain du Chef, créant une synergie guilde ↔ Chef

---

## 🎓 Mentorat (système final)

### Principe

- Un merc **actif** peut être **converti en mentor** par décision du joueur
- Conversion **définitive** : pas de retour possible
- Un mentor est **fixé à un poste** de sa lignée principale
- Il **ne produit plus** de ressource, **ne gagne plus d'XP**
- Il occupe un **slot mentor** du poste (capacité selon le niveau du poste)

### Buff de mentor : attaché à la classe

- **Chaque classe possède un buff de mentor unique et fixe**
- **La puissance du buff scale avec le TIER de la classe** (tier 1 faible, tier 2 moyen, tier 3 fort)
- Pas de "niveau de mentorat" qui scale avec le temps — le buff est **fixe dès la conversion**
- Le buff s'applique **uniquement si le merc est en statut mentor** (sur un merc actif, il est visible en "indicatif" mais inactif)

### Empilement

- Un poste accepte **plusieurs mentors**, un par slot
- **Impossible d'avoir deux mentors de la même classe** sur un même poste
- Mais **mentors de classes différentes de la même lignée empilent leurs buffs**
  - Ex : Greta (Bûcheronne tier 1) + Bob (Maître Bûcheron tier 2) → buffs empilés
- Les vieux mentors bas-tier **restent utiles** indéfiniment (ils ajoutent leur couche)

### Conséquences

- **La seule façon d'augmenter durablement les buffs d'un poste = découvrir de nouvelles classes** dans la lignée
- **Le compendium est l'arbre mécanique de progression**, pas juste un Pokédex
- **La conversion en mentor est un moment narratif fort** : le merc devient figure fixe de la guilde, installée "pour toujours"
- **Cohérence avec "attachement aux anciens"** : les vétérans deviennent immortels via le mentorat

### Data model d'une classe

Chaque classe du compendium possède :
- id, nom, description narrative, icône
- lignée (chaîne de progression), tier (int)
- prérequis de déblocage (seuils XP sur combo de skills)
- stats d'actif (prod, rôles de combat tenables, etc.)
- **buff de mentor fixe** (type + puissance calibrée au tier)

---

## 🔮 Postes ésotériques (V2/V3)

### Principe

Lieux rares donnant accès à des **skills ésotériques uniques**, qui en combinaison avec des skills normaux débloquent des **classes uniques** (non-accessibles autrement).

### Fonctionnement

- Ce sont **des postes comme les autres** dans la structure (ressource + XP + aura)
- Mais : **ne produisent pas de ressource normale** (pas de bois/or/etc.)
- Développent un **skill ésotérique rare** (Ombres, Druidisme, Songe, Runes...)
- Donnent une **aura thématique** modulée par le merc assigné — locale au poste, pas à la guilde globale si on veut rester cohérent... (à reconfirmer dans les exemples, car on a parlé d'auras guilde pour les postes normaux)

### Accès

- **Découverts via contrats, events, exploration** (pas par palier de renommée)
- Chaque zone peut contenir 1-2 postes ésotériques thématiques
- Peuvent exiger des **prérequis d'entrée** (classe préalable, trait, ressource sacrifiée une fois pour ouvrir)

### Exemples notés pour mémoire

| Poste | Skill ésotérique | Classe unique exemple |
|-------|------------------|------------------------|
| **Catacombes** | Ombres | Apprenti Nécromancien (Ombres 15 + Érudition 10) |
| **Clairière du Druide** | Druidisme | Druide |
| **Chambre du Dormeur** | Songe | Dormeur |
| **Forge de Feu Ancien** | Runes | Forgeron-Runique |
| **Tour d'Observation** | Astronomie | Astrologue |

(Liste à enrichir progressivement, V2/V3.)

---

## 💰 Économie unifiée : modèle de ressources

### Règle : tout est une ressource, avec des types différenciés

Data model unique pour toutes les valeurs comptables. Chaque ressource a un **type** :

- **`currency`** : flux, se gagne et se dépense (or, bois, pierre)
- **`reputation`** : accumulation + paliers, **ne se dépense jamais** (renommée)
- **`rare_token`** (V2+) : unités précieuses, comptées à l'unité

### Liste V1 (4 ressources)

| Ressource | Type | Source principale | Usage principal |
|-----------|------|-------------------|-----------------|
| **Or** | currency | Contrats, vente | Salaires, upgrades, recrutement |
| **Bois** | currency | Bûcheronnage | Construction, artisanat |
| **Pierre** | currency | Carrière | Construction avancée |
| **Renommée** | reputation | Contrats, events | Paliers qui débloquent zones, postes, recrues |

Plafond V1 = 4 ressources max, V2 = 6-8, V3 = 10-12.

---

## 📋 Contrats : architecture

### Contrat = poste spécial à taux

- **Emploi continu**, pas une quête à boucler
- Merc assigné → or/h + renommée/h + XP/h (dans les skills du contrat)
- Le joueur libère le slot quand il veut (ou le contrat expire selon sa nature)
- **Le combat ne s'acquiert qu'en contrat** : pas de poste de grind combat pur

### Exigences typées : composition d'équipe

Un contrat est **une liste d'exigences** que l'équipe assignée doit satisfaire :

| Type d'exigence | Exemple |
|----------------|---------|
| **Rôle + stats** | "Tank avec Garde ≥ 30", "DPS avec Combat ≥ 30", "Support avec Soin ≥ 20" |
| **Classe précise** | "Sylvain-des-Cendres obligatoire" |
| **Trait / immunité** | "Immunité au feu" |
| **Métier non-combat** | "Un cuisinier dans l'équipe sinon stress accumulé" |

Chaque exigence a une **tolérance** :
- **Strict** : sans ça, contrat impossible à assigner
- **Flexible** : assignable en dessous du seuil, rendement réduit
- **Substituable** : alternatives acceptées

### Rôles canoniques V1 — 3 rôles seulement

- **Tank** (skill défensif, ex: Garde)
- **DPS** (skill offensif, ex: Combat)
- **Support** (skill soutien, ex: Soin)

V2 ajoute Scout, Caster. V3 peut ajouter d'autres rôles contextuels.

### Matching : formule du maillon faible

Rendement = min(stat/exigence) pour chaque rôle.
Force une **composition équilibrée**, évite le min-max d'un seul stat.

### Stress et blessures (déterministes)

- Mercs sous-statés accumulent **points de stress/h** proportionnels à leur gap
- À **100 points** → le merc va à l'infirmerie X heures
- Blessures répétées → debuff temporaire
- **Zéro jet de dé** — le joueur voit les points monter et décide

### Renommée proportionnelle au rendement

V1 simple : rendement 80% = or × 0.8 et renommée × 0.8.
V2 peut nuancer (renommée pleine si objectif atteint).

### Substitutions & règle d'accessibilité

- Rôles et exigences substituables avec des alternatives (skill vs classe, etc.)
- **Règle d'accessibilité : toute exigence rare doit avoir un chemin visible pour l'obtenir** (UI informe : "nécessite X, à découvrir via...")

---

## 🌍 Monde et zones

### Zones = packages de contrats

- Pas de carte explorable en V1
- Chaque zone = un **ensemble de contrats thématiques** cohérents
- Nouvelle zone débloquée = moment marquant (équivalent d'un palier de boss)

### Déblocage par conditions combinées (3 axes)

Chaque zone combine jusqu'à 3 axes :
1. **Palier de renommée** (gate minimum)
2. **Condition spécifique** (classe découverte, trait disponible, ressource rare)
3. **Action d'expansion** (ouvrir une antenne dans une ville via dépense, engagement structurel)

### Exemples

- **Forêt Profonde** : Renommée "Respectée" + classe de lignée Sylvain/Rôdeur découverte
- **Pics de Lave** : Renommée "Respectée" + merc avec immunité feu
- **Ruines Anciennes** : Renommée "Reconnue" + classe érudite découverte
- **Port Marchand** : Renommée "Modeste" + antenne ouverte dans le port (coût en ressources)

### Scope V1

- **2-3 zones** débloquables (dont la zone de départ déjà ouverte)
- Chaque zone V1 = **3-5 contrats** avec profils d'exigences distincts

---

## 👥 Recrutement V1 : journée de recrutement

### Mécanique

- Déclenché manuellement par le joueur, **coût fixe en or**
- Génère un **pool de 3 candidats**
- Joueur peut **embaucher 1** ou **aucun** (or consommé dans les deux cas)
- **Cooldown 24h IRL** entre deux journées
- **1ère journée gratuite et sans cooldown** en cadeau d'ouverture (onboarding)

### Qualité V1

- Niveau des candidats scale avec le **rang de renommée** de la guilde
- Guilde rang 1 → niv 1-3, guilde rang 5 → niv 15-25
- **Pas de classes pré-acquises en V1** (arrivent en V2)

### V2 / V3

- **V2** : filtres payants (orienter le pool), classes pré-acquises (probabilité selon renommée), éventuels cooldowns différenciés
- Marchés de recrutement rares (events ponctuels)

---

## 🏗️ Reconstruction : déblocage de postes

### J1 — 4 postes disponibles dans les ruines

1. **Bureau du Chef** (unique, réservé au Chef)
2. **Camp de bûcheron** (Bûcheronnage → bois)
3. **Cuisine** (Cuisine → rations)
4. **Salle de contrat** (hub pour les contrats — pas un poste d'assignation classique, mais une interface qui liste les contrats-postes disponibles)

### Déblocage progressif : 3 axes

Chaque poste a ses propres conditions, combinant :
1. **Ressources** (bois, pierre, or)
2. **Palier de renommée** (pour les postes intermédiaires et prestigieux)
3. **Découverte** (pour les postes rares — événements, contrats spéciaux, classes débloquées)

### Scope V1

- 4 postes actifs au J1
- 10-15 postes total à terme en V1 (le reste à débloquer sur la durée)

---

## 📋 Catalogue des postes (liste validée)

### Récolte brute
Camp de bûcheron • Carrière • Mine • Zone de chasse • Zone de pêche • Zone de cueillette

### Agriculture
Ferme • Élevage • Apiculture

### Artisanat
Forge • Tannerie • Atelier textile • Menuiserie • Joaillerie • Alchimiste

### Cuisine / Soin
Cuisine • Brasserie • Infirmerie • Herboristerie

### Combat / Soutien (postes-aura, pas de production classique)
Terrain d'entraînement (aura +XP combat en contrat) • Stand de tir (aura archerie) • Poste de garde (aura défensive) • Dojo (aura arts martiaux)

### Utilitaire
Bibliothèque (Érudition) • Auberge (Diplomatie) • Poste de scout (Exploration)

### Spécial
Bureau du Chef • Salle de contrat

### Postes ésotériques (V2/V3)
Catacombes • Clairière du Druide • Chambre du Dormeur • Forge de Feu Ancien • Tour d'Observation • (liste à enrichir)

---

## 📦 Découpage V1 / V2 / V3

> **Principe d'extensibilité ferme** : le code V1 doit anticiper V2/V3 dans ses structures de données, même si la logique ne les utilise pas.

### 🟢 V1 — Le jeu minimum qui tient sa promesse

- Architecture taux (prod/h, XP/h) + modificateurs
- Assignation de mercs à des postes et contrats
- **Chef de guilde** avec Bureau dédié, niveau = slots de mercs
- ~15 classes de base découvrables via combos de skills + **leurs buffs mentors signés**
- Mercs = stats + skills + 1-2 traits visibles
- **Mentorat complet** (conversion définitive, buffs empilés par diversité de classes)
- Recrutement par journée (cooldown 24h, 3 candidats, 1 ou 0 choisi)
- 4 ressources : Or, Bois, Pierre, Renommée
- Contrats avec exigences typées + matching maillon faible + stress déterministe
- 3 rôles canoniques (tank, DPS, support)
- 2-3 zones débloquables
- 10-15 postes (dont 4 au J1)
- Upgrades de postes (2-3 niveaux, scalent les slots actifs et mentors)
- Auras de poste qui s'empilent
- Survie économique via salaires
- Compendium comme cœur narratif ET mécanique
- Offline progression (calcul par segments)
- Journal narratif templaté
- Décor "monde vivant" minimal

### 🟡 V2 — Enrichissement systémique

- **Bien-Être complet** : Paye + Nourriture + Soin → multiplicateur universel
- **Classes pré-acquises au recrutement** avec probabilité selon renommée
- **Filtres payants** dans la journée de recrutement
- **Scout et Caster** comme nouveaux rôles canoniques
- **Postes ésotériques** et leurs classes uniques
- **Nouvelles zones** avec exigences plus complexes
- Events timés scriptés (2-3 par semaine)
- Sous-classes et évolutions (30-50 classes total)
- Destruction/endommagement de postes via events négatifs

### 🔴 V3 — Monde vraiment vivant

- Guildes IA simulées (vraie progression, prennent des contrats)
- Marché PNJ dynamique (offre/demande)
- Arcs narratifs récurrents (PNJ qui évoluent)
- Rôles contextuels supplémentaires (diplomate, érudit spécialisé...)
- Endgame : prestige / saisons / classes légendaires
- Carte visuelle du monde (polish)
- Autres postes ésotériques

---

## 🧱 Extensibilité : règles de code

**À respecter dès V1, même si V2/V3 ne sont pas encore implémentés.**

1. **Data model merc** : prévoir dès V1 les champs bouffe/soin/moral/classes-multiples. null ou 0 en V1.

2. **Data model classe** : deux blocs de stats — `active_stats` ET `mentor_stats` (les deux utilisés dès V1 pour le mentorat).

3. **Data model ressource** : structure unifiée `Resource { id, type, current, max }`. V1 instancie 4 ressources, V2/V3 ajoutent.

4. **Data model poste** : structure avec `unlock_conditions` flexible (renommée / ressources / découverte / action) + slots actifs + slots mentors.

5. **Contrats** : entité autonome avec champ `taken_by`. V1 toujours joueur. V3 peut être guilde IA. Exigences = liste typée extensible.

6. **Rôles de contrat** : enum extensible. V1 : Tank/DPS/Support. V2 : + Scout/Caster.

7. **Mentorat** : data model prévu dès V1 (statut actif/mentor sur merc, buff mentor sur classe).

8. **Journal** : events typés avec templates par type. V2/V3 ajoutent des types.

9. **Compendium** : lignées/tags dès V1. Tier comme int extensible.

10. **Chef** : entité spéciale distincte de merc classique, avec statut immortel et niveau propre qui détermine slots guilde.

11. **Prompt de Claude Code** : toujours rappeler ces règles quand on code un nouveau système.

---

## ❓ Questions ENCORE ouvertes

### Sur V1
- Fréquence des **salaires** (quotidien IRL ? hebdo ? cycle jeu ?)
- Gestion du "game over" économique
- Liste exacte des **15 classes de base** V1 avec leurs combos de skills + leurs buffs mentors signés
- Liste exacte des **skills** V1 (viser 10-12 — à décider maintenant)
- Vagues de déblocage des postes après les 4 du J1
- Paliers de renommée : combien ? quels noms ? quels seuils ?
- Durée de vie des contrats : indéfinie / rotative / mix
- Nombre de contrats simultanés par zone
- Format de l'upgrade du Bureau du Chef (quelles auras débloque-t-il ?)
- Coût d'une journée de recrutement par palier

### Sur V2
- Pondération des 3 besoins du Bien-Être
- Filtres payants : quelle UX ?
- Cooldowns différenciés ou global ?

### Transversal
- Nom du projet
- Ambition & monétisation
- Liste détaillée des postes ésotériques et leurs skills

---

## ⚠️ Risques identifiés

- **Équilibrage idle = cauchemar** — prévoir un prototype tôt
- **Contenu explose vite** : chaque classe V1 demande nom + stats actives + buff mentor signé + description. Pipeline de création à standardiser
- **Rétention quotidienne** : un idle vit par les check-ins, il faut toujours quelque chose à voir au retour
- **Scope creep** — le découpage V1/V2/V3 existe pour ça
- **Paralysie du joueur face aux exigences complexes** — courbe d'exigence à équilibrer

---

## 📋 Prochaines étapes de design

1. Lister les **10-12 skills V1** (fondation de tout)
2. Lister les **15 classes V1** avec combos + stats actives + buffs mentors signés
3. Définir les **paliers de renommée** (noms + seuils + déblocages)
4. Définir les **2-3 zones V1** et leurs contrats
5. Définir la **vague de déblocage des postes** après les 4 du J1
6. Prototype papier de la boucle core
7. Commencer à prototyper avec Claude Code

---

## 📝 Historique des décisions

- **v0.1** — Pitch initial, pilier de design, boucle core, règles fondamentales posées.
- **v0.2** — Architecture taux, découpage V1/V2/V3, principe d'extensibilité, pilier économique, mercs sans passé caché.
- **v0.3** — Économie unifiée, contrats avec exigences typées, zones comme packages, recrutement par journée, reconstruction progressive.
- **v0.4** — Grosse session :
  - **Chef de guilde** posé : merc immortel, Bureau dédié, niveau = slots de mercs, nommable par le joueur, boostable par auras des autres postes
  - **Mentorat final** : conversion définitive, buff fixe attaché à la classe (puissance selon tier), pas de niveau de mentorat, empilement par diversité de classes
  - **Postes = multifonctions** (production + XP + aura) — pas de séparation "productif/soutien"
  - **Principe idle assumé** : les chiffres explosent, les multiplicateurs s'empilent, c'est fun
  - **Postes ésotériques** structurés : skills ésotériques rares qui débloquent classes uniques, exemples notés
  - **J1 = 4 postes** : Bureau du Chef / Camp de bûcheron / Cuisine / Salle de contrat
  - **Le combat ne s'acquiert qu'en contrat** — pas de poste de grind combat
  - **Liste des postes catalogue** validée
  - **1ère journée de recrutement gratuite** pour l'onboarding
