# Design System Strategy: High-End Music Editorial

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Kinetic Gallery."**

This is not a utility-first application; it is a high-end digital experience that treats music and collaboration as fine art. We move beyond the standard "SaaS grid" by embracing intentional asymmetry, cinematic scale, and atmospheric depth. The interface should feel like it was carved out of light and shadow, using the vibrant oranges and reds of the palette to simulate a "glowing ember" effect against a void-like background.

By leveraging overlapping elements, high-contrast typography scales, and real-time collaborative indicators that feel like "digital pulses," we create an environment that feels alive, exclusive, and premium.

---

## 2. Colors: Tonal Depth & The Glow
The color strategy relies on the interplay between the absolute dark of the `neutral_color_hex` (`#0e0e0f`) and the high-energy vibration of the `primary_color_hex` (`#ff906d`) and `secondary_color_hex` (`#fd8b00`) accents.

*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Structural boundaries must be defined solely through background shifts. Use `surface-container-low` for large content blocks sitting on a `surface` background.
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers.
*   **Level 0:** `background` (#0e0e0f) - The canvas.
*   **Level 1:** `surface-container` (#1a191b) - Main interaction zones.
*   **Level 2:** `surface-container-highest` (#262627) - Interactive cards and modal elements.
*   **The "Glass & Gradient" Rule:** Use Glassmorphism for floating UI (like music players or collaborative chat bubbles). Apply a semi-transparent `surface-variant` with a 20px-40px backdrop blur.
*   **Signature Textures:** Main CTAs should not be flat. Use a linear gradient transitioning from `primary_color_hex` (#ff906d) to `primary-container` (#ff784d) at a 135-degree angle to create a "glowing edge" effect inspired by high-end automotive displays.

---

## 3. Typography: Editorial Authority
We use a tri-font system to establish a clear hierarchy that feels like a premium music magazine.

*   **Display & Headlines (Public Sans):** These are the "hero" elements. Use `display-lg` (3.5rem) with tight letter spacing (-0.02em) for landing page titles. This typeface provides the modern, geometric "Bionic" feel.
*   **Titles & Body (Manrope):** Manrope offers high legibility for track titles (`title-lg`) and long-form descriptions (`body-md`). It balances the sharpness of the headlines with a human, approachable touch.
*   **Labels (Manrope):** Reserved for technical metadata, timestamps, and utility buttons (`label-md`). Manrope is strictly functional, providing a grounded contrast to the more expressive headers.

---

## 4. Elevation & Depth: Atmospheric Layering
Traditional shadows are too "standard." In this design system, depth is environmental.

*   **The Layering Principle:** Stacking is the primary method of separation. An active collaboration card (`surface-container-highest`) should sit atop a podcast feed (`surface-container-low`), creating a natural lift.
*   **Ambient Shadows:** For floating elements, shadows must be extra-diffused. Use a 40px blur with only 6% opacity, using the `on-surface` color. This simulates a soft glow rather than a harsh drop shadow.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use the `outline-variant` (#484849) at **15% opacity**. This "Ghost Border" should be barely perceptible, serving as a suggestion of an edge rather than a hard constraint.
*   **Glassmorphism Depth:** To represent real-time collaboration, use semi-transparent containers that allow the "glow" of the primary accents to bleed through from the background, making the UI feel integrated into the "digital nebula."

---

## 5. Components: Precision & Soul

### Buttons
*   **Primary:** Gradient fill (`primary_color_hex` to `primary-container`), `rounded-full`, no border. Text uses `on-primary-fixed` (Black) for maximum punch.
*   **Secondary:** Glassmorphic background with a `Ghost Border`.
*   **Tertiary:** Text-only using `primary-dim` with an underline that appears only on hover.

### Collaborative Audio Cards
*   **Structure:** No divider lines. Use `xl` (1.5rem) corner radius.
*   **Visuals:** Large-scale album art that bleeds into the container edges. The "Now Playing" state uses a `secondary_color_hex` (#fd8b00) outer glow to signify a live session.

### Interaction Elements
*   **Chips:** Use `surface-container-high` for unselected and `primary_color_hex` for selected. Forbid borders; use `md` (0.75rem) roundedness.
*   **Input Fields:** Ghost-style inputs. Only the bottom edge is defined by a 10% opacity `outline`. Focus states trigger a `primary_color_hex` glow transition.
*   **Collaborator "Pulses":** Small avatars with a `tertiary_color_hex` (#9fa3ff) ring that pulses to indicate real-time audio activity.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use moderate whitespace. Elements should breathe, but the overall feeling is compact and precise, like a high-end audio setup.
*   **Do** use asymmetrical layouts (e.g., a large headline on the left with a floating card partially overlapping it on the right).
*   **Do** apply `backdrop-filter: blur(20px)` to all floating navigation bars.
*   **Do** utilize the `error` (#ff716c) and `error_container` (#9f0519) colors for high-energy destructive actions to maintain the warm/vibrant theme.

### Don't:
*   **Don't** use pure white (#ffffff) for anything other than `on-surface` text. Never use it for backgrounds or borders.
*   **Don't** use standard "Material" 2px shadows. They look "cheap" in a high-end dark theme.
*   **Don't** use divider lines to separate list items. Use 24px–32px of vertical padding instead.
*   **Don't** use sharp corners. Stick to the `lg` (1rem) and `xl` (1.5rem) scales to maintain a sophisticated, soft-tech aesthetic.