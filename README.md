# AI Chatbot Project

This is an intelligent chatbot application built with Python, Flask, and machine learning technologies. The chatbot is designed to understand user intents, process natural language, and provide relevant responses.

## Project Structure

```
├── ai_chatbot/            # AI model implementation
├── app.py                 # Main Flask application
├── chatbot/               # Core chatbot functionality
│   ├── __init__.py
│   ├── intent_handler.py  # Handles user intent recognition
│   ├── processor.py       # Processes user input
│   └── response_generator.py # Generates responses
├── config.py              # Configuration settings
├── data/                  # Training data
│   └── training_data.json
├── database/              # Database related files
│   ├── __init__.py
│   ├── chat.db            # SQLite database
│   ├── db_handler.py      # Database operations
│   └── models.py          # Database models
├── requirements.txt       # Project dependencies
├── static/                # Static files
│   ├── css/
│   ├── images/
│   └── js/
├── templates/             # HTML templates
│   ├── chat.html
│   ├── dashboard.html
│   └── index.html
└── utils/                 # Utility functions
    ├── __init__.py
    ├── logger.py
    └── text_processor.py
```

## Features

- Natural language understanding using NLP techniques
- Intent recognition and classification
- Contextual response generation
- Conversation history tracking
- Web-based user interface
- Admin dashboard for monitoring and training

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Clone the repository

2. Create a virtual environment (recommended)
   ```
   python -m venv venv
   venv\Scripts\activate  # On Windows
   ```

3. Install dependencies
   ```
   pip install -r requirements.txt
   ```

4. Initialize the database
   ```
   python -c "from database.db_handler import init_db; init_db()"
   ```

5. Run the application
   ```
   python app.py
   ```

6. Access the application at `http://localhost:5000`

## Usage

- Navigate to the main page to start chatting with the bot
- Use the dashboard to view chat analytics and train the model
- Customize responses by updating the training data

## Technologies Used

- **Flask**: Web framework
- **SQLAlchemy**: ORM for database operations
- **NLTK/Spacy**: Natural language processing
- **TensorFlow**: Machine learning for intent classification
- **SQLite**: Database for storing conversations and training data

## Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.