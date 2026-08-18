BRUNO ONSET / MEDIA — V1.8

3 modes :
- CARTE : durée d'enregistrement selon capacité + débit
- TOURNAGE : stockage nécessaire selon débit + heures/jour + nombre de jours
- COPIE : temps de copie théorique et estimation réaliste

Tous les réglages sont accessibles directement : pas de mode Simple / Avancé.
Le débit d'enregistrement peut être affiché en Mb/s ou MB/s (conversion automatique : 8 Mb/s = 1 MB/s).
La marge de tournage est réglable et correspond à une réserve de production, pas à une erreur de calcul ni à l'espace libre du SSD.
Les presets personnels et les 3 derniers presets caméra sont stockés localement dans le navigateur/téléphone.
Les presets de volume CARTE et COPIE sont : 64 / 128 / 256 / 512 Go / 1 / 2 / 4 To.
Les capacités sont calculées en unités décimales (1 Go = 1000 Mo).
Certains codecs VBR peuvent produire des volumes réels différents : les résultats restent des estimations.

PRESETS CAMÉRA V1.8
Le menu unique a été remplacé par un configurateur progressif :
Marque > Caméra > Définition > Codec > Cadence > Débit.

Sony : FX30, FX3, FX5, FX6 (4K/UHD/HD selon modèles).
ARRI : ALEXA 35, ALEXA Mini LF (ProRes 422 HQ / 4444 / 4444 XQ).
Blackmagic : Cinema 4K, Cinema 6K, URSA Mini Pro 4.6K, URSA Mini Pro 12K.

Les modes Blackmagic RAW Constant Quality (Q0/Q1/Q3/Q5) ne sont pas convertis en un débit fixe, car le volume varie selon l'image.
ARRIRAW n'est pas ramené à un preset générique ; son débit dépend du mode capteur et du workflow.

Installation PWA : héberger le dossier en HTTPS puis ouvrir dans le navigateur du téléphone et choisir « Ajouter à l'écran d'accueil ».

V2.0 : réserve carte à 0 % par défaut, contrôles numériques desktop éclaircis, sélection rapide débit/capacité alignée sur le bleu BST.


V2.4 — BOS CAMERA DB
- MEDIA utilise maintenant la même base centrale `BOS-CAMERA-DB/cameras.json` que FRAME et DOF.
- Les presets d'enregistrement Sony, ARRI et Blackmagic sont stockés dans le bloc `media` de chaque caméra.
- Fallback embarqué + cache local : MEDIA reste utilisable hors ligne.
- Métadonnées PWA harmonisées en BRUNO ONSET / MEDIA et MEDIA - BOS.


V2.5 — DARK HEADER FIX
- Header uses the BOS dark background (#111418) and dark border (#25292E) in dark mode.
