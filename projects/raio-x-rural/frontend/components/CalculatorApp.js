import { useEffect, useMemo, useState } from "react";
import {
  calculateMinimumPrice,
  isUnitBasedAnimalLot,
} from "@/projects/raio-x-rural/frontend/lib/calculator.js";
import { version } from "package.json";
import styles from "@/projects/raio-x-rural/frontend/styles/RaioX.module.css";

function cx(...classNames) {
  return classNames
    .filter(Boolean)
    .flatMap((name) => name.split(" "))
    .filter(Boolean)
    .map((name) => styles[name] || name)
    .join(" ");
}

const STORAGE_KEY = "mini-raio-x:calculator:v1";
const COST_FIELDS = [
  {
    key: "inputs",
    label: "Insumos / alimentação",
    help: "Adubo, ração, substrato, sementes e itens consumidos.",
  },
  {
    key: "acquisition",
    label: "Mudas, sementes ou animais",
    help: "Aquisição destinada ao ciclo calculado.",
  },
  {
    key: "labor",
    label: "Mão de obra",
    help: "Inclua trabalho contratado e familiar.",
  },
  {
    key: "energy",
    label: "Energia, água e combustível",
    help: "Irrigação, refrigeração, bombas e transporte.",
  },
  {
    key: "health",
    label: "Sanidade / defensivos",
    help: "Medicamentos, vacinas, defensivos e biológicos.",
  },
  {
    key: "services",
    label: "Serviços e mecanização",
    help: "Preparo, manejo, assistência e serviços terceirizados.",
  },
  {
    key: "structure",
    label: "Estrutura e rateios",
    help: "Aluguel, manutenção, ferramentas e depreciação.",
  },
  {
    key: "packaging",
    label: "Embalagem / beneficiamento",
    help: "Caixas, sacos, rótulos, seleção e processamento.",
  },
  {
    key: "freight",
    label: "Frete, comissão e taxas",
    help: "Considere o valor líquido que realmente sobra.",
  },
  {
    key: "other",
    label: "Outros custos",
    help: "Custos relevantes que não se encaixam acima.",
  },
  {
    key: "variablePerUnit",
    label: "Custo variável por unidade comercial",
    help: "Valor adicional por caixa, saca, litro, dúzia ou outra unidade.",
  },
];
const vegetableExample = {
  module: "Vegetal",
  selectedProduct: "Alface",
  customProduct: "",
  region: "Brasil",
  salesChannel: "Feira / venda local",
  technicalUnit: "cabeça",
  commercialUnit: "caixa",
  quantityPerUnit: 20,
  expectedPrice: 70,
  desiredMarginPercent: 20,
  contingencyPercent: 10,
  quoteSource: "Preço local / comprador",
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
const animalExample = {
  module: "Animal",
  selectedProduct: "Leite cru",
  customProduct: "",
  region: "Brasil",
  salesChannel: "Laticínio / cooperativa",
  technicalUnit: "litro",
  commercialUnit: "litro",
  quantityPerUnit: 1,
  expectedPrice: 2.85,
  desiredMarginPercent: 20,
  contingencyPercent: 5,
  quoteSource: "Comprador / cooperativa",
  quoteDate: "2026-07-11",
  area: "",
  productivity: "",
  informedGrossProduction: "",
  vegetableLossPercent: "",
  animalProductionType: "Contínua",
  animalCount: 14,
  averageDailyProduction: 3,
  periodDays: 30,
  averageSaleWeight: "",
  animalLossPercent: 6.6666667,
  costs: {
    inputs: 1850,
    acquisition: 0,
    labor: 500,
    energy: 180,
    health: 120,
    services: 0,
    structure: 150,
    packaging: 0,
    freight: 100,
    other: 0,
    variablePerUnit: 0,
  },
  checkedCosts: [],
};
const TRAFFIC_LIGHT_LABELS = {
  fill: "Preencher",
  red: "Vermelho",
  yellow: "Amarelo",
  green: "Verde",
};

function cloneExample(module) {
  return structuredClone(
    module === "Vegetal" ? vegetableExample : animalExample,
  );
}

function parseNumericInput(event) {
  return event.target.value === "" ? "" : Number(event.target.value);
}

function formatMoney(value) {
  if (value === null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatNumber(value, maximumFractionDigits = 2) {
  if (value === null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits,
  }).format(value);
}

function formatPercent(value) {
  if (value === null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value);
}

function Field({ label, help, required, children, className = "" }) {
  return (
    <label className={cx("field", className)}>
      <span className={cx("field-label")}>
        {label}
        {required ? <span className={cx("required-mark")}> *</span> : null}
      </span>
      {children}
      {help ? <span className={cx("field-help")}>{help}</span> : null}
    </label>
  );
}

function ResultMetric({ label, value, emphasis = false, detail }) {
  return (
    <div className={cx("result-metric", emphasis && "result-metric-emphasis")}>
      <span>{label}</span>
      <strong>{value}</strong>
      {detail ? <small>{detail}</small> : null}
    </div>
  );
}

function ProductNote({ preset }) {
  if (!preset) return null;
  return (
    <div className={cx("preset-note")}>
      <span className={cx("preset-note-icon")} aria-hidden="true">
        i
      </span>
      <div>
        <strong>Sugestão da base</strong>
        <p>{preset.note}</p>
        {preset.source ? (
          <a href={preset.source} target="_blank" rel="noreferrer">
            Consultar fonte de referência
          </a>
        ) : null}
      </div>
    </div>
  );
}

export function CalculatorApp({ products, checklist }) {
  const [form, setForm] = useState(() => cloneExample("Vegetal"));
  const [hydrated, setHydrated] = useState(false);
  const [copyState, setCopyState] = useState("idle");
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setForm((current) => ({
            ...current,
            ...parsed,
            costs: { ...current.costs, ...(parsed.costs ?? {}) },
            checkedCosts: Array.isArray(parsed.checkedCosts)
              ? parsed.checkedCosts
              : current.checkedCosts,
          }));
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      // A calculadora continua funcional mesmo quando o armazenamento é bloqueado.
    }
  }, [form, hydrated]);
  const filteredProducts = useMemo(
    () => products.filter((product) => product.module === form.module),
    [form.module, products],
  );
  const selectedPreset = useMemo(
    () =>
      products.find(
        (product) =>
          product.module === form.module &&
          product.product === form.selectedProduct,
      ),
    [form.module, form.selectedProduct, products],
  );
  const visibleChecklist = useMemo(
    () =>
      checklist.filter(
        (item) => item.module === form.module || item.module === "Ambos",
      ),
    [checklist, form.module],
  );
  const result = useMemo(() => calculateMinimumPrice(form), [form]);
  const unitBasedAnimalLot =
    form.module === "Animal" &&
    form.animalProductionType === "Lote" &&
    isUnitBasedAnimalLot(
      form.technicalUnit,
      form.commercialUnit,
      typeof form.quantityPerUnit === "number" ? form.quantityPerUnit : null,
    );
  const productName =
    form.selectedProduct === "__custom__"
      ? form.customProduct.trim() || "produto"
      : form.selectedProduct || "produto";
  const negotiationMessage = useMemo(() => {
    const minimum = result.minimumPrice
      ? formatMoney(result.minimumPrice)
      : "[preço mínimo]";
    const offered = form.expectedPrice
      ? formatMoney(Number(form.expectedPrice))
      : "[preço oferecido]";
    const proposed = result.targetPrice
      ? formatMoney(result.targetPrice)
      : "[preço proposto]";
    const situation =
      result.trafficLight === "red"
        ? "negativa"
        : result.trafficLight === "yellow"
          ? "apertada"
          : "com folga";
    return `Olá, [nome]. Revisei meus custos e a produção esperada de ${productName}.

Na unidade ${form.commercialUnit || "[unidade comercial]"}, meu preço mínimo estimado ficou em ${minimum}.

No valor de ${offered}, a margem fica ${situation}.

Consigo fechar a partir de ${proposed}, considerando [volume, prazo, retirada ou condição].

Podemos ajustar essa condição?`;
  }, [
    form.commercialUnit,
    form.expectedPrice,
    productName,
    result.minimumPrice,
    result.targetPrice,
    result.trafficLight,
  ]);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateCost(key, value) {
    setForm((current) => ({
      ...current,
      costs: { ...current.costs, [key]: value },
    }));
  }

  function chooseModule(module) {
    setForm(cloneExample(module));
    setCopyState("idle");
  }

  function chooseProduct(value) {
    if (value === "__custom__") {
      setForm((current) => ({
        ...current,
        selectedProduct: "__custom__",
        customProduct: "",
      }));
      return;
    }
    const preset = products.find(
      (product) => product.module === form.module && product.product === value,
    );
    if (!preset) return;
    setForm((current) => ({
      ...current,
      selectedProduct: preset.product,
      customProduct: "",
      technicalUnit: preset.technicalUnit,
      commercialUnit: preset.commercialUnit,
      quantityPerUnit: preset.quantityPerUnit,
      animalProductionType:
        preset.animalProductionType ?? current.animalProductionType,
    }));
  }

  function toggleChecklist(label) {
    setForm((current) => ({
      ...current,
      checkedCosts: current.checkedCosts.includes(label)
        ? current.checkedCosts.filter((item) => item !== label)
        : [...current.checkedCosts, label],
    }));
  }

  async function copyNegotiation() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(negotiationMessage);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = negotiationMessage;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2500);
    } catch {
      setCopyState("error");
    }
  }

  function clearSavedData() {
    window.localStorage.removeItem(STORAGE_KEY);
    setForm(cloneExample(form.module));
  }

  return (
    <div className={cx("page-shell")}>
      <header className={cx("hero")}>
        <div className={cx("hero-inner")}>
          <div className={cx("brand-row")}>
            <div className={cx("brand-mark")} aria-hidden="true">
              RX
            </div>
            <div>
              <span className={cx("eyebrow")}>
                Ferramenta de apoio à decisão
              </span>
              <h1>Mini Raio-X do Preço Mínimo</h1>
            </div>
          </div>
          <p className={cx("hero-copy")}>
            Descubra o menor preço que sua produção precisa receber para não
            vender no prejuízo — na mesma unidade em que você realmente negocia.
          </p>
          <div className={cx("hero-badges")} aria-label="Características">
            <span>Produção vegetal e animal</span>
            <span>Cálculo no navegador</span>
            <span>Sem cadastro</span>
          </div>
        </div>
      </header>

      <main className={cx("main-content")}>
        <section className={cx("orientation-card")} aria-labelledby="como-usar">
          <div>
            <span className={cx("section-kicker")}>Antes de começar</span>
            <h2 id="como-usar">Preencha em três etapas</h2>
            <p>
              Use dados reais do ciclo ou período. O resultado depende da
              produção vendável, dos custos completos e do preço líquido que
              entra no seu bolso.
            </p>
          </div>
          <ol className={cx("steps")}>
            <li>
              <span>1</span>
              <div>
                <strong>Venda</strong>
                <small>Produto, unidade e preço</small>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>Produção</strong>
                <small>Volume e perdas</small>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>Custos</strong>
                <small>Ciclo ou período</small>
              </div>
            </li>
          </ol>
        </section>

        <div className={cx("calculator-layout")}>
          <div className={cx("form-column")}>
            <section className={cx("card")} aria-labelledby="dados-venda">
              <div className={cx("card-heading")}>
                <span className={cx("step-number")}>1</span>
                <div>
                  <span className={cx("section-kicker")}>Dados gerais</span>
                  <h2 id="dados-venda">Como você vende?</h2>
                </div>
              </div>

              <div
                className={cx("module-switch")}
                aria-label="Módulo de produção"
              >
                {["Vegetal", "Animal"].map((module) => (
                  <button
                    type="button"
                    key={module}
                    className={form.module === module ? styles.active : ""}
                    aria-pressed={form.module === module}
                    onClick={() => chooseModule(module)}
                  >
                    <span aria-hidden="true">
                      {module === "Vegetal" ? "◒" : "◇"}
                    </span>
                    Produção {module.toLowerCase()}
                  </button>
                ))}
              </div>

              <div className={cx("form-grid")}>
                <Field
                  label="Produto ou atividade"
                  help="Escolha uma sugestão ou informe outro produto."
                  required
                  className={cx("span-2")}
                >
                  <select
                    value={form.selectedProduct}
                    onChange={(event) => chooseProduct(event.target.value)}
                  >
                    <option value="" disabled>
                      Selecione um produto
                    </option>
                    {filteredProducts.map((product) => (
                      <option key={product.product} value={product.product}>
                        {product.product} — {product.category}
                      </option>
                    ))}
                    <option value="__custom__">
                      Outro produto / atividade
                    </option>
                  </select>
                </Field>

                {form.selectedProduct === "__custom__" ? (
                  <Field
                    label="Nome do produto"
                    required
                    className={cx("span-2 compact-top")}
                  >
                    <input
                      type="text"
                      value={form.customProduct}
                      onChange={(event) =>
                        update("customProduct", event.target.value)
                      }
                      placeholder="Ex.: Cogumelo, queijo artesanal..."
                    />
                  </Field>
                ) : null}

                <Field label="Estado / região" help="Texto livre.">
                  <input
                    type="text"
                    value={form.region}
                    onChange={(event) => update("region", event.target.value)}
                    placeholder="Ex.: Sul de Minas"
                  />
                </Field>

                <Field label="Canal de venda">
                  <input
                    type="text"
                    value={form.salesChannel}
                    onChange={(event) =>
                      update("salesChannel", event.target.value)
                    }
                    placeholder="Feira, mercado, cooperativa..."
                  />
                </Field>

                <Field
                  label="Unidade comercial"
                  help="Como você vende e recebe."
                  required
                >
                  <input
                    type="text"
                    value={form.commercialUnit}
                    onChange={(event) =>
                      update("commercialUnit", event.target.value)
                    }
                    placeholder="caixa, saca, litro..."
                  />
                </Field>

                <Field
                  label="Quantidade por unidade"
                  help={`Quantidade de ${form.technicalUnit || "produto"} em cada ${form.commercialUnit || "unidade"}.`}
                  required
                >
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.quantityPerUnit}
                    onChange={(event) =>
                      update("quantityPerUnit", parseNumericInput(event))
                    }
                    inputMode="decimal"
                  />
                </Field>

                <Field
                  label={`Preço líquido esperado por ${form.commercialUnit || "unidade"}`}
                  help="Valor que realmente entra, após frete, comissão e taxas."
                  required
                >
                  <div className={cx("input-prefix")}>
                    <span>R$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.expectedPrice}
                      onChange={(event) =>
                        update("expectedPrice", parseNumericInput(event))
                      }
                      inputMode="decimal"
                    />
                  </div>
                </Field>

                <Field
                  label="Margem de segurança desejada"
                  help="Percentual acima do preço mínimo."
                >
                  <div className={cx("input-suffix")}>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={form.desiredMarginPercent}
                      onChange={(event) =>
                        update("desiredMarginPercent", parseNumericInput(event))
                      }
                      inputMode="decimal"
                    />
                    <span>%</span>
                  </div>
                </Field>

                <Field label="Fonte da cotação">
                  <input
                    type="text"
                    value={form.quoteSource}
                    onChange={(event) =>
                      update("quoteSource", event.target.value)
                    }
                    placeholder="Comprador, CEASA, cooperativa..."
                  />
                </Field>

                <Field label="Data da cotação">
                  <input
                    type="date"
                    value={form.quoteDate}
                    onChange={(event) =>
                      update("quoteDate", event.target.value)
                    }
                  />
                </Field>
              </div>

              <ProductNote preset={selectedPreset} />
            </section>

            <section className={cx("card")} aria-labelledby="dados-producao">
              <div className={cx("card-heading")}>
                <span className={cx("step-number")}>2</span>
                <div>
                  <span className={cx("section-kicker")}>Produção</span>
                  <h2 id="dados-producao">Quanto sobra para vender?</h2>
                </div>
              </div>

              {form.module === "Vegetal" ? (
                <div className={cx("form-grid")}>
                  <Field
                    label="Unidade técnica"
                    help="Unidade usada para medir a produção bruta."
                  >
                    <input
                      type="text"
                      value={form.technicalUnit}
                      onChange={(event) =>
                        update("technicalUnit", event.target.value)
                      }
                      placeholder="kg, cabeça, maço..."
                    />
                  </Field>

                  <Field
                    label="Produção bruta informada"
                    help="Prevalece sobre área × produtividade."
                    required
                  >
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={form.informedGrossProduction}
                      onChange={(event) =>
                        update(
                          "informedGrossProduction",
                          parseNumericInput(event),
                        )
                      }
                      inputMode="decimal"
                    />
                  </Field>

                  <div className={cx("field-divider span-2")}>
                    <span>ou calcule por área e produtividade</span>
                  </div>

                  <Field
                    label="Área planejada"
                    help="Use uma unidade consistente."
                  >
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={form.area}
                      onChange={(event) =>
                        update("area", parseNumericInput(event))
                      }
                      inputMode="decimal"
                    />
                  </Field>

                  <Field
                    label="Produtividade bruta"
                    help="Produção técnica por unidade de área."
                  >
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={form.productivity}
                      onChange={(event) =>
                        update("productivity", parseNumericInput(event))
                      }
                      inputMode="decimal"
                    />
                  </Field>

                  <Field
                    label="Perda esperada"
                    help="Campo, seleção, descarte e pós-colheita. Máximo 80%."
                    className={cx("span-2")}
                  >
                    <div className={cx("input-suffix")}>
                      <input
                        type="number"
                        min="0"
                        max="80"
                        step="0.1"
                        value={form.vegetableLossPercent}
                        onChange={(event) =>
                          update(
                            "vegetableLossPercent",
                            parseNumericInput(event),
                          )
                        }
                        inputMode="decimal"
                      />
                      <span>%</span>
                    </div>
                  </Field>
                </div>
              ) : (
                <div className={cx("form-grid")}>
                  <Field label="Tipo de produção" required>
                    <select
                      value={form.animalProductionType}
                      onChange={(event) =>
                        update("animalProductionType", event.target.value)
                      }
                    >
                      <option value="Contínua">Contínua</option>
                      <option value="Lote">Por lote</option>
                    </select>
                  </Field>

                  <Field label="Unidade técnica">
                    <input
                      type="text"
                      value={form.technicalUnit}
                      onChange={(event) =>
                        update("technicalUnit", event.target.value)
                      }
                      placeholder="litro, ovo, kg..."
                    />
                  </Field>

                  <Field label="Nº de animais, matrizes ou colmeias" required>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={form.animalCount}
                      onChange={(event) =>
                        update("animalCount", parseNumericInput(event))
                      }
                      inputMode="decimal"
                    />
                  </Field>

                  {form.animalProductionType === "Contínua" ? (
                    <>
                      <Field label="Produção média por animal/dia" required>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={form.averageDailyProduction}
                          onChange={(event) =>
                            update(
                              "averageDailyProduction",
                              parseNumericInput(event),
                            )
                          }
                          inputMode="decimal"
                        />
                      </Field>
                      <Field label="Dias do período" required>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={form.periodDays}
                          onChange={(event) =>
                            update("periodDays", parseNumericInput(event))
                          }
                          inputMode="numeric"
                        />
                      </Field>
                    </>
                  ) : unitBasedAnimalLot ? (
                    <div className={cx("unit-lot-note")}>
                      <strong>Lote vendido por unidade</strong>
                      <span>
                        A produção vendável será calculada pelo número de
                        animais após a mortalidade ou descarte.
                      </span>
                    </div>
                  ) : (
                    <Field label="Peso médio de venda" required>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={form.averageSaleWeight}
                        onChange={(event) =>
                          update("averageSaleWeight", parseNumericInput(event))
                        }
                        inputMode="decimal"
                      />
                    </Field>
                  )}

                  <Field
                    label="Mortalidade, descarte ou perda"
                    help="Informe o percentual que não será vendido."
                  >
                    <div className={cx("input-suffix")}>
                      <input
                        type="number"
                        min="0"
                        max="99.99"
                        step="0.1"
                        value={form.animalLossPercent}
                        onChange={(event) =>
                          update("animalLossPercent", parseNumericInput(event))
                        }
                        inputMode="decimal"
                      />
                      <span>%</span>
                    </div>
                  </Field>
                </div>
              )}

              <div className={cx("production-preview")}>
                <div>
                  <span>Produção bruta técnica</span>
                  <strong>
                    {formatNumber(result.grossTechnicalProduction)}{" "}
                    {form.technicalUnit}
                  </strong>
                </div>
                <span className={cx("preview-arrow")} aria-hidden="true">
                  →
                </span>
                <div>
                  <span>Produção vendável</span>
                  <strong>
                    {formatNumber(result.commercialProduction)}{" "}
                    {form.commercialUnit}
                  </strong>
                </div>
              </div>
            </section>

            <section className={cx("card")} aria-labelledby="dados-custos">
              <div className={cx("card-heading")}>
                <span className={cx("step-number")}>3</span>
                <div>
                  <span className={cx("section-kicker")}>Custos</span>
                  <h2 id="dados-custos">Quanto custa produzir e vender?</h2>
                </div>
              </div>

              <p className={cx("section-intro")}>
                Informe o valor total do ciclo ou período. Não zere mão de obra
                familiar e não esqueça embalagem, frete, comissão e rateios.
              </p>

              <div className={cx("cost-grid")}>
                {COST_FIELDS.map((cost) => (
                  <Field
                    key={cost.key}
                    label={cost.label}
                    help={cost.help}
                    className={
                      cost.key === "variablePerUnit" ? styles["span-2"] : ""
                    }
                  >
                    <div className={cx("input-prefix")}>
                      <span>R$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.costs[cost.key]}
                        onChange={(event) =>
                          updateCost(cost.key, parseNumericInput(event))
                        }
                        inputMode="decimal"
                      />
                    </div>
                  </Field>
                ))}

                <Field
                  label="Reserva para imprevistos"
                  help="Recomendação editável; limite de 50%."
                  className={cx("span-2")}
                >
                  <div className={cx("input-suffix")}>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="0.1"
                      value={form.contingencyPercent}
                      onChange={(event) =>
                        update("contingencyPercent", parseNumericInput(event))
                      }
                      inputMode="decimal"
                    />
                    <span>%</span>
                  </div>
                </Field>
              </div>

              <details className={cx("checklist")}>
                <summary>
                  <span>
                    Checklist para não esquecer custos
                    <small>
                      {form.checkedCosts.length} de {visibleChecklist.length}{" "}
                      conferidos
                    </small>
                  </span>
                  <span aria-hidden="true">+</span>
                </summary>
                <div className={cx("checklist-grid")}>
                  {visibleChecklist.map((item) => (
                    <label key={`${item.module}-${item.label}`}>
                      <input
                        type="checkbox"
                        checked={form.checkedCosts.includes(item.label)}
                        onChange={() => toggleChecklist(item.label)}
                      />
                      <span>
                        <strong>{item.label}</strong>
                        <small>{item.note}</small>
                      </span>
                    </label>
                  ))}
                </div>
              </details>
            </section>

            <section
              className={cx("card negotiation-card")}
              aria-labelledby="negociacao"
            >
              <div className={cx("card-heading compact")}>
                <span className={cx("step-number neutral")}>✓</span>
                <div>
                  <span className={cx("section-kicker")}>Próximo passo</span>
                  <h2 id="negociacao">Modelo para negociação</h2>
                </div>
              </div>
              <p>
                Revise os valores e ajuste os campos entre colchetes antes de
                enviar. O modelo não garante fechamento ou melhoria de preço.
              </p>
              <pre>{negotiationMessage}</pre>
              <button
                type="button"
                className={cx("secondary-button")}
                onClick={copyNegotiation}
                disabled={!result.minimumPrice}
              >
                {copyState === "copied"
                  ? "Mensagem copiada"
                  : copyState === "error"
                    ? "Não foi possível copiar"
                    : "Copiar mensagem"}
              </button>
            </section>
          </div>

          <aside className={cx("results-column")} aria-labelledby="resultado">
            <div
              className={cx("results-card", `status-${result.trafficLight}`)}
              aria-live="polite"
            >
              <div className={cx("results-heading")}>
                <div>
                  <span className={cx("section-kicker")}>
                    Resultado automático
                  </span>
                  <h2 id="resultado">Seu raio-X</h2>
                </div>
                <span className={cx("save-state")}>
                  {hydrated ? "Dados salvos neste navegador" : "Carregando"}
                </span>
              </div>

              <div className={cx("traffic-light")}>
                <div className={cx("traffic-light-icon")} aria-hidden="true">
                  <span className={cx("light red")} />
                  <span className={cx("light yellow")} />
                  <span className={cx("light green")} />
                </div>
                <div>
                  <span>Semáforo</span>
                  <strong>{TRAFFIC_LIGHT_LABELS[result.trafficLight]}</strong>
                  <p>{result.message}</p>
                </div>
              </div>

              <div className={cx("primary-result")}>
                <span>Preço mínimo por {form.commercialUnit || "unidade"}</span>
                <strong>{formatMoney(result.minimumPrice)}</strong>
                <small>Menor valor estimado para cobrir o custo total.</small>
              </div>

              <div className={cx("result-grid")}>
                <ResultMetric
                  label="Preço alvo"
                  value={formatMoney(result.targetPrice)}
                  detail={`Com ${formatNumber(
                    typeof form.desiredMarginPercent === "number"
                      ? form.desiredMarginPercent
                      : 0,
                    1,
                  )}% de margem`}
                  emphasis
                />
                <ResultMetric
                  label="Produção vendável"
                  value={`${formatNumber(result.commercialProduction)} ${form.commercialUnit || ""}`}
                />
                <ResultMetric
                  label="Custo base"
                  value={formatMoney(result.baseCost)}
                />
                <ResultMetric
                  label="Reserva"
                  value={formatMoney(result.contingencyValue)}
                />
                <ResultMetric
                  label="Custo total"
                  value={formatMoney(result.totalCost)}
                  emphasis
                />
                <ResultMetric
                  label="Receita esperada"
                  value={formatMoney(result.expectedRevenue)}
                />
                <ResultMetric
                  label="Resultado estimado"
                  value={formatMoney(result.estimatedResult)}
                  emphasis
                />
                <ResultMetric
                  label="Margem real"
                  value={formatPercent(result.realSafetyMargin)}
                />
              </div>

              <div className={cx("recommended-action")}>
                <strong>O que fazer agora</strong>
                <p>{result.action}</p>
              </div>

              {result.errors.length > 0 ? (
                <div className={cx("validation-box error-box")}>
                  <strong>Revise antes de decidir</strong>
                  <ul>
                    {result.errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {result.warnings.length > 0 ? (
                <div className={cx("validation-box warning-box")}>
                  <strong>Pontos de atenção</strong>
                  <ul>
                    {result.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className={cx("results-actions")}>
                <button
                  type="button"
                  className={cx("primary-button")}
                  onClick={() => window.print()}
                >
                  Imprimir resumo
                </button>
                <button
                  type="button"
                  className={cx("text-button")}
                  onClick={clearSavedData}
                >
                  Restaurar exemplo
                </button>
              </div>
            </div>

            <div className={cx("limits-card")}>
              <strong>Limites importantes</strong>
              <p>
                Esta é uma ferramenta educativa de apoio. O resultado depende
                dos dados informados e não garante lucro, venda, crédito ou
                ausência de prejuízo.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <footer>
        <p>
          ® Mini Raio-X do Preço Mínimo Versão {version}· Revise os dados sempre
          que custos, produção, perdas, canal ou cotação mudarem.
        </p>
      </footer>
    </div>
  );
}
