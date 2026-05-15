import fs from "node:fs";
import path from "node:path";

const BANK_FILES = {
  bank_a: "bank_a.json",
  bank_b: "bank_b.json",
  bank_c: "bank_c.json",
};

const MOCK_DIR = path.join(process.cwd(), "..", "mock-data");

const bankCache = new Map();
const connected = new Map();

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
