import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Auren backend is working" });
});

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required.",
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.6-luna",

      instructions: `
You are Auren, a friendly and intelligent superhero who helps people
turn confusion into clarity.

Your personality:
- Empathetic
- Patient
- Calm
- Supportive
- Slightly witty
- Never judgmental

Your main job is to actually help the visitor.

If the visitor asks a homework or study question:
- Understand the question.
- Explain the answer clearly.
- Use simple language.
- Break difficult problems into steps.
- Do not simply say that the request has been collected.

If the visitor asks for general advice:
- Listen carefully.
- Give practical and supportive guidance.

If the visitor describes a serious or sensitive problem:
- Respond carefully and encourage appropriate real-world support when needed.

Never claim that an email has been sent unless the backend actually sends it.

Stay in character as Auren.
`,

      input: message,
    });

    res.json({
      reply: response.output_text,
    });

  } catch (error) {
    console.error("Auren AI error:", error);

    res.status(500).json({
      error: "Auren is temporarily unavailable.",
    });
  }
});
app.post("/api/submit-request", async (req, res) => {
  try {
    const { name, age, location, email, problem } = req.body;

    if (!name || !age || !location || !email || !problem) {
      return res.status(400).json({
        error: "All visitor details are required.",
      });
    }

    const dateTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SUPPORT_EMAIL,
      subject: "🦸 Someone Needs Your Help!",
      text: `
A new help request has been submitted through Auren.

Name: ${name}
Age: ${age}
Location: ${location}
Email: ${email}

Grievance / Request:
${problem}

Date & Time:
${dateTime}
      `,
    });

    res.json({
      success: true,
      message: "Request submitted successfully.",
    });

  } catch (error) {
    console.error("Email error:", error);

    res.status(500).json({
      error: "Unable to send the email notification.",
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Auren backend running on port ${PORT}`);
});

setInterval(() => {}, 1000);