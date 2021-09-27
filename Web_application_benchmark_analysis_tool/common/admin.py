from django.contrib import admin
from .models import Benchmark

# Users can manage the Benchmark table from Django's default administration system.
admin.site.register(Benchmark)

