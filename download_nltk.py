import nltk

# Download required NLTK data
print("Downloading NLTK resources...")
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

# Download punkt properly - punkt_tab is not a valid NLTK resource
# The correct resource is just 'punkt'
print("Downloading punkt properly...")
nltk.download('punkt', quiet=False)
print("punkt download completed")

print("NLTK resources download completed.")