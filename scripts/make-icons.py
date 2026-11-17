#!/usr/bin/env python3
"""Generate the favicons from the logo mark (the dots and lines left of the wordmark).

Optional, local only; needs Pillow (python3 -m pip install pillow). Run from the repository root:
  python3 scripts/make-icons.py assets/masters-logo-hq.png .
Writes favicon.ico (16/32/48), assets/icons/icon-192.png and assets/icons/apple-touch-icon.png.
The mark sits on a white rounded square so its dark lines stay visible in dark browser tabs.
"""
import sys
from PIL import Image, ImageDraw
logo_path, out_dir = sys.argv[1], sys.argv[2]
logo = Image.open(logo_path).convert('RGBA')
region = logo.crop((0, 0, 455, logo.height))           # the mark only, left of the wordmark
alpha = region.split()[3].point(lambda a: 255 if a > 40 else 0)
mark = region.crop(alpha.getbbox())
print('mark bbox', alpha.getbbox(), mark.size)

def icon(size, pad_ratio=0.14, radius_ratio=0.22):
    big = size * 4
    canvas = Image.new('RGBA', (big, big), (0, 0, 0, 0))
    ImageDraw.Draw(canvas).rounded_rectangle((0, 0, big - 1, big - 1), radius=int(big * radius_ratio), fill=(255, 255, 255, 255))
    inner = int(big * (1 - 2 * pad_ratio))
    scale = inner / max(mark.size)
    m = mark.resize((max(1, round(mark.width * scale)), max(1, round(mark.height * scale))), Image.LANCZOS)
    canvas.alpha_composite(m, ((big - m.width) // 2, (big - m.height) // 2))
    return canvas.resize((size, size), Image.LANCZOS)

icon(48).save(f'{out_dir}/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)], append_images=[icon(32), icon(16)])
icon(192).save(f'{out_dir}/assets/icons/icon-192.png')

# Apple draws its own rounded corners and needs an opaque square.
apple = Image.new('RGB', (180, 180), (255, 255, 255)); apple.paste(icon(180, radius_ratio=0), (0, 0), icon(180, radius_ratio=0))
apple.save(f'{out_dir}/assets/icons/apple-touch-icon.png')

