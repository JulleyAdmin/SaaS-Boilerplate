const fetch = require('node-fetch');

async function testPatientAPI() {
  const baseURL = 'http://localhost:3002';
  
  console.log('🔍 Testing Patient Management API Endpoints...\n');

  // Test endpoints
  const tests = [
    {
      name: 'Get Patients (no auth)',
      method: 'GET',
      url: '/api/patients',
      expectedStatus: 401
    },
    {
      name: 'Get Patient Statistics (no auth)',
      method: 'GET', 
      url: '/api/patients/statistics',
      expectedStatus: 401
    },
    {
      name: 'Get Today Activity (no auth)',
      method: 'GET',
      url: '/api/analytics/today',
      expectedStatus: 401
    },
    {
      name: 'Create Patient (no auth)',
      method: 'POST',
      url: '/api/patients',
      body: {
        firstName: 'Test',
        lastName: 'Patient',
        dateOfBirth: '1990-01-01',
        gender: 'Male'
      },
      expectedStatus: 401
    }
  ];

  const results = [];

  for (const test of tests) {
    try {
      console.log(`\n📡 Testing: ${test.name}`);
      console.log(`   ${test.method} ${test.url}`);
      
      const options = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (test.body) {
        options.body = JSON.stringify(test.body);
      }

      const response = await fetch(`${baseURL}${test.url}`, options);
      const responseText = await response.text();
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      const result = {
        name: test.name,
        endpoint: `${test.method} ${test.url}`,
        status: response.status,
        statusText: response.statusText,
        expectedStatus: test.expectedStatus,
        passed: response.status === test.expectedStatus,
        response: responseData
      };

      results.push(result);

      console.log(`   Status: ${response.status} ${response.statusText}`);
      console.log(`   Expected: ${test.expectedStatus}`);
      console.log(`   Result: ${result.passed ? '✅ PASS' : '❌ FAIL'}`);
      
      if (responseData && typeof responseData === 'object') {
        console.log(`   Response: ${JSON.stringify(responseData, null, 2)}`);
      }

    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      results.push({
        name: test.name,
        endpoint: `${test.method} ${test.url}`,
        status: 'ERROR',
        error: error.message,
        passed: false
      });
    }
  }

  // Summary
  console.log('\n\n📊 === TEST SUMMARY ===\n');
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  console.log(`Total Tests: ${results.length}`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Failed: ${failed} ❌`);
  
  if (failed > 0) {
    console.log('\nFailed Tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}: ${r.status} (expected ${r.expectedStatus})`);
    });
  }

  // Check for missing endpoints
  console.log('\n\n🔍 === MISSING ENDPOINTS CHECK ===\n');
  const missingEndpoints = [
    '/api/patients/[id]',
    '/api/patients/[id]/history',
    '/api/patients/[id]/appointments',
    '/api/patients/[id]/medical-records',
    '/api/appointments',
    '/api/consultations',
    '/api/prescriptions',
    '/api/lab-results',
    '/api/departments',
    '/api/staff'
  ];

  console.log('Potentially missing endpoints based on UI features:');
  missingEndpoints.forEach(endpoint => {
    console.log(`  - ${endpoint}`);
  });

  // Save results
  require('fs').writeFileSync(
    'patient-api-test-results.json',
    JSON.stringify({ 
      timestamp: new Date().toISOString(),
      results,
      summary: { total: results.length, passed, failed },
      missingEndpoints
    }, null, 2)
  );
  
  console.log('\n📄 Results saved to: patient-api-test-results.json');
}

testPatientAPI().catch(console.error);