import HubPage from "@/shared/components/HubPage.js";

const links = [
  {
    href: "/agro-e-negocios-rurais/compra-e-planejamento-de-sitio/antes-de-comprar-um-sitio",
    label: "Antes de Comprar um Sítio",
  },
  {
    href: "/agro-e-negocios-rurais/compra-e-planejamento-de-sitio/sitio-sustentavel",
    label: "Sítio Sustentável",
  },
  {
    href: "/agro-e-negocios-rurais/compra-e-planejamento-de-sitio/metodo-4v",
    label: "Método 4V",
  },
];

function CompraEPlanejamentoDeSitioPage() {
  return <HubPage title="Compra e Planejamento de Sítio" links={links} />;
}

export default CompraEPlanejamentoDeSitioPage;
