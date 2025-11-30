const { Client } = require("pg");

const client = new Client({
  connectionString:
    "postgresql://postgres:123456@localhost:5432/postgres?schema=public",
});

client
  .connect()
  .then(async () => {
    console.log("Connected successfully to postgres DB");
    try {
      await client.query("CREATE DATABASE puntonet_desk");
      console.log("Database puntonet_desk created successfully");
    } catch (err) {
      if (err.code === "42P04") {
        console.log("Database puntonet_desk already exists");
      } else {
        console.error("Error creating database:", err);
      }
    }
    return client.end();
  })
  .catch((err) => {
    console.error("Connection error", err.stack);
    process.exit(1);
  });
