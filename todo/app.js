const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Todo = require("./models/todo")
// const mongoose = require("mongoose");

//joi 라는 모듈을 사용하면 validation 을 쉽게 할 수 있다. (schema 하나에 조건들과 에러처리등을 만들어 두고 잘 돌려쓸수있다.)

mongoose.connect("mongodb+srv://test:sparta@cluster0.j4z1z.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hi!");
  
  
});

router.get("/todos",async(req,res) => {
    const todos = await Todo.find().sort("-order").exec();
    res.send({ todos });
})


router.post("/todos", async(req, res) => {
    const { value } = req.body;
    //오름차순으로 정렬 , -를 붙혀서 내림차순으로 정렬
    const maxOrderTodo = await Todo.findOne().sort("-order").exec();
    
    
    let order = 1;

    if (maxOrderTodo) {
        order = maxOrderTodo.order + 1;
    }

    const todo = new Todo({value, order});
    await todo.save();
    res.send({todo});

});

router.patch("/todos/:todoId", async (req,res) => {
    const { todoId } = req.params;
    const { order, value, done } = req.body;

    const todo = await Todo.findById(todoId).exec();

    if (order) {
        const targetTodo = await Todo.findOne({order}).exec();
        if (targetTodo){
            targetTodo.order = todo.order;
            await targetTodo.save()
        }
        todo.order = order;
        await todo.save()
            
    } else if (value) {
        todo.value = value;
    } else if (done !== undefined) {
        todo.doneAt = done ? new Date() : null;
    }

    await todo.save();
    

    res.send({});
});

router.delete("/todos/:todoId", async (req,res) => {
    const { todoId } = req.params;

    const todo = await Todo.findById(todoId).exec();
    await todo.delete();


    res.send({});
});

app.use("/api", bodyParser.json(), router);
app.use(express.static("./assets"));

app.listen(8080, () => {
  console.log("서버가 켜졌어요!");
});



// 심화 1주차 내용들이 중요하다 !
// async await 은 error 가 안나와서 try % catch 문을 사용해라!
// promise then /catch 에서는 catch 가 없으면 error 안잡고 서버가 죽는다.