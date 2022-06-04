const axios = require("axios");
const iconv = require("iconv-lite");
const cheerio = require("cheerio");

axios({
    url: "http://www.yes24.com/24/Category/BestSeller",
    method: 'GET',
    responseType: "arraybuffer"
})
    .then((response) => {
        const content = iconv.decode(response.data, "EUC-KR").toString();
        
        const $ = cheerio.load(content);
        $('#bestList > ol > li').each((index, element) =>{
            const title = $(element).find("p:nth-child(3) > a").text();
            const description = $(element).find('p.copy > a').text();
            const price = $(element).find('p.price > strong').text();
            const imageUrl = $(element).find("p.image > a > img").attr('src');

            console.log(index+1,{
                title,
                description,
                price,
                imageUrl,
            })
        })

        
    })
        
    .catch((error) => {
        console.log(error);
    });


