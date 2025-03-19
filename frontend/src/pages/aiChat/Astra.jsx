import React, { useEffect, useRef, useState } from "react";
import ReactMarkDown from "react-markdown";
import "./style.css";
import { useChatStore } from "../../store/useChatStore.js";
function Astra() {
    const { getAIMessages, aiMessages, chatWithAI, isResponseLoading } = useChatStore();
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        getAIMessages();
    }, []);

    useEffect(() => {
        scrollToBottom()
    }, [aiMessages]);

    const handleMessageSend = (e) => {
        e.preventDefault();
        chatWithAI(message);
        setMessage("");
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <div className="chat-container">
            <div className="chat-header">Chat with Astra</div>
            <div className="chat-messages">
                {aiMessages && aiMessages.length > 0 ? (
                    aiMessages.map((msg, index) => (
                        <div key={index} className={"message user-message"}>
                            <div className="message-prompt">{msg.prompt}</div>
                            <div className="message-response"> <ReactMarkDown>{msg.response}</ReactMarkDown> </div>
                        </div>
                    ))
                ) : (
                    <div className="message ai-message">Hello! I am Astra. How can I assist you today?</div>
                )}
                <div ref={messagesEndRef}></div>

            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleMessageSend} disabled={isResponseLoading}>
                    {isResponseLoading ? "Sending..." : "Send"}
                </button>
            </div>
        </div>
    )
}

export default Astra;