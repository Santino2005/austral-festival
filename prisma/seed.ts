import { PrismaClient } from "@prisma/client";
import { VENUE_ADDRESS } from "../lib/config";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed para producción...");

  let event = await prisma.event.findFirst();

  if (!event) {
    event = await prisma.event.create({
      data: {

        name: "Peña Austral 2026",
        description:
          "Una noche de folklore, baile y tradición argentina organizada por la Universidad Austral. Te esperamos para cantar, bailar y compartir.",
        date: new Date("2026-11-20T23:00:00.000Z"),
        venue: VENUE_ADDRESS,
      },
    });
    console.log(`✅ Evento creado: ${event.name} (${event.id})`);
  } else {
    console.log(`ℹ️ Evento ya existente: ${event.name} (${event.id})`);
  }

  // Preventa 1 ($12.000)
  let p1Tier = await prisma.ticketTier.findFirst({
    where: { eventId: event.id, name: "Preventa 1" },
  });
  if (!p1Tier) {
    p1Tier = await prisma.ticketTier.create({
      data: {
        eventId: event.id,
        name: "Preventa 1",
        price: 12000,
        ticketCount: 1,
        maxStock: 300,
        isActive: true,
      },
    });
    console.log(`✅ TicketTier creado: ${p1Tier.name} ($${p1Tier.price}, stock: ${p1Tier.maxStock})`);
  } else {
    console.log(`ℹ️ TicketTier ya existente: ${p1Tier.name} ($${p1Tier.price})`);
  }

  // Pack Familiar Preventa 1 ($60.000 = 6 entradas)
  let p1Pack = await prisma.ticketTier.findFirst({
    where: { eventId: event.id, ticketCount: 6, price: 60000 },
  });
  if (!p1Pack) {
    p1Pack = await prisma.ticketTier.create({
      data: {
        eventId: event.id,
        name: "Pack Familiar",
        price: 60000,
        ticketCount: 6,
        maxStock: 50,
        isActive: true,
      },
    });
    console.log(`✅ TicketTier creado: ${p1Pack.name} ($${p1Pack.price}, stock: ${p1Pack.maxStock})`);
  } else {
    console.log(`ℹ️ Pack Familiar ya existente: ${p1Pack.name} ($${p1Pack.price})`);
  }

  // Preventa 2 ($14.000)
  let p2Tier = await prisma.ticketTier.findFirst({
    where: { eventId: event.id, name: "Preventa 2" },
  });
  if (!p2Tier) {
    p2Tier = await prisma.ticketTier.create({
      data: {
        eventId: event.id,
        name: "Preventa 2",
        price: 14000,
        ticketCount: 1,
        maxStock: 300,
        isActive: true,
      },
    });
    console.log(`✅ TicketTier creado: ${p2Tier.name} ($${p2Tier.price}, stock: ${p2Tier.maxStock})`);
  } else {
    console.log(`ℹ️ TicketTier ya existente: ${p2Tier.name} ($${p2Tier.price})`);
  }

  // Pack Familiar Preventa 2 ($70.000 = 6 entradas)
  let p2Pack = await prisma.ticketTier.findFirst({
    where: { eventId: event.id, ticketCount: 6, price: 70000 },
  });
  if (!p2Pack) {
    p2Pack = await prisma.ticketTier.create({
      data: {
        eventId: event.id,
        name: "Pack Familiar (Preventa 2)",
        price: 70000,
        ticketCount: 6,
        maxStock: 50,
        isActive: true,
      },
    });
    console.log(`✅ TicketTier creado: ${p2Pack.name} ($${p2Pack.price}, stock: ${p2Pack.maxStock})`);
  } else {
    console.log(`ℹ️ Pack Familiar Preventa 2 ya existente: ${p2Pack.name} ($${p2Pack.price})`);
  }
  console.log("🏁 Seed completado con éxito.");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
