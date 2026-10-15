
import React, { useContext, useEffect, useRef, useState } from "react";
import "./main.css";
import { assets } from "../../assets/assets";
import { ContextApi } from "../../context/ContextApi";
import { marked } from "marked";

const Main = () => {
  const {
    input,
    setInput,
    showResult,
    loading,
    messages,
    onSent,
  } = useContext(ContextApi);

  const [selectedImage, setSelectedImage] = useState(null);
  const chatBottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (selectedImage?.preview) {
        URL.revokeObjectURL(selectedImage.preview);
      }
    };
  }, [selectedImage]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10 MB.");
      event.target.value = "";
      return;
    }

    setSelectedImage({
      file,
      preview: URL.createObjectURL(file),
    });

    event.target.value = "";
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleSend = () => {
    if (loading || (!input.trim() && !selectedImage)) return;

    onSent(input.trim(), selectedImage?.file || null);
    setSelectedImage(null);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey && !loading) {
      if (input.trim() || selectedImage) {
        event.preventDefault();
        handleSend();
      }
    }
  };

  const suggestions = [
    {
      text: "Suggest beautiful places to see on an upcoming road trip",
      icon: assets.compass_icon,
    },
    {
      text: "Briefly summarize this concept: urban planning",
      icon: assets.bulb_icon,
    },
    {
      text: "Brainstorm team bonding activities for our work retreat",
      icon: assets.message_icon,
    },
    {
      text: "Improve the readability of the following code",
      icon: assets.code_icon,
    },
  ];

  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="User" />
      </div>

      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, Megha.</span>
              </p>
              <p>How can I help you today?</p>
            </div>

            <div className="cards">
              {suggestions.map((item, index) => (
                <div
                  className="card"
                  key={index}
                  onClick={() => !loading && onSent(item.text)}
                >
                  <p>{item.text}</p>
                  <img src={item.icon} alt="" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="result">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.role === "user" ? "result-title" : "result-data"
                }
              >
                {msg.role === "assistant" && (
                  <img src={assets.gemini_icon} alt="Gemini" />
                )}

                {msg.role === "user" ? (
                  <div className="user-message-content">
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Uploaded"
                        className="chat-image"
                      />
                    )}
                    {msg.text && <p>{msg.text}</p>}
                  </div>
                ) : loading && !msg.text ? (
                  <div className="loader">
                    <hr />
                    <hr />
                    <hr />
                  </div>
                ) : (
                  <div
                    className="assistant-message-content"
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(msg.text || ""),
                    }}
                  />
                )}
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>
        )}

        <div className="main-bottom">
          {selectedImage && (
            <div className="image-preview">
              <img src={selectedImage.preview} alt="Selected image" />
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={loading}
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          )}

          <div className="search-box">
            <input
              type="text"
              placeholder="Enter a prompt here"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              hidden
              disabled={loading}
            />

            <div>
              <img
                src={assets.gallery_icon}
                alt="Choose image"
                onClick={() => {
                  if (!loading) fileInputRef.current?.click();
                }}
                style={{
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.5 : 1,
                }}
              />

              <img src={assets.mic_icon} alt="Microphone" />

              {(input.trim() || selectedImage) && (
                <img
                  onClick={handleSend}
                  src={assets.send_icon}
                  alt="Send"
                  style={{
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.5 : 1,
                  }}
                />
              )}
            </div>
          </div>

          <p className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double-check its responses. Your privacy and Gemini Apps.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
