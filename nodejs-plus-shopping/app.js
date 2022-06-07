// goods 페이지가 있는 이전 과제들과 이 과제를 합쳐보자
// passport.js 라는 라이브러리를 통해 로그인을 다시 구현해 보자
// joi validation 라이브러리를 사용해 회원가입 정보를 필터링해주자
// goods 기능들과 carts 기능들을 mongoose/mongoDB 로 먼저 구현해 보고 sequelize로 또 바꿔서 MySQL 을 사용하도록 구현해 보자
// 마지막엔 mongoose 를 지워도 잘 작동할수 있도록 해보자 !
// TCP 와 UDP의 차이점은 무엇일지 조사해보기
// Socket의 개념과 Web socket에대해서 조사해보기
// socket을 이용해서 쇼핑몰 실시간 구매알림 구현해보기
// 실시간 카운터 기능 구현 (CHANGED_PAGE 이벤트) (socket.on()사용)
// SAME_PAGE_VIEWER_COUNT 이벤트에 2 이상인 값을 보내면서 상세 페이지에서
// 총 n 명이 이 상품을 구경하고 있습니다. 라는 문구 표현 (io.emit() 이나 브로드케스트 사용)
// socket.on("CHANGED_PAGE",(data) => {
//  console.log("페이지기바뀌었어요",data,socket.id);
//})
// 위에서 보면 socket.id 는 소켓마다 고유한 아이디를 뽑을수 있다.(연결이 끊어지면 사라짐)

// "BUY_GOODS" 이벤트시 :
// {
// 	nickname: '서버가 보내준 구매자 닉네임',
// 	goodsId: 10, // 서버가 보내준 상품 데이터 고유 ID
// 	goodsName: '서버가 보내준 구매자가 구매한 상품 이름',
// 	date: '서버가 보내준 구매 일시'
// }
// "BUY"이벤트 시
// {
// 	nickname: '로그인한 사용자 닉네임',
// 	goodsId: 10, // 로그인한 사용자가 구매한 상품 고유 ID
// 	goodsName: '로그인한 사용자가 구매한 상품 이름',
// }
const express = require('express')
const mongoose = require('mongoose')
//구현해놓은 유저 model 을 참조하기! (mongoose 를 사용할때 이런방식으로 했다)
// sequelize 를 사용하며 바뀐 코드로 대체하였다.
// const User = require("./models/user");

//http 와 socketio 모듈을 불러온다
const Http = require('http')
const socketIo = require('socket.io')

// sequelize 에서 제공하는 Op라는 객체를 참조할 것이다.
const { Op } = require('sequelize')

// 다음과 같은 코드에서 index는 생략 가능하다.
// const User = require("./models/index");
// index 를 통해 참조하지 않고 집적 참조할때 DB 연결 로직 등 귀찮은 점이 많아서 이렇게 참조한다.
const { User } = require('./models')

//jwt 모듈을 가져오는것을 잊지말자
const jwt = require('jsonwebtoken')

//auth미들웨어 참조하기
const authMiddleware = require('./middlewares/auth-middleware')
const secretkey = '1mysecretekey1'

// http인증방식중에 HTTP header에 토큰을 같이 넣어서 보내는 방법이있다. 예시를보면 Authorization 의 키에 토큰타입과 토큰을 쭉 나열하면 된다.
// Athorization: (토큰타입, ex Bearer) JWT토큰내용
// 위와 같은 방식에있는 Bearer 은 지금은 안쓰이는 정석이 아닌 방법이라는것을 주의하자
// 사용자 인증 미들웨어를 구현하는 이유: 로그인이 필요한 모든기능에 붙히면 되기때문
// 미들웨어에는 받아온 토큰정보가 유효한지 확인해주는 기능이 필요하다.

mongoose.connect(
    'mongodb+srv://test:sparta@cluster0.j4z1z.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

const app = express()

//소켓을 사용하기 위해 기존 app서버 위에 https 서버를 구축한다
// 기존 app서버또한 http 모듈을 상속한 express로 만들었기 때문에 같이 사용할수있다.
// wrapping 을 했다고 생각하자.
const http = Http.createServer(app)
// cors 처리가 필요없다. 왜냐하면 모든 asset 파일들을 statics 미들웨어로
// express를 통해서 제공하고 있기때문에 내 서버에 소켓io를 연결하고있기때문
// 즉 요청하는 서버와 나의 도메인이 다르지 않다
const io = socketIo(http)

const router = express.Router()

io.on('connection', (socket) => {
    console.log('누군가 연결했어요!')

    //커스텀이벤트를 소켓에 담아서 보내줘 보자. 프론트앤드에서 요청한 형식대로!
    // 하지만 BUY 라는 이벤트가 있을 때에만 보내줘야 된다. 그에 맞는 데이터를 보내줘야한다.
    // 그러니 다른곳에 들어가야 하는 코드이다.
    // socket.emit("BUY_GOODS", {
    //     nickname: '서버가 보내준 구매자 닉네임',
    //     goodsId: 10, // 서버가 보내준 상품 데이터 고유 ID
    //     goodsName: '서버가 보내준 구매자가 구매한 상품 이름',
    //     date: '서버가 보내준 구매 일시'
    // });

    //BUY 라는 이벤트에 반응 할 준비를 해야한다
    // new Date() 이벤트의 시간을 객체로 만들어서 반환 해 줄수 있다.
    // socket.on("BUY", (data) => {
    //     console.log("클라이언트가 구매한 데이터", data, new Date().toISOString());
    // });
    socket.on('BUY', (data) => {
        const payload = {
            nickname: data.nickname,
            goodsId: data.goodsId,
            goodsName: data.goodsName,
            date: new Date().toISOString(),
        }
        console.log('클라이언트가 구매한 데이터', data, new Date())

        //이제 모든 유저들한테 보낼것인데 socket.~~~ 대신 io.~~~을 사용할 것이다
        // 관리자는 BUY_GOODS 이벤트를 보내고 그에맞는 data들을 보낼것이다.
        // BUY 이벤트를 만든 사람 본인한테도 보내질 것이다.
        // io.emit("BUY_GOODS", payload);

        //본인의 소켓은 제외하고 모두에게 데이터를 전달하는 방법이있다.
        socket.broadcast.emit('BUY_GOODS', payload)
    })

    // 누군가 연결을 끊었을 때도 알수 있다. 이또한 리스너 이다.
    socket.on('disconnect', () => {
        console.log('누군가 연결을 끊었어요.!')
    })
})

//미들웨어를 지나치게하려면 url 주소 옆에 미들웨어를 적어준다
// auth미들웨어는 인증이 성공하면 res.locals.user 객체 안에 회원정보를 담아두게끔 구현되어있다.
// 이제 우리는 미들웨어를 거쳐온 api 들은 그 정보를 믿고 쓸수있다.
router.get('/users/me', authMiddleware, (req, res) => {
    const { user } = res.locals

    // 클라이언트에서 원하는대로 응답을 해주면 된다.
    // 이 경우 클라이언트 가 원하는 user객체를 포함시키는 객채를 이미 가지고 있으므로
    // 다음과 같이 간결하게 전부 응답해줄수 있지만. pw 도 포함시키기도 하고, 그냥 원하는대로 주자
    // res.send({
    //     user
    // })

    res.send({
        user: {
            email: user.email,
            nickname: user.nickname,
        },
    })
})

// 라우터에서 users 경로로 들어오는 POST API 콜을 받아준다.
// 클라이언트에서 body에 전달해 주는 정보들은 nickname,email,password,confirmPassword 가 있는것을 개발자 콘솔로 확인 가능하다.
// 그 정보들을 디스트럭쳐링을 통해 뽑아보자
//
router.post('/users', async (req, res) => {
    const { nickname, email, password, confirmPassword } = req.body

    // 실패할경우 프론트앤드에서 요청 한대로 에러메세d지를 띄워주자!
    // status code 400 이하의 값들은 클라이언트에서 성공으로 받아들인다.
    if (password !== confirmPassword) {
        res.status(400).send({
            errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.',
        })
        // 다음코드 실행 방지를 위해 return 해주는것을 잊지말자! 핸들러에서 나가버리자
        return
    }
    // 이메일이나 닉네임, 둘중 하나라도 데이터 베이스에 이미 있는지 확인하자.
    // 이메일이 존재하는지 닉네임이 존재하는지 구체적으로 응답주는것은 보안적으로 좋지않다.
    // find 들 쓰든 findOne 을 쓰든 상관 없다.
    // mongoose 에서만 사용가능한 코드를 sequelize 가 쓸수 있게 바꿔보겠다.
    // const existUsers = await User.find({
    //     $or:[{ email }, { nickname }],
    // });

    // sequelize 가 제공하는 Op 객체를 가져오고, sequelize의 표현식을 통해 같은기능을 구현한 것이다.
    const existUsers = await User.findAll({
        where: {
            [Op.or]: [{ nickname }, { email }],
        },
    })

    // existUser 의 값이 존재하면 그냥 에러를 주고 핸들러를 탈출하자!
    if (existUsers.length) {
        res.status(400).send({
            errorMessage: '이미 가입된 이메일 또는 닉네임이 있습니다.',
        })
        return
    }

    // 이제는 사용자를 데이터 베이스에 저장 할 준비가 되었다.
    // mongoose 를 이용할때 사용자를 생성하는 부분의 코드를 sequelize 에 맞게 바꿀 것이다.
    // const user = new User({ email, nickname, password });

    // sequelize 에서 제공하는 기능인데, 비동기 함수이기 떄문에 await을 붙혀준다는것을 기억
    // user 라는객체를 만들어서 .save() 하는 방식이 아니기 때문에 다음과 같이 사용한다.
    await User.create({ email, nickname, password })

    // await 쓰는것을 주의
    await User.save()
    // 그냥 send 하면 기본적으로 stauts 200 을 주기때문에 성공을 암시하지만
    // REST API 원칙에 따라 201 을 반환해주면 created 성공을 암시해줄수있다
    res.status(201).send({})
    // 우리는 여기서 비밀번호를 암호화 없이 그냥 저장했다.
    // 실무에선 절대 쓰이지 않는 방법이다.
    // 단방향 해쉬를 이용해서 키와 함께 암호화를 해서 자저장을 해서 사용해야한다.
})

// 로그인 API 의 구현.기본적으로 POST 방식으로 한다. 왜냐하면 1. body에 토큰정보를 실어 해더로 주는것보다 보안에 좋고
// 2. 토큰이 그때그때 생성되므로 post 사 더 적합하다.
// auth 경로로 들어오는 post api 를 만들어보자

router.post('/auth', async (req, res) => {
    const { email, password } = req.body

    //User.find 도 가능하다. exec() 은 왜쓰는지 모르겠다.
    // mogoose 에서는 잘 작동하지만 sequelize 에서는 findOne 함수는 있지만 다르게 표현한다.
    // const user = await User.findOne({ email, password }).exec();

    // mongoose 에서 잘 작동하는 코드를 sequelize 에 맞게 변환 해 보자.
    const user = await User.findOne({ where: { email, password } })

    if (user.length < 1) {
        // if(!user) 도 가능하다.
        // 만약 유저가 없다면,// error code 400 도있지만 인증실패를 암시하는 401 을 넘겨주자!

        // 무엇이 잘못된것인지 디테일한 정보는 주지 말자
        res.status(401).send({
            errorMessage: '일치하지 않는 로그인 정보입니다.',
        })
        return
    }

    //유저아이디를 JWT토큰에 담아서 사인을 해서 내려준다 준다
    // sign 을 해야 토큰을 가져올수 있다.
    const token = jwt.sign({ userId: user.userId }, secretkey)

    //프론트앤드에서 token 이라는 키에 다가 반환을 해면 작동하도록 구현되어있다.
    // token : token 을 구지 명시해 주지 않아도 된다.
    res.send({
        token,
    })
})

app.use('/api', express.urlencoded({ extended: false }), router)
app.use(express.static('assets'))

// app으로 서버를 키지 않고 소켓을 사용할 때는 http로 서버를 켜야하니 잠시 꺼두자
// app.listen(8080, () => {
//   console.log("서버가 요청을 받을 준비가 됐어요");
// });

// http로 서버를 켜준다!
http.listen(8080, () => {
    console.log('서버가 요청을 받을 준비가 됐어요')
})
