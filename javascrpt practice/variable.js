const price = 200000
console.log(`이신발의 가격은 ${price}원 입니다`) // 템플렛 리터럴 이라고 한다.
console.log(parseInt(7/2)) //몫를 반환하는 법.

//증감 연산자의 디테일

//preincre 같은 경우 count에 먼저 밦을 더하고 preincre 에 대입하고
let count = 1
const preincre = ++count

console.log(`preincre: ${preincre}, count: ${count}`)

//postincre 같은 경우 count를 postincre 에 대입하고 값을 더한다.
count = 1
const postincre = count++

console.log(`preincre: ${postincre}, count: ${count}`)

//대입연산자. 대입과 연산을 한번에 ! 파이썬이랑 문법이 동일하다.+= 와 -= 등등
count = 1
count += 1
console.log(`count: ${count}`)


//tyoeof

const test = 1
console.log(typeof test)

// key 참조
const person1 = {}
// person1.이름은 뭐지? = 'Jun'
// person1."이름은 뭐지?" = 'Jun' 두가지 다 안되지만
person1['이름은 뭐지?'] = 'Jun' // 이렇게 하면 된다.
console.log(person1)

//function
function getMyName() { return "준호"}

// 함수를 그냥 변수처럼 가져온것이다.. 실행되진않았다.
console.log(getMyName)
// 함수를 집적 실행 하려면 "()" 를 해줘야한다.
console.log(getMyName())

const getMyName2 = function getMyName999() { return '내이름!'}

//그냥 변수를 불러온것 (실행 x)
console.log(getMyName2)
// 함수를 집적 실행 
console.log(getMyName2())

///for in 과 for of 의 사용 (둘다 객체에는 사용 x, iterable 에만 사용가능)
const people = ['강승현', '홍길동', '김아무개']

// 원소를 반환하고
for (person of people) { console.log(person)}
// index. 즉 키를 반환한다. 
for (person in people) { console.log(person)}

// 참조할 수 없는 key가 있어도 undifined로 돌아가는것을 볼 수 있다. 
// 그러니 항상 예외처리에 주의하자.
function isAdult(customer) { return customer.age >= 19}

function orderBeer(customer) {
    if (isAdult(customer)){
        console.log('맥주나왔습니다'+ customer.name + '님');
    } else {
        console.log('나이 더 먹고오세요'+ customer.name + '님');
    }
}

const customers = [{name:'김준호',age:24},{height:180,weight:199}]

for (const customer of customers) {
    orderBeer(customer);
}

//화살표 함수 
//익명 함수 (함수 이름을 function sum () 이런식으로 지정하지 않음)
// 그대신 변수에 함수를 담아버렸다.
// 일회성으로 사용할 경우 이 방법으로 메모리 낭비를 줄일수있다. 
// 하지만 hoisting이 적용되지 않아서 함수의 호출 위치에따라 에라가 나올 수 있다. 
const sum1 = function(a,b) {
    return a+b
}

//기본 확살표 함수 
const sum2 = (a,b) => { return a + b };

//화살표함수 간결한 버전 (return 을 생략, 중괄호도 생략)
// 여러줄을 쓰고 싶으면 기본 버전으로 가야한다. 
const sum3 = (a,b) => a+b

//하나의 인자값을 쓸 경우 괄호가 생략 가능
const sum4 = a => a

console.log(sum1(4,6))
console.log(sum2(4,6))
console.log(sum3(4,6))
console.log(sum4(4))

//자바스크립트는 asnync(비동기) non-blocking 모델이다. 
// 다음과 같은 코드를 살펴보자.
// setTimeout("함수명",시간 in ms);
// 비동기이기때문에 다음 코드들이 실행된것을 볼수 있다.
function first() {
    console.log("First");
}

setTimeout(first,1000);
console.log("second")
console.log("third")


