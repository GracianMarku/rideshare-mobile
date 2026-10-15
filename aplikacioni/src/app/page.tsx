import Link from "next/link";
import { KartaUdhetimi } from "@/components/KartaUdhetimi";
import { lexoUdhetimet, type Udhetim } from "@/lib/udhetimet";

// Lexo bazën përsëri në çdo kërkesë për këtë faqe.
export const dynamic = "force-dynamic";

export default async function Home() {
  let udhetimet: Udhetim[];
  try {
    udhetimet = await lexoUdhetimet();
  } catch {
    return (
      <main>
        <h1>RideShare</h1>
      <p><Link href="/panel">Hyr / Paneli im</Link></p>
        <p role="alert">Nuk u lidhëm me databazën. Provo përsëri.</p>
        <a className="action" href="/">Provo përsëri</a>
      </main>
    );
  }

  return (
    <main>
      <h1>RideShare · Udhëtimet për AAB</h1>
      <p><Link href="/panel">Hyr / Paneli im</Link></p>
      <p>Burimi: Neon · të dhëna fiktive për ushtrime</p>
      {udhetimet.length === 0 ? (
        <p>Nuk ka udhëtime për momentin.</p>
      ) : (
        <div className="trip-list">
          {udhetimet.map((udhetim) => (
            <KartaUdhetimi key={udhetim.id} udhetim={udhetim} />
          ))}
        </div>
      )}
    </main>
  );
}

// import { KartaUdhetimi } from "@/components/KartaUdhetimi";
// import { lexoUdhetimet, type Udhetim } from "@/lib/udhetimet";

// // Lexo databazen ne cdo kerkese
// export const dynamic = "force-dynamic";

// export default async function Home() {
//   let udhetimet: Udhetim[];

//   try {
//     udhetimet = await lexoUdhetimet();
//   } catch (error) {
//   console.error("Gabim gjate leximit nga Neon:", error);

//   return (
//       <main>
//         <h1>RideShare</h1>
//         <p role="alert">
//           Nuk u lidhem me databazen. Provo perseri.
//         </p>
//         <a className="action" href="/">
//           Provo perseri
//         </a>
//       </main>
//     );
//   }

//   return (
//     <main>
//       <h1>RideShare · Udhetimet per AAB</h1>
//       <p>Burimi: Neon · te dhena fiktive per ushtrime</p>

//       {udhetimet.length === 0 ? (
//         <p>Nuk ka udhetime per momentin.</p>
//       ) : (
//         <div className="trip-list">
//           {udhetimet.map((udhetim) => (
//             <KartaUdhetimi
//               key={udhetim.id}
//               udhetim={udhetim}
//             />
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }
