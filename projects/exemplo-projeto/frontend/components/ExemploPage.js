import { useEffect, useState } from "react";

function ExemploPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/exemplo-projeto")
      .then((response) => response.json())
      .then(setData);
  }, []);

  return (
    <div>
      <h1>Exemplo Projeto</h1>
      <p>{data ? data.message : "Carregando..."}</p>
    </div>
  );
}

export default ExemploPage;