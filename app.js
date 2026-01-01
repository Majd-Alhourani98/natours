const express = require("express");

const app = express();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started successfully and listening on port ${PORT}`);
});
