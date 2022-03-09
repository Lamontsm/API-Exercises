// This is a n exercise in passing parameters to an API via the URL call
// It comes from this site: https://www.digitalocean.com/community/tutorials/use-expressjs-to-get-url-and-post-parameters

const express = require('express');
const app = express();

// Routes go here
//READ Request Handlers
app.get('/', (req, res) => {
    res.send('Welcome to Steve Lamonts parameter passing demo');
});

// Using req.query.id
app.get('/api/users', function(req, res) {
  const user_id = req.query.id;
  const token = req.query.token;
  const geo = req.query.geo;

  console.log(user_id);

  res.send({
    'user_id': user_id,
    'token': token,
    'geo': geo
  });
});

const port=3000;
app.listen(port, () => {
    console.log('Server started on port', port)
});