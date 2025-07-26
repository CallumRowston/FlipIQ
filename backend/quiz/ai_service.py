import openai
import json
from django.conf import settings
from .models import Quiz, FlashCard

class FlashCardAIService:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
    
    def generate_flashcards(self, topic, num_cards=5):
        """
        Generate flashcards for a given topic using OpenAI
        """
        prompt = f"""
        Generate {num_cards} educational flashcards about {topic}.
        Return the response as a JSON array where each object has 'question' and 'answer' fields.
        Make the questions clear and concise, and the answers accurate but brief.
        
        Example format:
        [
            {{"question": "What is the capital of France?", "answer": "Paris"}},
            {{"question": "What year did World War II end?", "answer": "1945"}}
        ]
        """
        
        try:
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an educational assistant that creates quiz questions and answers."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            
            content = response.choices[0].message.content.strip()
            
            # Parse the JSON response
            flashcards_data = json.loads(content)
            
            return flashcards_data
            
        except Exception as e:
            raise Exception(f"Error generating flashcards: {str(e)}")
    
    def create_quiz_with_flashcards(self, title, topic, num_cards=5):
        """
        Create a new quiz with AI-generated flashcards
        """
        flashcards_data = self.generate_flashcards(topic, num_cards)
        
        # Create the quiz
        quiz = Quiz.objects.create(
            title=title,
            description=f"AI-generated quiz about {topic}"
        )
        
        # Create flashcards for the quiz
        for card_data in flashcards_data:
            FlashCard.objects.create(
                quiz=quiz,
                question=card_data['question'],
                answer=card_data['answer']
            )
        
        return quiz
