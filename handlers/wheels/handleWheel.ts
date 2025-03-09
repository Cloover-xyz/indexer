import { Event, getBigIntSelector, BlockHeader } from "@apibara/starknet";
import { useLogger } from "@apibara/indexer/plugins";

import { calculateFeesAmount, calculateWinMultiplier } from "utils/maths";
import {
  getRoundCutoffTimeSetEventData,
  getRoundStatusUpdatedEventData,
  getDepositedEventData,
  getDepositsWithdrawnEventData,
  getPrizeClaimedEventData,
  getWinnerDrawnEventData,
} from "./helpers/eventsData";
import {
  updateWheel,
  getRound,
  insertRound,
  updateRound,
  getWheel,
  insertWheelDeposit,
  getWheelParticipant,
  getOrInitUser,
  insertWheelParticipant,
  updateWheelParticipant,
  addDepositToUserWheelMetrics,
  updateWheelDeposit,
  getUser,
  getUserWheelMetrics,
  updateUserWheelMetrics,
} from "./helpers/db-wheel";
import { RoundStatus } from "./types/enums";

const ROUND_STATUS_UPDATED_EVENT_SELECTOR =
  getBigIntSelector("RoundStatusUpdated").toString();

const ROUND_CUTOFF_TIME_SET_EVENT_SELECTOR =
  getBigIntSelector("RoundCutoffTimeSet").toString();

const DEPOSITED_EVENT_SELECTOR = getBigIntSelector("Deposited").toString();

const DEPOSITS_WITHDRAWN_EVENT_SELECTOR =
  getBigIntSelector("DepositsWithdrawn").toString();

const PRIZE_CLAIMED_EVENT_SELECTOR =
  getBigIntSelector("PrizeClaimed").toString();

const WINNER_DRAWN_EVENT_SELECTOR = getBigIntSelector("WinnerDrawn").toString();

export const handleRoundStatusUpdated = async (
  event: Event,
  header: BlockHeader
) => {
  const logger = useLogger();
  const { timestamp } = header;
  const { wheelAddress, data } = getRoundStatusUpdatedEventData(event);
  logger.log("Event RoundStatusUpdated", { data });
  const { roundId, status } = data;
  let wheel = await getWheel(wheelAddress);
  if (!wheel) {
    throw new Error(`Wheel not found for wheelAddress ${wheelAddress}`);
  }
  let round = await getRound(roundId);
  if (!round) {
    round = await insertRound(roundId, wheel, status, timestamp);
  } else {
    await updateRound(round.id, {
      status,
      updatedAt: timestamp,
    });
  }
  if (status === RoundStatus.Open) {
    await updateWheel(wheelAddress, {
      roundsCount: wheel.roundsCount + 1,
      updatedAt: timestamp,
    });
  }
};

export const handleRoundCutoffTimeSet = async (
  event: Event,
  header: BlockHeader
) => {
  const logger = useLogger();
  const { timestamp } = header;
  const { data } = getRoundCutoffTimeSetEventData(event);
  logger.log("Event RoundCutoffTimeSet", { data });
  const { roundId, cutoffTime } = data;
  let round = await getRound(roundId);
  if (!round) {
    throw new Error(`Round not found for id ${roundId}`);
  }
  await updateRound(round.id, {
    cutoffTime: new Date(cutoffTime * 1000),
    updatedAt: timestamp,
  });
};

export const handleDeposited = async (event: Event, header: BlockHeader) => {
  const logger = useLogger();
  const { timestamp } = header;
  const { data } = getDepositedEventData(event);
  logger.log("Event Deposited", { data });
  const round = await getRound(data.roundId);
  if (!round) {
    throw new Error(`Round not found for id ${data.roundId}`);
  }
  const user = await getOrInitUser(data.depositor, timestamp);
  let tickets = [];
  for (
    let i = data.startTicketIndex;
    i < data.startTicketIndex + data.ticketsCount;
    i++
  ) {
    tickets.push(i);
  }

  let participant = await getWheelParticipant(round.id, user.id);
  let isNewParticipant = false;
  if (!participant) {
    participant = await insertWheelParticipant(
      round.id,
      user.id,
      tickets,
      data.amount,
      timestamp
    );
    isNewParticipant = true;
  } else {
    await updateWheelParticipant(round.id, user.id, {
      tickets: [...participant.tickets!, ...tickets],
      deposited: participant.deposited + data.amount,
      updatedAt: timestamp,
    });
  }

  await insertWheelDeposit(round, participant.id, data, timestamp);

  await addDepositToUserWheelMetrics(user, data, isNewParticipant, timestamp);

  const feesAmount = calculateFeesAmount(data.amount, round.protocolFeeBp);
  const prizePoolAmountToAdd = data.amount - feesAmount;
  await updateRound(round.id, {
    ticketsCount: round.ticketsCount + data.ticketsCount,
    totalDepositAmount: round.totalDepositAmount + data.amount,
    feesAmount: round.feesAmount + feesAmount,
    prizePoolAmount: round.prizePoolAmount + prizePoolAmountToAdd,
    participantsCount: isNewParticipant
      ? round.participantsCount + 1
      : round.participantsCount,
    depositsCount: round.depositsCount + 1,
    updatedAt: timestamp,
  });
};

export const handleDepositsWithdrawn = async (
  event: Event,
  header: BlockHeader
) => {
  const logger = useLogger();
  const { timestamp } = header;
  const { data } = getDepositsWithdrawnEventData(event);
  logger.log("Event DepositsWithdrawn", { data });
  for (const withdrawalCalldata of data.withdrawalCalldata) {
    const { roundId, depositIndices } = withdrawalCalldata;
    const round = await getRound(roundId);
    if (!round) {
      throw new Error(`Round not found for id ${roundId}`);
    }
    for (const depositIndex of depositIndices) {
      await updateWheelDeposit(round.id, depositIndex, {
        withdrawn: true,
        updatedAt: timestamp,
      });
    }
  }
};

export const handlePrizeClaimed = async (event: Event, header: BlockHeader) => {
  const logger = useLogger();
  const { timestamp } = header;
  const { data } = getPrizeClaimedEventData(event);
  logger.log("Event PrizeClaimed", { data });
  const user = await getUser(data.winner);
  if (!user) {
    throw new Error(`User not found for address ${data.winner}`);
  }
  for (let i = 0; i < data.roundIds.length; i++) {
    const roundId = data.roundIds[i];
    const round = await getRound(roundId);
    if (!round) {
      throw new Error(`round with id ${roundId} not found`);
    }
    await updateWheelParticipant(round.id, user.id, {
      prizeClaimed: true,
      updatedAt: timestamp,
    });
  }
};

export const handleWinnerDrawn = async (event: Event, header: BlockHeader) => {
  const logger = useLogger();
  const { timestamp } = header;
  const { data } = getWinnerDrawnEventData(event);
  logger.log("Event WinnerDrawn", { data });
  const user = await getUser(data.winner);
  if (!user) {
    throw new Error(`User not found for address ${data.winner}`);
  }
  const round = await getRound(data.roundId);
  if (!round) {
    throw new Error(`Round not found for id ${data.roundId}`);
  }
  await updateRound(round.id, {
    winnerId: data.winner,
    winningTicket: data.winningTicket,
    randomValue: data.randomValue.toString(),
    drawnAt: timestamp,
    updatedAt: timestamp,
  });

  const participant = await updateWheelParticipant(round.id, user.id, {
    isWinner: true,
    updatedAt: timestamp,
  });
  const userWheelMetrics = await getUserWheelMetrics(user.address);
  if (!userWheelMetrics) {
    throw new Error(`User wheel metrics not found for user ${user.address}`);
  }
  const biggestWin =
    userWheelMetrics.biggestWin < round.prizePoolAmount
      ? round.prizePoolAmount
      : userWheelMetrics.biggestWin;
  const winMultiplier = calculateWinMultiplier(
    round.prizePoolAmount,
    participant.deposited
  );
  const biggestWinMultiplier =
    userWheelMetrics.biggestWinMultiplier < winMultiplier
      ? winMultiplier
      : userWheelMetrics.biggestWinMultiplier!;

  await updateUserWheelMetrics(userWheelMetrics.id, {
    totalRoundsWon: userWheelMetrics.totalRoundsWon + 1,
    totalAmountWon: userWheelMetrics.totalAmountWon + round.prizePoolAmount,
    biggestWin,
    biggestWinMultiplier,
    updatedAt: timestamp,
  });
};

export default {
  [ROUND_STATUS_UPDATED_EVENT_SELECTOR]: handleRoundStatusUpdated,
  [ROUND_CUTOFF_TIME_SET_EVENT_SELECTOR]: handleRoundCutoffTimeSet,
  [DEPOSITED_EVENT_SELECTOR]: handleDeposited,
  [DEPOSITS_WITHDRAWN_EVENT_SELECTOR]: handleDepositsWithdrawn,
  [PRIZE_CLAIMED_EVENT_SELECTOR]: handlePrizeClaimed,
  [WINNER_DRAWN_EVENT_SELECTOR]: handleWinnerDrawn,
};
