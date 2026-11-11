#!/usr/bin/env python3
"""Build /archive/ (歷屆回顧) and /archive/<year>/ from editions.json.
Usage: python3 _src/archive/build.py   (run from anywhere)"""
import json, html, os, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
V = '5'
cfg = json.loads((HERE / 'editions.json').read_text())
LAY = (HERE / 'layout.html').read_text()
FOLLOW = (HERE / 'pages' / '_follow.html').read_text()
eds = sorted(cfg['editions'], key=lambda e: -e['year'])   # newest first
e = html.escape
A = '/assets/recap/'

def page(path, title, desc, main, cls='', preload=''):
    s = LAY
    for k, v in (('{{TITLE}}', e(title)), ('{{DESC}}', e(desc)), ('{{PATH}}', path), ('{{V}}', V),
                 ('{{PRELOAD}}', preload), ('{{MAINCLASS}}', f' class="{cls}"' if cls else ''), ('{{MAIN}}', main)):
        s = s.replace(k, v)
    out = ROOT / path.strip('/') / 'index.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(s)
    print('wrote', out.relative_to(ROOT))

def suf(s):
    if not s: return ''
    cj = ' class="cj"' if any(ord(c) > 0x2e80 for c in s) else ''
    return f'<i{cj}>{s}</i>'

def num(to, s, label, tip):
    return (f'<li class="rc-num rc-fx" tabindex="0"><b data-to="{to}">{suf(s)}</b><span>{e(label)}</span>'
            f'<em class="rc-tip" role="tooltip">{e(tip)}</em></li>')

def grid(items, key):
    out = []
    for k, it in enumerate(items):
        cls = 'rc-big' if k % 9 == 0 else ('rc-tall' if it['h'] > it['w'] else ('rc-wide' if k % 9 in (4, 7) else ''))
        sz = '(min-width:760px) 50vw, 100vw' if cls in ('rc-big', 'rc-wide') else '(min-width:760px) 25vw, 50vw'
        out.append(f'<a class="rc-item rc-fx {cls}" href="{A}{it["lg"]}" data-rc="{key}" data-cap="{e(it["cap"])}">'
                   f'<img src="{A}{it["sm"]}" srcset="{A}{it["sm"]} 800w, {A}{it["lg"]} 1800w" sizes="{sz}" '
                   f'width="{it["w"]}" height="{it["h"]}" alt="{e(it["cap"])}" loading="lazy" decoding="async"></a>')
    return '<div class="rc-grid">' + ''.join(out) + '</div>'

LB = ('<div class="rc-lb" role="dialog" aria-modal="true" aria-label="照片檢視"><img alt=""><p></p>'
      '<button class="x" aria-label="關閉">×</button><button class="p" aria-label="上一張">‹</button>'
      '<button class="n" aria-label="下一張">›</button></div>')

# ---------- hub
h = cfg['hub']
cards = []
for ed in eds:
    c = ed['card']
    st = ''.join(f'<li><b>{e(a)}{suf(b)}</b><span>{e(l)}</span></li>' for a, b, l in c['stats'])
    cards.append(f'''<a class="rc-card rc-fx" href="/archive/{ed["year"]}/">
 <div class="rc-card-media"><img src="{A}{c["img_sm"]}" srcset="{A}{c["img_sm"]} 800w, {A}{c["img"]} 1800w" sizes="(min-width:900px) 50vw, 100vw" alt="{ed["no"]} {ed["name"]}" loading="lazy" decoding="async"><video muted loop playsinline preload="none" data-src="{A}{c["video"]}" aria-hidden="true"></video></div>
 <div class="rc-card-tx"><p class="rc-card-k">{ed["no"]}<span>{ed["year"]}</span></p><h2>{ed["name"]}</h2>
 <ul class="rc-card-st">{st}</ul><span class="rc-card-go" aria-hidden="true">→</span></div>
</a>''')
mv = h.get('mv')
mvh = (f'''<section class="rc-mv" aria-labelledby="mvh"><div class="rc-w"><h2 id="mvh" class="rc-fx">{e(mv["title"])}</h2>
<div class="vid rc-fx" data-yt="{mv["yt"]}" role="button" tabindex="0" aria-label="播放 {e(mv["title"])}"><img src="https://i.ytimg.com/vi/{mv["yt"]}/maxresdefault.jpg" alt="{e(mv["title"])}" loading="lazy" width="1280" height="720"><span class="play"></span></div></div></section>''') if mv else ''
main = f'''<section class="rc-hero" aria-label="歷屆回顧">
 <img class="rc-poster" src="{A}{h["poster"]}" alt="" fetchpriority="high">
 <video muted loop playsinline preload="none" poster="{A}{h["poster"]}" data-src="{A}{h["video"]}" aria-hidden="true"></video>
 <div class="rc-hero-in"><p class="rc-eyebrow">FANTACO 魔幻藝術節</p><h1>歷屆回顧</h1></div>
 <a class="rc-cue" href="#pick" aria-label="選擇屆別"></a>
</section>
<section class="rc-pick" id="pick" aria-label="選擇屆別"><div class="rc-w"><div class="rc-cards">
{''.join(cards)}
</div></div></section>
{mvh}
{FOLLOW}
{LB}'''
page('/archive/', h['title'], h['desc'], main, 'rc', f'<link rel="preload" as="image" href="{A}{h["poster"]}">')

# ---------- edition pages
for i, ed in enumerate(eds):
    body = (HERE / ed['body']).read_text()
    L = ed['loop']
    extras = f'''
<section class="rc rc-band" aria-label="{ed["no"]}數據"><div class="rc-w"><p class="rc-band-h rc-fx">{ed["no"]}<span>{ed["year"]}</span>{ed["name"]}</p><ul class="rc-mini">{''.join(num(*s) for s in ed["stats"])}</ul></div></section>
<section class="rc rc-reel" aria-label="{ed["no"]}精華影像"><figure class="rc-feature rc-vfeat"><video muted loop playsinline preload="none" poster="{A}{L["poster"]}" data-src="{A}{L["video"]}" aria-hidden="true"></video></figure></section>
<section class="rc rc-ed" aria-labelledby="g{ed["year"]}"><div class="rc-w rc-ed-in">
 <header class="rc-ed-head rc-fx"><h2 id="g{ed["year"]}"><small>GALLERY</small>現場實景</h2></header>
 {grid(ed["gallery"], "g")}
</div></section>
'''
    body = body.replace('<!--RC:EXTRAS-->', extras)
    nav = []
    if i > 0:
        n = eds[i - 1]; nav.append(f'<a class="btn dark" href="/archive/{n["year"]}/">下一屆：{n["no"]} {n["name"]} <span class="arr">→</span></a>')
    if i < len(eds) - 1:
        o = eds[i + 1]; nav.append(f'<a class="btn line" href="/archive/{o["year"]}/">上一屆：{o["no"]} {o["name"]} <span class="arr">→</span></a>')
    nav.append('<a class="btn line" href="/archive/">歷屆回顧 <span class="arr">→</span></a>')
    body = body.replace('<!--RC:PAGER-->', '<section><div class="wrap center reveal rc-pager">' + ''.join(nav) + '</div></section>')
    page(f'/archive/{ed["year"]}/', ed['title'], ed['desc'], body + LB)
