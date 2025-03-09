import { userTable, wheelMetricsTable } from "../schema/users";

export type UserDbType = typeof userTable.$inferSelect;
export type WheelMetricsDbType = typeof wheelMetricsTable.$inferSelect;
