const express = require("express");

const app = express();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server ignited and running on http://localhost:${PORT}...`);
});
