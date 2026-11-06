const dotenv = require('dotenv');
const path = require('path');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const parseArgs = () => {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) {
      parsed.email = args[i + 1];
      i++;
    } else if (args[i] === '--name' && args[i + 1]) {
      parsed.name = args[i + 1];
      i++;
    } else if (args[i] === '--password' && args[i + 1]) {
      parsed.password = args[i + 1];
      i++;
    }
  }
  return parsed;
};

const createAdmin = async () => {
  const cliArgs = parseArgs();
  const name = cliArgs.name || process.env.ADMIN_NAME || 'Platform Administrator';
  const email = (cliArgs.email || process.env.ADMIN_EMAIL || 'admin@skillbridge.dev').toLowerCase().trim();
  const password = cliArgs.password || process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error('ERROR: Admin password must be provided via --password argument or ADMIN_PASSWORD environment variable.');
    console.error('Usage: node scripts/createAdmin.js --name "Admin Name" --email "admin@domain.com" --password "YourStrongPassword123"');
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('ERROR: Admin password must be at least 6 characters long.');
    process.exit(1);
  }

  try {
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log(`[Admin Setup] Admin user '${email}' already exists with administrator privileges.`);
      } else {
        existingUser.role = 'admin';
        await existingUser.save();
        console.log(`[Admin Setup] Existing user '${email}' upgraded to administrator role.`);
      }
    } else {
      const newAdmin = await User.create({
        name,
        email,
        password,
        role: 'admin',
      });
      console.log(`[Admin Setup] Administrator created successfully: ${newAdmin.name} (${newAdmin.email})`);
    }

    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('[Admin Setup Error]:', err.message);
    process.exit(1);
  }
};

createAdmin();
