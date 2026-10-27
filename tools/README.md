# Asset tools (MyUI 2)

Scripts that build the two images MyUI 2 downloads from `assets/`. You only need them if you want to change the icons or the character.

## `icons/`: the icon sheet

[`icons/icons.txt`](icons/icons.txt) lists every packed icon: Lucide names, or `set:name` for any [Iconify](https://icon-sets.iconify.design/) set. Edit it, then run:

```bash
npm i playwright @iconify-json/lucide @iconify-json/tabler   # plus @iconify-json/<set> for other sets
node tools/icons/build.js
```

This writes `assets/icons.png` and `assets/icons.json`. The library picks up the new manifest on the next run.

## `mascot/`: Koharu's sprite sheet

[`mascot/frames.json`](mascot/frames.json) lists the 25 poses as Live2D parameter values: gaze directions, blinks and expressions, all with her arms up so her fists rest on the panel edge.

- `render.js` loads the Koharu sample model (Cubism 2, from the `live2d-widget-model-koharu` npm package) and renders each pose in headless Chromium.
- `post.py` strengthens the blush and packs `assets/koharu.png`.

```bash
cd tools/mascot
npm i playwright pixi.js@6.5.10 pixi-live2d-display@0.4.0 live2dcubismcore@1.0.2 live2d-widget-model-koharu
node render.js
pip install pillow numpy imagequant
python post.py
```

If you change the frame order or count, update `MascotFrames` in `MyUI2.lua` to match. Bump `MASCOT_SHEET_VERSION` so cached copies refresh.

Koharu is © Live2D Inc., a Live2D sample model covered by the [Live2D Free Material License](https://www.live2d.com/eula/live2d-free-material-license-agreement_en.html).
