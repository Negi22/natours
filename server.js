const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Catching Uncaught Exception
process.on('uncaughtException', (err) => {
  console.log('Uncaugth Exception!! Shutting Down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// read variables from the file and save them
dotenv.config({ path: './config.env' });
const app = require('./app');

// replacing the password string with the real password
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successfull');
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`port started at ${port}`);
});

// Catching Unhandled Rejections
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection!! Shutting Down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
