import { calculateMinimumPrice } from "@/projects/raio-x-rural/frontend/lib/calculator.js";

function alfaceForm() {
  return {
    module: "Vegetal",
    selectedProduct: "Alface",
    customProduct: "",
    region: "Brasil",
    salesChannel: "Feira",
    technicalUnit: "cabeça",
    commercialUnit: "caixa",
    quantityPerUnit: 20,
    expectedPrice: 70,
    desiredMarginPercent: 20,
    contingencyPercent: 10,
    quoteSource: "Comprador",
    quoteDate: "2026-07-11",
    area: 1000,
    productivity: "",
    informedGrossProduction: 1000,
    vegetableLossPercent: 12,
    animalProductionType: "Contínua",
    animalCount: "",
    averageDailyProduction: "",
    periodDays: "",
    averageSaleWeight: "",
    animalLossPercent: "",
    costs: {
      inputs: 950,
      acquisition: 0,
      labor: 600,
      energy: 120,
      health: 0,
      services: 0,
      structure: 200,
      packaging: 176,
      freight: 220,
      other: 50,
      variablePerUnit: 0,
    },
    checkedCosts: [],
  };
}

test("reproduz o exemplo validado de alface", () => {
  const result = calculateMinimumPrice(alfaceForm());

  expect(result.grossTechnicalProduction).toBe(1000);
  expect(result.sellableTechnicalProduction).toBe(880);
  expect(result.commercialProduction).toBe(44);
  expect(result.baseCost).toBe(2316);
  expect(result.contingencyValue).toBe(231.60000000000002);
  expect(result.totalCost).toBe(2547.6);
  expect(result.minimumPrice).toBe(57.9);
  expect(Math.abs((result.targetPrice ?? 0) - 69.48)).toBeLessThan(1e-9);
  expect(result.expectedRevenue).toBe(3080);
  expect(Math.abs((result.estimatedResult ?? 0) - 532.4)).toBeLessThan(1e-9);
  expect(result.trafficLight).toBe("green");
  expect(result.errors).toEqual([]);
});

test("classifica como vermelho quando o preço não cobre o custo", () => {
  const form = alfaceForm();
  form.expectedPrice = 50;

  const result = calculateMinimumPrice(form);

  expect(result.trafficLight).toBe("red");
  expect(result.estimatedResult ?? 0).toBeLessThan(0);
});

test("classifica como amarelo entre preço mínimo e preço alvo", () => {
  const form = alfaceForm();
  form.expectedPrice = 60;

  const result = calculateMinimumPrice(form);

  expect(result.trafficLight).toBe("yellow");
  expect(result.estimatedResult ?? 0).toBeGreaterThan(0);
});

test("calcula produção animal por lote com mortalidade", () => {
  const form = alfaceForm();
  form.module = "Animal";
  form.selectedProduct = "Tilápia";
  form.technicalUnit = "kg";
  form.commercialUnit = "kg";
  form.quantityPerUnit = 1;
  form.animalProductionType = "Lote";
  form.animalCount = 1000;
  form.averageSaleWeight = 0.9;
  form.animalLossPercent = 10;
  form.expectedPrice = 15;
  form.contingencyPercent = 0;
  form.averageDailyProduction = "";
  form.periodDays = "";

  const result = calculateMinimumPrice(form);

  expect(result.grossTechnicalProduction).toBe(900);
  expect(result.sellableTechnicalProduction).toBe(810);
  expect(result.commercialProduction).toBe(810);
  expect(result.errors).toEqual([]);
});

test("bloqueia o semáforo quando faltam dados obrigatórios", () => {
  const form = alfaceForm();
  form.quantityPerUnit = "";
  form.informedGrossProduction = "";
  form.area = "";
  form.productivity = "";

  const result = calculateMinimumPrice(form);

  expect(result.trafficLight).toBe("fill");
  expect(result.errors.length).toBeGreaterThanOrEqual(2);
  expect(result.minimumPrice).toBeNull();
});

test("calcula lote animal vendido por cabeça sem exigir peso", () => {
  const form = alfaceForm();
  form.module = "Animal";
  form.selectedProduct = "Bezerro";
  form.technicalUnit = "cabeça";
  form.commercialUnit = "cabeça";
  form.quantityPerUnit = 1;
  form.animalProductionType = "Lote";
  form.animalCount = 20;
  form.averageSaleWeight = "";
  form.animalLossPercent = 5;
  form.expectedPrice = 1800;
  form.contingencyPercent = 0;
  form.averageDailyProduction = "";
  form.periodDays = "";

  const result = calculateMinimumPrice(form);

  expect(result.grossTechnicalProduction).toBe(20);
  expect(result.sellableTechnicalProduction).toBe(19);
  expect(result.commercialProduction).toBe(19);
  expect(result.errors).toEqual([]);
});
