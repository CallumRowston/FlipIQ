from django.contrib.auth.decorators import login_required
from django.http import HttpResponse

@login_required
def profile(request):
    return HttpResponse(f"<h1>Welcome, {request.user.username}!</h1><p>This is your profile page.</p>")
