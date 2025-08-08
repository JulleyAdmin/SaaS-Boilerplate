import { initializeDemoData, checkDemoData } from '@/libs/init-demo-data';

async function seedDemo() {
  console.log('🌱 Starting demo data seed...\n');
  
  try {
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
    process.exit(1);
  }
  
  process.exit(0);
}

// Set demo mode
process.env.DEMO_MODE = 'true';

seedDemo();