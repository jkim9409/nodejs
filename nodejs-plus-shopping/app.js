// goods 페이지가 있는 이전 과제들과 이 과제를 합쳐보자
// passport.js 라는 라이브러리를 통해 로그인을 다시 구현해 보자
// joi validation 라이브러리를 사용해 회원가입 정보를 필터링해주자
// goods 기능들과 carts 기능들을 mongoose/mongoDB 로 먼저 구현해 보고 sequelize로 또 바꿔서 MySQL 을 사용하도록 구현해 보자
// 마지막엔 mongoose 를 지워도 잘 작동할수 있도록 해보자 !
// TCP 와 UDP의 차이점은 무엇일지 조사해보기
// Socket의 개념과 Web socket에대해서 조사해보기
const express = require("express");
const mongoose = require("mongoose");
//구현해놓은 유저 model 을 참조하기! (mongoose 를 사용할때 이런방식으로 했다)
// sequelize 를 사용하며 바뀐 코드로 대체하였다.
// const User = require("./models/user");

// sequelize 에서 제공하는 Op라는 객체를 참조할 것이다.
const { Op } = require("sequelize");


// 다음과 같은 코드에서 index는 생략 가능하다.
// const User = require("./models/index");
// index 를 통해 참조하지 않고 집적 참조할때 DB 연결 로직 등 귀찮은 점이 많아서 이렇게 참조한다.
const { User } = require("./models");


//jwt 모듈을 가져오는것을 잊지말자
const jwt = require("jsonwebtoken");

//auth미들웨어 참조하기
const authMiddleware = require("./middlewares/auth-middleware");
const secretkey = "1mysecretekey1"

// http인증방식중에 HTTP header에 토큰을 같이 넣어서 보내는 방법이있다. 예시를보면 Authorization 의 키에 토큰타입과 토큰을 쭉 나열하면 된다.
// Athorization: (토큰타입, ex Bearer) JWT토큰내용 
// 위와 같은 방식에있는 Bearer 은 지금은 안쓰이는 정석이 아닌 방법이라는것을 주의하자
// 사용자 인증 미들웨어를 구현하는 이유: 로그인이 필요한 모든기능에 붙히면 되기때문
// 미들웨어에는 받아온 토큰정보가 유효한지 확인해주는 기능이 필요하다. 


mongoose.connect("mongodb+srv://test:sparta@cluster0.j4z1z.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

//미들웨어를 지나치게하려면 url 주소 옆에 미들웨어를 적어준다
// auth미들웨어는 인증이 성공하면 res.locals.user 객체 안에 회원정보를 담아두게끔 구현되어있다. 
// 이제 우리는 미들웨어를 거쳐온 api 들은 그 정보를 믿고 쓸수있다. 
router.get("/users/me",authMiddleware,(req, res) => {
    
    const { user } = res.locals;
    
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
        }
    });
})




// 라우터에서 users 경로로 들어오는 POST API 콜을 받아준다. 
// 클라이언트에서 body에 전달해 주는 정보들은 nickname,email,password,confirmPassword 가 있는것을 개발자 콘솔로 확인 가능하다. 
// 그 정보들을 디스트럭쳐링을 통해 뽑아보자
//
router.post("/users", async(req,res) =>{

    const { nickname, email, password, confirmPassword} = req.body;

    // 실패할경우 프론트앤드에서 요청 한대로 에러메세지를 띄워주자! 
    // status code 400 이하의 값들은 클라이언트에서 성공으로 받아들인다. 
    if (password !== confirmPassword) {
        res.status(400).send({
            errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.',

        });
        // 다음코드 실행 방지를 위해 return 해주는것을 잊지말자! 핸들러에서 나가버리자
        return;
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
            [Op.or]: [{nickname},{email}],
        
        },
    });

    // existUser 의 값이 존재하면 그냥 에러를 주고 핸들러를 탈출하자!
    if (existUsers.length) {
        res.status(400).send({
            errorMessage:'이미 가입된 이메일 또는 닉네임이 있습니다.',
        });
        return;
    }

    // 이제는 사용자를 데이터 베이스에 저장 할 준비가 되었다. 
    // mongoose 를 이용할때 사용자를 생성하는 부분의 코드를 sequelize 에 맞게 바꿀 것이다. 
    // const user = new User({ email, nickname, password });
    

    // sequelize 에서 제공하는 기능인데, 비동기 함수이기 떄문에 await을 붙혀준다는것을 기억
    // user 라는객체를 만들어서 .save() 하는 방식이 아니기 때문에 다음과 같이 사용한다. 
    await User.create({ email, nickname, password });


    // await 쓰는것을 주의
    await User.save();
    // 그냥 send 하면 기본적으로 stauts 200 을 주기때문에 성공을 암시하지만
    // REST API 원칙에 따라 201 을 반환해주면 created 성공을 암시해줄수있다
    res.status(201).send({});
    // 우리는 여기서 비밀번호를 암호화 없이 그냥 저장했다.
    // 실무에선 절대 쓰이지 않는 방법이다.
    // 단방향 해쉬를 이용해서 키와 함께 암호화를 해서 자저장을 해서 사용해야한다. 

});

// 로그인 API 의 구현.기본적으로 POST 방식으로 한다. 왜냐하면 1. body에 토큰정보를 실어 해더로 주는것보다 보안에 좋고
// 2. 토큰이 그때그때 생성되므로 post 사 더 적합하다. 
// auth 경로로 들어오는 post api 를 만들어보자 

router.post("/auth", async (req,res) => {
    const { email, password } = req.body;

    //User.find 도 가능하다. exec() 은 왜쓰는지 모르겠다. 
    // mogoose 에서는 잘 작동하지만 sequelize 에서는 findOne 함수는 있지만 다르게 표현한다. 
    // const user = await User.findOne({ email, password }).exec();

    // mongoose 에서 잘 작동하는 코드를 sequelize 에 맞게 변환 해 보자. 
    const user = await User.findOne({ where: { email, password } });

    if (user.length < 1) {
        // if(!user) 도 가능하다.
        // 만약 유저가 없다면,// error code 400 도있지만 인증실패를 암시하는 401 을 넘겨주자!
        
        // 무엇이 잘못된것인지 디테일한 정보는 주지 말자 
        res.status(401).send({ errorMessage: "일치하지 않는 로그인 정보입니다."});
        return
    }

    //유저아이디를 JWT토큰에 담아서 사인을 해서 내려준다 준다
    // sign 을 해야 토큰을 가져올수 있다. 
    const token = jwt.sign({ userId: user.userId}, secretkey);

    //프론트앤드에서 token 이라는 키에 다가 반환을 해면 작동하도록 구현되어있다.
    // token : token 을 구지 명시해 주지 않아도 된다.
    res.send({
        token,
    })
    
    
});


app.use("/api", express.urlencoded({ extended: false }), router);
app.use(express.static("assets"));

app.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});