import HubPage from "@/shared/components/HubPage.js";

const links = [
  {
    href: "/agro-e-negocios-rurais/documentacao-e-credito-rural/caf",
    label: "CAF",
  },
  {
    href: "/agro-e-negocios-rurais/documentacao-e-credito-rural/pncf",
    label: "PNCF",
  },
  {
    href: "/agro-e-negocios-rurais/documentacao-e-credito-rural/credito-rural",
    label: "Crédito Rural",
  },
];

function DocumentacaoECreditoRuralPage() {
  return <HubPage title="Documentação e Crédito Rural" links={links} />;
}

export default DocumentacaoECreditoRuralPage;
