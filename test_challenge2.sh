#!/bin/bash

echo "════════════════════════════════════════"
echo "  CHALLENGE 2: ARCHITECTURE DESIGN TEST"
echo "════════════════════════════════════════"
echo ""

PASS=0
FAIL=0

# Test 1: File exists
echo "📄 Test 1: ARCHITECTURE.md exists"
if [ -f ARCHITECTURE.md ]; then
    echo "   ✅ PASS"
    ((PASS++))
else
    echo "   ❌ FAIL - File not found"
    ((FAIL++))
    exit 1
fi
echo ""

# Test 2: Minimum length (should be substantial)
echo "📊 Test 2: Document has sufficient content"
LINES=$(wc -l < ARCHITECTURE.md)
if [ "$LINES" -gt 200 ]; then
    echo "   ✅ PASS ($LINES lines)"
    ((PASS++))
else
    echo "   ❌ FAIL (Only $LINES lines, need 200+)"
    ((FAIL++))
fi
echo ""

# Test 3: System Architecture Diagram
echo "🏗️  Test 3: System Architecture Diagram exists"
if grep -q "Client\|Load Balancer\|API Pod\|MinIO\|Observability" ARCHITECTURE.md; then
    echo "   ✅ PASS"
    ((PASS++))
else
    echo "   ❌ FAIL - Missing architecture diagram components"
    ((FAIL++))
fi
echo ""

# Test 4: Deployment Strategy
echo "🚀 Test 4: Deployment Strategy covered"
if grep -q "Development\|Staging\|Production" ARCHITECTURE.md; then
    echo "   ✅ PASS"
    ((PASS++))
else
    echo "   ❌ FAIL - Missing deployment environments"
    ((FAIL++))
fi
echo ""

# Test 5: Scaling Strategy
echo "📈 Test 5: Scaling Strategy covered"
if grep -q "Horizontal\|Vertical\|Caching\|auto-scaling" ARCHITECTURE.md; then
    echo "   ✅ PASS"
    ((PASS++))
else
    echo "   ❌ FAIL - Missing scaling strategy"
    ((FAIL++))
fi
echo ""

# Test 6: Observability/Monitoring
echo "📊 Test 6: Monitoring & Observability covered"
if grep -q "Jaeger\|Prometheus\|Grafana\|observability\|metrics" ARCHITECTURE.md; then
    echo "   ✅ PASS"
    ((PASS++))
else
    echo "   ❌ FAIL - Missing observability strategy"
    ((FAIL++))
fi
echo ""

# Test 7: Resilience patterns
echo "🛡️  Test 7: Resilience patterns covered"
if grep -q "Circuit Breaker\|Retry\|Failover" ARCHITECTURE.md; then
    echo "   ✅ PASS"
    ((PASS++))
else
    echo "   ❌ FAIL - Missing resilience patterns"
    ((FAIL++))
fi
echo ""

# Test 8: Data flow explanation
echo "🔄 Test 8: Data flow explained"
if grep -q "flow\|request\|Client POSTs" ARCHITECTURE.md; then
    echo "   ✅ PASS"
    ((PASS++))
else
    echo "   ❌ FAIL - Missing data flow explanation"
    ((FAIL++))
fi
echo ""

# Test 9: Practical/Real-world tone
echo "💬 Test 9: Realistic, non-templated content"
if grep -q "Real talk\|we\|we'd\|lessons learned\|Actually\|challenge" ARCHITECTURE.md; then
    echo "   ✅ PASS (Natural voice detected)"
    ((PASS++))
else
    echo "   ⚠️  WARNING - Might sound too templated"
fi
echo ""

# Test 10: Docker compose files valid
echo "🐳 Test 10: Docker compose files are valid"
if docker compose -f docker/compose.dev.yml config > /dev/null 2>&1; then
    echo "   ✅ PASS (dev compose valid)"
    ((PASS++))
else
    echo "   ❌ FAIL (dev compose invalid)"
    ((FAIL++))
fi
echo ""

# Test 11: Production compose valid
echo "🐳 Test 11: Production compose file valid"
if docker compose -f docker/compose.prod.yml config > /dev/null 2>&1; then
    echo "   ✅ PASS (prod compose valid)"
    ((PASS++))
else
    echo "   ❌ FAIL (prod compose invalid)"
    ((FAIL++))
fi
echo ""

# Test 12: Tech stack mentioned
echo "🛠️  Test 12: Tech stack justified"
if grep -q "Tech Stack\|Node.js\|MinIO\|Prometheus\|Jaeger" ARCHITECTURE.md; then
    echo "   ✅ PASS"
    ((PASS++))
else
    echo "   ❌ FAIL - Missing tech stack section"
    ((FAIL++))
fi
echo ""

# Summary
echo "════════════════════════════════════════"
echo "  TEST RESULTS"
echo "════════════════════════════════════════"
echo "✅ Passed: $PASS"
echo "❌ Failed: $FAIL"
echo "Total Lines: $LINES"
echo ""

if [ $FAIL -eq 0 ]; then
    echo "🎉 Challenge 2 PASSES all tests!"
    exit 0
else
    echo "⚠️  Fix the failures above"
    exit 1
fi
