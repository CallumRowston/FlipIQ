"""
URL configuration for flipiq_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_http_methods
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from quiz.views_auth import RegisterView
import logging

logger = logging.getLogger(__name__)

def health_check(request):
    logger.info("Health check endpoint accessed")
    return JsonResponse({"status": "healthy", "message": "FlipIQ Backend is running"})

@csrf_exempt
@require_http_methods(["GET", "HEAD"])
def simple_health(request):
    logger.info("Simple health check endpoint accessed")
    return HttpResponse("OK", content_type="text/plain", status=200)

# Ultra simple test endpoint
def test_endpoint(request):
    return HttpResponse("WORKING", content_type="text/plain")

urlpatterns = [
    path('', health_check, name='health_check'),
    path('test/', test_endpoint, name='test'),
    path('health/', simple_health, name='simple_health'),
    path('healthz/', simple_health, name='healthz'),
    path('ping/', simple_health, name='ping'),
    path('admin/', admin.site.urls),
    path('api/', include('quiz.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('auth/', include('social_django.urls', namespace='social')),
]
