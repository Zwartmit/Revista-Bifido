const fs = require('fs');
const path = require('path');
const DIR = __dirname;
const TOTAL = 7;

const GRAIN = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.9'/%3E%3C/svg%3E\")";

const CSS = `
@font-face{font-family:'Anton';src:url('assets/Anton-Regular.ttf')}
@font-face{font-family:'Jack';src:url('assets/JackInput.woff2')}
:root{--lime:#b8ff00;--orange:#fe5e00;--ink:#050505;--teal:#00a89e}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px;background:var(--ink);overflow:hidden}
body{position:relative;color:#fff;font-family:'Jack',monospace}
.abs{position:absolute}
.grain{position:absolute;inset:0;z-index:90;pointer-events:none;opacity:.20;mix-blend-mode:overlay;background-image:${GRAIN};background-size:300px}
.dots{position:absolute;inset:0;z-index:1;pointer-events:none;background-image:radial-gradient(circle,rgba(255,255,255,.09) 1.4px,transparent 1.7px);background-size:16px 16px}
.logo{position:absolute;left:56px;top:50px;width:176px;z-index:60}
.count{position:absolute;right:56px;top:62px;z-index:60;font-size:21px;letter-spacing:.22em;color:var(--lime)}
.foot-l{position:absolute;left:56px;bottom:50px;z-index:60;font-size:19px;letter-spacing:.2em;color:rgba(255,255,255,.78);text-transform:uppercase}
.foot-r{position:absolute;right:56px;bottom:50px;z-index:60;font-size:19px;letter-spacing:.2em;color:var(--lime);text-transform:uppercase}
.reg{position:absolute;z-index:60;width:22px;height:22px}
.reg:before,.reg:after{content:'';position:absolute;background:rgba(255,255,255,.55)}
.reg:before{left:10px;top:0;width:2px;height:22px}
.reg:after{top:10px;left:0;height:2px;width:22px}
.d{font-family:'Anton',sans-serif;text-transform:uppercase;line-height:.9;letter-spacing:.005em}
.lime{color:var(--lime)}
.mono{font-family:'Jack',monospace;text-transform:uppercase;letter-spacing:.2em}
.tape{position:absolute;background:var(--lime);color:#050505;z-index:30}
.shadowblock{position:absolute;background:var(--lime)}
.browser{position:absolute;background:#0a0a0a;border:3px solid #fff;overflow:hidden;z-index:20}
.browser .bar{height:34px;background:#0a0a0a;border-bottom:3px solid #fff;display:flex;align-items:center;gap:9px;padding-left:14px}
.browser .bar i{width:11px;height:11px;border-radius:50%;background:#fff;opacity:.85;display:block}
.browser .bar span{margin-left:14px;font-size:13px;letter-spacing:.16em;color:rgba(255,255,255,.7)}
.browser img{display:block;width:100%}
.phone{position:absolute;background:#000;border:9px solid #fff;border-radius:46px;overflow:hidden;z-index:25}
.phone img{display:block;width:100%}
`;

const reg = (x, y) => `<div class="reg" style="left:${x}px;top:${y}px"></div>`;
const HUD = (n, opts = {}) => `
<img class="logo" src="assets/logo.png">
${opts.hideFoot ? '' : `<div class="foot-l">revistabifido.com</div>`}
${n < TOTAL ? `<div class="foot-r">Desliza &rarr;</div>` : `<div class="foot-r">Link en la bio &#8599;</div>`}
${reg(30, 30)}${reg(1028, 30)}${reg(30, 1298)}${reg(1028, 1298)}
<div class="dots"></div><div class="grain"></div>`;

const page = (body) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${CSS}</style></head><body>${body}</body></html>`;

const slides = {};

// 01 — PORTADA ---------------------------------------------------------------
slides[1] = page(`
<div class="abs" style="left:0;top:430px;width:1080px;height:920px;background:url('assets/hero.webp') no-repeat;background-size:auto 920px;background-position:-440px 0;z-index:2"></div>
<div class="abs" style="left:0;top:0;width:1080px;height:760px;z-index:3;background:linear-gradient(to bottom,#050505 0%,#050505 36%,rgba(5,5,5,.86) 52%,rgba(5,5,5,0) 100%)"></div>
<div class="abs" style="left:0;bottom:0;width:1080px;height:260px;z-index:3;background:linear-gradient(to top,#050505 0%,rgba(5,5,5,.8) 40%,rgba(5,5,5,0) 100%)"></div>
<div class="abs d" style="left:54px;top:196px;z-index:40;font-size:190px;line-height:.86;white-space:nowrap">Estrenamos</div>
<div class="tape" style="left:-60px;top:378px;width:1220px;height:230px;transform:rotate(-3.2deg);transform-origin:center;z-index:41;display:flex;align-items:center;padding-left:112px">
  <div class="d" style="font-size:210px;color:#050505;white-space:nowrap;line-height:1">Página web</div>
</div>
${HUD(1)}`);

// 02 — UN LUGAR PARA SUMERGIRSE ---------------------------------------------------
slides[2] = page(`
<div class="abs d" style="left:52px;top:200px;z-index:40;font-size:104px;line-height:.92">Un lugar para</div>
<div class="abs d lime" style="left:50px;top:290px;z-index:40;font-size:200px;line-height:.9;white-space:nowrap">Sumergirse</div>
<div class="abs d" style="left:52px;top:474px;z-index:40;font-size:104px;line-height:.92;white-space:nowrap">en nuestro mundo</div>

<div class="shadowblock" style="left:80px;top:720px;width:780px;height:414px;transform:rotate(-3deg);z-index:10"></div>
<div class="browser" style="left:56px;top:690px;width:780px;transform:rotate(-3deg)">
  <div class="bar"><i></i><i></i><i></i><span>revistabifido.com</span></div>
  <img src="assets/home_desk.png" style="width:101%">
</div>
<div class="phone" style="left:712px;top:780px;width:260px;transform:rotate(4.5deg);box-shadow:-16px 16px 0 var(--lime)">
  <img src="assets/home_mobile.png">
</div>
${HUD(2)}`);

// 03 — LA MANADA ---------------------------------------------------------------
const chars = [
  ['malandra', 'Malandra', 'Cultura', '#9333ea', 0],
  ['incendia', 'Incendia', 'Género', '#f97316', 1],
  ['mordaz', 'Mordáz', 'Opinión', '#ef4444', 2],
  ['punkibri', 'Punkibrí', 'Ambiente', '#22c55e', 3],
  ['anika', 'Ánika', 'Reducción de riesgos|y daños por consumo|de sustancias', '#00a89e', 4],
];
const CX = [150, 345, 540, 735, 930];
const heights = [470, 490, 530, 490, 470];
slides[3] = page(`
<div class="abs d" style="left:52px;top:204px;z-index:40;font-size:176px;line-height:.9;white-space:nowrap">Cinco voces.</div>
<div class="abs d lime" style="left:52px;top:372px;z-index:40;font-size:176px;line-height:.9;white-space:nowrap">Una manada.</div>
${chars.map(([id, name, topic, col, i]) => {
  const h = heights[i], w = Math.round(h * .8);
  const cx = CX[i];
  return `<img class="abs" src="assets/${id}.webp" style="left:${Math.round(cx - w / 2)}px;top:${1136 - h}px;height:${h}px;z-index:${i === 2 ? 30 : 20 + (i % 2)};filter:drop-shadow(0 18px 24px rgba(0,0,0,.6))">`;
}).join('')}
${chars.map(([id, name, topic, col, i]) => {
  const cx = CX[i];
  return `<div class="abs" style="left:${Math.round(cx - 93)}px;top:1152px;width:186px;z-index:45;text-align:center">
    <div style="height:6px;background:${col};margin-bottom:11px"></div>
    <div class="d" style="font-size:30px;line-height:1">${name}</div>
    <div class="mono" style="font-size:${topic.includes('|') ? 12 : 13}px;letter-spacing:${topic.includes('|') ? .07 : .16}em;line-height:1.4;color:rgba(255,255,255,.7);margin-top:5px">${topic.split('|').join('<br>')}</div></div>`;
}).join('')}
${HUD(3, { hideFoot: true })}`);

// 04 — CADA PERSONAJE, SU UNIVERSO ----------------------------------------------
const pal = [['Malandra', '#9333ea'], ['Incendia', '#f97316'], ['Mordáz', '#ef4444'], ['Punkibrí', '#22c55e'], ['Ánika', '#00a89e']];
slides[4] = page(`
<div class="abs d" style="left:52px;top:204px;z-index:40;font-size:122px;line-height:.92;white-space:nowrap">Cada personaje,</div>
<div class="abs d lime" style="left:50px;top:334px;z-index:40;font-size:122px;line-height:.92;white-space:nowrap">su propio universo</div>

<div class="shadowblock" style="left:88px;top:612px;width:880px;height:454px;background:#00a89e;transform:rotate(2.2deg);z-index:10"></div>
<div class="browser" style="left:56px;top:580px;width:880px;transform:rotate(2.2deg)">
  <div class="bar"><i></i><i></i><i></i><span>revistabifido.com/anika</span></div>
  <img src="assets/anika_desk.png" style="width:101%">
</div>
<div class="phone" style="left:728px;top:810px;width:250px;transform:rotate(-4deg);box-shadow:-14px 14px 0 var(--lime)">
  <img src="assets/anika_mobile.png">
</div>
${HUD(4, { hideFoot: true })}`);

// 05 — EN 3D ---------------------------------------------------------------------
slides[5] = page(`
<div class="abs d" style="left:52px;top:204px;z-index:40;font-size:196px;line-height:.86;white-space:nowrap">Conócelos</div>
<div class="abs d lime" style="left:52px;top:376px;z-index:40;font-size:196px;line-height:.86;white-space:nowrap">en 360°</div>
<div class="abs mono" style="left:56px;top:580px;z-index:45;font-size:18px;letter-spacing:.24em;color:rgba(255,255,255,.88)">Gira &nbsp;·&nbsp; Haz zoom &nbsp;·&nbsp; Interactúa</div>
<div class="abs" style="left:236px;top:676px;width:620px;height:620px;border-radius:50%;background:var(--lime);z-index:8"></div>
<div class="abs" style="left:220px;top:660px;width:620px;height:620px;border-radius:50%;overflow:hidden;z-index:10;border:5px solid #fff;background:#12081f">
  <img src="assets/malandra3d.png" style="position:absolute;left:50%;top:50%;width:640px;height:auto;transform:translate(-50%,-50%)">
</div>
${HUD(5, { hideFoot: true })}`);

// 06 — ARCHIVO VIVO --------------------------------------------------------------
slides[6] = page(`
<div class="abs" style="left:0;top:0;width:1080px;height:1350px;background:url('assets/scale.webp') center/cover;opacity:.14;z-index:1;mix-blend-mode:screen"></div>
<div class="abs d" style="left:52px;top:206px;z-index:40;font-size:92px;line-height:.9;color:transparent;-webkit-text-stroke:2.5px rgba(255,255,255,.7);white-space:nowrap">No somos un equipo</div>
<div class="abs" style="left:44px;top:238px;width:752px;height:11px;background:var(--orange);z-index:42;transform:rotate(-1deg)"></div>
<div class="abs d" style="left:52px;top:308px;z-index:40;font-size:104px;line-height:.9;white-space:nowrap">Somos un</div>
<div class="abs d lime" style="left:50px;top:400px;z-index:40;font-size:178px;line-height:.9;white-space:nowrap">Archivo vivo</div>
<div class="abs" style="left:63px;top:640px;width:954px;z-index:30;display:grid;grid-template-columns:repeat(4,216px);gap:30px 30px;justify-content:space-between">
${['alexandra', 'ana', 'camila', 'natalia', 'brian', 'carlos', 'paula', 'brandon'].map((n, i) => `<div style="width:216px;height:216px;border-radius:50%;overflow:hidden;background:#fff;padding:8px;box-sizing:border-box;border:5px solid ${i % 2 ? '#fff' : 'var(--lime)'};transform:rotate(${i % 2 ? 2.5 : -2.5}deg);box-shadow:${i % 2 ? '10px 10px 0 var(--orange)' : '10px 10px 0 rgba(184,255,0,.35)'}"><img src="assets/ar_${n}.png" style="width:100%;height:100%;object-fit:contain;display:block"></div>`).join('')}
</div>
<div class="abs mono" style="left:0;width:1080px;text-align:center;top:1192px;z-index:45;font-size:21px;color:rgba(255,255,255,.88);line-height:1.5">Narramos, señalamos, registramos&hellip;</div>
${HUD(6, { hideFoot: true })}`);

// 07 — CTA -----------------------------------------------------------------------
slides[7] = page(`
<div class="abs" style="left:0;top:770px;width:1080px;height:580px;background:url('assets/hero.webp') no-repeat;background-size:auto 580px;background-position:-155px 0;z-index:2"></div>
<div class="abs" style="left:0;top:770px;width:1080px;height:220px;z-index:3;background:linear-gradient(to bottom,#050505 0%,rgba(5,5,5,.9) 40%,rgba(5,5,5,0) 100%)"></div>
<div class="abs" style="left:0;bottom:0;width:1080px;height:150px;z-index:3;background:linear-gradient(to top,#050505 0%,rgba(5,5,5,.7) 55%,rgba(5,5,5,0) 100%)"></div>
<div class="abs d" style="left:52px;top:204px;z-index:40;font-size:182px;line-height:.86;white-space:nowrap">Resistamos</div>
<div class="abs d lime" style="left:50px;top:372px;z-index:40;font-size:182px;line-height:.86;white-space:nowrap">juntxs</div>
<div class="abs d" style="left:52px;top:548px;z-index:40;font-size:90px;line-height:.92;white-space:nowrap">desde estos lugares</div>
<div class="abs d lime" style="left:52px;top:632px;z-index:40;font-size:90px;line-height:.92;white-space:nowrap">cibernéticos</div>
<div class="tape" style="left:-50px;top:772px;width:1180px;height:164px;transform:rotate(-3deg);z-index:46;display:flex;align-items:center;padding-left:106px">
  <div class="d" style="font-size:112px;color:#050505;white-space:nowrap;line-height:1">revistabifido.com</div>
</div>
${HUD(7, { hideFoot: true })}`);

const out = DIR;
fs.mkdirSync(out, { recursive: true });
for (const [n, html] of Object.entries(slides)) fs.writeFileSync(path.join(out, `slide_${String(n).padStart(2, '0')}.html`), html);
console.log('html listo:', Object.keys(slides).length);
