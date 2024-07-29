import { BigNumber, BigNumberish } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import millify from "millify";

export const formatAddress = (address: string) =>
  `${address.slice(0, 2)}...${address.slice(address.length - 5)}`;

/**
 * format the number amount to a consistent behaviour.
 * all over the app
 * @param amount type number
 */
export const formatAmount = (amount: number) => {
  if (amount === 0) return "0";
  if (!amount) return "-";
  if (amount < 0.001) {
    return "<0.001";
  }
  if (amount < 0.01) {
    return "<0.01";
  }
  return millify(amount, {
    precision: 2,
  });
};

export const toFixed = (x: any) => {
  if (Math.abs(x) < 1.0) {
    const e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    let e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join("0");
    }
  }
  return x;
};

/**
 * manually tells the suffix format letter, so it can be used with a different UI
 * @param number type number
 * @param precision type number
 */
export const numFormatter = (number: number, precision?: number) => {
  if (number > Math.pow(2, 53)) number = 0;
  let symbol = "",
    status = true;
  if (number.toString().includes("e-")) {
    status = false;
  }
  if (typeof number !== "number") number = 0;
  let amount = millify(number, {
    precision: precision || 2,
  });

  if (amount.includes("K")) symbol = "K";
  if (amount.includes("M")) symbol = "M";
  if (amount.includes("B")) symbol = "B";
  if (amount.includes("T")) symbol = "T";
  if (amount.includes("P")) symbol = "P";
  if (amount.includes("E")) symbol = "E";

  if (amount.includes("-")) {
    amount = amount.replace("-", "");
    status = false;
  }

  return { amount: parseFloat(amount.replace(symbol, "")), symbol, status };
};

export function toReadableAmount(
  value: BigNumberish,
  unitName?: string | BigNumberish
): string {
  return formatUnits(value, unitName);
}

export function fromReadableAmount(
  value: string,
  unitName?: BigNumberish
): BigNumber {
  return parseUnits(value, unitName);
}
