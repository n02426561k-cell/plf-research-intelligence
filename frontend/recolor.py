#!/usr/bin/env python3
"""
Bulk color replace: emerald/teal/indigo/rose/amber → burgundy/forest/sand palette
across all .tsx and .ts files in the PLF frontend src directory.
"""
import os
import re

SRC_DIR = os.path.join(os.path.dirname(__file__), "src")

# Ordered replacement pairs: (pattern, replacement)
# More specific patterns first to avoid partial double-replaces
REPLACEMENTS = [
    # ---- Gradient text (hero headline) ----
    ("from-emerald-600 via-teal-500 to-cyan-500", "from-forest-700 via-forest-500 to-burgundy-700"),
    ("dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-300", "dark:from-sand-300 dark:via-sand-400 dark:to-sand-500"),

    # ---- Gradient backgrounds ----
    ("from-emerald-500/5 to-blue-500/5", "from-forest-700/5 to-burgundy-700/5"),
    ("bg-gradient-to-br from-emerald-500", "bg-gradient-to-br from-forest-700"),

    # ---- Solid buttons ----
    ("bg-emerald-600 hover:bg-emerald-700", "bg-forest-700 hover:bg-forest-800"),
    ("bg-emerald-600 hover:bg-emerald-500", "bg-forest-700 hover:bg-forest-600"),
    ("bg-emerald-700 hover:bg-emerald-800", "bg-burgundy-700 hover:bg-burgundy-800"),
    ("bg-emerald-600", "bg-forest-700"),
    ("bg-emerald-700", "bg-forest-700"),
    ("hover:bg-emerald-700", "hover:bg-forest-800"),
    ("hover:bg-emerald-600", "hover:bg-forest-700"),

    # ---- Background tints ----
    ("bg-emerald-950/40", "bg-forest-800/25"),
    ("bg-emerald-950/20", "bg-forest-800/20"),
    ("bg-emerald-950/10", "bg-forest-800/10"),
    ("bg-emerald-50/50", "bg-sand-200/30"),
    ("bg-emerald-50/20", "bg-forest-700/5"),
    ("bg-emerald-50/10", "bg-forest-700/5"),
    ("dark:bg-emerald-950/40", "dark:bg-forest-800/25"),
    ("bg-emerald-500/15", "bg-forest-700/12"),
    ("bg-emerald-500/10", "bg-forest-700/10"),
    ("bg-emerald-600/15", "bg-forest-700/12"),
    ("bg-emerald-50", "bg-sand-100"),

    # ---- Text colors ----
    ("text-emerald-800 dark:text-emerald-300", "text-forest-800 dark:text-sand-300"),
    ("text-emerald-700 dark:text-emerald-300", "text-forest-700 dark:text-sand-300"),
    ("text-emerald-600 dark:text-emerald-400", "text-forest-600 dark:text-forest-400"),
    ("text-emerald-600 dark:text-emerald-300", "text-forest-600 dark:text-sand-300"),
    ("text-emerald-700", "text-forest-700"),
    ("text-emerald-600", "text-forest-600"),
    ("text-emerald-500", "text-forest-500"),
    ("text-emerald-400", "text-forest-400"),
    ("text-emerald-300", "text-sand-300"),
    ("dark:text-emerald-400", "dark:text-forest-400"),
    ("dark:text-emerald-300", "dark:text-sand-300"),

    # ---- Borders ----
    ("border-emerald-500/40", "border-forest-700/35"),
    ("border-emerald-500/30", "border-forest-700/30"),
    ("border-emerald-500/25", "border-forest-700/25"),
    ("border-emerald-500/20", "border-forest-700/20"),
    ("border-emerald-200", "border-sand-300"),
    ("border-emerald-800", "border-forest-800"),
    ("dark:border-emerald-800", "dark:border-forest-800"),
    ("border-emerald-800/40", "border-forest-700/30"),

    # ---- Ring / focus ----
    ("ring-emerald", "ring-forest"),

    # ---- Shadows ----
    ("shadow-emerald-600/25", "shadow-forest-700/25"),
    ("shadow-emerald-500/20", "shadow-forest-700/20"),

    # ---- Pulse / animate ----
    ("animate-pulse text-emerald", "animate-pulse text-forest"),

    # ---- Teal replacements → forest ----
    ("text-teal-600", "text-forest-600"),
    ("text-teal-500", "text-forest-500"),
    ("text-teal-400", "text-forest-400"),
    ("bg-teal-500", "bg-forest-500"),
    ("border-teal-500", "border-forest-500"),
    ("from-teal-500", "from-forest-500"),
    ("to-teal-500", "to-forest-500"),
    ("via-teal-500", "via-forest-500"),

    # ---- Indigo → burgundy ----
    ("text-indigo-600", "text-burgundy-700"),
    ("text-indigo-700", "text-burgundy-700"),
    ("text-indigo-400", "text-burgundy-400"),
    ("text-indigo-300", "text-burgundy-300"),
    ("bg-indigo-500/10", "bg-burgundy-700/10"),
    ("bg-indigo-500/15", "bg-burgundy-700/12"),
    ("border-indigo-500/30", "border-burgundy-700/25"),
    ("dark:text-indigo-300", "dark:text-burgundy-300"),
    ("dark:text-indigo-400", "dark:text-burgundy-400"),

    # ---- Rose → burgundy for gaps/alerts ----
    ("text-rose-600", "text-burgundy-700"),
    ("text-rose-700", "text-burgundy-700"),
    ("text-rose-400", "text-burgundy-400"),
    ("text-rose-300", "text-burgundy-300"),
    ("bg-rose-500/10", "bg-burgundy-700/10"),
    ("bg-rose-500/15", "bg-burgundy-700/12"),
    ("border-rose-500/30", "border-burgundy-700/25"),
    ("dark:text-rose-300", "dark:text-burgundy-300"),
    ("dark:text-rose-400", "dark:text-burgundy-400"),

    # ---- Amber → sand ----
    ("text-amber-600", "text-sand-600"),
    ("text-amber-700", "text-sand-700"),
    ("text-amber-400", "text-sand-400"),
    ("text-amber-300", "text-sand-300"),
    ("bg-amber-500/10", "bg-sand-300/20"),
    ("bg-amber-500/15", "bg-sand-300/25"),
    ("border-amber-500/30", "border-sand-400/35"),
    ("dark:text-amber-300", "dark:text-sand-300"),
    ("dark:text-amber-400", "dark:text-sand-400"),

    # ---- Background page colors ----
    ("bg-slate-50 dark:bg-slate-950", "bg-sand-50 dark:bg-forest-900"),
    ("bg-white/90 dark:bg-slate-950/90", "bg-sand-50/95 dark:bg-forest-900/95"),
    ("bg-white/80 dark:bg-slate-900/80", "bg-sand-50/90 dark:bg-forest-900/90"),

    # ---- Inline RGBA of old emerald color ----
    ("rgba(16, 185, 129", "rgba(15, 61, 58"),
    ("rgba(16,185,129", "rgba(15,61,58"),
    ("rgba(5, 150, 105", "rgba(108, 21, 30"),
]

def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for old, new in REPLACEMENTS:
        content = content.replace(old, new)
    
    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

total_changed = 0
for root, dirs, files in os.walk(SRC_DIR):
    for fname in files:
        if fname.endswith(('.tsx', '.ts', '.css')):
            fpath = os.path.join(root, fname)
            changed = process_file(fpath)
            if changed:
                print(f"  Updated: {os.path.relpath(fpath, SRC_DIR)}")
                total_changed += 1

print(f"\nDone. {total_changed} files updated with new color palette.")
