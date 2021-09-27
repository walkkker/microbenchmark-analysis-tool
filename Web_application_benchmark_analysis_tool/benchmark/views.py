from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
import json
from common.models import Benchmark
from config import settings
from django_redis import get_redis_connection
import decimal
import re

# Connect to the Redis service. The corresponding settings are in config/settings.py.
rconn = get_redis_connection("default")


class Encoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal): return float(obj)

# This is for general version.
def threadsNum_x_axis(request):

    symbol_list = ['circle', 'rect', 'triangle', 'diamond', 'pin', 'arrow', 'roundRect']

    obtained_data = request.body.decode("utf-8")
    from ast import literal_eval
    applied_list = literal_eval(obtained_data)

    series = []
    legend_data = []


    for index, ele in enumerate(applied_list): # 0 benchmark; 1 directive; 2 platform; 3 compiler
        if ele[0] == 'Synchronisation': ele[0] = 'Sync'
        elif ele[0] == 'Loop scheduling': ele[0] = 'Sched'
        elif ele[0] == 'Task scheduling': ele[0] = 'Task'
        elif ele[0] == 'Array operations': ele[0] = 'Array'


        ele[2], ele[3] = ele[3], ele[2]
        comb_option = '-'.join(ele)

        cache_field = comb_option
        cacheObj = rconn.hget(settings.RedisKey.threads_num,
                              cache_field)

        data = []

        # If the cache hits, the data will be directly read from memory
        if cacheObj:
            data = json.loads(cacheObj)

        # If no cache for the query data, then we need to extract data from MySQL and reformat the data
        else:
            database_data = Benchmark.objects.values()
            filter_qs = database_data.filter(hardware_platform=ele[3], compiler=ele[2], \
                                      directive_name=ele[1])

            for line in filter_qs:
                data.append([line['threads_num'],line['overhead']])

            # After extracting data from MySQL, add the data into cache
            rconn.hset(settings.RedisKey.threads_num,
                       cache_field,
                       json.dumps(data, cls = Encoder))

        # Construct the 'series' part of ECharts' configuration
        series.append({
            "name": comb_option,
            "type": 'line',
            "symbolSize": 8,
            "symbol": symbol_list[index],
            "showSymbol": 1,
            "data": sorted(data, key=lambda x: x[0])
        })
        legend_data.append(comb_option)

    response_result = {"series":series, "legend_data":legend_data}

    return JsonResponse(response_result)

# This is for chunksize version.
def chunksize_x_axis(request):

    symbol_list = ['circle', 'rect', 'triangle', 'diamond', 'pin', 'arrow', 'roundRect']

    obtained_data = request.body.decode("utf-8")
    from ast import literal_eval
    applied_list = literal_eval(obtained_data)

    series = []
    legend_data = []


    for index, ele in enumerate(applied_list): # 0 sched directive; 1 platform; 2 num threads; 3 compiler

        comb_option = '-'.join(ele)

        cache_field = comb_option
        cacheObj = rconn.hget(settings.RedisKey.threads_num,
                              cache_field)

        data = []

        # cache hit
        if cacheObj:
            data = json.loads(cacheObj)


        # no cache for the query data, then we need to extract data from MySQL and reformat
        else:
            database_data = Benchmark.objects.values()
            if ele[0] == "STATIC, n":
                filter_qs = database_data.filter(hardware_platform=ele[1], compiler=ele[3], \
                                      directive_name__startswith="STATIC ", threads_num=ele[2])
            elif ele[0] == "DYNAMIC, n":
                filter_qs = database_data.filter(hardware_platform=ele[1], compiler=ele[3], \
                                      directive_name__startswith="DYNAMIC ", threads_num=ele[2])
            elif ele[0] == "GUIDED, n":
                filter_qs = database_data.filter(hardware_platform=ele[1], compiler=ele[3], \
                                      directive_name__startswith="GUIDED ", threads_num=ele[2])
            elif ele[0] == "STATIC":
                filter_qs = database_data.filter(hardware_platform=ele[1], compiler=ele[3], \
                                      directive_name="STATIC ", threads_num=ele[2])
                static_overhead = filter_qs[0]["overhead"]
                data = [[1,static_overhead],[2, static_overhead],[4, static_overhead], [8, static_overhead], [16, static_overhead],\
                    [32,static_overhead], [64, static_overhead], [128, static_overhead]]


            for line in filter_qs:
                if ele[0] == "STATIC, n":
                    chunksize = re.findall(r"STATIC (\d+)", line["directive_name"])
                elif ele[0] == "DYNAMIC, n":
                    chunksize = re.findall(r"DYNAMIC (\d+)", line["directive_name"])
                elif ele[0] == "GUIDED, n":
                    chunksize = re.findall(r"GUIDED (\d+)", line["directive_name"])
                elif ele[0] == "STATIC":
                    break

                chunksize = chunksize[0]
                data.append([int(chunksize),line['overhead']])

            # add new data into cache
            rconn.hset(settings.RedisKey.threads_num,
                       cache_field,
                       json.dumps(data, cls = Encoder))


        series.append({
            "name": comb_option,
            "type": 'line',
            "symbolSize": 8,
            "symbol": symbol_list[index],
            "showSymbol": 1,
            "data": sorted(data, key=lambda x: x[0])
        })
        legend_data.append(comb_option)

    response_result = {"series":series, "legend_data":legend_data}

    return JsonResponse(response_result)

# This is for array size version.
def arraysize_x_axis(request):

    symbol_list = ['circle', 'rect', 'triangle', 'diamond', 'pin', 'arrow', 'roundRect']

    obtained_data = request.body.decode("utf-8")
    from ast import literal_eval
    applied_list = literal_eval(obtained_data)

    series = []
    legend_data = []


    for index, ele in enumerate(applied_list): # 0 sched directive; 1 platform; 2 num threads; 3 compiler

        comb_option = '-'.join(ele)

        cache_field = comb_option
        cacheObj = rconn.hget(settings.RedisKey.threads_num,
                              cache_field)

        data = []

        # Cache hit
        if cacheObj:
            data = json.loads(cacheObj)

        # No cache for the query data, then we need to extract data from MySQL and reformat
        else:
            database_data = Benchmark.objects.values()
            if ele[0] == "PRIVATE":
                filter_qs = database_data.filter(hardware_platform=ele[1], compiler=ele[3], \
                                      directive_name__startswith="PRIVATE ", threads_num=ele[2])
            elif ele[0] == "FIRSTPRIVATE":
                filter_qs = database_data.filter(hardware_platform=ele[1], compiler=ele[3], \
                                      directive_name__startswith="FIRSTPRIVATE ", threads_num=ele[2])
            elif ele[0] == "COPYPRIVATE":
                filter_qs = database_data.filter(hardware_platform=ele[1], compiler=ele[3], \
                                      directive_name__startswith="COPYPRIVATE ", threads_num=ele[2])

            elif ele[0] == "COPYIN":
                filter_qs = database_data.filter(hardware_platform=ele[1], compiler=ele[3], \
                                      directive_name__startswith="COPYIN ", threads_num=ele[2])

            for line in filter_qs:
                if ele[0] == "PRIVATE":
                    arraysize = re.findall(r"PRIVATE (\d+)", line["directive_name"])
                elif ele[0] == "FIRSTPRIVATE":
                    arraysize = re.findall(r"FIRSTPRIVATE (\d+)", line["directive_name"])
                elif ele[0] == "COPYPRIVATE":
                    arraysize = re.findall(r"COPYPRIVATE (\d+)", line["directive_name"])
                elif ele[0] == "COPYIN":
                    arraysize = re.findall(r"COPYIN (\d+)", line["directive_name"])

                arraysize = arraysize[0]
                data.append([int(arraysize),line['overhead']])

            # Add new data into cache
            rconn.hset(settings.RedisKey.threads_num,
                       cache_field,
                       json.dumps(data, cls = Encoder))


        series.append({
            "name": comb_option,
            "type": 'line',
            "symbolSize": 8,
            "symbol": symbol_list[index],
            "showSymbol": 1,
            "data": sorted(data, key=lambda x: x[0])
        })
        legend_data.append(comb_option)

    response_result = {"series":series, "legend_data":legend_data}

    return JsonResponse(response_result)







