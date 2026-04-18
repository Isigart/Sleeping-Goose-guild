# README — Instructions pour Claude Code

> Ce README est destiné à **Claude Code** (ou toute autre IA de dev). Il contient les règles dures du projet. Il doit être lu AVANT tout développement, en complément du `DESIGN_DOC.md`.

---

## 🎯 Contexte en 1 phrase

On développe un **incremental idle long-format** (type Melvor / IdleMMO) où le joueur reconstruit une guilde de mercenaires déchue. **Pilier central : la découverte de classes par expérimentation.**

**Plateforme :** PWA / Web.
**Stack :** à trancher (vanilla JS / Svelte / React — me demander avant de décider).
**Solo dev** + Claude Code.

**TOUJOURS lire `DESIGN_DOC.md` pour le design complet.** Ce README ne contient que les règles de dev.

---

## ⚠️ Règles CRITIQUES d'extensibilité

**Le jeu est découpé en V1 / V2 / V3.** On code V1, mais les structures de données doivent anticiper V2 et V3. **Ne prends JAMAIS le chemin court V1 si ça bloque V2 plus tard.**

### Règles non-négociables :

1. **Data model merc** : prévoir dès V1 des champs pour :
   - `needs: { salary, food, care }` (V1 n'utilise que `salary`, mais les 3 champs existent, valeurs à null ou 0 pour les autres)
   - `classes: []` (tableau, même si V1 n'utilise qu'une classe à la fois)
   - `traits: []`
   - `status: 'active' | 'mentor'` (enum, pas booléen)

2. **Data model classe** : TOUTES les classes ont DEUX blocs de stats dès V1 :
   - `active_stats` (utilisé quand le merc est actif)
   - `mentor_stats` (utilisé quand le merc est converti en mentor)
   - Les deux sont utilisés en V1 car le mentorat est V1.

3. **Data model ressource** : structure unifiée `Resource { id, type, current, max }`. V1 instancie 4 ressources (or, bois, pierre, renommée), mais le système doit permettre d'en ajouter à chaud sans refacto.
   - Types possibles : `currency` | `reputation` | `rare_token` (même si rare_token n'arrive qu'en V2)

4. **Data model poste** : structure avec :
   - `unlock_conditions: []` (liste typée : renommée, ressources, découverte, action)
   - `active_slots: number` et `mentor_slots: number` (scalent avec le niveau du poste)
   - `upgrades: []` (liste des paliers d'upgrade)

5. **Contrats** : entité autonome avec champ `taken_by`. En V1 toujours = `'player'`. En V3, peut être une guilde IA. **Ne hardcode pas `taken_by = player`.**

6. **Rôles de contrat** : enum extensible. V1 : `tank` | `dps` | `support`. Le code qui itère sur les rôles doit marcher si on ajoute `scout` | `caster` en V2.

7. **Exigences de contrat** : liste de types (`{ type: 'role_stat' | 'class' | 'trait' | 'profession', ... }`) avec tolérance (`'strict' | 'flexible' | 'substitutable'`). Ne pas hardcoder.

8. **Journal** : events typés avec templates par type. Schéma `{ type, timestamp, data, template_key }`. V2/V3 ajouteront des types, pas touche au core.

9. **Compendium** : chaque classe a une `lineage` (string/tag) et un `tier` (int). V1 aura des lignées simples ("Bûcheronnage" → Bûcheron / Maître Bûcheron), mais le système doit permettre des arbres profonds.

10. **Chef de guilde** : entité spéciale, DISTINCTE du type merc. Ses particularités :
    - Immortel, indémissionnable
    - Pas de classe (hors compendium)
    - Seul à pouvoir être assigné au `Bureau du Chef`
    - Son niveau détermine `max_mercs` de la guilde (pas de plafond hardcodé)

---

## 🛠️ Règles de dev

### Architecture moteur = TAUX, pas ticks

- **Aucun tick discret** (pas de `setInterval(1000, tick)` comme moteur principal)
- Chaque merc actif a un `prod_rate_per_hour` et `xp_rate_per_hour` sur le skill du poste
- Progression calculée **par segments** : à chaque changement d'état (assignation, level-up, équipement, etc.), on recalcule les taux et on stocke l'état + timestamp
- Au login / update UI : `elapsed_time * rate = progression`
- **Ça doit marcher offline** : si le joueur revient après 8h, le jeu simule correctement la progression, en tenant compte des paliers de niveau franchis entre-temps
- **Tout doit être déterministe** : aucun Math.random() dans les mécaniques de progression. La seule aléatoire acceptable = génération de candidats au recrutement et procédural cosmétique (noms, traits visibles)

### Découverte de classe

- Trigger = seuils XP cumulés sur combo de skills
- Check à chaque `update` / `login`, pas besoin d'être en ligne pour que la classe se débloque
- Les combos sont déclarés en data (JSON ou équivalent), pas hardcodés dans la logique

### Persistence

- Sauvegarde locale (localStorage ou IndexedDB) en V1
- Format sérialisable proprement (JSON) — on pourra migrer vers un backend en V3 si besoin
- **Ne jamais perdre de données utilisateur** : au moindre doute, fallback sur la dernière sauvegarde saine

---

## 🎨 UX / UI

- **PWA** : doit fonctionner offline, installable sur mobile, petit footprint
- **Lisibilité avant tout** : le joueur doit comprendre en 3 secondes ce que fait un poste et ce que rapporte une classe
- **Chiffres qui explosent** : accepter et afficher des grands nombres (notation k/M/G ou scientifique à haut niveau)
- **Pas d'animations lourdes** : c'est un idle, pas une démo graphique
- **Dark mode obligatoire** (on joue des idles le soir)
- **Mobile-first** : la majorité des check-ins se fait sur téléphone

---

## ❌ À NE JAMAIS FAIRE (pièges connus)

- ❌ Hardcoder des valeurs d'équilibrage dans le code métier. Tout va dans de la data (config files, JSON).
- ❌ Coder V1 "au plus court" si ça demande une refonte pour V2 (cf. règles d'extensibilité ci-dessus).
- ❌ Utiliser des ticks discrets ou des tours. **Taux continu uniquement.**
- ❌ Introduire de la chance / RNG dans les mécaniques de progression. **Déterminisme strict.**
- ❌ Faire des calculs offline approximatifs. La progression offline doit être **exacte**, calculée par segments.
- ❌ Mélanger logique métier et UI. Le moteur doit être testable sans rendu.
- ❌ Ajouter des dépendances lourdes sans valider avec moi.

---

## ✅ Au démarrage de chaque session de code

1. **Lire `DESIGN_DOC.md` en entier** (au moins une fois par session)
2. **Lire ce README** (rappel des règles dures)
3. **Me demander ce qu'on attaque aujourd'hui** — ne pas deviner le scope
4. **Proposer une petite tâche à la fois** — pas de "je code tout le V1 d'un coup"
5. **Me signaler tout choix ambigu ou toute tentation de raccourci** qui pourrait violer l'extensibilité

---

## 📁 Fichiers de référence

- `DESIGN_DOC.md` — le design complet, à jour (v0.4)
- `README.md` — ce fichier, règles de dev

---

## 🚦 Statut actuel du projet

- Design v0.4 : **validé, stabilisé sur le cœur**
- Code : **pas commencé**
- Prochaines étapes de design à finaliser avant de coder :
  1. Les 10-12 skills V1
  2. Les 15 classes V1 avec combos + stats actives + buffs mentors signés
  3. Les paliers de renommée
  4. Les 2-3 zones V1 et leurs contrats
  5. Vague de déblocage des postes après les 4 du J1

**Ne commence pas à coder la logique métier avant que ces 5 points soient dans le DESIGN_DOC.**

En attendant, ce qui peut être commencé **sans risque** :
- Setup du projet (structure de fichiers, build, PWA manifest)
- Data models (merc, classe, ressource, poste, contrat) avec les règles d'extensibilité
- Système de sauvegarde local
- Shell UI vide (onglets, layout général)
