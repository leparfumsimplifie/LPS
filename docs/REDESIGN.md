# Le Parfum Simplifié — Premium Learning redesign

Handover notes for the redesigned customer journey: **Homepage → Premium Learning page → Membership product page**.

Everything here is an add-on to the live **Horizon 4.3.0** theme (`horizon-lps`). No existing Horizon file is modified. The header, footer, cart drawer, checkout and every other page and product are left untouched.

---

## 1. What was built

### Shared design system

| File | Purpose |
|---|---|
| `assets/lps.css` | Editorial design system for all new sections. It reuses Horizon's heading and body fonts (`--font-heading--family` = Playfair Display, `--font-body--family` = Inter), page width and page margins. Palette: ivory `#f7f3ec`, the existing cream `#efe8da`, sand `#e4d9c6`, the existing slate text colour `#1e293b`, warm charcoal `#1d1c1a` and a restrained amber accent. Includes CSS-only scroll reveals (scroll-driven animations, disabled under `prefers-reduced-motion`) and responsive layouts down to 320px. |
| `assets/lps.js` | Small progressive-enhancement module (about 2.5 KB): click-to-enlarge screenshots in a native `<dialog>`, and "Expand all modules" for the curriculum. The pages work fully without it. |
| `snippets/lps-assets.liquid` | Loads the CSS and JS. Rendered by each section; the module script runs once per page. |
| `snippets/lps-media.liquid` | Responsive `image_tag` with srcset/sizes, lazy loading, `fetchpriority="high"` for hero images, focal-point support and optional zoom. When no image is set, it shows a tonal placeholder with the exact photography brief. |
| `snippets/lps-intro.liquid` | Section number, eyebrow, heading and copy pattern. |
| `snippets/lps-icon.liquid` | Three line icons (arrow, check, dash). No cartoon icons. |
| `snippets/lps-confirm.liquid` | Shows "To confirm before publishing" notes **only inside the theme editor** (`request.design_mode`). Never rendered to customers. |

### Sections (all OS 2.0, editable in the customiser, reusable on any page)

| Section (customiser name) | File | Used for |
|---|---|---|
| LPS · Editorial hero | `sections/lps-hero.liquid` | Full-bleed photograph with text over it, or split photograph/text. Optional mobile crop, shading, two understated buttons, detail line. |
| LPS · Image with text | `sections/lps-split.liquid` | Alternating editorial image/text, optional second detail image, numbered list, **image annotations** (numbered key on mobile), sticky image. |
| LPS · Editorial panels | `sections/lps-panels.liquid` | Two to four large image panels with links. Optional **live product price**, staggered layout, swipe on mobile. |
| LPS · Curriculum | `sections/lps-curriculum.liquid` | Expandable modules (native `<details>`), with an "In development" badge per module and expand/collapse all. |
| LPS · Platform showcase | `sections/lps-showcase.liquid` | Alternating or gallery layout for screenshots in browser, laptop or phone frames, with click to enlarge. |
| LPS · Formula library | `sections/lps-formula-library.liquid` | Formula sheet preview with **quantities withheld**, or an uploaded formula screenshot, plus key figures. |
| LPS · Feature grid | `sections/lps-features.liquid` | Ruled or card grid with **"Available now" / "In development" badges**. |
| LPS · Steps | `sections/lps-steps.liquid` | Numbered steps ("How access works"). |
| LPS · Free vs Premium | `sections/lps-comparison.liquid` | Accessible comparison table showing the live price. |
| LPS · FAQ | `sections/lps-faq.liquid` | Accordion plus optional FAQPage structured data. Only answers you mark "Include in search results" are added. |
| LPS · Purchase invitation | `sections/lps-purchase.liquid` | Live Shopify price, a "One-time payment" label (shown automatically only when the product has no subscription plan), benefits list, and one primary button: go to the product page, add to cart, or add to cart and go to checkout. |
| LPS · Image banner | `sections/lps-banner.liquid` | Full-width closing banner with optional live price. |

### Theme block

| Block | File | Purpose |
|---|---|---|
| LPS · Membership benefits | `blocks/lps-benefits.liquid` | Benefits checklist beside the buy button inside Horizon's product details. It shows "One-time payment — no recurring charge" from live product data and hides the quantity selector for this product only. |

### Templates

| Template | Assign to | Sections, in order |
|---|---|---|
| `templates/page.lps-premium-learning.json` | Page **Premium Learning** (`/pages/premium-learning`) | 01 Hero · 02 Why learn perfumery (annotated) · 03 Curriculum (13-module roadmap) · 04 Inside the classroom · 05 Formula library · 06 Learn by doing · 07 Community · 08 Live learning · 09 What is included · 10 Is this right for you? · 11 FAQ · 12 Purchase invitation |
| `templates/product.lps-membership.json` | Product **Le Parfum Simplifie Access** (`/products/le-parfum-simplifie-membership`) **only** | Horizon product section (gallery, title, live price, introduction, benefits block, Horizon's own Add to cart and accelerated checkout) · About the membership · Everything included · Screenshot gallery · How access works · Free vs Premium · Purchase invitation (Add to cart) · FAQ, refunds and support · Closing banner. The "You may also like" block is removed on this template only. |
| `templates/index.json` | Homepage | Immersive hero · Introduction (from the About page) · The learning experience (3 panels) · Inside the platform · Our services (Premium Learning, Software and Bespoke development, with live prices) · Closing banner |

The software product and every other product keep using the default `product.json`, which is unchanged.

---

## 2. Installing into a duplicate, unpublished theme

Your live theme stays as the backup. Nothing is published until you choose to publish.

1. **Shopify admin → Online Store → Themes → `horizon-lps` → ⋯ → Duplicate.** Rename the copy, e.g. `horizon-lps — Premium Learning redesign`.
2. Add the files to the **duplicate** using either option:
   - **Shopify CLI** (recommended). From a clone of this repository:
     ```bash
     shopify theme list --store <your-store>.myshopify.com   # find the duplicate's theme ID
     shopify theme push --store <your-store>.myshopify.com --theme <DUPLICATE_ID> --nodelete \
       --only assets/lps.css --only assets/lps.js \
       --only 'snippets/lps-*' --only 'sections/lps-*' --only 'blocks/lps-*' \
       --only templates/page.lps-premium-learning.json \
       --only templates/product.lps-membership.json \
       --only templates/index.json
     ```
     `--nodelete` makes sure nothing else in the theme is removed.
   - **Code editor.** In the duplicate: ⋯ → Edit code. Create each file under the same folder and name, then paste in its contents. That is 2 assets, 5 snippets, 12 sections, 1 block and 3 templates.
   > `templates/index.json` replaces the duplicate's homepage layout. Your live homepage is unaffected, and the live theme remains the backup.
3. Open the duplicate in the **theme editor** (Customize). Preview each page:
   - Homepage: shown by default.
   - Premium Learning: pick *Pages → lps-premium-learning* in the template selector at the top, then use "Change preview" to choose the Premium Learning page.
   - Product: pick *Products → lps-membership* and preview **Le Parfum Simplifie Access**.
   Orange dashed notes marked **"To confirm before publishing"** appear only in the editor.
4. Add images (section 4 below) and resolve the confirmations (section 5).
5. **Publish** the duplicate, then **immediately** assign the alternate templates. Template assignment is store-wide, not per theme:
   - *Products → Le Parfum Simplifie Access → Theme template → `lps-membership`*. This is safe to do at any time: until the new theme is live, Shopify falls back to the default product template.
   - *Online Store → Pages → Premium Learning → Template → `lps-premium-learning`*. **Do this only after publishing.** The live theme does not contain this template, so assigning it earlier would show the default page layout on the live site.
6. To roll back, republish `horizon-lps` and set the page template back to the template it used before.

---

## 3. Product data to update in Shopify admin (not theme code)

These are store data, so they were not changed:

- **Product media:** the product has one image (the course roadmap). Add genuine screenshots (lesson player, module list, formula study with quantities hidden, Discord) to the product's media so the purchase gallery shows the real platform.
- **Product title:** currently "Le Parfum Simplifie Access", without the accent. Consider "Premium Learning Membership" or "Le Parfum Simplifié — Premium Learning" so it matches the site's language.
- **Alt text** for the three existing images (all currently blank). The sections supply their own alt text, but Horizon's product gallery uses the alt text saved in Shopify.
- **SEO title and meta description** for the Premium Learning page and the product.

---

## 4. Images to supply

Existing Shopify images reused:
- `Minimalist_Precision_Laboratory_Scale.png`: homepage hero (as today).
- `PerfumeryCourseLaptopStillLife_…png`: curriculum section and homepage "Course modules". This is also the product image.
- `Minimalist_Laptop_Fragrance_Dashboard.png`: homepage "Perfumery Software" panel. It shows the software, so it is used only for the software.

Every other image slot shows a placeholder with its brief, both on the page and in the editor. **Screenshots must be genuine**: no mock-ups of functionality that doesn't exist. Blur community members' names and avatars unless they have agreed to appear. Photographs should share one look: warm daylight, pale stone and linen surfaces, amber glass, clear glass, and natural textures without props.

Recommended sizes: full-width banners and heroes at least 2800px wide; split and panel images at least 1600px on the long edge; screenshots at native resolution (1920 × 1080 or larger; phone 1170 × 2532). Upload JPG or WebP at high quality. Shopify serves responsive sizes automatically.

**43 images in total (27 photographs, 16 genuine screenshots).** The section key below matches the section order in each template.

### Homepage — `templates/index.json`

| # | Section (in editor) | Slot | Type | Brief |
|---|---|---|---|---|
| 1 | `intro` (lps-split) | Main image | Photograph | Laboratory photograph: the studio bench seen from above — a balance, rows of labelled amber bottles, glass beakers and an open notebook. Portrait. |
| 2 | `intro` (lps-split) | Secondary image | Photograph | Portrait of Harvey and Kristan at the bench, or a close detail of their hands evaluating smelling strips. |
| 3 | `learning` (lps-panels) | Understand raw materials | Photograph | Macro of raw materials on pale stone: resin tears, a vial of essential oil, aroma-chemical crystals and a dipped smelling strip. |
| 4 | `learning` (lps-panels) | Learn fragrance composition | Photograph | Fan of labelled smelling strips held over a row of amber bottles, soft side light. |
| 5 | `learning` (lps-panels) | Develop your own formulas | Photograph | Hands pipetting a material into a beaker on an analytical balance, notebook open beside it. |
| 6 | `platform` (lps-showcase) | Formula studies to learn from | Screenshot | Genuine screenshot of a formula in the library, quantities blurred. |
| 7 | `platform` (lps-showcase) | A community of independent creators | Screenshot | Genuine Discord screenshot of a community discussion, usernames blurred. |
| 8 | `services` (lps-panels) | Premium Learning | Photograph | Still life: open laptop showing a lesson beside amber bottles and smelling strips on a stone surface. |
| 9 | `services` (lps-panels) | Bespoke fragrance development | Photograph | A finished fragrance in an unlabelled glass bottle beside a brief, mood swatches and smelling strips. |
| 10 | `cta` (lps-banner) | Main image | Photograph | Atmospheric wide photograph of the studio at dusk: amber bottles back-lit by a window, glassware in silhouette. Landscape, minimum 2800px wide. |

### Premium Learning page — `templates/page.lps-premium-learning.json`

| # | Section (in editor) | Slot | Type | Brief |
|---|---|---|---|---|
| 1 | `hero` (lps-hero) | Main image | Photograph | Hero photograph — a working perfumery bench in soft daylight: analytical balance, a rack of labelled amber dilution bottles, glass pipettes, a beaker and a fan of smelling strips beside an open lab notebook. Warm neutral palette, shallow depth of field. Portrait crop, minimum 2000 × 2400px. |
| 2 | `why` (lps-split) | Main image | Photograph | Close-up of a formulation in progress: a pipette releasing a single drop into an amber bottle on the balance pan, the display reading a weight in grams. Natural side light. Portrait crop. |
| 3 | `why` (lps-split) | Secondary image | Photograph | Macro: three labelled smelling strips fanned in a holder, handwritten material names and times. |
| 4 | `classroom` (lps-showcase) | Lessons you can pause, replay and return to | Screenshot | Genuine screenshot: a video lesson mid-playback, ideally showing a material being evaluated or a formula being weighed, with the lesson title visible. 1920 × 1080px. |
| 5 | `classroom` (lps-showcase) | A clear structure, module by module | Screenshot | Genuine full-width screenshot of the course navigation or module list, showing module titles and progress. 2400 × 1500px. |
| 6 | `classroom` (lps-showcase) | Formula studies to examine and learn from | Screenshot | Genuine screenshot of a formula resource as students see it. Hide or blur quantities if you prefer not to show them publicly. |
| 7 | `classroom` (lps-showcase) | Reference material for the bench | Screenshot | Genuine mobile screenshot of a learning resource or material note, as students access it. 1170 × 2532px. |
| 8 | `classroom` (lps-showcase) | A place to ask, share and discuss | Screenshot | Genuine Discord screenshot showing the premium channels list and a helpful discussion thread. Blur usernames and avatars of members who have not given permission. |
| 9 | `formulas` (lps-formula-library) | Detail photograph | Photograph | Macro photograph: a page of a handwritten lab notebook with a formula in progress, a pencil and a smelling strip resting across it. |
| 10 | `practice` (lps-split) | Main image | Photograph | Wide editorial photograph: hands in a lab coat drawing a material into a glass pipette above a row of amber bottles, a balance and a beaker in soft focus. Landscape, minimum 2400px wide. |
| 11 | `practice` (lps-split) | Secondary image | Photograph | Macro: a single blotter dipped in an amber bottle, droplet visible on the tip. |
| 12 | `community` (lps-split) | Main image | Screenshot | Genuine Discord screenshot of the community: channel list on the left and a constructive formula discussion on the right. Blur usernames and avatars unless members have agreed to appear. |
| 13 | `live` (lps-split) | Main image | Screenshot | Authentic photograph or screenshot from a live session: the presenter at the bench with materials and smelling strips, or a video-call frame with the session in progress. Landscape. |
| 14 | `included` (lps-features) | Video education | Photograph | Close-up of a laptop on a bench playing a lesson, amber bottles softly out of focus. |
| 15 | `included` (lps-features) | Formula library | Photograph | Overhead: printed formula sheets with a pencil, a smelling strip and an amber bottle. |
| 16 | `included` (lps-features) | Practical exercises | Photograph | Hands weighing a material into a beaker on an analytical balance. |
| 17 | `included` (lps-features) | Premium community | Screenshot | Cropped Discord screenshot of the premium channels list (no personal details). |
| 18 | `included` (lps-features) | Live sessions | Photograph | Presenter at the bench mid-session, smelling strips in hand. |
| 19 | `included` (lps-features) | Educational resources | Photograph | Macro of raw materials: resin tears, a vial of essential oil and crystals of an aroma chemical on a stone surface. |
| 20 | `purchase` (lps-purchase) | Main image | Photograph | Still life: an amber bottle, a fan of smelling strips and an open lab notebook on a pale stone surface, morning light. Portrait. |

### Membership product page — `templates/product.lps-membership.json`

| # | Section (in editor) | Slot | Type | Brief |
|---|---|---|---|---|
| 1 | `intro` (lps-split) | Main image | Photograph | Editorial photograph: a student at a bench evaluating a smelling strip, a laptop showing a lesson beside a rack of amber dilutions. Portrait. |
| 2 | `included` (lps-features) | Video education | Photograph | Close-up of a laptop playing a lesson on a perfumery bench. |
| 3 | `included` (lps-features) | Formula library | Photograph | Overhead: formula sheets, pencil and smelling strips. |
| 4 | `included` (lps-features) | Practical exercises | Photograph | Hands pipetting into a beaker on a balance. |
| 5 | `included` (lps-features) | Premium community | Screenshot | Cropped Discord screenshot of premium channels (no personal details). |
| 6 | `included` (lps-features) | Live sessions | Photograph | Presenter at the bench during a live session. |
| 7 | `included` (lps-features) | Educational resources | Photograph | Macro of natural and synthetic raw materials on stone. |
| 8 | `gallery` (lps-showcase) | Course modules | Screenshot | Genuine screenshot of the course module list. 2400 × 1500px. |
| 9 | `gallery` (lps-showcase) | Video lessons | Screenshot | Genuine screenshot of a lesson mid-playback. |
| 10 | `gallery` (lps-showcase) | Formula studies | Screenshot | Genuine screenshot of a formula study with quantities blurred. |
| 11 | `gallery` (lps-showcase) | Learning resources | Screenshot | Genuine screenshot of a written learning resource. |
| 12 | `gallery` (lps-showcase) | The premium community | Screenshot | Genuine Discord screenshot of a premium channel, usernames blurred. |
| 13 | `banner` (lps-banner) | Main image | Photograph | Atmospheric wide photograph of the studio bench at dusk: amber bottles back-lit by a window, a balance and glassware in silhouette. Landscape, minimum 2400px wide. |

---

## 5. Business details requiring confirmation

Each item below is also flagged in the theme editor next to the relevant content.

| # | Detail | Current wording / source | What's needed |
|---|---|---|---|
| 1 | **Number of formulas** | "100+": the existing Premium Learning page | Count the formulas available today, then update the figure in *Formula library → Figure* and *Everything included*. |
| 2 | **Course structure** | 13 modules (00–12, with 03.1 and 03.2), taken from the course roadmap image on the product page | Confirm titles, numbering and one-line summaries. Mark unpublished modules "In development". If the roadmap image is a mock-up, replace it with a real screenshot. |
| 3 | **Video duration** | "Approximately 10 hours": the existing page | Confirm it is still accurate. |
| 4 | **How lessons are accessed** | Not stated anywhere on the site | Which platform hosts the lessons, whether a login is created automatically, and how quickly access is granted. This affects "How access works", step 3, and the FAQ. |
| 5 | **Discord: free vs premium** | Free invite link in the footer; "access to the premium learning community" on the existing page | What free members can access; how the premium role is granted after purchase; whether members share formulations for feedback in the premium area. |
| 6 | **Access duration** | Not stated anywhere | Lifetime, 12 months, etc. The FAQ currently says "Please see the membership terms". Please add the real answer and link the terms. |
| 7 | **Recurring fees** | The Shopify product has no subscription plan, so it is a one-time charge. The site states "One-time payment" and "no recurring charge" automatically from product data. | Confirm there are no renewal fees for continued access. |
| 8 | **"Selected bases and raw-material learning resources, subject to the published membership terms"** | Existing page | What this includes today, and where the "membership terms" are published. No terms page was found; only the refund policy exists. |
| 9 | **Live sessions** | "According to the published schedule": existing page | Format (Discord stage, video call, in person) and whether recordings are provided. No frequency is promised anywhere. |
| 10 | **Commercial use of formulas** | "Educational formula studies, distinct from commercially validated, production-ready fragrance formulas": existing page | Whether members may adapt formulas for products they sell, and any licence terms. |
| 11 | **Materials supplied?** | Not stated | Whether any materials or bases ship with the membership. The product is set to not require shipping. |
| 12 | **Equipment list (FAQ)** | General perfumery guidance written for this FAQ | Check it matches the Equipment module's recommendations. |
| 13 | **Illustrative formula sheet** | A classic Eau de Cologne structure, no quantities, labelled "Example layout — not a library formula" | Replace it with a real library formula (quantities hidden) or a screenshot, then update the footer label. |
| 14 | **Hero photograph (homepage)** | The current balance photograph is centred, so the left-aligned headline overlaps it on desktop | A wider workspace photograph with space on the left, plus an optional portrait crop for mobile. |

Deliberately **not** included anywhere: testimonials, accreditation, certificates, qualifications, employment or business-success promises, access duration, discounts, countdowns or urgency.

---

## 6. Testing before publication

What has been verified in this build:
- `shopify theme check` against a clean Horizon 4.3.0 with these files added: **0 offences** in the new files. This includes validating every template setting against the section and block schemas.
- All three templates were rendered locally with a Liquid engine and screenshotted at 1440px and 390px. There is no horizontal scroll at either width. Fixes made during review: mobile FAQ layout, list and figure spacing, the formula sheet label being covered, and laptop-frame overflow.
- Preview renders are in `docs/preview/` (desktop and mobile). They come from a local harness, so the header and footer are mock-ups, and the product page's purchase panel is a stand-in for Horizon's own product section. Only the `lps-*` sections and the benefits block are the real output.
- Editor-only notes appear in editor mode and are absent from the customer view. The FAQ structured data is valid JSON.

Still to test in Shopify (needs your store):
- [ ] Preview all three templates in the duplicate theme's editor on desktop and mobile. Check every section can be edited, reordered and hidden.
- [ ] **Membership product:** Add to cart → cart drawer → checkout, with the live price shown as £120.00. Confirm the quantity selector is hidden and Shop Pay / accelerated checkout still appear.
- [ ] Lower "Add membership to cart" button on the product page: confirm it adds one item and lands on the cart.
- [ ] "Get Premium access" links go to the purchase section (`#membership`).
- [ ] **Software product** (`/products/perfumery-software`) still uses the default template, unchanged.
- [ ] Header navigation, footer, cart drawer, search and customer accounts work on all three pages.
- [ ] Screenshot zoom opens and closes with mouse, keyboard (Esc) and touch. Curriculum "Expand all" works.
- [ ] Keyboard-only pass: visible focus on buttons, links, accordions and zoom. Screen reader check of the comparison table and FAQ.
- [ ] Lighthouse on mobile for the three pages, after real images are added.
- [ ] Safari and iOS: scroll reveals are progressive enhancement (Safari 26+ and Chromium); older browsers show content immediately.
- [ ] Remove every "To confirm before publishing" note (clear the *Editor note* field) once resolved. Turn on *Include in search results* for FAQs once their answers are confirmed.
- [ ] After publishing: assign both templates (section 2, step 5) and spot-check the live URLs.

---

## 7. Included photography (added 23 Oct 2026)

To replace the placeholders, the theme now ships with 23 photographs from a single shoot in a working perfumer's studio: amber bottles, pipettes, scale, notebook and botanicals. They are stored as `assets/lps-photo-<name>.jpg`, at 1800px (heroes 2400px) plus a 900px version for phones.

- **Source and licence:** [Pexels](https://www.pexels.com/license/), photo IDs 8450346–8450519 (one photographer's perfume-making series). The Pexels licence allows free commercial use with no attribution required. Photos must not be resold as-is, or used to imply that the people shown endorse the business. The images were chosen to show hands and details rather than faces, so nobody pictured can be mistaken for Harvey or Kristan.
- **How it works:** every image slot has an **Included photograph** dropdown in the theme editor. Choose your own image in the image picker above it and that image is used instead.
- **Placeholders** ("Photography required") now appear **only inside the theme editor**. Customers never see them; an empty slot is simply hidden.
- **Honesty safeguards:**
  - The classroom section is retitled "How you will learn" and notes that the photographs are illustrative.
  - The homepage section is retitled "What you will learn, and how".
  - The product page's screenshot gallery is **hidden** until genuine screenshots are added. Turn it back on in the customiser.

### Branding fixes in the full-theme zip
- Fonts match the live site: Playfair Display for headings, Inter for body text.
- Palette: ivory `#F7F3EA`, charcoal `#1E293B`, cream `#EFE8DA`. Buttons are now charcoal; on the live site they are bright blue `#0066FF`.
- Square corners throughout.
- The favicon is your "Le parfum simplifié" wordmark.
- The generic "Welcome to our store" announcement bar is turned off.
- The footer now reads **"Notes from the studio — Occasional updates on new lessons, formula studies and live learning sessions"** instead of "exclusive deals", and the columns are headed **Community** and **Explore**.

Still worth doing in Shopify admin:
- Rename the store from "LeParfumSimplifié" to "Le Parfum Simplifié" (Settings → Store details), or upload a logo. The header shows the store name.
- Replace the included photographs with your own studio photography over time.

### Update: more photography (23 Oct 2026)
- 13 more Pexels photographs were added, **36 in total**. They include raw materials (cinnamon and star anise, spices, rose buds, lavender) and minimal amber-bottle still lifes in the brand palette.
- **New section, LPS · Photo gallery** (`sections/lps-gallery.liquid`): an editorial mosaic, or a row of photographs that swipes on phones. Each photo has its own image picker, "Included photograph" dropdown, alt text and caption.
  - Homepage: "The craft", a mosaic of 7 photographs.
  - Premium Learning page: "The materials you will study", 5 captioned photographs.
  - Product page: "Real materials, real technique", 4 photographs.
- The "Is this right for you?" section now uses photo cards.
- `docs/upload/le-parfum-simplifie-photos.zip` holds every photograph at 2400px with a source list, for Shopify Files, social posts or emails.
