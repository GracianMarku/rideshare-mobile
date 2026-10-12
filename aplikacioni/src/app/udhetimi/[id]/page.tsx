
import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejUdhetimin } from "@/lib/udhetimet";

export const dynamic = "force-dynamic";

export default async function Detajet({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let udhetim;

  try {
    udhetim = await gjejUdhetimin(id);
  } catch {
    return (
      <main>
        <h1>RideShare</h1>
        <p role="alert">
          Nuk u lidhem me databazen. Provo perseri.
        </p>
        <Link href="/">← Kthehu te lista</Link>
      </main>
    );
  }

  if (!udhetim) notFound();

  return (
    <main>
      <Link href="/">← Kthehu te lista</Link>

      <h1>
        {udhetim.nisja} – {udhetim.destinacioni}
      </h1>

      <p>Ora: {udhetim.ora}</p>
      <p>Vendtakimi: {udhetim.vendtakimi}</p>
      <p>Vende te lira: {udhetim.vende}</p>

      {udhetim.vende > 0 ? (
        <Link
          className="action"
          href={`/udhetimi/${id}/kerkesa`}
        >
          Kerko vend
        </Link>
      ) : (
        <button className="action" disabled>
          Nuk ka vende te lira
        </button>
      )}
    </main>
  );
}
