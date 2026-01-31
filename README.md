# 🤖 UniBot - AI-Powered Intelligent Chatbot

![Python](https://img.shields.io/badge/Python-3.8%2B-blue?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-2.0-lightgrey?style=for-the-badge&logo=flask&logoColor=black)
![NLP](https://img.shields.io/badge/NLP-NLTK%20%2F%20SpaCy-orange?style=for-the-badge)
![Machine Learning](https://img.shields.io/badge/ML-Powered-red?style=for-the-badge)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

> **An intelligent, context-aware conversational agent built to bridge the gap between human intent and digital response.** 🚀

---

## 📖 Project Overview

**UniBot** is a robust, full-stack AI chatbot application designed to simulate intelligent human conversation. Built with **Python (Flask)** and **Modern React**, it leverages **Natural Language Processing (NLP)** to understand user queries, detect intent, and provide accurate, contextual responses.

Unlike static bots, UniBot features a **dynamic learning engine** backed by a database, allowing it to evolve its conversation capabilities over time. It includes a comprehensive **Admin Dashboard** for analytics, training data management, and conversation monitoring.

Ideal for **Customer Support Automation**, **Personal Assistants**, and **Educational Tools**.

---

## ✨ Key Features

### 🧠 **Intelligent Core**
*   **Advanced NLP Engine**: Utilizes **NLTK** and **SpaCy** for tokenization, lemmatization, and pattern matching.
*   **Intent Recognition**: Accurately classifies user intent (e.g., greetings, inquiries, support) using heuristic and ML-based algorithms.
*   **Contextual Memory**: Maintains conversation context to provide relevant follow-up responses.

### 💻 **Modern Interface**
*   **Responsive UI**: Built with **React** and **Tailwind CSS** for a seamless experience across devices.
*   **Real-time Interaction**: Instant message processing and response generation.
*   **Rich Media Support**: Capable of rendering formatted text and interactive elements.

### 🛡️ **Admin & Backend**
*   **Comprehensive Dashboard**: View chat analytics, active users, and message logs.
*   **Training Interface**: update the bot's knowledge base (intents & patterns) directly from the UI.
*   **Secure Authentication**: **JWT-based** login system for secure admin access.
*   **Scalable Database**: Powered by **SQLAlchemy** and **SQLite** (easily scalable to PostgreSQL).

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | ![Python](https://img.shields.io/badge/-Python-black?logo=python) ![Flask](https://img.shields.io/badge/-Flask-black?logo=flask) | Core logic, API endpoints, and request handling. |
| **AI / ML** | ![NLTK](https://img.shields.io/badge/-NLTK-black) ![TensorFlow](https://img.shields.io/badge/-TensorFlow-black?logo=tensorflow) | Natural Language Processing and predictive modeling. |
| **Frontend** | ![React](https://img.shields.io/badge/-React-black?logo=react) ![Tailwind](https://img.shields.io/badge/-Tailwind-black?logo=tailwindcss) | Dynamic, responsive user interface. |
| **Database** | ![SQLite](https://img.shields.io/badge/-SQLite-black?logo=sqlite) ![SQLAlchemy](https://img.shields.io/badge/-SQLAlchemy-black) | Data persistence and ORM. |

---

## 📂 Project Structure

```bash
chatbot-UniBot/
├── 📂 app.py                 # 🚀 Main Flask Application Entry Point
├── 📂 api_routes.py          # 🌐 API Route Definitions
├── 📂 config.py              # ⚙️ App Configuration
├── 📂 chatbot/               # 🧠 Core AI Logic
│   ├── intent_handler.py     # Intent Recognition Engine
│   ├── processor.py          # Message Processing Pipeline
│   └── response_generator.py # Contextual Response Builder
├── 📂 database/              # 💾 Database Layer
│   ├── models.py             # SQLAlchemy Models
│   └── db_handler.py         # Database Operations
├── 📂 auth/                  # 🔐 Authentication Module
├── 📂 src/                   # 🎨 React Frontend Source
├── 📂 static/                # 📦 Compiled Static Assets
├── 📂 data/                  # 📚 Training Data (JSON)
└── 📄 requirements.txt       # 📦 Project Dependencies
```

---

## 🚀 Setup & Installation

Follow these steps to get UniBot up and running locally.

### 1️⃣ Prerequisites
*   **Python 3.8+**
*   **Node.js & npm** (for frontend development)
*   **Git**

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/neeraj214/chatbot-UniBot.git
cd chatbot-UniBot
```

### 3️⃣ Backend Setup
Create a virtual environment and install dependencies:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate

# Install Dependencies
pip install -r requirements.txt

# Download NLTK Data
python download_nltk.py
```

### 4️⃣ Database Initialization
Initialize the SQLite database:
```bash
python -c "from database.db_handler import init_db; init_db()"
```

### 5️⃣ Run the Application
Start the Flask server (serves both API and Frontend):
```bash
python app.py
```
*Access the application at: `http://localhost:5000`*

---

## 📊 Admin Dashboard

Unlock the full potential of UniBot with the integrated dashboard:

1.  **Login**: Access the secure admin route (default credentials or sign up).
2.  **Analytics**: Visualize chat volume, popular intents, and user engagement.
3.  **Training**: Add new patterns and responses to the `training_data.json` via the UI to make the bot smarter instantly.

---

## 🔮 Future Enhancements

*   [ ] **Voice Integration**: Speech-to-Text and Text-to-Speech capabilities.
*   [ ] **Deep Learning Integration**: Upgrade to Transformer models (BERT/GPT) for more nuanced understanding.
*   [ ] **Multi-language Support**: Expand capabilities to support global languages.
*   [ ] **Deployment**: Docker support and cloud deployment guides (AWS/Heroku).

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

**Made with ❤️ by [Neeraj](https://github.com/neeraj214)**

[⭐ Star this repo](https://github.com/neeraj214/chatbot-UniBot) • [🐛 Report Bug](https://github.com/neeraj214/chatbot-UniBot/issues)

</div>
