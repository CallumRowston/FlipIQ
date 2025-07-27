"""
WSGI config for flipiq_backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

# Use regular settings for debugging
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'flipiq_backend.settings')

application = get_wsgi_application()
