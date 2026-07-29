import Link from "next/link";

const projects = [
  { name: "Exemplo Projeto", path: "/exemplo-projeto" },
  { name: "Agro e Negócios Rurais", path: "/agro-e-negocios-rurais" },
  { name: "Maternidade e Desenvolvimento Infantil", path: "/maternidade-e-desenvolvimento-infantil" },
];

function ProjectMenu() {
  return (
    <ul>
      {projects.map((project) => (
        <li key={project.path}>
          <Link href={project.path}>{project.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default ProjectMenu;
