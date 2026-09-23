# personal-website

Open `index.html`, or from this folder:

```bash
python3 -m http.server 5173
```

The thesis is the opening of `index.html`. The reel under it is Managent, research, experience, social impact, passions, and beliefs. Games live at `games.html`.

To add a photograph, put the file in this folder (or in `photos/`) and drop an image into a frame:

```html
<div class="frame has-image" style="--wash: #d8cdc0">
  <img src="photos/management.jpg" alt="A photograph from the early days of the company." />
</div>
```

`has-image` turns off the placeholder sheen.
