# Using Gunicorn in the production environment
# This is Python script to configure Gunicorn when running ../run_gunicorn.sh
# gunicorn/django  service listen address and port
bind = '127.0.0.1:8000'

# gunicorn worker | number of processes
workers =  3

# gunicorn worker type
worker_class =  "gevent"

# path for log files
errorlog = "/home/project/openmpbench/gunicorn.log"
loglevel = "info"

import sys,os

cwd = os.getcwd()
sys.path.append(cwd)