import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MessageCircle,
  Shield,
  Eye,
  Brain,
  Link,
  Send,
  Sparkles,
} from "lucide-react";
import "./App.css";

function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");

  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    location: "",
    email: "",
    problem: "",
  });

  const [messages, setMessages] = useState([]);

  const powers = [
    {
      icon: <Eye size={26} />,
      title: "Empathic Sight",
      text: "Sees beyond the words to understand what truly matters.",
    },
    {
      icon: <Brain size={26} />,
      title: "Clarity Pulse",
      text: "Turns confusing situations into clear next steps.",
    },
    {
      icon: <Link size={26} />,
      title: "AURA Link",
      text: "Connects people who need help with the support they need.",
    },
    {
      icon: <Shield size={26} />,
      title: "Memory Trace",
      text: "Keeps the important details of every request together.",
    },
  ];

  const questions = [
    "Hey. I'm Auren. You made it here, so something brought you to me. What should I call you?",
    "Nice to meet you! How old are you?",
    "Got it. What is your location?",
    "Thanks. What is your email address?",
    "Almost there. Tell me what you need help with. You can explain it in your own words.",
  ];

  const fieldNames = [
    "name",
    "age",
    "location",
    "email",
    "problem",
  ];

  const openChat = () => {
    setChatOpen(true);
    setStep(0);
    setInput("");
    setFormData({
      name: "",
      age: "",
      location: "",
      email: "",
      problem: "",
    });

    setMessages([
      {
        sender: "auren",
        text: questions[0],
      },
    ]);
  };

  const closeChat = () => {
    setChatOpen(false);
  };

  const addMessage = (sender, text) => {
    setMessages((previous) => [
      ...previous,
      {
        sender,
        text,
      },
    ]);
  };

 const handleSubmit = async (event) => {
  event.preventDefault();

  const value = input.trim();

  if (!value) {
    return;
  }

  // Age validation
  if (step === 1 && !/^\d+$/.test(value)) {
    addMessage("auren", "Please enter your age using numbers only.");
    return;
  }

  // Email validation
  if (
    step === 3 &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  ) {
    addMessage(
      "auren",
      "That email doesn't look quite right. Please enter a valid email address."
    );
    return;
  }

  // Save the visitor's information
  const currentField = fieldNames[step];

  setFormData((previous) => ({
    ...previous,
    [currentField]: value,
  }));

  // Show user's message
  addMessage("user", value);
  setInput("");

  // Collect basic information first
  if (step < questions.length - 1) {
    const nextStep = step + 1;

    setStep(nextStep);

    setTimeout(() => {
      addMessage("auren", questions[nextStep]);
    }, 400);

    return;
  }

  // After collecting the problem, send it to Auren AI
setStep(5);

addMessage(
  "auren",
  "Give me a moment. I'm thinking about the best way to help you..."
);

try {
  // Prepare the complete visitor information
  const finalData = {
    ...formData,
    problem: value,
  };

  // Send the request to the backend
  const response = await fetch("http://localhost:3001/api/submit-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(finalData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  // Ask Auren AI to respond to the visitor
  const aiResponse = await fetch("http://localhost:3001/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: value,
    }),
  });

  const aiData = await aiResponse.json();

  if (!aiResponse.ok) {
    throw new Error(aiData.error || "Auren AI is unavailable.");
  }

  addMessage("auren", aiData.reply);

  addMessage(
    "auren",
    "Your request has been submitted successfully. I've also sent the notification."
  );

} catch (error) {
  console.error("Submission error:", error);

  addMessage(
    "auren",
    "I received your request, but I'm having trouble completing the submission right now. Please try again."
  );
}
 };
  return (
    <div className="auren-app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">
        <div className="logo">
          <div className="logo-symbol">A</div>
          <span>AUREN</span>
        </div>

        <div className="nav-links">
          <a href="#story">The Story</a>
          <a href="#powers">Powers</a>
          <a href="#mission">Mission</a>
        </div>

        <button
          className="nav-button"
          onClick={openChat}
        >
          <MessageCircle size={18} />
          Ask Auren
        </button>
      </nav>


      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-background-orb orb-one"></div>
        <div className="hero-background-orb orb-two"></div>

        <div className="hero-content">

          <motion.div
            className="hero-text"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
          >

            <p className="eyebrow">
              <Sparkles size={16} />
              THE AURA SIGNAL IS ACTIVE
            </p>

            <h1>AUREN</h1>

            <h2>
              The Hero Who Turns
              <span> Chaos Into Clarity.</span>
            </h2>

            <p className="hero-description">
              You don't have to face everything alone.
              Auren listens, understands and helps people
              find their next step.
            </p>

            <div className="hero-buttons">

              <button
                className="primary-button"
                onClick={openChat}
              >
                <MessageCircle size={19} />
                Ask Auren
                <ArrowRight size={19} />
              </button>

              <a
                href="#story"
                className="secondary-button"
              >
                Discover his story
              </a>

            </div>

          </motion.div>


          {/* ================= AUREN CHARACTER ================= */}

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
          >
<div className="energy-particles">
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>
            <motion.img
              src="/images/auren-character.png"
              alt="Auren superhero"
              className="auren-character"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="character-glow"></div>

            <div className="character-status">
              <span className="status-dot"></span>
              AURA CORE • ONLINE
            </div>

          </motion.div>

        </div>

        <div className="scroll-indicator">
          <span>SCROLL TO ENTER THE STORY</span>
          <div></div>
        </div>

      </section>


      {/* ================= STORY ================= */}

      <section className="story-section" id="story">

        <div className="section-number">01</div>

        <div className="section-heading">

          <p className="eyebrow">
            THE ORIGIN
          </p>

          <h2>
            From a Dreamer
            <br />
            <span>to a Listener.</span>
          </h2>

        </div>

        <div className="story-content">

          <p>
            Once, Auren was an ordinary person who noticed
            something extraordinary: people were struggling
            everywhere, but many didn't know how to ask for help.
          </p>

          <p>
            Then came the AURA Core.
            It didn't give him super strength.
            It gave him something more powerful —
            the ability to truly listen.
          </p>

          <div className="quote">
            "I can't promise I can fix everything.
            <br />
            But I can promise I'll listen."
          </div>

        </div>

      </section>


      {/* ================= POWERS ================= */}

      <section className="powers-section" id="powers">

        <div className="section-number">02</div>

        <div className="section-heading">

          <p className="eyebrow">
            THE POWERS
          </p>

          <h2>
            Not just strength.
            <br />
            <span>Clarity.</span>
          </h2>

        </div>

        <div className="powers-grid">

          {powers.map((power, index) => (

            <motion.div
              className="power-card"
              key={power.title}
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.12,
              }}
            >

              <div className="power-icon">
                {power.icon}
              </div>

              <span className="power-number">
                0{index + 1}
              </span>

              <h3>
                {power.title}
              </h3>

              <p>
                {power.text}
              </p>

            </motion.div>

          ))}

        </div>

      </section>


      {/* ================= PERSONALITY ================= */}

      <section className="personality-section">

        <div className="personality-box">

          <div>

            <p className="eyebrow">
              THE PERSON BEHIND THE POWER
            </p>

            <h2>
              Calm.
              <br />
              Kind.
              <br />
              <span>Always There.</span>
            </h2>

          </div>

          <div className="personality-list">

            <div>♡ Empathetic</div>
            <div>◈ Patient</div>
            <div>◇ Protective</div>
            <div>✦ Curious</div>
            <div>◌ A little witty</div>

          </div>

        </div>

      </section>


      {/* ================= MISSION ================= */}

      <section
        className="mission-section"
        id="mission"
      >

        <div className="section-number">
          03
        </div>

        <p className="eyebrow">
          THE MISSION
        </p>

        <h2>
          Every voice
          <br />
          <span>matters.</span>
        </h2>

        <p className="mission-text">
          Auren exists to be the bridge between people
          and the help they need.
          No judgment. No pressure.
          Just support, understanding and action.
        </p>

        <button
          className="primary-button"
          onClick={openChat}
        >
          <MessageCircle size={19} />
          Tell Auren Your Story
          <ArrowRight size={19} />
        </button>

      </section>


      {/* ================= FOOTER ================= */}

      <footer>

        <div className="logo">
          <div className="logo-symbol">
            A
          </div>

          <span>AUREN</span>
        </div>

        <p>
          The Hero Who Turns Chaos Into Clarity.
        </p>

        <span>
          © 2026 Auren
        </span>

      </footer>


      {/* ================= CHATBOT ================= */}

      {chatOpen && (

        <motion.div
          className="chat-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >

          <motion.div
            className="chat-window"
            initial={{
              y: 50,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
          >

            {/* CHAT HEADER */}

            <div className="chat-header">

              <div>

                <div className="chat-hero-icon">
                  A
                </div>

                <div>

                  <strong>
                    Auren
                  </strong>

                  <small>
                    ● AURA SIGNAL ACTIVE
                  </small>

                </div>

              </div>

              <button
                className="close-chat"
                onClick={closeChat}
              >
                ×
              </button>

            </div>


            {/* CHAT MESSAGES */}

            <div className="chat-messages">

              {messages.map((message, index) => (

                <div
                  key={index}
                  className={`message ${
                    message.sender === "user"
                      ? "user-message"
                      : "hero-message"
                  }`}
                >
                  {message.text}
                </div>

              ))}

              {step === 5 && (

                <div className="submission-summary">

                  <strong>
                    Request Summary
                  </strong>

                  <p>
                    Name: {formData.name}
                  </p>

                  <p>
                    Age: {formData.age}
                  </p>

                  <p>
                    Location: {formData.location}
                  </p>

                  <p>
                    Email: {formData.email}
                  </p>

                  <p>
                    Request: {formData.problem}
                  </p>

                </div>

              )}

            </div>


            {/* CHAT INPUT */}

            {step < 5 && (

              <form
                className="chat-input"
                onSubmit={handleSubmit}
              >

                <input
                  value={input}
                  onChange={(event) =>
                    setInput(event.target.value)
                  }
                  placeholder="Type your message..."
                  autoFocus
                />

                <button type="submit">
                  <Send size={18} />
                </button>

              </form>

            )}

            {step === 5 && (

              <div className="chat-complete">
                ✓ Information collected successfully
              </div>

            )}

          </motion.div>

        </motion.div>

      )}

    </div>
  );
}


export default App; 