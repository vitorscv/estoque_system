from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import Group, User
from .permissions import (
    PermissaoFabrica,
    PermissaoFabricaOuRepresentanteLeituraEstoque,
    usuario_e_fabrica,
    usuario_e_representante,
)
from .models import CategoriaSacaria, SacoReserva, MovimentacaoEstoque
from .serializers import (
    CategoriaSerializer,
    SacoReservaSerializer,
    MovimentacaoEstoqueSerializer,
    GrupoSerializer,
    UsuarioSerializer,
)


class CategoriaListCreateView(generics.ListCreateAPIView):
    """Cadastro de categorias — apenas Fábrica."""
    queryset = CategoriaSacaria.objects.all().order_by('nome')
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticated, PermissaoFabrica]


class SacoReservaListView(generics.ListCreateAPIView):
    """
    GET: Fábrica ou Representantes (consulta).
    POST: apenas Fábrica (novo saco).
    """
    queryset = SacoReserva.objects.filter(ativo=True).order_by('descricao')
    serializer_class = SacoReservaSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated(), PermissaoFabricaOuRepresentanteLeituraEstoque()]
        return [IsAuthenticated(), PermissaoFabrica()]


class MovimentacaoListView(generics.ListAPIView):
    """Histórico de movimentações — apenas Fábrica."""
    queryset = MovimentacaoEstoque.objects.select_related('saco').order_by('-data_movimentacao')
    serializer_class = MovimentacaoEstoqueSerializer
    permission_classes = [IsAuthenticated, PermissaoFabrica]


class GrupoListView(generics.ListAPIView):
    queryset = Group.objects.all().order_by('name')
    serializer_class = GrupoSerializer
    permission_classes = [IsAuthenticated, PermissaoFabrica]


class UsuarioListView(generics.ListCreateAPIView):
    queryset = User.objects.all().order_by('username')
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated, PermissaoFabrica]


class UsuarioDestroyView(generics.DestroyAPIView):
    """Exclusão de usuário — apenas Fábrica."""

    queryset = User.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated, PermissaoFabrica]

    def perform_destroy(self, instance):
        if instance.pk == self.request.user.pk:
            raise PermissionDenied('Não é possível excluir o próprio usuário logado.')
        instance.delete()


class UsuarioPerfilView(APIView):
    """
    Perfil do usuário autenticado (qualquer JWT válido).
    Usado após o login para decidir portal Fábrica vs Vendedor.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(
            {
                'username': user.username,
                'representante': usuario_e_representante(user),
                'fabrica': usuario_e_fabrica(user),
            }
        )


class MovimentarEstoqueView(APIView):
    """
    Entrada/saída de estoque — apenas Fábrica (representantes não lançam).
    """
    permission_classes = [IsAuthenticated, PermissaoFabrica]

    def post(self, request, pk):
        saco = get_object_or_404(SacoReserva, pk=pk)

        quantidade = request.data.get('quantidade', 0)
        tipo = request.data.get('tipo')
        responsavel = request.data.get('responsavel', 'Sistema')
        observacao = request.data.get('observacao', '')

        try:
            quantidade_int = int(quantidade)
        except (TypeError, ValueError):
            return Response(
                {"erro": "A quantidade deve ser um número inteiro válido."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantidade_int <= 0:
            return Response(
                {"erro": "A quantidade deve ser maior que zero."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if tipo == 'entrada':
            MovimentacaoEstoque.objects.create(
                saco=saco,
                tipo='entrada',
                quantidade=quantidade_int,
                responsavel=responsavel,
                observacao=observacao,
            )
            return Response({"status": "Entrada registrada com sucesso!"})

        elif tipo == 'saida':
            if saco.quantidade_atual < quantidade_int:
                return Response(
                    {"erro": "Saldo insuficiente na fábrica!"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            MovimentacaoEstoque.objects.create(
                saco=saco,
                tipo='saida',
                quantidade=quantidade_int,
                responsavel=responsavel,
                observacao=observacao,
            )
            return Response({"status": "Saída registrada com sucesso!"})

        return Response(
            {"erro": "Tipo de movimentação inválido."},
            status=status.HTTP_400_BAD_REQUEST,
        )


class SacoReservaDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Detalhe/edição/exclusão de saco — apenas Fábrica (representantes só listam)."""
    queryset = SacoReserva.objects.all()
    serializer_class = SacoReservaSerializer
    permission_classes = [IsAuthenticated, PermissaoFabrica]


class CategoriaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CategoriaSacaria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticated, PermissaoFabrica]


class MovimentacaoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MovimentacaoEstoque.objects.all()
    serializer_class = MovimentacaoEstoqueSerializer
    permission_classes = [IsAuthenticated, PermissaoFabrica]
