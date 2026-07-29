import Link from "next/link";

function ProducaoVegetalPage() {
  return (
    <div>
      <h1>Produção Vegetal</h1>
      <ul>
        <li>
          <Link href="/agro-e-negocios-rurais/producao-vegetal/hortalicas">
            Hortaliças
          </Link>
        </li>
        <li>
          <Link href="/agro-e-negocios-rurais/producao-vegetal/morango">
            Morango
          </Link>
        </li>
        <li>
          <Link href="/agro-e-negocios-rurais/producao-vegetal/alface">
            Alface
          </Link>
        </li>
        <li>
          <Link href="/agro-e-negocios-rurais/producao-vegetal/microverdes">
            Microverdes
          </Link>
        </li>
        <li>
          <Link href="/agro-e-negocios-rurais/producao-vegetal/cogumelos">
            Cogumelos
          </Link>
        </li>
        <li>
          <Link href="/agro-e-negocios-rurais/producao-vegetal/plantas-medicinais">
            Plantas Medicinais
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default ProducaoVegetalPage;
