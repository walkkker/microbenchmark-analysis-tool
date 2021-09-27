#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
echo $DIR

cd $DIR

# ulimit -n 500
nohup gunicorn config.wsgi -c config/gunicorn_conf.py &
