DEBUG = True
ALLOWED_HOSTS = ['127.0.0.1', 'localhost']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'estoque_system',
        'USER': 'postgres',
        'PASSWORD': '1213',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}