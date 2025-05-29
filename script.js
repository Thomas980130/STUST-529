const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

const API_KEY = "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";

sendBtn.addEventListener("click", async () => {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage("你", userMessage);
  input.value = "";
  sendBtn.disabled = true;

  appendMessage("系統", "正在輸入中...");

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP錯誤: ${response.status}`);
    }

    const data = await response.json();
    removeLastSystemMessage();

    const reply = data.choices?.[0]?.message?.content || "⚠️ 沒有回覆內容";
    appendMessage("ChatGPT", reply);
  } catch (error) {
    removeLastSystemMessage();
    appendMessage("錯誤", error.message);
  } finally {
    sendBtn.disabled = false;
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

function appendMessage(sender, message) {
  const div = document.createElement("div");
  div.innerHTML = `<b>${sender}:</b> ${message}`;
  chatBox.appendChild(div);
}

function removeLastSystemMessage() {
  const messages = chatBox.querySelectorAll("div");
  if (messages.length > 0) {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.innerHTML.includes("系統: 正在輸入中...")) {
      chatBox.removeChild(lastMsg);
    }
  }
}
