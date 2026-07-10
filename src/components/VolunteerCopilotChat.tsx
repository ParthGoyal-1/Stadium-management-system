import React from "react";
import { ChatMessage } from "../types";
import { MessageSquare, Send, Clock } from "lucide-react";

interface VolunteerCopilotChatProps {
  volChatInput: string;
  setVolChatInput: (val: string) => void;
  volChatHistory: ChatMessage[];
  loadingVolChat: boolean;
  onSendVolChat: () => void;
}

/**
 * VolunteerCopilotChat Component.
 * Implements the on-duty chat console for stadium volunteers. Connects with the
 * AI copilot to retrieve immediate safety guidelines, protocol procedures, and 
 * first aid equipment mapping based on real-time stadium context.
 *
 * @component
 * @param {VolunteerCopilotChatProps} props Component props.
 * @returns {React.ReactElement} The volunteer copilot chat window.
 */
export default function VolunteerCopilotChat({
  volChatInput,
  setVolChatInput,
  volChatHistory,
  loadingVolChat,
  onSendVolChat
}: VolunteerCopilotChatProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-full min-h-[500px] relative overflow-hidden" id="volunteer-copilot-chat">
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800/80 mb-4">
        <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center border border-teal-500/35">
          <MessageSquare className="w-4 h-4 text-teal-400" />
        </div>
        <div>
          <h3 className="font-sans font-semibold text-sm text-slate-100">AI Volunteer Copilot</h3>
          <span className="text-[10px] text-slate-400 block">Duty &amp; Dispatch Field Assistant</span>
        </div>
      </div>

      {/* Quick FAQ buttons */}
      <div className="flex flex-wrap gap-1.5 mb-4 font-sans">
        <button 
          onClick={() => setVolChatInput("What is the protocol for active flares in Section South?")}
          className="bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-300 px-2 py-1 rounded text-[10px] transition cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
        >
          🔥 Flares Protocol?
        </button>
        <button 
          onClick={() => setVolChatInput("Where is the nearest First Aid trauma backpack in East Stand?")}
          className="bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-300 px-2 py-1 rounded text-[10px] transition cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
        >
          🎒 First Aid location?
        </button>
        <button 
          onClick={() => setVolChatInput("How do I help a fan who lost their digital ticket at turnstiles?")}
          className="bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-300 px-2 py-1 rounded text-[10px] transition cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
        >
          🎟️ Lost ticket help?
        </button>
      </div>

      {/* Chat Messages */}
      <div 
        className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 min-h-[220px] max-h-[380px] scrollbar-thin"
        aria-live="polite"
        aria-relevant="additions"
      >
        {volChatHistory.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
              m.sender === "user" 
                ? "bg-teal-500 text-slate-950 rounded-tr-none font-semibold" 
                : "bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none"
            }`}>
              <span className="whitespace-pre-line">{m.text}</span>
            </div>
            <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}
        
        {loadingVolChat && (
          <div className="flex flex-col items-start animate-pulse">
            <div className="bg-slate-950 text-slate-400 rounded-2xl p-3 text-xs border border-slate-800 rounded-tl-none">
              Volunteer Copilot is retrieving dispatch logs and first-aid maps...
            </div>
          </div>
        )}
      </div>

      {/* Input field */}
      <div className="flex gap-2 mt-auto">
        <div className="flex-1">
          <label htmlFor="vol-chat-input" className="sr-only">Ask Volunteer Copilot</label>
          <input
            id="vol-chat-input"
            type="text"
            value={volChatInput}
            onChange={(e) => setVolChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSendVolChat()}
            placeholder="Ask Copilot (flares, first aid, checklist)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none font-sans"
          />
        </div>
        <button
          onClick={onSendVolChat}
          disabled={loadingVolChat || !volChatInput.trim()}
          aria-label="Send chat message"
          className="bg-teal-500 hover:bg-teal-600 disabled:bg-slate-800 text-slate-950 font-semibold rounded-xl p-2.5 transition flex-shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
