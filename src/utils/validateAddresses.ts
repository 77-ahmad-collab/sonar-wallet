import { ethers } from "ethers";
import { PublicKey } from "@solana/web3.js";
import { NETWORKS, ZERO_ADDRESS } from "./constants";
import { matchAddresses } from "./index";

//validate EVM address
export const validateEVMAddress = (addr: string) => {
  return !matchAddresses(addr, ZERO_ADDRESS) && ethers.utils.isAddress(addr);
};

//validate SOLANA address
export const validateSolanaAddress = (addr: string) => {
  const publicKey = new PublicKey(addr);
  return PublicKey.isOnCurve(publicKey.toBytes());
};

//validate NEAR_TESTNET address
export const validateNearTestnetAddress = (addr: string) =>
  addr.toLowerCase().includes(".testnet");

//validate NEAR_MAINNET address
export const validateNearMainnetAddress = (addr: string) =>
  addr.toLowerCase().includes(".near") || addr.length === 64;

export const validateAddress = (
  address: string,
  chainFamily: string
): boolean => {
  try {
    if (chainFamily === NETWORKS.NEAR) {
      return validateNearMainnetAddress(address);
    }
    //  else if (chainFamily === NETWORKS.NEAR_TESTNET) {
    //   return validateNearTestnetAddress(address);
    // }
    else if (chainFamily === NETWORKS.SOLANA) {
      return validateSolanaAddress(address);
    } else {
      return validateEVMAddress(address);
    }
  } catch (error) {
    return false;
  }
};
