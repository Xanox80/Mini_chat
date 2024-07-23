import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const ChatContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
`;

const Header = styled.div`
  background-color: #075e54;
  color: white;
  padding: 20px;
  font-size: 24px;
  font-weight: bold;
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Message = styled.div`
  background-color: ${(props) => (props.isSent ? "#dcf8c6" : "white")};
  color: #303030;
  padding: 12px 18px;
  border-radius: 20px;
  margin-bottom: 10px;
  max-width: 70%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  align-self: ${(props) => (props.isSent ? "flex-end" : "flex-start")};
`;

const InputContainer = styled.div`
  display: flex;
  padding: 20px;
  background-color: #f0f2f5;
  border-top: 1px solid #d1d7db;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 15px;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  background-color: white;
  margin-right: 10px;
`;

const SendButton = styled.button`
  background-color: #128c7e;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #075e54;
  }
`;

function Chat({ socket, token }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, isSent: false },
      ]);
    });

    return () => {
      socket.off("message");
    };
  }, [socket]);

  useEffect(scrollToBottom, [messages]);

  const sendMessage = () => {
    if (inputMessage) {
      socket.emit("message", { text: inputMessage, token });
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputMessage, isSent: true },
      ]);
      setInputMessage("");
    }
  };

  return (
    <ChatContainer>
      <Header>Chat App</Header>
      <MessagesContainer>
        {messages.map((message, index) => (
          <Message key={index} isSent={message.isSent}>
            {message.text}
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <Input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <SendButton onClick={sendMessage}>➤</SendButton>
      </InputContainer>
    </ChatContainer>
  );
}

export default Chat;
