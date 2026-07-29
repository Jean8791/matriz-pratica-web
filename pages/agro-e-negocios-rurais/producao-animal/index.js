import HubPage from "@/shared/components/HubPage.js";

const links = [
  {
    href: "/agro-e-negocios-rurais/producao-animal/leite-e-derivados",
    label: "Leite e Derivados",
  },
  { href: "/agro-e-negocios-rurais/producao-animal/ovos", label: "Ovos" },
  { href: "/agro-e-negocios-rurais/producao-animal/mel", label: "Mel" },
  {
    href: "/agro-e-negocios-rurais/producao-animal/tilapias",
    label: "Tilápias",
  },
  {
    href: "/agro-e-negocios-rurais/producao-animal/ovinos",
    label: "Ovinos",
  },
];

function ProducaoAnimalPage() {
  return <HubPage title="Produção Animal" links={links} />;
}

export default ProducaoAnimalPage;
