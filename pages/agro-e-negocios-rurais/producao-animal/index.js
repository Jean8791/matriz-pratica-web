import Link from "next/link";

function ProducaoAnimalPage() {
  return (
    <div>
      <h1>Produção Animal</h1>
      <ul>
        <li>
          <Link href="/agro-e-negocios-rurais/producao-animal/leite-e-derivados">
            Leite e Derivados
          </Link>
        </li>
        <li>
          <Link href="/agro-e-negocios-rurais/producao-animal/ovos">Ovos</Link>
        </li>
        <li>
          <Link href="/agro-e-negocios-rurais/producao-animal/mel">Mel</Link>
        </li>
        <li>
          <Link href="/agro-e-negocios-rurais/producao-animal/tilapias">
            Tilápias
          </Link>
        </li>
        <li>
          <Link href="/agro-e-negocios-rurais/producao-animal/ovinos">
            Ovinos
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default ProducaoAnimalPage;
