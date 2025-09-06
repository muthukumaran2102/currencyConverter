import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import App from "./App";
import { getData } from "./apiCall/api";

jest.mock("./components/Input", () => ({
  __esModule: true,
  default: (props: any) =>
    React.createElement("input", {
      "data-testid": "input",
      name: props.name,
      value: props.value,
      onChange: props.onChange,
    }),
}));

jest.mock("./components/DropDown", () => ({
  __esModule: true,
  default: (props: any) =>
    React.createElement(
      "select",
      {
        "data-testid": props.name,
        value: props.selectedValue.value,
        onChange: (e: any) =>
          props.onSelect(
            { value: e.target.value, label: e.target.value, flag: "" },
            props.name
          ),
      },
      [
        React.createElement(
          "option",
          { key: "", value: "" },
          "Choose a country"
        ),
        ...props.options.map((opt: any) =>
          React.createElement(
            "option",
            { key: opt.value, value: opt.value },
            opt.label
          )
        ),
      ]
    ),
}));

jest.mock("./components/Button", () => ({
  __esModule: true,
  default: (props: any) =>
    React.createElement(
      "button",
      { "data-testid": "convert-btn", onClick: props.onClick },
      props.children
    ),
}));

jest.mock("./components/CountDown", () => ({
  __esModule: true,
  default: () => React.createElement("div", { "data-testid": "timer" }),
}));

jest.mock("./apiCall/api", () => ({
  getData: jest.fn(),
}));


const mockCurrencies = {
  USD: "United States Dollar",
  GBP: "British Pound Sterling",
  EUR: "Euro",
};
const mockRates = {
  USD: 1.25,
  GBP: 1,
  EUR: 1.15,
};

describe("App business logic", () => {
  beforeEach(() => {
    (getData as jest.Mock).mockImplementation(url => {
      if (url.includes("currencies")) {
        return Promise.resolve({ data: mockCurrencies });
      }
      if (url.includes("latest/GBP")) {
        return Promise.resolve({ data: { rates: mockRates } });
      }
      return Promise.resolve({});
    });
  });

  it("shows error when required fields are empty", async () => {
  render(<App />);
  await waitFor(() => screen.getByTestId("convert-btn"));
  fireEvent.click(screen.getByTestId("convert-btn"));
  expect(
    screen.getByText((content) => content.includes("This field is required !"))
  ).toBeInTheDocument();
});

  it("shows error for invalid number input", async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId("input"));
    fireEvent.change(screen.getByTestId("input"), {
      target: { name: "money", value: "abc" },
    });
    fireEvent.click(screen.getByTestId("convert-btn"));
    // expect(screen.getByText(/is not a valid number/i)).toBeInTheDocument();
    expect(
  screen.getByText((content) => content.includes("is not a valid number"))
).toBeInTheDocument();
  });

  it("shows error if countries are not selected", async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId("input"));
    fireEvent.change(screen.getByTestId("input"), {
      target: { name: "money", value: "100" },
    });
    fireEvent.click(screen.getByTestId("convert-btn"));
    // expect(screen.getAllByText(/This field is required !/i).length).toBeGreaterThan(1);
    expect(
    screen.getByText((content) => content.includes("This field is required !"))
  ).toBeGreaterThan(1);
  });

  it("calculates and displays conversion result for valid input", async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId("input"));
    // Enter amount
    fireEvent.change(screen.getByTestId("input"), {
      target: { name: "money", value: "100" },
    });
    // Select fromCountry
    fireEvent.change(screen.getByTestId("fromCountry"), {
      target: { value: "GBP" },
    });
    // Select toCountry
    fireEvent.change(screen.getByTestId("toCountry"), {
      target: { value: "USD" },
    });
    // Click convert
    fireEvent.click(screen.getByTestId("convert-btn"));
    await waitFor(() =>
      expect(
        screen.getByText(/100 GBP is equivalent to 125.00 USD/i)
      ).toBeInTheDocument()
    );
  });

  it("does not calculate if rates are missing", async () => {
    (getData as jest.Mock).mockImplementation(url => {
      if (url.includes("currencies")) {
        return Promise.resolve({ data: mockCurrencies });
      }
      if (url.includes("latest/GBP")) {
        return Promise.resolve({ data: { rates: {} } });
      }
      return Promise.resolve({});
    });
    render(<App />);
    await waitFor(() => screen.getByTestId("input"));
    fireEvent.change(screen.getByTestId("input"), {
      target: { name: "money", value: "100" },
    });
    fireEvent.change(screen.getByTestId("fromCountry"), {
      target: { value: "GBP" },
    });
    fireEvent.change(screen.getByTestId("toCountry"), {
      target: { value: "USD" },
    });
    fireEvent.click(screen.getByTestId("convert-btn"));
    expect(
      screen.queryByText(/is equivalent to/i)
    ).not.toBeInTheDocument();
  });
});