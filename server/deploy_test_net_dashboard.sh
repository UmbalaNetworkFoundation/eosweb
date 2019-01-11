#!/bin/bash
ssh root@tracker.umba.la "bash -s" << EOF
	cd ~/node-server/umb-blockchain-explorer
	ng build --prod --verbose
	rm -rf /var/www/tracker.umba.la
	cp -r dist /var/www/tracker.umba.la
EOF
