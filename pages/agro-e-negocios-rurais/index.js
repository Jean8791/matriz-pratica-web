import HubPage from "@/shared/components/HubPage.js";

const links = [
  {
    href: "/agro-e-negocios-rurais/gestao-e-rentabilidade",
    label: "Gestão e Rentabilidade",
  },
  {
    href: "/agro-e-negocios-rurais/producao-vegetal",
    label: "Produção Vegetal",
  },
  {
    href: "/agro-e-negocios-rurais/producao-animal",
    label: "Produção Animal",
  },
  {
    href: "/agro-e-negocios-rurais/compra-e-planejamento-de-sitio",
    label: "Compra e Planejamento de Sítio",
  },
  {
    href: "/agro-e-negocios-rurais/documentacao-e-credito-rural",
    label: "Documentação e Crédito Rural",
  },
];

function AgroENegociosRuraisPage() {
  return <HubPage title="Agro e Negócios Rurais" links={links} />;
}

export default AgroENegociosRuraisPage;
