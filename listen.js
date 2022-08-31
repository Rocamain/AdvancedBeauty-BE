const app = require('./app.js');
const { PORT = 9000 } = process.env;
const { sequelize } = require('./models/index');

app.listen({ port: PORT }, async () => {
  // await sequelize.sync();
  console.log(`Server up on http://localhost:${PORT}`);

  await sequelize.authenticate();
  console.log('Database Connected!');
});
