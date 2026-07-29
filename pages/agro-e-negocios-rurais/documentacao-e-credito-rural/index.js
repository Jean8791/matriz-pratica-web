import Link from "next/link";

function DocumentacaoECreditoRuralPage() {
  return (
    <div>
      <h1>Documentação e Crédito Rural</h1>
      <ul>
        <li>
          <Link href="/agro-e-negocios-rurais/documentacao-e-credito-rural/caf">
            CAF
          </Link>
        </li>
        <li>
          <Link href="/agro-e-negocios-rurais/documentacao-e-credito-rural/pncf">
            PNCF
          </Link>
        </li>
        <li>
          <Link href="/agro-e-negocios-rurais/documentacao-e-credito-rural/credito-rural">
            Crédito Rural
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default DocumentacaoECreditoRuralPage;
