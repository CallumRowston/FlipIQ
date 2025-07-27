from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.http import JsonResponse

class OAuthCallbackView(APIView):
    """
    Convert Django session authentication to JWT tokens after OAuth
    """
    def get(self, request):
        if request.user.is_authenticated:
            # User is authenticated via Django session after OAuth
            # Generate JWT tokens
            refresh = RefreshToken.for_user(request.user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': request.user.id,
                    'username': request.user.username,
                }
            })
        else:
            return Response(
                {'error': 'User not authenticated'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

class AuthUserView(APIView):
    """
    Check if user is authenticated and return user info with tokens
    """
    def get(self, request):
        if request.user.is_authenticated:
            refresh = RefreshToken.for_user(request.user)
            return Response({
                'authenticated': True,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                },
                'user': {
                    'id': request.user.id,
                    'username': request.user.username,
                }
            })
        else:
            return Response({
                'authenticated': False
            })
