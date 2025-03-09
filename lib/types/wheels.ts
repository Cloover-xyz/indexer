import {
  wheelTable,
  wheelRoundTable,
  wheelRoundParticipantTable,
  wheelDepositTable,
} from "../schema/wheels";

export type WheelDbType = typeof wheelTable.$inferSelect;
export type WheelRoundDbType = typeof wheelRoundTable.$inferSelect;
export type WheelRoundParticipantDbType =
  typeof wheelRoundParticipantTable.$inferSelect;
export type WheelDepositDbType = typeof wheelDepositTable.$inferSelect;
