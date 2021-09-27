"""
This is the Routing table for the web application, used to set up routing paths.
Based on the different requests sent by the front-end,
the corresponding functions are looked up for processing.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from benchmark import views

urlpatterns = [
    path('api/num_of_threads/', views.threadsNum_x_axis),
    path('api/chunksize/', views.chunksize_x_axis),
    path('api/arraysize/', views.arraysize_x_axis),
]+static("/", document_root="./dist")
