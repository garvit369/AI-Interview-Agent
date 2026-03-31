import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.service.js";
import User from "../models/user.model.js";
import Interview from "../models/interview.model.js";

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume required" });
    }
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);
    console.log("req.headers['content-type']:", req.headers["content-type"]);
    const filepath = req.file.path;

    const fileBuffer = await fs.promises.readFile(filepath);
    const uint8Array = new Uint8Array(fileBuffer);

    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

    // In the code above, we are processing an uploaded PDF resume. The key variables are:
    // - `filepath` is the path to the uploaded PDF file on the server, provided by the multer middleware when the file is uploaded.
    // - `fileBuffer` is a buffer that contains the raw binary data of the PDF file, read from the filesystem using `fs.promises.readFile()`.
    // - `uint8Array` is a typed array that represents the PDF file data in a format suitable for processing by the PDF.js library. It is created by converting the `fileBuffer` into a `Uint8Array`.
    // - `pdf` is an object representing the loaded PDF document, obtained by calling `pdfjsLib.getDocument()` with the `uint8Array`. This object allows us to access various properties and methods to extract content from the PDF, such as getting the number of pages and retrieving text content from each page.

    let resumeText = "";

    // Extract text from all pages

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      // getPage is a method provided by the PDF.js library that retrieves a specific page from the loaded PDF document. It takes the page number as an argument (starting from 1) and returns a promise that resolves to a page object. This page object contains various properties and methods that allow us to interact with the content of that specific page, such as extracting text, images, or other elements. In our code, we use `pdf.getPage(pageNum)` to access each page of the PDF in a loop, enabling us to extract text content from all pages of the resume.
      const content = await page.getTextContent();
      // getTextContent is a method of the page object in the PDF.js library that extracts the text content from a specific page of the PDF document. It returns a promise that resolves to an object containing an array of items, where each item represents a piece of text on the page. Each item has a `str` property that contains the actual text string. In our code, we call `page.getTextContent()` to retrieve the text content of each page, which we then process to extract and accumulate the full text of the resume.

      const pageText = content.items.map((item) => item.str).join(" ");
      resumeText += pageText + "\n";
    }

    resumeText = resumeText.replace(/\s+/g, " ").trim();

    // The for loop in the code above iterates through each page of the PDF document. It starts from page number 1 and continues until it reaches the total number of pages in the PDF (pdf.numPages). For each page, it retrieves the page object using pdf.getPage(pageNum) and then extracts the text content of that page using page.getTextContent(). The text content is an array of items, where each item represents a piece of text on the page. The loop maps through these items, extracts the string (item.str) from each item, and joins them together to form the complete text for that page. This text is then appended to the resumeText variable, which accumulates the text from all pages of the PDF.

    const messages = [
      {
        role: "system",
        content: `
Extract structured data from resume.

Return strictly JSON:

{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}
`,
      },
      {
        role: "user",
        content: resumeText,
      },
    ];

    const aiResponse = await askAi(messages);

    const parsed = JSON.parse(aiResponse);

    fs.unlinkSync(filepath);
    // The `fs.unlinkSync(filepath)` line in the code is used to delete the uploaded PDF file from the server's filesystem after it has been processed. This is important for several reasons:
    // 1. **Storage Management**: Uploaded files can take up significant storage space on the server. Deleting the file after processing helps to free up space and prevent the server from running out of storage over time.
    // 2. **Security**: Keeping uploaded files on the server can pose security risks, especially if they contain sensitive information. Deleting the file after use reduces the risk of unauthorized access to the file.
    // 3. **Data Privacy**: If the uploaded files contain personal or sensitive data, deleting them after processing helps to protect user privacy and comply with data protection regulations.

    res.json({
      role: parsed.role,
      experience: parsed.experience,
      projects: parsed.projects,
      skills: parsed.skills,
      resumeText,
    });
  } catch (error) {
    console.error(error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({ message: error.message });
  }
};

// the analyzeResume function is responsible for handling the resume analysis process. It first checks if a file was uploaded, then reads the PDF file and extracts its text content. The extracted text is sent to an AI service (like OpenRouter) with a system prompt that instructs the AI to return structured data in JSON format. The response from the AI is parsed and returned to the client, along with the original resume text. Finally, the uploaded file is deleted from the server to free up space.

// explain messages array in the code above and how it is used to interact with the AI service.

// The `messages` array in the code above is a structured format used to communicate with the AI service (like OpenRouter). It consists of a series of message objects, each having a `role` and `content`.

// - The first message has the role of "system" and contains instructions for the AI. It tells the AI to extract structured data from the resume and specifies the exact JSON format that the response should follow. This helps guide the AI in understanding what kind of output is expected.

// - The second message has the role of "user" and contains the actual text extracted from the resume. This is the input that the AI will analyze based on the instructions provided in the system message.

// When the `askAi` function is called with the `messages` array, it sends this structured conversation to the AI service. The AI processes the messages in order, using the system message to understand the task and then analyzing the user message (the resume text) to generate a response that adheres to the specified JSON format. The response from the AI is then parsed and used in the application as needed.

// In summary, the `messages` array serves as a way to structure the interaction with the AI, providing both instructions and input data in a clear format that the AI can understand and respond to effectively.

export const generateQuestion = async (req, res) => {
  try {
    let { role, experience, mode, resumeText, projects, skills } = req.body;

    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();

    if (!role || !experience || !mode) {
      return res
        .status(400)
        .json({ message: "Role, Experience and Mode are required." });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (user.credits < 50) {
      return res.status(400).json({
        message: "Not enough credits. Minimum 50 required.",
      });
    }

    const projectText =
      Array.isArray(projects) && projects.length ? projects.join(", ") : "None";

    const skillsText =
      Array.isArray(skills) && skills.length ? skills.join(", ") : "None";

    const safeResume = resumeText?.trim() || "None";

    const userPrompt = `
    Role:${role}
    Experience:${experience}
    InterviewMode:${mode}
    Projects:${projectText}
    Skills:${skillsText},
    Resume:${safeResume}
    `;

    if (!userPrompt.trim()) {
      return res.status(400).json({
        message: "Prompt content is empty.",
      });
    }

    const messages = [
      {
        role: "system",
        content: `
You are a real human interviewer conducting a professional interview.

Speak in simple, natural English as if you are directly talking to the candidate.

Generate exactly 5 interview questions.

Strict Rules:
- Each question must contain between 15 and 25 words.
- Each question must be a single complete sentence.
- Do NOT number them.
- Do NOT add explanations.
- Do NOT add extra text before or after.
- One question per line only.
- Keep language simple and conversational.
- Questions must feel practical and realistic.

Difficulty progression:
Question 1 → easy  
Question 2 → easy  
Question 3 → medium  
Question 4 → medium  
Question 5 → hard  

Make questions based on the candidate’s role, experience,interviewMode, projects, skills, and resume details.
`,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];

    const aiResponse = await askAi(messages);

    if (!aiResponse || !aiResponse.trim()) {
      return res.status(500).json({
        message: "AI returned empty response.",
      });
    }

    const questionsArray = aiResponse
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q.length > 0)
      .slice(0, 5);

    if (questionsArray.length === 0) {
      return res.status(500).json({
        message: "AI failed to generate questions.",
      });
    }

    user.credits -= 50;
    await user.save();

    const interview = await Interview.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText: safeResume,
      questions: questionsArray.map((q, index) => ({
        question: q,
        difficulty: ["easy", "easy", "medium", "medium", "hard"][index],
        timeLimit: [60, 60, 90, 90, 120][index],
      })),
    });

    res.json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      userName: user.name,
      questions: interview.questions,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `failed to create interview ${error}` });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body;

    const interview = await Interview.findById(interviewId);
    const question = interview.questions[questionIndex];

    // If no answer
    if (!answer) {
      question.score = 0;
      question.feedback = "You did not submit an answer.";
      question.answer = "";

      await interview.save();

      return res.json({
        feedback: question.feedback,
      });
    }

    // If time exceeded
    if (timeTaken > question.timeLimit) {
      question.score = 0;
      question.feedback = "Time limit exceeded. Answer not evaluated.";
      question.answer = answer;

      await interview.save();

      return res.json({
        feedback: question.feedback,
      });
    }

    const messages = [
      {
        role: "system",
        content: `
You are a professional human interviewer evaluating a candidate's answer in a real interview.

Evaluate naturally and fairly, like a real person would.

Score the answer in these areas (0 to 10):

1. Confidence – Does the answer sound clear, confident, and well-presented?
2. Communication – Is the language simple, clear, and easy to understand?
3. Correctness – Is the answer accurate, relevant, and complete?

Rules:
- Be realistic and unbiased.
- Do not give random high scores.
- If the answer is weak, score low.
- If the answer is strong and detailed, score high.
- Consider clarity, structure, and relevance.

Calculate:
finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

Feedback Rules:
- Write natural human feedback.
- 10 to 15 words only.
- Sound like real interview feedback.
- Can suggest improvement if needed.
- Do NOT repeat the question.
- Do NOT explain scoring.
- Keep tone professional and honest.

Return ONLY valid JSON in this format:

{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short human feedback"
}
`,
      },
      {
        role: "user",
        content: `
Question: ${question.question}
Answer: ${answer}
`,
      },
    ];

    const aiResponse = await askAi(messages);

    const parsed = JSON.parse(aiResponse);

    question.answer = answer;
    question.confidence = parsed.confidence;
    question.communication = parsed.communication;
    question.correctness = parsed.correctness;
    question.score = parsed.finalScore;
    question.feedback = parsed.feedback;
    await interview.save();

    return res.status(200).json({ feedback: parsed.feedback });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `failed to submit answer ${error}` });
  }
};

export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(400).json({ message: "failed to find Interview" });
    }

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestions ? totalScore / totalQuestions : 0;

    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;

    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;

    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

    interview.finalScore = finalScore;
    interview.status = "completed";

    await interview.save();

    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,
        score: q.score || 0,
        feedback: q.feedback || "",
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
      })),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `failed to finish Interview ${error}` });
  }
};




export const getMyInterviews = async (req,res) => {
  try {
    const interviews = await Interview.find({userId:req.userId})
    .sort({ createdAt: -1 })
    .select("role experience mode finalScore status createdAt");

    return res.status(200).json(interviews)

  } catch (error) {
     return res.status(500).json({message:`failed to find currentUser Interview ${error}`})
  }
}

export const getInterviewReport = async (req,res) => {
  try {
    const interview = await Interview.findById(req.params.id)

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }


    const totalQuestions = interview.questions.length;

    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });
    const avgConfidence = totalQuestions
      ? totalConfidence / totalQuestions
      : 0;

    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;

    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

       return res.json({
      finalScore: interview.finalScore,
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions
    });

  } catch (error) {
    return res.status(500).json({message:`failed to find currentUser Interview report ${error}`})
  }
}