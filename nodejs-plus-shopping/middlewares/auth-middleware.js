//토큰을 검증해야되니까 jwt 모듈을 불러오자!
const jwt = require('jsonwebtoken')
const user = require('../models/user')

//token 으로 뽑은 userId 를 DB 내에서 조회해야됨으로 user model 을 가져와야한다.
// mongoose 에선 잘 작동하던 참조를 sequelize 에 맞게 변환해 보자(참조하는 방식이 조금 다르다)
// const User = require("../models/user");

// sequelize에 맞게 변환되었다.
// const { User } = require("../models/index") 도 맞는 표현이지만 생략 가능하다.
const { User } = require('../models')

// 미들웨어의 기본 틀을 잘 기억하자
// next() 를 잘 써야 미들웨어 레벨에서 예외처리에 걸리지 않고 다음미들웨어까지 잘 넘어간다
// 이 미들웨어를 쓸 파일 i.e app.js 에다가 const authMiddleware = require('./middlewares/auth-middleware') 을 잘 호출하자
// 미들웨어가 async 로 구현되지 않았기 때문에 await 을 못쓴다. then() 사용법을 익히자!

module.exports = (req, res, next) => {
    // req중에 headerㄴ 라는 곳에있는 Authorization 키 안의 값을 가져올것이다.
    // 프론트앤드에서 대문자로 보내도 여기선 소문자로 변환된다.
    const { authorization } = req.headers

    // array 도 디스트럭쳐링이 가능하는 것을 잘 알고있자
    // 파이썬의 default 과 다르게 split 을 쓸때 ' '공백 값을 잘 넣어주자
    const [tokenType, token] = authorization.split(' ')

    if (tokenType !== 'Bearer') {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요',
        })
        // 토큰타입이 Bearer 가 아니면 return해서 next() 까지 못가게 하자
        return
    }
    //try,catch 를 잘 활용하자 try 안에있는 코드들이 실행하다가 error 가 발생하면
    // catch 에 있는 부분으로 넘어간다.
    try {
        // app.js 에 저장되어있는 키크릿키 값이 저장된 secretkey 를 그대로 쓸 수 없으니 문자열로 집적 쳐주자.
        // const decoded = jwt.verify(token,"1mysecretekey1");
        // console.log(decoded);
        // 위의 코드에서 decoded 에는 유저 아이디가 들어가있다. 뽑아서 사용하자
        const { userId } = jwt.verify(token, '1mysecretekey1')

        // 토큰을 발급한 후에 사용자가 탈퇴하거나 여러 일들이 있을 수 있으니 예외처리도 해주자.
        // const user = await User.findById(userId).exec();
        // if (!user) {
        // }

        //findOne 이랑 같다. 아이디는 고유하니까. 두개다 사용법을 익히자. exec() 도 빼먹지 말자
        // 다음코드는 awit 을 사용했기 때문에 에러를 일이킨다. then()을 사용하는방식으로 바꿔보자
        // const user = await User.findById(userId).exec();
        // console.log(user)
        // express 는 response 객체에 local 안에 우리가 편리하게 정보를 저장해 사용할수 있도록해준다
        // 이 미들웨어를 거치면 locals.user 안에 항상 사용자 정보가 저장되게끔 구현된것이다.
        // res.locals.user = user;

        // mongoose 에서는 잘 작동하는 코드이다. sequelize 에 맞게 변환해 볼것이다.
        // User.findById(userId).exec().then((user) => {
        //     res.locals.user = user;
        //     next();
        // });

        //sequelize 에 맞게 userId 를 찾는 코드를 만들어 보았다.
        //promise 를 반환한다는것이 중요
        User.findByPk(userId).then((user) => {
            res.locals.user = user
            next()
        })

        console.log('11111미들웨어를 잘 거처갑니다1.')
    } catch (error) {
        //위와 똑같이, 토큰 인증하다가 에러가 발생하면 에러메세지를 주자
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요',
        })
        // 토큰이 인증되지 않으면 return해서 next() 까지 못가게 하자
        return
    }
}
