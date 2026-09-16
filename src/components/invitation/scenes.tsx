"use client";

import { getVenueLines, weddingData } from "@/data/wedding";
import { CharText } from "./CharText";
import { MapLink } from "./MapLink";

export function IntroMessage() {
  return (
    <div className="scene scene-intro" data-scene="intro">
      <CharText className="kicker arabic-display" part="bismillah" text="بسم الله الرحمن الرحيم" />
      <CharText className="script-soft arabic-verse" part="verse" text="﴿وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ﴾" connected />
      <CharText className="verse-source arabic-display" part="source" text="الروم: ٢١" />
    </div>
  );
}

export function Families() {
  return (
    <div className="scene scene-families" data-scene="families">
      <CharText className="kicker arabic-display families-feeling" part="families-feeling" text="بكل مشاعر الفرح والسرور" />
      <CharText className="kicker arabic-display" part="families-title" text="يتشرف كلٌ من" />
      <div className="parents-stack">
        <div className="parent-name" data-part="father-one">
          <CharText className="parent-full-name arabic-display" text="الدكتور / محمد محروس زين الدين" connected />
        </div>
        <div className="ampersand" data-part="families-and" aria-label="و">
          <span className="amp-flourish ch" aria-hidden="true" />
          <span className="amp-mark ch">و</span>
          <span className="amp-flourish amp-flourish-end ch" aria-hidden="true" />
        </div>
        <div className="parent-name" data-part="father-two">
          <CharText className="parent-full-name arabic-display" text="الدكتور المهندس/ محمد عثمان ابراهيم" connected />
        </div>
      </div>
      <CharText className="kicker arabic-display families-invite" part="families-invite" text="بدعوتكم لحضور حفل زفاف" />
    </div>
  );
}

export function CoupleNames() {
  return (
    <div className="scene scene-names" data-scene="names">
      <div className="couple-stack">
        <div className="couple-person couple-person-large" data-part="groom">
          <CharText className="couple-label arabic-display" text="نجل الأول" />
          <CharText className="couple-title arabic-display" text="نقيب طبيب/" connected />
          <CharText className="script-name arabic-display" text="عبدالرحمن" connected />
        </div>
        <div className="ampersand" data-part="couple-and" aria-label="و">
          <span className="amp-flourish ch" aria-hidden="true" />
          <span className="amp-mark ch">على</span>
          <span className="amp-flourish amp-flourish-end ch" aria-hidden="true" />
        </div>
        <div className="couple-person couple-person-large" data-part="bride">
          <CharText className="couple-label arabic-display" text="كريمة الثاني" />
          <CharText className="couple-title arabic-display" text="المهندسة/" connected />
          <CharText className="script-name arabic-display" text="ريم" connected />
        </div>
      </div>
    </div>
  );
}

export function InvitationLine() {
  return (
    <div className="scene scene-invite" data-scene="invite">
      <CharText className="script-kindly arabic-script" part="invite-one" text="يسعدنا أن تشاركونا فرحتنا" connected />
      <CharText className="kicker arabic-display" part="invite-two" text="وتشريفكم يسعدنا" />
    </div>
  );
}

export function SaveTheDate() {
  return (
    <div className="scene scene-date" data-scene="date">
      <div className="save-date-content">
        <div className="save-stack">
          <CharText className="script-save arabic-script" part="save" text="الموعد" connected />
        </div>
        <div className="save-calendar" data-part="date" aria-label={weddingData.date}>
          <CharText className="save-month arabic-display" text="يوم الخميس" />
          <CharText className="save-year arabic-display" text="٢٢ اكتوبر ٢٠٢٦" />
        </div>
        <div className="date-time-composition">
          <CharText className="date-time-label arabic-script" part="time-title" text="الوقت" connected />
          <CharText className="date-time-line arabic-display" part="time-start" text={weddingData.time.starts} connected />
          <CharText className="date-time-line arabic-display" part="time-end" text={weddingData.time.ends} connected />
        </div>
      </div>
    </div>
  );
}

export function EventTime() {
  return (
    <div className="scene scene-time" data-scene="time">
      <CharText className="script-kindly arabic-script" part="time-title" text="الوقت" connected />
      <div className="event-time" data-part="time" aria-label={`${weddingData.time.starts} / ${weddingData.time.ends}`}>
        <CharText className="arabic-display" part="time-start" text={weddingData.time.starts} connected />
        <CharText className="arabic-display" part="time-end" text={weddingData.time.ends} connected />
      </div>
    </div>
  );
}

export function RSVP() {
  const { hotel, city } = getVenueLines();
  return (
    <div className="scene scene-rsvp" data-scene="rsvp">
      <CharText className="rsvp-title arabic-display" part="final-message" text="يسرنا حضوركم ومشاركتكم لنا هذه المناسبة السعيدة" />
      <div className="rsvp-contact">
        <CharText className="rsvp-meta rsvp-name arabic-display" part="rsvp-name" text={weddingData.venue} />
        <CharText className="rsvp-meta rsvp-place arabic-display" part="call" text={hotel} />
        {city ? <CharText className="rsvp-meta rsvp-city arabic-display" part="city" text={city} /> : null}
      </div>
      <MapLink className="rsvp-web rsvp-map" part="website" />
    </div>
  );
}
