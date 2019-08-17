#!/bin/bash

while ping -c1 base &>/dev/null; 
  do sleep 1; 
done; 

echo "Starting"

npm run "$@"
