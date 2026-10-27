const FIRST_SLOT_MINUTES = 8 * 60;
const SLOT_MINUTES = 30;
/** 08:00 to 22:00 inclusive. */
export const LEAD_TIME_SLOT_COUNT = 29;

const pad = (value: number): string => String(value).padStart(2, "0");

/** "08:00", "08:30", ... "22:00". */
export const timeLabels = (): string[] =>
  Array.from({ length: LEAD_TIME_SLOT_COUNT }, (_, slot) => {
    const minutes = FIRST_SLOT_MINUTES + slot * SLOT_MINUTES;
    return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
  });
