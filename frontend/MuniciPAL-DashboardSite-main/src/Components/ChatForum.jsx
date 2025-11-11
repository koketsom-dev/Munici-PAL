import React, { useRef, useEffect, useState } from 'react';

export default function ChatForum({ messages, newMessage, setNewMessage, handleSendMessage, isPrivate, employees = [], onMentionsChange }) {
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const mentionStartRef = useRef(null);
  const [showMentions, setShowMentions] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [mentionQuery, setMentionQuery] = useState('');
  const [activeMentions, setActiveMentions] = useState([]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (mentionStartRef.current === null) {
      setFilteredEmployees([]);
      setShowMentions(false);
      return;
    }
    const lower = mentionQuery.toLowerCase();
    const suggestions = employees.filter((emp) => {
      const first = emp.first_name ? String(emp.first_name) : '';
      const last = emp.surname ? String(emp.surname) : '';
      const name = `${first} ${last}`.trim();
      const email = emp.email ? String(emp.email) : '';
      if (!lower) {
        return true;
      }
      return name.toLowerCase().includes(lower) || email.toLowerCase().includes(lower);
    });
    setFilteredEmployees(suggestions);
    setShowMentions(suggestions.length > 0);
    setHighlightIndex(0);
  }, [mentionQuery, employees]);

  useEffect(() => {
    if (!newMessage) {
      setShowMentions(false);
      setMentionQuery('');
      mentionStartRef.current = null;
      if (activeMentions.length > 0) {
        setActiveMentions([]);
      }
    }
  }, [newMessage, activeMentions.length]);

  useEffect(() => {
    if (typeof onMentionsChange === 'function') {
      onMentionsChange(activeMentions);
    }
  }, [activeMentions, onMentionsChange]);

  const updateMentionState = (value, caret) => {
    const textBeforeCaret = value.slice(0, caret);
    const match = textBeforeCaret.match(/@([^\s@]*)$/);
    if (match) {
      mentionStartRef.current = caret - match[1].length - 1;
      setMentionQuery(match[1]);
      return;
    }
    setShowMentions(false);
    setMentionQuery('');
    mentionStartRef.current = null;
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setNewMessage(value);
    updateMentionState(value, event.target.selectionStart);
    syncActiveMentions(value);
  };

  const syncActiveMentions = (value) => {
    setActiveMentions((prev) => {
      const filtered = prev.filter((item) => value.includes(item.token));
      if (filtered.length !== prev.length) {
        return filtered;
      }
      return prev;
    });
  };

  const applyMention = (employee) => {
    if (!textareaRef.current) {
      return;
    }
    const first = employee.first_name ? String(employee.first_name) : '';
    const last = employee.surname ? String(employee.surname) : '';
    const name = `${first} ${last}`.trim() || (employee.email ? String(employee.email) : '');
    if (!name) {
      return;
    }
    const mentionText = `@${name}`;
    const value = textareaRef.current.value;
    const selectionStart = textareaRef.current.selectionStart;
    const selectionEnd = textareaRef.current.selectionEnd;
    const start = mentionStartRef.current !== null ? mentionStartRef.current : selectionStart;
    const before = value.slice(0, start);
    const after = value.slice(selectionEnd);
    const needsSpace = after.startsWith(' ') || after.length === 0 ? '' : ' ';
    const updated = `${before}${mentionText}${needsSpace}${after}`;
    setNewMessage(updated);
    setShowMentions(false);
    setMentionQuery('');
    mentionStartRef.current = null;
    setActiveMentions((prev) => {
      const exists = prev.some((item) => item.employeeId === employee.id);
      if (exists) {
        return prev.map((item) =>
          item.employeeId === employee.id ? { ...item, token: mentionText } : item
        );
      }
      return [...prev, { employeeId: employee.id, token: mentionText }];
    });
    setTimeout(() => {
      if (textareaRef.current) {
        const position = (before + mentionText + needsSpace).length;
        textareaRef.current.focus();
        textareaRef.current.selectionStart = position;
        textareaRef.current.selectionEnd = position;
      }
    }, 0);
    syncActiveMentions(updated);
  };

  const handleKeyDown = (event) => {
    if (!showMentions || filteredEmployees.length === 0) {
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % filteredEmployees.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightIndex((prev) => (prev - 1 + filteredEmployees.length) % filteredEmployees.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      applyMention(filteredEmployees[highlightIndex]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setShowMentions(false);
      setMentionQuery('');
      mentionStartRef.current = null;
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowMentions(false);
      setMentionQuery('');
      mentionStartRef.current = null;
    }, 100);
  };

  const handleSuggestionClick = (employee) => {
    applyMention(employee);
  };

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
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            id="chat-message"
            name="chat-message"
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-full border rounded-lg p-2 resize-none focus:outline-none focus:ring-0 focus:border-gray-300"
            placeholder="Type your message..."
            rows={2}
          />
          {showMentions && filteredEmployees.length > 0 && (
            <div className="absolute bottom-full mb-2 left-0 w-full max-h-40 overflow-y-auto border rounded-lg bg-white shadow-lg z-10">
              {filteredEmployees.map((employee, index) => {
                const first = employee.first_name ? String(employee.first_name) : '';
                const last = employee.surname ? String(employee.surname) : '';
                const name = `${first} ${last}`.trim();
                const email = employee.email ? String(employee.email) : '';
                return (
                  <button
                    type="button"
                    key={employee.id || email || index}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleSuggestionClick(employee);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm ${index === highlightIndex ? 'bg-blue-100' : 'bg-white'} hover:bg-blue-50`}
                  >
                    <div className="font-medium text-gray-900">{name || email || 'Employee'}</div>
                    {email ? <div className="text-xs text-gray-500">{email}</div> : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <button
          onClick={() => handleSendMessage(activeMentions)}
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
