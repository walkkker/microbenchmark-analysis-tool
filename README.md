# The EPCC OpenMP microbenchmark analysis tool

# Structure
* **Automation_scripts_for_data_collection:** contains scripts to run benchmarks and extract the overhead data to form a CSV file that can be imported into database.
* **Web_application_benchmark_analysis_tool:** contains the code for the developed OpenMP microbenchmark analysis tool including the front-end and back-end.
* **Nginx_configuration:** contains a Nginx configuration file for our website to be an example if users want to deploy production environment.
* **Collected_overhead_data:** contains the descriptions (hardware platforms and compilers) of the collected data used in our website.


The main part is in the folder **Web_application_benchmark_analysis_tool** containing the codes for front-end and back-end. Since we have deployed it on a cloud server, you can access it through http://www.openmpbench.xyz/.
# Usage
1. Firstly enter the folder "Automation_scripts_for_data_collection" to read the README and run the script on targeted platform and compiler to get overhead data.  
2. Next enter the folder "Web_application_benchmark_analysis_tool" to read the README and follow the workflow for users to start the web service.