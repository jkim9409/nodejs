//Promise 프로미스는 비동기 처리를 동기로 처리할수 있게 돕는 객체이다.
// 프로미의 기본 형식은 다음과 같다. resolve와 
// const timePromise = new Promise((resolve,reject)) => {
//  setTimeoudt(()=>{
//   console.log('first');
//   reject('errormessage!!!'); // 리젝을 실행해주면 프로미스에서 에러가 발생한 것으로 간주한다.    
//}, 1000);
//});
// errorPromise.then(() = > {
//  console.log('second');
//  console.log('third');       
//}).catch((error) => {
//  console.log('에러가발생했습니다',error); // catch 는 에러처리를 안해줄거사면 생략 가능.
//});


const timerPrimise = new Promise((resolve,reject) => {
    //이곳에 정의된 함수를 executor 라고 한다. executor 은 resolve,와 reject 를 인자값으로 받는 함수이다.
    setTimeout(() => {
        console.log('first');
        resolve();
    },1000);
})
// 잘 resolve 되었으니 fullfilled promise 가 되었고. 위에 executor 이후의 함수가 진행
timerPrimise.then(() => {
    console.log('second');
    console.log('third');
});

// 프로미스 안에 에러가 생기면?

const errorPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        console.log('first!!')
        reject('this is Errormessage!!');
    },1000);
});
    //executor 에서 나온값으로 함수가 진행 되는데 console.log도 실행되고 에러의 값을 가지고 있다.
    errorPromise.then(()=> {
        console.log('Second');
        console.log('third');
    }).catch((error) => {
        console.log('에러가 발생했습니다.',error);
    });


