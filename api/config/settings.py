from datetime import timedelta
from pathlib import Path
import os 

# BASE_DIR 'api'
BASE_DIR = Path(__file__).resolve().parent.parent


SECRET_KEY = 'django-insecure-chave-secreta-para-desenvolvimento-local'
DEBUG = True
ALLOWED_HOSTS = ['127.0.0.1', 'localhost']

# APPs INSTALADOS
INSTALLED_APPS = [
     
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # App controle de estoque
    'apps.products',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
]


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware', 
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ARQUIVO DE ROTAS PRINCIPAL 
ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'



# BANCO DE DADOS
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        
        'NAME': os.environ.get('DB_NAME', 'estoque_system'),
        'USER': os.environ.get('DB_USER', 'postgres'),
        'PASSWORD': os.environ.get('DB_PASSWORD', '1213'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

# IDIOMA E HORA
LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True


STATIC_URL = 'static/'

# CHAVE PRIMÁRIA
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# permissão API do react 
CORS_ALLOW_ALL_ORIGINS = True

# Django REST Framework + JWT 
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=8),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}