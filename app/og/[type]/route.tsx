import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import { characters } from '@/lib/characters';
import { getCharacterColors } from '@/lib/character-colors';
import { getArticleBySlug, getEventBySlug } from '@/lib/api';

/**
 * Tarjetas para redes (Open Graph / Twitter), 1200x630.
 *   /og/default                    tarjeta base de la revista
 *   /og/personaje?slug=anika       personaje
 *   /og/articulo?slug=mi-nota      artículo
 *   /og/evento?slug=mi-evento      evento
 * El texto sale siempre del CMS / datos del sitio a partir del slug: la URL no puede inyectar texto.
 */

const W = 1200;
const H = 630;
const LIME = '#b8ff00';
const BAR_H = 56;

// Los archivos viajan con la función (ver outputFileTracingIncludes en next.config.js)
const OG_DIR = path.join(process.cwd(), 'app', 'og');
const FONT_FILE = path.join(OG_DIR, 'fonts', 'Anton-Regular.ttf');
const LOGO_FILE = path.join(OG_DIR, 'art', 'logo.png');
const artFile = (slug: string) => path.join(OG_DIR, 'art', `${slug}.png`);
const KNOWN_ART = new Set(['anika', 'incendia', 'malandra', 'mordaz', 'punkibri']);

const files = new Map<string, Promise<Buffer>>();
function load(file: string): Promise<Buffer> {
    if (!files.has(file)) files.set(file, readFile(file));
    return files.get(file)!;
}
async function dataUri(file: string) {
    return `data:image/png;base64,${(await load(file)).toString('base64')}`;
}

function clamp(text: string, max: number) {
    const clean = text.replace(/\s+/g, ' ').trim();
    if (clean.length <= max) return clean;
    return clean.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

/** Primeras oraciones completas que quepan en `max` caracteres (si la primera ya no cabe, se recorta). */
function sentences(text: string, max: number) {
    const parts = text.replace(/\s+/g, ' ').trim().match(/[^.!?]+[.!?]*/g) ?? [text];
    let out = '';
    for (const p of parts) {
        const next = (out + p).trim();
        if (next.length > max) break;
        out = next + ' ';
    }
    return out.trim() || clamp(text, max);
}

function dateParts(value?: string) {
    const d = value ? new Date(value) : null;
    if (!d || Number.isNaN(d.getTime())) return null;
    const fmt = (opts: Intl.DateTimeFormatOptions) =>
        new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', ...opts }).format(d);
    return {
        day: fmt({ day: '2-digit' }),
        month: fmt({ month: 'short' }).replace('.', '').toUpperCase(),
        year: fmt({ year: 'numeric' }),
    };
}

/** Franja lime inferior: eco del ticker del sitio. */
function Bar() {
    return (
        <div style={{ display: 'flex', position: 'absolute', left: 0, right: 0, bottom: 0, height: BAR_H, background: LIME, alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Anton', fontSize: 25, letterSpacing: 5, color: '#000' }}>
                REVISTABIFIDO.COM  ·  PERIODISMO CRUDO PARA SENSIBILIDADES FRÁGILES
            </span>
        </div>
    );
}

function Glow({ color, x = '78%', y = '60%' }: { color: string; x?: string; y?: string }) {
    return (
        <div style={{ display: 'flex', position: 'absolute', left: 0, top: 0, width: W, height: H, background: `radial-gradient(ellipse at ${x} ${y}, ${color}55 0%, rgba(0,0,0,0) 58%)` }} />
    );
}

function toArrayBuffer(buf: Buffer): ArrayBuffer {
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

type Card = { fonts: { name: string; data: ArrayBuffer; weight: 400; style: 'normal' }[]; element: React.ReactElement };

async function baseCard(): Promise<React.ReactElement> {
    const logo = await dataUri(LOGO_FILE);
    const order: [string, number][] = [['malandra', 300], ['incendia', 318], ['mordaz', 350], ['punkibri', 318], ['anika', 300]];
    const arts = await Promise.all(order.map(([slug]) => dataUri(artFile(slug))));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: W, height: H, background: '#000', position: 'relative', overflow: 'hidden' }}>
            <Glow color={LIME} x="50%" y="92%" />
            <div style={{ display: 'flex', position: 'absolute', left: 0, right: 0, bottom: BAR_H, justifyContent: 'center', alignItems: 'flex-end' }}>
                {order.map(([slug, h], i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={slug} src={arts[i]} width={Math.round(h * 0.8)} height={h} style={{ marginLeft: i === 0 ? 0 : -56 }} alt="" />
                ))}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} width={250} height={79} style={{ marginTop: 26 }} alt="" />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10, fontFamily: 'Anton', fontSize: 112, lineHeight: 0.96, textTransform: 'uppercase', color: '#fff', textShadow: '0 6px 28px #000, 0 0 12px #000' }}>
                <span>Cinco voces.</span>
                <span style={{ color: LIME }}>Una manada.</span>
            </div>
            <Bar />
        </div>
    );
}

async function leftColumnCard(opts: {
    slug: string;
    label: string;
    title: string;
    titleSize: number;
    body?: string;
    meta?: string;
    right?: React.ReactNode;
    glow: string;
}): Promise<React.ReactElement> {
    const logo = await dataUri(LOGO_FILE);
    const art = KNOWN_ART.has(opts.slug) ? await dataUri(artFile(opts.slug)) : null;
    const { primary } = getCharacterColors(opts.slug);

    return (
        <div style={{ display: 'flex', width: W, height: H, background: '#000', position: 'relative', overflow: 'hidden' }}>
            <Glow color={opts.glow} />
            {art && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={art} width={448} height={560} style={{ position: 'absolute', right: 36, bottom: BAR_H }} alt="" />
            )}
            {opts.right}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} width={210} height={67} style={{ position: 'absolute', left: 64, top: 40 }} alt="" />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'absolute', left: 64, top: 124, height: H - BAR_H - 124 - 10, width: art || opts.right ? 700 : 1070 }}>
                <span style={{ fontFamily: 'Anton', fontSize: 28, letterSpacing: 8, color: opts.glow === LIME ? LIME : primary, textTransform: 'uppercase' }}>
                    {opts.label}
                </span>
                <span style={{ fontFamily: 'Anton', fontSize: opts.titleSize, lineHeight: 1.02, color: '#fff', textTransform: 'uppercase', marginTop: 12 }}>
                    {opts.title}
                </span>
                <div style={{ display: 'flex', width: 96, height: 8, background: opts.glow === LIME ? LIME : primary, marginTop: 22 }} />
                {opts.body && (
                    <span style={{ fontFamily: 'Anton', fontSize: 27, letterSpacing: 2, lineHeight: 1.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.82)', marginTop: 22 }}>
                        {opts.body}
                    </span>
                )}
                {opts.meta && (
                    <span style={{ fontFamily: 'Anton', fontSize: 28, letterSpacing: 4, color: 'rgba(255,255,255,0.7)', marginTop: 20, textTransform: 'uppercase' }}>
                        {opts.meta}
                    </span>
                )}
            </div>
            <Bar />
        </div>
    );
}

function titleSize(title: string) {
    const n = title.length;
    return n <= 38 ? 92 : n <= 70 ? 74 : n <= 110 ? 60 : 52;
}

async function build(type: string, slug: string): Promise<React.ReactElement | null> {
    if (type === 'default') return baseCard();
    if (type === 'personaje') {
        const c = characters.find((x) => x.slug === slug);
        if (!c) return null;
        const { primary } = getCharacterColors(c.slug);
        return leftColumnCard({
            slug: c.slug,
            label: 'La manada',
            title: c.name,
            titleSize: c.name.length > 7 ? 150 : 180,
            body: sentences(c.description, 140),
            glow: primary,
        });
    }

    if (type === 'articulo') {
        const a = await getArticleBySlug(slug);
        if (!a) return null;
        const known = KNOWN_ART.has(a.section) ? a.section : null;
        const dp = dateParts(a.publishedAt);
        const cat = a.categories?.[0]?.name;
        const title = clamp(a.title, 120);
        return leftColumnCard({
            slug: known ?? 'default',
            label: `${known ? `${a.author}  ·  ` : ''}Artículo`,
            title,
            titleSize: titleSize(title),
            meta: [dp ? `${dp.day} ${dp.month} ${dp.year}` : '', cat].filter(Boolean).join('  ·  '),
            glow: known ? getCharacterColors(known).primary : LIME,
        });
    }

    if (type === 'evento') {
        const e = await getEventBySlug(slug);
        if (!e) return null;
        const dp = dateParts(e.date);
        const title = clamp(e.name || e.title, 90);
        const where = [e.location, e.city].filter(Boolean).join('  ·  ');
        const block = dp ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 80, top: 130, width: 300, height: 330, background: LIME, color: '#000', transform: 'rotate(-4deg)' }}>
                <span style={{ fontFamily: 'Anton', fontSize: 200, lineHeight: 1 }}>{dp.day}</span>
                <span style={{ fontFamily: 'Anton', fontSize: 80, lineHeight: 1, letterSpacing: 6 }}>{dp.month}</span>
            </div>
        ) : null;
        return leftColumnCard({
            slug: 'default',
            label: 'Evento',
            title,
            titleSize: titleSize(title),
            meta: where,
            right: block,
            glow: LIME,
        });
    }

    return null;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
    const { type } = await params;
    const slug = (req.nextUrl.searchParams.get('slug') || '').slice(0, 200);

    let element: React.ReactElement | null = null;
    try {
        element = await build(type, slug);
    } catch (error) {
        console.error('og: no se pudo generar la tarjeta', type, slug, error);
    }
    // Si no hay datos (slug inexistente o CMS caído) se devuelve la tarjeta base, nunca una imagen rota
    if (!element) element = await baseCard();

    const fonts: Card['fonts'] = [{ name: 'Anton', data: toArrayBuffer(await load(FONT_FILE)), weight: 400, style: 'normal' }];

    return new ImageResponse(element, {
        width: W,
        height: H,
        fonts,
        headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' },
    });
}
