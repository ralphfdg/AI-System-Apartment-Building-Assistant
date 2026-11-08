---
name: Sohei project site
description: South Heights as a building you walk through; the navigation is the building, every page is a floor reached by lift, every section is a room.
colors:
  cream: "#F5F0E6"
  linen: "#EDE6D8"
  stone: "#E3DAC8"
  hair: "#DDD3C0"
  sand: "#C8B48A"
  sage: "#7F8C6A"
  olive: "#5F6B4F"
  moss: "#4A5E52"
  forest: "#1E3B2F"
  pine: "#2C5242"
  night: "#152820"
  deep: "#0E1C16"
  leaf: "#3A644F"
  mint: "#DDE6D6"
  lamp: "#E8B65A"
  lamp-hi: "#F4D594"
  clay: "#94482D"
  clay-soft: "#F4E3D8"
  ochre: "#7A6224"
  ochre-soft: "#F1E7CF"
  steel-hi: "#F1F2EF"
  steel: "#C9CDCA"
  steel-mid: "#A7ADAA"
  steel-lo: "#7D8481"
  steel-dk: "#4E5552"
typography:
  display:
    fontFamily: "Tinos, Times New Roman, Times, serif"
    fontSize: "clamp(2.5rem, 4vw + 1rem, 4.25rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  level-numeral:
    fontFamily: "Tinos, Times New Roman, Times, serif"
    fontSize: "clamp(4.5rem, 9vw, 7.5rem)"
    fontWeight: 400
    lineHeight: 0.8
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Tinos, Times New Roman, Times, serif"
    fontSize: "clamp(2.25rem, 3.6vw + 1rem, 3.75rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Tinos, Times New Roman, Times, serif"
    fontSize: "2rem"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  subtitle:
    fontFamily: "Tinos, Times New Roman, Times, serif"
    fontSize: "1.375rem"
    fontWeight: 700
    letterSpacing: "-0.005em"
  lede:
    fontFamily: "Tinos, Times New Roman, Times, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Tinos, Times New Roman, Times, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Tinos, Times New Roman, Times, serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    letterSpacing: "0.08em"
  mono:
    fontFamily: "Cousine, Courier New, monospace"
    fontSize: "0.9375rem"
    fontWeight: 400
    fontFeature: "tnum"
rounded:
  sm: "2px"
  lg: "4px"
spacing:
  "4": "4px"
  "8": "8px"
  "12": "12px"
  "16": "16px"
  "24": "24px"
  "32": "32px"
  "48": "48px"
  "64": "64px"
components:
  button-tour:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.cream}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-tour-hover:
    backgroundColor: "{colors.pine}"
  lift-button:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.forest}"
    rounded: "{rounded.sm}"
    padding: "12px 16px 12px 12px"
  lift-button-hover:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.cream}"
  todo-marker:
    backgroundColor: "{colors.linen}"
    textColor: "{colors.forest}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  evidence-plate:
    backgroundColor: "{colors.linen}"
    padding: "16px"
  masthead:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.cream}"
    height: "72px"
  level-band:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.cream}"
  tower:
    backgroundColor: "{colors.night}"
    textColor: "{colors.stone}"
    width: "320px"
  lift-doors:
    backgroundColor: "{colors.forest}"
  room-tab-selected:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.cream}"
  verdict-gap:
    textColor: "{colors.forest}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
---

# Design System: Sohei project site

## Overview

**Creative North Star: "The Building"**

The site is South Heights Apartments itself. Each page is a level (G, 1 to 9, and a 6M mezzanine for the runbook). The navigation is the building itself, drawn as a cross-section on the left: floors 9 down to G, the runbook as a half-height mezzanine, a Sage door on the ground floor and the student standing outside on the pavement. Choosing a floor rides the lift: the doors shut over the page, the floors count past, and the doors open on the new floor. Each floor is split into rooms (5.1, 5.2 …), one open at a time, so no page is a long scroll. Reading happens on a Cream page framed by Forest and Night, with Sand lettering that reads like brass. Unfinished work shows as dashed boxes and punched-corner plates. State is always visible and never faked.

It is a calm, document-first world: one serif voice (Tinos, the same Times metric as the Sohei app), a mono voice (Cousine) for anything you could check (IDs, times, commands), 1px lines instead of boxes, 2px corners, no shadows. Bootstrap 5.3.3 is the engine but never shows: every colour, radius and font comes through the CSS variables in `docs/assets/css/site.css`.

**Key Characteristics:**
- Dark frame (the building, level bands, footer), light reading column.
- Sand is the "brass": level numerals, the lit windows of your floor, the ground line, hairlines under dark bands, the lift-door seam.
- Hairlines and stamps carry structure and state; there are no cards and no shadows.
- Mono tabular figures for every ID, time and command.
- One authored moment: the lift ride between floors. Everything else is quiet (a 0.3s room fade, the person waving).

## Colors

**Accents and shades (added 8 Nov 2026, "colors too plain").** Each accent has one job:
- **Lamp** (`#E8B65A`, with Lamp-hi): warm window light. "You are here" in the building, the level numeral, the open room's number, the lift-door floor count, the person on hover. Only on dark surfaces.
- **Clay** (`#94482D`, with Clay-soft): needs attention. To-do markers, the "Gap" verdict, the alarm segment of the alert timeline, the lobby canopy, the link underline on hover. 5.1:1 on Cream.
- **Mint** (`#DDE6D6`): soft green surface. Table head rows, the "Good" verdict, hover on room tabs, the "recovered" timeline segment.
- **Ochre** (`#7A6224` on Ochre-soft): the "Adequate" verdict.
- **Steel** ramp (Steel-hi to Steel-dk): the lift only. Brushed-steel doors, the car in the shaft, sign posts, the parapet coping.
- **Deep** and **Leaf**: the night sky behind the building and the footer (Deep); the lit floor row (Leaf).


A warm, low-chroma building palette from the Sohei app (`config/librechat.yaml`), deep greens framing a cream page.

### Primary
- **Forest** (frame, text): masthead, level bands, directory board, footer, body text, headings, links, primary buttons, the heavy rule above tables and lists.
- **Night** (deep field): the home hero behind the building; dark text on Sand.
- **Pine** (frame lines): hover fill on dark surfaces, hairlines inside the dark frame, unlit window strokes.

### Secondary
- **Sand** (brass): level numerals, lit windows, current lift/directory button, `h2` rules on the page, plate borders, to-do dashes, text selection, focus outline on dark surfaces.

### Tertiary
- **Sage** (door, quiet marks): the door in the mark, "good" verdict border, unlit-window and lift-track outlines. Never text on Cream (too low contrast).

### Neutral
- **Cream** (page): body background, lettering on dark surfaces.
- **Linen** (paper): evidence plates, to-do markers, code and `pre`, the "down" segment of the timeline.
- **Stone** (soft lettering on dark): ledes, footer text, small labels on Forest and Night.
- **Hair** (#DDD3C0, derived): row dividers in tables, fact lists and pillars; Bootstrap border colour.
- **Olive** (markers): list markers, to-do icon, verdict text, registration corners.
- **Moss** (secondary text on Cream): table header labels, captions, small notes, to-do state text.

### Named Rules
**The Brass Rule.** Sand is metal, not paint. It marks numerals, lit windows, rules and the "you are here" state; it is never a large fill on Cream and never body text on Cream.

**The Dark Frame Rule.** Forest and Night hold the navigation and page titles; reading always happens on Cream. Don't put long text on the dark frame.

## Typography

**Display Font:** Tinos (with Times New Roman, Times, serif)
**Body Font:** Tinos
**Label/Mono Font:** Cousine (with Courier New, monospace), 400 and 700

**Character:** One Times-metric serif carries the whole site, so "000" and numbers read like the Sohei app. Cousine appears only for things a marker could check.

### Hierarchy
- **Display** (400, clamp 2.5–4.25rem, 1.02): the home hero heading on Night, balanced wrap.
- **Level numeral** (400, clamp 4.5–7.5rem, 0.8, Sand): the big level number at the left of each level band.
- **Headline** (400, clamp 2.25–3.75rem, 1.05): the page title in the level band.
- **Title** (400, 2rem, 1.15): `h2` sections in the reading column, each with a Sand rule above.
- **Subtitle** (700, 1.375rem): `h3` inside a section.
- **Lede** (400, 1.25rem, 1.5, Stone): the one-line description under a page title.
- **Body** (400, 1.0625rem, 1.65): reading text, column max 42rem.
- **Label** (700, 0.8125rem, 0.08em, uppercase, Moss): table headers and the stacked-row labels on phones. The lift's "Level" label is the only other uppercase text (0.75rem, 0.12em, Stone).
- **Mono** (0.9375rem, tabular): times, IDs, the lift number, evidence stamps, commands.

### Named Rules
**The Checkable Rule.** If a reader could check it (an E-ID, a timestamp, a command, a resource name), set it in Cousine with tabular figures. Prose never goes mono.

## Layout

- **One left edge.** Everything sits in a shell of 1040px plus 24px side padding (16px on phones).
- **Reading column** is 42rem; tables, plates, the timeline, pillars and `.wide` blocks run the full 1040px.
- **Spacing** uses the scale in the frontmatter. 12px is the row-padding half-step (table cells, list rows, lift buttons); 40px appears for `h3` and plate margins. Sections open with 64px above the `h2`.
- **The building:** fixed 320px column on the left from 992px up; floor height `--fh` = clamp(34px, (100dvh − 300px) / 10.6, 60px) so the whole building fits one screen when it can. Under 992px a 56px Night top bar shows the floor and opens the building as a slide-in panel.
- **Level band:** numeral and title on a two-column grid, 48px top, 32px bottom; one column on phones.
- **Lobby (G):** intro facts (7fr) beside the video and key facts (5fr); one column under 1200px.
- **Rooms:** sections become rooms behind a sticky room bar (top 0, or under the top bar on phones); only one room is visible.
- **Breakpoints:** 400, 576, 768, 992, 1360px. Under 768px, tables with headers become label/value rows (labels added by `site.js`). At 992px and up the building is a fixed column on the left.

## Elevation & Depth

Flat. There are no shadows anywhere (Bootstrap's focus shadow on the menu toggle is switched off). Depth comes from the dark frame versus the light page, Linen paper on Cream, and 1px lines: Sand under dark bands, a Forest rule above tables, Hair between rows.

**The No-Shadow Rule.** Nothing floats. If something needs to stand out, give it a line, a Linen ground or a stamp.

## Shapes

- Corners are 2px on buttons, code, to-dos and badges; 4px is the Bootstrap large radius. The building, its floors and the lift doors have square corners.
- The only round shape is the circle around the arrow in the lift buttons, like a real lift call button.
- **Stamps:** evidence IDs sit in a mono box with a 1.5px Forest border, tilted -3deg, over the top edge of the plate.
- **Punched corner:** a missing screenshot is a dashed plate with its top-right corner cut off at 32px, drawn with its own Sand line.
- **Registration corners:** filled plates carry four 12px Olive corner ticks.
- **Icons:** one SVG stroke family, 16px box, 1.5px stroke, square caps (`_includes/icon.html`). Tick = done, dashed box = to do.

## Components

### Buttons
- **Tour (primary):** Forest fill, Cream text, 12px 24px, 2px corners; Pine on hover.
- **Lift buttons (previous / next level):** 1px Forest outline, arrow in a 32px circle, a small Moss line ("Up to level 1") above the title. Hover fills Forest with Cream text. "Up" sits on the right and mirrors.
- **Focus:** 2px Forest outline, 3px offset; Sand on dark surfaces.

### Navigation
- **The building (`_includes/tower.html`):** Night-to-Deep sky; a rooftop sign (Night board, Sand border, Lamp top edge, on two steel posts) carries the light Sohei logo and links to the lobby; a Pine parapet with steel coping; a Forest facade with a Pine pilaster on the left and 3px Night floor slabs; one row per floor from `_data/levels.yml` (mono Sand number, short name in Stone, three glass windows with a reflection). Your floor is lit: Leaf row, Cream name, number on a Lamp plate, Lamp windows. A lift shaft with two rails runs down the right side; a small brushed-steel car waits at your floor and rides to the next floor during the lift ride. The 6M mezzanine is a half-height, inset row with a dashed line. The ground floor (G, Lobby) is taller, with glass double doors in a steel frame under a Clay canopy; the doors light Lamp on the lobby. A paved strip with a Sand kerb line is the ground. "Live Sohei" and "Source on GitHub" sit under it.
- **The person outside:** an authored pictogram (head, body, arms, legs) in Stone on the pavement right of the door. Hover, focus or tap: it turns Lamp, raises its right arm (0.45s) and a Cream speech bubble with a Sand border introduces the student (text from `intro` in `_config.yml`) with a link to the Declaration. Escape or a click elsewhere closes a pinned bubble.
- **Lift doors (the ride):** clicking any link to another floor shuts two brushed-steel doors (Steel ramp, fine vertical grain, a kick plate at the bottom, a dark seam) over the page in 0.42s; a Night header with a steel edge shows a Lamp arrow, the floor number counting floor by floor and the destination's name, while each floor passed lights in the building. Then the page changes; the new page paints with the doors shut (set in `<head>` from `sessionStorage`) and opens them. Skipped with reduced motion, modifier keys, new tabs and same-floor links.
- **Top bar (under 992px):** Night, 56px, Sand line; logo left; a button with the floor number and short name that opens the building.

### Level band
Forest band at the top of each floor with a large Sand level numeral, the page title in Cream and a Stone lede; Sand line at the bottom.

### Rooms
`site.js` turns each `h2` section of a floor into a room: a sticky room bar of tabs (mono number like `5.2`, then the section name; selected = Forest fill, Cream text, Sand number), one visible room, and a "Next room" button at the end of each room. Links to any id inside a room (`operations.html#security`, `#e-06`) open that room. Pages with fewer than two sections, and the lobby (`rooms: false`), stay as one page. Print shows every room.

### Evidence plate
Linen plate, 1px Sand border, 16px padding, tilted ID stamp, registration corners, caption in 14px Moss starting with the mono E-ID. When the file is missing, the same plate turns dashed with a punched corner and names the exact file to save. The video is a Google Drive file (`video_url` in `_config.yml`, shared "Anyone with the link") shown in the same plate; with no link the plate is a placeholder.

### To-do marker
Inline Linen box, 1px dashed Sand border, dashed-box icon in Olive, "To do" in small caps, then the text. Always one line so it fits in table cells.

### Tables and fact lists
Hairline rows, no zebra, Forest rule on top, uppercase Moss labels. On phones each row stacks as label/value pairs with the first cell as the row title.

### Alert timeline
A 48px bar outlined in Forest; segment widths are real minutes (down = Linen, alarm = Forest, recovered = Sand). A four-column legend with mono times sits under it.

### Verdict badges
Small text with a 1px border and 2px corners: good = Sage border, adequate = Sand border, gap = Forest border. Text is Olive or Forest.

## Do's and Don'ts

### Do:
- **Do** take every colour, radius and font from the variables in `site.css`; restyle Bootstrap through them, never by stock classes alone.
- **Do** keep reading text on Cream at 42rem wide; let tables, plates and the timeline use the full 1040px.
- **Do** use Cousine with tabular figures for every E-ID, time, command and resource name.
- **Do** show unfinished work with the to-do marker or a missing plate, so the student only drops files and never edits pages.
- **Do** keep all motion behind `prefers-reduced-motion` (the CSS already cuts it to near zero).
- **Do** use Moss or Olive for small text on Cream; both pass 4.5:1.

### Don't:
- **Don't** add shadows, cards or zebra stripes; use lines and Linen paper.
- **Don't** use Sage or Sand as text on Cream; they fail contrast.
- **Don't** add uppercase labels above headings; uppercase is for table headers and the lift label only.
- **Don't** use a stock Bootstrap look (blue navbar, white page, card grid of features).
- **Don't** use emoji or icon fonts; add new icons to `_includes/icon.html` in the same 1.5px stroke.
