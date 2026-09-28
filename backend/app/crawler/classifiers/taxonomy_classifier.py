import re
from typing import List, Dict, Set
from sqlalchemy.orm import Session
from app.database.models import Technology, Species, Application, TaxonomyTerm

class TaxonomyClassifier:
    """
    Automatic multi-axis classifier matching literature text against
    the database-backed taxonomy dictionary and entity catalogs.
    """
    @staticmethod
    def classify_text(db: Session, title: str, abstract: str = "") -> Dict[str, List[str]]:
        combined_text = f"{title} {abstract}".lower()
        
        matched_technologies: Set[str] = set()
        matched_species: Set[str] = set()
        matched_applications: Set[str] = set()
        matched_regions: Set[str] = set()

        # 1. Match against Species
        species_keywords = {
            "dairy-cattle": [r"\bdairy\b", r"\bcow\b", r"\bcows\b", r"\bholstein\b", r"\bmilking\b", r"\bbovine\b"],
            "beef-cattle": [r"\bbeef\b", r"\bfeedlot\b", r"\brange\s+cattle\b", r"\bsteer\b", r"\bheifer\b", r"\bangus\b", r"\bcalves\b"],
            "pigs": [r"\bpig\b", r"\bpigs\b", r"\bswine\b", r"\bsow\b", r"\bsows\b", r"\bpiglet\b", r"\bporcine\b", r"\bboar\b"],
            "poultry": [r"\bpoultry\b", r"\bbroiler\b", r"\bbroilers\b", r"\blayer\b", r"\bchicken\b", r"\bchickens\b", r"\bflock\b", r"\bavian\b"],
            "sheep": [r"\bsheep\b", r"\bewe\b", r"\bewes\b", r"\blamb\b", r"\blambs\b", r"\bovine\b", r"\bfleece\b"],
            "goats": [r"\bgoat\b", r"\bgoats\b", r"\bcaprine\b", r"\bkid\b", r"\bdoe\b"],
            "horses": [r"\bhorse\b", r"\bhorses\b", r"\bequine\b", r"\bfoal\b", r"\bcolt\b"],
            "aquaculture": [r"\bfish\b", r"\bsalmon\b", r"\btilapia\b", r"\baquaculture\b", r"\bsea\s+cage\b"]
        }
        for sp_id, patterns in species_keywords.items():
            for p in patterns:
                if re.search(p, combined_text, re.IGNORECASE):
                    matched_species.add(sp_id)
                    break

        # 2. Match against Technologies
        tech_keywords = {
            "computer-vision": [r"\bcomputer\s+vision\b", r"\bcamera\b", r"\brgb\b", r"\bdepth\b", r"\bimage\b", r"\boptical\b", r"\byolo\b", r"\bpoint\s+cloud\b"],
            "accelerometers": [r"\bacceleromet\w*\b", r"\bwearable\b", r"\bcollar\b", r"\bpedomet\w*\b", r"\bimu\b", r"\bactivity\s+sensor\b"],
            "rfid": [r"\brfid\b", r"\belectronic\s+identification\b", r"\beid\b", r"\btransponder\b", r"\biso\s+11784\b"],
            "thermal-imaging": [r"\bthermal\b", r"\bthermograph\w*\b", r"\birt\b", r"\binfrared\b"],
            "acoustic-monitoring": [r"\bacoustic\b", r"\bmicrophone\b", r"\bsound\b", r"\bvocalis\w*\b", r"\bvocaliz\w*\b", r"\bcough\b", r"\baudio\b"],
            "environmental-sensors": [r"\bammonia\b", r"\bnh3\b", r"\bco2\b", r"\bch4\b", r"\bmicroclimate\b", r"\bhumidity\b", r"\bthi\b"],
            "gps-location": [r"\bgps\b", r"\bgnss\b", r"\blocation\b", r"\btracking\b", r"\bvirtual\s+fenc\w*\b", r"\buwb\b", r"\brange\b"],
            "robotic-milking-feeding": [r"\brobotic\s+milking\b", r"\bautomatic\s+milking\b", r"\bams\b", r"\bautomated\s+feeder\b", r"\bfeed\s+pusher\b"]
        }
        for t_id, patterns in tech_keywords.items():
            for p in patterns:
                if re.search(p, combined_text, re.IGNORECASE):
                    matched_technologies.add(t_id)
                    break

        # 3. Match against Applications
        app_keywords = {
            "lameness-detection": [r"\blameness\b", r"\bgait\b", r"\blocamotion\b", r"\blocomet\w*\b", r"\bclaw\b", r"\bhoof\b", r"\blimb\b"],
            "mastitis-early-warning": [r"\bmastitis\b", r"\budder\b", r"\belectrical\s+conductivity\b", r"\bscc\b", r"\bsomatic\s+cell\b"],
            "estrus-ovulation-detection": [r"\bestrus\b", r"\boestrus\b", r"\bheat\s+detection\b", r"\bovulation\b", r"\binsemination\b"],
            "respiratory-cough-monitoring": [r"\brespiratory\b", r"\bcough\b", r"\bprdc\b", r"\blung\b", r"\bpneumonia\b"],
            "body-condition-scoring": [r"\bbody\s+condition\b", r"\bbcs\b", r"\bfat\s+reserve\b", r"\bconformation\b"],
            "methane-emission-quantification": [r"\bmethane\b", r"\benteric\b", r"\bemission\b", r"\bgreenhouse\s+gas\b", r"\bgreenfeed\b"],
            "calving-farrowing-prediction": [r"\bcalving\b", r"\bfarrowing\b", r"\bparturition\b", r"\bbirth\b", r"\bdystocia\b"],
            "virtual-fencing-pasture": [r"\bvirtual\s+fence\b", r"\bvirtual\s+fencing\b", r"\bpaddock\b", r"\bstrip\s+grazing\b"]
        }
        for a_id, patterns in app_keywords.items():
            for p in patterns:
                if re.search(p, combined_text, re.IGNORECASE):
                    matched_applications.add(a_id)
                    break

        # 4. Regional Classification
        if re.search(r"\b(africa|zimbabwe|kenya|south\s+africa|pastoral|tropical|sub-saharan)\b", combined_text, re.IGNORECASE):
            matched_regions.add("Sub-Saharan Africa")
        elif re.search(r"\b(netherlands|belgium|germany|uk|france|europe|ireland|denmark)\b", combined_text, re.IGNORECASE):
            matched_regions.add("Europe")
        elif re.search(r"\b(usa|united\s+states|canada|north\s+america)\b", combined_text, re.IGNORECASE):
            matched_regions.add("North America")
        elif re.search(r"\b(australia|new\s+zealand|oceania)\b", combined_text, re.IGNORECASE):
            matched_regions.add("Oceania")
        else:
            matched_regions.add("Global")

        return {
            "species": list(matched_species),
            "technologies": list(matched_technologies),
            "applications": list(matched_applications),
            "regions": list(matched_regions)
        }
