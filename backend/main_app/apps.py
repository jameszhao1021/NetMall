from django.apps import AppConfig


class MainAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main_app'
    
    # def ready(self):
    #     # Import signal receivers to ensure they are connected
    #     import main_app.signals