"use client";

import { useEffect, useState } from "react";
import { icons, requestJson, STARTER_PROMPTS } from "./shared";

export function AssistantSheet({ open, onClose, connectedCount, summary, transactions }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    if (!open || messages.length > 0) return;
    setMessages([
      {
        role: "assistant",
        content:
          connectedCount > 0
            ? `${connectedCount} bankadan gelen verilerinize bakıyorum. Harcama ve gelir örüntüleriniz hakkında soru sorabilirsiniz.`
            : "Henüz bağlı banka yok. Önce Bağlantılar ekranından bir hesap ekleyebilirsiniz.",
      },
    ]);
  }, [open, connectedCount, messages.length]);

  const send = async (text) => {
    const content = (text || input).trim();
    if (!content || thinking) return;
    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setThinking(true);
    try {
      const data = await requestJson("/api/assistant/chat", {
        method: "POST",
        body: JSON.stringify({
          message: content,
          chatHistory: nextMessages.slice(-6),
          financialContext: summary,
          transactions,
        }),
      });
      setMessages((current) => [...current, { role: "assistant", content: data.response || data.message }]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Şu anda yanıt oluşturamadım. Pano özeti ve hareket geçmişi üzerinden harcamalarınızı inceleyebilirsiniz.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <button className="sheet-backdrop" aria-label="Asistanı kapat" onClick={onClose} />
      <section className="assistant-sheet">
        <div className="sheet-handle" />
        <header>
          <div className="assistant-mark">{icons.sparkle(18)}</div>
          <div>
            <h2>Asistan</h2>
            <p>{connectedCount > 0 ? `${connectedCount} banka üzerinden` : "Bağlı banka yok"}</p>
          </div>
          <button className="icon-button" onClick={onClose}>
            {icons.close()}
          </button>
        </header>
        <div className="messages">
          {messages.map((message, index) => (
            <div className={`message ${message.role}`} key={`${message.role}-${index}`}>
              {message.content}
            </div>
          ))}
          {thinking && <div className="message assistant">Düşünüyor...</div>}
          {messages.length === 1 && connectedCount > 0 && (
            <div className="starter-prompts">
              {STARTER_PROMPTS.map((prompt) => (
                <button key={prompt} onClick={() => send(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="composer">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && send()}
            placeholder="Finanslarınız hakkında sorun"
          />
          <button onClick={() => send()} disabled={!input.trim()}>
            {icons.send()}
          </button>
        </div>
      </section>
    </>
  );
}
