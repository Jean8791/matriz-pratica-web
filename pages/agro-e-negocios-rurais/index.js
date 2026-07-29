import Link from "next/link";

function AgroENegociosRuraisPage() {
  return (
    <div>
      <h1>Agro e Negócios Rurais</h1>
      <ul>
        <li>
          <Link href="/agro-e-negocios-rurais/gestao-e-rentabilidade">
            Gestão e Rentabilidade
          </Link>
        </li>
        <li>
          <Link href="/agro-e-negocios-rurais/producao-vegetal">
            Produção Vegetal
          </Link>
        </li>
        <li>
          <Link href="/agro-e-negocios-rurais/producao-animal">
            Produção Animal
          </Link>
        </li>
        <li>
          <Link href="/agro-e-negocios-rurais/compra-e-planejamento-de-sitio">
            Compra e Planejamento de Sítio
          </Link>
        </li>
        <li>
          <Link href="/agro-e-negocios-rurais/documentacao-e-credito-rural">
            Documentação e Crédito Rural
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default AgroENegociosRuraisPage;
