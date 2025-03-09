export const getUserId = (userAddress: string): string => {
  return userAddress.toLowerCase();
};

export const getWheelMetricId = (userAddress: string): string => {
  return userAddress.toLowerCase();
};

export const getWheelId = (wheelAddress: string): string => {
  return wheelAddress.toLowerCase();
};

export const getWheelRoundId = (roundIndex: number): string => {
  return `${roundIndex}`.toLowerCase();
};

export const getTokenId = (tokenAddress: string): string => {
  return tokenAddress.toLowerCase();
};

export const getWheelRoundParticipantId = (
  roundId: string,
  userAddress: string
): string => {
  return `${roundId}-${userAddress}`.toLowerCase();
};

export const getWheelDepositId = (
  roundId: string,
  depositIndex: number
): string => {
  return `${roundId}-${depositIndex}`.toLowerCase();
};
