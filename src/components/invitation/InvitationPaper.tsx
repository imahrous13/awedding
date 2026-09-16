import { asset } from "@/lib/assets";
import { CoupleNames, Families, IntroMessage, InvitationLine, RSVP, SaveTheDate } from "./scenes";
import { WritingPen } from "./WritingPen";

const STEMS = ["a", "b", "c", "d", "e"] as const;

export function InvitationPaper() {
  return (
    <div className="paper" data-layer="paper">
      <div className="paper-texture" />
      <div className="paper-flora" data-flora="pampas" aria-hidden="true">
        {STEMS.map((id) => (
          <img
            key={id}
            data-stem={id}
            src={asset(`/textures/pampas-${id}.png`)}
            alt=""
            draggable={false}
          />
        ))}
        <img
          data-stem="full"
          src={asset("/textures/pampas-full.png")}
          alt=""
          draggable={false}
        />
      </div>
      <div className="paper-wash" />
      <div className="paper-vignette" />
      <WritingPen />
      <IntroMessage />
      <Families />
      <CoupleNames />
      <InvitationLine />
      <SaveTheDate />
      <RSVP />
    </div>
  );
}
