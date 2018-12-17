module.exports = [{
  type: 'list',
  name: 'wantLearn',
  message: '还说不说"老子学不动了"？',
  choices: [{
      name: '老子还要继续说，怎么了😊',
      value: false
    },
    {
      name: '继续更新吧，舍命相配!',
      value: true
    }
  ],
  default: true
}]
