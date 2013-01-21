#!/bin/bash

venv=$(which virtualenv2 2> /dev/null || which virtualenv 2> /dev/null)
if [[ -z $venv ]]
then
    echo "No virtualenv found"
    exit 0
fi

$venv env
source ./env/bin/activate
pip install -r requirements.txt

echo "env created ok"
echo ""
echo ""
echo "Run '. ./env/bin/activate' to activate your virtual environment"
