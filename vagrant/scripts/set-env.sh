#!/usr/bin/env bash
env_vars=`awk 'END {
	for (name in ENVIRON) {
		if (name ~ /^SW_/) {
			env[name] = ENVIRON[name]
		}
	}
	for (name in env) {
		print "export " name "=\"" ENVIRON[name] "\""
	}
}' < /dev/null`

echo "$env_vars" > /etc/profile.d/myvars.sh
chmod +x /etc/profile.d/myvars.sh