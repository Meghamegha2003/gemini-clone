
import React, { useContext, useEffect, useState } from "react";
import "./sidebar.css";
import { assets } from "../../assets/assets";
import { ContextApi } from "../../context/ContextApi";

const Sidebar = () => {
  const [extended, setExtended] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const {
    chatHistory,
    activeChatId,
    newChat,
    selectChat,
    deleteChat,
  } = useContext(ContextApi);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth <= 1024) {
      setMobileOpen((previous) => !previous);
    } else {
      setExtended((previous) => !previous);
    }
  };

  const closeSidebar = () => {
    setMobileOpen(false);
  };

  const handleNewChat = () => {
    newChat();
    closeSidebar();
  };

  const handleSelectChat = (id) => {
    selectChat(id);
    closeSidebar();
  };

  const handleDeleteChat = (event, id) => {
    event.stopPropagation();
    deleteChat(id);
  };

  return (
    <>
      <button
        type="button"
        className={`mobile-menu ${mobileOpen ? "is-open" : ""}`}
        onClick={() => setMobileOpen((previous) => !previous)}
        aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={mobileOpen}
        aria-controls="app-sidebar"
      >
        {mobileOpen ? (
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
          </svg>
        )}
      </button>

      <div
        className={`sidebar-overlay ${mobileOpen ? "active" : ""}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside
        id="app-sidebar"
        className={[
          "sidebar",
          !extended ? "collapsed" : "",
          mobileOpen ? "mobile-open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="sidebar-top">
          <div className="sidebar-header">
            <button
              type="button"
              className="sidebar-toggle"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
            >
              <img src={assets.menu_icon} alt="" />
            </button>
          </div>

          <button
            type="button"
            className="new-chat"
            onClick={handleNewChat}
          >
            <img src={assets.plus_icon} alt="" />
            <span className="sidebar-text">New chat</span>
          </button>

          <section className="recent">
            <p className="recent-title">Recent</p>

            {chatHistory.length === 0 ? (
              <p className="empty-history">No chat history yet</p>
            ) : (
              chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`recent-entry ${
                    activeChatId === chat.id ? "active-chat" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="recent-chat-title"
                    onClick={() => handleSelectChat(chat.id)}
                    title={chat.title}
                  >
                    <img src={assets.message_icon} alt="" />
                    <span className="sidebar-text">{chat.title}</span>
                  </button>

                  <button
                    type="button"
                    className="delete-chat"
                    onClick={(event) =>
                      handleDeleteChat(event, chat.id)
                    }
                    aria-label={`Delete ${chat.title}`}
                    title="Delete chat"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="17"
                      height="17"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="m19 6-1 14H6L5 6" />
                      <path d="M10 10v6M14 10v6" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </section>
        </div>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="bottom-item"
            onClick={closeSidebar}
          >
            <img src={assets.question_icon} alt="" />
            <span className="sidebar-text">Help</span>
          </button>

          <button
            type="button"
            className="bottom-item"
            onClick={closeSidebar}
          >
            <img src={assets.history_icon} alt="" />
            <span className="sidebar-text">Activity</span>
          </button>

          <button
            type="button"
            className="bottom-item"
            onClick={closeSidebar}
          >
            <img src={assets.setting_icon} alt="" />
            <span className="sidebar-text">Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
