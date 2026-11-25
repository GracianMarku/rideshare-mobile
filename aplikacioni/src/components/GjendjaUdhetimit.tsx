
"use client";

import { useEffect, useRef, useState } from "react";
import KerkesaForm from "./KerkesaForm";

type Kerkesa = {
  id: string;
  udhetim_id: string;
  udhetar_id?: string;
  statusi: string;
};

type Gjendja = {
  udhetimId: string;
  vende: number;
  eshteShoferi: boolean;
  kerkesat: Kerkesa[];
};

export default function GjendjaUdhetimit({
  udhetimId,
}: {
  udhetimId: string;
}) {
  const [gjendja, setGjendja] = useState<Gjendja | null>(null);
  const [gabimi, setGabimi] = useState("");
const [dukePranuar, setDukePranuar] = useState(false);
const [gabimiPranimit, setGabimiPranimit] = useState("");
const pranimRef = useRef(false);

  useEffect(() => {
    let aktiv = true;
    let timer: ReturnType<typeof setTimeout>;
    const controller = new AbortController();

    async function lexoGjendjen() {
      try {
        const response = await fetch(
          `/api/kerkesat?udhetimId=${encodeURIComponent(udhetimId)}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Nuk u lexua gjendja.");
        }

        const data: Gjendja = await response.json();

        if (aktiv) {
          setGjendja(data);
          setGabimi("");
        }
      } catch {
        if (aktiv) {
          setGabimi(
            "Nuk u perditesua gjendja. Po provohet perseri..."
          );
        }
      } finally {
        if (aktiv) {
          timer = setTimeout(lexoGjendjen, 5000);
        }
      }
    }

    lexoGjendjen();

    return () => {
      aktiv = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [udhetimId]);


async function pranoKerkesen(kerkesaId: string) {
  if (
    pranimRef.current ||
    gabimi ||
    !gjendja?.eshteShoferi ||
    gjendja.vende <= 0
  ) {
    return;
  }

  pranimRef.current = true;
  setDukePranuar(true);
  setGabimiPranimit("");

  try {
    const response = await fetch("/api/kerkesat", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ kerkesaId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Kerkesa nuk u pranua.");
    }
  } catch (error) {
    setGabimiPranimit(
      error instanceof Error
        ? error.message
        : "Gabim ne server."
    );
  } finally {
    pranimRef.current = false;
    setDukePranuar(false);
  }
}


  if (!gjendja) {
    return <p>{gabimi || "Po ngarkohet gjendja..."}</p>;
  }

  const kerkesaIme = gjendja.kerkesat[0];

  return (
    <section>
      <h2>Gjendja e udhetimit</h2>

      <p>Roli: {gjendja.eshteShoferi ? "Shofer" : "Udhetar"}</p>

      <p>
        Vende te lira: <strong>{gjendja.vende}</strong>
      </p>

      {gabimi && <p role="alert">{gabimi}</p>}

      {gabimiPranimit && (
    <p role="alert">{gabimiPranimit}</p>
    )}

      {gjendja.eshteShoferi ? (
        <div>
          <h3>Kerkesat e udhetareve</h3>

          {gjendja.kerkesat.length === 0 && (
            <p>Nuk ka kerkesa.</p>
          )}

          {gjendja.kerkesat.map((kerkesa) => (
            <div
              key={kerkesa.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "12px",
              }}
            >
              <p>Udhetari: {kerkesa.udhetar_id}</p>

              <p>
                Statusi:{" "}
                {kerkesa.statusi === "pranuar"
                  ? "U pranua"
                  : "Ne pritje"}
              </p>

              {kerkesa.statusi === "ne_pritje" && (
                <button
                    type="button"
                    className="action"
                    onClick={() => pranoKerkesen(kerkesa.id)}
                    disabled={
                    dukePranuar ||
                    gjendja.vende <= 0 ||
                    Boolean(gabimi)
                    }
                >
                    {dukePranuar
                    ? "Po pranohet..."
                    : "Prano kerkesen"}
                </button>
                )}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h3>Kerkesa ime</h3>

          {kerkesaIme ? (
            <p>
              Statusi:{" "}
              <strong>
                {kerkesaIme.statusi === "pranuar"
                  ? "U pranua"
                  : "Ne pritje"}
              </strong>
            </p>
          ) : gjendja.vende > 0 && !gabimi ? (
            <KerkesaForm udhetimId={udhetimId} />
          ) : (
            <p>
              {gabimi
                ? "Prit derisa te rikthehet lidhja."
                : "Nuk ka vende te lira."}
            </p>
          )}
        </div>
      )}

      <small>Perditesim automatik cdo 5 sekonda.</small>
    </section>
  );
}
