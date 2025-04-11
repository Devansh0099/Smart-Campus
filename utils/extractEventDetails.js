const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
// require("dotenv").config();

const extractEventDetails = async (filePath) => {
  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    const response = await axios.post(
      "https://api.market.llmwhisperer.com/api/parse",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "Authorization": `Bearer ${"val"}`
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error parsing file:", error.message);
    return {};
  }
};

module.exports = extractEventDetails;
