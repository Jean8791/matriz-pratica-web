import Link from "next/link";

function CompraEPlanejamentoDeSitioPage() {
  return (
    <div>
      <h1>Compra e Planejamento de Sítio</h1>
      <ul>
        <li>
          <Link href="/agro-e-negocios-rurais/compra-e-planejamento-de-sitio/antes-de-comprar-um-sitio">
            Antes de Comprar um Sítio
          </Link>
        </li>
        <li>
          <Link href="/agro-e-negocios-rurais/compra-e-planejamento-de-sitio/sitio-sustentavel">
            Sítio Sustentável
          </Link>
        </li>
        <li>
          <Link href="/agro-e-negocios-rurais/compra-e-planejamento-de-sitio/metodo-4v">
            Método 4V
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default CompraEPlanejamentoDeSitioPage;
