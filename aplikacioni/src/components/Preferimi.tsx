
"use client";

import { useEffect, useState } from "react";

type Props = {
  udhetimId: string;
};

export default function Preferimi({ udhetimId }: Props) {
  const [ruajtur, setRuajtur] = useState(false);
  const [numri, setNumri] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dukeRuajtur, setDukeRuajtur] = useState(false);
  const [mesazhi, setMesazhi] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function lexoPreferimet() {
      try {
        const response = await fetch("/api/preferimet", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) throw new Error();

        const data = await response.json();
        const ids: string[] = data.udhetimet;

        setRuajtur(ids.includes(udhetimId));
        setNumri(ids.length);
        setMesazhi("Preferimet u lexuan nga serveri.");
      } catch {
        if (!controller.signal.aborted) {
          setMesazhi("Nuk u lexuan preferimet.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    lexoPreferimet();

    return () => controller.abort();
  }, [udhetimId]);

  async function ruajPreferimin() {
    if (loading || dukeRuajtur || ruajtur) return;

    const numriMePare = numri;

    // Optimistic UI: ndryshimi ndodh para pergjigjes.
    setRuajtur(true);
    setNumri(numriMePare + 1);
    setDukeRuajtur(true);
    setMesazhi("Po presim konfirmimin e serverit.");

    try {
      const response = await fetch("/api/preferimet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ udhetimId }),
      });

      if (!response.ok) throw new Error();

      setMesazhi("U ruajt te te preferuarat.");
    } catch {
      // Rollback: rikthe gjendjen e meparshme.
      setRuajtur(false);
      setNumri(numriMePare);
      setMesazhi("Nuk u ruajt. Provo perseri.");
    } finally {
      setDukeRuajtur(false);
    }
  }

  return (
    <section>
      <button
        type="button"
        className="action"
        onClick={ruajPreferimin}
        disabled={loading || dukeRuajtur || ruajtur}
      >
        {dukeRuajtur
          ? "★ Po ruhet..."
          : ruajtur
            ? "★ I ruajtur"
            : "☆ Ruaj udhetimin"}
      </button>

      <p role="status">{mesazhi}</p>
      <p>Te preferuarat: {numri}</p>
      <p>Preferim personal - jo rezervim.</p>
    </section>
  );
}
