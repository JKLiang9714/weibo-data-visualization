const express = require('express');
const Blogger = require('../models/blogger');
const BloggerFriend = require('../models/bloggerFriend');
const WeiboContent = require('../models/weiboContent');
const { rmEmptyProp } = require('../lib/utils');
const nodejieba = require('nodejieba');

const router = express.Router();

const filterWordList = ['视频', 'http', 'cn', '转发', '微博'];
// 过滤无用词和数字
const filterWord = (i) => filterWordList.indexOf(i.word) === -1 && isNaN(i.word - 0);

// 查询总数
router.get('/count', (req, res) => {
  console.info('Get bloggers count', req.params.id, req.query);

  Blogger.count(rmEmptyProp({
    name: req.query.name ? { $regex: req.query.name } : undefined,
  }), (err, count) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.json({
      count,
    });
  });
});

router.get('/:id?', (req, res) => {
  const page = req.query.page - 0 || 0;
  const limit = req.query.limit - 0 || 10;

  console.info('Get bloggers', req.params.id, req.query);

  Blogger.find(rmEmptyProp({
    id: req.params.id,
    name: req.query.name ? { $regex: req.query.name } : undefined,
  }))
    .skip(page * limit).limit(limit)
    .exec((err, bloggers) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (bloggers.length === 0) {
        return res.status(404).send(`Blogger Not Existed`);
      }

      res.json(bloggers);
    });
});


router.get('/:id/friends', (req, res) => {
  var findObj = {
    id: req.params.id,
  };
  console.info('Get blogger Friends', findObj);

  BloggerFriend.findOne(findObj)
    .populate({
      path: 'friends.friend_id',
      populate: { path: 'friends.friend_id' },
    })
    .exec((err, bloggerFrined) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!bloggerFrined) {
        return res.status(404).send(`${req.params.id} Not Existed`);
      }

      res.json(bloggerFrined.friends);
    });
});

router.get('/:id/weiboContent', (req, res) => {
  var findObj = {
    id: req.params.id,
  };
  console.info('Get blogger weibo content', findObj);

  WeiboContent.findOne(findObj, (err, weiboContent) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!weiboContent) {
      return res.status(404).send(`${req.params.id} Not Existed`);
    }
    let contents = weiboContent.weibo_content;
    let sumContent = '';
    // 每个weibo_content进行TFIDF分析
    contents = contents.map(content => {
      sumContent += ' ' + content.publish_content;
      content.tfidf = nodejieba.extract(content.publish_content, 10).filter(filterWord);
      return content;
    });
    res.json({
      contents,
      tfidf: nodejieba.extract(sumContent, 100).filter(filterWord),
    });
  });
});

module.exports = router;
