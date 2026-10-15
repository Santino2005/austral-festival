"use client";

import { MapPin, ExternalLink, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  VENUE_ADDRESS,
  VENUE_MAPS_EMBED_URL,
  VENUE_MAPS_URL,
} from "@/lib/config";

export function VenueDialog({ venue }: { venue: string }) {
  return (
    <Dialog>
      <DialogTrigger
        className="event-fact event-venue group flex cursor-pointer items-center justify-center gap-2 text-[#FBF3E3]/90 transition-colors hover:bg-amber-400/10 hover:text-amber-300 text-center"
      >
        <MapPin className="size-4 text-amber-700 shrink-0" strokeWidth={1.5} />
        <span>{venue}</span>
        <span className="sm:hidden rounded-full border border-amber-400/30 bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
          Ver lugar
        </span>
      </DialogTrigger>
      <DialogContent className="event-venue-dialog sm:max-w-lg space-y-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="size-4 text-amber-700" strokeWidth={1.5} />
            ¿Cómo llegar?
          </DialogTitle>
          <DialogDescription className="text-sm">
            {VENUE_ADDRESS}
          </DialogDescription>
        </DialogHeader>

        {/* Aviso informativo de ingreso con bebidas */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-600/25 bg-[#FBF6EC] p-3.5 text-xs text-[#392B20]">
          <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-amber-500/15 text-amber-800">
            <Info className="size-4 text-amber-700" strokeWidth={1.75} />
          </div>
          <div className="space-y-1">
            <p className="font-semibold uppercase tracking-wider text-[11px] text-amber-900">
              Aviso sobre bebidas y gastronomía
            </p>
            <p className="text-muted-foreground leading-relaxed text-[11px]">
              Por disposición del predio, <strong>no está permitido ingresar con bebidas ni botellas desde el exterior</strong>. Dentro del evento contaremos con servicio de barra y patio de comidas propio (la compra de bebidas con alcohol está permitida únicamente a mayores de 18 años).
            </p>
          </div>
        </div>

        <div aria-hidden className="grid place-items-center overflow-hidden rounded-xl border border-border bg-[#EFE3C9]">
          <iframe
            src={VENUE_MAPS_EMBED_URL}
            title="Mapa de ubicación de la peña"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="pointer-events-none size-full min-h-64"
          />
        </div>
        <a
          href={VENUE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "cursor-pointer gap-2 rounded-lg border-amber-600/40 bg-amber-500/15 text-amber-800 hover:bg-amber-500/25"
          )}
        >
          <ExternalLink className="size-4" strokeWidth={1.5} />
          Abrir en Google Maps
        </a>
      </DialogContent>
    </Dialog>
  );
}
