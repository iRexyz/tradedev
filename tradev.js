const puppeteer = require("puppeteer");
const moment = require("moment");
const chalk = require("chalk");
const delay = require("delay");
const readlineSync = require("readline-sync");

(async () => {
  const args = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-infobars",
    "--ignore-certifcate-errors",
    "--ignore-certifcate-errors-spki-list",
    "--disable-accelerated-2d-canvas",
    "--no-zygote",
    "--no-first-run",
    "--disable-dev-shm-usage",
    "--window-size=1920x1080",
  ];

  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    userDataDir: "./tmp",
    slowMo: 0,
    devtools: false,
    args,
  });

  const pages = await browser.pages();
  const page = pages[0];
  page.setDefaultNavigationTimeout(0);
  await page.goto("https://binomo.com/trading", {
    waitUntil: "networkidle0",
    timeout: 120000,
  });

  let loginRequired = false;

  if ((await page.$("#qa_auth_LoginBtn > button")) !== null) {
    console.log(
      `[ ${moment().format("HH:mm:ss")} ] `,
      chalk.yellow("You must login first")
    );
    loginRequired = true;
  } else {
    loginRequired = false;
  }

  if (loginRequired) {
    readlineSync.question("Press enter if done login...");
    console.log("");

    if ((await page.$("#avatar > vui-badge > vui-avatar > img")) !== null) {
      await page.evaluate(() =>
        document.querySelector("#avatar > vui-badge > vui-avatar > img").click()
      );
    } else {
      await page.evaluate(() =>
        document
          .querySelector("#avatar > vui-badge > vui-avatar > span")
          .click()
      );
    }

    await page.waitForSelector(
      "#qa_header_MiniProfileDropdown > div.popover_body__3GBGJ > div > div.personal-information> div.wrap > div > p.name"
    );
    let loginName = await page.$(
      "#qa_header_MiniProfileDropdown > div.popover_body__3GBGJ > div > div.personal-information > div.wrap > div > p.name"
    );
    let loginNameValue = await page.evaluate((el) => el.textContent, loginName);
    console.log(
      `[ ${moment().format("HH:mm:ss")} ] `,
      chalk.green(`Login successfully with account: ${loginNameValue}`)
    );
  } else {
    if ((await page.$("#avatar > vui-badge > vui-avatar > img")) !== null) {
      await page.evaluate(() =>
        document.querySelector("#avatar > vui-badge > vui-avatar > img").click()
      );
    } else {
      await page.evaluate(() =>
        document
          .querySelector("#avatar > vui-badge > vui-avatar > span")
          .click()
      );
    }
    await page.waitForSelector(
      "#qa_header_MiniProfileDropdown > div.popover_body__3GBGJ > div > div.personal-information > div.wrap > div > p.name"
    );
    let loginName = await page.$(
      "#qa_header_MiniProfileDropdown > div.popover_body__3GBGJ > div > div.personal-information > div.wrap > div > p.name"
    );
    let loginNameValue = await page.evaluate((el) => el.textContent, loginName);
    console.log(
      `[ ${moment().format("HH:mm:ss")} ] `,
      chalk.green(`Login successfully with account: ${loginNameValue}`)
    );
  }

  await page.goto("https://binomo.com/trading", {
    waitUntil: "networkidle0",
    timeout: 120000,
  });

  console.log(
    `[ ${moment().format("HH:mm:ss")} ] `,
    chalk.green("Trade using a Demo account")
  );

  console.log(
    `[ ${moment().format("HH:mm:ss")} ] `,
    chalk.green("Start Trading...")
  );

  await delay(2000);

  let kompen = ["12", "15", "34", "77", "173", "390", "877", "1974", "4441"];

  await page.evaluate(`document.querySelector("[id='amount-counter']").value = ${kompen[0]}`)
  await page.evaluate(`document.querySelector("[id='amount-counter']").dispatchEvent(new Event('input'))`)


  console.log("");
  const time = new Date();
  const timer = 60 * 1000 - (time.getSeconds() * 1000 + time.getMilliseconds());
  await delay(timer);
  let type = false;
  let j = 0;
  let i = 0;

  while (true) {
    let ifKompen = true;
    if (j > 1) {
      j = 0;
      type = !type;
    }
    if (type == true) {
      console.log(
        `[ ${moment().format("HH:mm:ss")} ] `,
        chalk.green(`Buy at ${moment().format("HH:mm:ss")} ...`)
      );
      await page.evaluate(() =>
        document.querySelector("#qa_trading_dealUpButton > button").click()
      );
      await delay(55000);
      await page.waitForSelector("div > span.currency", { visible: true });
      const hasil = await page.evaluate(
        () => document.querySelector("div > span.currency").innerText
      );

      if (hasil == "₺0,00") {
        console.log(`              ${chalk.red(`Lose ${kompen[i]}`)}`);
        i++;
        j++;
        ifKompen = true;
      } else {
        console.log(`              ${chalk.green(`Profit ${hasil}`)}`);
        if (i > 0) ifKompen = true;
        j = 0;
        i = 0;
      }
      if (i == 10) i--;
      console.log(`              Next open ${kompen[i]}`);
      console.log("");
    } else if (type == false) {
      console.log(
        `[ ${moment().format("HH:mm:ss")} ] `,
        chalk.green(`Sell at ${moment().format("HH:mm:ss")} ...`)
      );
      await page.evaluate(() =>
        document.querySelector("#qa_trading_dealDownButton > button").click()
      );
      await delay(55000);
      await page.waitForSelector("div > span.currency", { visible: true });
      const hasil = await page.evaluate(
        () => document.querySelector("div > span.currency").innerText
      );

      if (hasil == "₺0,00") {
        console.log(`              ${chalk.red(`Lose ${kompen[i]}`)}`);
        i++;
        j++;
        ifKompen = true;
      } else {
        console.log(`              ${chalk.green(`Profit ${hasil}`)}`);
        if (i > 0) ifKompen = true;
        j = 0;
        i = 0;
      }
      if (i == 10) i--;
      console.log(`              Next open ${kompen[i]}`);
      console.log("");
    }
    if (ifKompen) {
      
    await page.evaluate(`document.querySelector("[id='amount-counter']").value = ${kompen[i]}`)
    await page.evaluate(`document.querySelector("[id='amount-counter']").dispatchEvent(new Event('input'))`)
    }
  }
})();
