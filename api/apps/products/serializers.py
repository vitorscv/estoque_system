from rest_framework import serializers
from django.contrib.auth.models import Group, User
from .models import CategoriaSacaria, SacoReserva, MovimentacaoEstoque


class CategoriaSerializer(serializers.ModelSerializer):
    total_sacos = serializers.IntegerField(source='sacos.count', read_only=True)

    class Meta:
        model = CategoriaSacaria
        fields = ['id', 'nome', 'total_sacos']


class SacoReservaSerializer(serializers.ModelSerializer):
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
            'ativo',
            'ultima_atualizacao',
        ]


class MovimentacaoEstoqueSerializer(serializers.ModelSerializer):
    saco_descricao = serializers.CharField(source='saco.descricao', read_only=True)
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)

    class Meta:
        model = MovimentacaoEstoque
        fields = [
            'id',
            'saco',
            'saco_descricao',
            'tipo',
            'tipo_display',
            'quantidade',
            'data_movimentacao',
            'responsavel',
            'observacao',
        ]


class GrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'date_joined', 'password']
        
        
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        
        user = User.objects.create_user(**validated_data)
        return user