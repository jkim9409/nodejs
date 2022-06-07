const express = require("express");
const res = require("express/lib/response");


// nodejs 에서 기본으로 제공하는 웹 서버 module로 express와 socketio 를 둘다
// 포함해서 실행 시킬 수 있게 해준다.
// express 의 부모 같은 느낌이다. (http 모듈을 상속 받는다)
const Http = require("http");

//소켓 모듈 불러오기
const soketIo = require("socket.io");
//socketIo 서버를 3000 포트로 열기
// const io = soketIo(3000);

// socketIo 서버를 열고, cors 문제까지 해결해주기.
// origin 이 어떤 도메인이든 모든 get 과 post 요청 허용해주기
// index.html 을 열어서 개발자 콘솔을 켜면 에러가 안나는 것을 볼 수 있다. 
// const io = soketIo(3000, {
//     cors: {
//         orgin: "*",
//         methods: ["GET","POST"]
//     },
// });

// 이제 expree, http 그리고 socketio를 통합해서 하나의 서버를 만들어보자
// 모든것을 합쳐주는 기반은 http 서버라는것을 잘 알고있자 (http 서버를 express서버를 인자로 받아서 생성,및 합칠수 있다)
// 다 된후에 http 서버를 listen으로 켜주는것 을 잊지말자.
const app = express();
const http = Http.createServer(app);

const io = soketIo(http, {
    cors: {
        orgin: "*",
        methods: ["GET","POST"]
    },
});
http.listen(3000,() => {
    console.log("서버가 켜졌습니다.");
});

app.get("/test",(req,res) => {
    res.send("익스프레스 잘 켜져있습니다.")
});


// 연결요청이 올때마다 서버에서 소켓을 하나씩 분배 해 준다고 생각하면 된다
// 연결이 끊기면 그 소켓을 다시 서버에서 어딘가로 가져간다.
io.on("connection", (socket) => {
    console.log("연결이 되었습니다.")
    //프론트앤드 data 안에 내가 보낸 "hello "가 실리게 된다
    //프론트앤드에는 "message 안에 " data 를 콘솔에 찍어주는 코드가 있다.
    //send 는 항상 "message" 이벤트 핸들러로 간다.
    socket.send("Hello");

    //emit 을 사용하면 커스텀 이벤트를 만들수 있다.
    //customEventName 안에 데이터를 실어 보낸다.
    // 개발자 콘솔에서 확인해보자
    socket.emit("customEventName","새로운 이벤트인가?")

})

