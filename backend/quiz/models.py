from django.db import models

class Quiz(models.Model):
    title = models.CharField(max_length=250)
    description = models.TextField(blank=True)
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
