// Renderiza um episódio quadro a quadro no Chromium (Playwright) e gera o MP4 com ffmpeg.
//   node render.js [--ep ep01] [--out build/ep01_sem_legenda.mp4] [--fps 30] [--start 0] [--end <duração>] [--scale 1]
//   node render.js --preview 3,15,24 --outdir previas --scale 0.5      (só quadros soltos em JPG)
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const MOD = path.resolve(arg('modules', path.join(__dirname, 'node_modules')));
const EP = arg('ep', 'ep01'), FPS = +arg('fps', 30), SCALE = +arg('scale', 1);
const PREVIEW = arg('preview', null), OUTDIR = arg('outdir', 'previas'), OUT = arg('out', `build/${EP}_sem_legenda.mp4`);
const types = { '.js': 'text/javascript', '.html': 'text/html', '.json': 'application/json' };
const srv = http.createServer((q, s) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  const f = u.startsWith('/node_modules/') ? path.join(MOD, u.slice(14)) : path.join(__dirname, u === '/' ? 'index.html' : u);
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); s.end(d); });
}).listen(0);
(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
  page.on('console', m => { if (!/GPU stall|GL Driver/.test(m.text())) console.log('[página]', m.text()); });
  page.on('pageerror', e => { console.error('[erro]', e.message, e.stack); process.exit(1); });
  await page.goto(`http://localhost:${srv.address().port}/index.html?ep=${EP}&scale=${SCALE}`);
  await page.waitForFunction('window.ready === true', null, { timeout: 900000 });
  const dur = await page.evaluate('window.duracao');
  const START = +arg('start', 0), END = +arg('end', dur);
  if (PREVIEW) {
    fs.mkdirSync(OUTDIR, { recursive: true });
    for (const t of PREVIEW.split(',').map(Number)) {
      const url = await page.evaluate(([t, i]) => window.renderFrame(t, i, 0.85), [t, Math.round(t * FPS)]);
      fs.writeFileSync(path.join(OUTDIR, `q_${t.toFixed(2).padStart(5, '0')}.jpg`), Buffer.from(url.split(',')[1], 'base64'));
    }
  } else {
    fs.mkdirSync(path.dirname(path.resolve(OUT)), { recursive: true });
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-vf', 'scale=1080:1920:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-movflags', '+faststart', OUT], { stdio: ['pipe', 'inherit', 'inherit'] });
    const n0 = Math.round(START * FPS), n1 = Math.round(END * FPS), t0 = Date.now();
    for (let i = n0; i < n1; i++) {
      const url = await page.evaluate(([t, i]) => window.renderFrame(t, i, 0.95), [i / FPS, i]);
      const buf = Buffer.from(url.split(',')[1], 'base64');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if ((i - n0) % 60 === 0) console.log(`quadro ${i}/${n1}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
    console.log('pronto:', OUT);
  }
  await browser.close(); srv.close();
})();
