
import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejUdhetimin } from "@/lib/udhetimet";
import GjendjaUdhetimit from "@/components/GjendjaUdhetimit";

export const dynamic = "force-dynamic";

export default async function KerkesaPage({
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
        <p role="alert">Nuk u lidhem me databazen.</p>
        <Link href="/">Kthehu te lista</Link>
      </main>
    );
  }

  if (!udhetim) notFound();

  return (
    <main>
      <Link href={`/udhetimi/${id}`}>
        ← Kthehu te udhetimi
      </Link>

      <h1>
        {udhetim.nisja} – {udhetim.destinacioni}
      </h1>

      <p>Ora: {udhetim.ora}</p>

      <GjendjaUdhetimit udhetimId={id} />
    </main>
  );
}
