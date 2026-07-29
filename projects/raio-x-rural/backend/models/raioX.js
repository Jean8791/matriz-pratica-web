import projectData from "projects/raio-x-rural/backend/data/dados.json";

function text(value) {
  return typeof value === "string" ? value : "";
}

function number(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function getSheets() {
  return projectData.sheets;
}

function getProducts() {
  const sheets = getSheets();
  const rows = sheets["02_BASE_UNIDADES"]?.data?.slice(1) ?? [];

  return rows.flatMap((row) => {
    const productionModule = text(row[0]);
    if (productionModule !== "Vegetal" && productionModule !== "Animal")
      return [];

    const animalType = text(row[8]);
    return [
      {
        module: productionModule,
        category: text(row[1]),
        product: text(row[2]),
        technicalUnit: text(row[3]),
        commercialUnit: text(row[4]),
        quantityPerUnit: number(row[5]),
        priceUnit: text(row[7]),
        animalProductionType:
          animalType === "Contínua" || animalType === "Lote"
            ? animalType
            : null,
        note: text(row[10]),
        source: text(row[11]),
      },
    ];
  });
}

function getChecklist() {
  const sheets = getSheets();
  const rows = sheets["04_CHECKLIST_CUSTOS"]?.data?.slice(3) ?? [];

  return rows.flatMap((row) => {
    const checklistModule = text(row[0]);
    if (
      checklistModule !== "Vegetal" &&
      checklistModule !== "Animal" &&
      checklistModule !== "Ambos"
    ) {
      return [];
    }

    return [
      {
        module: checklistModule,
        label: text(row[1]),
        note: text(row[3]),
      },
    ];
  });
}

function getCalculatorData() {
  return {
    products: getProducts(),
    checklist: getChecklist(),
  };
}

export default {
  getProducts,
  getChecklist,
  getCalculatorData,
};
