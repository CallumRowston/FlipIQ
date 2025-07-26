from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models import Q
from .models import Quiz, FlashCard
from .serializers import QuizSerializer, FlashCardSerializer
from .ai_service import FlashCardAIService

class QuizListCreateView(generics.ListCreateAPIView):
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        Return user's own quizzes plus public quizzes
        If user is not authenticated, only return public quizzes
        """
        if self.request.user.is_authenticated:
            return Quiz.objects.filter(
                Q(created_by=self.request.user) | Q(is_public=True)
            ).distinct()
        else:
            return Quiz.objects.filter(is_public=True)
    
    def perform_create(self, serializer):
        """
        Associate the quiz with the current user when creating
        """
        if self.request.user.is_authenticated:
            serializer.save(created_by=self.request.user)
        else:
            serializer.save()

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
            # Pass the user to associate the quiz with them
            user = request.user if request.user.is_authenticated else None
            quiz = ai_service.create_quiz_with_flashcards(title, topic, num_cards, user=user)
            serializer = QuizSerializer(quiz)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )