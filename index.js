import puppeteer from "puppeteer-core";
import { appendFileSync } from 'node:fs';
import { USERNAME, PASSWORD } from "./SECRETS.js";




async function run() {

    let browser;
    try {
        
        const auth = `${USERNAME}:${PASSWORD}`

        browser = await puppeteer.connect({
            browserWSEndpoint: `wss://${auth}@brd.superproxy.io:9222`
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(2 * 60 * 1000)

        await page.goto('https://www.amazon.com/Best-Sellers-Amazon-Renewed-Renewed-Laptops/zgbs/amazon-renewed/21614632011/ref=zg_bs_nav_amazon-renewed_1');

        const productsData = await page.evaluate(() => {
            const products = Array.from(document.querySelectorAll('._cDEzb_grid-column_2hIsc'))
            return products.map(product => {
                const titleElement = product.querySelector('._cDEzb_p13n-sc-css-line-clamp-3_g3dy1')
                const priceElement = product.querySelector('._cDEzb_p13n-sc-price_3mJ9Z')

                return {
                    title: titleElement ? titleElement.innerText.trim() : null,
                    price: priceElement ? priceElement.innerText.trim() : null
                };
            });
        });

        let productStr = ''
        productsData.forEach(item => {
            productStr += `ITEM DESCRIPTION: ${item.title} --- ${item.price}\n\n`;
        })
        appendFileSync('./product.txt', productStr)
        // console.log(productStr);

        return;

    } catch (e) {
        console.error('scrape failed!', e)
        
    } finally {
        await browser?.close();

    }

}

run()