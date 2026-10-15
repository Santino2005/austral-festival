import Image from "next/image";
import localFont from "next/font/local";
import { prisma } from "@/lib/prisma";
import { PurchaseForm } from "@/components/purchase/purchase-form";
import { VenueDialog } from "@/components/hero/venue-dialog";
import { EventCountdown } from "@/components/hero/event-countdown";
import { DrinksNoticeDialog } from "@/components/hero/drinks-notice-dialog";
import {
  DEFAULT_ALCOHOL_ALLOWANCE,
  DOORS_TEXT,
} from "@/lib/config";
import {
  getActiveTiersForEvent,
  getCurrentPresaleStage,
} from "@/lib/presale";
import {
  CalendarDays,
  ArrowDown,
  Clock3,
  Music,
  ShieldCheck,
  Ticket as TicketIcon,
  Wine,
} from "lucide-react";

export const dynamic = "force-dynamic";

const heroFont = localFont({
  src: "../public/fonts/playfair-display.ttf",
  weight: "400 900",
  style: "normal",
  display: "swap",
});

const formatPrice = (value: number) =>
  value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  });

function MinimalDivider() {
  return (
    <div
      aria-hidden
      className="mx-auto flex max-w-3xl items-center justify-center gap-4 px-6 py-6"
    >
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      <div className="flex items-center gap-2 text-amber-600/80">
        <span className="size-1 rotate-45 border border-amber-500/60" />
        <span className="size-1.5 rotate-45 border border-amber-500 bg-amber-500" />
        <span className="size-1 rotate-45 border border-amber-500/60" />
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
    </div>
  );
}

export default async function Home() {
  const event = await prisma.event.findFirst({
    include: {
      ticketTiers: { where: { isActive: true }, orderBy: { price: "asc" } },
    },
  });

  if (!event) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-28 text-center">
        <h1 className="text-2xl font-medium tracking-tight text-foreground">
          Evento no publicado todavía
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Volvé pronto, estamos preparando la próxima peña.
        </p>
      </div>
    );
  }

  const stage = getCurrentPresaleStage();
  const { tiers: activeTiers } = await getActiveTiersForEvent(
    event.id,
    event.ticketTiers
  );
  const eventDate = new Date(event.date);
  const tier = activeTiers.find((t) => t.ticketCount === 1) ?? activeTiers[0];
  const unitPrice = stage.individualPrice ?? tier?.price ?? 12000;

  const remaining = (t: { maxStock: number; soldCount: number }) =>
    Math.max(0, t.maxStock - t.soldCount);

  const dateLabel = eventDate.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="event-page bg-background text-foreground">
      <DrinksNoticeDialog />

      {/* Hero Section */}
      <section className="event-hero relative overflow-hidden border-b border-border">
        {/* Background Image: Warm cacao wash with acoustic folk warmth */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Image
            src="/folk-hero.jpg"
            alt="Fondo de peña folklórica con guitarras e instrumentos acústicos"
            fill
            priority
            sizes="100vw"
            className="event-hero-photo object-cover object-center contrast-105 brightness-95 saturate-110"
          />
          <div className="event-hero-wash absolute inset-0" />
          <div className="event-hero-vignette absolute inset-0" />
        </div>

        <div className="event-hero-content relative mx-auto text-center">
          {/* Tag / Pre-heading */}
          <div className="event-hero-tag inline-flex items-center gap-2.5 rounded-full border border-amber-400/30 bg-[#4A3726]/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-amber-300 shadow-sm">
            <Music className="size-3 text-amber-400" strokeWidth={1.5} />
            <span>Peña Folklórica · Universidad Austral</span>
          </div>

          {/* Main Headline */}
          <h1 className={`${heroFont.className} event-hero-title mx-auto mt-8 text-[#FBF3E3]`}>
            Una noche de folklore, baile, canto y amigos
          </h1>

          <p className="event-hero-address font-semibold uppercase text-amber-400">
            En Mariano Acosta 1611, Pilar
          </p>

          <p className="event-hero-description mx-auto mt-6 font-normal">
            {event.description}
          </p>

          <EventCountdown targetDate={event.date} />

          {/* Centered details dock - Row 1: Date, Doors, Venue. Row 2: Price & Preventa centered */}
          <div className="event-hero-details mx-auto mt-10 w-full max-w-4xl">
            {/* Fila 1: Día, Horarios y Ubicación en una sola fila */}
            <div className="event-facts grid grid-cols-1 divide-y divide-amber-400/20 border-y border-amber-400/20 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="event-fact flex items-center justify-center gap-2.5 text-[#FBF3E3]/90 text-center">
                <CalendarDays
                  className="size-4 text-amber-300 shrink-0"
                  strokeWidth={1.5}
                />
                <span>{dateLabel}</span>
              </div>
              <div className="event-fact flex items-center justify-center gap-2.5 text-[#FBF3E3]/90 text-center">
                <Clock3
                  className="size-4 text-amber-300 shrink-0"
                  strokeWidth={1.5}
                />
                <span>{DOORS_TEXT}</span>
              </div>
              <VenueDialog venue={event.venue} />
            </div>

            {/* Fila 2: Precio con texto de preventa y plazo (o venta en puerta si cerró) */}
            {stage.isClosed ? (
              <div className="flex items-center justify-center gap-3 px-6 pt-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300 leading-none">
                  <TicketIcon
                    className="text-amber-300 shrink-0"
                    strokeWidth={1.5}
                    height={20}
                    width={20}
                  />
                  <span>Entradas disponibles en puerta</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-6 pt-3">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300 leading-none">
                  <TicketIcon
                    className="text-amber-300 shrink-0"
                    strokeWidth={1.5}
                    height={20}
                    width={20}
                  />
                  <span>{stage.name} · {stage.shortDeadline}</span>
                </div>
                <span className="font-sans text-2xl font-bold tracking-tight sm:text-3xl leading-none text-[#FBF3E3]">
                  {formatPrice(unitPrice)}
                </span>
              </div>
            )}
          </div>
          <a href="#entradas" className="event-cta">
            {stage.isClosed ? "Información de entradas en puerta" : "Conseguí tu entrada"}{" "}
            <ArrowDown aria-hidden className="size-4" />
          </a>
        </div>
      </section>

      <MinimalDivider />

      {/* Tickets / Purchase Section */}
      <section id="entradas" className="event-tickets">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
              Entradas
            </p>
            <h2 className="event-section-title mt-2 text-foreground">
              {stage.isClosed ? "Entradas en puerta" : "Conseguí tu entrada hoy"}
            </h2>
            <p className="event-tickets-description mx-auto mt-4 font-normal">
              {stage.isClosed
                ? "La venta anticipada online ha finalizado. Las entradas se adquieren directamente en puerta el día del evento."
                : `Pagá con Mercado Pago y recibí tu QR por email al instante. Disponibles en ${stage.name} (${stage.deadlineLabel.toLowerCase()}). Una sola entrada con acceso completo: música en vivo, patio de comidas y la habilitación para comprar hasta ${DEFAULT_ALCOHOL_ALLOWANCE} bebidas con alcohol (exclusivo para mayores de 18 años).`}
            </p>
          </div>

          <PurchaseForm
            tiers={activeTiers.map((t) => ({
              id: t.id,
              name: t.name,
              price: t.price,
              ticketCount: t.ticketCount ?? 1,
              remaining: remaining(t),
            }))}
            stageName={stage.name}
            deadlineLabel={stage.deadlineLabel}
            shortDeadline={stage.shortDeadline}
            isClosed={stage.isClosed}
          />
        </div>
      </section>

      {/* Trust & Details: 3-column clean line-divided block */}
      <section className="event-trust border-y border-border">
        <div className="event-trust-content mx-auto">
          <div className="event-trust-grid grid divide-y divide-border overflow-hidden rounded-2xl border border-border sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
            <div className="flex flex-col items-center p-8 text-center sm:p-10">
              <div className="grid size-12 place-items-center rounded-2xl border border-amber-600/30 bg-amber-100/80 text-amber-700">
                <ShieldCheck
                  className="size-6 text-amber-700"
                  strokeWidth={1.5}
                />
              </div>
              <h3>
                Pago seguro
              </h3>
              <p className="mt-3 text-sm font-normal leading-relaxed text-muted-foreground">
                Procesado por Mercado Pago, con todos los medios de pago de
                Argentina.
              </p>
            </div>
            <div className="flex flex-col items-center p-8 text-center sm:p-10">
              <div className="grid size-12 place-items-center rounded-2xl border border-amber-600/30 bg-amber-100/80 text-amber-700">
                <TicketIcon
                  className="size-6 text-amber-700"
                  strokeWidth={1.5}
                />
              </div>
              <h3>
                QR al instante
              </h3>
              <p className="mt-3 text-sm font-normal leading-relaxed text-muted-foreground">
                Recibís tu código QR por email apenas confirmamos el pago.
                Presentá tu QR en la entrada.
              </p>
            </div>
            <div className="flex flex-col items-center p-8 text-center sm:p-10">
              <div className="grid size-12 place-items-center rounded-2xl border border-amber-600/30 bg-amber-100/80 text-amber-700">
                <Wine className="size-6 text-amber-700" strokeWidth={1.5} />
              </div>
              <h3>
                Hasta {DEFAULT_ALCOHOL_ALLOWANCE} bebidas
              </h3>
              <p className="mt-3 text-sm font-normal leading-relaxed text-muted-foreground">
                Cada entrada de mayor de 18 años habilita la posibilidad de hasta {DEFAULT_ALCOHOL_ALLOWANCE} consumiciones
                alcohólicas en la barra del evento. La compra y consumo de alcohol está permitida únicamente a mayores de 18 años.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
