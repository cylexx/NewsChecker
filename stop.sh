#!/bin/bash

kill `lsof -t -i:8080`
echo 'Client stopped'
kill `lsof -t -i:80`
echo 'Server stopped'