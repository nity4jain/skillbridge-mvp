const express = require("express");
const jobsRoute = require("./routes/jobs");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors()); // Allow frontend requests
app.use(express.json());

// Mount the jobs route
app.use("/api", jobsRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
