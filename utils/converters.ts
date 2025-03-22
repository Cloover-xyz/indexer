import {
  BigNumberish,
  getChecksumAddress,
  num,
  validateAndParseAddress,
  validateChecksumAddress,
} from "starknet";
import { z } from "zod";
import { ADDRESS_ZERO } from "./constants";

export function zeroBI(): bigint {
  return BigInt(0);
}

export function zeroAddress(): string {
  return ADDRESS_ZERO;
}

export const isAddressValid = (address?: BigNumberish): boolean => {
  if (!address) return false;
  return validateChecksumAddress(getChecksumAddress(address));
};

// Reusable transformers
export const zNumber = z.bigint().transform((val) => parseInt(val.toString()));
export const zBigInt = z.bigint();
export const zAddress = z.string().transform((val) => adaptAddress(val));
export const zNumberArray = z.array(zNumber);
// Custom enum transformer
export const zEnum = <T extends Record<string, string>>(enumObject: T) =>
  z.bigint().transform((val: bigint) => {
    const id = Number(val);
    const enumArrayValues = Object.values(enumObject) as T[keyof T][];
    if (id >= enumArrayValues.length) throw new Error("index out of bounds");
    return enumArrayValues[id];
  });

export const adaptAddress = (address: BigNumberish): string => {
  return validateAndParseAddress(num.toHex(address)).toLowerCase();
};
