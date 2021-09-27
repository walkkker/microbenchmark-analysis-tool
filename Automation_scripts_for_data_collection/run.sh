#!/bin/bash  

while getopts ":p:c:n:h" opt
do
    case $opt in
        p)
        platform=$OPTARG
        ;;
        c)
        compiler=$OPTARG
        ;;
        n)
        tested_nums_threads=$OPTARG
        ;;
		h)
        echo -e "-p platform\n-c compiler\n-n the tested numbers of threads\nPlease note use quotation marks to include the compiler names and threads counts"
        exit 1
		;;
        ?)
        echo "Unknown arguments"
        exit 1
        ;;
    esac
done

mkdir overhead_collection

for benchtype in syncbench taskbench schedbench arraybench_1 arraybench_3 arraybench_9\
	arraybench_27 arraybench_81 arraybench_243 arraybench_729 arraybench_2187 arraybench_6561\
	arraybench_19683 arraybench_59049
do
	mkdir overhead_collection/$benchtype
	# The number of threads you want to test
	for thread_num in $tested_nums_threads
	do
		# Only need to change the following two lines
		mkdir ${thread_num}threads_${compiler}_$benchtype
		echo "Directory ${thread_num}threads_${compiler}_$benchtype has been created"
		
		cd ${thread_num}threads_${compiler}_$benchtype
		echo "Entering the directory ${thread_num}threads_${compiler}_$benchtype"
		
		cp ../benchmark.slurm .
		`sed -i "s/export OMP_NUM_THREADS=1/export OMP_NUM_THREADS=${thread_num}/g" benchmark.slurm`
		`sed -i "s#srun --cpu-bind=cores#srun --cpu-bind=cores ../$benchtype#g" benchmark.slurm`
		echo "Directory ${thread_num}threads_${compiler}_$benchtype has been placed the corresponding file benchmark.slurm"
		
		# Submit the job to the back-end nodes for 10 times
		for i in {1..10}
		do
			Number=`sbatch benchmark.slurm|awk '{print $4}'`
			myFile="slurm-"$Number".out"
			# This is to prevent the back-end process from getting stuck and causing an error when submitting again.
			until [ -e $myFile ]
			do
				echo "Waiting file creation of $myFile"
				sleep 10
			done
			sleep 40
			echo "Finishing $myFile"
			echo "Thread(s): $thread_num | total: $i"
		done
		
		cp ../overhead_generator.py .
		python overhead_generator.py "${platform}" "${compiler}" slurm*
		echo "The CSV file for overhead in directory ${thread_num}threads_${compiler}_$benchtype has been generated"

		cp -v *.csv ../overhead_collection/$benchtype
		echo "Have completed the transfer of the CSV file"
		
		cd ..
		echo "Returning parent directory"

	done
done

echo "Finishing running benchmarks and averaging, starting merging all CSV files..."
cd overhead_collection
cat */*.csv > overhead_summary_${platform}_${compiler}.csv
echo "The final CSV file overhead_summary_${platform}_${compiler}.csv has been successfully generated in the directory overhead_collection"
