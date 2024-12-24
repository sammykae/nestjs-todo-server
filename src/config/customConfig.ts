export default () => ({
  port: process.env.PORT || 8000,
  database: {
    uri: process.env.MONGO_URI,
  },
});
