# Generated by Django 5.0.4 on 2024-04-14 14:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0002_user_create_at_product_productimg'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='description',
            field=models.CharField(default='', max_length=500),
            preserve_default=False,
        ),
    ]