import { ONE_HUNDRED_PERCENT_BP } from "./constants";

export const calculateFeesAmount = (
  amount: string | bigint,
  feeBp: number
): bigint => {
  const fee = (BigInt(amount) * BigInt(feeBp)) / BigInt(ONE_HUNDRED_PERCENT_BP);
  return fee;
};

export const calculateWinMultiplier = (
  amountWins: string | bigint,
  amountBets: string | bigint
): number => {
  return Number(BigInt(amountWins) / BigInt(amountBets));
};

export const addBigIntish = (
  a: string | bigint,
  b: string | bigint
): bigint => {
  return BigInt(a) + BigInt(b);
};

export const subtractBigIntish = (
  a: string | bigint,
  b: string | bigint
): bigint => {
  return BigInt(a) - BigInt(b);
};

export const isBigIntishZero = (a: string | bigint): boolean => {
  return BigInt(a) === BigInt(0);
};

export const getMaxBigInt = (
  a: string | bigint,
  b: string | bigint
): bigint => {
  return BigInt(a) > BigInt(b) ? BigInt(a) : BigInt(b);
};

export const getMinBigInt = (
  a: string | bigint,
  b: string | bigint
): bigint => {
  return BigInt(a) < BigInt(b) ? BigInt(a) : BigInt(b);
};
