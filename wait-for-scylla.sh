#!/bin/sh
# wait-for-scylla.sh
# This script is used to wait for ScyllaDB to be ready before starting the application.
set -e

host="$1"
shift
cmd="$@"

until cqlsh "$host" -e "describe keyspaces"; do
  >&2 echo "ScyllaDB is unavailable - retrying in 5 seconds"
  sleep 5
done

>&2 echo "ScyllaDB is up"
exec $cmd
