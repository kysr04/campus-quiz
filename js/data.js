/* ==========================================================
   闯关吧 · 题库数据
   文件：js/data.js
   说明：三个题库共 45 道单选题。真实项目里题目应当由后端返回，
        做课程作业时写在前端最容易改，也方便老师直接看数据结构。
   字段说明：
     id       题目编号，全局唯一，错题本靠它记录
     q        题干
     options  四个选项，顺序就是页面上 A B C D 的顺序
     answer   正确选项的下标（0 表示 A，1 表示 B，以此类推）
     explain  答案解析，答完之后展示
   ========================================================== */

const BANKS = [
  {
    key: 'cs',
    name: '计算机基础',
    emoji: '💻',
    desc: '数据表示、硬件常识、网络与编程入门',
    time: '约 4 分钟',
    questions: [
      {
        id: 'cs-1',
        q: '1 KB 等于多少字节？',
        options: ['1000 字节', '512 字节', '1024 字节', '2048 字节'],
        answer: 2,
        explain: '计算机里以 2 的幂为单位，1 KB = 2 的 10 次方 = 1024 字节。'
      },
      {
        id: 'cs-2',
        q: '下列哪一项不是编程语言？',
        options: ['HTML', 'Python', 'C++', 'Java'],
        answer: 0,
        explain: 'HTML 是描述网页结构的标记语言，本身没有逻辑运算能力，通常要和 CSS、JavaScript 配合使用。'
      },
      {
        id: 'cs-3',
        q: '计算机中负责运算和控制的核心部件是？',
        options: ['内存', '硬盘', '显卡', '中央处理器'],
        answer: 3,
        explain: '中央处理器也就是 CPU，负责运算和控制，常被比作计算机的大脑。'
      },
      {
        id: 'cs-4',
        q: '二进制数 1010 转换成十进制是多少？',
        options: ['8', '10', '12', '16'],
        answer: 1,
        explain: '按位展开：1×8 + 0×4 + 1×2 + 0×1 = 10。'
      },
      {
        id: 'cs-5',
        q: '断电后数据会全部丢失的存储器是？',
        options: ['内存', '硬盘', 'U 盘', '光盘'],
        answer: 0,
        explain: '内存断电就会清空，所以没保存的文档一断电就没了；硬盘、U 盘、光盘属于外存，可以长期保存。'
      },
      {
        id: 'cs-6',
        q: '一个字节（Byte）由多少位（bit）组成？',
        options: ['4 位', '8 位', '16 位', '32 位'],
        answer: 1,
        explain: '1 Byte = 8 bit，这是计算机存储最基本的换算关系。'
      },
      {
        id: 'cs-7',
        q: 'IPv4 地址由多少位二进制数组成？',
        options: ['16 位', '32 位', '64 位', '128 位'],
        answer: 1,
        explain: 'IPv4 是 32 位，习惯写成四组十进制数；128 位的是 IPv6。'
      },
      {
        id: 'cs-8',
        q: '负责网页样式呈现的技术是？',
        options: ['HTML', 'CSS', 'JavaScript', 'SQL'],
        answer: 1,
        explain: 'HTML 管结构、CSS 管样式、JavaScript 管交互，三者分工明确。'
      },
      {
        id: 'cs-9',
        q: '下列哪一个是关系型数据库？',
        options: ['MySQL', 'Redis', 'MongoDB', 'Nginx'],
        answer: 0,
        explain: 'MySQL 用二维表格存数据，是关系型数据库；Redis 是键值缓存，MongoDB 是文档数据库，Nginx 是服务器软件。'
      },
      {
        id: 'cs-10',
        q: '十进制数 255 转换成二进制是多少？',
        options: ['11111111', '10000000', '11111110', '10101010'],
        answer: 0,
        explain: '八个 1 相加正好是 255，这也是一个字节能表示的最大无符号整数。'
      },
      {
        id: 'cs-11',
        q: 'HTTPS 相比 HTTP 主要增加了什么？',
        options: ['网页压缩', '浏览器缓存', '传输加密', '多语言支持'],
        answer: 2,
        explain: 'HTTPS 在 HTTP 之下加了一层 TLS 加密，数据在传输途中不容易被窃听或篡改。'
      },
      {
        id: 'cs-12',
        q: '下列哪种做法最有助于防止计算机病毒？',
        options: ['关掉系统防火墙', '下载来源不明的软件', '不安装杀毒软件', '及时安装系统安全更新'],
        answer: 3,
        explain: '及时打补丁能堵住已知漏洞，是成本最低也最有效的防护手段。'
      },
      {
        id: 'cs-13',
        q: '在程序设计中，变量的作用是？',
        options: ['编译代码', '显示图像', '存储可变的数据', '连接网络'],
        answer: 2,
        explain: '变量是一块带名字的存储空间，程序运行过程中它的值可以改变。'
      },
      {
        id: 'cs-14',
        q: '域名 www.example.com 中的顶级域名是？',
        options: ['www', 'example', 'com', '以上都不是'],
        answer: 2,
        explain: '域名从右往左依次是顶级域名、二级域名、主机名，所以顶级域名是 com。'
      },
      {
        id: 'cs-15',
        q: '下列哪一项属于操作系统？',
        options: ['Word', 'Excel', 'Chrome', 'Windows'],
        answer: 3,
        explain: 'Windows 是操作系统，其余三个都是安装在操作系统之上的应用软件。'
      }
    ]
  },
  {
    key: 'safety',
    name: '校园安全',
    emoji: '🛡️',
    desc: '宿舍消防、防诈骗、急救与出行安全',
    time: '约 4 分钟',
    questions: [
      {
        id: 'safety-1',
        q: '宿舍里禁止使用下列哪种电器？',
        options: ['手机充电器', '热得快等大功率电热器', '笔记本电脑', '台灯'],
        answer: 1,
        explain: '大功率电热器容易让线路过载引发火灾，是宿舍安全管理明令禁止的物品。'
      },
      {
        id: 'safety-2',
        q: '宿舍楼发生火灾，正确的逃生方式是？',
        options: ['乘电梯下楼', '回房间收拾行李', '用湿毛巾捂住口鼻低姿撤离', '从窗口跳下'],
        answer: 2,
        explain: '火灾时电梯可能断电或变成烟囱，湿毛巾可以过滤烟尘，低姿能避开上层的高温烟气。'
      },
      {
        id: 'safety-3',
        q: '接到陌生电话称你的账户涉嫌违法、需要把钱转到安全账户，应该怎么做？',
        options: ['挂断电话并通过官方渠道核实', '按对方要求立即转账', '把身份证号报给对方', '把短信验证码读给对方'],
        answer: 0,
        explain: '公检法机关不会通过电话办案，也不存在所谓的安全账户，这是典型的电信诈骗。'
      },
      {
        id: 'safety-4',
        q: '有人自称网购客服说订单异常要退款，并索要短信验证码，应该怎么做？',
        options: ['把验证码告诉他', '加对方微信私下处理', '提供银行卡密码', '拒绝并在官方 App 内核实'],
        answer: 3,
        explain: '验证码等同于一次性密码，客服永远不会向你索要，订单状态要以官方 App 里的显示为准。'
      },
      {
        id: 'safety-5',
        q: '在校内骑电动车，正确的做法是？',
        options: ['载着同学一起骑', '边骑边看手机', '佩戴头盔、限速行驶', '在人行道上快速穿行'],
        answer: 2,
        explain: '头部受伤是电动车事故中最严重的后果，头盔和限速是最直接的保护。'
      },
      {
        id: 'safety-6',
        q: '发现有人倒地且没有呼吸，第一步应该做什么？',
        options: ['先喂点水', '立即拨打 120 并大声呼救', '独自把人搬起来', '先拍照发朋友圈'],
        answer: 1,
        explain: '先呼救并拨打急救电话，同时请人取来附近的自动体外除颤器，比自行搬动伤者更安全。'
      },
      {
        id: 'safety-7',
        q: '使用灭火器扑救初起火灾时，喷射应该对准哪里？',
        options: ['火焰根部', '火焰上方', '浓烟位置', '物品周围的地面'],
        answer: 0,
        explain: '对准火焰根部才能切断燃烧，对着火苗上部喷只是浪费药剂。'
      },
      {
        id: 'safety-8',
        q: '宿舍最后一个离开的人应该做什么？',
        options: ['只关灯就走', '开着门通风', '把钥匙留在门上', '关闭电源并锁好门窗'],
        answer: 3,
        explain: '断电可以避免电器故障引发火灾，锁门可以防止财物丢失。'
      },
      {
        id: 'safety-9',
        q: '地震发生时人正在宿舍高层，应该怎么做？',
        options: ['立刻乘电梯下楼', '躲在承重墙角或桌下并保护头部', '站在窗边观察情况', '跑到阳台上等待救援'],
        answer: 1,
        explain: '强震时下楼和靠近窗户都最危险，就近躲避、保护好头颈是更稳妥的选择。'
      },
      {
        id: 'safety-10',
        q: '独自夜跑时最应该注意的是什么？',
        options: ['戴耳机把音量开到最大', '挑选偏僻安静的小路', '选光线好人多的路线并告诉同伴', '把手机留在宿舍'],
        answer: 2,
        explain: '让同伴知道你的路线和时间，是万一出事之后能被及时找到的前提。'
      },
      {
        id: 'safety-11',
        q: '收到"恭喜中奖，点击链接领取"的短信，应该怎么做？',
        options: ['不点击链接，直接删除', '马上点击链接填写信息', '回复自己的身份证号', '转发给同学让他们也领'],
        answer: 0,
        explain: '这类链接通常指向钓鱼页面，点击或转发都会把风险带给更多人。'
      },
      {
        id: 'safety-12',
        q: '关于校园贷，正确的认识是？',
        options: ['利率低，可以放心借', '只借一次没什么影响', '可以帮同学做担保', '门槛低但风险高，应当远离'],
        answer: 3,
        explain: '校园贷往往利率畸高、催收激进，一旦逾期会严重影响学业和个人征信。'
      },
      {
        id: 'safety-13',
        q: '收到短信验证码后，可以告诉别人吗？',
        options: ['可以，只是几位数字', '不可以，验证码等同于账号密码', '熟人问就可以说', '看金额大小决定'],
        answer: 1,
        explain: '验证码是验证你本人身份的最后一道关卡，任何情况下都不应该转告他人。'
      },
      {
        id: 'safety-14',
        q: '发现有人触电，第一步应该怎么做？',
        options: ['直接用手把人拉开', '往人身上浇水降温', '立即切断电源或用干燥木棍挑开电线', '先拍照留存现场'],
        answer: 2,
        explain: '触电时人体带电，直接用手去拉会让自己也触电，先断电才安全。'
      },
      {
        id: 'safety-15',
        q: '在食堂就餐后腹痛、呕吐，怀疑食物中毒，应该怎么做？',
        options: ['及时就医并保留可疑食物', '再吃点东西压一压', '自己吃止泻药硬扛', '不告诉任何人'],
        answer: 0,
        explain: '保留可疑食物有助于查明原因，及时就医能避免脱水等更严重的后果。'
      }
    ]
  },
  {
    key: 'cet',
    name: '四六级核心词',
    emoji: '📖',
    desc: '四级高频词义辨析，考前一练',
    time: '约 3 分钟',
    questions: [
      {
        id: 'cet-1',
        q: '单词 abandon 的意思是？',
        options: ['增加', '到达', '放弃', '借用'],
        answer: 2,
        explain: 'abandon 表示放弃、抛弃，是四级高频词。'
      },
      {
        id: 'cet-2',
        q: '单词 significant 的意思是？',
        options: ['重要的、显著的', '沉默的', '简单的', '相似的'],
        answer: 0,
        explain: 'significant 表示重要的、显著的；沉默的是 silent，相似的是 similar。'
      },
      {
        id: 'cet-3',
        q: '单词 curious 的意思是？',
        options: ['谨慎的', '客气的', '混乱的', '好奇的'],
        answer: 3,
        explain: 'curious 表示好奇的，名词形式是 curiosity。'
      },
      {
        id: 'cet-4',
        q: '单词 maintain 的意思是？',
        options: ['获得', '维持、保养', '抱怨', '破坏'],
        answer: 1,
        explain: 'maintain 表示维持、维护，常见搭配 maintain order（维持秩序）。'
      },
      {
        id: 'cet-5',
        q: '单词 efficient 的意思是？',
        options: ['充足的', '昂贵的', '高效的', '明显的'],
        answer: 2,
        explain: 'efficient 表示高效的，名词是 efficiency，注意不要和 effective（有效的）混淆。'
      },
      {
        id: 'cet-6',
        q: '单词 decrease 的意思是？',
        options: ['减少', '决定', '描述', '递交'],
        answer: 0,
        explain: 'decrease 表示减少，反义词是 increase。'
      },
      {
        id: 'cet-7',
        q: '单词 obvious 的意思是？',
        options: ['困难的', '乐观的', '冗长的', '明显的'],
        answer: 3,
        explain: 'obvious 表示明显的，副词 obviously 常用作句子状语。'
      },
      {
        id: 'cet-8',
        q: '单词 contribute 的意思是？',
        options: ['计算', '贡献、促成', '反对', '消耗'],
        answer: 1,
        explain: 'contribute 表示贡献，常见搭配 contribute to（促成、有助于）。'
      },
      {
        id: 'cet-9',
        q: '单词 essential 的意思是？',
        options: ['特别的', '昂贵的', '必不可少的', '短暂的'],
        answer: 2,
        explain: 'essential 表示必不可少的，和 necessary 意思接近。'
      },
      {
        id: 'cet-10',
        q: '单词 permanent 的意思是？',
        options: ['永久的', '部分的', '私人的', '迟钝的'],
        answer: 0,
        explain: 'permanent 表示永久的，反义词是 temporary（暂时的）。'
      },
      {
        id: 'cet-11',
        q: '单词 restrict 的意思是？',
        options: ['尊敬', '恢复', '拒绝', '限制'],
        answer: 3,
        explain: 'restrict 表示限制，名词形式是 restriction。'
      },
      {
        id: 'cet-12',
        q: '单词 consequence 的意思是？',
        options: ['顺序', '结果、后果', '会议', '目录'],
        answer: 1,
        explain: 'consequence 表示结果、后果，注意和 sequence（顺序）区分。'
      },
      {
        id: 'cet-13',
        q: '中文"环境"对应的英文单词是？',
        options: ['equipment', 'experiment', 'environment', 'entrance'],
        answer: 2,
        explain: 'environment 是环境；equipment 是设备，experiment 是实验，entrance 是入口。'
      },
      {
        id: 'cet-14',
        q: '中文"方法、途径"对应的英文单词是？',
        options: ['approach', 'arrival', 'approval', 'argument'],
        answer: 0,
        explain: 'approach 既能表示接近，也能表示方法、途径。'
      },
      {
        id: 'cet-15',
        q: '中文"代表、委派"对应的英文单词是？',
        options: ['decorate', 'decrease', 'dedicate', 'delegate'],
        answer: 3,
        explain: 'delegate 作名词是代表，作动词是委派；decorate 是装饰。'
      }
    ]
  }
];

/* 按 key 取题库 */
function findBank(key) {
  return BANKS.find(function (b) { return b.key === key; }) || null;
}

/* 题目总数 */
function totalQuestions() {
  return BANKS.reduce(function (sum, b) { return sum + b.questions.length; }, 0);
}

/* 通过题目编号反查它属于哪个题库，以及题目本身（错题本要用） */
function findQuestion(qid) {
  for (var i = 0; i < BANKS.length; i++) {
    var bank = BANKS[i];
    for (var j = 0; j < bank.questions.length; j++) {
      if (bank.questions[j].id === qid) {
        return { bank: bank, question: bank.questions[j] };
      }
    }
  }
  return null;
}
