from django.contrib import admin
from .models import CategoriaSacaria, SacoReserva, MovimentacaoEstoque

@admin.register(CategoriaSacaria)
class CategoriaSacariaAdmin(admin.ModelAdmin):
    list_display = ('nome',)
    search_fields = ('nome',)

@admin.register(SacoReserva)
class SacoReservaAdmin(admin.ModelAdmin):
    # lista principal
    list_display = ('descricao', 'categoria', 'quantidade_atual', 'ativo')
    
    # filtros laterais
    list_filter = ('categoria', 'ativo')
    
    # Barra de pesquisa
    search_fields = ('descricao', 'codigo_referencia')
    
    # travar pra não editar o saldo
    readonly_fields = ('quantidade_atual', 'ultima_atualizacao') 

@admin.register(MovimentacaoEstoque)
class MovimentacaoEstoqueAdmin(admin.ModelAdmin):
    list_display = ('saco', 'tipo', 'quantidade', 'data_movimentacao', 'responsavel')
    list_filter = ('tipo', 'data_movimentacao')
    search_fields = ('saco__descricao', 'responsavel')