# The automation scripts for overhead data collection

## Usage
By running the shell script, the job is automatically submitted to the batch system and the average is extracted, resulting in a CSV file that can be imported directly into the database table we created with Django via Navicat.

The Python script is executed by the "run.sh" in its run time.

## Run
**Step 1:** Enter the directory of the microbenchmark source code, then copy “overhead_generator.py”, “run.sh” and “benchmark.slurm” into the directory.  
For the "benchmark.slurm" file or other batch script, change the corresponding places into the following after configuration:
```
export OMP_NUM_THREADS=1
```
```
srun --cpu-bind=cores
```

**Step 2:** Configure the current compilation environment and execute the “make” command to generate all 4 benchmarks including 14 executables.
Also, you can specify the array size for arraybench instead of as the default, which is from 1 to 59049 in powers of 3.

**Step 3:** According to the hardware platform and compilation environment, you need to specify the platform name, compiler used and numbers of threads tested on the platform to run the shell script “run.sh” in the following format:
```
$ bash run.sh [-p PLATFORM] [-c COMPILER] [-n TESTED_NUMS_THREADS]
```
For example,
```
bash run.sh -p ARCHER2 -c GNU_10.1 -n “1 2 4 8 16 32 64 128”
```

You also can use -h to see the tips.  

**Please note: The option names on the web page should be the same with the values in each field of the CSV file, so when you type the platform and compiler, you need to make sure their names will be on the option list.**


**Step 4:** A CSV file named “overhead_summary_${platform}_${compiler}.csv” (e.g. overhead_summary_ARCHER2_GNU_10.1.csv) in new generated directory “overhead_collection” is the final file that includes all the overhead data obtained, which is used to import into the database.
