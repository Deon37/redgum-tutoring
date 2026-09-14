# Redgum Tutoring

Static web app for Redgum Tutoring, an after-school tutoring centre in Ipswich, QLD. Three pages: a homepage, a student enrolment form, and a weekly schedule view.

Built with plain HTML, CSS, and JavaScript. No build step required.

## Running locally

Open `index.html` in a browser. The schedule page loads `data/sessions.json` via fetch, so if you open it directly from the file system you may see a CORS error depending on your browser. Running it through a local server avoids this:

```
npx serve .
```

Then open `http://localhost:3000`.

## Deployment

Hosted on Netlify. Config is in `netlify.toml`. The Formspree endpoint for the enrolment form is set as an environment variable — see `.env.example` for the variable name.

## GitHub

github.com/Deon37/redgum-tutoring
