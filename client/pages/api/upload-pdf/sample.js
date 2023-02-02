//const express = require("express");
//const bodyParser = require("body-parser");
const axios = require("axios");

//const app = express();
//app.use(bodyParser.json());

app.post("/convert-pdf", async (req, res) => {
  try {
    const file = req.body;
    const { data } = await axios.post(
      "https://adobeioruntime.net/api/v1/web/your_extract_api_endpoint",
      file,
      {
        headers: {
          "Content-Type": "application/pdf",
          "x-api-key": "your_api_key",
        },
      }
    );
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});
