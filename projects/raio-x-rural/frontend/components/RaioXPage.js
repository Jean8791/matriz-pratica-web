import { useEffect, useState } from "react";
import { CalculatorApp } from "@/projects/raio-x-rural/frontend/components/CalculatorApp.js";

function RaioXPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/v1/agro-e-negocios-rurais/gestao-e-rentabilidade/raio-x-rural")
      .then((response) => response.json())
      .then(setData);
  }, []);

  if (!data) {
    return <p>Carregando...</p>;
  }

  return <CalculatorApp products={data.products} checklist={data.checklist} />;
}

export default RaioXPage;
