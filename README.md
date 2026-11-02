# Ahmed Fadul — Portfolio

A static portfolio site (HTML, CSS, JavaScript). No build step, no dependencies.

```
index.html        page content (home, projects, case study)
css/style.css     all styling
js/main.js        contour animation, typing effect, page switching
js/workspace.js   the My Workspace list (services, tools, methods): edit the text here
js/requests.js    the Requests form (set FORM_KEY here)
assets/           CV (PDF) and project map images
```

## Run locally
Open `index.html` in a browser, or run `npx serve` in this folder.

## Deploy on Vercel
1. Push this folder to a GitHub repository.
2. On vercel.com choose **Add New → Project** and import the repository.
3. Framework Preset: **Other**. Leave Build Command and Output Directory empty. Click **Deploy**.

## Deploy on GitHub Pages
1. Push this folder to a GitHub repository.
2. Repository **Settings → Pages**: Source = *Deploy from a branch*, Branch = `main`, folder = `/ (root)`.

## Edit
- Text and sections: `index.html`
- Colours: the variables at the top of `css/style.css`
- CV: replace `assets/Ahmed_Fadul_CV.pdf` (keep the same name)
- Maps: replace the images in `assets/img/`
- Pages use `#projects` and `#city-site-selection` in the address bar, so they work on any static host.

## My Workshop (workshop.html)
A separate bilingual (English / Arabic) page: service cards, how each service is done, workflow diagrams, calculators that run in the browser, and a request form that emails you.
```
workshop.html          page shell (linked from the portfolio nav)
css/workshop.css       styling
js/workshop-data.js    the services: titles, descriptions, steps, tools (English and Arabic)
js/workshop-calc.js    the calculators (levelling, curves, setting out, flight planning, AHP)
js/workshop-app.js     cards, detail pages, request form (set FORM_KEY here)
```
Put your free Web3Forms key in `FORM_KEY` in `js/workshop-app.js` to receive requests by email directly.

## Requests form: receive requests in your email
The Requests page works in two ways:
- **With a free access key (recommended):** create a key at web3forms.com using your email address, then paste it into `FORM_KEY` at the top of `js/requests.js`. Each request then arrives in your inbox without opening the visitor's email app.
- **Without a key:** the form opens the visitor's email app with the request already written.

## Edit My Workspace
Open `js/workspace.js`. Each service has `t` (title), `does` (what), `tools` (name and kind: `i` instrument, `s` software, `b` built by you) and `how` (the steps). Add or remove items freely; the Requests list updates automatically.
