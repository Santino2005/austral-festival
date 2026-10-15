"use client";

import { useState } from "react";
import { Info, Wine, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DrinksNoticeDialog() {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="event-venue-dialog sm:max-w-md p-6 border border-border shadow-2xl">
        <DialogHeader className="text-center sm:text-center space-y-2.5">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-800 shadow-xs">
            <Info className="size-6 text-amber-700" strokeWidth={1.75} />
          </div>
          <DialogTitle className="font-serif text-2xl font-bold uppercase tracking-wide text-foreground">
            Aviso importante
          </DialogTitle>
          <DialogDescription className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
            Peña Folklórica · Universidad Austral
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-amber-600/25 bg-[#FBF6EC] p-4 text-xs text-[#392B20] space-y-3">
          <div className="flex items-start gap-2.5">
            <Wine className="size-4 text-amber-700 shrink-0 mt-0.5" strokeWidth={1.5} />
            <p className="leading-relaxed text-xs">
              Por disposición del predio y seguridad de todos, <strong>no está permitido el ingreso con bebidas ni botellas desde el exterior</strong>.
            </p>
          </div>
          <div className="flex items-start gap-2.5 border-t border-amber-600/15 pt-2.5">
            <Sparkles className="size-4 text-amber-700 shrink-0 mt-0.5" strokeWidth={1.5} />
            <p className="text-muted-foreground leading-relaxed text-[11px]">
              La peña contará con servicio completo de barra y patio gastronómico. La compra y consumo de bebidas con alcohol está permitida únicamente a mayores de 18 años.
            </p>
          </div>
        </div>

        <DialogFooter className="sm:justify-center mt-1">
          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full cursor-pointer gap-2 rounded-lg bg-[#79552C] hover:bg-[#634321] text-[#FFF8EC] font-semibold py-2.5 text-sm transition-colors"
          >
            Entendido, ¡muchas gracias!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
