from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public" / "assets"
LOGO_PATH = ASSETS / "credmais-logo.avif"
SKIP_NAMES = {
    "credmais-logo.avif",
    "credmais-image-review-sheet.jpg",
    "credmais-unique-pages-review.jpg",
}


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            continue
    return ImageFont.load_default()


def fit_logo(max_w: int, max_h: int) -> Image.Image:
    logo = Image.open(LOGO_PATH).convert("RGBA")
    logo.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
    return logo


def add_gradient_overlay(base: Image.Image) -> Image.Image:
    width, height = base.size
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, "RGBA")

    draw.ellipse(
        (-int(width * 0.2), -int(height * 0.25), int(width * 0.55), int(height * 0.55)),
        fill=(255, 91, 0, 32),
    )
    draw.ellipse(
        (int(width * 0.48), -int(height * 0.18), int(width * 1.2), int(height * 0.58)),
        fill=(139, 35, 216, 28),
    )
    draw.ellipse(
        (int(width * 0.25), int(height * 0.62), int(width * 1.1), int(height * 1.25)),
        fill=(255, 91, 0, 24),
    )

    for offset in range(-height, width, max(44, width // 18)):
        draw.line(
            [(offset, height), (offset + height, 0)],
            fill=(255, 255, 255, 18),
            width=max(1, width // 640),
        )

    overlay = overlay.filter(ImageFilter.GaussianBlur(max(0.8, min(width, height) / 360)))
    return Image.alpha_composite(base, overlay)


def add_logo_pattern(base: Image.Image) -> Image.Image:
    width, height = base.size
    pattern = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    logo = fit_logo(max(86, width // 7), max(52, height // 10))
    alpha = logo.getchannel("A").point(lambda value: int(value * 0.075))
    logo.putalpha(alpha)

    step_x = max(220, width // 3)
    step_y = max(150, height // 4)
    for y in range(-step_y, height + step_y, step_y):
        for x in range(-step_x, width + step_x, step_x):
            pattern.alpha_composite(logo, (x + (y // step_y % 2) * (step_x // 2), y))

    return Image.alpha_composite(base, pattern)


def add_brand_badges(base: Image.Image, name: str) -> Image.Image:
    width, height = base.size
    layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer, "RGBA")

    pad = max(12, width // 48)
    radius = max(16, width // 36)

    uniform_w = max(116, min(width - pad * 2, int(width * 0.18)))
    uniform_h = max(40, int(uniform_w * 0.32))
    uniform_x = width - uniform_w - pad
    uniform_y = max(pad, int(height * 0.08))
    draw.rounded_rectangle(
        (uniform_x, uniform_y, uniform_x + uniform_w, uniform_y + uniform_h),
        radius=radius,
        fill=(22, 0, 31, 150),
        outline=(255, 91, 0, 120),
        width=max(1, width // 520),
    )
    draw.text(
        (uniform_x + uniform_w * 0.14, uniform_y + uniform_h * 0.2),
        "CREDMAIS",
        fill=(255, 255, 255, 230),
        font=font(max(10, uniform_w // 13), bold=True),
    )
    draw.text(
        (uniform_x + uniform_w * 0.14, uniform_y + uniform_h * 0.56),
        "SECURITIZADORA",
        fill=(255, 149, 73, 220),
        font=font(max(7, uniform_w // 20), bold=True),
    )

    patch_size = max(34, min(58, width // 18))
    patch_x = width - patch_size - pad
    patch_y = height - patch_size - pad
    draw.rounded_rectangle(
        (patch_x, patch_y, patch_x + patch_size, patch_y + patch_size),
        radius=max(12, patch_size // 4),
        fill=(255, 91, 0, 205),
        outline=(255, 255, 255, 160),
        width=max(1, patch_size // 20),
    )
    draw.text(
        (patch_x + patch_size * 0.32, patch_y + patch_size * 0.18),
        "C",
        fill=(255, 255, 255, 238),
        font=font(max(18, patch_size // 2), bold=True),
    )

    logo = fit_logo(max(74, width // 9), max(34, height // 15))
    logo_alpha = logo.getchannel("A").point(lambda value: int(value * 0.34))
    logo.putalpha(logo_alpha)
    layer.alpha_composite(logo, (pad, pad))

    # Small lapel-style patch in the lower third reinforces the uniform idea without covering faces.
    lapel_w = max(70, min(118, width // 9))
    lapel_h = max(24, lapel_w // 3)
    lapel_x = max(pad, int(width * 0.56))
    lapel_y = max(pad, int(height * 0.62))
    draw.rounded_rectangle(
        (lapel_x, lapel_y, lapel_x + lapel_w, lapel_y + lapel_h),
        radius=max(10, lapel_h // 2),
        fill=(255, 91, 0, 150),
        outline=(255, 255, 255, 110),
        width=max(1, width // 900),
    )
    draw.text(
        (lapel_x + lapel_w * 0.18, lapel_y + lapel_h * 0.18),
        "CREDMAIS",
        fill=(255, 255, 255, 220),
        font=font(max(8, lapel_w // 11), bold=True),
    )

    return Image.alpha_composite(base, layer)


def process(path: Path) -> None:
    original = Image.open(path)
    mode = original.mode
    base = original.convert("RGBA")
    base = ImageEnhance.Contrast(base).enhance(1.03)
    base = ImageEnhance.Color(base).enhance(1.04)
    base = add_gradient_overlay(base)
    base = add_logo_pattern(base)
    base = add_brand_badges(base, path.name)

    if path.suffix.lower() in {".jpg", ".jpeg"}:
        base.convert("RGB").save(path, quality=92, optimize=True, progressive=True)
    else:
        # Preserve PNG assets; AVIF logo is skipped.
        if mode != "RGBA":
            base = base.convert("RGB")
        base.save(path, optimize=True)


def main() -> None:
    images = [
        path
        for path in ASSETS.iterdir()
        if path.is_file()
        and path.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}
        and path.name not in SKIP_NAMES
    ]
    for path in images:
        process(path)
        print(f"branded {path.relative_to(ROOT)}")
    print(f"updated {len(images)} images")


if __name__ == "__main__":
    main()
