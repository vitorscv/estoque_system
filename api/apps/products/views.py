from django.shortcuts import render
from rest_framework import generics
from .models import SacoReserva
from .serializers import SacoReservaSerializer

class SacoReservaListView(generics.ListAPIView):
    #### REGRA DE NEGÓCIO DA PANTEX: 
    # 1. Mandar para o vendedor apenas os sacos que estão ATIVOS (ativo=True).
    # 2. Já mandar ordenado por ordem alfabética da descrição (order_by).
    queryset = SacoReserva.objects.filter(ativo=True).order_by('descricao')
    
    # comunicação view 
    serializer_class = SacoReservaSerializer


