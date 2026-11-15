"""Author original editable shapes for the first SOKON VFX review pack."""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FPS = 24


def write_json(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


class Effect:
    def __init__(self, name, frames, event, strength, pivot=(192, 192)):
        self.name, self.frames, self.event, self.strength = name, frames, event, strength
        self.pivot = pivot
        self.steps, self.layers = [], []
        self.command("comp.new", name=name, width=384, height=384, frameRate=FPS, duration=frames/FPS)

    def command(self, command, **params):
        self.steps.append(dict(command=command, params=params))

    def shape(self, name, points, fill, role, position=None, tangents=None):
        self.command("layer.newShape", kind="none", name=name, position=position or self.pivot)
        params = dict(layer=name, vertices=points, closed=True, space="layer", fill=fill, stroke=False)
        if tangents:
            params.update(inTangents=tangents[0], outTangents=tangents[1])
        self.command("shape.newPath", **params)
        self.layers.append(dict(name=name, role=role, plane="ground" if self.event=="landing" else "character_plane"))

    def keys(self, name, prop, keys):
        for frame, value in keys:
            self.command("prop.addKey", layer=name, path="transform/"+prop, time=frame/FPS, value=value)

    def finish(self, description, palette, peak=1):
        slug = "sokon-"+self.name
        write_json(ROOT/"recipes"/(slug+".json"), self.steps)
        b = json.loads((ROOT/"recipes/briefs/hit-heavy.json").read_text())
        b.update(id=slug, status="wip")
        b["gameplay"].update(event=self.event, strength=self.strength, hitbox_reference="SOKON contact event; engine binding pending",
                             direction="outward_from_contact" if self.event=="hit" else "outward_from_guard" if self.event=="guard" else "along_ground",
                             hitstop_policy="pause_vfx_with_game")
        b["render"].update(width=384, height=384, frames=self.frames, pivot=list(self.pivot))
        b["timing"] = dict(contact=0, peak=peak, breakup=3, settle=self.frames-4, clear=self.frames-1)
        b["art"].update(silhouette_goal=description, direction_goal=b["gameplay"]["direction"], palette=palette, layers=self.layers)
        b["camera"]["projection"] = "three_quarter" if self.event=="guard" else "side"
        b["verification"].update(evidence=[], known_limitations=["Gameplay placement, hit-stop and occlusion pending.", "Flattened atlas per effect."], review_status="wip")
        write_json(ROOT/"recipes/briefs"/(slug+".json"),b)
        write_json(ROOT/"recipes"/(slug+".brief.json"),dict(
            lesson="Para o próximo impacto, compare no jogo uma cauda mais curta antes de adicionar glow.",
            principle="Primeiro, a forma e o ritmo",
            decision=description+" Short tail, separate animated shapes and explicit clear frame.",
            required_commands=["shape.newPath","prop.addKey"], margin=18, allowed_empty=[self.frames-1]))


def impact(name, frames, outline, count, reach):
    effect = Effect(name, frames, "hit", name.split("-")[-1])
    for label, color, factor in [("Body","#ff7518",1),("Heat","#ffc72e",.69),("Core","#fffef5",.40)]:
        # Separate outlines reduce the uniform nested-star appearance.
        points = [[x*factor*(.92 if i%3==0 else 1), y*factor] for i,(x,y) in enumerate(outline)]
        effect.shape(label, points, color, label.lower())
        effect.keys(label,"scale",[(0,[27,32]),(1,[100,100]),(2,[106,94]),(4,[55,48]),(frames-3,[0,0])])
        effect.keys(label,"opacity",[(0,100),(3,100),(frames-3,0),(frames-1,0)])
    for i in range(count):
        angle = math.radians(i*360/count+13+(i%3)*9)
        cs,sn = math.cos(angle),math.sin(angle)
        length = 9+(i%4)*3
        def point(x,y):
            return [round(x*cs-y*sn,3),round(x*sn+y*cs,3)]
        label = "Shard-%02d"%i
        effect.shape(label,[point(-length,1),point(5,-2),point(length*.6,-1),point(0,3)],"#ffe05a","debris")
        positions = [(0,10),(2,reach*.55),(4,reach*.86),(frames-2,reach)]
        effect.keys(label,"position",[(f,[192+v for v in point(r,0)]) for f,r in positions])
        effect.keys(label,"scale",[(0,[0,0]),(1,[75,70]),(3,[100,100]),(frames-3,[42,45]),(frames-1,[0,0])])
        effect.keys(label,"opacity",[(0,0),(1,100),(frames-4,95),(frames-1,0)])
    effect.finish("White contact core, orange irregular mass, yellow directional fragments; distinct silhouette and debris count.",["#FFFEF5","#FF7518","#FFC72E","#FFE05A"])


def guard():
    e=Effect("guard",10,"guard","medium",pivot=(170,192))
    # Open crescent of compressed air, angled in 3/4, with a broken trailing edge.
    points=[[-8,-58],[18,-53],[43,-33],[52,-7],[48,20],[29,48],[8,61],
            [22,39],[31,12],[28,-14],[15,-34],[-8,-45]]
    e.shape("Pressure-edge",points,"#80bfdf","pressure")
    e.shape("Pressure-hot",[[x*.82,y*.85] for x,y in points],"#e8faff","highlight")
    for name in ["Pressure-edge","Pressure-hot"]:
        e.keys(name,"scale",[(0,[18,55]),(1,[65,87]),(2,[100,100]),(5,[123,90]),(8,[140,60]),(9,[0,0])])
        e.keys(name,"position",[(0,[170,192]),(3,[183,192]),(8,[207,192])])
        e.keys(name,"opacity",[(0,95),(3,100),(7,40),(9,0)])
    for i,(x,y) in enumerate([(35,-70),(58,-44),(68,-8),(61,43),(30,72)]):
        name="Air-spray-%d"%i
        e.shape(name,[[-9,1],[5,-2],[11,0],[-4,3]],"#d8f5ff","spray")
        e.keys(name,"position",[(0,[170,192]),(3,[170+x,192+y]),(8,[170+x*1.5,192+y*1.15])])
        e.keys(name,"scale",[(0,[0,0]),(2,[95,85]),(7,[45,30]),(9,[0,0])])
        e.keys(name,"opacity",[(0,0),(2,90),(5,75),(9,0)])
    e.finish("Compressed crescent opens outward in 3/4 with separated air spray and open center.",["#80BFDF","#E8FAFF","#D8F5FF"],peak=2)


def landing():
    e=Effect("landing",14,"landing","medium",pivot=(192,304))
    # Rounded irregular puffs stay above their local ground. Bezier tangent handles preserve editability.
    points=[[-24,0],[-31,-12],[-21,-25],[-10,-23],[-4,-40],[13,-44],[27,-30],[26,-14],[35,-10],[29,0]]
    tangents=([[-8,0],[0,7],[-6,0],[-4,-1],[-6,4],[-6,-2],[-2,-8],[2,-3],[0,-5],[6,0]],
              [[8,0],[0,-7],[6,0],[4,1],[6,-4],[6,2],[2,8],[-2,3],[0,5],[-6,0]])
    for i,(side,travel,size) in enumerate([(-1,115,1.1),(1,112,1),(-1,69,.80),(1,67,.85),(-1,25,.7),(1,26,.65)]):
        for label,color,factor in [("Shadow","#8c929f",1),("Light","#d1d3d8",.84)]:
            name="%s-%d"%(label,i)
            e.shape(name,[[x*size*factor,y*size*factor] for x,y in points],color,"smoke",tangents=tuple([[[x*size*factor,y*size*factor] for x,y in handles] for handles in tangents]))
            e.keys(name,"position",[(0,[192+side*6,304]),(3,[192+side*travel*.50,302]),(7,[192+side*travel*.86,297]),(13,[192+side*travel,292])])
            e.keys(name,"scale",[(0,[16,15]),(2,[66,60]),(5,[105,105]),(9,[112,116]),(13,[120,122])])
            e.keys(name,"opacity",[(0,85),(3,90),(7,68),(10,28),(13,0)])
    e.finish("Paired irregular curved dust puffs roll apart above ground, rise gently and dissolve.",["#8C929F","#D1D3D8"],peak=2)


def main():
    impact("hit-light",8,[[-59,12],[-20,-3],[-29,-22],[-6,-13],[8,-45],[14,-12],[50,-21],[23,0],[60,8],[18,13],[24,36],[0,20],[-18,38],[-14,12]],4,82)
    impact("hit-medium",10,[[-80,15],[-34,-1],[-51,-31],[-11,-19],[-2,-64],[13,-27],[39,-49],[27,-12],[90,-30],[46,0],[82,19],[22,21],[35,61],[3,35],[-20,63],[-17,23],[-61,39],[-35,13]],7,112)
    impact("hit-heavy",12,[[-106,26],[-48,-3],[-66,-31],[-22,-22],[-33,-82],[-5,-44],[11,-108],[21,-49],[56,-78],[36,-25],[101,-42],[64,-7],[119,7],[61,20],[82,61],[28,39],[26,93],[0,51],[-35,83],[-27,36],[-77,54],[-43,22]],11,143)
    guard()
    landing()


if __name__=="__main__":
    main()
