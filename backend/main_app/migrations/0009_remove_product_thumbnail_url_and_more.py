# Generated by Django 5.0.4 on 2024-04-22 13:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0008_alter_order_seller'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='thumbnail_url',
        ),
        migrations.RemoveField(
            model_name='productimg',
            name='aws_image_url',
        ),
    ]
