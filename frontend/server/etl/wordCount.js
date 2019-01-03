const WordCount = require('../models/wordCount')
const WeiboContent = require('../models/weiboContent')
const nodejieba = require("nodejieba")

// look all record in it
WeiboContent
    .find({})
    .cursor()
    .on("data", handleOneWeiboContent)
    .on("end", () => {
        console.info("FINISH ALL WORK!")
    })

function handleOneWeiboContent(doc) {
    console.info(`分析${doc.name}的${doc.weibo_content.length}条微博`)

    const dic = {}
    doc.weibo_content.forEach(({ publish_content }) => {
        const result = nodejieba.cut(publish_content);
        result.forEach(word => {
            if (word.length === 1) {
                return
            }
            if (!dic[word]) {
                dic[word] = 0
            }
            dic[word]++
        })
    });

    const wordCountArray = []
    for (let key in dic) {
        wordCountArray.push({ name: key, value: dic[key] })
    }

    wordCountArray.sort((a, b) => {
        return b.value - a.value
    })

    new WordCount({
        name: doc.name,
        wordCount: wordCountArray
    }).save(function (err) {
        if (err) return console.error(err);
        console.info(`分析${doc.name}成功，最多的关键词是${wordCountArray[0].name}`)
    })
}
