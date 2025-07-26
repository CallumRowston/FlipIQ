from django.urls import path
from .views import (
    QuizListCreateView,
    QuizDetailView,
    FlashCardListCreateView,
    FlashCardDetailView,
    GenerateQuizView,
)

urlpatterns = [
    path('quizzes/', QuizListCreateView.as_view(), name='quiz-list-create'),
    path('quizzes/<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('flashcards/', FlashCardListCreateView.as_view(), name='flashcard-list-create'),
    path('flashcards/<int:pk>/', FlashCardDetailView.as_view(), name='flashcard-detail'),
    path('generate-quiz/', GenerateQuizView.as_view(), name='generate-quiz'),
]
