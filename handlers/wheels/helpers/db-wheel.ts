import { useDrizzleStorage } from "@apibara/plugin-drizzle";
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

import { getStarknetProvider, NetworkType } from "utils/provider";
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
import { adaptAddress } from "utils/converters";

export const getUser = async (
  userAddress: string
): Promise<UserDbType | null> => {
  const { db } = useDrizzleStorage();
  return (
    await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, getUserId(userAddress)))
  )[0];
};

export const getOrInitUser = async (
  userAddress: string,
  timestamp: Date
): Promise<UserDbType> => {
  const { db } = useDrizzleStorage();
  const userId = getUserId(userAddress);
  const user = (
    await db.select().from(userTable).where(eq(userTable.id, userId))
  )[0];
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
  network: NetworkType,
  timestamp: Date
) => {
  const { db } = useDrizzleStorage();
  const token = await getOrInitToken(data.token, network, timestamp);
  if (!token) {
    throw new Error("token not found");
  }
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
  const { db } = useDrizzleStorage();
  await db
    .update(wheelTable)
    .set(data)
    .where(eq(wheelTable.id, getWheelId(wheelAddress)));
};

export const getWheel = async (wheelAddress: string) => {
  const { db } = useDrizzleStorage();
  const wheel = (
    await db
      .select()
      .from(wheelTable)
      .where(eq(wheelTable.id, getWheelId(wheelAddress)))
  )[0];
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
  const { db } = useDrizzleStorage();
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
): Promise<WheelRoundDbType | null> => {
  const { db } = useDrizzleStorage();
  const round = (
    await db
      .select()
      .from(wheelRoundTable)
      .where(eq(wheelRoundTable.id, getWheelRoundId(roundNumber)))
  )[0];
  return round;
};

export const updateRound = async (
  roundNumber: string,
  data: Record<string, unknown>
) => {
  const { db } = useDrizzleStorage();
  await db
    .update(wheelRoundTable)
    .set(data)
    .where(eq(wheelRoundTable.id, roundNumber));
};

export const getWheelParticipant = async (
  roundId: string,
  userId: string
): Promise<WheelRoundParticipantDbType | null> => {
  const { db } = useDrizzleStorage();
  const id = getWheelRoundParticipantId(roundId, userId);
  return (
    await db
      .select()
      .from(wheelRoundParticipantTable)
      .where(eq(wheelRoundParticipantTable.id, id))
  )[0];
};

export const insertWheelParticipant = async (
  roundId: string,
  userId: string,
  tickets: number[],
  deposited: bigint,
  timestamp: Date
): Promise<WheelRoundParticipantDbType> => {
  const { db } = useDrizzleStorage();
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
  const { db } = useDrizzleStorage();
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
  const { db } = useDrizzleStorage();
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
  const { db } = useDrizzleStorage();
  const id = getWheelDepositId(roundId, depositIndex);
  await db
    .update(wheelDepositTable)
    .set(data)
    .where(eq(wheelDepositTable.id, id));
};

export const getUserWheelMetrics = async (userAddress: string) => {
  const { db } = useDrizzleStorage();
  const id = getUserId(userAddress);
  return (
    await db
      .select()
      .from(wheelMetricsTable)
      .where(eq(wheelMetricsTable.userId, id))
  )[0];
};

export const addDepositToUserWheelMetrics = async (
  user: UserDbType,
  data: DepositedEvent,
  isNewParticipant: boolean,
  timestamp: Date
) => {
  const { db } = useDrizzleStorage();
  const id = getWheelMetricId(user.address);
  let wheelMetrics = (
    await db
      .select()
      .from(wheelMetricsTable)
      .where(eq(wheelMetricsTable.id, id))
  )[0];
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
  const { db } = useDrizzleStorage();
  await db
    .update(wheelMetricsTable)
    .set(data)
    .where(eq(wheelMetricsTable.id, userWheelMetricsId));
};

export const getOrInitToken = async (
  tokenId: string,
  network: NetworkType,
  timestamp: Date
): Promise<TokenDbType> => {
  const { db } = useDrizzleStorage();
  tokenId = getTokenId(tokenId);
  let token = (
    await db.select().from(tokenTable).where(eq(tokenTable.id, tokenId))
  )[0];
  if (token) {
    return token;
  }
  const provider = getStarknetProvider(network);
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
  const { db } = useDrizzleStorage();
  return (
    await db
      .select()
      .from(tokenTable)
      .where(eq(tokenTable.id, getTokenId(tokenId)))
  )[0];
};
