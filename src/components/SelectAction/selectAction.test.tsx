import React from "react";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

import SelectAction from ".";
import { MockApp } from "../../index";

describe("User has the option of creating a new wallet or import a wallet", () => {
  it("can display the screen for the user to select an option", () => {
    render(
      <MockApp>
        <SelectAction />
      </MockApp>
    );

    const welcomeMessage = screen.queryByText(/welcome to/i);
    const images = document.querySelectorAll(
      "img"
    ) as NodeListOf<HTMLImageElement>;
    const createNewWalletOption = screen.queryByText(
      /start with a new wallet/i
    );
    const importWalletOption = screen.queryByText(/import your wallet/i);
    screen.logTestingPlaygroundURL();
    expect(welcomeMessage).toBeInTheDocument();
    expect(images[0].alt).toContain("SonarWalletLogo");
    expect(images[1].alt).toContain("Web3Logo");
    expect(createNewWalletOption).toBeInTheDocument();
    expect(importWalletOption).toBeInTheDocument();
    screen.logTestingPlaygroundURL();
  });

  it("User has created a new wallet", async () => {
    // jest.setTimeout(10000);
    render(
      <MockApp>
        <SelectAction />
      </MockApp>
    );
    console.log(
      "run------------------------------------------------------------"
    );

    const createNewWalletOption = screen.getByText(/start with a new wallet/i);
    screen.logTestingPlaygroundURL(createNewWalletOption);
    // screen.logTestingPlaygroundURL();
    // const user = userEvent.setup({ delay: null });
    // jest.useFakeTimers();
    // await user.click(createNewWalletOption);
    // act(() => {
    //   jest.runAllTimers();
    // });

    // const importWalletOption = screen.queryByText(/import your wallet/i);
    // const images = document.querySelectorAll(
    //   "img"
    // ) as NodeListOf<HTMLImageElement>;

    // const createNewWalletOptionInwhileCreatingWallet = screen.queryByText(
    //   /start with a new wallet/i
    // );

    // // expect(importWalletOption).not.toBeInTheDocument();
    // // expect(images[2].alt).toContain("rainbow image");
    // // expect(createNewWalletOptionInwhileCreatingWallet).not.toBeInTheDocument();
    // setTimeout(() => {
    //   screen.logTestingPlaygroundURL();
    //   //  done();
    // }, 2000);
    // screen.debug();
    // screen.logTestingPlaygroundURL();
    // jest.useRealTimers();
  });
});
