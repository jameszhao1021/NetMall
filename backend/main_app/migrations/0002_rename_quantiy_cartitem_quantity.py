# Generated by Django 5.0.4 on 2024-04-18 13:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='cartitem',
            old_name='quantiy',
            new_name='quantity',
        ),
    ]