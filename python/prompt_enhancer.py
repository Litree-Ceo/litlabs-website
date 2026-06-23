"""Prompt enhancement utilities for image generation."""

import re

STYLE_BOOSTERS = [
    "digital art",
    "concept art",
    "trending on artstation",
    "ultra realistic",
    "professional photography",
    "sharp focus",
    "8k uhd",
    "highly detailed",
]

NEGATIVE_DEFAULT = "blurry, low quality, distorted, text, watermark, signature, cropped, deformed"


def enhance_image_prompt(prompt: str, context: str = "") -> str:
    """Enhance a raw image prompt with quality and context tags."""
    clean = prompt.strip().rstrip(",. ")
    if not clean:
        return ""

    # Don't duplicate existing quality tags
    lower = clean.lower()
    missing = [tag for tag in STYLE_BOOSTERS if tag not in lower]

    # Add 2-3 boosters depending on length
    count = 3 if len(clean) < 80 else 2
    add_tags = missing[:count]

    parts = [clean]
    if context:
        parts.append(context.strip())
    if add_tags:
        parts.append(", ".join(add_tags))

    return ", ".join(parts)


def build_generation_payload(
    prompt: str,
    negative: str = NEGATIVE_DEFAULT,
    width: int = 1024,
    height: int = 1024,
    seed: int | None = None,
) -> dict:
    """Build a standard payload dict for image generation APIs."""
    enhanced = enhance_image_prompt(prompt)
    payload = {
        "prompt": enhanced,
        "negative_prompt": negative,
        "width": width,
        "height": height,
    }
    if seed is not None:
        payload["seed"] = seed
    return payload


def estimate_cost(width: int, height: int, steps: int = 30) -> int:
    """Estimate LiTBit coin cost for a generation."""
    pixels = width * height
    base = 5
    size_factor = pixels / (1024 * 1024)
    step_factor = steps / 30
    return max(1, int(base * size_factor * step_factor))
