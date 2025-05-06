import {
  pgTable,
  serial,
  timestamp,
  decimal,
  pgEnum,
  varchar,
  unique,
} from "drizzle-orm/pg-core";

export const cardTypeEnum = pgEnum("card_type", [
  "Visa",
  "Mastercard",
  "Amex",
  "Discover",
]);

export const transactions = pgTable(
  "transactions",
  {
    id: serial("id").primaryKey(),
    cardNumber: varchar("card_number", { length: 16 }).notNull(),
    cardType: cardTypeEnum("card_type").notNull(),
    timestamp: timestamp("timestamp", { withTimezone: true }).notNull(),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  },
  (table) => [unique().on(table.cardNumber, table.timestamp, table.amount)],
);

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export const rejectedTransactions = pgTable(
  "rejected_transactions",
  {
    id: serial("id").primaryKey(),
    cardNumber: varchar("card_number"),
    timestamp: varchar("timestamp"),
    amount: varchar("amount"),
  },
  (table) => [unique().on(table.cardNumber, table.timestamp, table.amount)],
);
export type RejectedTransaction = typeof rejectedTransactions.$inferSelect;
export type NewRejectedTransaction = typeof rejectedTransactions.$inferInsert;
