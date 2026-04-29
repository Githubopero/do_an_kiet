import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../../contexts/AuthContext";

export default function ChatGPT() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      text: `Xin chào ${user?.hoTen || 'Quý khách'}! Tôi là trợ lý ảo VinFast. Tôi có thể giúp bạn tìm hiểu về các dòng xe điện, thông số kỹ thuật và giá bán. Bạn đang quan tâm mẫu xe nào?`,
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-blue-900 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
              <img src="https://vectorseek.com/wp-content/uploads/2023/08/Vinfast-Logo-Vector.svg-.png" alt="VinFast" className="w-10 invert" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="font-black text-blue-900 uppercase tracking-tighter text-xl">VinFast AI Consultant</h3>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hệ thống tư vấn thông minh</span>
            </div>
          </div>
        </div>
        <div className="hidden md:block bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
             <p className="text-[10px] font-black text-orange-600 uppercase">Trạng thái</p>
             <p className="text-xs font-bold text-gray-700 italic">Đang trực tuyến</p>
        </div>
      </div>

      {/* Chat Box */}
      <div className="flex-1 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] md:max-w-[70%] p-5 rounded-[2rem] shadow-sm font-medium leading-relaxed
                ${m.sender === "user" 
                  ? "bg-blue-900 text-white rounded-tr-none" 
                  : "bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100"}`}
              >
                <div className="prose prose-sm max-w-none prose-p:leading-relaxed">
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
                <p className={`text-[9px] mt-2 font-black uppercase opacity-50 ${m.sender === "user" ? "text-right" : "text-left"}`}>
                    {m.sender === "user" ? "Khách hàng" : "Trợ lý VinFast"}
                </p>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-orange-50 text-orange-600 p-5 rounded-[2rem] rounded-tl-none border border-orange-100 flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span className="text-xs font-black uppercase tracking-widest">AI đang soạn thảo</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100">
          <div className="relative flex items-center max-w-4xl mx-auto">
            <input
              className="w-full p-5 pr-20 rounded-[2rem] border-2 border-gray-100 focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-100 shadow-inner bg-white font-bold text-sm transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Hỏi về cấu hình, ưu đãi, so sánh các dòng xe..."
            />
            <button 
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="absolute right-2 bg-blue-900 hover:bg-orange-400 text-white hover:text-black p-4 rounded-[1.5rem] transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          <div className="flex justify-between items-center mt-4 px-4">
             <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">© 2026 VinFast Auto - AI Consultant Service</p>
             <div className="flex gap-2">
                <span className="w-2 h-2 bg-blue-900 rounded-full opacity-20"></span>
                <span className="w-2 h-2 bg-blue-900 rounded-full opacity-40"></span>
                <span className="w-2 h-2 bg-blue-900 rounded-full opacity-60"></span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}