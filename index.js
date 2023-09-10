const express = require("express");
// const wildcardMatch = require('wildcard-match');

const app = express();
require("dotenv").config();

const puppeteer = require("puppeteer");

app.get("/", async (req, res) => {
  let productUrl = req.query.url;

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROME_EXECUTABLE_PATH, // Use environment variable
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    timeout: process.env.PUPPETEER_TIMEOUT || 60000,
  });
  const page = await browser.newPage();
  await page.setCacheEnabled(true);

  //   // Navigate to the product page
  await page.goto(productUrl, {timeout: 0});
  await page.waitForSelector("#productTitle", { timeout: 10000 });

  const productData = await page.evaluate(() => {
    const title = document.querySelector("#productTitle").innerText.trim();
    const price = document
      .querySelector(".a-price .a-offscreen")
      .innerText.trim();
    const availability = document
      .querySelector("#availability")
      .innerText.trim();
    const description = document
      .querySelector("#productDescription")
      .innerText.trim();

    return {
      title,
      price,
      availability,
      description,
    };
  });

  await browser.close();
  res.json(productData);
});
app.get("/status", (req, res) => {
  res.json({
    status: true
  })
})

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
