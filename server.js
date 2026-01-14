const dotenv = require('dotenv');

// START LISTENING IMMEDIATELY (Safety Net)
process.on('uncaughtException', (err) => {
  console.error('🔥🔥 Uncaught Exception:', err.name, err.message);
  // Synchronous errors leave the app in an "unclean" state, so we must exit.
  process.exit(1);
});

dotenv.config();

const connectDB = require('./config/db');

const app = require('./app');

let server;

const bootstrap = async () => {
  try {
    // 1. Await Database Connection
    await connectDB();

    // 2. Start Server
    const PORT = process.env.PORT || 5000;
    server = app.listen(PORT, () => {
      console.log(`\n${'━'.repeat(21)} SERVER ${'━'.repeat(21)}`);
      console.log(`🟢 STATUS       → Running `);
      console.log(`🔗 LINK         → http://localhost:${PORT}`);
      console.log(`🌍 ENVIRONMENT  → ${process.env.NODE_ENV}`);
      console.log(`⏰ STARTED AT   → ${new Date().toLocaleString()}\n`);
    });
  } catch (error) {
    console.error('❌ ERROR DURING BOOTSTRAP:', error.message);
    process.exit(1);
  }
};

bootstrap();

// UNHANDLED REJECTION HANDLER
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);

  // Give the server time to finish pending requests before closing
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

/*
Bootstrap vs. Run: Simple Comparison
   - To keep it very simple, think of the difference like this:

  1. Run: The "Light Switch" Approach. You just turn it on. You assume everything is ready and you just want the code to execute immediately. It's used for small, simple tasks.

  2. Bootstrap: The "Pre-flight Checklist" Approach. Before you can "run" the plane, you have to:
     - Check the fuel (Environment variables).
     - Check the engines (Database connection).
     - Check the radio (Server port).
    - Only then do you take off.

*/
