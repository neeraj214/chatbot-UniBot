# 🤖 UniBot - AI-Powered Intelligent Chatbot

<div align="center">

![Python](https://img.shields.io/badge/Python-3.8%2B-blue?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-2.0-lightgrey?style=for-the-badge&logo=flask&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Machine Learning](https://img.shields.io/badge/ML-Powered-red?style=for-the-badge)

**An intelligent, context-aware conversational agent built to bridge the gap between human intent and digital response.** 🚀

[Explore Demo](#) • [Report Bug](https://github.com/neeraj214/chatbot-UniBot/issues) • [Request Feature](https://github.com/neeraj214/chatbot-UniBot/issues)

</div>

---

## 📖 Project Overview

**UniBot** is a robust, full-stack AI chatbot application designed to simulate intelligent human conversation. Built with **Python (Flask)** and **Modern React**, it leverages **Natural Language Processing (NLP)** to understand user queries, detect intent, and provide accurate, contextual responses.

Unlike static bots, UniBot features a **dynamic learning engine** backed by a database, allowing it to evolve its conversation capabilities over time. It includes a comprehensive **Admin Dashboard** for analytics, training data management, and conversation monitoring.

---

## ✨ Key Features

### 🧠 **Intelligent Core**
- **Advanced NLP Engine**: Utilizes **NLTK** and **SpaCy** for tokenization, lemmatization, and pattern matching.
- **Intent Recognition**: Accurately classifies user intent using heuristic and ML-based algorithms.
- **Contextual Memory**: Maintains conversation context to provide relevant follow-up responses.

### 💻 **Modern Interface**
- **Responsive UI**: Built with **React** and **Tailwind CSS** for a seamless experience across devices.
- **Real-time Interaction**: Instant message processing and response generation.
- **Interactive Components**: Features theme personalizers, contextual suggestions, and animated transitions.

### 🛡️ **Admin & Backend**
- **Comprehensive Dashboard**: View chat analytics, active users, and message logs.
- **Training Interface**: Update the bot's knowledge base (intents & patterns) directly from the UI.
- **Secure Authentication**: **JWT-based** login system for secure admin access.

### 🤠 **Developer Gamification**
- **Gitty up! Achievement**: Automated GitHub Action that rewards lightning-fast contributors who close issues/PRs within 5 minutes.

---

## 🛠️ Tech Stack

<details>
<summary><b>Click to expand Tech Stack</b></summary>

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | ![Python](https://img.shields.io/badge/-Python-black?logo=python) ![Flask](https://img.shields.io/badge/-Flask-black?logo=flask) | Core logic, API endpoints, and request handling. |
| **AI / ML** | ![NLTK](https://img.shields.io/badge/-NLTK-black) ![Scikit-Learn](https://img.shields.io/badge/-Scikit--Learn-F7931E?logo=scikit-learn&logoColor=white) | NLP and Intent Classification. |
| **Frontend** | ![React](https://img.shields.io/badge/-React-black?logo=react) ![Tailwind](https://img.shields.io/badge/-Tailwind-black?logo=tailwindcss) | Dynamic, responsive user interface. |
| **Database** | ![SQLite](https://img.shields.io/badge/-SQLite-black?logo=sqlite) ![SQLAlchemy](https://img.shields.io/badge/-SQLAlchemy-black) | Data persistence and ORM. |
| **Automation** | ![GitHub Actions](https://img.shields.io/badge/-GitHub%20Actions-black?logo=githubactions) | CI/CD and custom developer achievements. |

</details>

---

## 📂 Project Structure

```bash
chatbot-UniBot/
├── 📂 .github/               # 🤖 Automation & Workflows
│   └── 📂 workflows/         # GitHub Action YAMLs
├── 📂 chatbot/               # 🧠 Core AI Logic
│   ├── intent_handler.py     # Intent Recognition Engine
│   ├── processor.py          # Message Processing Pipeline
│   └── ml_intent_classifier.py # ML-based Intent Classifier
├── 📂 backend/               # 🌐 Flask API & Services
│   ├── api/                  # Route Handlers
│   ├── core/                 # Config & Security
│   └── services/             # Business Logic
├── 📂 src/                   # 🎨 React Frontend Source
│   ├── components/           # UI & Feature Components
│   └── pages/                # Application Views
├── 📂 database/              # 💾 Database Layer
├── 📂 auth/                  # 🔐 Authentication Module
└── 📄 app.py                 # 🚀 Main Application Entry Point
```

---

## 🚀 Setup & Installation

### 1️⃣ Clone & Navigate
```bash
git clone https://github.com/neeraj214/chatbot-UniBot.git
cd chatbot-UniBot
```

### 2️⃣ Backend Environment
```bash
# Setup Virtual Environment
python -m venv venv
source venv/bin/activate # Windows: venv\Scripts\activate

# Install Dependencies
pip install -r requirements.txt
python download_nltk.py
```

### 3️⃣ Frontend Environment
```bash
npm install
```

### 4️⃣ Launch UniBot
```bash
# Start Flask Backend (Default: http://localhost:5000)
python app.py

# Start React Frontend (Dev mode)
npm run dev
```

---

## 📊 Admin Dashboard

Unlock the full potential of UniBot with the integrated dashboard:

1. **Analytics**: Visualize chat volume, popular intents, and user engagement.
2. **Training**: Add new patterns and responses to the `training_data.json` via the UI to make the bot smarter instantly.
3. **Logs**: Monitor real-time conversations and debug intent classification.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">

**Made with ❤️ by [Neeraj](https://github.com/neeraj214)**

[⭐ Star this repo](https://github.com/neeraj214/chatbot-UniBot) • [🐛 Report Bug](https://github.com/neeraj214/chatbot-UniBot/issues)

</div>
