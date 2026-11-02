# Shailesh Patil — Personal Portfolio & Data Science Notebook

An advanced, cinematic personal portfolio built for **Shailesh Patil** (Data Science and ML Intern Candidate | Python | SQL | EDA). Designed around the **"Living Notebook"** concept, rendering sections as numbered cells (`In [ ]:` / `Out [ ]:`) with editorial typography, interactive canvas visuals, and a dynamic theme system.

---

## 🚀 Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design Tokens (WCAG AA compliant)
- **Animation**: Framer Motion
- **Smooth Scroll**: Lenis
- **Visuals**: Procedural Canvas 2D & SVG (lightweight, zero heavy 3D dependencies)
- **Typography**: Space Grotesk (display) + JetBrains Mono (monospaced code)

---

## 🎨 Theme & Palette System

- **Dark Mode (Default) & Light Mode**: Accessible toggle in navigation and footer, remembering user preference in `localStorage` and respecting `prefers-color-scheme`.
- **Three Switchable Palettes**:
  1. 🔴 **Crimson** (Red + Black / warm off-white)
  2. 🟢 **Emerald** (Green + Black / warm off-white)
  3. 🔵 **Deep Navy** (Navy Blue + Black / warm off-white)
- Palettes switch smoothly via dynamic CSS custom properties (`--accent`, `--bg-primary`, `--border`, etc.), updating all procedural canvases, cursors, and glow highlights in real time.

---

## 📦 Project Structure

```
portfolio/
├── index.html                   # SEO tags, JSON-LD Schema, Google Fonts
├── vite.config.ts               # Base path configurable via VITE_BASE_PATH
├── public/
│   ├── favicon.svg              # Custom SP monogram vector favicon
│   └── assets/                  # Drop photo.jpg & Shailesh_Patil_Resume.pdf here
└── src/
    ├── data/
    │   └── content.ts           # ⭐ Single source of truth for all text, stats & repos
    ├── hooks/
    │   ├── useTheme.ts          # Dark/light + 3-palette manager
    │   └── useReducedMotion.ts  # Accessibility motion preference detection
    ├── components/
    │   ├── Navbar.tsx           # Floating sticky nav + palette dots + theme toggle
    │   ├── CustomCursor.tsx     # Dot + trailing ring (disabled on touch)
    │   ├── ScrollProgress.tsx   # Thin top progress indicator
    │   ├── GrainOverlay.tsx     # Animated Canvas 2D subtle film grain
    │   ├── LoadingIntro.tsx     # Fast <1.5s intro reveal
    │   ├── CommandPalette.tsx   # Ctrl+K / Cmd+K quick actions modal
    │   ├── ProjectVisual.tsx    # Lightweight procedural Canvas 2D visualizations
    │   ├── ProjectModal.tsx     # Detailed case study dialog
    │   ├── Toast.tsx            # Clipboard feedback notifications
    │   └── Footer.tsx           # Footer with palette controls & top scroll
    └── sections/
        ├── Hero.tsx             # Interactive particle network + text scramble
        ├── About.tsx            # Cell [1]: Bio + avatar + live animated counters
        ├── Skills.tsx           # Cell [2]: Grouped interactive domain chips
        ├── FeaturedProjects.tsx # Cell [3]: Deep-dive case studies
        ├── AllProjects.tsx      # Cell [4]: Filterable grid by category
        ├── DataDetective.tsx    # Cell [5]: 918-dot interactive anomaly detector
        ├── Journey.tsx          # Education milestones + Currently Learning
        └── Contact.tsx          # Cell [6]: Direct contacts + dispatch form
```

---

## 🛠️ Local Development & Build

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
```

---

## 🌐 Deployment

### GitHub Pages
Set the base path in your deployment environment variable:
```bash
export VITE_BASE_PATH="/<your-repo-name>/"
npm run build
```
Or define `VITE_BASE_PATH` in your `.env` file.

### Vercel
Deploy directly with default settings (`npm run build`, output directory `dist`).

---

## 📝 What to Provide / Edit

1. **Resume**: Drop `Shailesh_Patil_Resume.pdf` into `public/assets/`.
2. **Photo**: Drop `photo.jpg` into `public/assets/`. If omitted, the website automatically renders the abstract SP monogram avatar.
3. **Live Links**: When live demos are deployed, simply update `liveUrl` on any project in `src/data/content.ts` to transform the "Live demo: coming soon" pill into a live button.
