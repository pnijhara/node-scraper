const  rp = require("request-promise")
const cheerio = require("cheerio")
const json2csv = require("json2csv").Parser
const fs = require("fs");

const movie_URL = "https://www.imdb.com/title/tt7286456/?ref_=hm_fanfav_tt_3_pd_fp1";

(async() => {
    let data = []
    const response = await rp({
        uri: movie_URL,
        headers:{
            accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8"
        },
        gzip: true,
    })
    let $ = cheerio.load(response)
    let title = $('div[class="title_wrapper"] > h1').text().trim()
    let rating = $('div[class="ratingValue"] > strong > span').text().trim()
    let summary = $('div[class="plot_summary_wrapper"] > div[class="plot_summary "] > div[class="summary_text"]').text().trim()

    data.push({
        title: title,
        rating: rating,
        summary: summary
    })
    console.log(data)

    const j2cp = new json2csv()
    const csv = j2cp.parse(data)
    
    fs.writeFileSync("./movie.csv", csv, "utf8")
})()
