# 🌃 Portfolio City — Interactive 3D Developer Portfolio

A game-ready, walkable **3D mini city** built with **React Three Fiber + Three.js**.
Walk a stylised young-developer character around a night-time futuristic city and
visit buildings to explore an **About / Skills / Experience / Projects / Contact**
portfolio.

Everything is generated procedurally from clean, low-poly Three.js geometry — no
external model files to download — and the whole scene can be **exported to GLB**
for Blender / Unity straight from the running app.

---

## 🚀 Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into /dist
npm run preview  # preview the production build
```

## 🎮 Controls

| Input | Action |
| --- | --- |
| `W A S D` / `Arrow keys` | Move the character |
| `Shift` (hold) | Run |
| `Space` | Jump |
| `Mouse` | Rotate / orbit the third-person camera |
| `E` *or* click **Open** | Open the building you're standing next to |
| `Esc` | Close a panel / release the mouse |
| `G` | Export the whole scene as `portfolio-city.glb` |

Click the scene once to capture the mouse (pointer-lock) for camera look.

---

## ✨ What's inside

**City** — wide asphalt road grid with dashed lane markings & crosswalks, raised
concrete sidewalks, five modern interactive section-towers with lit window bands
and glowing entrance signs, a procedurally-generated skyline of low-poly
buildings, and three green parks (lawns, flower beds, trees, benches, glowing
fountains).

**Props** — stylised trees, bushes, flowers, instanced grass, warm street lamps
(with real point lights), traffic lights, park benches and directional road signs.

**Player** — a low-poly hoodie-wearing developer character with a hand-built rig
and four fully procedural animations: **idle** (breathing), **walk**, **run**
(forward lean) and **jump** (airborne tuck). Smooth third-person follow camera.

**Atmosphere** — night sky with stars & drifting sparkles, cool moonlight key
light + warm city fill, distance fog, and **bloom + vignette** post-processing so
the warm street lighting glows.

**UI** — animated intro screen, on-screen control hints, a floating proximity
interaction icon in 3D, and polished info panels for every section.

---

## 🗂️ Project structure

```
src/
├── App.jsx                  # Canvas + UI overlay shell
├── data/portfolio.js        # ⭐ EDIT ME — all content + city layout
├── store/useGame.js         # zustand game state
├── game/
│   ├── Experience.jsx       # scene root: lights, fog, world, player, bloom
│   ├── world/               # Ground, Roads, Decorations, Parks, Buildings
│   ├── props/               # Nature.jsx, Street.jsx (modular assets)
│   ├── player/              # Character.jsx, Player.jsx, useKeyboard.js
│   └── utils/ExportGLB.jsx  # press G → download .glb
└── ui/                      # Hud, InfoPanel, Intro
```

## ✏️ Make it yours

All text lives in [`src/data/portfolio.js`](src/data/portfolio.js) — edit
`PROFILE`, `ABOUT`, `SKILLS`, `EXPERIENCE`, `PROJECTS`. The same file defines the
city layout (`CITY`, `BUILDINGS`, `PARKS`, `BLOCK_CENTERS`); change a building's
`position`, `color`, `height` or `footprint` and the world, signs, colliders and
interactions all update automatically.

---

## 🧱 Asset pipeline notes (Blender / Unity / GLB)

The models here are **runtime low-poly Three.js geometry** (box / cylinder /
icosahedron primitives) with **PBR `meshStandardMaterial`s** — clean topology,
modular and tiny over the wire (no binary asset downloads), which is the most
web-performance-friendly way to ship a scene this size.

- **Export to GLB:** press **`G`** in the app to download `portfolio-city.glb`
  via Three.js `GLTFExporter`. That file imports directly into **Blender** and
  **Unity** (glTF is Unity-native via the glTFast / UnityGLTF importers).
- **Bring your own models:** if you'd rather author meshes in Blender, drop the
  exported `.glb` files in `public/` and swap any component for a
  `useGLTF('/model.glb')` loader from `@react-three/drei` — the layout, controls
  and interaction system stay exactly the same.

## ⚙️ Performance

Low-poly geometry, instanced grass/lane-markings, a capped point-light count,
`dpr` clamp and a single shadow-casting light keep it light. For lower-end
hardware you can reduce `count` on `<Stars>`/`GrassField`, lower the shadow map
size in `Experience.jsx`, or drop the `<Bloom>` effect.

Built with React 19 · @react-three/fiber 9 · @react-three/drei 10 · three 0.184.
