---
name: Narrative Terminal
colors:
  surface: '#0a122a'
  surface-dim: '#0a122a'
  surface-bright: '#313852'
  surface-container-lowest: '#050d25'
  surface-container-low: '#131a33'
  surface-container: '#171e37'
  surface-container-high: '#212942'
  surface-container-highest: '#2c344d'
  on-surface: '#dbe1ff'
  on-surface-variant: '#dbc2b0'
  inverse-surface: '#dbe1ff'
  inverse-on-surface: '#282f49'
  outline: '#a38c7c'
  outline-variant: '#554336'
  surface-tint: '#ffb77d'
  primary: '#ffb77d'
  on-primary: '#4d2600'
  primary-container: '#f28c28'
  on-primary-container: '#5d2f00'
  inverse-primary: '#914d00'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb3ad'
  on-tertiary: '#68000a'
  tertiary-container: '#ff7f78'
  on-tertiary-container: '#7d000f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcc3'
  primary-fixed-dim: '#ffb77d'
  on-primary-fixed: '#2f1500'
  on-primary-fixed-variant: '#6e3900'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#0a122a'
  on-background: '#dbe1ff'
  surface-variant: '#2c344d'
typography:
  display-hero:
    fontFamily: Merriweather
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Merriweather
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Merriweather
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Merriweather
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 27px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
  code-telemetry:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system defines an interactive narrative game and technical learning companion for mobile devices. The product sits at the intersection of a deep engineering monograph, a terminal monitor, and a branching playable drama.

### Brand Personality & Tone
- **Analytical yet Dramatic:** The gravity of production outages and architectural decisions meets the tactile suspense of turn-the-page fiction.
- **Precise & Mission-Critical:** Telemetry-grade precision informed by server diagnostics and vitals monitoring.
- **Literary Craft:** Not a casual quiz engine, but an editorial, immersive chronicle where text carries intellectual weight.

### Design Movement: Technical Editorial & Deep Telemetry
The visual identity fuses **Classical Literary Editorial** with **Industrial Systems Monitoring**. 
- Deep midnight navy foundations anchor the canvas to minimize OLED battery draw and eye fatigue during long scenario reading sessions.
- High-tension amber-orange highlights deliver urgency and call out interactive branches.
- Ultra-fine technical grids, subtle ECG/telemetry coordinate ticks, and structural parchment-inspired layout divisions bring the feel of a field manual running live on a diagnostic panel.

## Colors

The palette is engineered specifically for deep-contrast mobile dark mode, balancing high-density readable text against clear operational states.

### Palette Architecture
- **Primary Accent (`#F28C28`, `#FF9F43`):** Radiant Amber. Used for actionable choice nodes, interactive prompts, narrative branch forks, and critical focus states.
- **Success Metric (`#10B981`, `#059669`):** Stable Telemetry Green. Reserved for successful deployments, zero-downtime checkpoints, and positive system health indicators.
- **Crisis / Error (`#EF4444`, `#DC2626`):** Critical Breach Red. Designates stack overflows, system crashes, latency spikes, and dead-end scenario failures.
- **Surfaces & Layers:**
  - Base Environment: `#0B132B` (Pitch Midnight)
  - Surface Tier 1 (Cards, Folios): `#0F1B33` (Deep Naval)
  - Surface Tier 2 (Panels, Bottom Sheets): `#152244` (Telemetry Deck)
  - Surface Tier 3 (Pills, Elevated Indicators): `#1C2D54` (Active Rim)
- **Text & Editorial Grayscale:**
  - `High Contrast Text`: `#F8FAFC` (Book Page White)
  - `Body Narrative`: `#E2E8F0` (Muted Technical Cream)
  - `Metadata / Ticks / Secondary`: `#94A3B8` (Slate Coordinate)
  - `Grid Lines / Subtle Dividers`: `rgba(148, 163, 184, 0.12)`

## Typography

The typographic hierarchy intentionally divides narrative pacing from operational utility:

1. **Chapter & Section Voices (`Merriweather`):** Evokes printed software engineering literature, RFC titles, and field case studies. Strong vertical contrast anchors long-form decision intros without inducing eye fatigue.
2. **System Interface & Choice Nodes (`Plus Jakarta Sans`):** Clean, geometric grotesque curves optimize legibility on high-density mobile glass. Used across decision prompts, stat monitors, terminal logs, and bottom-sheet controls.
3. **Leading & Rhythm:** Body text maintains an intentional 1.6x line-height ratio, guaranteeing comfortable scanning while walking or using one-handed grip.

## Layout & Spacing

### Mobile-First Vertical Chassis
The layout model is optimized strictly for vertical viewport ratios (9:16 to 9:20) on mobile devices:
- **Outer Margins:** Fixed 16px (`1rem`) on phone viewports to maximize line length while protecting thumb touch targets.
- **Top Header Safe Zone:** Accommodates notch/island with persistent Chapter Number, Turn Indicator, and System Vital gauges.
- **Thumb Zone Anchor:** Actionable decision cards and secondary interaction nodes are clamped within the lower 42% of the viewport.
- **Editorial Folio Margins:** Inner book blocks use `space-lg` padding to emulate the breathing room of an open technical reference book.
- **Tablets / Larger Screens:** Layout shifts to a centered 540px fixed container surrounded by subtle schematic coordinate lines.

## Elevation & Depth

Visual hierarchy does not use soft, fuzzy drop shadows. Instead, it relies on **structural tiering, laser-thin telemetry borders, and precise directional glow**:

1. **Tonal Tiering:** 
   - Level 0: `#0B132B` (Scenario Backdrop)
   - Level 1: `#0F1B33` (Narrative Folio Canvas)
   - Level 2: `#152244` (Decision Cards, Diagnostic HUD)
   - Level 3: `#1C2D54` (Modal Drawers & Overlays)

2. **Ghost Borders & Edge Treatment:**
   - Elements are delineated by a 1px border at `rgba(148, 163, 184, 0.16)`.
   - Active interactive states switch this boundary to 1px solid `rgba(242, 140, 40, 0.6)`.

3. **Subtle Pulse Glow:**
   - Critical system states (e.g., severe latency, incident mode) cast an inner rim highlight: `0 0 16px rgba(239, 68, 68, 0.15)`.
   - Stable system checkpoints emit a soft vertical bleed: `0 4px 20px rgba(16, 185, 129, 0.12)`.

## Shapes

The geometry reflects a modern electronic reader crossed with an industrial instrument:
- **Base Components (Cards, Panels, Inputs):** 8px (`0.5rem`) corner radius. This conveys structural precision without the harshness of a raw brutalist grid.
- **System Badges & Chips:** 4px to 8px radius to retain an architectural, hardware-tag look.
- **Interactive Thumb Buttons:** 12px to 16px radius for ergonomic touch affordance.
- **Technical Insets:** Folio cutouts and diagnostic monitors feature clean right angles on interior lines with smoothed exterior perimeters.

## Components

### 1. Decision & Choice Cards (Thumb-Friendly)
- **Geometry & Sizing:** Minimum height 64px, target padding `16px 20px`. Full viewport width minus canvas margins.
- **Structure:** Left edge features a 3px accent stroke (amber when selectable, gray when locked). Displays an alphanumeric prefix (`[A]`, `[B]`, `[C]`) in bold technical sans.
- **Interaction:** Active touch triggers an immediate shift from surface `#152244` to `#1C2D54` with a 1px amber border glow.

### 2. Scenario Information Folios
- **Visual Cue:** Emulates an opened page from an engineering compendium.
- **Background:** `#0F1B33` with an ultra-faint watermark grid (24px square lines, 3% opacity).
- **Dividers:** Fine hairpins incorporating small coordinate ticks (`+`, `-`, or telemetry icons).

### 3. Telemetry & Vital Status Trackers (EKG / System Health)
- **Bar Trackers:** Real-time metrics for "System Latency", "Error Budget", and "Team Sanity".
- **Visuals:** 4px tall tracks with dynamic fills (`#10B981` normal, `#EF4444` breached). Right-aligned live values formatted like diagnostic stream data (`24ms`, `99.98%`).

### 4. Technical Badges & Incident Chips
- **Design:** Compact, uppercase metadata tags (`RFC-2119`, `CRITICAL`, `POST-MORTEM`, `PROD`).
- **Coloring:** Semitransparent fill (`10%`) paired with a high-contrast label matching the status color.

### 5. Hints & Diagnostic Bottom Sheets
- **Backdrop:** Screen dim with `#0B132B` at 80% opacity and a 6px blur.
- **Handle:** 36px wide, 4px thick pill in `#94A3B8` (40% opacity).
- **Content:** Architectural diagrams, architectural tips, and spoiler-shielded decision hints rendered in high-legibility sans-serif text.