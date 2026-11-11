// Genera los carruseles extra. Uso: node gen2.js  ->  s_<set>_NN.html en esta carpeta
const fs = require('fs');
const path = require('path');
const DIR = __dirname;

// --- CSS / utilidades compartidas (copiadas de build.js) ---------------------
const src = fs.readFileSync(path.join(DIR, 'build.js'), 'utf8');
const head = src.split('const reg =')[0].replace("const fs = require('fs');", '').replace("const path = require('path');", '').replace('const DIR = __dirname;', '');
const { CSS } = new Function(head + '; return { CSS };')();

const reg = (x, y) => `<div class="reg" style="left:${x}px;top:${y}px"></div>`;
const HUD = ({ footL = '', last = false, noR = false } = {}) => `
<img class="logo" src="assets/logo.png">
${footL ? `<div class="foot-l">${footL}</div>` : ''}
${noR ? '' : last ? `<div class="foot-r">Link en la bio &#8599;</div>` : `<div class="foot-r">Desliza &rarr;</div>`}
${reg(30, 30)}${reg(1028, 30)}${reg(30, 1298)}${reg(1028, 1298)}
<div class="dots"></div><div class="grain"></div>`;
const page = (body) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${CSS}
.p{font-family:'Jack',monospace;text-transform:none;letter-spacing:.02em}
</style></head><body>${body}</body></html>`;

// texto Anton
const D = (t, x, y, size, o = {}) => `<div class="abs d ${o.cls || ''}" style="left:${x}px;top:${y}px;z-index:${o.z || 40};font-size:${size}px;line-height:${o.lh || .9};white-space:nowrap;${o.style || ''}">${t}</div>`;
const M = (t, x, y, size, o = {}) => `<div class="abs mono" style="left:${x}px;top:${y}px;z-index:${o.z || 45};font-size:${size}px;color:${o.color || 'rgba(255,255,255,.88)'};${o.style || ''}">${t}</div>`;

// --- datos reales (API de Payload / sitio) -----------------------------------
const CH = [
  { id: 'malandra', name: 'Malandra', topic: 'Cultura', col: '#9333ea', desc: 'Observadora, cómplice e irónica. Habla desde la experiencia y el recorrido callejero.', causa: 'Culto a la creatividad', age: '33 años', color: 'Morado / Oro viejo y Coral' },
  { id: 'incendia', name: 'Incendia', topic: 'Género', col: '#f97316', desc: 'Directa, combativa y afectiva. Convoca, denuncia y moviliza por la justicia social.', causa: 'El patriarcado lo tenemos que tumbar', age: '27 años', color: 'Morado y naranja' },
  { id: 'mordaz', name: 'Mordáz', topic: 'Opinión', col: '#ef4444', desc: 'Sarcástico, lúcido y provocador. Maestro de la ironía y el humor negro.', causa: 'Escepticismo militante', age: '42 años', color: 'Rojo, Oro y Durazno' },
  { id: 'punkibri', name: 'Punkibrí', topic: 'Ambiente', col: '#22c55e', desc: 'Rebelde, sensible y poético. Defiende el territorio y la soberanía alimentaria.', causa: 'Relación espiritual y política con la tierra', age: '127 años (en años de colibrí)', color: 'Verde Páramo / Amarillo y Púrpura' },
  { id: 'anika', name: 'Ánika', topic: 'Reducción de daños', sub: 'riesgos por consumo de sustancias', col: '#00a89e', desc: 'Clara, tranquila y firme. Genera confianza y calma en temas de salud comunitaria.', causa: 'Los prejuicios no van conmigo', age: '30 años', color: 'Cian / Menta y Lavanda' },
];
const TEAM = [
  ['alexandra', 'Alexandra Amado', 'Administradora y gestora de proyectos con enfoque interseccional', 'El futuro es hoy.'],
  ['ana', 'Ana Meléndez R.', 'Comunicadora social y gestora cultural', 'El collage es darle una segunda oportunidad a todo aquello que está condenado a destruirse para reconstruirse a unx mismx.'],
  ['camila', 'Cami Castañeda', 'Comunicadora visual', 'Poco ruido externo, mucho interno, demasiada curiosidad.'],
  ['natalia', 'Churca Despeinada', 'Comunicadora social | Periodista | Especialista en fotografía', 'Sensible e intensa. No sé quedarme quieta.'],
  ['brian', 'Crowan', 'DJ | Music producer', 'Precisión técnica y rugido visceral. No conozco el silencio; crear es mi acto de resistencia contra el asfalto.'],
  ['carlos', 'Juan Carlos Arias', 'Biólogo ambiental', 'Apasionado por la ornitología, entomología y el fascinante mundo de los hongos.'],
  ['paula', 'Pawleska', 'Diseñadora gráfica', 'Crear para sentir, observar para transformar.'],
  ['brandon', 'Zwartmit', 'Creative Developer | Web, AI & Digital Experiences', 'Exploro y entiendo antes de intervenir. Por eso lo que construyo se adapta, se mueve y se mantiene.'],
];

// --- PLANTILLA DE ARTÍCULO: edita estos textos y vuelve a generar -------------
const ART = {
  char: 'malandra',
  category: 'Categoría',
  title: 'Título del artículo',
  author: 'Nombre del autor/a',
  question: '¿Aquí va la pregunta que abre el artículo?',
  big: '00',
  fact: 'Aquí va el dato clave que respalda la historia.',
  quote: 'Aquí va la frase destacada del artículo.',
};

const out = {};
const add = (set, n, html) => { out[`s_${set}_${String(n).padStart(2, '0')}`] = html; };

const browser = (img, x, y, w, rot, url, extra = '') => `<div class="browser" style="left:${x}px;top:${y}px;width:${w}px;transform:rotate(${rot}deg);${extra}"><div class="bar"><i></i><i></i><i></i><span>${url}</span></div><img src="assets/${img}" style="width:101%"></div>`;
const shadow = (x, y, w, h, rot, col = 'var(--lime)') => `<div class="shadowblock" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;transform:rotate(${rot}deg);z-index:10;background:${col}"></div>`;
const phone = (img, x, y, w, rot, shadowCol = 'var(--lime)') => `<div class="phone" style="left:${x}px;top:${y}px;width:${w}px;transform:rotate(${rot}deg);box-shadow:-14px 14px 0 ${shadowCol}"><img src="assets/${img}"></div>`;
const tape = (txt, y, size, rot = -3, col = 'var(--lime)') => `<div class="tape" style="left:-50px;top:${y}px;width:1180px;height:${Math.round(size * 1.5)}px;transform:rotate(${rot}deg);z-index:46;display:flex;align-items:center;padding-left:106px;background:${col}"><div class="d" style="font-size:${size}px;color:#050505;white-space:nowrap;line-height:1">${txt}</div></div>`;

// ============================================================================
// A) EXTRAS DEL CARRUSEL DE LANZAMIENTO (van entre la card 6 y la 7)
// ============================================================================
add('lx', 1, page(`
${D('Espacios de', 52, 164, 104)}
${D('Encuentro,', 50, 252, 200, { cls: 'lime' })}
${D('diálogo y resistencia', 52, 436, 100)}
${shadow(84, 686, 800, 540, -3)}
${browser('eventos_desk.png', 56, 650, 800, -3, 'revistabifido.com/eventos')}
${phone('eventos_mobile.png', 716, 760, 250, 4.5)}
${tape('FreeSoul Fest &middot; 20 ABR', 1150, 74, -3)}
${HUD()}`));

add('lx', 2, page(`
${D('Lleva la', 52, 164, 104)}
${D('Resistencia', 50, 252, 190, { cls: 'lime' })}
${D('contigo', 52, 424, 104)}
${shadow(84, 686, 800, 440, 3, 'var(--orange)')}
${browser('mercado_desk.png', 56, 650, 800, 3, 'revistabifido.com/mercado')}
${phone('mercado_mobile.png', 716, 770, 250, -4, 'var(--lime)')}
${tape('Merch oficial &middot; Pronto', 1150, 74, -3)}
${HUD()}`));

add('lx', 3, page(`
<div class="abs" style="left:0;top:700px;width:1080px;height:650px;background:url('assets/hero.webp') no-repeat;background-size:auto 650px;background-position:-190px 0;z-index:2"></div>
<div class="abs" style="left:0;top:700px;width:1080px;height:260px;z-index:3;background:linear-gradient(to bottom,#050505 0%,rgba(5,5,5,.9) 40%,rgba(5,5,5,0) 100%)"></div>
<div class="abs" style="left:0;bottom:0;width:1080px;height:150px;z-index:3;background:linear-gradient(to top,#050505 0%,rgba(5,5,5,.7) 55%,rgba(5,5,5,0) 100%)"></div>
${D('Periodismo', 50, 168, 214)}
${D('Crudo', 50, 356, 214, { cls: 'lime' })}
${D('para sensibilidades', 52, 556, 98)}
${D('frágiles', 52, 650, 98, { cls: 'lime' })}
${HUD({ noR: false })}`));

// ============================================================================
// B) UNO POR UNO (los 5 personajes)
// ============================================================================
{
  const CX = [150, 345, 540, 735, 930], hs = [420, 440, 470, 440, 420];
  add('pj', 1, page(`
${D('Uno por', 52, 164, 230)}
${D('Uno', 46, 350, 400, { cls: 'lime' })}
${M('5 voces &middot; 5 causas', 56, 730, 22, { color: 'var(--lime)' })}
${CH.map((c, i) => `<img class="abs" src="assets/${c.id}.webp" style="left:${Math.round(CX[i] - hs[i] * .4)}px;top:${1240 - hs[i]}px;height:${hs[i]}px;z-index:${i === 2 ? 30 : 20 + (i % 2)};filter:drop-shadow(0 18px 24px rgba(0,0,0,.6))">`).join('')}
${HUD()}`));

  CH.forEach((c, i) => {
    const nameSize = Math.min(250, Math.floor(920 / (c.name.length * .5)));
    add('pj', i + 2, page(`
<div class="abs" style="left:430px;top:540px;width:880px;height:880px;border-radius:50%;background:${c.col};z-index:5"></div>
<div class="abs" style="left:0;top:0;width:1080px;height:1350px;z-index:6;background:linear-gradient(to bottom,#050505 0%,rgba(5,5,5,0) 30%)"></div>
<img class="abs" src="assets/${c.id}.webp" style="right:-90px;bottom:110px;height:860px;z-index:20;filter:drop-shadow(0 20px 28px rgba(0,0,0,.55))">
${D(c.name, 50, 178, nameSize)}
<div class="tape" style="left:-30px;top:${178 + nameSize * .95 + 20}px;width:${c.topic.length > 20 ? 600 : 560}px;height:${c.topic.length > 20 ? 130 : 96}px;transform:rotate(-3deg);z-index:46;display:flex;align-items:center;padding-left:86px;background:${c.col}"><div class="d" style="font-size:${c.topic.length > 20 ? 44 : 58}px;color:#fff;line-height:1.05;white-space:normal;width:480px">${c.topic}</div></div>
<div class="abs p" style="left:56px;top:${178 + nameSize * .95 + (c.sub ? 190 : 170)}px;width:380px;z-index:45;font-size:25px;line-height:1.42;color:rgba(255,255,255,.92)">${c.sub ? `<span style="color:#5eead4">${c.sub[0].toUpperCase() + c.sub.slice(1)}.</span> ` : ''}${c.desc}</div>
<div class="abs" style="left:56px;top:900px;width:360px;z-index:45">
  ${[['Religión', c.causa], ['Edad', c.age], ['Color favorito', c.color]].map(([k, v]) => `<div style="border-top:3px solid ${c.col};padding:10px 0 12px"><div class="mono" style="font-size:12px;color:rgba(255,255,255,.6)">${k}</div><div class="p" style="font-size:20px;line-height:1.3;margin-top:5px;color:#fff">${v}</div></div>`).join('')}
</div>
${HUD({ footL: `revistabifido.com/${c.id}`, noR: false })}`));
  });

  add('pj', 7, page(`
${D('Elige con', 52, 164, 150)}
${D('quién', 50, 314, 150, { cls: 'lime' })}
${D('empezar', 52, 464, 150)}
${CH.map((c, i) => `<div class="abs" style="left:56px;top:${650 + i * 118}px;width:968px;height:100px;z-index:45;display:flex;align-items:center;border-left:14px solid ${c.col};padding-left:26px;background:rgba(255,255,255,.04)">
  <div class="d" style="font-size:62px;width:330px">${c.name}</div>
  <div class="mono" style="font-size:17px;color:rgba(255,255,255,.85);letter-spacing:.14em">revistabifido.com/${c.id}</div></div>`).join('')}
${HUD({ last: true })}`));
}

// ============================================================================
// C) ARCHIVO VIVO (las personas detrás de la revista)
// ============================================================================
{
  const circ = (n, size, i, rot) => `<div style="width:${size}px;height:${size}px;border-radius:50%;overflow:hidden;background:#fff;padding:${Math.round(size * .04)}px;border:5px solid ${i % 2 ? '#fff' : 'var(--lime)'};transform:rotate(${rot}deg);box-shadow:${Math.round(size / 22)}px ${Math.round(size / 22)}px 0 ${i % 2 ? 'var(--orange)' : 'rgba(184,255,0,.35)'}"><img src="assets/ar_${n}.png" style="width:100%;height:100%;object-fit:contain;display:block"></div>`;
  const bgScale = `<div class="abs" style="left:0;top:0;width:1080px;height:1350px;background:url('assets/scale.webp') center/cover;opacity:.14;z-index:1;mix-blend-mode:screen"></div>`;
  add('av', 1, page(`${bgScale}
${D('Las personas', 52, 164, 118)}
${D('detrás de', 52, 268, 118)}
${D('la revista', 50, 372, 118, { cls: 'lime' })}
<div class="abs" style="left:63px;top:640px;width:954px;z-index:30;display:grid;grid-template-columns:repeat(4,216px);gap:30px;justify-content:space-between">
${TEAM.map((t, i) => circ(t[0], 216, i, i % 2 ? 2.5 : -2.5)).join('')}
</div>
${M('Archivo vivo', 0, 1196, 24, { style: 'left:0;width:1080px;text-align:center', color: 'var(--lime)' })}
${HUD()}`));

  TEAM.forEach(([id, name, role, lema], i) => {
    const ns = Math.min(138, Math.floor(940 / (name.length * .47)));
    const acc = i % 2 ? 'var(--orange)' : 'var(--lime)';
    add('av', i + 2, page(`${bgScale}
<div class="abs" style="left:280px;top:176px;z-index:30">${circ(id, 520, i, i % 2 ? 2.5 : -2.5)}</div>
<div class="abs d" style="left:0;width:1080px;top:760px;z-index:40;text-align:center;font-size:${ns}px;line-height:1;white-space:nowrap">${name}</div>
<div class="abs mono" style="left:90px;width:900px;top:${760 + ns + 16}px;z-index:45;text-align:center;font-size:20px;line-height:1.5;color:${acc}">${role}</div>
<div class="abs" style="left:440px;top:${760 + ns + 130}px;width:200px;height:8px;background:${acc};z-index:45"></div>
<div class="abs p" style="left:110px;width:860px;top:${760 + ns + 170}px;z-index:45;text-align:center;font-size:${lema.length > 80 ? 27 : 32}px;line-height:1.4;color:#fff">&ldquo;${lema}&rdquo;</div>
${HUD({ footL: 'revistabifido.com/elparche' })}`));
  });

  add('av', 10, page(`${bgScale}
${D('Conócelos', 52, 164, 190)}
${D('a todos', 50, 336, 190, { cls: 'lime' })}
<div class="abs" style="left:63px;top:600px;width:954px;z-index:30;display:grid;grid-template-columns:repeat(4,216px);gap:30px;justify-content:space-between">
${TEAM.map((t, i) => circ(t[0], 216, i, i % 2 ? 2.5 : -2.5)).join('')}
</div>
${tape('revistabifido.com/elparche', 1120, 74, -3)}
${HUD({ last: true })}`));
}

// ============================================================================
// D) CÓMO SE LEE BÍFIDO (guía de 3 pasos)
// ============================================================================
add('gu', 1, page(`
${D('Cómo se', 52, 164, 190)}
${D('Lee', 46, 330, 360, { cls: 'lime' })}
${D('Bífido', 46, 690, 250)}
${M('Guía rápida en 3 pasos', 56, 945, 24, { color: 'var(--lime)' })}
<div class="abs" style="left:0;top:1000px;width:1080px;height:350px;background:url('assets/hero.webp') no-repeat;background-size:auto 560px;background-position:-340px -130px;z-index:2"></div>
<div class="abs" style="left:0;top:1000px;width:1080px;height:140px;z-index:3;background:linear-gradient(to bottom,#050505 0%,rgba(5,5,5,0) 100%)"></div>
<div class="abs" style="left:0;bottom:0;width:1080px;height:150px;z-index:3;background:linear-gradient(to top,#050505 0%,rgba(5,5,5,0) 100%)"></div>
${HUD()}`));

add('gu', 2, page(`
<div class="tape" style="left:-30px;top:160px;width:480px;height:100px;transform:rotate(-3deg);z-index:46;display:flex;align-items:center;padding-left:86px"><div class="d" style="font-size:62px;color:#050505">Paso 1</div></div>
${D('Elige un', 52, 300, 190)}
${D('personaje', 50, 472, 190, { cls: 'lime' })}
${CH.map((c, i) => `<div class="abs" style="left:${56 + i * 196}px;top:${i === 2 ? 700 : 730}px;width:176px;height:${i === 2 ? 470 : 440}px;background:${c.col};z-index:20;overflow:hidden;${i === 2 ? 'outline:5px solid #fff;outline-offset:6px;' : ''}">
  <img src="assets/${c.id}.webp" style="position:absolute;left:50%;top:16px;height:${i === 2 ? 410 : 380}px;transform:translateX(-50%);filter:drop-shadow(0 8px 10px rgba(0,0,0,.4))">
  <div class="d" style="position:absolute;left:0;right:0;bottom:0;padding:9px 0 10px;background:#050505;text-align:center;font-size:30px;line-height:1">${c.name}</div></div>`).join('')}
${M('Cada uno habla de una causa distinta', 0, 1226, 17, { style: 'left:0;width:1080px;text-align:center' })}
${HUD()}`));

add('gu', 3, page(`
<div class="tape" style="left:-30px;top:160px;width:480px;height:100px;transform:rotate(-3deg);z-index:46;display:flex;align-items:center;padding-left:86px"><div class="d" style="font-size:62px;color:#050505">Paso 2</div></div>
${D('Lee lo que', 52, 300, 150)}
${D('publica', 50, 436, 190, { cls: 'lime' })}
${shadow(92, 700, 840, 450, 2.2, '#00a89e')}
${browser('anika_desk.png', 60, 668, 840, 2.2, 'revistabifido.com/anika')}
${phone('anika_mobile.png', 728, 830, 250, -4)}
${HUD()}`));

add('gu', 4, page(`
<div class="tape" style="left:-30px;top:160px;width:480px;height:100px;transform:rotate(-3deg);z-index:46;display:flex;align-items:center;padding-left:86px"><div class="d" style="font-size:62px;color:#050505">Paso 3</div></div>
${D('Conoce', 52, 300, 190)}
${D('el parche', 50, 472, 190, { cls: 'lime' })}
${shadow(88, 730, 780, 520, -2, 'var(--orange)')}
${browser('parche3d.png', 60, 700, 780, -2, 'revistabifido.com/elparche')}
${M('Gira a los personajes en 3D', 56, 1262, 17, { color: 'rgba(255,255,255,.88)', style: 'letter-spacing:.2em' })}
${HUD({ noR: false })}`));

add('gu', 5, page(`
${D('Empieza', 52, 164, 210)}
${D('ahora', 50, 352, 210, { cls: 'lime' })}
<div class="abs" style="left:0;top:700px;width:1080px;height:650px;background:url('assets/hero.webp') no-repeat;background-size:auto 650px;background-position:-190px 0;z-index:2"></div>
<div class="abs" style="left:0;top:700px;width:1080px;height:230px;z-index:3;background:linear-gradient(to bottom,#050505 0%,rgba(5,5,5,.9) 40%,rgba(5,5,5,0) 100%)"></div>
<div class="abs" style="left:0;bottom:0;width:1080px;height:150px;z-index:3;background:linear-gradient(to top,#050505 0%,rgba(5,5,5,.7) 55%,rgba(5,5,5,0) 100%)"></div>
${tape('revistabifido.com', 722, 118, -3)}
${HUD({ last: true })}`));

// ============================================================================
// E) PLANTILLA DE ARTÍCULO (4 cards reutilizables)
// ============================================================================
{
  const c = CH.find((x) => x.id === ART.char);
  const url = `revistabifido.com/${c.id}/articulos`;
  const charImg = (h, right, bottom, z = 20) => `<img class="abs" src="assets/${c.id}.webp" style="right:${right}px;bottom:${bottom}px;height:${h}px;z-index:${z};filter:drop-shadow(0 20px 28px rgba(0,0,0,.55))">`;
  add('ar', 1, page(`
<div class="abs" style="left:380px;top:560px;width:900px;height:900px;border-radius:50%;background:${c.col};z-index:5"></div>
${charImg(860, -30, 100)}
<div class="tape" style="left:-30px;top:165px;width:640px;height:92px;transform:rotate(-3deg);z-index:46;display:flex;align-items:center;padding-left:86px"><div class="d" style="font-size:50px;color:#050505">Nuevo en la revista</div></div>
${M(ART.category, 56, 300, 22, { color: c.col === '#9333ea' ? '#c084fc' : c.col })}
<div class="abs d" style="left:52px;top:350px;width:640px;z-index:40;font-size:128px;line-height:.92">${ART.title}</div>
${M('Por ' + ART.author, 56, 1190, 20, { color: '#fff', style: 'width:560px' })}
${HUD({ footL: '' })}`));

  add('ar', 2, page(`
<div class="abs d" style="left:640px;top:60px;z-index:8;font-size:700px;line-height:.8;color:${c.col};opacity:.9">&ldquo;</div>
${D('La pregunta', 52, 160, 52, { cls: 'lime', style: 'letter-spacing:.04em' })}
<div class="abs d" style="left:52px;top:300px;width:900px;z-index:40;font-size:128px;line-height:.98">${ART.question}</div>
${charImg(430, 40, 100, 30)}
${HUD()}`));

  add('ar', 3, page(`
${D(ART.big, 36, 140, 560, { cls: 'lime', lh: .85 })}
<div class="abs d" style="left:52px;top:730px;width:900px;z-index:40;font-size:110px;line-height:.98">${ART.fact}</div>
<div class="abs" style="left:56px;top:1130px;width:300px;height:8px;background:${c.col};z-index:45"></div>
${M('Dato clave', 56, 1160, 22, { color: 'var(--lime)' })}
${HUD()}`));

  add('ar', 4, page(`
<div class="abs" style="left:-200px;top:640px;width:860px;height:860px;border-radius:50%;background:${c.col};z-index:5"></div>
<img class="abs" src="assets/${c.id}.webp" style="left:60px;bottom:90px;height:560px;z-index:20;filter:drop-shadow(0 20px 28px rgba(0,0,0,.55))">
${D('Léelo', 52, 164, 200)}
${D('completo', 50, 346, 200, { cls: 'lime' })}
${tape(url, 585, 62, -3)}
${HUD({ last: true })}`));
}

for (const [k, html] of Object.entries(out)) fs.writeFileSync(path.join(DIR, k + '.html'), html);
console.log('html:', Object.keys(out).length);
