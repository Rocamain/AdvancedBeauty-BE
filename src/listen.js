const app = require('./app.js');
const { PORT = 9000 } = process.env;

app.listen({ port: PORT }, async () => {
  console.log('Database Connected! listening in port:', PORT);
});
