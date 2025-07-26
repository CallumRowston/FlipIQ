from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Quiz, FlashCard
from .serializers import QuizSerializer, FlashCardSerializer
from .ai_service import FlashCardAIService

class QuizListCreateView(generics.ListCreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

class QuizDetailView(generics.RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

class FlashCardListCreateView(generics.ListCreateAPIView):
    queryset = FlashCard.objects.all()
    serializer_class = FlashCardSerializer

class FlashCardDetailView(generics.RetrieveAPIView):
    queryset = FlashCard.objects.all()
    serializer_class = FlashCardSerializer

class GenerateQuizView(APIView):
    """
    Generate a new quiz with AI-generated flashcards
    """
    def post(self, request):
        title = request.data.get('title')
        topic = request.data.get('topic')
        num_cards = request.data.get('num_cards', 5)
        
        if not title or not topic:
            return Response(
                {'error': 'Both title and topic are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            ai_service = FlashCardAIService()
            quiz = ai_service.create_quiz_with_flashcards(title, topic, num_cards)
            serializer = QuizSerializer(quiz)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )