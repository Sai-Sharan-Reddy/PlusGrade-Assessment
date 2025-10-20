import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import TaxForm from "./TaxForm";

jest.mock("../../utils/calculateHelper", () => ({
  fetchTaxBrackets: jest.fn(async () => ({
    tax_brackets: [
      { min: 0, max: 50197, rate: 0.15 },
      { min: 50197, max: 100392, rate: 0.205 },
      { min: 100392, max: 155625, rate: 0.26 },
      { min: 155625, max: 221708, rate: 0.29 },
      { min: 221708, rate: 0.33 },
    ],
  })),
  // calculateTax: jest.fn(() => ({
  //   perBand: [
  //     { from: 0, to: 50197, rate: 0.15, taxable: 50197, tax: 7529.55 },
  //     { from: 50197, to: 100392, rate: 0.205, taxable: 39803, tax: 8159.62 },
  //   ],
  //   totalTax: 15689.17,
  //   formatedTotal: "$15,689.17",
  //   effectiveRate: "17.43%",
  // })),
   calculateTax: jest.fn(() => ({
    perBand: [],
    totalTax: 15689.17,
    effectiveRate: 0.1743,
  })),
}));

const findYearSelect = () => screen.getByRole("combobox");
const findIncomeInput = () => screen.getByRole("spinbutton");
const findSubmitButton = () => screen.getByRole("button");


describe("<TaxForm />", () => {
  const setup = () => {
    const props = {
      updateCalculatedTax: jest.fn(),
      updateLoading: jest.fn(),
      updateError: jest.fn(),
    };
    render(<TaxForm {...props} />);
    return props;
  };

  it("disables submit until year and income provided", async () => {
    setup();
    const btn = findSubmitButton();
    expect(btn).toBeDisabled();

    await user.selectOptions(findYearSelect(), "2022");
    expect(btn).toBeDisabled();

    await user.type(findIncomeInput(), "90000");
    expect(btn).toBeEnabled();
  });

it("calls parent callbacks on success", async () => {
  const props = setup();

  await user.selectOptions(findYearSelect(), "2022");
  await user.type(findIncomeInput(), "90000");
  await user.click(findSubmitButton());

  // Wait for async fetch + calculateTax to complete
  await waitFor(() =>
    expect(props.updateCalculatedTax).toHaveBeenCalledWith(
      expect.objectContaining({
        totalTax: expect.any(Number),
        effectiveRate: expect.any(Number),
      })
    )
  );

  // Ensure all callbacks were triggered as expected
  expect(props.updateLoading).toHaveBeenCalledWith(true);
  expect(props.updateLoading).toHaveBeenCalledWith(false);
  expect(props.updateError).toHaveBeenCalledWith(false);
});


  it("surfaces API errors via updateError", async () => {
    const { fetchTaxBrackets } = require("../../utils/calculateHelper");
    fetchTaxBrackets.mockRejectedValueOnce(new Error("flaky api"));

    const props = setup();
    await user.selectOptions(findYearSelect(), "2021");
    await user.type(findIncomeInput(), "110000");
    await user.click(findSubmitButton());

    await waitFor(() => {
      expect(props.updateError).toHaveBeenCalledWith(true);
      expect(props.updateLoading).toHaveBeenCalledWith(false);
    });
  });
});
