const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const app = express();

// Setting template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1: Global Middlewares
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP headers
app.use(helmet());

console.log(process.env.NODE_ENV);
// Development logging
if (process.env.NODE_ENV === 'development') {
  // 3rd Party Middleware
  app.use(morgan('dev'));
}

// Limit requests from the API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many requests from this IP, Please try again in an hour',
});

app.use('/api', limiter);

// Body Parser, reading data from the body into req.body
// Inbulit middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());

// creating new middleware
// app.use((req, res, next) => {
// console.log('hello from the middleware');
//   next();
// });

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// for disabling content security policy
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' cdnjs.cloudflare.com"
  );
  return next();
});

// ROUTES
// Mounting routers
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// Middleware for handling undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Using Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
