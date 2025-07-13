#!/usr/bin/env bash
#   Use this script to test if a given TCP host/port are available

set -e

TIMEOUT=15
QUIET=0
HOST=""
PORT=""

show_help() {
  echo "Usage:"
  echo "  wait-for-it.sh host:port [-t timeout] [-- command args]"
  echo
  echo "Options:"
  echo "  -h | --help       Show this help"
  echo "  -q | --quiet      Do not output any status messages"
  echo "  -t TIMEOUT        Timeout in seconds, default is 15 seconds"
  echo
  echo "Arguments after '--' are executed after successful connection."
}

parse_args() {
  while [[ $# -gt 0 ]]
  do
    case "$1" in
      *:* )
      HOSTPORT=(${1//:/ })
      HOST=${HOSTPORT[0]}
      PORT=${HOSTPORT[1]}
      shift 1
      ;;
      -q | --quiet)
      QUIET=1
      shift 1
      ;;
      -t)
      TIMEOUT="$2"
      if [[ "$TIMEOUT" == "" ]]; then
        echo "Error: missing argument for -t"
        exit 1
      fi
      shift 2
      ;;
      --help)
      show_help
      exit 0
      ;;
      --)
      shift
      CMD=("$@")
      break
      ;;
      *)
      echo "Unknown argument: $1"
      show_help
      exit 1
      ;;
    esac
  done

  if [[ "$HOST" == "" || "$PORT" == "" ]]; then
    echo "Error: you need to provide a host and port to test."
    show_help
    exit 1
  fi
}

wait_for() {
  if ! command -v nc >/dev/null; then
    echo "Error: nc (netcat) is not installed"
    exit 1
  fi

  for i in $(seq $TIMEOUT); do
    if nc -z "$HOST" "$PORT" >/dev/null 2>&1; then
      if [[ $QUIET -ne 1 ]]; then
        echo "Success: $HOST:$PORT is available"
      fi
      return 0
    fi
    sleep 1
  done

  echo "Timeout: $HOST:$PORT is not available after ${TIMEOUT} seconds"
  exit 1
}

main() {
  parse_args "$@"
  wait_for "$@"

  if [[ ${#CMD[@]} -gt 0 ]]; then
    exec "${CMD[@]}"
  fi
}

main "$@"
