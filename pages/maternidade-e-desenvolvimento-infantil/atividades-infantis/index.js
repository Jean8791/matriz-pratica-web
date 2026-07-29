import HubPage from "@/shared/components/HubPage.js";

const links = [
  {
    href: "/maternidade-e-desenvolvimento-infantil/atividades-infantis/jogos-imprimiveis",
    label: "Jogos Imprimíveis",
  },
  {
    href: "/maternidade-e-desenvolvimento-infantil/atividades-infantis/rpg-infantil",
    label: "RPG Infantil",
  },
  {
    href: "/maternidade-e-desenvolvimento-infantil/atividades-infantis/materiais-educativos",
    label: "Materiais Educativos",
  },
];

function AtividadesInfantisPage() {
  return <HubPage title="Atividades Infantis" links={links} />;
}

export default AtividadesInfantisPage;
