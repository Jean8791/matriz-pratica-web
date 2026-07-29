import Link from "next/link";

const projects = [
  { name: "Exemplo Projeto", path: "/exemplo-projeto" },
  { name: "Mini Raio-X Rural", path: "/raio-x-rural" },
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
