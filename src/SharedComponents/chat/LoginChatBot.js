import React, { useState } from "react";
import { Input, Button, Card } from "antd";
import { MessageOutlined, CloseOutlined } from "@ant-design/icons";

const predefinedReplies = (message) => {
  const msg = message.toLowerCase();

  if (msg.includes("password"))
    return "If you forgot your password, click on 'Reset Password?' below the login form.";
  if (msg.includes("email"))
    return "Please use your registered email address to log in.";
  if (msg.includes("access"))
    return "If you are unable to access your account, please contact HR or Admin.";
  if (msg.includes("help"))
    return "I can help you with login, password reset, or account access.";

  return "Sorry, I didn’t understand that. Try asking about login, password, or access.";
};

export default function LoginChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋 How can I help you today?" },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    const botMsg = { from: "bot", text: predefinedReplies(input) };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      {!open && (
        <div style={styles.floatingBtn} onClick={() => setOpen(true)}>
          <MessageOutlined style={{ fontSize: 22 }} />
        </div>
      )}

      {open && (
        <Card style={styles.chatBox} bodyStyle={{ padding: 12 }}>
          <div style={styles.header}>
            <span>Login Help</span>
            <CloseOutlined onClick={() => setOpen(false)} />
          </div>

          <div style={styles.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  ...styles.message,
                  alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                  background: m.from === "user" ? "#1e40af" : "#e5e7eb",
                  color: m.from === "user" ? "#fff" : "#000",
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div style={styles.inputBox}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={sendMessage}
              placeholder="Ask something..."
            />
            <Button type="primary" onClick={sendMessage}>
              Send
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}

const styles = {
  floatingBtn: {
    position: "fixed",
    bottom: 30,
    right: 30,
    width: 50,
    height: 50,
    background: "#1e40af",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 9999,
  },
  chatBox: {
    position: "fixed",
    bottom: 90,
    right: 30,
    width: 320,
    height: 420,
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: 600,
    marginBottom: 8,
  },
  messages: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    overflowY: "auto",
    marginBottom: 8,
  },
  message: {
    padding: "8px 12px",
    borderRadius: 12,
    maxWidth: "80%",
    fontSize: "0.85rem",
  },
  inputBox: {
    display: "flex",
    gap: 6,
  },
};
