#!/usr/bin/env bash
# Crea una base de datos desechable, aplica el expediente y lanza los ataques de prueba.
# Usa las variables estándar de PostgreSQL (PGHOST, PGPORT, PGUSER) de un servidor de PRUEBAS,
# nunca la base real. Ejemplo:  PGHOST=localhost PGUSER=postgres supabase/probar.sh
set -euo pipefail

cd "$(dirname "$0")"
BASE=constata_pruebas

psql -d postgres -q -c "drop database if exists $BASE" -c "create database $BASE"
psql -d "$BASE" -q -v ON_ERROR_STOP=1 -f pruebas/00_simular_supabase.sql
for migracion in migrations/*.sql; do
  psql -d "$BASE" -q -v ON_ERROR_STOP=1 -f "$migracion"
done
psql -d "$BASE" -t -v ON_ERROR_STOP=1 -f pruebas/01_ataques.sql 2>&1 \
  | sed -E 's/^psql:[^ ]+ (NOTICE|ERROR): +//' | grep -v '^ *$'
exit "${PIPESTATUS[0]}"
