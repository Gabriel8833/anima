// Renderiza a animação quadro a quadro no Chromium (Playwright) e gera o vídeo com ffmpeg.
// Uso:
//   node render.js --modules <dir com node_modules> --build <dir com timeline.json> --out video.mp4 [--fps 30] [--start 0] [--end 45] [--scale 1]
//   node render.js ... --preview 0.5,7,14 --outdir previews   (só quadros soltos em JPG)
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const MOD = path.resolve(arg('modules', path.join(__dirname, 'node_modules')));
const BUILD = path.resolve(arg('build', path.join(__dirname, 'build')));
const FPS = +arg('fps', 30), START = +arg('start', 0), END = +arg('end', 45), SCALE = +arg('scale', 1);
const PREVIEW = arg('preview', null), OUTDIR = arg('outdir', 'previews'), OUT = arg('out', 'video_sem_audio.mp4');
const types = { '.js': 'text/javascript', '.html': 'text/html', '.json': 'application/json' };
const srv = http.createServer((q, s) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  let f = u.startsWith('/node_modules/') ? path.join(MOD, u.slice(14)) : u.startsWith('/build/') ? path.join(BUILD, u.slice(7)) : path.join(__dirname, u === '/' ? 'index.html' : u);
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); s.end(d); });
}).listen(0);
(async () => {
  const port = srv.address().port;
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
  page.on('console', m => { if (!/GPU stall|GL Driver/.test(m.text())) console.log('[page]', m.text()); });
  page.on('pageerror', e => { console.error('[erro]', e.message); process.exit(1); });
  await page.goto(`http://localhost:${port}/index.html?scale=${SCALE}`);
  await page.waitForFunction('window.ready === true', null, { timeout: 600000 });
  if (PREVIEW) {
    fs.mkdirSync(OUTDIR, { recursive: true });
    for (const t of PREVIEW.split(',').map(Number)) {
      const url = await page.evaluate(([t, i]) => window.renderFrame(t, i, 0.85), [t, Math.round(t * FPS)]);
      fs.writeFileSync(path.join(OUTDIR, `f_${t.toFixed(2).padStart(5, '0')}.jpg`), Buffer.from(url.split(',')[1], 'base64'));
    }
  } else {
    const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-vf', `scale=1080:1920:flags=lanczos`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), OUT], { stdio: ['pipe', 'inherit', 'inherit'] });
    const n0 = Math.round(START * FPS), n1 = Math.round(END * FPS);
    const t0 = Date.now();
    for (let i = n0; i < n1; i++) {
      const url = await page.evaluate(([t, i]) => window.renderFrame(t, i, 0.95), [i / FPS, i]);
      const buf = Buffer.from(url.split(',')[1], 'base64');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if ((i - n0) % 30 === 0) console.log(`quadro ${i}/${n1}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await browser.close(); srv.close();
})();
