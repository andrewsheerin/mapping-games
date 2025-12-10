from django.urls import path
from . import views

app_name = 'quiz'

urlpatterns = [
    path('', views.index, name='index'),
    path('api/countries/', views.get_countries, name='get_countries'),
]
