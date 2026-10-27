// Renders the mascot frames listed in frames.json from Live2D's Koharu sample
// model (Cubism 2).
//
//   npm i playwright pixi.js@6.5.10 pixi-live2d-display@0.4.0 live2dcubismcore@1.0.2 live2d-widget-model-koharu
//   node render.js           -> out/<index>_<Name>.png (+ out/base/ for the blush pass)
//   python post.py           -> ../../assets/koharu.png
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');

const DIR = __dirname;
const job = JSON.parse(fs.readFileSync(path.join(DIR, 'frames.json'), 'utf8'));
const modelUrl = `/node_modules/${job.model.package}/${job.model.entry}`;

(async () => {
  if (!fs.existsSync(path.join(DIR, 'node_modules', job.model.package))) {
    throw new Error(`run: npm i ${job.model.package}`);
  }
  const server = http.createServer((req, res) => {
    const file = path.join(DIR, decodeURIComponent(req.url.split('?')[0]));
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); res.end(); return; }
      res.writeHead(200); res.end(data);
    });
  });
  await new Promise((resolve) => server.listen(8765, resolve));
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.error('pageerror:', e.message));
  await page.goto('http://127.0.0.1:8765/render.html');
  await page.evaluate(([url, size]) => window.setup(url, size), [modelUrl, job.canvas]);

  const out = path.join(DIR, 'out');
  fs.mkdirSync(path.join(out, 'base'), { recursive: true });
  const save = (file, url) => fs.writeFileSync(file, Buffer.from(url.split(',')[1], 'base64'));
  const render = (params) => page.evaluate(([p, place, ticks]) => window.frame(p, place, ticks), [params, job.place, job.settleTicks]);
  for (const [index, frame] of job.frames.entries()) {
    const name = `${String(index).padStart(2, '0')}_${frame.name}`;
    save(path.join(out, name + '.png'), await render(frame.params));
    if (job.blush.frames[frame.name]) {
      // Same pose with no extra blush, so post.py can isolate and strengthen the cheeks.
      save(path.join(out, 'base', name + '.png'), await render(Object.assign({}, frame.params, { PARAM_CHEEK: 0 })));
    }
    console.log('rendered', name);
  }
  await browser.close();
  server.close();
})().catch((err) => { console.error(err); process.exit(1); });
