#!/bin/bash

set -e

NAMESPACE="deployflow"

echo "======================================"
echo " DeployFlow AIOps Incident Analyzer"
echo "======================================"

BACKEND_READY=$(kubectl get deployment deployflow-backend \
  -n "$NAMESPACE" \
  -o jsonpath='{.status.readyReplicas}')

FRONTEND_READY=$(kubectl get deployment deployflow-frontend \
  -n "$NAMESPACE" \
  -o jsonpath='{.status.readyReplicas}')

DATABASE_READY=$(kubectl get deployment deployflow-database \
  -n "$NAMESPACE" \
  -o jsonpath='{.status.readyReplicas}')

BACKEND_DESIRED=3
FRONTEND_DESIRED=1
DATABASE_DESIRED=1

RECENT_RESTARTS=$(kubectl get pods -n "$NAMESPACE" \
  -l app=deployflow-backend \
  -o jsonpath='{range .items[*]}{.metadata.name}{" "}{.status.containerStatuses[0].restartCount}{"\n"}{end}')

echo
echo "=== SERVICE HEALTH ==="
echo "Backend:  ${BACKEND_READY:-0}/${BACKEND_DESIRED}"
echo "Frontend: ${FRONTEND_READY:-0}/${FRONTEND_DESIRED}"
echo "Database: ${DATABASE_READY:-0}/${DATABASE_DESIRED}"

STATUS="HEALTHY"
CAUSE="No obvious incident detected."
ACTION="Continue normal monitoring."

if [ "${BACKEND_READY:-0}" -lt "$BACKEND_DESIRED" ]; then
    STATUS="CRITICAL"
    CAUSE="Backend replicas are unavailable."
    ACTION="Check backend pods, recent events, and application logs."

elif [ "${FRONTEND_READY:-0}" -lt "$FRONTEND_DESIRED" ]; then
    STATUS="CRITICAL"
    CAUSE="Frontend replicas are unavailable."
    ACTION="Check frontend pod status and nginx logs."

elif [ "${DATABASE_READY:-0}" -lt "$DATABASE_DESIRED" ]; then
    STATUS="CRITICAL"
    CAUSE="Database replicas are unavailable."
    ACTION="Check PostgreSQL pod, service, and database logs."

elif echo "$RECENT_RESTARTS" | awk '$2 > 0 {found=1} END {exit !found}'; then
    STATUS="DEGRADED"
    CAUSE="One or more backend containers have restarted."
    ACTION="Check backend logs and pod events for the restart cause."
fi

echo
echo "=== INCIDENT ANALYSIS ==="
echo "Status:          $STATUS"
echo "Likely Cause:    $CAUSE"
echo "Recommendation:  $ACTION"

echo
echo "======================================"
