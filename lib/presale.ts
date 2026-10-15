import { prisma } from "./prisma";

export type PresaleStageId = "preventa_1" | "preventa_2" | "door_only";

export interface PresaleStageConfig {
  id: PresaleStageId;
  name: string;
  individualPrice: number | null;
  packPrice: number | null;
  endDate: Date | null;
  deadlineLabel: string;
  shortDeadline: string;
  isClosed: boolean;
}

// Fechas límite en hora de Argentina (UTC-3)
// Preventa 1 finaliza el 4/11 a las 23:59:59.999
export const PREVENTA_1_END = new Date("2026-11-04T23:59:59.999-03:00");

// Preventa 2 finaliza el 18/11 a las 23:59:59.999
export const PREVENTA_2_END = new Date("2026-11-18T23:59:59.999-03:00");

// El jueves 19/11 a las 00:00:00 se deshabilita la compra online y pasa a venta en puerta
export const ONLINE_SALE_CLOSE = new Date("2026-11-19T00:00:00.000-03:00");

export function getCurrentPresaleStage(now = new Date()): PresaleStageConfig {
  if (now <= PREVENTA_1_END) {
    return {
      id: "preventa_1",
      name: "Preventa 1",
      individualPrice: 12000,
      packPrice: 60000, // 6 entradas al valor de 5 (5 * 12000)
      endDate: PREVENTA_1_END,
      deadlineLabel: "Disponible hasta el 4 de noviembre",
      shortDeadline: "Hasta el 4/11",
      isClosed: false,
    };
  }

  if (now <= PREVENTA_2_END) {
    return {
      id: "preventa_2",
      name: "Preventa 2",
      individualPrice: 14000,
      packPrice: 70000, // 6 entradas al valor de 5 (5 * 14000)
      endDate: PREVENTA_2_END,
      deadlineLabel: "Disponible hasta el 18 de noviembre",
      shortDeadline: "Hasta el 18/11",
      isClosed: false,
    };
  }

  return {
    id: "door_only",
    name: "Venta en puerta",
    individualPrice: null,
    packPrice: null,
    endDate: null,
    deadlineLabel: "Venta online finalizada · Entradas en puerta",
    shortDeadline: "En puerta",
    isClosed: true,
  };
}

export function isOnlinePurchaseOpen(now = new Date()): boolean {
  return !getCurrentPresaleStage(now).isClosed;
}

export interface TierLike {
  id: string;
  name: string;
  price: number;
  ticketCount: number;
  maxStock: number;
  soldCount: number;
  isActive: boolean;
}

export async function getActiveTiersForEvent(
  eventId: string,
  existingTiers: TierLike[] = [],
  now = new Date()
): Promise<{
  stage: PresaleStageConfig;
  tiers: TierLike[];
}> {
  const stage = getCurrentPresaleStage(now);

  if (stage.isClosed || stage.individualPrice === null || stage.packPrice === null) {
    return {
      stage,
      tiers: [],
    };
  }

  // Buscar en los tiers cargados en memoria
  let individualTier = existingTiers.find(
    (t) => t.ticketCount === 1 && t.price === stage.individualPrice && t.isActive
  );

  if (!individualTier) {
    const fromDb = await prisma.ticketTier.findFirst({
      where: {
        eventId,
        ticketCount: 1,
        price: stage.individualPrice,
        isActive: true,
      },
    });

    if (fromDb) {
      individualTier = fromDb;
    } else {
      individualTier = await prisma.ticketTier.create({
        data: {
          eventId,
          name: stage.name,
          price: stage.individualPrice,
          ticketCount: 1,
          maxStock: 300,
          isActive: true,
        },
      });
    }
  }

  // Buscar pack familiar (ticketCount === 6)
  let packTier = existingTiers.find(
    (t) => t.ticketCount === 6 && t.price === stage.packPrice && t.isActive
  );

  if (!packTier) {
    const fromDb = await prisma.ticketTier.findFirst({
      where: {
        eventId,
        ticketCount: 6,
        price: stage.packPrice,
        isActive: true,
      },
    });

    if (fromDb) {
      packTier = fromDb;
    } else {
      packTier = await prisma.ticketTier.create({
        data: {
          eventId,
          name: `Pack Familiar (${stage.name})`,
          price: stage.packPrice,
          ticketCount: 6,
          maxStock: 50,
          isActive: true,
        },
      });
    }
  }

  return {
    stage,
    tiers: [individualTier, packTier],
  };
}
