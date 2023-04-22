# For the first run
# nltk.download('punkt')

# Imports
import numpy as np
import nltk
from nltk.stem.porter import PorterStemmer

# Initializing the stemmer
stemmer = PorterStemmer()

# Function for splitting sentences into individual words and interpunction characters
def tokenize(sentence):
    return nltk.word_tokenize(sentence)

# Stemming function - cutting of the sufixes
def stem(word):
    return stemmer.stem(word.lower())

# Creating bag of words, returns array of 0's and 1's depending on occurance of word in know words
def bagOfWords(sentence, allWords):

    # Stemming
    givenWords = [stem(word) for word in sentence]

    bag = np.zeros(len(allWords), dtype=np.float32)
    for idx, word in enumerate(allWords):
        if word in givenWords:
            bag[idx] = 1

    return bag

def checkBagOfWords(bag):
    return 1 not in bag

# Testing
# tokenizedSentence = tokenize("create creator creating universe universal")
# print(tokenizedSentence)

# print([stem(word) for word in tokenizedSentence])

# allWords = ['creat', 'home', 'you', 'not', 'univers', 'you']
# print(bagOfWords(tokenizedSentence, allWords))