#!/bin/bash

while ping -c1 base &>/dev/null; 
  do sleep 1; 
done; 

echo "Starting"

/usr/local/bin/wait && npm run "$@"
