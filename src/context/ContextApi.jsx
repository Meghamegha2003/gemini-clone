import { createContext, useState, useEffect, useRef } from "react";
import runChat from "../config/gemini";

export const ContextApi = createContext();

const getInitialHistory = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("chatHistory"));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const getInitialActiveChatId = () => {
  try {
    return localStorage.getItem("activeChatId") || null;
  } catch {
    return null;
  }
};

const createChat = () => ({
  id: crypto.randomUUID(),
  title: "New Chat",
  messages: [],
  interactionId: null,
  updatedAt: Date.now(),
});

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to display image."));
      }
    };

    reader.onerror = () =>
      reject(new Error("Failed to display image."));

    reader.readAsDataURL(file);
  });

const getErrorMessage = (error) => {
  const message = String(error?.message || error || "");
  const status = error?.status ?? error?.code;

  if (
    status === 429 ||
    message.includes("429") ||
    message.toLowerCase().includes("rate limit") ||
    message.toLowerCase().includes("quota")
  ) {
    return "API usage limit reached. Please check your model quota and try again when it resets.";
  }

  if (status === 503 || message.includes("503")) {
    return "The AI service is temporarily unavailable. Please try again shortly.";
  }

  if (
    message.includes("ERR_QUIC_PROTOCOL_ERROR") ||
    message.includes("QUIC_TOO_MANY_RTOS") ||
    message.toLowerCase().includes("network error") ||
    message.toLowerCase().includes("failed to fetch")
  ) {
    return "Connection interrupted while receiving the response. Any received text has been preserved. Please try again.";
  }

  return message || "Something went wrong. Please try again.";
};

const ContextProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState(getInitialHistory);
  const [activeChatId, setActiveChatId] = useState(
    getInitialActiveChatId
  );
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentInteractionId, setCurrentInteractionId] =
    useState(null);

  const loadingRef = useRef(false);
  const interactionIdRef = useRef(null);
  const activeChatIdRef = useRef(activeChatId);
  const messagesRef = useRef(messages);
  const chatHistoryRef = useRef(chatHistory);

  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    chatHistoryRef.current = chatHistory;

    try {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    } catch (error) {
      console.error("Could not save chat history:", error);
    }
  }, [chatHistory]);

  useEffect(() => {
    try {
      if (activeChatId) {
        localStorage.setItem("activeChatId", activeChatId);
      } else {
        localStorage.removeItem("activeChatId");
      }
    } catch (error) {
      console.error("Could not save active chat:", error);
    }
  }, [activeChatId]);

  useEffect(() => {
    const chat = chatHistory.find(
      (item) => item.id === activeChatId
    );

    if (!chat) {
      if (activeChatId) {
        setActiveChatId(null);
        activeChatIdRef.current = null;
      }

      setMessages([]);
      messagesRef.current = [];
      setCurrentInteractionId(null);
      interactionIdRef.current = null;
      setShowResult(false);
      setResultData("");
      return;
    }

    const restoredMessages = chat.messages || [];
    const restoredInteractionId = chat.interactionId || null;

    setMessages(restoredMessages);
    messagesRef.current = restoredMessages;

    setCurrentInteractionId(restoredInteractionId);
    interactionIdRef.current = restoredInteractionId;

    setShowResult(restoredMessages.length > 0);
    setResultData(
      [...restoredMessages]
        .reverse()
        .find((message) => message.role === "assistant")
        ?.text || ""
    );
  }, [activeChatId, chatHistory]);

  const updateChat = (chatId, updates) => {
    setChatHistory((previous) => {
      const next = previous.map((chat) =>
        chat.id === chatId
          ? { ...chat, ...updates, updatedAt: Date.now() }
          : chat
      );

      chatHistoryRef.current = next;
      return next;
    });
  };

  const updateAssistantMessage = (chatId, messageId, text) => {
    const nextMessages = messagesRef.current.map((message) =>
      message.id === messageId ? { ...message, text } : message
    );

    messagesRef.current = nextMessages;

    if (activeChatIdRef.current === chatId) {
      setMessages(nextMessages);
      setResultData(text);
    }

    setChatHistory((previous) => {
      const updated = previous.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: nextMessages,
              updatedAt: Date.now(),
            }
          : chat
      );

      chatHistoryRef.current = updated;
      return updated;
    });
  };

  const newChat = () => {
    if (loadingRef.current) return;

    setActiveChatId(null);
    activeChatIdRef.current = null;
    setMessages([]);
    messagesRef.current = [];
    setInput("");
    setRecentPrompt("");
    setResultData("");
    setShowResult(false);
    setCurrentInteractionId(null);
    interactionIdRef.current = null;
  };

  const selectChat = (chatId) => {
    if (loadingRef.current) return;

    const chat = chatHistoryRef.current.find(
      (item) => item.id === chatId
    );

    if (!chat) return;

    setActiveChatId(chat.id);
    activeChatIdRef.current = chat.id;

    const restoredMessages = chat.messages || [];

    setMessages(restoredMessages);
    messagesRef.current = restoredMessages;

    setInput("");
    setRecentPrompt("");

    setResultData(
      [...restoredMessages]
        .reverse()
        .find((message) => message.role === "assistant")
        ?.text || ""
    );

    setShowResult(restoredMessages.length > 0);

    const interactionId = chat.interactionId || null;

    setCurrentInteractionId(interactionId);
    interactionIdRef.current = interactionId;
  };

  const deleteChat = (chatId) => {
    if (loadingRef.current) return;

    const remainingChats = chatHistoryRef.current.filter(
      (chat) => chat.id !== chatId
    );

    chatHistoryRef.current = remainingChats;
    setChatHistory(remainingChats);

    if (activeChatIdRef.current === chatId) {
      setActiveChatId(null);
      activeChatIdRef.current = null;
      setMessages([]);
      messagesRef.current = [];
      setInput("");
      setRecentPrompt("");
      setResultData("");
      setShowResult(false);
      setCurrentInteractionId(null);
      interactionIdRef.current = null;
    }
  };

  const onSent = async (promptText, imageFile = null) => {
    const promptToSend = (promptText ?? input).trim();

    if ((!promptToSend && !imageFile) || loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);

    let chatId = activeChatIdRef.current;
    let assistantMessageId = null;
    let responseText = "";
    let streamCompleted = false;

    try {
      const imageDataUrl = imageFile
        ? await fileToDataUrl(imageFile)
        : null;

      let previousMessages = messagesRef.current;

      if (!chatId) {
        const newChatData = createChat();

        chatId = newChatData.id;
        previousMessages = [];

        const nextHistory = [
          newChatData,
          ...chatHistoryRef.current,
        ];

        chatHistoryRef.current = nextHistory;
        setChatHistory(nextHistory);
        setActiveChatId(chatId);
        activeChatIdRef.current = chatId;
        interactionIdRef.current = null;
        setCurrentInteractionId(null);
      } else {
        const existingChat = chatHistoryRef.current.find(
          (chat) => chat.id === chatId
        );

        previousMessages = existingChat?.messages || [];
      }

      const displayPrompt =
        promptToSend || "Describe this image.";

      setRecentPrompt(displayPrompt);
      setInput("");
      setShowResult(true);
      setResultData("");

      const userMessage = {
        id: crypto.randomUUID(),
        role: "user",
        text: promptToSend,
        image: imageDataUrl,
      };

      const assistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "",
      };

      assistantMessageId = assistantMessage.id;

      const updatedMessages = [
        ...previousMessages,
        userMessage,
        assistantMessage,
      ];

      messagesRef.current = updatedMessages;
      setMessages(updatedMessages);

      const existingChat = chatHistoryRef.current.find(
        (chat) => chat.id === chatId
      );

      const title =
        previousMessages.length === 0
          ? displayPrompt.slice(0, 35)
          : existingChat?.title || displayPrompt.slice(0, 35);

      updateChat(chatId, {
        title,
        messages: updatedMessages,
      });

      const stream = await runChat(
        promptToSend,
        interactionIdRef.current,
        imageFile
      );

      if (
        !stream ||
        typeof stream[Symbol.asyncIterator] !== "function"
      ) {
        throw new Error("The API did not return a valid stream.");
      }

      let receivedText = false;

      for await (const event of stream) {
        const eventType = event.event_type ?? event.type;

        if (
          eventType === "interaction.created" ||
          eventType === "interaction.completed" ||
          eventType === "interaction.complete"
        ) {
          const id = event.interaction?.id ?? event.id;

          if (id) {
            interactionIdRef.current = id;
            setCurrentInteractionId(id);
          }
        }

        if (
          eventType === "interaction.failed" ||
          eventType === "error"
        ) {
          throw new Error(
            event.error?.message ||
              event.message ||
              "The AI interaction failed."
          );
        }

        let delta = "";

        if (
          (eventType === "step.delta" ||
            eventType === "content.delta") &&
          event.delta?.type === "text"
        ) {
          delta = event.delta.text || "";
        } else if (
          eventType === "text.delta" ||
          eventType === "interaction.text.delta"
        ) {
          delta =
            typeof event.delta === "string"
              ? event.delta
              : event.text || "";
        }

        if (delta) {
          receivedText = true;
          responseText += delta;

          updateAssistantMessage(
            chatId,
            assistantMessageId,
            responseText
          );
        }
      }

      if (!receivedText) {
        throw new Error(
          "The stream ended without any text. Please try again."
        );
      }

      streamCompleted = true;

      updateChat(chatId, {
        interactionId: interactionIdRef.current,
      });
    } catch (error) {
      console.error("Gemini chat error:", error);

      const errorText = getErrorMessage(error);

      if (chatId && assistantMessageId) {
        const finalText = responseText
          ? `${responseText}\n\n_${errorText}_`
          : errorText;

        updateAssistantMessage(
          chatId,
          assistantMessageId,
          finalText
        );
      } else {
        setResultData(errorText);
      }
    } finally {
      loadingRef.current = false;
      setLoading(false);

      if (chatId && assistantMessageId) {
        updateChat(chatId, {
          messages: messagesRef.current,
          interactionId: interactionIdRef.current,
        });
      }

      if (!streamCompleted) {
        console.warn(
          "The response did not complete. Received text was preserved."
        );
      }
    }
  };

  const contextValue = {
    input,
    setInput,
    recentPrompt,
    setRecentPrompt,
    showResult,
    setShowResult,
    resultData,
    setResultData,
    loading,
    setLoading,
    messages,
    setMessages,
    currentInteractionId,
    onSent,
    chatHistory,
    activeChatId,
    newChat,
    selectChat,
    deleteChat,
  };

  return (
    <ContextApi.Provider value={contextValue}>
      {children}
    </ContextApi.Provider>
  );
};

export default ContextProvider;
