
const BRACKETS_2022 = {
  tax_brackets: [
    { min: 0, max: 50197, rate: 0.15 },
    { min: 50197, max: 100392, rate: 0.205 },
    { min: 100392, max: 155625, rate: 0.26 },
    { min: 155625, max: 221708, rate: 0.29 },
    { min: 221708, rate: 0.33 },
  ],
};

describe("Income Tax Calculator - E2E", () => {
  it("happy path: shows per-band table, total, and effective rate", () => {
    cy.intercept("GET", "http://localhost:5001/tax-calculator/tax-year/2022", {
      statusCode: 200,
      body: BRACKETS_2022,
    }).as("getBrackets");

    cy.visit("/");

    // Be flexible: find year select and number input by role
    cy.findByRole("combobox").select("2022");
    cy.findByRole("spinbutton").type("90000");

    cy.findByRole("button", { name: /calculate tax/i }).click();
    cy.wait("@getBrackets");

    cy.findByRole("table").should("exist");
    cy.findByText(/Total Payable Taxes:/i).should("exist");
    cy.findByText(/Effective Rate:/i).should("exist");
  });

  it("flaky API: first fails then succeeds (app retries)", () => {
    let calls = 0;
    cy.intercept("GET", "http://localhost:5001/tax-calculator/tax-year/2021", (req) => {
      calls += 1;
      if (calls === 1) req.reply({ statusCode: 500 });
      else req.reply({ statusCode: 200, body: BRACKETS_2022 });
    }).as("getBrackets21");

    cy.visit("/");
    cy.findByRole("combobox").select("2021");
    cy.findByRole("spinbutton").type("110000");
    cy.findByRole("button", { name: /calculate tax/i }).click();

    cy.wait("@getBrackets21");
    // after retry, success UI
    cy.findByRole("table").should("exist");
    cy.findByText(/Effective Rate:/i).should("exist");
  });

  it("permanent failure: shows GeneralError and no table", () => {
    cy.intercept("GET", "http://localhost:5001/tax-calculator/tax-year/2019", {
      statusCode: 500,
    }).as("getBrackets19");

    cy.visit("/");
    cy.findByRole("combobox").select("2019");
    cy.findByRole("spinbutton").type("75000");
    cy.findByRole("button", { name: /calculate tax/i }).click();

    cy.wait("@getBrackets19");

    cy.findByRole('heading', { name: /something went wrong/i }).should('be.visible');
    cy.findByText(/Please try again later/i).should("exist");
    cy.findByRole("table").should("not.exist");
  });

  it("client-side validation keeps button disabled until inputs are valid", () => {
    cy.visit("/");
    const button = () => cy.findByRole("button", { name: /calculate tax/i });

    button().should("be.disabled");
    cy.findByRole("combobox").select("2022");
    button().should("be.disabled");
    cy.findByRole("spinbutton").type("-1");
    button().should("be.disabled");

    cy.findByRole("spinbutton").clear().type("1000");
    button().should("be.enabled");
  });
});
