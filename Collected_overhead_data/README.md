# Descriptions of the collected data

## Structure

The platforms and compilers used for our data collection are:
* **Cirrus**
    * GCC 6.3.0
    * GCC 8.2.0
    * Intel 18.0.5
    * Intel 19.0.0
    * Intel 20.4
* **ARCHER2**
    * Cray 10.0.4
    * AOCC 2.1.0
    * GCC 10.1.0
* **Fulhame**
    * ARM 20.0
    * GCC 9.2.0
    * GCC 10.1.0

We store all the data collected above in our database. In order to display the summary table of these data, *common_benchmark.csv* is a CSV file exported from the database table and *common_benchmark.sql* is a SQL script exported from the database table. If you want to see all the data directly, you can use one of these two files. You can also import one of the files directly into the database after you have created it using Django so that you can run our website on your local machine.


The directory structure is:
* **Raw_benchmark_outputs:** Benchmark output files by using the first version of shell scripts.
* **Extracted_csv_by_types:** Extracted the average and classified them by different benchmark types.
* **Final_integrated_data:** Integrated all the average CSV files into only four files corresponding to four types.
* **New_Cirrus_Intel_20.4:** New overhead data for Intel 20.4 on Cirrus is collected after finishing the above collection and use the second version of shell scripts to get, which is similar to the final submitted version, so it produces a final CSV file in "overhead_collection" directory.


To derive statistically stable and reproducible results, each measurement is the average of 10 runs, and each run itself repeats the measurement 20 times for the outer repetitions and a target time for the inner repetitions (the target time is set to 1000 microseconds). Therefore, there are 10 output files in each subdirectory.


The shell script in "../Project_source_code/Automation_scripts_for_data_collectionis" is the third version, or called the final verison. It is improved from the second version as talked above. The details can be seen in the directory "../Project_source_code/Automation_scripts_for_data_collection". What we use in our dissertation is the final version which is much easier for users to run.
