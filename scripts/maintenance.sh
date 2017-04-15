#!/bin/bash

on_page=/usr/local/etc/maintenance_on.html
off_page=/usr/local/etc/maintenance_off.html

if [ "$1" == "off" ]; then
    if [ -f $on_page ]; then
	echo "Maintenance Mode Off!"
        mv $on_page $off_page
    fi
elif [ "$1" == "on" ]; then
    if [ -f $off_page ]; then
	echo "Maintenance Mode On!"
	mv $off_page $on_page
    fi
else
    echo "Must pass parameter with either \"on\" or \"off\"!"
    exit 1
fi

exit 0
