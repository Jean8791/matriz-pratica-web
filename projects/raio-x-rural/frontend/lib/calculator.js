const COST_KEYS = [
  "inputs",
  "acquisition",
  "labor",
  "energy",
  "health",
  "services",
  "structure",
  "packaging",
  "freight",
  "other",
];

function numberOrZero(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function positive(value) {
  const normalized = numberOrZero(value);
  return normalized > 0 ? normalized : null;
}

function percentage(value) {
  return numberOrZero(value) / 100;
}

function unique(messages) {
  return [...new Set(messages)];
}

function normalizedUnit(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function isUnitBasedAnimalLot(
  technicalUnit,
  commercialUnit,
  quantityPerUnit,
) {
  const unitLabels = new Set(["unidade", "unidades", "cabeca", "cabecas"]);
  return (
    quantityPerUnit === 1 &&
    unitLabels.has(normalizedUnit(technicalUnit)) &&
    unitLabels.has(normalizedUnit(commercialUnit))
  );
}

export function calculateMinimumPrice(form) {
  const errors = [];
  const warnings = [];

  const quantityPerUnit = positive(form.quantityPerUnit);
  const expectedPrice = positive(form.expectedPrice);
  const desiredMarginPercent = numberOrZero(form.desiredMarginPercent);
  const contingencyPercent = numberOrZero(form.contingencyPercent);

  if (!form.commercialUnit.trim()) {
    errors.push("Informe a unidade comercial de venda.");
  }
  if (!quantityPerUnit) {
    errors.push("A quantidade por unidade comercial deve ser maior que zero.");
  }
  if (!expectedPrice) {
    errors.push("O preço líquido esperado deve ser maior que zero.");
  }
  if (desiredMarginPercent < 0) {
    errors.push("A margem desejada não pode ser negativa.");
  }
  if (contingencyPercent < 0 || contingencyPercent > 50) {
    errors.push("A reserva para imprevistos deve ficar entre 0% e 50%.");
  }
  const productName =
    form.selectedProduct === "__custom__"
      ? form.customProduct.trim()
      : form.selectedProduct.trim();
  if (!productName) {
    warnings.push("Informe o produto ou atividade para identificar o cálculo.");
  }
  if (!form.quoteSource.trim()) {
    warnings.push("Preço sem fonte: valide a cotação antes de decidir.");
  }

  let grossTechnicalProduction = null;
  let sellableTechnicalProduction = null;

  if (form.module === "Vegetal") {
    const informedGross = positive(form.informedGrossProduction);
    const area = positive(form.area);
    const productivity = positive(form.productivity);
    const lossPercent = numberOrZero(form.vegetableLossPercent);

    if (lossPercent < 0 || lossPercent > 80) {
      errors.push("A perda vegetal deve ficar entre 0% e 80%.");
    }

    grossTechnicalProduction =
      informedGross ?? (area && productivity ? area * productivity : null);

    if (!grossTechnicalProduction) {
      errors.push(
        "Informe a produção bruta ou preencha área e produtividade com valores maiores que zero.",
      );
    } else if (lossPercent >= 0 && lossPercent <= 80) {
      sellableTechnicalProduction =
        grossTechnicalProduction * (1 - lossPercent / 100);
    }

    if (form.vegetableLossPercent === "") {
      warnings.push("Perda vegetal vazia: considerando 0%.");
    }
  } else {
    const animalCount = positive(form.animalCount);
    const lossPercent = numberOrZero(form.animalLossPercent);

    if (!animalCount) {
      errors.push("Informe o número de animais, matrizes ou colmeias.");
    }
    if (lossPercent < 0 || lossPercent >= 100) {
      errors.push(
        "A perda ou mortalidade animal deve ficar entre 0% e menos de 100%.",
      );
    }

    if (form.animalProductionType === "Contínua") {
      const dailyProduction = positive(form.averageDailyProduction);
      const days = positive(form.periodDays);
      if (!dailyProduction) {
        errors.push(
          "Informe a produção média por animal ou colmeia no período diário.",
        );
      }
      if (!days) {
        errors.push("Informe a quantidade de dias do período.");
      }
      if (animalCount && dailyProduction && days) {
        grossTechnicalProduction = animalCount * dailyProduction * days;
      }
    } else {
      const unitBasedLot = isUnitBasedAnimalLot(
        form.technicalUnit,
        form.commercialUnit,
        quantityPerUnit,
      );

      if (unitBasedLot) {
        grossTechnicalProduction = animalCount;
      } else {
        const averageWeight = positive(form.averageSaleWeight);
        if (!averageWeight) {
          errors.push("Informe o peso médio de venda por animal.");
        }
        if (animalCount && averageWeight) {
          grossTechnicalProduction = animalCount * averageWeight;
        }
      }
    }

    if (grossTechnicalProduction && lossPercent >= 0 && lossPercent < 100) {
      sellableTechnicalProduction =
        grossTechnicalProduction * (1 - lossPercent / 100);
    }

    if (form.animalLossPercent === "") {
      warnings.push("Perda animal vazia: considerando 0%.");
    }
  }

  const commercialProduction =
    sellableTechnicalProduction && quantityPerUnit
      ? sellableTechnicalProduction / quantityPerUnit
      : null;

  const invalidCosts = Object.values(form.costs).some(
    (value) => numberOrZero(value) < 0,
  );
  if (invalidCosts) {
    errors.push("Os custos não podem conter valores negativos.");
  }

  const fixedCosts = COST_KEYS.reduce(
    (total, key) => total + Math.max(0, numberOrZero(form.costs[key])),
    0,
  );
  const variablePerUnit = Math.max(0, numberOrZero(form.costs.variablePerUnit));
  const baseCost =
    commercialProduction && !invalidCosts
      ? fixedCosts + variablePerUnit * commercialProduction
      : null;

  if (fixedCosts <= 0 && variablePerUnit <= 0) {
    errors.push("Informe ao menos um custo do ciclo ou período.");
  }

  const contingencyValue =
    baseCost !== null && contingencyPercent >= 0 && contingencyPercent <= 50
      ? baseCost * percentage(form.contingencyPercent)
      : null;
  const totalCost =
    baseCost !== null && contingencyValue !== null
      ? baseCost + contingencyValue
      : null;
  const minimumPrice =
    totalCost !== null && commercialProduction && commercialProduction > 0
      ? totalCost / commercialProduction
      : null;
  const targetPrice =
    minimumPrice !== null && desiredMarginPercent >= 0
      ? minimumPrice * (1 + percentage(form.desiredMarginPercent))
      : null;
  const expectedRevenue =
    commercialProduction && expectedPrice
      ? commercialProduction * expectedPrice
      : null;
  const estimatedResult =
    expectedRevenue !== null && totalCost !== null
      ? expectedRevenue - totalCost
      : null;
  const realSafetyMargin =
    expectedPrice && minimumPrice && minimumPrice > 0
      ? expectedPrice / minimumPrice - 1
      : null;

  let trafficLight = "fill";
  let message = "Complete os dados obrigatórios antes de decidir.";
  let action = "Revise unidade, produção, custos e preço.";

  if (
    errors.length === 0 &&
    expectedPrice !== null &&
    minimumPrice !== null &&
    targetPrice !== null
  ) {
    if (expectedPrice < minimumPrice) {
      trafficLight = "red";
      message = "Venda ou produção com risco de prejuízo.";
      action = "Renegocie, reduza custos, mude o canal ou revise a produção.";
    } else if (expectedPrice < targetPrice) {
      trafficLight = "yellow";
      message = "Cobre o custo, mas a folga é baixa.";
      action = "Busque preço melhor, reduza perdas ou corte custos.";
    } else {
      trafficLight = "green";
      message = "Preço acima do mínimo com margem de segurança.";
      action = "Avance com controle e mantenha os dados atualizados.";
    }
  }

  return {
    grossTechnicalProduction,
    sellableTechnicalProduction,
    commercialProduction,
    baseCost,
    contingencyValue,
    totalCost,
    minimumPrice,
    targetPrice,
    expectedRevenue,
    estimatedResult,
    realSafetyMargin,
    trafficLight,
    message,
    action,
    errors: unique(errors),
    warnings: unique(warnings),
  };
}
