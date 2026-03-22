"""
Grupos Django (auth.Group):
  - Fabrica        → painel da fábrica, lançamentos, cadastros.
  - Representantes → apenas consulta do estoque (lista GET /api/estoque/), sem lançamentos.
"""
from rest_framework.permissions import BasePermission, SAFE_METHODS

GRUPO_FABRICA = 'Fabrica'
GRUPO_REPRESENTANTES = 'Representantes'


def usuario_e_fabrica(user) -> bool:
    if not user or not user.is_authenticated:
        return False
    if user.is_superuser:
        return True
    return user.groups.filter(name=GRUPO_FABRICA).exists()


def usuario_e_representante(user) -> bool:
    if not user or not user.is_authenticated:
        return False
    return user.groups.filter(name=GRUPO_REPRESENTANTES).exists()


class PermissaoFabrica(BasePermission):
    """Apenas usuários do grupo Fabrica (ou superusuário)."""

    def has_permission(self, request, view):
        return usuario_e_fabrica(request.user)


class PermissaoFabricaOuRepresentanteLeituraEstoque(BasePermission):
    """
    GET em estoque: Fabrica ou Representantes.
    Escrita não é tratada aqui — use PermissaoFabrica para POST/PUT/PATCH/DELETE.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_superuser:
            return True
        if request.method in SAFE_METHODS:
            return usuario_e_fabrica(request.user) or usuario_e_representante(request.user)
        return False
