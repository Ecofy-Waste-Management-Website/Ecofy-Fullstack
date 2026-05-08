import React, { useState, useRef, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { sendChatMessage } from "../../services/api/chatbotService";

/* ───── Quick-action suggestions shown on first open ───── */
const QUICK_ACTIONS = [
  { label: "📦 Book a pickup", message: "I want to book a waste pickup" },
  { label: "📍 Track my order", message: "How can I track my pickup status?" },
  { label: "💰 Service pricing", message: "What are your service prices?" },
  { label: "⚠️ Report an issue", message: "I want to report a problem with my pickup" },
];

/* ───── Typing dot animation (pure CSS via inline style) ───── */
const TypingIndicator = () => (
  <div style={{ display: "flex", gap: 4, padding: "8px 0", alignItems: "center" }}>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#06a63e",
          opacity: 0.5,
          animation: `ecobotBounce 1.2s ${i * 0.2}s infinite ease-in-out`,
        }}
      />
    ))}
  </div>
);

/* ───── Single chat bubble ───── */
function ChatBubble({ role, text }) {
  const isUser = role === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 10,
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #06a63e, #218845)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            marginRight: 8,
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          🌿
        </div>
      )}
      <div
        style={{
          maxWidth: "78%",
          padding: "10px 14px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isUser
            ? "linear-gradient(135deg, #06a63e, #058b33)"
            : "#f0f4f0",
          color: isUser ? "#fff" : "#1a2e1a",
          fontSize: 13.5,
          lineHeight: 1.55,
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
          boxShadow: isUser
            ? "0 2px 8px rgba(6,166,62,0.18)"
            : "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        {text}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN CHATBOT WIDGET
   ═══════════════════════════════════════════════════════ */
export default function ChatbotWidget({ onOpenBooking }) {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  /* ── Auto-scroll to bottom ── */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  /* ── Focus input when opened ── */
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  /* ── Handle action tags from bot response ── */
  const handleAction = useCallback(
    (action) => {
      if (!action) return;

      switch (action.action) {
        case "OPEN_BOOKING":
          if (onOpenBooking) onOpenBooking();
          break;
        case "NAVIGATE":
          if (action.target) navigate(action.target);
          break;
        case "CREATE_INQUIRY":
          // Auto-submit inquiry via the existing endpoint
          fetch(
            `${import.meta.env.VITE_API_URL || "http://localhost:5001"}/users/inquiries`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userName:
                  `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                  "Chatbot User",
                userEmail:
                  user?.primaryEmailAddress?.emailAddress || "N/A",
                subject: action.subject || "Chatbot Complaint",
                message: action.message || "Issue reported via chatbot",
              }),
            }
          )
            .then(() => {
              setMessages((prev) => [
                ...prev,
                {
                  role: "model",
                  text: "✅ Your inquiry has been submitted! Our admin team will review it and get back to you shortly.",
                },
              ]);
            })
            .catch(() => {
              setMessages((prev) => [
                ...prev,
                {
                  role: "model",
                  text: "I tried to submit the inquiry but something went wrong. You can submit it manually from the dashboard.",
                },
              ]);
            });
          break;
        default:
          break;
      }
    },
    [navigate, onOpenBooking, user]
  );

  /* ── Send message ── */
  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text || "").trim();
      if (!trimmed || isLoading) return;

      setShowQuickActions(false);
      const userMsg = { role: "user", text: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      // Build history for context (last 20 turns max)
      const history = [...messages, userMsg]
        .slice(-20)
        .map((m) => ({ role: m.role, text: m.text }));

      try {
        const { reply, action } = await sendChatMessage(trimmed, history, {
          name: user
            ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
            : "",
          email: user?.primaryEmailAddress?.emailAddress || "",
          isLoggedIn: !!isSignedIn,
        });

        setMessages((prev) => [...prev, { role: "model", text: reply }]);
        if (action) handleAction(action);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: "Sorry, I couldn't connect to the server. Please try again in a moment. 🔧",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, user, isSignedIn, handleAction]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  /* ══════════════════════════════════════
     RENDER
     ══════════════════════════════════════ */
  return (
    <>
      {/* ── Keyframes (injected once) ── */}
      <style>{`
        @keyframes ecobotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes ecobotPulse {
          0% { box-shadow: 0 0 0 0 rgba(6,166,62,0.45); }
          70% { box-shadow: 0 0 0 14px rgba(6,166,62,0); }
          100% { box-shadow: 0 0 0 0 rgba(6,166,62,0); }
        }
        @keyframes ecobotSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes ecobotFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* ── Floating chat button ── */}
      {!isOpen && (
        <button
          id="ecobot-toggle"
          onClick={() => setIsOpen(true)}
          aria-label="Open EcoBot chat"
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            zIndex: 9999,
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: "none",
            background: "linear-gradient(135deg, #06a63e 0%, #218845 100%)",
            color: "#fff",
            fontSize: 26,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(6,166,62,0.35)",
            animation: "ecobotPulse 2.5s infinite",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          💬
        </button>
      )}

      {/* ── Chat panel ── */}
      {isOpen && (
        <div
          id="ecobot-panel"
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            zIndex: 9999,
            width: 380,
            maxWidth: "calc(100vw - 32px)",
            height: 540,
            maxHeight: "calc(100vh - 60px)",
            borderRadius: 24,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(20px) saturate(1.4)",
            WebkitBackdropFilter: "blur(20px) saturate(1.4)",
            border: "1px solid rgba(6,166,62,0.18)",
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(6,166,62,0.08)",
            animation: "ecobotSlideUp 0.35s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* ─── Header ─── */}
          <div
            style={{
              background: "linear-gradient(135deg, #06a63e 0%, #218845 100%)",
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              🌿
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: 0.2,
                }}
              >
                EcoBot
              </div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11.5 }}>
                Ecofy AI Assistant • Online
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                color: "#fff",
                width: 32,
                height: 32,
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
              }
            >
              ✕
            </button>
          </div>

          {/* ─── Messages ─── */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 14px 8px",
              scrollBehavior: "smooth",
            }}
          >
            {/* Welcome message */}
            {messages.length === 0 && (
              <div style={{ animation: "ecobotFadeIn 0.5s ease" }}>
                <ChatBubble
                  role="model"
                  text={`Hi${user?.firstName ? ` ${user.firstName}` : ""}! 👋 I'm EcoBot, your Ecofy waste management assistant. How can I help you today?`}
                />
              </div>
            )}

            {/* Chat history */}
            {messages.map((msg, i) => (
              <ChatBubble key={i} role={msg.role} text={msg.text} />
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 36 }}>
                <TypingIndicator />
              </div>
            )}

            {/* Quick actions */}
            {showQuickActions && messages.length === 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 8,
                  animation: "ecobotFadeIn 0.6s ease 0.2s both",
                }}
              >
                {QUICK_ACTIONS.map((qa) => (
                  <button
                    key={qa.label}
                    onClick={() => sendMessage(qa.message)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 20,
                      border: "1.5px solid rgba(6,166,62,0.25)",
                      background: "rgba(6,166,62,0.06)",
                      color: "#06702a",
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(6,166,62,0.14)";
                      e.currentTarget.style.borderColor = "rgba(6,166,62,0.45)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(6,166,62,0.06)";
                      e.currentTarget.style.borderColor = "rgba(6,166,62,0.25)";
                    }}
                  >
                    {qa.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Input bar ─── */}
          <div
            style={{
              padding: "10px 14px 14px",
              borderTop: "1px solid rgba(0,0,0,0.06)",
              background: "rgba(255,255,255,0.6)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#f4f7f4",
                borderRadius: 16,
                padding: "4px 4px 4px 14px",
                border: "1.5px solid transparent",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "rgba(6,166,62,0.4)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "transparent")
              }
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 13.5,
                  color: "#1a2e1a",
                  padding: "8px 0",
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  border: "none",
                  background:
                    input.trim() && !isLoading
                      ? "linear-gradient(135deg, #06a63e, #058b33)"
                      : "#d1d5db",
                  color: "#fff",
                  cursor: input.trim() && !isLoading ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              >
                ➤
              </button>
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: 10,
                color: "#9ca3af",
                marginTop: 6,
                letterSpacing: 0.3,
              }}
            >
              Powered by Ecofy AI
            </div>
          </div>
        </div>
      )}
    </>
  );
}
