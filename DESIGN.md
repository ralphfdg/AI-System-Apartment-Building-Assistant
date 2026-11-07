---
name: Sohei project site
description: South Heights as a building you walk through; every page is a level, reached by a directory board and a lift.
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
  home-hero:
    backgroundColor: "{colors.night}"
    textColor: "{colors.cream}"
  verdict-gap:
    textColor: "{colors.forest}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
---

# Design System: Sohei project site

## Overview

**Creative North Star: "The Lobby Directory"**

The site is South Heights Apartments itself. Each page is a level (G, 1 to 9, and a 6M mezzanine for the runbook). A visitor finds a level on the directory board, rides the lift, and reads on a Cream page framed by Forest and Night, with Sand lettering that reads like brass. Finished work shows as lit windows and ticked stamps; unfinished work shows as dark windows, dashed boxes and punched-corner plates. State is always visible and never faked.

It is a calm, document-first world: one serif voice (Tinos, the same Times metric as the Sohei app), a mono voice (Cousine) for anything you could check (IDs, times, commands), 1px lines instead of boxes, 2px corners, no shadows. Bootstrap 5.3.3 is the engine but never shows: every colour, radius and font comes through the CSS variables in `docs/assets/css/site.css`.

**Key Characteristics:**
- Dark frame (masthead, level bands, directory board, footer), light reading column.
- Sand is the "brass": level numerals, lit windows, hairlines under dark bands, the current lift button.
- Hairlines and stamps carry structure and state; there are no cards and no shadows.
- Mono tabular figures for every ID, time and command.
- Motion only where the building moves: windows light, the board drops, the lift counts.

## Colors

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
- **Level band:** numeral and title on a two-column grid, 64px top, 48px bottom; one column on phones.
- **Home hero:** building (5fr) and text (7fr), bottom-aligned so the building stands on the Sand ground line; stacked on screens under 992px, building first.
- **Breakpoints:** 400, 576, 768, 992, 1360px. Under 768px, tables with headers become label/value rows (labels added by `site.js`). At 1360px and up the lift indicator moves to a fixed column on the left edge with a track of section buttons.

## Elevation & Depth

Flat. There are no shadows anywhere (Bootstrap's focus shadow on the menu toggle is switched off). Depth comes from the dark frame versus the light page, Linen paper on Cream, and 1px lines: Sand under dark bands, a Forest rule above tables, Hair between rows.

**The No-Shadow Rule.** Nothing floats. If something needs to stand out, give it a line, a Linen ground or a stamp.

## Shapes

- Corners are 2px on buttons, code, to-dos and badges; 4px is the Bootstrap large radius. The directory board has square corners.
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
- **Masthead:** sticky Forest bar, 72px (64px on phones), light logo left, "Directory" and "Live site" right in Cream, Sand on hover.
- **Directory board (mega menu):** full-width Forest panel with Sand borders top and bottom, unrolls from the top (clip-path, 0.35s). Two columns of levels: mono Sand level number, title, mono Stone E-IDs. The current level is lit: Pine row, number in a Sand button.
- **Lift indicator:** "Level" plus a mono Sand number. On a page change it counts floor by floor from the last level visited, with a direction arrow while moving. At 1360px+ it is a fixed panel with one small bar per section; the current section bar fills Sand.

### Level band
Forest band under the masthead with a huge Sand level numeral, the page title in Cream and a Stone lede; Sand line at the bottom.

### Lit-window building (home)
The Sohei mark drawn tall on Night. One window per project part (`_data/progress.yml`): done = Sand, to do = Night with Pine stroke. With motion allowed, windows light in order (140ms apart, 0.6s each). Hovering a window highlights its row in the parts list beside it, and the other way round.

### Evidence plate
Linen plate, 1px Sand border, 16px padding, tilted ID stamp, registration corners, caption in 14px Moss starting with the mono E-ID. When the file is missing, the same plate turns dashed with a punched corner and names the exact file to save. Video placeholder uses the same form.

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
