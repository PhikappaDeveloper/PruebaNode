const express = require('express')
const app = express()
const port = 3000
const puppeteer = require('puppeteer')
const Excel = require('exceljs');

app.get('/', (req, res) => {
  
    async function scrape() {
    const browser = await puppeteer.launch({})
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0);

    await page.goto('https://finance.yahoo.com/')
    var element = await page.waitForSelector('*[data-field="regularMarketPrice"]')
    var text = await page.evaluate(element => element.textContent, element)
    res.send("<h1>"+text+"</h1>")
    

      async function excel() {
        let workbook = new Excel.Workbook();
        workbook = await workbook.xlsx.readFile('src/excelfinance.xlsx'); 
        let worksheet = workbook.getWorksheet('FONDOS'); 
        worksheet.getRow(2).getCell('D').value = text; 
        workbook.xlsx.writeFile('src/excelfinance.xlsx');
      }
  
      excel();

      browser.close()
    }
    scrape()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
