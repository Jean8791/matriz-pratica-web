import Link from "next/link";

function AtividadesInfantisPage() {
  return (
    <div>
      <h1>Atividades Infantis</h1>
      <ul>
        <li>
          <Link href="/maternidade-e-desenvolvimento-infantil/atividades-infantis/jogos-imprimiveis">
            Jogos Imprimíveis
          </Link>
        </li>
        <li>
          <Link href="/maternidade-e-desenvolvimento-infantil/atividades-infantis/rpg-infantil">
            RPG Infantil
          </Link>
        </li>
        <li>
          <Link href="/maternidade-e-desenvolvimento-infantil/atividades-infantis/materiais-educativos">
            Materiais Educativos
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default AtividadesInfantisPage;
