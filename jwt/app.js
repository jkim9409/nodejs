const jwt = require("jsonwebtoken");

// token을 만들때는 꼭 secrete key 를 넣어줘야한다(노출되면 안됨)!. 이 예시에서는 my-secrete-key가 시크릿키다. 
// 시크릿 키는 복잡하게 만들수록 좋다!
// 토큰 발급은 서버에서만 가능하다
// 오픈소스로 개발하다가 secrete key 를 노출할 경우 큰일날수 있으니 두번세번 주의하자!
const token = jwt.sign({test: true },'my-secrete-key');
console.log(token);

// 디코딩 하는법 (스키릿키 필요없이 단순히 데이터만 까서 볼수 있다.)
// 서버가 아니라도 어디서도 볼수 있다. 
// 클라이언트에서 토큰을 받아서 로컬스토리지/세션스토리지 등에 저장해 놓고 쓸수있다.
// 추가적으로 토큰값을 조금 변조해서 코드를 돌려도 에러 없이 data를 볼수 있다. 
const decoded1 = jwt.decode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0Ijp0cnVlLCJpYXQiOjE2NTQ0MjM1OTJ9.ZV8c94SEWgY6d_EZXMpH4SeoA3_FpAwxg8X5Dr8HctU");

//변조된 token 값
const decoded2 = jwt.decode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0Ijp0cnVlLCJpYXQiOjE2NTQ0MjM1OTJ9.ZV8c94SEWgY6d_EZXMpH4SeoA3_FpAwxg8X5Dr8HaaaactU");

console.log(decoded1); 
console.log(decoded2); 


// 스키릿키 필요없이 단순히 데이터만 까서 볼수 있지만 지금은 시크릿 키까지 넣어서 유효한지 아닌지도 같이검사한다
// 토큰 값을 조금 바꿔서 실행해보면 에러가난다. (invalid signature)
// 검증하는것은 서버에서만 할 수 있다. 
const verified = jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0Ijp0cnVlLCJpYXQiOjE2NTQ0MjM1OTJ9.ZV8c94SEWgY6d_EZXMpH4SeoA3_FpAwxg8X5Dr8HctU",'my-secrete-key');

console.log(verified); 