import React, { useRef, useEffect } from 'react';

export default function ChatForum({ messages, newMessage, setNewMessage, handleSendMessage, isPrivate }) {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto border p-3 rounded-lg bg-gray-50"
      >

        <div className="flex flex-col space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.user === 'You'
                ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`inline-block p-3 rounded-2xl max-w-xs break-words shadow-sm
                ${isPrivate ? (msg.user === 'You' ? 'bg-green-600 text-white' : 'bg-gray-200 text-black')
                    : (msg.user === 'You' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black')
                  }`}
              >
                <div className="text-sm font-semibold mb-1">{msg.user}</div>
                <div className="text-sm">{msg.message}</div>
                <div className={`text-xs mt-1 text-right opacity-80 ${msg.user === "You" ? "text-gray-100" : "text-black"}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex gap-2 border-t pt-3">
        <textarea
          id="chat-message"
          name="chat-message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded-lg p-2 resize-none focus:outline-none focus:ring-0 focus:border-gray-300"
          placeholder="Type your message..."
          rows={2}
        />
        <button
          onClick={handleSendMessage}
          className={`px-5 py-2 rounded-lg transition
            ${isPrivate ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
