const axios = require("axios");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

async function pageOne() {
  const response = await axios.get(
    "https://www.sephora.com/api/catalog/categories/cat1960033/products?currentPage=1&pageSize=300&content=true&includeRegionsMap=true"
  );
  const products = response.data.products;
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const productInfo = [];
  let count = 1;
  products.forEach((product) => {
    product.id = count;
    productInfo.push(product);
    count++;
  });

  productInfo.forEach(async (product, index) => {
    try {
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
      page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36"
      );
      await page.goto(`https://www.sephora.com${product.targetUrl}`, {
        waitUntil: "load",
        timeout: 0,
      });
      const userAgent = await page.evaluate(() => navigator.userAgent);
      const productContent = await page.content();
      const $ = await cheerio.load(productContent);
      const ingredient = await $(
        "#ingredients .css-1ue8dmw.eanm77i0 div"
      ).text();
      product.ingredients = ingredient;
    } catch (err) {
      console.log(err);
    }
  });
  console.log(productInfo);
}

async function pageTwo() {
  const { data } = await axios.get(
    "https://www.sephora.com/api/catalog/categories/cat1960033/products?currentPage=2&pageSize=300&content=true&includeRegionsMap=true"
  );
}

async function pageThree() {
  const { data } = await axios.get(
    "https://www.sephora.com/api/catalog/categories/cat1960033/products?currentPage=3&pageSize=300&content=true&includeRegionsMap=true"
  );
  console.log(data.products);
}

async function pageFour() {
  const { data } = await axios.get(
    "https://www.sephora.com/api/catalog/categories/cat1960033/products?currentPage=4&pageSize=300&content=true&includeRegionsMap=true"
  );
}

pageOne();
