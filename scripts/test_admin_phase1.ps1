$tests = @(
    @{ Url = "http://localhost:3000/"; Expected = 200; Name = "Learner Home" },
    @{ Url = "http://localhost:3000/roadmap"; Expected = 200; Name = "Learner Roadmap" },
    @{ Url = "http://localhost:3000/vi/admin"; Expected = 200; Name = "Admin Dashboard (Direct Locale)" },
    @{ Url = "http://localhost:3000/admin"; Expected = 200; Name = "Admin Dashboard (Middleware Rewrite)" },
    @{ Url = "http://localhost:3000/vi/admin/login"; Expected = 200; Name = "Admin Login Page" },
    @{ Url = "http://localhost:3000/vi/admin/unauthorized"; Expected = 200; Name = "Admin Unauthorized Page" }
)

Write-Host "================ RUNNING ADMIN PHASE 1 ROUTE TESTS ================"
$allPassed = $true

foreach ($t in $tests) {
    try {
        $res = Invoke-WebRequest -Uri $t.Url -Method Get -MaximumRedirection 0 -ErrorAction SilentlyContinue
        $code = $res.StatusCode
    } catch {
        $code = $_.Exception.Response.StatusCode.value__
    }

    if ($code -eq $t.Expected) {
        Write-Host " [PASS] $($t.Name) ($($t.Url)) -> HTTP $code" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] $($t.Name) ($($t.Url)) -> Expected $($t.Expected), got $code" -ForegroundColor Red
        $allPassed = $false
    }
}

# Test Revalidate API without secret (should be 401)
try {
    $res401 = Invoke-WebRequest -Uri "http://localhost:3000/api/revalidate" -Method Post -ContentType "application/json" -Body '{"paths":["/roadmap"]}' -MaximumRedirection 0 -ErrorAction SilentlyContinue
    $code401 = $res401.StatusCode
} catch {
    $code401 = $_.Exception.Response.StatusCode.value__
}
if ($code401 -eq 401) {
    Write-Host " [PASS] Revalidate API Security Guard -> HTTP 401 (Unauthorized without valid secret)" -ForegroundColor Green
} else {
    Write-Host " [FAIL] Revalidate API Security Guard -> Expected 401, got $code401" -ForegroundColor Red
    $allPassed = $false
}

# Test Analytics API
try {
    $resAnalytics = Invoke-WebRequest -Uri "http://localhost:3000/api/analytics" -Method Post -ContentType "application/json" -Body '{"event_type":"lesson_started","metadata":{"lessonId":"hangul-01"}}' -MaximumRedirection 0 -ErrorAction SilentlyContinue
    $codeAnalytics = $resAnalytics.StatusCode
} catch {
    $codeAnalytics = $_.Exception.Response.StatusCode.value__
}
if ($codeAnalytics -eq 200) {
    Write-Host " [PASS] Analytics Ingestion API -> HTTP 200 (Event accepted)" -ForegroundColor Green
} else {
    Write-Host " [FAIL] Analytics Ingestion API -> Expected 200, got $codeAnalytics" -ForegroundColor Red
    $allPassed = $false
}

# Test Legacy Redirect
try {
    $resRedirect = Invoke-WebRequest -Uri "http://localhost:3000/lo-trinh" -Method Get -MaximumRedirection 0 -ErrorAction SilentlyContinue
    $codeRedirect = $resRedirect.StatusCode
} catch {
    $codeRedirect = $_.Exception.Response.StatusCode.value__
}
if ($codeRedirect -eq 308) {
    Write-Host " [PASS] Legacy Vietnamese URL Redirect (/lo-trinh) -> HTTP 308 Permanent Redirect" -ForegroundColor Green
} else {
    Write-Host " [FAIL] Legacy Vietnamese URL Redirect -> Expected 308, got $codeRedirect" -ForegroundColor Red
    $allPassed = $false
}

Write-Host "===================================================================="
if ($allPassed) {
    Write-Host " ALL INTEGRATION CHECKS PASSED SUCCESSFULLY!" -ForegroundColor Cyan
} else {
    Write-Host " SOME CHECKS FAILED." -ForegroundColor Yellow
}
