
"use client";

import { useRef, useState } from "react";

type Props = {
  udhetimId: string;
};

type Kerkesa = {
  id: string;
  statusi: string;
};

export default function KerkesaForm({ udhetimId }: Props) {
  const [kerkesa, setKerkesa] = useState<Kerkesa | null>(null);
  const [dukeDerguar, setDukeDerguar] = useState(false);
  const [gabimi, setGabimi] = useState("");

  const pendingRef = useRef(false);

  async function dergoKerkesen() {
    if (pendingRef.current || kerkesa) return;

    pendingRef.current = true;
    setDukeDerguar(true);
    setGabimi("");

    try {
      const response = await fetch("/api/kerkesat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ udhetimId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kerkesa deshtoi.");
      }

      setKerkesa(data.kerkesa);
    } catch (error) {
      setGabimi(
        error instanceof Error ? error.message : "Gabim ne server."
      );
    } finally {
      pendingRef.current = false;
      setDukeDerguar(false);
    }
  }

  return (
    <section>
      <h2>Kerkesa per udhetim</h2>

      <p>
        Statusi:{" "}
        {kerkesa?.statusi === "pranuar"
          ? "U pranua"
          : kerkesa?.statusi === "ne_pritje"
            ? "Ne pritje"
            : "Pa kerkese"}
      </p>

      <button
        type="button"
        className="action"
        onClick={dergoKerkesen}
        disabled={dukeDerguar || kerkesa !== null}
      >
        {dukeDerguar ? "Po dergohet..." : kerkesa
            ? "Kerkesa u dergua"
            : "Kerko nje vend"}
      </button>

      {gabimi && <p role="alert">{gabimi}</p>}

      {kerkesa && (
        <p role="status">
          Kerkesa u ruajt ne server.
        </p>
      )}
    </section>
  );
}
