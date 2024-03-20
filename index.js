import puppeteer from "puppeteer-core";
import {USERNAME, PASSWORD} from "./SECRETS.js";



async function run() {

    let browser;
    try {
        
        const auth = `${USERNAME}:${PASSWORD}`

        browser = await puppeteer.connect({
            browserWSEndpoint: `wss://${auth}@brd.superproxy.io:9222`
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(2 * 60 * 1000)

        await page.goto('https://amazon.com');

        const body = await page.$('body')
        const html = await page.evaluate(() =>
            document.documentElement.outerHTML
        );

        console.log(html)





        return;

    } catch (e) {
        console.error('scrape failed!', e)
        
    } finally {
        await browser?.close();

    }

}

run()