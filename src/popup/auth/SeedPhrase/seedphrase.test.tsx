import React from "react";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";

import { render, screen } from "@testing-library/react";
import Seedphrase from ".";
import userEvent from "@testing-library/user-event";

import { MockApp } from "../../../index";
import * as hooks from "../../../hooks";
jest.mock("../../../hooks", () => {
  return {
    __esModule: true, //    <----- this __esModule: true is important
    ...jest.requireActual("../../../hooks"),
  };
});
describe("It will test the seedphrase screens", () => {
  let useSeedPhrase: jest.SpyInstance<
    {
      onBackPress: () => Promise<void>;
      step: number;
      setStep: React.Dispatch<React.SetStateAction<number>>;
    },
    []
  > | null = null;
  beforeAll(() => {
    useSeedPhrase = jest.spyOn(hooks, "useSeedPhrase");
  });
  beforeEach(() => {
    useSeedPhrase?.mockClear();
  });
  it("can verify the the content and behaviour of first screen", async () => {
    useSeedPhrase?.mockImplementation(() => ({
      onBackPress: jest.fn(),
      step: 1,
      setStep: jest.fn(),
    }));
    render(
      <MockApp>
        <Seedphrase />
      </MockApp>
    );

    const headingElement = screen.queryByText("Your Secret Phrase");
    const tapToRevealDiv = screen.queryByTestId("Tap-to-reveal");
    const GotItButton = screen.queryByRole("button", {
      name: /got it/i,
    });
    const letsGoButton = screen.queryByRole("button", {
      name: /let's go/i,
    });
    expect(headingElement).toBeInTheDocument();
    expect(tapToRevealDiv).toBeInTheDocument();
    expect(GotItButton).toBeDisabled();
    expect(letsGoButton).toBeNull();
  });
  it("It will reveal the seedphrase and can move ahead", async () => {
    useSeedPhrase?.mockImplementation(() => ({
      onBackPress: jest.fn(),
      step: 1,
      setStep: jest.fn(),
    }));
    render(
      <MockApp>
        <Seedphrase />
      </MockApp>
    );
    const tapToRevealDiv = screen.getByTestId("Tap-to-reveal");
    const GotItButton = screen.getByRole("button", {
      name: /got it/i,
    });
    await userEvent.click(tapToRevealDiv);
    expect(GotItButton).not.toBeDisabled();
    expect(tapToRevealDiv).not.toBeInTheDocument();
    await userEvent.click(GotItButton);
    const letsGoButtonEnabled = screen.queryByRole("button", {
      name: /let's go/i,
    });
    expect(letsGoButtonEnabled).toBeInTheDocument();
  });
});

describe("can render the confirm seedphrase screen", () => {
  let useSeedPhrase: jest.SpyInstance<
    {
      onBackPress: () => Promise<void>;
      step: number;
      setStep: React.Dispatch<React.SetStateAction<number>>;
    },
    []
  > | null = null;
  let useSeedPhraseStep2: jest.SpyInstance<
    {
      seedPhrase: string[];
      isSeedPhraseCorrect: boolean;
      setSeedPhrase: React.Dispatch<React.SetStateAction<string[]>>;
      shuffledMnemonic: string[];
      setSeedPhraseIndex: React.Dispatch<React.SetStateAction<number[]>>;
      seedPhraseIndex: number[];
      confirmSeedPhrase: (value: string, index: number) => void;
      handleSeedPhrase: () => Promise<void>;
      animationState: string;
    },
    []
  > | null = null;
  beforeAll(() => {
    useSeedPhrase = jest.spyOn(hooks, "useSeedPhrase");
    useSeedPhraseStep2 = jest.spyOn(hooks, "useSeedPhraseStep2");
  });
  beforeEach(() => {
    useSeedPhrase?.mockClear();
    useSeedPhraseStep2?.mockClear();
  });
  const mockedState = {
    animationState: "fade",
    seedPhrase: [
      "pigeon",
      "language",
      "blur",
      "blast",
      "artist",
      "behind",
      "arrive",
      "layer",
      "party",
      "deputy",
      "legal",
      "put",
    ],
    isSeedPhraseCorrect: false,
    setSeedPhrase: jest.fn(),
    shuffledMnemonic: [
      "pigeon",
      "language",
      "blur",
      "blast",
      "artist",
      "behind",
      "arrive",
      "layer",
      "party",
      "deputy",
      "legal",
      "put",
    ],
    confirmSeedPhrase: jest.fn(),
    handleSeedPhrase: jest.fn(),
    seedPhraseIndex: [],
    setSeedPhraseIndex: jest.fn(),
  };
  it("can have the content on the confirm seedphrase screen before verification", () => {
    useSeedPhrase?.mockImplementation(() => ({
      onBackPress: jest.fn(),
      step: 2,
      setStep: jest.fn(),
    }));
    useSeedPhraseStep2?.mockImplementation(() => mockedState);
    render(
      <MockApp>
        <Seedphrase />
      </MockApp>
    );
    const confirmSeedPhraseText = screen.queryByText(/confirm seedphrase/i);
    const tapWordText = screen.queryByText(
      /tap the words in the correct order/i
    );
    const seedphraseVerifiedMessage = screen.queryByText(/You got this/i);
    expect(confirmSeedPhraseText).toBeInTheDocument();
    expect(tapWordText).toBeInTheDocument();
    expect(seedphraseVerifiedMessage).not.toBeInTheDocument();
  });

  it("can have the content after the seedphrase verification", () => {
    const mockedStateAfterSeedphraseVerification = {
      ...mockedState,
      animationState: "appear",
    };
    useSeedPhraseStep2?.mockImplementation(
      () => mockedStateAfterSeedphraseVerification
    );
    render(
      <MockApp>
        <Seedphrase />
      </MockApp>
    );
    screen.logTestingPlaygroundURL();
    const seedphraseVerifiedMessage = screen.queryByText(/You got this/i);
    const nextButton = screen.queryByRole("button", {
      name: /Next/i,
    });
    expect(seedphraseVerifiedMessage).toBeInTheDocument();
    expect(nextButton).not.toBeDisabled();
  });
});
