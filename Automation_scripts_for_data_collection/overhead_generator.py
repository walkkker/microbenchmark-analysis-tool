"""
The use of this script on command line is 
"python overhead_generator.py [platform] [compiler] [input_file_1 input_file_2 ...] "
"""

import sys
import re

hardware = sys.argv[1]
compiler = sys.argv[2]


overhead_dic = {}
for doc_num in range(3,len(sys.argv)):
    with open(sys.argv[doc_num], 'r') as f:
        content = f.read()
        overhead_results = re.findall(r"(.+?)\soverhead\s=\s(-?\d+?\.\d+?)\smicroseconds", content)
    if doc_num == 3:
        for element in overhead_results:
            overhead_dic[element[0]] = float(element[1])
            result = re.findall(r"\t(\d+) thread\(s\)", content)
            thread_num = result[0]
    elif doc_num > 3:
        for element in overhead_results:
            overhead_dic[element[0]] += float(element[1])

print("thread num:", thread_num)

            
with open(f"{hardware}_{compiler}_{thread_num}.csv", 'w') as written_file:
    written_file.write(f"hardware_platform,compiler,threads_num,directive_name,overhead\n")
    for overhead_pair in overhead_dic.items():
        written_file.write(f"{hardware},{compiler},{thread_num},{overhead_pair[0]},%.4f\n" % (overhead_pair[1]/(len(sys.argv)-3)))


