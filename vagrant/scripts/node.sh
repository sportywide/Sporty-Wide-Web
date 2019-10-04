#!/usr/bin/env bash

sudo yum clean all && sudo yum makecache fast
curl -sL https://rpm.nodesource.com/setup_10.x | sudo bash -;
sudo yum install -y gcc-c++ make
yum install -y nodejs;