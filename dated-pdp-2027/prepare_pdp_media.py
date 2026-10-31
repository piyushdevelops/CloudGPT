from pathlib import Path
from PIL import Image, ImageOps

SOURCE = Path(r"D:\june-shop-redesign\tmp\pdfs\dated-2027-audit\March_01_highres")
OUTPUT = Path(r"D:\june-shop-redesign\dated-pdp-2027\prepared-media")
OUTPUT.mkdir(parents=True, exist_ok=True)


def open_page(number: int) -> Image.Image:
    path = SOURCE / f"page-{number:02d}.png"
    if not path.exists():
        path = SOURCE / f"page-{number}.png"
    return Image.open(path).convert("RGB")


def fit_long_edge(image: Image.Image, edge: int = 2000) -> Image.Image:
    scale = min(1, edge / max(image.size))
    if scale == 1:
        return image
    size = (round(image.width * scale), round(image.height * scale))
    return image.resize(size, Image.Resampling.LANCZOS)


def spread(left: Image.Image, right: Image.Image) -> Image.Image:
    height = max(left.height, right.height)
    canvas = Image.new("RGB", (left.width + right.width, height), "white")
    canvas.paste(left, (0, (height - left.height) // 2))
    canvas.paste(right, (left.width, (height - right.height) // 2))
    return canvas


def save(image: Image.Image, filename: str) -> None:
    image = ImageOps.exif_transpose(image)
    image = fit_long_edge(image)
    image.save(OUTPUT / filename, "WEBP", quality=88, method=6)
    print(f"MEDIA|{filename}|{image.width}x{image.height}|{(OUTPUT / filename).stat().st_size}")


save(open_page(1), "2027-planner-month-at-a-glance.webp")
save(spread(open_page(2), open_page(3)), "2027-planner-monthly-calendar.webp")
save(spread(open_page(6), open_page(7)), "2027-planner-weekly-planning.webp")
save(open_page(4), "2027-planner-meal-planner.webp")
save(open_page(5).rotate(-90, expand=True), "2027-planner-habit-tracker.webp")
save(spread(open_page(16), open_page(17)), "2027-planner-money-reflection.webp")
