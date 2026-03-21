from django.urls import path
from .views import (
    CategoriaListCreateView,
    SacoReservaListView,
    MovimentacaoListView,
    MovimentarEstoqueView,
    GrupoListView,
    UsuarioListView,
    SacoReservaDetailView,
    CategoriaDetailView,
    MovimentacaoDetailView,
)

urlpatterns = [
    path('api/estoque/',                         SacoReservaListView.as_view(),      name='api-estoque-lista'),
    path('api/estoque/<int:pk>/movimentar/',     MovimentarEstoqueView.as_view(),    name='estoque-movimentar'),
    path('api/categorias/',                      CategoriaListCreateView.as_view(),  name='api-categorias'),
    path('api/movimentacoes/',                   MovimentacaoListView.as_view(),     name='api-movimentacoes'),
    path('api/grupos/',                          GrupoListView.as_view(),            name='api-grupos'),
    path('api/usuarios/',                        UsuarioListView.as_view(),          name='api-usuarios'),
    path('api/estoque/<int:pk>/', SacoReservaDetailView.as_view(), name='api-estoque-detalhe'),
    path('api/categorias/<int:pk>/', CategoriaDetailView.as_view(), name='api-categorias-detalhe'),
    path('api/movimentacoes/<int:pk>/', MovimentacaoDetailView.as_view(), name='api-movimentacoes-detalhe'),
]
