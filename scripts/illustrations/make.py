"""Generate RTC's original illustrations as SVG (and WebP for the site).

Run:  python3 scripts/illustrations/make.py
Writes SVGs to scripts/illustrations/out/ and WebPs to src/assets/images/.
Colours: the site tokens (src/styles/global.css) + the logo's sage / plum / tan.
"""
import math, os, random, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out')
IMAGES = os.path.join(HERE, '..', '..', 'src', 'assets', 'images')

BG = '#eae6e1'      # --color-bg
LIGHT = '#e6e0d8'   # --color-light
BROWN = '#583b1e'   # --color-text
MUTED = '#705943'   # --color-text-muted
LAV = '#c2bfcb'     # --color-accent
OLIVE = '#7e7b46'   # --color-olive
SAGE = '#778469'    # logo
PLUM = '#5e3f63'    # logo
TAN = '#ceb58f'     # logo


def figure(x, y, h, color, lean=0.0, head=None):
    """A soft rounded person: a bell-shaped body with a round head, base at (x, y)."""
    w = h * 0.62
    hr = h * 0.17
    top = y - h * 0.68
    body = (f'M{x - w/2:.1f},{y:.1f} C{x - w/2:.1f},{top + h*0.05:.1f} {x - w*0.28:.1f},{top:.1f} {x:.1f},{top:.1f} '
            f'C{x + w*0.28:.1f},{top:.1f} {x + w/2:.1f},{top + h*0.05:.1f} {x + w/2:.1f},{y:.1f} Z')
    hx = x + lean * h * 0.18
    hy = top - hr * 1.15
    return (f'<path d="{body}" fill="{color}"/>'
            f'<circle cx="{hx:.1f}" cy="{hy:.1f}" r="{hr:.1f}" fill="{head or color}"/>')


def conifer(x, y, h, color):
    """A Pacific-NW evergreen: three stacked soft triangles on a short trunk."""
    w = h * 0.42
    parts = [f'<rect x="{x - h*0.02:.1f}" y="{y - h*0.08:.1f}" width="{h*0.04:.1f}" height="{h*0.08:.1f}" fill="{color}"/>']
    for i, (t, b, s) in enumerate([(0.0, 0.42, 0.55), (0.22, 0.68, 0.78), (0.45, 0.92, 1.0)]):
        ty, by, hw = y - h + t * h, y - h + b * h, w / 2 * s
        parts.append(f'<path d="M{x:.1f},{ty:.1f} Q{x + hw*0.35:.1f},{(ty+by)/2:.1f} {x + hw:.1f},{by:.1f} '
                     f'Q{x:.1f},{by + h*0.03:.1f} {x - hw:.1f},{by:.1f} Q{x - hw*0.35:.1f},{(ty+by)/2:.1f} {x:.1f},{ty:.1f} Z" fill="{color}"/>')
    return ''.join(parts)


def hill(points, color, bottom):
    """A smooth ridge through points, closed down to `bottom`."""
    d = f'M{points[0][0]},{points[0][1]}'
    for (x0, y0), (x1, y1) in zip(points, points[1:]):
        mx = (x0 + x1) / 2
        d += f' C{mx},{y0} {mx},{y1} {x1},{y1}'
    d += f' L{points[-1][0]},{bottom} L{points[0][0]},{bottom} Z'
    return f'<path d="{d}" fill="{color}"/>'


def svg(w, h, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img">'
            f'<title>{title}</title>{body}</svg>')


# ---------- Hero: lakeside, two people on a bench looking out ----------
def hero():
    W, H = 2400, 1000
    rnd = random.Random(7)
    b = [f'<rect width="{W}" height="{H}" fill="{BG}"/>']
    # sun / moon disc and a soft halo, right of centre (the hero text sits on the left)
    b.append(f'<circle cx="1720" cy="330" r="230" fill="{LIGHT}"/>')
    b.append(f'<circle cx="1720" cy="330" r="150" fill="{TAN}" opacity=".55"/>')
    # distant mountains (lavender), then hills
    b.append(hill([(0, 520), (300, 470), (640, 520), (980, 400), (1300, 470), (1620, 380), (1980, 450), (2400, 400)], LAV, 700))
    b.append(hill([(0, 600), (420, 560), (860, 610), (1260, 540), (1700, 590), (2100, 530), (2400, 570)], '#a9a39a', 700))
    # far treeline
    for i in range(70):
        x = i * 36 + rnd.uniform(-10, 10)
        b.append(conifer(x, 640 + rnd.uniform(-6, 6), rnd.uniform(70, 120), '#8d917a'))
    # lake
    b.append(f'<rect x="0" y="630" width="{W}" height="140" fill="{LAV}"/>')
    for i in range(14):
        y = 650 + i * 9
        x = 1520 + rnd.uniform(-40, 40)
        w = 300 - i * 16
        b.append(f'<rect x="{x - w/2:.0f}" y="{y}" width="{w:.0f}" height="3" rx="1.5" fill="{BG}" opacity=".7"/>')
    # near shore
    b.append(hill([(0, 790), (500, 760), (1100, 800), (1700, 750), (2400, 780)], SAGE, H))
    b.append(hill([(0, 880), (700, 850), (1400, 900), (2000, 860), (2400, 880)], OLIVE, H))
    # tall near conifers framing the right edge
    for x, h in [(2050, 640), (2190, 760), (2320, 560), (1210, 420), (1120, 330)]:
        b.append(conifer(x, 820, h, '#4f5a45'))
    # bench + two people, looking out over the water
    bx, by = 1560, 815
    b.append(f'<rect x="{bx - 150}" y="{by - 52}" width="300" height="16" rx="8" fill="{BROWN}"/>')
    b.append(f'<rect x="{bx - 130}" y="{by - 40}" width="12" height="40" fill="{BROWN}"/>')
    b.append(f'<rect x="{bx + 118}" y="{by - 40}" width="12" height="40" fill="{BROWN}"/>')
    b.append(figure(bx - 58, by - 50, 190, PLUM, lean=0.5))
    b.append(figure(bx + 58, by - 50, 175, SAGE, lean=-0.6, head='#6b775e'))
    # a few birds
    for x, y in [(1980, 230), (2030, 260), (2090, 220)]:
        b.append(f'<path d="M{x-16},{y} Q{x-8},{y-10} {x},{y} Q{x+8},{y-10} {x+16},{y}" fill="none" stroke="{MUTED}" stroke-width="3" stroke-linecap="round"/>')
    return svg(W, H, ''.join(b), 'Two people sitting together on a bench by a lake, with evergreen trees and mountains beyond')


# ---------- Spot illustrations (1200 x 800) for page intros ----------
def frame(inner, ground=LIGHT):
    return f'<rect width="1200" height="800" fill="{ground}"/>' + inner


def couples():
    b = [f'<circle cx="600" cy="380" r="300" fill="{LAV}"/>',
         hill([(0, 640), (400, 610), (800, 650), (1200, 615)], SAGE, 800),
         f'<rect x="0" y="690" width="1200" height="110" fill="{OLIVE}"/>',
         # two people leaning in, arms meeting in the middle
         figure(520, 660, 340, PLUM, lean=0.7),
         figure(680, 660, 320, SAGE, lean=-0.7, head='#6b775e'),
         f'<path d="M560,520 Q600,560 640,520" fill="none" stroke="{TAN}" stroke-width="22" stroke-linecap="round"/>',
         conifer(170, 660, 300, '#4f5a45'), conifer(1040, 660, 360, '#4f5a45')]
    return svg(1200, 800, frame(''.join(b)), 'Two people leaning toward each other under a soft lavender sky')


def family():
    b = [f'<circle cx="600" cy="300" r="250" fill="{TAN}" opacity=".6"/>',
         hill([(0, 600), (350, 570), (850, 620), (1200, 580)], LAV, 800),
         f'<rect x="0" y="680" width="1200" height="120" fill="{SAGE}"/>',
         figure(400, 680, 330, PLUM, lean=0.3),
         figure(800, 680, 350, SAGE, lean=-0.3, head='#6b775e'),
         figure(545, 680, 200, OLIVE, lean=0.4),
         figure(660, 680, 170, TAN, lean=-0.2, head='#bfa57d'),
         conifer(130, 680, 380, '#4f5a45'), conifer(1080, 680, 300, '#4f5a45')]
    return svg(1200, 800, frame(''.join(b)), 'A family of two adults and two children standing together')


def group():
    b = [f'<circle cx="600" cy="420" r="320" fill="{LAV}"/>',
         f'<ellipse cx="600" cy="640" rx="470" ry="90" fill="{TAN}"/>',
         f'<ellipse cx="600" cy="650" rx="120" ry="26" fill="{BROWN}" opacity=".85"/>']
    colors = [SAGE, PLUM, OLIVE, BROWN, SAGE, PLUM]
    # six people around a circle, back row smaller
    for i, c in enumerate(colors):
        a = math.pi * (0.15 + i * 0.14)
        x = 600 + math.cos(a + math.pi) * 380
        y = 600 - math.sin(a) * 70
        h = 230 - math.sin(a) * 40
        b.append(figure(x, y, h, c, lean=(600 - x) / 600))
    return svg(1200, 800, frame(''.join(b), BG), 'A group of people sitting together in a circle')


def path():
    rnd = random.Random(3)
    b = [f'<circle cx="840" cy="260" r="170" fill="{TAN}" opacity=".6"/>',
         hill([(0, 470), (400, 420), (800, 470), (1200, 430)], LAV, 800),
         hill([(0, 560), (500, 520), (900, 570), (1200, 540)], SAGE, 800),
         f'<path d="M560,800 C540,700 760,660 690,600 C640,555 600,540 640,520" fill="none" stroke="{TAN}" stroke-width="70" stroke-linecap="round"/>']
    for x in [80, 210, 330, 900, 1010, 1130]:
        b.append(conifer(x + rnd.uniform(-20, 20), 600 + rnd.uniform(0, 60), rnd.uniform(260, 420), '#4f5a45'))
    b.append(figure(650, 545, 90, PLUM, lean=0.2))
    return svg(1200, 800, frame(''.join(b)), 'A winding path through evergreen trees toward the morning sun')


ART = {
    'illustration-hero-lakeside': (hero, 2400),
    'illustration-couples': (couples, 1200),
    'illustration-family': (family, 1200),
    'illustration-group': (group, 1200),
    'illustration-path': (path, 1200),
}

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for name, (fn, width) in ART.items():
        p = os.path.join(OUT, name + '.svg')
        with open(p, 'w') as f:
            f.write(fn())
        # sharp (librsvg) — ImageMagick's built-in SVG renderer drops stroked paths
        subprocess.run(['node', '-e', 'require("sharp")(process.argv[1]).resize(+process.argv[3]).webp({quality:86}).toFile(process.argv[2])',
                        p, os.path.join(IMAGES, name + '.webp'), str(width)], check=True, cwd=os.path.join(HERE, '..', '..'))
        print('wrote', name)
