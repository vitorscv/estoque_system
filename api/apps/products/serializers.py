from rest_framework import serializers
from .models import CategoriaSacaria, SacoReserva

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaSacaria
        fields = ['id', 'nome']

class SacoReservaSerializer(serializers.ModelSerializer):
    # Isso aqui pega o nome da categoria em vez de mandar só o ID numérico pro React
    categoria_nome = serializers.CharField(source='categoria.nome', read_only=True)

    class Meta:
        model = SacoReserva
        fields = [
            'id', 
            'codigo_referencia', 
            'descricao', 
            'categoria_nome', 
            'quantidade_atual', 
            'estoque_minimo', 
            'ultima_atualizacao'
        ]