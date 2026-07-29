import Link from "next/link";

function MaternidadeEDesenvolvimentoInfantilPage() {
  return (
    <div>
      <h1>Maternidade e Desenvolvimento Infantil</h1>
      <ul>
        <li>
          <Link href="/maternidade-e-desenvolvimento-infantil/rotina-infantil">
            Rotina Infantil
          </Link>
        </li>
        <li>
          <Link href="/maternidade-e-desenvolvimento-infantil/tea-e-tdah">
            TEA e TDAH
          </Link>
        </li>
        <li>
          <Link href="/maternidade-e-desenvolvimento-infantil/atividades-infantis">
            Atividades Infantis
          </Link>
        </li>
        <li>
          <Link href="/maternidade-e-desenvolvimento-infantil/organizacao-familiar">
            Organização Familiar
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default MaternidadeEDesenvolvimentoInfantilPage;
