from django.db import migrations


def criar_grupos(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    Group.objects.get_or_create(name='Fabrica')
    Group.objects.get_or_create(name='Representantes')


def reverter_grupos(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    Group.objects.filter(name__in=('Fabrica', 'Representantes')).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0002_categoriasacaria_movimentacaoestoque_sacoreserva_and_more'),
    ]

    operations = [
        migrations.RunPython(criar_grupos, reverter_grupos),
    ]
