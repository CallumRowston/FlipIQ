from .settings import *
import os

# Production settings
DEBUG = False

print("=== LOADING PRODUCTION SETTINGS ===")
print(f"DATABASE_URL present: {'DATABASE_URL' in os.environ}")
print(f"SECRET_KEY present: {'SECRET_KEY' in os.environ}")
print(f"PORT: {os.environ.get('PORT', 'NOT SET')}")

# Security settings
SECRET_KEY = os.environ.get('SECRET_KEY', 'fallback-key-change-in-production')

# Railway automatically provides PORT
PORT = int(os.environ.get('PORT', 8000))

# Parse ALLOWED_HOSTS from environment variable
allowed_hosts = os.environ.get('ALLOWED_HOSTS', 'localhost,flipiq-production.up.railway.app')
ALLOWED_HOSTS = [host.strip() for host in allowed_hosts.split(',') if host.strip()]

# Debug logging
print(f"ALLOWED_HOSTS environment variable: {os.environ.get('ALLOWED_HOSTS', 'NOT SET')}")
print(f"Final ALLOWED_HOSTS: {ALLOWED_HOSTS}")

# Railway provides DATABASE_URL automatically
if 'DATABASE_URL' in os.environ:
    import dj_database_url
    DATABASES = {
        'default': dj_database_url.parse(os.environ.get('DATABASE_URL'))
    }
else:
    # Fallback to SQLite for testing (not recommended for production)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# CORS settings for production
cors_origins = os.environ.get('CORS_ALLOWED_ORIGINS', 'https://flipiq-frontend.vercel.app')
if cors_origins:
    CORS_ALLOWED_ORIGINS = [origin.strip() for origin in cors_origins.split(',') if origin.strip()]

# Add whitenoise for static files
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

# Static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Ensure staticfiles directory exists
os.makedirs(STATIC_ROOT, exist_ok=True)

# Security headers
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# HTTPS settings (uncomment when using HTTPS)
# SECURE_SSL_REDIRECT = True
# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True
