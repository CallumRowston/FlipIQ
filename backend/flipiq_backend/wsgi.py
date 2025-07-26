"""
WSGI config for flipiq_backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

# Check if we're on Railway or have explicit settings module
if 'RAILWAY_STATIC_URL' in os.environ or 'DATABASE_URL' in os.environ:
    # We're on Railway, use production settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'flipiq_backend.settings_production')
elif 'DJANGO_SETTINGS_MODULE' not in os.environ:
    # Local development, use regular settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'flipiq_backend.settings')

application = get_wsgi_application()
