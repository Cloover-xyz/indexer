import { DepositedEvent, WheelContractDeployedEvent } from "../types/types";
import { eq } from "drizzle-orm";

import {
  wheelTable,
  tokenTable,
  wheelRoundTable,
  wheelDepositTable,
  wheelRoundParticipantTable,
  userTable,
  wheelMetricsTable,
} from "lib/schema/index";

import { getStarknetProvider } from "utils/provider";
import { Contract, shortString } from "starknet";
import { RoundStatus } from "../types/enums";
import {
  WheelDbType,
  WheelDepositDbType,
  WheelRoundDbType,
  WheelRoundParticipantDbType,
} from "lib/types/wheels";
import {
  getTokenId,
  getUserId,
  getWheelDepositId,
  getWheelId,
  getWheelMetricId,
  getWheelRoundId,
  getWheelRoundParticipantId,
} from "./id-generation";
import { TokenDbType } from "lib/types/tokens";
import { UserDbType } from "lib/types/users";

import { configManager } from "lib/configManager";
import { useLogger } from "@apibara/indexer/plugins";

export const getUser = async (
  userAddress: string
): Promise<UserDbType | undefined> => {
  const { db } = configManager.useDrizzleStorageQuery();
  return db.query.userTable.findFirst({
    where: eq(userTable.id, getUserId(userAddress)),
  });
};

export const getOrInitUser = async (
  userAddress: string,
  timestamp: Date
): Promise<UserDbType> => {
  const { db } = configManager.useDrizzleStorageQuery();
  const userId = getUserId(userAddress);
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, userId),
  });
  if (user) {
    return user;
  }
  return (
    await db
      .insert(userTable)
      .values({
        id: userId,
        address: userAddress,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .returning()
  )[0];
};

export const insertWheel = async (
  wheelAddress: string,
  data: WheelContractDeployedEvent,
  timestamp: Date
) => {
  const { db } = configManager.useDrizzleStorageQuery();
  const token = await getOrInitToken(data.token, timestamp);
  await db.insert(wheelTable).values({
    id: getWheelId(wheelAddress),
    address: wheelAddress,
    tokenId: token.id,
    roundsCount: 0,
    pricePerTicket: data.pricePerTicket,
    roundDuration: data.roundDuration,
    protocolFeeBp: data.protocolFeeBp,
    protocolFeeRecipient: data.protocolFeeRecipient,
    vrf: data.vrf,
    outflowAllowed: data.outflowAllowed,
    maxNumberOfParticipantsPerRound: data.maximumNumberOfParticipantsPerRound,
    maxNumberOfDepositsPerRound: data.maximumNumberOfDepositsPerRound,
    maxParticipantTicketsPerRound: data.maximumParticipantTicketsPerRound,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
};

export const updateWheel = async (
  wheelAddress: string,
  data: Record<string, unknown>
) => {
  const { db } = configManager.useDrizzleStorageQuery();
  const a = await db.query.wheelTable.findFirst({
    where: eq(wheelTable.id, getWheelId(wheelAddress)),
  });
  await db
    .update(wheelTable)
    .set(data)
    .where(eq(wheelTable.id, getWheelId(wheelAddress)));
};

export const getWheel = async (wheelAddress: string) => {
  const { db } = configManager.useDrizzleStorageQuery();
  const wheel = await db.query.wheelTable.findFirst({
    where: eq(wheelTable.id, getWheelId(wheelAddress)),
  });
  if (!wheel) {
    throw new Error(`wheel with id ${wheelAddress} not found`);
  }
  return wheel;
};

export const insertRound = async (
  roundNumber: number,
  wheel: WheelDbType,
  status: RoundStatus,
  timestamp: Date
): Promise<WheelRoundDbType> => {
  const { db } = configManager.useDrizzleStorageQuery();
  const round = await db
    .insert(wheelRoundTable)
    .values({
      id: getWheelRoundId(roundNumber),
      number: roundNumber,
      pricePerTicket: wheel.pricePerTicket,
      protocolFeeBp: wheel.protocolFeeBp,
      wheelId: wheel.id,
      status,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .returning();
  return round[0];
};

export const getRound = async (
  roundNumber: number
): Promise<WheelRoundDbType | undefined> => {
  const { db } = configManager.useDrizzleStorageQuery();
  return db.query.wheelRoundTable.findFirst({
    where: eq(wheelRoundTable.id, getWheelRoundId(roundNumber)),
  });
};

export const updateRound = async (
  roundNumber: string,
  data: Record<string, unknown>
) => {
  const { db } = configManager.useDrizzleStorageQuery();
  await db
    .update(wheelRoundTable)
    .set(data)
    .where(eq(wheelRoundTable.id, roundNumber));
};

export const getWheelParticipant = async (
  roundId: string,
  userId: string
): Promise<WheelRoundParticipantDbType | undefined> => {
  const { db } = configManager.useDrizzleStorageQuery();
  const id = getWheelRoundParticipantId(roundId, userId);
  return db.query.wheelRoundParticipantTable.findFirst({
    where: eq(wheelRoundParticipantTable.id, id),
  });
};

export const insertWheelParticipant = async (
  roundId: string,
  userId: string,
  tickets: number[],
  deposited: bigint,
  timestamp: Date
): Promise<WheelRoundParticipantDbType> => {
  const { db } = configManager.useDrizzleStorageQuery();
  const id = getWheelRoundParticipantId(roundId, userId);
  const participant = await db
    .insert(wheelRoundParticipantTable)
    .values({
      id,
      tickets,
      deposited,
      userId,
      roundId,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .returning();
  return participant[0];
};

export const updateWheelParticipant = async (
  roundId: string,
  userId: string,
  data: Record<string, unknown>
) => {
  const { db } = configManager.useDrizzleStorageQuery();
  const id = getWheelRoundParticipantId(roundId, userId);
  return (
    await db
      .update(wheelRoundParticipantTable)
      .set(data)
      .where(eq(wheelRoundParticipantTable.id, id))
      .returning()
  )[0];
};

export const insertWheelDeposit = async (
  round: WheelRoundDbType,
  participantId: string,
  data: DepositedEvent,
  timestamp: Date
): Promise<WheelDepositDbType> => {
  const { db } = configManager.useDrizzleStorageQuery();
  const id = getWheelDepositId(round.id, round.depositsCount);
  const token = await getToken(data.token);
  const deposit = await db
    .insert(wheelDepositTable)
    .values({
      id,
      ticketsCount: data.ticketsCount,
      amount: data.amount,
      depositIndex: round.depositsCount,
      roundId: round.id,
      tokenId: token.id,
      participantId,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .returning();
  return deposit[0];
};

export const updateWheelDeposit = async (
  roundId: string,
  depositIndex: number,
  data: Record<string, unknown>
) => {
  const { db } = configManager.useDrizzleStorageQuery();
  const id = getWheelDepositId(roundId, depositIndex);
  await db
    .update(wheelDepositTable)
    .set(data)
    .where(eq(wheelDepositTable.id, id));
};

export const getUserWheelMetrics = async (userAddress: string) => {
  const { db } = configManager.useDrizzleStorageQuery();
  const id = getUserId(userAddress);
  return db.query.wheelMetricsTable.findFirst({
    where: eq(wheelMetricsTable.userId, id),
  });
};

export const addDepositToUserWheelMetrics = async (
  user: UserDbType,
  data: DepositedEvent,
  isNewParticipant: boolean,
  timestamp: Date
) => {
  const { db } = configManager.useDrizzleStorageQuery();
  const id = getWheelMetricId(user.address);
  let wheelMetrics = await db.query.wheelMetricsTable.findFirst({
    where: eq(wheelMetricsTable.id, id),
  });
  if (!wheelMetrics) {
    await db.insert(wheelMetricsTable).values({
      id,
      userId: user.id,
      totalDepositAmount: data.amount,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  } else {
    await db
      .update(wheelMetricsTable)
      .set({
        totalDepositAmount: wheelMetrics.totalDepositAmount! + data.amount,
        totalRoundsPlayed: isNewParticipant
          ? wheelMetrics.totalRoundsPlayed + 1
          : wheelMetrics.totalRoundsPlayed,
        updatedAt: timestamp,
      })
      .where(eq(wheelMetricsTable.id, id));
  }
};

export const updateUserWheelMetrics = async (
  userWheelMetricsId: string,
  data: Record<string, unknown>
) => {
  const { db } = configManager.useDrizzleStorageQuery();
  await db
    .update(wheelMetricsTable)
    .set(data)
    .where(eq(wheelMetricsTable.id, userWheelMetricsId));
};

export const getOrInitToken = async (
  tokenId: string,
  timestamp: Date
): Promise<TokenDbType> => {
  const logger = useLogger();
  const { db } = configManager.useDrizzleStorageQuery();
  tokenId = getTokenId(tokenId);
  logger.log("tokenId", tokenId);
  let token = await db.query.tokenTable.findFirst({
    where: eq(tokenTable.id, tokenId),
  });
  logger.log("token", token);
  if (token) {
    return token;
  }
  logger.log("token not found, fetching from provider");
  const provider = getStarknetProvider(configManager.getNetwork());
  const { abi } = await provider.getClassAt(tokenId);
  if (!abi) {
    throw new Error("no abi.");
  }
  const tokenContract = new Contract(abi, tokenId, provider);
  let [name, symbol, decimals] = await Promise.all([
    tokenContract.name(),
    tokenContract.symbol(),
    tokenContract.decimals(),
  ]);

  name =
    typeof name === "bigint"
      ? shortString.decodeShortString(name.toString())
      : name;
  symbol =
    typeof symbol === "bigint"
      ? shortString.decodeShortString(symbol.toString())
      : symbol.toString();
  decimals = decimals.toString();
  const tokenInsert = await db
    .insert(tokenTable)
    .values({
      id: tokenId,
      address: tokenId,
      name,
      symbol,
      decimals,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .returning();
  return tokenInsert[0];
};

export const getToken = async (tokenId: string): Promise<TokenDbType> => {
  const { db } = configManager.useDrizzleStorageQuery();
  const token = await db.query.tokenTable.findFirst({
    where: eq(tokenTable.id, getTokenId(tokenId)),
  });
  if (!token) {
    throw new Error(`token not found ${tokenId}`);
  }
  return token;
};
