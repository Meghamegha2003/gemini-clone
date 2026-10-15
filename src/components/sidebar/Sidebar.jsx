
import React, { useContext, useState } from "react";
import "./sidebar.css";
import { assets } from "../../assets/assets";
import { ContextApi } from "../../context/ContextApi";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);

  const {
    chatHistory,
    activeChatId,
    newChat,
    selectChat,
    deleteChat,
  } = useContext(ContextApi);

  const handleNewChat = () => {
    newChat();
  };

  return (
    <div className="sidebar">
      <div className="top">
        <img
          onClick={() => setExtended((previous) => !previous)}
          className="menu"
          src={assets.menu_icon}
          alt="Menu"
        />

        <div className="new-chat" onClick={handleNewChat}>
          <img src={assets.plus_icon} alt="New chat" />
          {extended && <p>New Chat</p>}
        </div>

        {extended && (
          <div className="recent">
            <p className="recent-title">Recent</p>

            {chatHistory.length === 0 && (
              <p className="empty-history">No chat history</p>
            )}

            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                className={`recent-entry ${
                  activeChatId === chat.id ? "active-chat" : ""
                }`}
              >
                <div
                  className="recent-chat-title"
                  onClick={() => selectChat(chat.id)}
                >
                  <img src={assets.message_icon} alt="Chat" />
                  <p>{chat.title}</p>
                </div>

                <button
                  className="delete-chat"
                  onClick={() => deleteChat(chat.id)}
                  aria-label={`Delete ${chat.title}`}
                  title="Delete chat"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="Help" />
          {extended && <p>Help</p>}
        </div>

        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="Activity" />
          {extended && <p>Activity</p>}
        </div>

        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="Settings" />
          {extended && <p>Settings</p>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
