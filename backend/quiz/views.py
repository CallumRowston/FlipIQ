from rest_framework import generics
from .models import Quiz, FlashCard
from .serializers import QuizSerializer, FlashCardSerializer

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