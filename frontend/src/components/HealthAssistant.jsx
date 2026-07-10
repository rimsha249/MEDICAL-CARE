import { useState, useRef, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";

const HealthAssistant = () => {
  const { backendUrl } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your MediCare Health Assistant 👋 I can help you with health questions, symptoms, medicines, and appointment-related queries. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/api/user/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": token
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages([...updatedMessages, { role: "assistant", content: data.message }]);
      } else {
        setMessages([...updatedMessages, { role: "assistant", content: "Sorry, I couldn't get a response. Please try again! 🙏" }]);
      }
    } catch (error) {
      setMessages([...updatedMessages, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again! 🙏" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "How do I book an appointment?",
    "I have a headache, what should I do?",
    "How to cancel my appointment?",
    "What are signs of fever?",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');
        .health-assistant * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }
        .chat-fab { position: fixed; bottom: 28px; right: 28px; left: auto; width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #0ea5e9, #0284c7); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(14,165,233,0.45); transition: transform 0.2s ease; z-index: 9999; }
        .chat-fab:hover { transform: scale(1.08); }
        .chat-window { position: fixed; bottom: 100px; right: 28px; left: auto; width: 370px; height: 560px; background: #fff; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); display: flex; flex-direction: column; overflow: hidden; z-index: 9998; animation: chatOpen 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes chatOpen { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .chat-header { background: linear-gradient(135deg, #0ea5e9, #0369a1); padding: 16px 20px; display: flex; align-items: center; gap: 12px; }
        .header-avatar { width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .header-info h3 { margin: 0; color: white; font-size: 15px; font-weight: 600; font-family: 'Playfair Display', serif; }
        .header-info p { margin: 0; color: rgba(255,255,255,0.8); font-size: 12px; display: flex; align-items: center; gap: 4px; }
        .online-dot { width: 7px; height: 7px; background: #4ade80; border-radius: 50%; display: inline-block; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .close-btn { margin-left: auto; background: rgba(255,255,255,0.15); border: none; color: white; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; flex-shrink: 0; }
        .close-btn:hover { background: rgba(255,255,255,0.25); }
        .messages-area { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; background: #f8fafc; }
        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .message { display: flex; gap: 8px; align-items: flex-end; animation: msgIn 0.2s ease; }
        @keyframes msgIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .message.user { flex-direction: row-reverse; }
        .msg-avatar { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; }
        .msg-avatar.ai { background: linear-gradient(135deg, #0ea5e9, #0284c7); }
        .msg-avatar.user-av { background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: white; }
        .msg-bubble { max-width: 78%; padding: 10px 14px; border-radius: 16px; font-size: 13.5px; line-height: 1.55; color: #1e293b; }
        .message.assistant .msg-bubble { background: white; border-bottom-left-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.07); }
        .message.user .msg-bubble { background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; border-bottom-right-radius: 4px; }
        .msg-bubble p { margin: 0 0 6px 0; }
        .msg-bubble p:last-child { margin-bottom: 0; }
        .typing-indicator { display: flex; gap: 4px; align-items: center; padding: 12px 14px; background: white; border-radius: 16px; border-bottom-left-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.07); width: fit-content; }
        .typing-dot { width: 7px; height: 7px; background: #94a3b8; border-radius: 50%; animation: typingBounce 1.2s infinite; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typingBounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
        .quick-questions { padding: 8px 16px 0; display: flex; gap: 6px; flex-wrap: wrap; background: #f8fafc; }
        .quick-btn { background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 5px 11px; font-size: 11.5px; color: #0284c7; cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif; font-weight: 500; white-space: nowrap; }
        .quick-btn:hover { background: #e0f2fe; border-color: #0284c7; }
        .input-area { padding: 12px 16px; background: white; border-top: 1px solid #f1f5f9; display: flex; gap: 10px; align-items: flex-end; }
        .chat-input { flex: 1; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 10px 14px; font-size: 13.5px; font-family: 'DM Sans', sans-serif; resize: none; outline: none; max-height: 100px; line-height: 1.5; color: #1e293b; transition: border-color 0.2s; background: #f8fafc; }
        .chat-input:focus { border-color: #0ea5e9; background: white; }
        .chat-input::placeholder { color: #94a3b8; }
        .send-btn { width: 40px; height: 40px; background: linear-gradient(135deg, #0ea5e9, #0284c7); border: none; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.15s, opacity 0.15s; flex-shrink: 0; }
        .send-btn:hover:not(:disabled) { transform: scale(1.05); }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .notification-badge { position: absolute; top: -2px; right: -2px; width: 18px; height: 18px; background: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; color: white; font-weight: 700; border: 2px solid white; }
      `}</style>

      <div className="health-assistant">
        <button
          className="chat-fab"
          onClick={() => setIsOpen(!isOpen)}
          style={{ position: 'fixed', bottom: '28px', right: '28px', left: 'auto', zIndex: 9999 }}
        >
          {!isOpen ? (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="white"/>
              <path d="M7 9h10M7 13h7" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          )}
          {!isOpen && messages.length === 1 && (
            <span className="notification-badge">1</span>
          )}
        </button>

        {isOpen && (
          <div
            className="chat-window"
            style={{ position: 'fixed', bottom: '100px', right: '28px', left: 'auto', zIndex: 9998 }}
          >
            <div className="chat-header">
              <div className="header-avatar">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zm0 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z"/>
                </svg>
              </div>
              <div className="header-info">
                <h3>MediCare Assistant</h3>
                <p><span className="online-dot"></span> Online • Health & Appointments</p>
              </div>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>

            <div className="messages-area">
              {messages.map((msg, i) => (
                <div key={i} className={`message ${msg.role}`}>
                  <div className={`msg-avatar ${msg.role === 'assistant' ? 'ai' : 'user-av'}`}>
                    {msg.role === 'assistant' ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zm0 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z"/>
                      </svg>
                    ) : 'You'}
                  </div>
                  <div className="msg-bubble">
                    {msg.content.split('\n').map((line, j) => (
                      <p key={j}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="message assistant">
                  <div className="msg-avatar ai">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zm0 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z"/>
                    </svg>
                  </div>
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 2 && (
              <div className="quick-questions">
                {quickQuestions.map((q, i) => (
                  <button key={i} className="quick-btn" onClick={() => { setInput(q); inputRef.current?.focus(); }}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div className="input-area">
              <textarea
                ref={inputRef}
                className="chat-input"
                placeholder="Ask about health or appointments..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button className="send-btn" onClick={sendMessage} disabled={!input.trim() || isLoading}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HealthAssistant;