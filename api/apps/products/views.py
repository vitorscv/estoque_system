from django.shortcuts import render, get_object_or_404
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import F
from .models import SacoReserva
from .serializers import SacoReservaSerializer

class SacoReservaListView(generics.ListAPIView):
    #### REGRA DE NEGÓCIO DA PANTEX: 
    # 1. Mandar para o vendedor apenas os sacos que estão ATIVOS (ativo=True).
    # 2. Já mandar ordenado por ordem alfabética da descrição (order_by).
    queryset = SacoReserva.objects.filter(ativo=True).order_by('descricao')
    
    # comunicação view 
    serializer_class = SacoReservaSerializer


class MovimentarEstoqueView(APIView):
    """
    Rota exclusiva para a Fábrica (Estoquista) dar entrada ou saída.
    """
    def post(self, request, pk):
        # 1. Busca o saco pelo ID (pk) ou retorna erro 404 se não existir
        saco = get_object_or_404(SacoReserva, pk=pk)
        
        # 2. Pega os dados que o React enviou
        quantidade = request.data.get('quantidade', 0)
        tipo = request.data.get('tipo')

        # Validação básica
        try:
            quantidade_int = int(quantidade)
        except (TypeError, ValueError):
            return Response({"erro": "A quantidade deve ser um número inteiro válido."}, status=status.HTTP_400_BAD_REQUEST)

        if quantidade_int <= 0:
            return Response({"erro": "A quantidade deve ser maior que zero."}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Regra de Entrada
        if tipo == 'entrada':
            # Usa o F() para travar a linha no banco e evitar falha se 2 pessoas clicarem juntas
            SacoReserva.objects.filter(pk=saco.pk).update(quantidade_atual=F('quantidade_atual') + quantidade_int)
            return Response({"status": "Entrada registrada com sucesso!"})

        # 4. Regra de Saída
        elif tipo == 'saida':
            # Tenta subtrair apenas se houver estoque suficiente (checa no WHERE)
            updated = SacoReserva.objects.filter(pk=saco.pk, quantidade_atual__gte=quantidade_int).update(quantidade_atual=F('quantidade_atual') - quantidade_int)
            if updated == 0:
                return Response({"erro": "Saldo insuficiente na fábrica!"}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"status": "Saída registrada com sucesso!"})

        # Se o React mandar um tipo bizarro que não seja entrada/saida
        return Response({"erro": "Tipo de movimentação inválido."}, status=status.HTTP_400_BAD_REQUEST)


