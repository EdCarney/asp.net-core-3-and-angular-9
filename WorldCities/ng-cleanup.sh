#!/bin/bash

processes="$(ps -ax | egrep '[n]pm (run )?start|[n]g serve' | egrep -o '^\s*[0-9]+')"
pids=$(tr '\n' ',' <<< $processes);
IFS=', ' read -r -a pid_array <<< "$pids";

for pid in ${pid_array[@]}
do
	echo Killing $pid
	kill -9 $pid
done
