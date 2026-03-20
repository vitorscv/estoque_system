from django.urls import path
from .views import SacoReservaListView

urlpatterns = [
    
    path('api/estoque/', SacoReservaListView.as_view(), name='api-estoque-lista'),
]