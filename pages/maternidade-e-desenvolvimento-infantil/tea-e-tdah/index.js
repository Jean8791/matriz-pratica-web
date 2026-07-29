import HubPage from "@/shared/components/HubPage.js";

const links = [
  {
    href: "/maternidade-e-desenvolvimento-infantil/tea-e-tdah/rotinas-visuais",
    label: "Rotinas Visuais",
  },
  {
    href: "/maternidade-e-desenvolvimento-infantil/tea-e-tdah/transicoes",
    label: "Transições",
  },
  {
    href: "/maternidade-e-desenvolvimento-infantil/tea-e-tdah/organizacao-escolar",
    label: "Organização Escolar",
  },
  {
    href: "/maternidade-e-desenvolvimento-infantil/tea-e-tdah/comunicacao-familia-escola",
    label: "Comunicação Família-Escola",
  },
];

function TeaETdahPage() {
  return <HubPage title="TEA e TDAH" links={links} />;
}

export default TeaETdahPage;
