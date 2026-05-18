"use client";

import { useEffect, useMemo, useState } from "react";

import { BANKS, StatusBar, icons, requestJson } from "./_components/shared";
import { LoginScreen } from "./_components/screen-login";
import { DashboardScreen } from "./_components/screen-dashboard";
import { ConnectionsScreen } from "./_components/screen-connections";
import { TransactionsScreen } from "./_components/screen-transactions";
import { AssistantSheet } from "./_components/assistant-sheet";
import { BottomNav } from "./_components/bottom-nav";
import { BankConsentFlow, DisconnectConfirm } from "./_components/consent-flow";
import { TweaksPanel, preconnectToIds } from "./_components/tweaks-panel";

const DEFAULT_TWEAKS = {
  startScreen: "login",   // login | home
  preConnected: "none",   // none | a | a,b | a,b,c
  showFab: true,
  skipConsent: false,
};

export default function Home() {
  const [tweaks, setTweaks] = useState(DEFAULT_TWEAKS);
  const updateTweaks = (patch) => setTweaks((current) => ({ ...current, ...patch }));

  const [loggedIn, setLoggedIn] = useState(DEFAULT_TWEAKS.startScreen !== "login");
  const [tab, setTab] = useState("home");
  const [connected, setConnected] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [apiOffline, setApiOffline] = useState(false);
  const [advicePreview, setAdvicePreview] = useState(null);
  const [pendingConsentBankId, setPendingConsentBankId] = useState(null);
  const [pendingDisconnectId, setPendingDisconnectId] = useState(null);

  const connectedBanks = useMemo(
    () => BANKS.filter((bank) => connected.includes(bank.id)),
    [connected],
  );

  // React to tweaks (start screen + pre-connected presets, for the demo panel)
  useEffect(() => {
    setLoggedIn(tweaks.startScreen !== "login");
  }, [tweaks.startScreen]);

  useEffect(() => {
    const presetIds = preconnectToIds(tweaks.preConnected);
    setConnected(presetIds);
  }, [tweaks.preConnected]);

  const fetchAdvicePreview = async (summaryData, txs) => {
    if (!summaryData || !Array.isArray(txs) || txs.length === 0) {
      setAdvicePreview(null);
      return;
    }
    try {
      const data = await requestJson("/api/assistant/advice-preview", {
        method: "POST",
        body: JSON.stringify({ financialContext: summaryData, transactions: txs }),
      });
      setAdvicePreview(data?.response || null);
    } catch {
      setAdvicePreview(null);
    }
  };

  const refreshFinancialData = async () => {
    try {
      const [summaryData, transactionData] = await Promise.all([
        requestJson("/api/dashboard/summary"),
        requestJson("/api/transactions"),
      ]);
      const txs = transactionData.transactions || transactionData || [];
      setSummary(summaryData);
      setTransactions(txs);
      setApiOffline(false);
      fetchAdvicePreview(summaryData, txs);
    } catch {
      setSummary(null);
      setTransactions([]);
      setApiOffline(true);
      setAdvicePreview(null);
    }
  };

  useEffect(() => {
    if (loggedIn) refreshFinancialData();
  }, [loggedIn]);

  // Reload finance data when the connected set changes via tweaks/consent
  useEffect(() => {
    if (loggedIn) refreshFinancialData();
  }, [connected.join(",")]);

  const actuallyConnect = async (bankId) => {
    setBusyId(bankId);
    try {
      await requestJson("/api/connect-bank", {
        method: "POST",
        body: JSON.stringify({ bankId }),
      });
      setConnected((current) => [...new Set([...current, bankId])]);
    } catch {
      setConnected((current) => [...new Set([...current, bankId])]);
      setApiOffline(true);
    } finally {
      setBusyId(null);
    }
  };

  // Connect button on Connections → route through KVKK consent unless skipped
  const requestConnect = (bankId) => {
    if (tweaks.skipConsent) {
      actuallyConnect(bankId);
      return;
    }
    setPendingConsentBankId(bankId);
  };

  const handleConsentComplete = () => {
    const id = pendingConsentBankId;
    setPendingConsentBankId(null);
    if (id) actuallyConnect(id);
  };

  // Disconnect → confirm modal first
  const requestDisconnect = (bankId) => setPendingDisconnectId(bankId);

  const confirmDisconnect = async () => {
    const bankId = pendingDisconnectId;
    setPendingDisconnectId(null);
    if (!bankId) return;
    setBusyId(bankId);
    try {
      await requestJson("/api/disconnect-bank", {
        method: "POST",
        body: JSON.stringify({ bankId }),
      });
      await refreshFinancialData();
    } catch {
      setConnected((current) => current.filter((id) => id !== bankId));
      setApiOffline(true);
    } finally {
      setBusyId(null);
    }
  };

  const pendingConsentBank = pendingConsentBankId
    ? BANKS.find((b) => b.id === pendingConsentBankId)
    : null;
  const pendingDisconnectBank = pendingDisconnectId
    ? BANKS.find((b) => b.id === pendingDisconnectId)
    : null;

  const screen = !loggedIn ? (
    <LoginScreen onLogin={() => setLoggedIn(true)} />
  ) : tab === "connections" ? (
    <ConnectionsScreen
      banks={BANKS}
      connected={connected}
      busyId={busyId}
      onConnect={requestConnect}
      onDisconnect={requestDisconnect}
    />
  ) : tab === "transactions" ? (
    <TransactionsScreen banks={connectedBanks} transactions={transactions} />
  ) : (
    <DashboardScreen
      connected={connected}
      summary={summary}
      advicePreview={advicePreview}
      apiOffline={apiOffline}
      onConnectPrompt={() => setTab("connections")}
    />
  );

  return (
    <main className="page-shell">
      <div className="phone-frame">
        <div className="dynamic-island" />
        <StatusBar />
        <div className="phone-screen">
          {screen}
          {loggedIn && !pendingConsentBank && (
            <>
              {tweaks.showFab && (
                <button
                  className="assistant-fab"
                  aria-label="Asistanı aç"
                  onClick={() => setAssistantOpen(true)}
                >
                  <span className="fab-pulse" />
                  {icons.sparkle(22)}
                </button>
              )}
              <BottomNav tab={tab} onChange={setTab} />
            </>
          )}
          {loggedIn && (
            <AssistantSheet
              open={assistantOpen}
              onClose={() => setAssistantOpen(false)}
              connectedCount={connected.length}
              summary={summary}
              transactions={transactions}
            />
          )}
          {pendingConsentBank && (
            <BankConsentFlow
              bank={pendingConsentBank}
              onCancel={() => setPendingConsentBankId(null)}
              onComplete={handleConsentComplete}
            />
          )}
          {pendingDisconnectBank && (
            <DisconnectConfirm
              bank={pendingDisconnectBank}
              onCancel={() => setPendingDisconnectId(null)}
              onConfirm={confirmDisconnect}
            />
          )}
        </div>
        <div className="home-indicator" />
      </div>

      <TweaksPanel
        tweaks={tweaks}
        onChange={updateTweaks}
        onPreviewConsent={(bankId) => setPendingConsentBankId(bankId)}
        onOpenAssistant={() => setAssistantOpen(true)}
      />
    </main>
  );
}
