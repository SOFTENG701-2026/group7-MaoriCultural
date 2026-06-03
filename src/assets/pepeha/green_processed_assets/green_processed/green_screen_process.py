from PIL import Image, ImageOps, ImageDraw, ImageFont
import numpy as np
import cv2
import os, csv, zipfile, shutil
from pathlib import Path

# Source files mounted by ChatGPT sandbox
SRC = {
    "01_whanau": "/mnt/data/ChatGPT Image 2026年6月3日 17_53_43 (3).png",
    "02_kiki": "/mnt/data/ChatGPT Image 2026年6月3日 17_53_43 (1).png",
    "03_ui_sheet": "/mnt/data/ChatGPT Image 2026年6月3日 17_53_30.png",
    "04_whau": "/mnt/data/ChatGPT Image 2026年6月3日 17_53_43 (2).png",
}

OUT = Path("/mnt/data/green_processed")
FULL = OUT / "full_transparent"
CROP = OUT / "full_cropped"
SEG = OUT / "ui_segments"
for d in (FULL, CROP, SEG):
    d.mkdir(parents=True, exist_ok=True)


def remove_edge_green(im: Image.Image, expand_iter: int = 4):
    """Remove only the edge-connected neon green-screen background.

    This keeps internal green text, clothing, buttons and illustrations intact.
    """
    arr = np.array(im.convert("RGBA"))
    rgb = arr[..., :3].astype(np.int16)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]

    # Use the median edge colour as the actual green-screen colour.
    edge = np.concatenate([rgb[0, :, :], rgb[-1, :, :], rgb[:, 0, :], rgb[:, -1, :]], axis=0)
    med = np.median(edge, axis=0).astype(np.int16)
    diff = rgb.astype(np.int32) - med.astype(np.int32)
    dist = np.sqrt(np.sum(diff * diff, axis=2).astype(np.float32))

    # Strict mask for the neon background. This avoids eating darker UI greens.
    strong = (dist < 70) & (g > 180) & (g - r > 80) & (g - b > 80) & (r < 90) & (b < 90)

    # Keep only green regions connected to the image edge.
    num, labels = cv2.connectedComponents(strong.astype(np.uint8), connectivity=8)
    edge_labels = set()
    edge_labels.update(np.unique(labels[0, :]))
    edge_labels.update(np.unique(labels[-1, :]))
    edge_labels.update(np.unique(labels[:, 0]))
    edge_labels.update(np.unique(labels[:, -1]))
    edge_labels.discard(0)
    if edge_labels:
        bg = np.isin(labels, list(edge_labels))
    else:
        bg = np.zeros(strong.shape, dtype=bool)

    # Remove a small amount of edge fringing, still constrained to near-neon green.
    soft = (dist < 95) & (g > 160) & (g - r > 60) & (g - b > 60) & (r < 120) & (b < 120)
    kernel = np.ones((3, 3), np.uint8)
    for _ in range(expand_iter):
        dil = cv2.dilate(bg.astype(np.uint8), kernel, iterations=1).astype(bool)
        bg |= dil & soft

    arr[bg, :3] = 0
    arr[..., 3] = np.where(bg, 0, 255).astype(np.uint8)
    return Image.fromarray(arr), bg


def bbox_from_alpha(im: Image.Image, pad: int = 0):
    alpha = np.array(im)[..., 3]
    ys, xs = np.where(alpha > 0)
    if len(xs) == 0:
        return None
    x0, x1 = xs.min(), xs.max() + 1
    y0, y1 = ys.min(), ys.max() + 1
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(im.width, x1 + pad)
    y1 = min(im.height, y1 + pad)
    return (x0, y0, x1, y1)


def save_png(im: Image.Image, path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "PNG")


# 1) Full images: remove green-screen background.
manifest_rows = []
processed = {}
for name, src in SRC.items():
    im = Image.open(src).convert("RGBA")
    out, _ = remove_edge_green(im)
    full_path = FULL / f"{name}_transparent.png"
    save_png(out, full_path)
    processed[name] = out
    bbox = bbox_from_alpha(out, pad=8)
    if bbox:
        cropped = out.crop(bbox)
        crop_path = CROP / f"{name}_cropped.png"
        save_png(cropped, crop_path)
        manifest_rows.append(["full", name, str(full_path.relative_to(OUT)), "", "", "", "", out.width, out.height])
        manifest_rows.append(["cropped", name, str(crop_path.relative_to(OUT)), *bbox, cropped.width, cropped.height])


# 2) Split UI sheet into individual cards / buttons, then remove green screen per crop.
ui = processed["03_ui_sheet"]
alpha = np.array(ui)[..., 3]
fg = (alpha > 0).astype(np.uint8)
num, labels, stats, cents = cv2.connectedComponentsWithStats(fg, connectivity=8)
components = []
for i in range(1, num):
    x, y, w, h, area = stats[i]
    # Drop separated heading text and tiny specks; keep UI assets.
    if area > 1000 and w > 20 and h > 20:
        components.append({"label": i, "x": int(x), "y": int(y), "w": int(w), "h": int(h), "area": int(area)})

# Known layout labels, matched by nearest centre. Names are descriptive file names only.
expected = [
    (121, 284, "pepeha_01_ingoa"),
    (297, 284, "pepeha_02_maunga"),
    (467, 284, "pepeha_03_awa"),
    (635, 284, "pepeha_04_whanau"),
    (840, 291, "school_01_rosebank"),
    (1031, 292, "school_02_don_buck"),
    (1224, 292, "school_03_glen_eden"),
    (1413, 292, "school_04_kauri_park"),
    (210, 748, "sticker_awa_large"),
    (518, 661, "answer_01_pepeha_connects"),
    (723, 655, "answer_02_biggest_mountain"),
    (917, 658, "answer_03_any_mountain"),
    (1145, 616, "button_read_to_me"),
    (1374, 616, "button_back_to_map"),
    (1145, 704, "button_check_answer"),
    (1374, 706, "button_add_sticker"),
    (518, 829, "answer_04_kiki_practise"),
    (723, 829, "answer_05_everyone_copies"),
    (917, 829, "answer_06_kiki_guess"),
    (1170, 803, "button_start_adventure"),
    (1394, 802, "button_next"),
    (1151, 901, "button_find_maunga"),
    (1383, 901, "button_whanau_circle"),
]

# Assign each detected component to nearest expected item.
used = set()
assigned = []
for ex, ey, nm in expected:
    best = None
    best_dist = 10**18
    for idx, c in enumerate(components):
        if idx in used:
            continue
        cx = c["x"] + c["w"] / 2
        cy = c["y"] + c["h"] / 2
        d = (cx - ex) ** 2 + (cy - ey) ** 2
        if d < best_dist:
            best_dist = d
            best = idx
    if best is not None and best_dist < 120**2:
        used.add(best)
        assigned.append((nm, components[best]))

# Save assigned crops with a little transparent padding.
for order, (nm, c) in enumerate(assigned, 1):
    pad = 6
    x0 = max(0, c["x"] - pad)
    y0 = max(0, c["y"] - pad)
    x1 = min(ui.width, c["x"] + c["w"] + pad)
    y1 = min(ui.height, c["y"] + c["h"] + pad)
    crop = ui.crop((x0, y0, x1, y1))
    # Re-run removal on the crop to ensure edge background is transparent after split.
    crop2, _ = remove_edge_green(crop, expand_iter=2)
    # Trim to non-transparent bbox with 4 px padding.
    bb = bbox_from_alpha(crop2, pad=4)
    if bb:
        crop2 = crop2.crop(bb)
        # Offset bbox from the original image after trimming.
        bx0, by0, bx1, by1 = bb
        final_bbox = (x0 + bx0, y0 + by0, x0 + bx1, y0 + by1)
    else:
        final_bbox = (x0, y0, x1, y1)
    out_path = SEG / f"{order:02d}_{nm}.png"
    save_png(crop2, out_path)
    manifest_rows.append(["segment", nm, str(out_path.relative_to(OUT)), *final_bbox, crop2.width, crop2.height])

# Segment preview contact sheet
thumbs = []
for p in sorted(SEG.glob("*.png")):
    im = Image.open(p).convert("RGBA")
    thumb = im.copy()
    thumb.thumbnail((170, 150), Image.LANCZOS)
    thumbs.append((p.name, thumb))
cols = 4
cell_w, cell_h = 230, 200
rows = (len(thumbs) + cols - 1) // cols
sheet = Image.new("RGBA", (cols * cell_w, rows * cell_h), (255, 255, 255, 255))
draw = ImageDraw.Draw(sheet)
for idx, (name, thumb) in enumerate(thumbs):
    col, row = idx % cols, idx // cols
    x = col * cell_w + (cell_w - thumb.width) // 2
    y = row * cell_h + 10
    # checkerboard behind transparent assets
    checker = Image.new("RGBA", (cell_w - 20, 150), (245, 245, 245, 255))
    cd = ImageDraw.Draw(checker)
    s = 10
    for yy in range(0, checker.height, s):
        for xx in range(0, checker.width, s):
            if (xx // s + yy // s) % 2:
                cd.rectangle([xx, yy, xx+s-1, yy+s-1], fill=(220, 220, 220, 255))
    sheet.alpha_composite(checker, (col * cell_w + 10, row * cell_h + 5))
    sheet.alpha_composite(thumb, (x, y))
    draw.text((col * cell_w + 10, row * cell_h + 160), name[:32], fill=(0, 0, 0, 255))
preview_path = OUT / "segment_preview.png"
sheet.convert("RGB").save(preview_path)

# CSV manifest
manifest_path = OUT / "manifest.csv"
with open(manifest_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["type", "name", "file", "x0", "y0", "x1", "y1", "width", "height"])
    writer.writerows(manifest_rows)

# ZIP everything except old zips if re-run
zip_path = Path("/mnt/data/green_processed_assets.zip")
if zip_path.exists():
    zip_path.unlink()
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for path in OUT.rglob("*"):
        if path.is_file():
            z.write(path, path.relative_to(OUT.parent))
print(f"Wrote {zip_path}")
print(f"Segments: {len(assigned)}")
