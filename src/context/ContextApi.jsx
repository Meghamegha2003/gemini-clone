
import { createContext, useState, useEffect, useRef } from "react";
import runChat from "../config/gemini";

export const ContextApi = createContext();

const getInitialHistory = () => {
  try {
    return JSON.parse(localStorage.getItem("chatHistory")) || [];
  } catch {
    return [];
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

    reader.onerror = () => reject(new Error("Failed to display image."));
    reader.readAsDataURL(file);
  });

const ContextProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState(getInitialHistory);
  const [activeChatId, setActiveChatId] = useState(
    () => getInitialHistory()[0]?.id || null
  );
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentInteractionId, setCurrentInteractionId] = useState(null);

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
    } catch {
      console.error("Chat history could not be saved. Storage may be full.");
    }
  }, [chatHistory]);

  const updateChat = (chatId, updates) => {
    setChatHistory((previous) =>
      previous.map((chat) =>
        chat.id === chatId
          ? { ...chat, ...updates, updatedAt: Date.now() }
          : chat
      )
    );
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

    const chat = chatHistoryRef.current.find((item) => item.id === chatId);
    if (!chat) return;

    setActiveChatId(chat.id);
    activeChatIdRef.current = chat.id;
    setMessages(chat.messages);
    messagesRef.current = chat.messages;
    setInput("");
    setRecentPrompt("");
    setResultData("");
    setShowResult(chat.messages.length > 0);
    setCurrentInteractionId(chat.interactionId);
    interactionIdRef.current = chat.interactionId;
  };

  const deleteChat = (chatId) => {
    if (loadingRef.current) return;

    setChatHistory((previous) =>
      previous.filter((chat) => chat.id !== chatId)
    );

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

    if ((!promptToSend && !imageFile) || loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    let chatId = activeChatIdRef.current;
    let previousMessages = messagesRef.current;

    try {
      const imageDataUrl = imageFile
        ? await fileToDataUrl(imageFile)
        : null;

      if (!chatId) {
        const newChatData = createChat();
        chatId = newChatData.id;
        previousMessages = [];

        setChatHistory((previous) => [newChatData, ...previous]);
        setActiveChatId(chatId);
        activeChatIdRef.current = chatId;
        interactionIdRef.current = null;
        setCurrentInteractionId(null);
      } else {
        const existingChat = chatHistoryRef.current.find(
          (chat) => chat.id === chatId
        );

        previousMessages = existingChat?.messages || previousMessages;
      }

      const displayPrompt = promptToSend || "Describe this image.";

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

      const updatedMessages = [
        ...previousMessages,
        userMessage,
        assistantMessage,
      ];

      setMessages(updatedMessages);
      messagesRef.current = updatedMessages;

      const existingChat = chatHistoryRef.current.find(
        (chat) => chat.id === chatId
      );

      const title =
        previousMessages.length === 0
          ? (promptToSend || "Image question").slice(0, 35)
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

      if (!stream || !stream[Symbol.asyncIterator]) {
        throw new Error("Invalid response stream.");
      }

      let responseText = "";

      for await (const event of stream) {
        const eventType = event.event_type ?? event.type;

        if (
          eventType === "interaction.created" ||
          eventType === "interaction.complete" ||
          eventType === "interaction.completed"
        ) {
          const id = event.interaction?.id ?? event.id;

          if (id) {
            interactionIdRef.current = id;
            setCurrentInteractionId(id);
          }
        }

        let delta = "";

        if (
          eventType === "content.delta" &&
          event.delta?.type === "text"
        ) {
          delta = event.delta.text ?? "";
        } else if (
          eventType === "text.delta" ||
          eventType === "interaction.text.delta"
        ) {
          delta =
            typeof event.delta === "string"
              ? event.delta
              : event.text ?? "";
        }

        if (delta) {
          responseText += delta;
          setResultData(responseText);

          setMessages((previous) => {
            const next = previous.map((message) =>
              message.id === assistantMessage.id
                ? { ...message, text: responseText }
                : message
            );

            messagesRef.current = next;

            setChatHistory((chats) =>
              chats.map((chat) =>
                chat.id === chatId
                  ? {
                      ...chat,
                      messages: next,
                      interactionId: interactionIdRef.current,
                      updatedAt: Date.now(),
                    }
                  : chat
              )
            );

            return next;
          });
        }
      }

      setChatHistory((previous) =>
        previous.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                interactionId: interactionIdRef.current,
                updatedAt: Date.now(),
              }
            : chat
        )
      );
    } catch (error) {
      let errorText = "Something went wrong. Please try again.";

      if (error?.message?.includes("429") || error?.status === 429) {
        errorText =
          "You've reached the free AI usage limit. Please try again after your quota resets.";
      } else if (error?.message) {
        errorText = error.message;
      }

      setMessages((previous) => {
        const next = previous.map((message, index) =>
          index === previous.length - 1 && message.role === "assistant"
            ? { ...message, text: errorText }
            : message
        );

        messagesRef.current = next;

        if (chatId) {
          setChatHistory((chats) =>
            chats.map((chat) =>
              chat.id === chatId
                ? { ...chat, messages: next, updatedAt: Date.now() }
                : chat
            )
          );
        }

        return next;
      });

      setResultData(errorText);
    } finally {
      loadingRef.current = false;
      setLoading(false);
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
