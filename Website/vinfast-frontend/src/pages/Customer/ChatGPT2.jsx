import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import "./chat.css";

export default function ChatGPT() {
  const [messages, setMessages] = useState([
    {
      text: "Xin chào! Tôi là trợ lý ảo VinFast. Tôi có thể giúp bạn tìm hiểu về các dòng xe điện, thông số kỹ thuật và giá bán. Bạn đang quan tâm mẫu xe nào?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5130/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMsg = { text: data.reply, sender: "bot" };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "Rất tiếc, hệ thống đang gặp gián đoạn. Vui lòng thử lại sau!", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-container shadow-2xl border border-gray-200">
        {/* Header của Chat */}
        <div className="chat-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <img src="https://vectorseek.com/wp-content/uploads/2023/08/Vinfast-Logo-Vector.svg-.png" alt="VinFast" className="w-8" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">VinFast AI Consultant</h3>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Trực tuyến
              </p>
            </div>
          </div>
        </div>

        {/* Nội dung tin nhắn */}
        <div className="chat-box px-4 py-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} mb-4`}>
              <div className={`msg-bubble ${m.sender === "user" ? "user-style" : "bot-style"}`}>
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="bot-style animate-pulse flex items-center gap-2">
                <span>VinFast AI đang suy nghĩ</span>
                <span className="dot-animation">.</span>
                <span className="dot-animation">.</span>
                <span className="dot-animation">.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="chat-input-area p-4 bg-gray-50 border-t">
          <div className="relative flex items-center">
            <input
              className="w-full p-3 pr-16 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 shadow-inner"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Hỏi về cấu hình, giá xe VF3, VF8..."
            />
            <button 
              onClick={sendMessage}
              className="absolute right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-center mt-2 text-gray-400 uppercase tracking-widest">Powered by VinFast Technology</p>
        </div>
      </div>
    </div>
  );
}