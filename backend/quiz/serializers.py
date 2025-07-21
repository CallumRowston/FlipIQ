from rest_framework import serializers
from .models import Quiz, FlashCard

# Converts API > JSON representation of FlashCard and Quiz models

class FlashCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlashCard
        fields = ['id', 'question', 'answer', 'created_at']

class QuizSerializer(serializers.ModelSerializer):
    flashcards = FlashCardSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'created_at', 'flashcards']
