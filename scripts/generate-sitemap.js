const fs = require("fs");
const globby = require("globby");
const prettier = require("prettier");

const DOMAIN_NAME = "https://calcolafacile.it";

const formatted = (sitemap) => prettier.format(sitemap, { parser: "html" });

const generateSitemap = async () => {
  const pages = await globby([
    "pages/*.js",
    "!pages/_*.js",
    "!pages/404.js",
    "content/text/*.mdx",
  ]);

  const pageSitemap = `
  ${pages
    .map((page) => {
      const path = page
        .replace("pages/", "")
        .replace(/(.js|.mdx)/, "")
        .replace("content/text", "calcoli")
        .replace(/\/index/g, "");
      const routePath = path === "index" ? "" : path;

      return `
    <url>
    <loc>${DOMAIN_NAME}/${routePath}</loc>
    </url>
    `;
    })
    .join("")}`;

  const generatedSitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
    >
    ${pageSitemap}
    </urlset>    
    `;

  const formattedSitemap = [formatted(generatedSitemap)];

  fs.writeFileSync(
    __dirname + "/../public/sitemap.xml",
    formattedSitemap,
    "utf8"
  );
};

module.exports = generateSitemap;
