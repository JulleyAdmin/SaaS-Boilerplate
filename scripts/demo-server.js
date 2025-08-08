const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class DemoServer {
  constructor() {
    this.process = null;
    this.restartCount = 0;
    this.maxRestarts = 3;
    this.healthCheckInterval = null;
    this.startTime = Date.now();
  }

  start() {
    console.log('🚀 Starting HospitalOS Demo Server...');
    console.log('📋 Demo Mode: Optimized for demonstration');
    
    // Ensure demo environment is loaded
    const demoEnvPath = path.join(process.cwd(), '.env.demo');
    if (!fs.existsSync(demoEnvPath)) {
      console.error('❌ Demo environment file not found: .env.demo');
      process.exit(1);
    }

    // Load demo environment
    require('dotenv').config({ path: demoEnvPath });
    
    // Set demo-specific environment variables
    process.env.DEMO_MODE = 'true';
    process.env.NODE_ENV = 'development';
    process.env.NEXT_TELEMETRY_DISABLED = '1';
    
    this.process = spawn('npm', ['run', 'dev'], {
      env: process.env,
      stdio: ['inherit', 'pipe', 'pipe'],
      cwd: process.cwd()
    });

    this.setupLogging();
    this.setupHealthMonitoring();
    this.setupGracefulShutdown();
    this.setupProcessMonitoring();
    
    console.log(`🔄 Demo server started with PID: ${this.process.pid}`);
  }

  setupLogging() {
    const logFile = `logs/demo-server-${new Date().toISOString().slice(0, 10)}.log`;
    const logStream = fs.createWriteStream(logFile, { flags: 'a' });
    
    this.process.stdout.on('data', (data) => {
      const output = data.toString();
      process.stdout.write(output);
      logStream.write(`[STDOUT] ${new Date().toISOString()} ${output}`);
      
      // Check for ready state
      if (output.includes('Ready in')) {
        console.log('✅ Demo server is ready!');
        this.onServerReady();
      }
    });

    this.process.stderr.on('data', (data) => {
      const output = data.toString();
      process.stderr.write(output);
      logStream.write(`[STDERR] ${new Date().toISOString()} ${output}`);
    });
  }

  setupHealthMonitoring() {
    // Health check every 30 seconds
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, 30000);
  }

  async performHealthCheck() {
    try {
      const http = require('http');
      
      const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/health',
        method: 'GET',
        timeout: 5000
      };

      const req = http.request(options, (res) => {
        if (res.statusCode === 200) {
          console.log(`💚 Health check passed (${Date.now() - this.startTime}ms uptime)`);
        } else {
          console.warn(`⚠️ Health check warning: HTTP ${res.statusCode}`);
        }
      });

      req.on('error', (error) => {
        console.warn(`⚠️ Health check failed: ${error.message}`);
        if (this.restartCount < this.maxRestarts) {
          this.restart();
        }
      });

      req.on('timeout', () => {
        console.warn('⚠️ Health check timeout');
        req.destroy();
      });

      req.end();
    } catch (error) {
      console.warn(`⚠️ Health check error: ${error.message}`);
    }
  }

  onServerReady() {
    console.log('');
    console.log('🎉 HospitalOS Demo is ready!');
    console.log('');
    console.log('📊 Demo Information:');
    console.log('   • URL: http://localhost:3001');
    console.log('   • Login: admin@stmarys.hospital.com');
    console.log('   • Password: u3Me65zO&8@b');
    console.log('   • Mode: Demo (optimized for presentation)');
    console.log('   • Database: In-memory PGLite');
    console.log('');
    console.log('🔍 Demo Features Available:');
    console.log('   • Patient Management');
    console.log('   • Appointment Scheduling');
    console.log('   • Department Management');
    console.log('   • Staff Management');
    console.log('   • Pharmacy Operations');
    console.log('   • Laboratory Management');
    console.log('   • Billing & Insurance');
    console.log('   • Emergency Management');
    console.log('   • SSO Configuration');
    console.log('   • Audit Logging');
    console.log('   • Administrative Tools');
    console.log('');
  }

  setupProcessMonitoring() {
    this.process.on('exit', (code, signal) => {
      console.log(`🔄 Demo server process exited: code=${code}, signal=${signal}`);
      if (code !== 0 && this.restartCount < this.maxRestarts) {
        this.restart();
      }
    });

    this.process.on('error', (error) => {
      console.error(`❌ Demo server process error: ${error.message}`);
      if (this.restartCount < this.maxRestarts) {
        this.restart();
      }
    });
  }

  restart() {
    this.restartCount++;
    console.log(`🔄 Restarting demo server (attempt ${this.restartCount}/${this.maxRestarts})`);
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    if (this.process && !this.process.killed) {
      this.process.kill('SIGTERM');
    }
    
    setTimeout(() => {
      this.start();
    }, 2000);
  }

  setupGracefulShutdown() {
    const shutdown = (signal) => {
      console.log(`\n🛑 Received ${signal}, shutting down demo server gracefully...`);
      
      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
      }
      
      if (this.process && !this.process.killed) {
        this.process.kill('SIGTERM');
        
        // Force kill after 10 seconds
        setTimeout(() => {
          if (!this.process.killed) {
            console.log('🔥 Force killing demo server process');
            this.process.kill('SIGKILL');
          }
        }, 10000);
      }
      
      console.log('👋 Demo server shutdown complete');
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  }
}

// Start the demo server
new DemoServer().start();
