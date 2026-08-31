#!/bin/bash

set -e

NAMESPACE="deployflow"

echo "======================================"
echo " DeployFlow Incident Context"
echo "======================================"

echo
echo "=== POD STATUS ==="
kubectl get pods -n "$NAMESPACE" -o wide

echo
echo "=== DEPLOYMENTS ==="
kubectl get deployments -n "$NAMESPACE"

echo
echo "=== RECENT EVENTS ==="
kubectl get events -n "$NAMESPACE" \
  --sort-by='.lastTimestamp' | tail -15

echo
echo "=== BACKEND LOGS ==="
kubectl logs -n "$NAMESPACE" \
  -l app=deployflow-backend \
  --tail=30 \
  --prefix=true || true

echo
echo "=== FRONTEND LOGS ==="
kubectl logs -n "$NAMESPACE" \
  -l app=deployflow-frontend \
  --tail=30 \
  --prefix=true || true

echo
echo "======================================"
echo " Context collection complete"
echo "======================================"
