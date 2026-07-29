import HubPage from "@/shared/components/HubPage.js";

const links = [
  {
    href: "/maternidade-e-desenvolvimento-infantil/rotina-infantil",
    label: "Rotina Infantil",
  },
  {
    href: "/maternidade-e-desenvolvimento-infantil/tea-e-tdah",
    label: "TEA e TDAH",
  },
  {
    href: "/maternidade-e-desenvolvimento-infantil/atividades-infantis",
    label: "Atividades Infantis",
  },
  {
    href: "/maternidade-e-desenvolvimento-infantil/organizacao-familiar",
    label: "Organização Familiar",
  },
];

function MaternidadeEDesenvolvimentoInfantilPage() {
  return (
    <HubPage title="Maternidade e Desenvolvimento Infantil" links={links} />
  );
}

export default MaternidadeEDesenvolvimentoInfantilPage;
