"use client";

import { useState } from "react";

export default function Vendtakimi() {
  const [vendi, setVendi] = useState("");
  const [vendiKonfirmuar, setVendiKonfirmuar] = useState("");
const [saktesia, setSaktesia] = useState<number | null>(null);
    const [lokacioni, setLokacioni] = useState("");
const [gabimi, setGabimi] = useState("");
const [dukeLexuar, setDukeLexuar] = useState(false);
const [gjendja, setGjendja] = useState("idle");
const [gabimiVendtakimit, setGabimiVendtakimit] = useState("");

  const konfirmoVendtakimin = () => {
  const vendiPastruar = vendi.trim();

  if (!vendiPastruar) {
    setGabimiVendtakimit("Shkruaj nje vendtakim.");
    return;
  }

  setGabimiVendtakimit("");
  setVendiKonfirmuar(vendiPastruar);
};

  

  const merrVendndodhjen = () => {
  setGabimi("");
  setLokacioni("");
  setSaktesia(null);
  setDukeLexuar(true);
  setGjendja("loading");

  if (!navigator.geolocation) {
    setGabimi("Shfletuesi nuk e mbeshtet vendndodhjen.");
    setDukeLexuar(false);
    setGjendja("unavailable");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
  const { latitude, longitude, accuracy } = position.coords;

  setLokacioni(`${latitude}, ${longitude}`);
  setSaktesia(accuracy);
  setDukeLexuar(false);
  setGjendja("success");
},
    (error) => {
      if (error.code === 1) {
        setGjendja("denied");
        setGabimi("Leja per vendndodhjen u refuzua.");
        } else if (error.code === 2) {
        setGjendja("unavailable");
        setGabimi("Vendndodhja nuk u gjet.");
        } else if (error.code === 3) {
        setGjendja("timeout");
        setGabimi("Koha e pritjes perfundoi.");
        } else {
        setGjendja("unavailable");
        setGabimi("Ndodhi nje gabim.");
        }

      setDukeLexuar(false);
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
    // timeout: 1,
      maximumAge: 0,
    }
  );
};

  return (
    <section>
      <h2>Zgjedh vendtakimin</h2>

      <label htmlFor="vendtakimi">Vendtakimi:</label>

      <input
        id="vendtakimi"
        data-testid="meeting-input"
        type="text"
        value={vendi}
        onChange={(e) => setVendi(e.target.value)}
        placeholder="p.sh. Biblioteka"
        />

      <button
        type="button"
        data-testid="confirm-meeting"
        onClick={konfirmoVendtakimin}
        >
        Konfirmo vendtakimin
        </button>

      <p data-testid="meeting-error" role="alert">
        {gabimiVendtakimit}
      </p>

      <p data-testid="confirmed-meeting">
        {vendiKonfirmuar
            ? `Vendtakimi i konfirmuar: ${vendiKonfirmuar}`
            : ""}
        </p>

      <button
        type="button"
        data-testid="locate-me"
        onClick={merrVendndodhjen}
        disabled={dukeLexuar}
        >   
        {dukeLexuar ? "Duke lexuar..." : "Perdor vendndodhjen time"}
        </button>

        <p data-testid="location-status" data-state={gjendja}>
        {dukeLexuar ? "Duke lexuar vendndodhjen..." : gabimi}
        </p>

        {lokacioni && <p>Koordinatat: {lokacioni}</p>}

        <p data-testid="location-accuracy">
  {saktesia !== null
    ? `Saktesia: ${Math.round(saktesia)} m`
    : ""}
</p>
    </section>
  );
}