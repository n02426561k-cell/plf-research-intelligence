#!/usr/bin/env python3
"""Mop-up pass: fix remaining emerald references."""
import os, re

SRC_DIR = os.path.join(os.path.dirname(__file__), "src")

REPLACEMENTS = [
    # Spinner/loading rings
    ("border-emerald-500 border-t-transparent", "border-forest-500 border-t-transparent"),
    ("border-4 border-emerald-500", "border-4 border-forest-500"),

    # Text in what-is-plf
    ("text-emerald-950 dark:text-emerald-200", "text-forest-800 dark:text-sand-200"),
    ("text-emerald-950", "text-forest-800"),
    ("text-emerald-200", "text-sand-200"),
    ("hover:text-emerald-900 dark:hover:text-emerald-200", "hover:text-forest-800 dark:hover:text-sand-200"),
    ("hover:text-emerald-900", "hover:text-forest-800"),
    ("text-emerald-800 dark:text-forest-400", "text-forest-800 dark:text-forest-400"),
    ("text-emerald-900 dark:text-sand-300", "text-forest-800 dark:text-sand-300"),
    ("text-emerald-900", "text-forest-800"),

    # History page gradient
    ("from-emerald-500/10 to-forest-500/10", "from-forest-700/8 to-burgundy-700/8"),
    ("from-emerald-500/10", "from-forest-700/8"),

    # Research landscape progress bars
    ("from-emerald-500 to-teal-600", "from-forest-500 to-forest-700"),
    ("from-emerald-500 to-forest-500", "from-forest-500 to-forest-700"),
    ("from-emerald-500", "from-forest-500"),

    # Regional PLF dark section
    ("from-emerald-950 to-slate-900", "from-forest-900 to-forest-800"),

    # Methodology bg
    ("dark:bg-emerald-950/30", "dark:bg-forest-800/20"),
    ("bg-emerald-950/30", "bg-forest-800/20"),

    # Border in existing-systems / regional-plf
    ("dark:border-emerald-900/40", "dark:border-forest-700/30"),
    ("dark:border-emerald-900/60", "dark:border-forest-700/40"),

    # ResearchAssistantWidget
    ("from-emerald-600 to-teal-700", "from-forest-700 to-burgundy-700"),
    ("text-emerald-100", "text-sand-200"),

    # Remaining rose/indigo strays
    ("rose-600", "burgundy-700"),
    ("indigo-600", "burgundy-700"),

    # globals.css aliases are fine — they are intentional legacy class names
]

total_changed = 0
for root, dirs, files in os.walk(SRC_DIR):
    for fname in files:
        if fname.endswith(('.tsx', '.ts', '.css')):
            fpath = os.path.join(root, fname)
            content = open(fpath, encoding='utf-8', errors='ignore').read()
            original = content
            for old, new in REPLACEMENTS:
                content = content.replace(old, new)
            if content != original:
                with open(fpath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"  Updated: {os.path.relpath(fpath, SRC_DIR)}")
                total_changed += 1

print(f"\nMop-up done. {total_changed} files updated.")
