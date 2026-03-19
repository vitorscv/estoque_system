from django.db import models
from django.db.models import F

class CategoriaSacaria(models.Model):
    # A produção cadastra os tipos dinamicamente (Ex: Convencional, Laminado Valvulado)
    nome = models.CharField(max_length=100, unique=True, help_text="Nome da categoria/tipo do saco")

    def __str__(self):
        return self.nome

class SacoReserva(models.Model):
    # Código interno (SKU) para organização da indústria
    codigo_referencia = models.CharField(max_length=50, unique=True, blank=True, null=True, help_text="Código interno, se houver")
    
    # O nome exato que o vendedor vai pesquisar no React (Ex: 65 X 95 LAMINADO IMPRESSO)
    descricao = models.CharField(max_length=200)
    
    # Liga o saco à categoria criada acima
    categoria = models.ForeignKey(CategoriaSacaria, on_delete=models.SET_NULL, null=True, blank=True, related_name='sacos')
    
    # Controle de Estoque
    quantidade_atual = models.IntegerField(default=0)
    estoque_minimo = models.IntegerField(default=100, help_text="Limite para alertar o vendedor no sistema")
    
    # Auditoria
    ativo = models.BooleanField(default=True)
    ultima_atualizacao = models.DateTimeField(auto_now=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        codigo = f"[{self.codigo_referencia}] " if self.codigo_referencia else ""
        return f"{codigo}{self.descricao} (Estoque: {self.quantidade_atual})"

class MovimentacaoEstoque(models.Model):
    TIPO_CHOICES = [
        ('entrada', 'Entrada (+)'),
        ('saida', 'Saída (-)'),
    ]
    
    saco = models.ForeignKey(SacoReserva, on_delete=models.CASCADE, related_name='movimentacoes')
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    quantidade = models.PositiveIntegerField()
    data_movimentacao = models.DateTimeField(auto_now_add=True)
    responsavel = models.CharField(max_length=100, help_text="Quem da produção/estoque registrou?")
    observacao = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # A mágica que impede o estoque de furar (usando o F() direto no PostgreSQL)
        if not self.pk: 
            if self.tipo == 'entrada':
                self.saco.quantidade_atual = F('quantidade_atual') + self.quantidade
            elif self.tipo == 'saida':
                self.saco.quantidade_atual = F('quantidade_atual') - self.quantidade
            self.saco.save()
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.tipo.upper()} | {self.quantidade} un. | {self.saco.descricao}"