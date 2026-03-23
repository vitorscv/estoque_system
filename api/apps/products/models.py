from django.db import models
from django.db.models import F

class CategoriaSacaria(models.Model):
   
    nome = models.CharField(max_length=100, unique=True, help_text="Nome da categoria/tipo do saco")

    def __str__(self):
        return self.nome

class SacoReserva(models.Model):
    # Código interno 
    codigo_referencia = models.CharField(max_length=50, unique=True, blank=True, null=True, help_text="Código interno, se houver")
    
    # nome de pesquisa 
    descricao = models.CharField(max_length=200)
    
    # saco ligado a categoria
    categoria = models.ForeignKey(CategoriaSacaria, on_delete=models.SET_NULL, null=True, blank=True, related_name='sacos')
    
    
    quantidade_atual = models.IntegerField(default=0)
    estoque_minimo = models.IntegerField(default=100, help_text="Limite para alertar o vendedor no sistema")
    
    
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
       
        if not self.pk: 
            if self.tipo == 'entrada':
                self.saco.quantidade_atual = F('quantidade_atual') + self.quantidade
            elif self.tipo == 'saida':
                self.saco.quantidade_atual = F('quantidade_atual') - self.quantidade
            self.saco.save()
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.tipo.upper()} | {self.quantidade} un. | {self.saco.descricao}"