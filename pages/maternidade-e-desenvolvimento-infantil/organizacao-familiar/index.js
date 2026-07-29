import HubPage from "@/shared/components/HubPage.js";

const links = [
  {
    href: "/maternidade-e-desenvolvimento-infantil/organizacao-familiar/rotina-da-manha",
    label: "Rotina da Manhã",
  },
  {
    href: "/maternidade-e-desenvolvimento-infantil/organizacao-familiar/rotina-do-sono",
    label: "Rotina do Sono",
  },
  {
    href: "/maternidade-e-desenvolvimento-infantil/organizacao-familiar/quadros-de-tarefas",
    label: "Quadros de Tarefas",
  },
];

function OrganizacaoFamiliarPage() {
  return <HubPage title="Organização Familiar" links={links} />;
}

export default OrganizacaoFamiliarPage;
