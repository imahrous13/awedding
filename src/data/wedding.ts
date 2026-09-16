export const weddingData = {
  bride: "ريم",
  groom: "عبدالرحمن",
  date: "يوم الخميس ٢٢ اكتوبر ٢٠٢٦",
  dateISO: "2026-10-22T16:00:00+03:00",
  time: {
    starts: "يبدأ من ٤ مساء",
    ends: "وينتهي في ٧ مساء",
  },
  venue: "قاعة مدار",
  address: "فندق توليب جاردنز - مدينة نصر اول طريق السويس",
  mapsUrl: "https://maps.app.goo.gl/PtSq6tPKaHNRY62D7?g_st=ic",
  rsvpName: "",
  rsvpPhone: "",
  rsvpDeadline: "",
  website: "",
  initials: "عر",
} as const;

export type WeddingData = typeof weddingData;

export function getInitials(data: WeddingData = weddingData) {
  if (data.initials?.length >= 2) {
    return {
      first: data.initials[0],
      second: data.initials[1],
    };
  }

  return {
    first: data.bride.charAt(0),
    second: data.groom.charAt(0),
  };
}

export function getVenueLines(data: WeddingData = weddingData) {
  const [hotel, city = ""] = data.address.split(",").map((part) => part.trim());
  return { hotel, city };
}
