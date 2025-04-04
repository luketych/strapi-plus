const { createStrapi } = require('@strapi/strapi');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(process.cwd(), 'logs', 'strapi.log');

async function testLogger() {
  try {
    // Create logs directory if it doesn't exist
    if (!fs.existsSync('logs')) {
      fs.mkdirSync('logs');
    }

    // Clear existing log file
    if (fs.existsSync(LOG_FILE)) {
      fs.unlinkSync(LOG_FILE);
    }

    console.log('🧪 Starting logger tests...');

    // Initialize Strapi instance
    const instance = createStrapi();
    await instance.load();
    const { log } = instance;

    console.log('📝 Testing different log levels...');

    // Test different log levels
    log.debug('Debug message for testing');
    log.info('Info message for testing');
    log.warn('Warning message for testing');
    log.error('Error message for testing');

    // Wait a moment for file writes to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify log file exists and has content
    if (fs.existsSync(LOG_FILE)) {
      const logContent = fs.readFileSync(LOG_FILE, 'utf8');
      const logLines = logContent.trim().split('\n');
      
      console.log('📊 Log file verification:');
      console.log(`- Log file exists: ${fs.existsSync(LOG_FILE)}`);
      console.log(`- Number of log entries: ${logLines.length}`);
      console.log('- Log entries found:');
      logLines.forEach(line => {
        const entry = JSON.parse(line);
        console.log(`  • [${entry.level}] ${entry.message}`);
      });
    } else {
      console.error('❌ Log file was not created!');
    }

    await instance.destroy();
    console.log('✅ Logger tests completed');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testLogger();
