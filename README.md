# BUILDUP Gym

A responsive static website for BUILDUP, built with HTML, CSS, and JavaScript.

## Run locally

Serve the `docs/` folder with any static file server. For example:

```powershell
python -m http.server 8000 --directory docs
```

Then open `http://localhost:8000`.

## GitHub Pages

The site is in `docs/`. In the repository's **Settings → Pages**, choose **Deploy from a branch**, select the `main` branch and `/docs` folder, and save.

The downloaded Iconify data bundle is excluded from Git because it is not currently used by the site and exceeds GitHub's file-size limit. The local files remain in the working directory.
