var nodejieba = require("nodejieba");

// const sentence = "我是拖拉机学院手扶拖拉机专业的。不用多久，我就会升职加薪，当上CEO，走上人生巅峰。";
const sentence = "元旦，室外零下的气温，看着孤零零的他那么认真，有些敬畏，有些心酸。"
let result;

result = nodejieba.cut(sentence);
console.log(result);

result = nodejieba.cut(sentence, true);
console.log(result);

result = nodejieba.cutHMM(sentence);
console.log(result);

result = nodejieba.cutAll(sentence);
console.log(result);

result = nodejieba.cutForSearch(sentence);
console.log(result);

result = nodejieba.tag(sentence);
console.log(result);

result = nodejieba.extract(sentence, 100);
console.log(result);

result = nodejieba.cut("男默女泪");
console.log(result);
nodejieba.insertWord("男默女泪");
result = nodejieba.cut("男默女泪");
console.log(result);

result = nodejieba.cutSmall("南京市长江大桥", 3);
console.log(result);