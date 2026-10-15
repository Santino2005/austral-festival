import { getCurrentPresaleStage } from "./presale";

export const DEFAULT_ALCOHOL_ALLOWANCE = 3;

export const VENUE_ADDRESS = "Mariano Acosta 1611 · Pilar · Universidad Austral";
export const VENUE_MAPS_URL =
  "https://maps.app.goo.gl/bPzrpnsijTw9VMCr9";
export const VENUE_MAPS_EMBED_URL =
  "https://maps.google.com/maps?q=Universidad%20Austral%20Campus%20Pilar%20Argentina&z=15&output=embed";
export const DOORS_TEXT = "Ingresos: 20:00 hs · 22:00 hs";
export const PREVENTA_LABEL = getCurrentPresaleStage().name;

export const REMINDER_1_DELAY_MS =
  Number(process.env.REMINDER_1_DELAY_MS) || 1 * 60 * 60 * 1000;
export const REMINDER_2_DELAY_MS =
  Number(process.env.REMINDER_2_DELAY_MS) || 24 * 60 * 60 * 1000;
export const PURCHASE_EXPIRY_MS =
  Number(process.env.PURCHASE_EXPIRY_MS) || 48 * 60 * 60 * 1000;
export const MAX_PAYMENT_REMINDERS = 2;
