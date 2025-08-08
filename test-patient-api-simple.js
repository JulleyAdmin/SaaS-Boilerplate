const fetch = require('node-fetch');

async function testPatientAPI() {
  console.log('\n🧪 Testing Patient API Endpoints...\n');
  
  try {
    // Test 1: Get patient statistics
    console.log('📊 Testing /api/patients/statistics...');
    const statsResponse = await fetch('http://localhost:3002/api/patients/statistics', {
      headers: {
        'Authorization': 'Bearer test-token',
        'x-org-id': 'org_2zEvWeRiroImRt78DAQGBpopF6a',
        'x-user-id': 'user_test'
      }
    });
    const statsData = await statsResponse.json();
    console.log('Response:', statsResponse.status);
    console.log('Data:', JSON.stringify(statsData, null, 2));
    
    // Test 2: Get patients list
    console.log('\n📋 Testing /api/patients...');
    const patientsResponse = await fetch('http://localhost:3002/api/patients?page=1&pageSize=10', {
      headers: {
        'Authorization': 'Bearer test-token', 
        'x-org-id': 'org_2zEvWeRiroImRt78DAQGBpopF6a',
        'x-user-id': 'user_test'
      }
    });
    const patientsData = await patientsResponse.json();
    console.log('Response:', patientsResponse.status);
    console.log('Data:', JSON.stringify(patientsData, null, 2));
    
    // Test 3: Get today's activity
    console.log('\n📅 Testing /api/analytics/today...');
    const todayResponse = await fetch('http://localhost:3002/api/analytics/today', {
      headers: {
        'Authorization': 'Bearer test-token',
        'x-org-id': 'org_2zEvWeRiroImRt78DAQGBpopF6a', 
        'x-user-id': 'user_test'
      }
    });
    const todayData = await todayResponse.json();
    console.log('Response:', todayResponse.status);
    console.log('Data:', JSON.stringify(todayData, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testPatientAPI();