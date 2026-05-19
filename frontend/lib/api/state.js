import fs from "node:fs";
import path from "node:path";

const BANK_FILES = {
  bank_a: "bank_a.json",
  bank_b: "bank_b.json",
  bank_c: "bank_c.json",
};

const MOCK_DIR = path.join(process.cwd(), "..", "mock-data");

// Dev-mode fix: Next.js App Router compiles each route handler with its own
// module graph, so a module-scoped Map would give every route its own state
// (and gets wiped whenever a new route is compiled for the first time).
// Stashing the Maps on globalThis keeps a single instance across route bundles
// and across HMR re-evaluations. No-op cost in production.
const STATE_KEY = Symbol.for("aissistant.bankState");
const state = (globalThis[STATE_KEY] ??= {
  bankCache: new Map(),
  connected: new Map(),
});
const { bankCache, connected } = state;

function loadBank(bankId) {
  if (bankCache.has(bankId)) return bankCache.get(bankId);
  const file = BANK_FILES[bankId];
  if (!file) return null;
  const raw = fs.readFileSync(path.join(MOCK_DIR, file), "utf8");
  const parsed = JSON.parse(raw);
  bankCache.set(bankId, parsed);
  return parsed;
}

export function connectBank(bankId) {
  const bank = loadBank(bankId);
  if (!bank) return null;
  connected.set(bankId, bank);
  return bank;
}

export function disconnectBank(bankId) {
  if (!connected.has(bankId)) return null;
  const bank = connected.get(bankId);
  connected.delete(bankId);
  return bank;
}

export function isConnected(bankId) {
  return connected.has(bankId);
}

export function getConnectedBanks() {
  return [...connected.values()];
}

export function getAllTransactions() {
  return getConnectedBanks().flatMap((bank) => bank.transactions);
}
