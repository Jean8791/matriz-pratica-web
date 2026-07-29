import Link from "next/link";

function GestaoERentabilidadePage() {
  return (
    <div>
      <h1>Gestão e Rentabilidade</h1>
      <ul>
        <li>
          <Link href="/raio-x-rural">Raio X Rural</Link>
        </li>
        <li>
          <Link href="/agro-e-negocios-rurais/gestao-e-rentabilidade/agrocaderno">
            AgroCaderno
          </Link>
        </li>
        <li>
          <Link href="/agro-e-negocios-rurais/gestao-e-rentabilidade/propriedade-no-lucro">
            Propriedade no Lucro
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default GestaoERentabilidadePage;
