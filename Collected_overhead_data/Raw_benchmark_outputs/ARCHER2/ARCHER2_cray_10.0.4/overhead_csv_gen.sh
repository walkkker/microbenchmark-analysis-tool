#! bin/bash

for benchtype in syncbench taskbench schedbench
do
	for num in 1 2 4 8 16 32 64 128
	do
		cd ${num}threads_$1_$benchtype
		echo "enter"
		cp ../overhead_generator.py .
		
		# handling process
		python overhead_generator.py slurm*
		
		cd ..
		echo "${num}threads_$1_$benchtype directory has been created and placed benchmark.slurm"
	done
done



for i in 1 3 9 27 81 243 729 2187 6561 19683 59049
do
	for num in 1 2 4 8 16 32 64 128
	do
		cd ${num}threads_$1_array$i
		echo "enter"
		cp ../overhead_generator.py .
		
		# handling process
		python overhead_generator.py slurm*
		
		cd ..
		echo "${num}threads_$1_array$i directory has been created and placed benchmark.slurm"
	done
done
