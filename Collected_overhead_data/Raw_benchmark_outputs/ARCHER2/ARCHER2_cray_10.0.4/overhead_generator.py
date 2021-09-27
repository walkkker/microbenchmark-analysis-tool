"""
The use of this script on command line is 
"python extracting_average.py input_file_1 input_file_2 ... "
"""

import sys
import re

overhead_dic = {}
for doc_num in range(1,len(sys.argv)):
    with open(sys.argv[doc_num], 'r') as f:
        content = f.read()
        overhead_results = re.findall(r"(.+?)\soverhead\s=\s(-?\d+?\.\d+?)\smicroseconds", content)
    if doc_num == 1:
        for element in overhead_results:
            overhead_dic[element[0]] = float(element[1])
            result = re.findall(r"\t(\d+) thread\(s\)", content)
            thread_num = result[0]
    elif doc_num > 1:
        for element in overhead_results:
            overhead_dic[element[0]] += float(element[1])

hardware = "ARCHER2"
compiler = "Cray 10.0"
print("thread num:", thread_num)
            
with open(f"{hardware}_{compiler}_{thread_num}.csv", 'w') as written_file:
    written_file.write(f"hardware_platform,compiler,benchmark_class,threads_num,directive_name,overhead\n")
    for element in overhead_dic.items():
        written_file.write(f"{hardware},{compiler},{thread_num},{element[0]},%.4f\n" % (element[1]/(len(sys.argv)-1)))


