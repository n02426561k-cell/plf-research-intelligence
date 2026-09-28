import sqlite3
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('plf_research.db')
cur = conn.cursor()
cur.execute("SELECT id, title, geographic_region, venue_name FROM documents WHERE geographic_region = 'Sub-Saharan Africa' OR title LIKE '%africa%' OR abstract LIKE '%africa%'")
rows = cur.fetchall()
print(f"Total Africa papers found: {len(rows)}")
for r in rows:
    safe_title = r[1].encode('ascii', 'replace').decode('ascii')
    print(f"ID: {r[0]} | Region: {r[2]} | Title: {safe_title[:65]}...")
conn.close()
