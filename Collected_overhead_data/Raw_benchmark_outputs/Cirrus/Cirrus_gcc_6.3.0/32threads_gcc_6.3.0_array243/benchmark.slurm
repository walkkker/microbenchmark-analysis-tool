#!/bin/bash

# Slurm job options (name, compute nodes, job time)
#SBATCH --job-name=2
#SBATCH --time=0:20:0
#SBATCH --exclusive
#SBATCH --nodes=1
#SBATCH --tasks-per-node=1
#SBATCH --cpus-per-task=36

# Replace [budget code] below with your budget code (e.g. dc116-s1234567)
#SBATCH --account=dc116-s2042303
# We use the "standard" partition as we are running on CPU nodes
#SBATCH --partition=standard
# We use the "short" QoS as our runtime is less than20 mins 
#SBATCH --qos=short

module load gcc/6.3.0

# Change to the submission directory
cd $SLURM_SUBMIT_DIR

# Set the number of threads 
export OMP_NUM_THREADS=32

# Launch the parallel job
srun --cpu-bind=cores ../arraybench_243

gcc -v
