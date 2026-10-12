import { KartaUdhetimi } from "@/components/KartaUdhetimi";
import { lexoUdhetimet, type Udhetim } from "@/lib/udhetimet";

// Lexo databazen ne cdo kerkese
export const dynamic = "force-dynamic";

export default async function Home() {
  let udhetimet: Udhetim[];

  try {
    udhetimet = await lexoUdhetimet();
  } catch (error) {
  console.error("Gabim gjate leximit nga Neon:", error);

  return (
      <main>
        <h1>RideShare</h1>
        <p role="alert">
          Nuk u lidhem me databazen. Provo perseri.
        </p>
        <a className="action" href="/">
          Provo perseri
        </a>
      </main>
    );
  }

  return (
    <main>
      <h1>RideShare · Udhetimet per AAB</h1>
      <p>Burimi: Neon · te dhena fiktive per ushtrime</p>

      {udhetimet.length === 0 ? (
        <p>Nuk ka udhetime per momentin.</p>
      ) : (
        <div className="trip-list">
          {udhetimet.map((udhetim) => (
            <KartaUdhetimi
              key={udhetim.id}
              udhetim={udhetim}
            />
          ))}
        </div>
      )}
    </main>
  );
}
