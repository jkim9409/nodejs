// 프로미스의 여러 사용 방법에 대해 더 알아보자 .then () 의 사용
// 프로미스가 값을 반환하는경우 반환값은 항상 프로미스로 감싸져있다.
// 프로미스에는 resolve 라는 메써드(함수)가 존재한다.
// resolve 라는 함수는 다음과 같은 일을 한다.
// 객체가 생성되자마자 바로 resolve 형태를 띄운다
// const result1 = Promise.resolve('result1 resolved')
// 어떠헌 처리를 해주고 resolve 를 해준다.
// const result2 = new Promise((resolve) => resolve('result2 resolved'))

// 두개가 같은 코드라고 생각하자 
// result1.then((message) => { console.log(message)})
// result2.then((message) => { console.log(message)})


const firstPromise = Promise.resolve('First');
console.log(firstPromise)


//사용을 위해서 then 을 쓰는것이다. 
// 원하는return값 = promise객체.then(적용시킬함수명)
// 으로 일단 외우자.

firstPromise.then((promisevalue) => {
    console.log(promisevalue);
})


// 다음의 표기법과 같다
// console.log 라는 함수에 인자값을 주어 실행시키는대신 함수자체를 인자로 준 것이다.
// 그럼 알아서 promise 의 value 값을 넣은 후 리턴값을 반환한다.
firstPromise.then(console.log)


//또 다른 then 사용법을 알아보자

// 우선 increment 라는 함수를 정의하고
function increment(val) {
    return val + 1
}
// 프로미스를 만들어 fulfilled 됬을때 0 을 값으로 주게만든다
const CountPromise = Promise.resolve(0);
//0을 값으로 가진 프로미스가 increment 함수를 거치다가 console.log 함수를 거친다.
CountPromise.then(increment).then(increment).then(increment).then(console.log)

