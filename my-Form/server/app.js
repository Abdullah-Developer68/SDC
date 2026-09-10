const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
// Import routes
const Routes = require('./routes/index.route');
const dbConnect = require('./db/dbConnect');

dbConnect();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', Routes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
