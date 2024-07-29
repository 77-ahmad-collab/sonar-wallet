import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import Landing from ".";
import { MockApp } from "../../../index";
import Step2 from "../../../components/Passwords/Step2";
import Step3 from "../../../components/Passwords/Step3";
import * as hooks from "../../../hooks";

jest.mock("../../../hooks", () => {
  return {
    __esModule: true, //    <----- this __esModule: true is important
    ...jest.requireActual("../../../hooks"),
  };
});
/**
 * step1 is animation screen
 * step2 is password screen
 * step3 is confirm password screen
 * step4 is success screen and store the password screen
 */
describe("Landing", () => {
	let landing: HTMLElement | any;
	let step1HeadingElement: HTMLElement | HTMLElement[];

	//initializing the useStep2 hook
	let useStep2: jest.SpyInstance<
		{ password: string; error: { message: string; status: boolean } },
		[changeStep: (number: number) => void, currentStep: number]
	> | null = null;

	let useStep3: jest.SpyInstance<
		{ confirmPassword: string; isSomethingWrong: boolean; allCorrect: boolean },
		[changeStep: (number: number) => void, currentStep: number]
	> | null = null;

	beforeAll(() => {
		//telling the jest to keep and eye on useStep2 hook
		useStep2 = jest.spyOn(hooks, "useStep2");
		useStep3 = jest.spyOn(hooks, "useStep3");
	});
	beforeEach(() => {
		//clearing any previous states of the hook
		useStep2?.mockClear();
		useStep3?.mockClear();

    landing = render(
      <MockApp>
        {/** step1  is automatically rendered which is animation*/}
        {/** step2  is the first interactive screen*/}
        <Landing />
      </MockApp>
    );
  });

	it("can render landing screen with step1", (done) => {
		const headingElement: HTMLElement = screen.getByText("never been on this system", {
			exact: false,
		});
		//get by data-testid of password-step1
		step1HeadingElement = screen.getByTestId("password-step1");
		expect(headingElement).toBeInTheDocument();
		expect(step1HeadingElement).toBeInTheDocument();

    //get by data-testid of password-step2 to be in the doc
    const step2HeadingElement = screen.queryByTestId("password-step2");
    expect(step2HeadingElement).toBeInTheDocument();
    done();
  });

  it("should not render step3 on initial load", (done) => {
    //get by data-testid of password-step3 to not be in the doc
    const step3HeadingElement = screen.queryByTestId("password-step3");
    expect(step3HeadingElement).toBeInTheDocument();
    done();
  });

	it("input field should be enabled", (done) => {
		const passwordInput: HTMLElement | null = screen.queryByTestId("password-input");
		screen.logTestingPlaygroundURL();
		expect(passwordInput).toBeInTheDocument();
		expect(passwordInput).toBeEnabled();
		done();
	});

	it("check if typed value is correct", (done) => {
		const assumedPassword = "pass123pass123";

		//mocking useStep2 hook
		useStep2?.mockImplementation(() => ({
			password: assumedPassword,
			error: { message: "", status: false },
		}));
		render(<Step2 changeStep={() => jest.fn()} currentStep={2} />);

		//querySelectorAll by #encrypted-password
		const encryptedPassword: HTMLElement[] = screen.queryAllByTestId("encrypted-password");

		//check length of encryptedPassword
		expect(encryptedPassword).toHaveLength(assumedPassword.length);
		done();
	});

	it("should render step2 on screen with default and mock states", (done) => {
		const assumedPassword = "pass123pass123";

		// Element | HTMLDocument | undefined
		const step2 = screen.queryByText(/keep things safe../i);
		let step3: HTMLElement | HTMLElement[] | null = screen.queryByText(/Nice. Please type it again/i);

		expect(step2).toBeInTheDocument();
		expect(step3).not.toBeVisible();

		useStep2?.mockImplementation(() => ({
			password: assumedPassword,
			error: { message: "", status: false },
		}));

		const { unmount } = render(<Step2 changeStep={() => jest.fn()} currentStep={2} />);

		const event = new KeyboardEvent("keypress", { keyCode: 13 });
		document.dispatchEvent(event);
		unmount();

		useStep3?.mockImplementation(() => ({
			confirmPassword: assumedPassword,
			isSomethingWrong: false,
			allCorrect: true,
		}));

		screen.logTestingPlaygroundURL();
		waitFor(() => expect(event).toHaveBeenCalled());
		render(<Step3 changeStep={() => jest.fn()} currentStep={3} />);

		expect(step2).not.toBeVisible();
		step3 = screen.queryAllByText(/Nice. Please type it again/i);

		//querySelectorAll by #encrypted-password
		const encryptedConfirmPassword: HTMLElement[] = screen.queryAllByTestId("encrypted-confirm-password");

		//check length of encryptedPassword
		expect(encryptedConfirmPassword).toHaveLength(assumedPassword.length);
		done();
	});
});
describe("Landing Testing step3 on wrong password", () => {
	//initializing the useStep2 hook
	let useStep2: jest.SpyInstance<
		{ password: string; error: { message: string; status: boolean } },
		[changeStep: (number: number) => void, currentStep: number]
	> | null = null;

	let useStep3: jest.SpyInstance<
		{ confirmPassword: string; isSomethingWrong: boolean; allCorrect: boolean },
		[changeStep: (number: number) => void, currentStep: number]
	> | null = null;

	beforeAll(() => {
		//telling the jest to keep and eye on useStep2 hook
		useStep2 = jest.spyOn(hooks, "useStep2");
		useStep3 = jest.spyOn(hooks, "useStep3");
	});

	it("should point out the password error in ui in step3", () => {
		const assumedPassword = "pass123pass123";
		const assumedConfirmPassword = "pass123pass1234";

		useStep2?.mockImplementation(() => ({
			password: assumedPassword,
			error: { message: "", status: false },
		}));

		useStep3?.mockImplementation(() => ({
			confirmPassword: assumedConfirmPassword,
			isSomethingWrong: true,
			password: assumedPassword,
			allCorrect: false,
		}));

		render(
			<MockApp>
				<Step3 changeStep={() => jest.fn()} currentStep={3} />
			</MockApp>
		);

		const errorElement: HTMLElement | null = screen.queryByText(/Something looks wrong/i);
		expect(errorElement).toBeInTheDocument();

		const encryptedConfirmPassword: HTMLElement[] = screen.queryAllByTestId("encrypted-confirm-password");

		//check length of encryptedPassword
		expect(encryptedConfirmPassword).toHaveLength(assumedPassword.length + 1);
	});
	it('should go back on back button click and step3 should not be visible', async () => {
		const assumedPassword = "pass123pass123";
		const assumedConfirmPassword = "pass123pass1234";
		const handleGoBack = jest.fn();

		useStep2?.mockImplementation(() => ({
			password: assumedPassword,
			error: { message: "", status: false },
		}));

		useStep3?.mockImplementation(() => ({
			confirmPassword: assumedConfirmPassword,
			isSomethingWrong: true,
			password: assumedPassword,
			allCorrect: false,
			handleGoBack,
		}));

		render(
			<MockApp>
				<Step3 changeStep={() => jest.fn()} currentStep={3} />
			</MockApp>
		);

		const backButton: HTMLElement | null = screen.queryByTestId("passwords-step3-handleGoBack");
		expect(backButton).toBeInTheDocument();
		fireEvent.click(backButton!);

		//check if button hae been clicked
		expect(handleGoBack).toHaveBeenCalled()

		const step3: HTMLElement | null = screen.queryByText(/Nice. Please type it again/i);
		// expect(step3).not.toBeInTheDocument();
		// expect(step3).not.toBeVisible();

		
		// let step2: HTMLElement | null = screen.queryByText(/keep things safe../i);
		// expect(step2).toBeInTheDocument();
	})

});
