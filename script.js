const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatLog = document.getElementById("chat-log");
const scrollBtn = document.getElementById("scroll-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (message === "") return;

  addMessage("user", message);
  input.value = "";
  input.focus();

  const botElement = addMessage("bot", "Valoran piše");
  botElement.classList.add("typing");

  const response = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let botMsg = "";
  botElement.classList.remove("typing");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    botMsg += chunk;
    botElement.textContent = botMsg;
    scrollToBottom();
  }

  input.focus();
});

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = `message ${role}-message fade-in`;
  div.textContent = text;
  chatLog.appendChild(div);
  scrollToBottom();
  return div;
}

function scrollToBottom() {
  chatLog.scrollTop = chatLog.scrollHeight;
}

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }
});

// Enter = send, Shift+Enter = newline
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.dispatchEvent(new Event("submit"));
  }
});




