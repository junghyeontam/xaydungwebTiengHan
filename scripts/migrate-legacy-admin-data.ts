/**
 * Idempotent Migration Script: Map legacy_* data into the new Admin & Publishing Schema.
 * 
 * Usage:
 *   npx ts-node scripts/migrate-legacy-admin-data.ts [--dry-run] [--commit]
 * 
 * Rule C:
 * - Checks tables prefixed with "legacy_"
 * - Maps lessons, vocabulary, media, staff, leads into the new schema
 * - Dry-run mode by default; reports skipped and failed rows
 * - Does NOT drop legacy tables (requires explicit user confirmation)
 */

import { createClient } from "@supabase/supabase-js";

interface MigrationReport {
  tableName: string;
  totalFound: number;
  migrated: number;
  skipped: number;
  failed: number;
  details: string[];
}

const isDryRun = process.argv.includes("--dry-run") || !process.argv.includes("--commit");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key";
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateLegacyTable(
  legacyTable: string,
  targetTable: string,
  transform: (row: any) => any,
  uniqueField: string
): Promise<MigrationReport> {
  const report: MigrationReport = {
    tableName: legacyTable,
    totalFound: 0,
    migrated: 0,
    skipped: 0,
    failed: 0,
    details: [],
  };

  try {
    const { data: legacyRows, error } = await supabase.from(legacyTable).select("*");
    if (error) {
      report.details.push(`Notice: Table ${legacyTable} not found or query error: ${error.message}`);
      return report;
    }

    if (!legacyRows || legacyRows.length === 0) {
      report.details.push(`Table ${legacyTable} is empty or has 0 rows.`);
      return report;
    }

    report.totalFound = legacyRows.length;

    for (const row of legacyRows) {
      try {
        const transformed = transform(row);
        if (!transformed) {
          report.skipped++;
          continue;
        }

        if (isDryRun) {
          report.migrated++;
          report.details.push(`[DRY-RUN] Would upsert into ${targetTable}: ${uniqueField}=${transformed[uniqueField]}`);
        } else {
          const { error: upsertErr } = await supabase
            .from(targetTable)
            .upsert(transformed, { onConflict: uniqueField });

          if (upsertErr) {
            report.failed++;
            report.details.push(`[FAIL] ${uniqueField}=${transformed[uniqueField]}: ${upsertErr.message}`);
          } else {
            report.migrated++;
          }
        }
      } catch (err: any) {
        report.failed++;
        report.details.push(`[ERROR] Processing row: ${err?.message}`);
      }
    }
  } catch (err: any) {
    report.details.push(`Fatal error migrating ${legacyTable}: ${err?.message}`);
  }

  return report;
}

async function runMigration() {
  console.log("=================================================");
  console.log(" JUNGHYEON ADMIN: LEGACY DATA MIGRATION RUNNER");
  console.log(` Mode: ${isDryRun ? "DRY-RUN (No changes applied)" : "COMMIT (Writing to Database)"}`);
  console.log("=================================================\n");

  const legacyTables = [
    {
      legacy: "legacy_staff",
      target: "admin_users",
      unique: "email",
      map: (row: any) => ({
        email: row.email,
        full_name: row.full_name || row.name || "Legacy Staff",
        role_id: row.role || "teacher",
        status: "active",
      }),
    },
    {
      legacy: "legacy_lessons",
      target: "content_versions",
      unique: "content_id",
      map: (row: any) => ({
        content_type: "lesson",
        content_id: row.id?.toString() || row.slug,
        version_number: 1,
        title: row.title || row.lesson_title,
        data: row,
        status: "published",
        published_at: new Date().toISOString(),
      }),
    },
    {
      legacy: "legacy_leads",
      target: "consultation_leads",
      unique: "phone",
      map: (row: any) => ({
        full_name: row.full_name || row.customer_name,
        phone: row.phone,
        email: row.email || null,
        target_goal: row.goal || row.study_goal || null,
        status: row.status || "new",
        notes: row.notes || "Migrated from legacy_leads",
      }),
    },
  ];

  const results: MigrationReport[] = [];

  for (const item of legacyTables) {
    console.log(`Checking table: ${item.legacy}...`);
    const report = await migrateLegacyTable(item.legacy, item.target, item.map, item.unique);
    results.push(report);
  }

  console.log("\n================ MIGRATION REPORT ================");
  for (const r of results) {
    console.log(`\nTable: ${r.tableName}`);
    console.log(`  Total Found : ${r.totalFound}`);
    console.log(`  Migrated    : ${r.migrated}`);
    console.log(`  Skipped     : ${r.skipped}`);
    console.log(`  Failed      : ${r.failed}`);
    if (r.details.length > 0) {
      console.log(`  Notes:`);
      r.details.slice(0, 5).forEach((d) => console.log(`    - ${d}`));
      if (r.details.length > 5) {
        console.log(`    ... and ${r.details.length - 5} more entries`);
      }
    }
  }

  console.log("\n=================================================");
  console.log("SAFETY NOTICE:");
  console.log("All legacy tables remain preserved. No legacy tables were dropped.");
  console.log("Drop legacy tables only after explicit user confirmation.");
  console.log("=================================================");
}

runMigration().catch((err) => {
  console.error("Migration script crashed:", err);
  process.exit(1);
});
