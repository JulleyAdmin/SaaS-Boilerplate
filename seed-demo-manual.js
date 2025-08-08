// Manual demo seeding script
require('dotenv').config({ path: '.env.local' });
process.env.DEMO_MODE = 'true';

async function seedDemo() {
  console.log('🌱 Starting manual demo seed...\n');
  
  try {
    // Import after setting env vars
    const { initializeDemoData, checkDemoData } = await import('./src/libs/init-demo-data.ts');
    
    console.log('📊 Checking current status...');
    const beforeStatus = await checkDemoData();
    console.log('Before:', beforeStatus);
    
    if (!beforeStatus.isComplete) {
      console.log('\n🔧 Initializing demo data...');
      const result = await initializeDemoData();
      console.log('Result:', result ? '✅ Success' : '❌ Failed');
      
      console.log('\n📊 Checking after seeding...');
      const afterStatus = await checkDemoData();
      console.log('After:', afterStatus);
    } else {
      console.log('\n✅ Demo data already complete!');
    }
  } catch (error) {
    console.error('\n❌ Error:', error);
  }
  
  process.exit(0);
}

seedDemo();