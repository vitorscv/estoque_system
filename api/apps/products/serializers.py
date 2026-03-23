from rest_framework import serializers
from django.contrib.auth.models import Group, User
from .models import CategoriaSacaria, SacoReserva, MovimentacaoEstoque
from .permissions import (
    GRUPO_FABRICA,
    GRUPO_REPRESENTANTES,
    usuario_e_fabrica,
    usuario_e_representante,
)


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
    representante = serializers.SerializerMethodField(read_only=True)
    fabrica = serializers.SerializerMethodField(read_only=True)
    eh_representante = serializers.BooleanField(write_only=True, required=False, default=False)

    class Meta:
        model = User

        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'is_active',
            'is_staff',
            'date_joined',
            'password',
            'representante',
            'fabrica',
            'eh_representante',
        ]

        extra_kwargs = {'password': {'write_only': True}}
        read_only_fields = ['id', 'date_joined', 'is_staff', 'is_active']

    def get_representante(self, obj):
        return usuario_e_representante(obj)

    def get_fabrica(self, obj):
        return usuario_e_fabrica(obj)

    def create(self, validated_data):
        eh_representante = validated_data.pop('eh_representante', False)
        password = validated_data.pop('password')
        username = validated_data.pop('username')
        email = validated_data.pop('email', '') or ''
        # username + senha 
        user = User.objects.create_user(username=username, password=password, email=email)
        grupo_nome = GRUPO_REPRESENTANTES if eh_representante else GRUPO_FABRICA
        grupo, _ = Group.objects.get_or_create(name=grupo_nome)
        user.groups.set([grupo])
        return user