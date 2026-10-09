import React, { createContext, useState } from 'react'
import runChat from '../config/gemini'

export const ContextApi = createContext()

const ContextProvider = (props) => {

    const [input, setInput] = useState("")
    const [recentPrompt, setResentPrompt] = useState("")
    const [showResult, setShowResult] = useState(false)
    const [resultData, setResultData] = useState("")
    const [loading, setLoading] = useState(false)


    const onSent = async (prompt) => {
        setResultData("")
        setShowResult(true)
        setLoading(true)

        const promptTosend = prompt !== undefined ? prompt : input;
        setResentPrompt(promptTosend)
        setInput("")
        try {
            const stream = await runChat(promptTosend);

            if (stream) {
                setLoading(false)
                let Result = ""
                for await (const chunk of stream) {
                    if (chunk.event_type === "step.delta") {
                        if (chunk.delta?.type === 'text') {
                            Result += chunk.delta.text;
                            setResultData(Result);
                        }
                    }
                }
            } else {
                setLoading(false);
                setResultData("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Streaming error:", error);
            setResultData("Something went wrong. Please try again.");
            setLoading(false);
        }

    }

    const contextvalue = {
        input,
        setInput,
        resultData,
        showResult,
        recentPrompt,
        loading,
        onSent
    }
    return (
        <ContextApi.Provider value={contextvalue}>
            {props.children}
        </ContextApi.Provider>
    )
}

export default ContextProvider