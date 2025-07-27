from .settings import *
import os

# Production settings
DEBUG = False

# Security settings
SECRET_KEY = os.environ.get('SECRET_KEY', 'fallback-key-change-in-production')

# Railway automatically provides PORT
PORT = int(os.environ.get('PORT', 8000))

# Parse ALLOWED_HOSTS from environment variable
allowed_hosts = os.environ.get('ALLOWED_HOSTS', 'localhost,flipiq-production.up.railway.app')
ALLOWED_HOSTS = [host.strip() for host in allowed_hosts.split(',') if host.strip()]

# Temporarily allow all hosts for Railway health checks
ALLOWED_HOSTS.append('*')

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

# Additional CORS settings for API access
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True  # Temporarily allow all origins for testing
CORS_ALLOWED_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Add WhiteNoise middleware for static files
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Add WhiteNoise for static files
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'social_django.middleware.SocialAuthExceptionMiddleware',
]

# Static files configuration for production
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Additional static files directories (if needed)
STATICFILES_DIRS = []

# Ensure staticfiles directory exists
os.makedirs(STATIC_ROOT, exist_ok=True)

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# Security headers
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Temporarily disable CSRF for debugging admin login
CSRF_TRUSTED_ORIGINS = [
    'https://flipiq-production.up.railway.app',
    'http://flipiq-production.up.railway.app',
]

# HTTPS settings (uncomment when using HTTPS)
# SECURE_SSL_REDIRECT = True
# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True

# GitHub OAuth settings for production
SOCIAL_AUTH_GITHUB_KEY = os.environ.get('SOCIAL_AUTH_GITHUB_KEY')
SOCIAL_AUTH_GITHUB_SECRET = os.environ.get('SOCIAL_AUTH_GITHUB_SECRET')
SOCIAL_AUTH_GITHUB_SCOPE = ['user:email']

# Force HTTPS for OAuth redirects
SOCIAL_AUTH_REDIRECT_IS_HTTPS = True
USE_TLS = True

# Redirect URLs - point to frontend dashboard
LOGIN_REDIRECT_URL = 'flip-iq.vercel.app/dashboard'
SOCIAL_AUTH_LOGIN_REDIRECT_URL = 'flip-iq.vercel.app/dashboard'
SOCIAL_AUTH_NEW_USER_REDIRECT_URL = 'flip-iq.vercel.app/dashboard'
LOGOUT_REDIRECT_URL = 'flip-iq.vercel.app/auth'

# Authentication backends
AUTHENTICATION_BACKENDS = (
    'social_core.backends.github.GithubOAuth2',
    'django.contrib.auth.backends.ModelBackend',
)
