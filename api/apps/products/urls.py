from django.urls import path
from .views import SacoReservaListView, MovimentarEstoqueView

urlpatterns = [
    path('api/estoque/', SacoReservaListView.as_view(), name='api-estoque-lista'),
    path('estoque/<int:pk>/movimentar/', MovimentarEstoqueView.as_view(), name='estoque-movimentar'),
]