// Quick script to help debug user roles
console.log('To debug user roles in the browser:');
console.log('1. Go to http://localhost:3000/dashboard');
console.log('2. Open browser DevTools (F12)');
console.log('3. In Console, run: console.log(window.__CLERK_USER_METADATA__)');
console.log('4. Look for publicMetadata.role to see your current role');
console.log('');
console.log('Current role detection in ModernDashboardLayout.tsx:');
console.log('- Defaults to "Support-Staff" if no role is set');
console.log('- Admin roles: "Admin", "Hospital-Administrator", "Medical-Superintendent"');
console.log('- To see all navigation: Set role to one of the admin roles above');