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
            print(f"OpenAI Response: {content}")  # Debug log
            
            # Check if content is empty
            if not content:
                raise Exception("OpenAI returned empty response")
            
            # Remove markdown code blocks if present
            if content.startswith('```json'):
                content = content[7:]  # Remove ```json
            elif content.startswith('```'):
                content = content[3:]  # Remove ```
            
            if content.endswith('```'):
                content = content[:-3]  # Remove closing ```
            
            content = content.strip()
            
            # Parse the JSON response
            try:
                flashcards_data = json.loads(content)
            except json.JSONDecodeError as json_error:
                raise Exception(f"Failed to parse OpenAI response as JSON: {content}. Error: {str(json_error)}")
            
            # Validate the structure
            if not isinstance(flashcards_data, list):
                raise Exception(f"Expected JSON array, got: {type(flashcards_data)}")
            
            for i, card in enumerate(flashcards_data):
                if not isinstance(card, dict) or 'question' not in card or 'answer' not in card:
                    raise Exception(f"Invalid flashcard format at index {i}: {card}")
            
            return flashcards_data
            
        except openai.AuthenticationError:
            raise Exception("OpenAI API key is invalid or missing")
        except openai.RateLimitError:
            raise Exception("OpenAI API rate limit exceeded")
        except openai.APIError as api_error:
            raise Exception(f"OpenAI API error: {str(api_error)}")
        except Exception as e:
            if "Error generating flashcards:" in str(e):
                raise e  # Re-raise our custom errors
            raise Exception(f"Error generating flashcards: {str(e)}")
    
    def create_quiz_with_flashcards(self, title, topic, num_cards=5, user=None):
        """
        Create a new quiz with AI-generated flashcards
        """
        flashcards_data = self.generate_flashcards(topic, num_cards)
        
        # Create the quiz
        quiz = Quiz.objects.create(
            title=title,
            description=f"AI-generated quiz about {topic}",
            created_by=user
        )
        
        # Create flashcards for the quiz
        for card_data in flashcards_data:
            FlashCard.objects.create(
                quiz=quiz,
                question=card_data['question'],
                answer=card_data['answer']
            )
        
        return quiz
