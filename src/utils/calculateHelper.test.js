import * as helper from "./calculateHelper";

const BRACKETS_2022 = {
  tax_brackets: [
    { min: 0, max: 50197, rate: 0.15 },
    { min: 50197, max: 100392, rate: 0.205 },
    { min: 100392, max: 155625, rate: 0.26 },
    { min: 155625, max: 221708, rate: 0.29 },
    { min: 221708, rate: 0.33 },
  ],
};

describe("calculateTax() (raw numeric output)", () => {
  it("returns zero totals for zero income", () => {
    const res = helper.calculateTax(BRACKETS_2022.tax_brackets, 0);
    expect(res.totalTax).toBe(0);
    expect(res.effectiveRate).toBe(0);
    res.perBand.forEach(b => {
      expect(b.taxable).toBe(0);
      expect(b.tax).toBe(0);
    });
  });

  it("handles typical mid-band income correctly", () => {
    const income = 90000;
    const res = helper.calculateTax(BRACKETS_2022.tax_brackets, income);

    expect(res.perBand[0].taxable).toBeCloseTo(50197, 2);
    expect(res.perBand[1].taxable).toBeCloseTo(income - 50197, 2);
    expect(res.perBand[2].taxable).toBeCloseTo(0, 6);

    const expected = 50197 * 0.15 + (income - 50197) * 0.205;
    expect(res.totalTax).toBeCloseTo(expected, 2);
    expect(res.effectiveRate).toBeCloseTo(expected / income, 5);
  });

  it("handles top open-ended band", () => {
    const res = helper.calculateTax(BRACKETS_2022.tax_brackets, 300000);
    expect(res.perBand.at(-1).taxable).toBeGreaterThan(0);
    expect(res.totalTax).toBeGreaterThan(0);
  });

  it("does not leak at exact band edge", () => {
    const res = helper.calculateTax(BRACKETS_2022.tax_brackets, 50197);
    expect(res.perBand[0].taxable).toBe(50197);
    expect(res.perBand[1].taxable).toBe(0);
    expect(res.totalTax).toBeCloseTo(50197 * 0.15, 2);
  });
});

describe("fetchTaxBrackets() retry behavior (Jest)", () => {
  const realFetch = global.fetch;

  beforeEach(() => { global.fetch = jest.fn(); });
  afterEach(() => { global.fetch = realFetch; jest.resetAllMocks(); });

  it("succeeds on first try", async () => {
    global.fetch.mockResolvedValueOnce(new Response(JSON.stringify(BRACKETS_2022), { status: 200 }));
    const data = await helper.fetchTaxBrackets(2022);
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:5001/tax-calculator/tax-year/2022");
    expect(data).toEqual(BRACKETS_2022);
  });

  it("retries failures and eventually succeeds", async () => {
    global.fetch
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce(new Response(JSON.stringify(BRACKETS_2022), { status: 200 }));
    const data = await helper.fetchTaxBrackets(2021);
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(data.tax_brackets.length).toBeGreaterThan(0);
  });

  it("throws after max retries", async () => {
    global.fetch
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockRejectedValueOnce(new Error("Network error"))
      .mockRejectedValueOnce(new Error("Network error"))
      .mockRejectedValueOnce(new Error("Network error"));
    await expect(helper.fetchTaxBrackets(2019)).rejects.toBeTruthy();
  });
});
