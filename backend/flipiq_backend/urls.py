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
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ultra simple test endpoint
def test_endpoint(request):
    logger.info(f"TEST ENDPOINT HIT: {request.method} {request.path}")
    print(f"TEST ENDPOINT HIT: {request.method} {request.path}")
    return HttpResponse("WORKING", content_type="text/plain")

def health_check(request):
    logger.info(f"HEALTH CHECK HIT: {request.method} {request.path}")
    print(f"HEALTH CHECK HIT: {request.method} {request.path}")
    return JsonResponse({"status": "healthy", "message": "FlipIQ Backend is running"})

urlpatterns = [
    path('', health_check, name='health_check'),
    path('test/', test_endpoint, name='test'),
    path('admin/', admin.site.urls),
]
