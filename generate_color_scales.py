#!/usr/bin/env python3
"""
Generate color scales for Elysion brand colors.
Base colors should be at variant 500.
"""

def hex_to_hsl(hex_color):
    """Convert hex color to HSL."""
    hex_color = hex_color.lstrip('#')
    r, g, b = tuple(int(hex_color[i:i+2], 16) / 255.0 for i in (0, 2, 4))
    
    max_c = max(r, g, b)
    min_c = min(r, g, b)
    l = (max_c + min_c) / 2
    
    if max_c == min_c:
        h = s = 0
    else:
        d = max_c - min_c
        s = d / (2 - max_c - min_c) if l > 0.5 else d / (max_c + min_c)
        
        if max_c == r:
            h = (g - b) / d + (6 if g < b else 0)
        elif max_c == g:
            h = (b - r) / d + 2
        else:
            h = (r - g) / d + 4
        h /= 6
    
    return h * 360, s * 100, l * 100


def hsl_to_hex(h, s, l):
    """Convert HSL to hex color."""
    h = h / 360
    s = s / 100
    l = l / 100
    
    if s == 0:
        r = g = b = l
    else:
        def hue_to_rgb(p, q, t):
            if t < 0: t += 1
            if t > 1: t -= 1
            if t < 1/6: return p + (q - p) * 6 * t
            if t < 1/2: return q
            if t < 2/3: return p + (q - p) * (2/3 - t) * 6
            return p
        
        q = l * (1 + s) if l < 0.5 else l + s - l * s
        p = 2 * l - q
        r = hue_to_rgb(p, q, h + 1/3)
        g = hue_to_rgb(p, q, h)
        b = hue_to_rgb(p, q, h - 1/3)
    
    return '#{:02x}{:02x}{:02x}'.format(
        int(round(r * 255)),
        int(round(g * 255)),
        int(round(b * 255))
    )


def generate_color_scale(base_hex, color_name):
    """Generate a full 50-950 color scale with base color at 500."""
    h, s, l = hex_to_hsl(base_hex)
    
    # Define lightness values for each variant
    # These are percentages that work well for creating balanced scales
    lightness_map = {
        50: 97,   # Very light
        100: 94,
        200: 87,
        300: 76,
        400: 62,
        500: l,   # Base color lightness
        600: max(l - 10, 35),
        700: max(l - 18, 25),
        800: max(l - 26, 16),
        900: max(l - 32, 10),
        950: max(l - 38, 5)
    }
    
    scale = {}
    for variant, target_l in lightness_map.items():
        # Adjust saturation for better color balance
        adjusted_s = s
        if variant <= 100:
            # Desaturate very light colors
            adjusted_s = s * 0.4
        elif variant == 200:
            adjusted_s = s * 0.6
        elif variant == 300:
            adjusted_s = s * 0.8
        elif variant >= 800:
            # Increase saturation slightly for dark colors
            adjusted_s = min(s * 1.1, 100)
        
        # Ensure lightness stays in valid range
        final_l = max(3, min(98, target_l))
        scale[variant] = hsl_to_hex(h, adjusted_s, final_l)
    
    return scale


def print_css_variables(scale, prefix):
    """Print CSS custom properties."""
    print(f"\n  /* {prefix.title()} Scale */")
    for variant in [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]:
        print(f"  --elysion-{prefix}-{variant}: {scale[variant]};")


def print_markdown_section(scale, color_name, base_hex, prefix):
    """Print markdown section."""
    print(f"\n### {color_name}")
    print(f"**Base Color (500): {base_hex.upper()}**\n")
    print("```css")
    for variant in [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]:
        print(f"--elysion-{prefix}-{variant}: {scale[variant]}")
    print("```")


if __name__ == "__main__":
    # Define base colors at variant 500
    colors = {
        'primary': {'hex': '#0A418E', 'name': 'Primary Blue (Elysion Primary)', 'prefix': 'primary'},
        'accent': {'hex': '#FBB03B', 'name': 'Accent Orange (Elysion Accent)', 'prefix': 'accent'}
    }
    
    print("=" * 80)
    print("CSS VARIABLES FOR APP.CSS")
    print("=" * 80)
    
    for color_key, color_info in colors.items():
        scale = generate_color_scale(color_info['hex'], color_info['name'])
        print_css_variables(scale, color_info['prefix'])
    
    print("\n" + "=" * 80)
    print("MARKDOWN SECTIONS")
    print("=" * 80)
    
    for color_key, color_info in colors.items():
        scale = generate_color_scale(color_info['hex'], color_info['name'])
        print_markdown_section(scale, color_info['name'], color_info['hex'], color_info['prefix'])
