import Link from "next/link";

function TeaETdahPage() {
  return (
    <div>
      <h1>TEA e TDAH</h1>
      <ul>
        <li>
          <Link href="/maternidade-e-desenvolvimento-infantil/tea-e-tdah/rotinas-visuais">
            Rotinas Visuais
          </Link>
        </li>
        <li>
          <Link href="/maternidade-e-desenvolvimento-infantil/tea-e-tdah/transicoes">
            Transições
          </Link>
        </li>
        <li>
          <Link href="/maternidade-e-desenvolvimento-infantil/tea-e-tdah/organizacao-escolar">
            Organização Escolar
          </Link>
        </li>
        <li>
          <Link href="/maternidade-e-desenvolvimento-infantil/tea-e-tdah/comunicacao-familia-escola">
            Comunicação Família-Escola
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default TeaETdahPage;
