from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import Group, User
from django.db.models import F

from .models import CategoriaSacaria, SacoReserva, MovimentacaoEstoque
from .serializers import (
    CategoriaSerializer,
    SacoReservaSerializer,
    MovimentacaoEstoqueSerializer,
    GrupoSerializer,
    UsuarioSerializer,
)


class CategoriaListCreateView(generics.ListCreateAPIView):
    queryset = CategoriaSacaria.objects.all().order_by('nome')
    serializer_class = CategoriaSerializer


class SacoReservaListView(generics.ListCreateAPIView):
    queryset = SacoReserva.objects.filter(ativo=True).order_by('descricao')
    serializer_class = SacoReservaSerializer


class MovimentacaoListView(generics.ListAPIView):
    queryset = MovimentacaoEstoque.objects.select_related('saco').order_by('-data_movimentacao')
    serializer_class = MovimentacaoEstoqueSerializer


class GrupoListView(generics.ListAPIView):
    queryset = Group.objects.all().order_by('name')
    serializer_class = GrupoSerializer


class UsuarioListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('username')
    serializer_class = UsuarioSerializer


class MovimentarEstoqueView(APIView):
    """
    Rota exclusiva para a Fábrica (Estoquista) dar entrada ou saída.
    """
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
            # Cria a movimentação (o seu model/signal vai fazer a soma automaticamente igual no Admin)
            MovimentacaoEstoque.objects.create(
                saco=saco,
                tipo='entrada',
                quantidade=quantidade_int,
                responsavel=responsavel,
                observacao=observacao,
            )
            return Response({"status": "Entrada registrada com sucesso!"})

        elif tipo == 'saida':
            # Apenas valida se tem saldo suficiente ANTES de criar a movimentação
            if saco.quantidade_atual < quantidade_int:
                return Response(
                    {"erro": "Saldo insuficiente na fábrica!"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Cria a movimentação (o seu model/signal vai fazer a subtração automaticamente)
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
    queryset = SacoReserva.objects.all()
    serializer_class = SacoReservaSerializer

class CategoriaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CategoriaSacaria.objects.all()
    serializer_class = CategoriaSerializer

class MovimentacaoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MovimentacaoEstoque.objects.all()
    serializer_class = MovimentacaoEstoqueSerializer