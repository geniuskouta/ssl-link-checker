const puppeteer = require('puppeteer');

const targetPages = [
    'https://geniuskouta.com',
];

(async function main (){
	try{
		const browser = await puppeteer.launch({ headless: false});
		const page = await browser.newPage();
		page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36');
        for(let i = 0; i < targetPages.length; i++) {
            let targetPage = targetPages[i];
            await page.goto(targetPage);
            let anchorLinks = await page.$$eval('a', anchorTags => {
                return anchorTags.map(anchorTag => {
                    let isLink = typeof(anchorTag.href) === 'string';
                    if(isLink) {
                        return anchorTag.href;
                    }
                });
            });
            let imgLinks = await page.$$eval('img', imgTags => {
                return imgTags.map(imgTag => {
                    let isLink = typeof(imgTag.src) === 'string';
                    if(isLink) {
                        return imgTag.src;
                    }
                })
            });
            console.log(`Checking ${targetPage}`);
            logInvalidLinks(anchorLinks, "ANCHOR LINK");
            logInvalidLinks(imgLinks, "IMG LINK");
        }
	}catch(err){
		console.log(err);
	}
})();

function logInvalidLinks(links, type) {
    let invalidLinks = [];
    let message = '';
    links.map(link => {
        let regex = /^https:/;
        let isHTTPS = link.match(regex) ? true : false;
        if(!isHTTPS && link.length > 0) {
            invalidLinks.push(link);
        }
    });

    if(invalidLinks.length > 0) {
        message = `Invalid ${type}s:\n${invalidLinks}`;
    } else {
        message = `All ${type} are HTTPS.`;
    }
    console.log(message);
}