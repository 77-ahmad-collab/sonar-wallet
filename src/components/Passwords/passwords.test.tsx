// import React from "react";
import {
  queryByAttribute,
  render,
  screen,
} from "@testing-library/react";
import Step1 from "./Step1";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
// import

describe("Landing screen should render", () => {
  it("can render landing screen", () => {
    const div = document.createElement("div");
    const getById = queryByAttribute.bind(null, "id");
    const dom = render(<Step1 changeStep={() => jest.fn()} currentStep={1} />);
    // const table = getById(dom.container, "test");
    // console.log(table?.id, "TABLE IS HERE", dom.getByText("test2"));
    // expect(table?.id).toMatch("test");
    const headingElement = screen.getByText("never been on this system", {
      exact: false,
    });

    console.log(headingElement);
    expect(headingElement).toBeInTheDocument();

    // screen.logTestingPlaygroundURL();
    // screen.logTestingPlaygroundURL(
    //   screen.getByText("never been on this system", { exact: false })
    // );
    // screen.getByRole("generic", { name: "I've never been on this system" });
    //  mount(
    //   <div>
    //     <h1>hellow owrd</h1>
    //   </div>
    // );
    // console.log(wrapper);
  });
});
