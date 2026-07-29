import Link from "next/link";

function OrganizacaoFamiliarPage() {
  return (
    <div>
      <h1>Organização Familiar</h1>
      <ul>
        <li>
          <Link href="/maternidade-e-desenvolvimento-infantil/organizacao-familiar/rotina-da-manha">
            Rotina da Manhã
          </Link>
        </li>
        <li>
          <Link href="/maternidade-e-desenvolvimento-infantil/organizacao-familiar/rotina-do-sono">
            Rotina do Sono
          </Link>
        </li>
        <li>
          <Link href="/maternidade-e-desenvolvimento-infantil/organizacao-familiar/quadros-de-tarefas">
            Quadros de Tarefas
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default OrganizacaoFamiliarPage;
