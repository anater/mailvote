import fs from "fs";
import path from "path";

const isDev = process.env.NODE_ENV === "development";
const counties = JSON.parse(fs.readFileSync("./src/counties.json"));
const html = `
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- HTML Meta Tags -->
    <title>Vote by Mail Florida!</title>
    <meta name="description" content="Easily find where to register for your mail-in ballot.">

    <!-- Google / Search Engine Tags -->
    <meta itemprop="name" content="Vote by Mail Florida!">
    <meta itemprop="description" content="Easily find where to register for your mail-in ballot.">
    <meta itemprop="image" content="meta.jpg">

    <!-- Facebook Meta Tags -->
    <meta property="og:url" content="https://mailvote.us">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Vote by Mail Florida!">
    <meta property="og:description" content="Easily find where to register for your mail-in ballot.">
    <meta property="og:image" content="meta.jpg">

    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Vote by Mail Florida!">
    <meta name="twitter:description" content="Easily find where to register for your mail-in ballot.">
    <meta name="twitter:image" content="meta.jpg">
  </head>
  <body>
    <header>
      <h1>
        <div class="emoji" role="presentation">🇺🇸 🗳 ✉️</div>
        Vote by Mail Florida!
      </h1>
      
      <p>
        Easily find where to register for your mail-in ballot. All links go directly to a county mail-in ballot request page.
      </p>
      
      <p>
        <button onclick="findCounty(this)">Use your location</button> to quickly find your county.
        <script async src="location.js"></script>
      </p>
    </header>

    <ul id="counties" class="list-columns">
      ${counties
        .map(({ fips, link, name }) => `<li><a id="${fips}" href="${link}">${name}</a></li>`)
        .join("\n")}
    </ul>

    ${
      isDev
        ? // enable browser-sync
          `<script async src='http://localhost:3000/browser-sync/browser-sync-client.js?v=2.26.12'></script>`
        : ""
    }
  </body>
  <style>
    * {
      font-family: inherit;
      line-height: 1.5em;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    * + * {
      margin-top: 1em;
    }

    html, body {
      background: #081839;
      color: white;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      padding: 1rem;
      max-width: 120ch;
      margin: 0 auto;
    }

    header {
      text-align: center;
    }

    h1 {
      font-size: 4em;
      line-height: 1em;
      letter-spacing: -0.05em;
      color: #FD514B;
    }

    a, a:visited {
      color: #74AAD8;
      color: #FD514B;
    }

    a[href=""] {
      color: inherit;
      text-decoration: none;
      opacity: .6;
      pointer-events: none;
    }

    button, a.current-location {
      -webkit-appearance: none;
      font: inherit;
      color: #081839;
      background-color: #FD514B;
      background-color: #74AAD8;
      padding: 0.25em;
      border-radius: 0.25em;
      border: none;
      transition: opacity, transform 100ms;
      font-weight: bold;
    }

    button:active, a.current-location:active{
      opacity: 0.8;
      transform: scale(.95);
    }

    .pulse {
      animation: pulse 500ms infinite;
      animation-direction: alternate;
      animation-timing-function: ease-in;
      animation-fill-mode: both;
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0.95);
      }
    }

    ul {
      list-style-type: none;
    }

    .list-columns {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }

    .list-columns > * {
      margin-top: 1em;
      padding-right: 1em;
    }

    .list-columns a {
      display: inline-block;
      padding: 0.25em;
      border-radius: 0.25em;
      transition: opacity, transform 100ms;
    }
  </style>
</html>
`.trim();

const output = {
  path: "./dist/",
  filename: "index.html",
};

if (!fs.existsSync(output.path)) fs.mkdirSync(output.path);

fs.writeFileSync(path.resolve(output.path, output.filename), html);
