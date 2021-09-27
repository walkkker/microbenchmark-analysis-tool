from django.db import models

# The Benchmark class is used to store the overhead data.
class Benchmark(models.Model):

    hardware_platform = models.CharField(max_length=200)

    compiler = models.CharField(max_length=200)

    directive_name = models.CharField(max_length=200)

    threads_num = models.PositiveIntegerField()

    overhead = models.DecimalField(max_digits=12, decimal_places=4)


