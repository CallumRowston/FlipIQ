from django.db import models
from django.contrib.auth.models import User

class Quiz(models.Model):
    title = models.CharField(max_length=250)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    is_public = models.BooleanField(default=False)  # Admin can make quizzes public for everyone
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class FlashCard(models.Model):
    quiz = models.ForeignKey(Quiz, related_name='flashcards', on_delete=models.CASCADE)
    question = models.CharField(max_length=250)
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question
