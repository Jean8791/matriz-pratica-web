import Link from "next/link";

function HubPage({ title, links }) {
  return (
    <div>
      <h1>{title}</h1>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HubPage;
