// js/chatgpt.js
async function askChatGPT(message) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return data.reply || "No response from ChatGPT.";
  } catch (err) {
    console.error(err);
    return "Sorry, something went wrong connecting to the server.";
  }
}

const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-message");
const chatWindow = document.getElementById("chat-window");

if (chatForm && chatInput && chatWindow) {
  // welcome message
  const welcome = document.createElement("div");
  welcome.className = "message bot";
  welcome.textContent = "👋 Hi! I’m your GetSettle assistant. How can I help you today?";
  chatWindow.appendChild(welcome);

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // user bubble
    const userDiv = document.createElement("div");
    userDiv.className = "message user";
    userDiv.textContent = userMessage;
    chatWindow.appendChild(userDiv);

    chatInput.value = "";

    // loading bubble
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "message bot";
    loadingDiv.textContent = "Thinking...";
    chatWindow.appendChild(loadingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // get reply
    const reply = await askChatGPT(userMessage);
    loadingDiv.textContent = reply;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  });
}
