import HubPage from "@/shared/components/HubPage.js";

const links = [
  {
    href: "/agro-e-negocios-rurais/gestao-e-rentabilidade/raio-x-rural",
    label: "Raio X Rural",
  },
  {
    href: "/agro-e-negocios-rurais/gestao-e-rentabilidade/agrocaderno",
    label: "AgroCaderno",
  },
  {
    href: "/agro-e-negocios-rurais/gestao-e-rentabilidade/propriedade-no-lucro",
    label: "Propriedade no Lucro",
  },
];

function GestaoERentabilidadePage() {
  return <HubPage title="Gestão e Rentabilidade" links={links} />;
}

export default GestaoERentabilidadePage;
