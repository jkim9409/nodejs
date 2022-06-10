// 비동기함수 (Async Function)
// 결과값은 항상 Promise 객체로 resolve 된다
// 비동기 함수 안에서는 await 을 사용할수 있다.(사용해야한다?)
// 아래 네가지 방법 모두 프로미스를 결과값으로 준다. 
//
//
// async await 과 Promise.resolve() 의 차이는 
// new Promise(executor) 코드로 프로미스를 생성하면 executor 가 바로 실행되지만 
// async await 은 함수가 실행되기 전까지는 프로미스가 생성되지 않는다.


async function add(val1,val2){
    return val1+val2
}


addfunction1 = async function(val1,val2) {
    return val1+val2
}

addfunction2 = async (val1,val2) => val1+val2

function regularadd(val1,val2) {
    return Promise.resolve(val1+val2);
}

let val1 = 1
let val2 = 2
console.log(add(val1,val2))
console.log(addfunction1(val1,val2))
console.log(addfunction2(val1,val2))
console.log(regularadd(val1,val2))

// await 연산자를 사용하면 Promise 가 fullfilled 되거나 rejected 될때까지 
// 함수의 실행을 중단하고 기다릴수 있다. Promise 연산이 끝나면 함수에서 반환값을 얻는다
// const result = await 값 
// 형식으로 사용하자

async function getMyname(text) {return text}

console.log(getMyname('김준호'))

// 이코드가 강의에선 돌아가는데.. 난 왜 안돌아가지 그냥 '김준호'를리턴받기.
// await (getMyname('김준호'))

//.then을 사용하려면
prom2 = getMyname('김준호')
prom2.then((name)=>console.log(name))

// async function asyncaddfunction1(val1,val2) {
//     return val1 + val2

// }

// sum = await asyncaddfunction1(val1,val2)
// console.log(sum)

// async function asyncaddfunction2(val1,val2) {
//     return val1 + val2
// }

// await 'test' 
// 결과값이 'test' 가 나와야되는데 에러가 나온다.