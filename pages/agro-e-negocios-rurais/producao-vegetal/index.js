import HubPage from "@/shared/components/HubPage.js";

const links = [
  {
    href: "/agro-e-negocios-rurais/producao-vegetal/hortalicas",
    label: "Hortaliças",
  },
  {
    href: "/agro-e-negocios-rurais/producao-vegetal/morango",
    label: "Morango",
  },
  {
    href: "/agro-e-negocios-rurais/producao-vegetal/alface",
    label: "Alface",
  },
  {
    href: "/agro-e-negocios-rurais/producao-vegetal/microverdes",
    label: "Microverdes",
  },
  {
    href: "/agro-e-negocios-rurais/producao-vegetal/cogumelos",
    label: "Cogumelos",
  },
  {
    href: "/agro-e-negocios-rurais/producao-vegetal/plantas-medicinais",
    label: "Plantas Medicinais",
  },
];

function ProducaoVegetalPage() {
  return <HubPage title="Produção Vegetal" links={links} />;
}

export default ProducaoVegetalPage;
