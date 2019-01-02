var express = require('express');
const app = express();

app.use('/bloggers', require('./routers/bloggers'));

app.listen(8001, () => {
  console.log('server listen at 8001');
});

