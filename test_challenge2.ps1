$pass = 0
$fail = 0

Write-Host "========================================"
Write-Host "  CHALLENGE 2: ARCHITECTURE DESIGN TEST"
Write-Host "========================================"
Write-Host ""

# Test 1: File exists
Write-Host "[1] ARCHITECTURE.md exists"
if (Test-Path "ARCHITECTURE.md") {
    Write-Host "    PASS" -ForegroundColor Green
    $pass++
} else {
    Write-Host "    FAIL - File not found" -ForegroundColor Red
    $fail++
}
Write-Host ""

# Test 2: Minimum length
Write-Host "[2] Document has sufficient content"
$content = Get-Content ARCHITECTURE.md -Raw
$lines = ($content.Split("`n")).Count
if ($lines -gt 200) {
    Write-Host "    PASS ($lines lines)" -ForegroundColor Green
    $pass++
} else {
    Write-Host "    FAIL (Only $lines lines, need 200+)" -ForegroundColor Red
    $fail++
}
Write-Host ""

# Test 3: Architecture Diagram
Write-Host "[3] System Architecture Diagram"
if ($content -match "Client|Load Balancer|API Pod|MinIO|Observability") {
    Write-Host "    PASS" -ForegroundColor Green
    $pass++
} else {
    Write-Host "    FAIL - Missing diagram" -ForegroundColor Red
    $fail++
}
Write-Host ""

# Test 4: Deployment Strategy
Write-Host "[4] Deployment Strategy (Dev/Staging/Prod)"
if ($content -match "Development|Staging|Production") {
    Write-Host "    PASS" -ForegroundColor Green
    $pass++
} else {
    Write-Host "    FAIL - Missing deployments" -ForegroundColor Red
    $fail++
}
Write-Host ""

# Test 5: Scaling Strategy
Write-Host "[5] Scaling Strategy (Horizontal/Vertical/Cache)"
if ($content -match "Horizontal|Vertical|Caching") {
    Write-Host "    PASS" -ForegroundColor Green
    $pass++
} else {
    Write-Host "    FAIL - Missing scaling" -ForegroundColor Red
    $fail++
}
Write-Host ""

# Test 6: Observability
Write-Host "[6] Monitoring & Observability (Jaeger/Prometheus/Grafana)"
if ($content -match "Jaeger|Prometheus|Grafana") {
    Write-Host "    PASS" -ForegroundColor Green
    $pass++
} else {
    Write-Host "    FAIL - Missing observability" -ForegroundColor Red
    $fail++
}
Write-Host ""

# Test 7: Resilience Patterns
Write-Host "[7] Resilience (Circuit Breaker/Retry/Failover)"
if ($content -match "Circuit Breaker|Retry|Failover") {
    Write-Host "    PASS" -ForegroundColor Green
    $pass++
} else {
    Write-Host "    FAIL - Missing resilience" -ForegroundColor Red
    $fail++
}
Write-Host ""

# Test 8: Data Flow
Write-Host "[8] Data flow explanation"
if ($content -match "Client POSTs|flow|request") {
    Write-Host "    PASS" -ForegroundColor Green
    $pass++
} else {
    Write-Host "    FAIL - Missing data flow" -ForegroundColor Red
    $fail++
}
Write-Host ""

# Test 9: Real-world tone
Write-Host "[9] Realistic, non-templated content"
if ($content -match "Real talk|we'd|lessons learned|Actually|challenge") {
    Write-Host "    PASS (Natural voice)" -ForegroundColor Green
    $pass++
} else {
    Write-Host "    WARNING - Might sound templated" -ForegroundColor Yellow
}
Write-Host ""

# Test 10: Dev compose valid
Write-Host "[10] Dev Docker compose valid"
$devCompose = docker compose -f docker/compose.dev.yml config 2>$null
if ($?) {
    Write-Host "    PASS" -ForegroundColor Green
    $pass++
} else {
    Write-Host "    FAIL - Dev compose invalid" -ForegroundColor Red
    $fail++
}
Write-Host ""

# Test 11: Prod compose valid
Write-Host "[11] Prod Docker compose valid"
$prodCompose = docker compose -f docker/compose.prod.yml config 2>$null
if ($?) {
    Write-Host "    PASS" -ForegroundColor Green
    $pass++
} else {
    Write-Host "    FAIL - Prod compose invalid" -ForegroundColor Red
    $fail++
}
Write-Host ""

# Test 12: Tech stack
Write-Host "[12] Tech stack justified"
if ($content -match "Tech Stack|Node.js|MinIO") {
    Write-Host "    PASS" -ForegroundColor Green
    $pass++
} else {
    Write-Host "    FAIL - Missing tech stack" -ForegroundColor Red
    $fail++
}
Write-Host ""

# Summary
Write-Host "========================================"
Write-Host "  TEST RESULTS"
Write-Host "========================================"
Write-Host "Passed:  $pass" -ForegroundColor Green
Write-Host "Failed:  $fail" -ForegroundColor $(if($fail -eq 0) { "Green" } else { "Red" })
Write-Host "Lines:   $lines"
Write-Host ""

if ($fail -eq 0) {
    Write-Host "SUCCESS: Challenge 2 PASSES all tests!" -ForegroundColor Green
} else {
    Write-Host "FAILED: Fix the failures above" -ForegroundColor Red
}
