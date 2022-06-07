
const express = require("express");
const mongoose = require("mongoose");
const Comment = require("./models/comment");
const Post = require("./models/post");

mongoose.connect("mongodb+srv://test:sparta@cluster0.j4z1z.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const app = express();
const router = express.Router();

//body로 들어오는 json 으로 편하게 읽게 해줌 (body-parser 모듈 대신 사용)
app.use(express.json());


// 1. 전체 게시글 목록 조회 (get, /posts)
//     - 제목, 작성자명, 작성 날짜를 조회하기
//     - 작성 날짜 기준으로 내림차순 정렬하기

router.get("/posts", async (req, res) => {
    
    const posts = await Post.find().sort("-date").exec();
    console.log(posts)
    res.send({ posts });
    
  });

//   2. 게시글 작성(post,"/posts)
//   - 제목, 작성자명, 작성 내용을 입력하기

router.post("/posts", async (req, res) => {

    const { title, author, postBody } = req.body;
    date = new Date().toISOString()
    
    const post = new Post({title,author,postBody,date})
    await post.save();
    
    res.send({success:"게시글이 성공적으로 등록 되었습니다."});
    
    
    
  });



//   3. 게시글 조회(get"/posts/:postId")
//   - 제목, 작성자명, 작성 날짜, 작성 내용을 조회하기
router.get("/posts/:postId", async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId).exec();

    if (post.length < 1) {
        res.status(400).send({ errorMessage:"원하시는 게시물 정보가 없습니다."});
        return
    }

    
    
    res.send({ post });


  });


//   4. 게시글 수정(patch,"/posts/:postId")
//   - 제목, 작성자명, 작성 내용 중 원하는 내용을 수정하기

router.patch("/posts/:postId", async (req, res) => {
    const { postId } = req.params;
    const { title, author, postBody } = req.body;
    
    const post = await Post.findById(postId).exec();

    if (title){
        post.title = title;
    } else if (author){
        post.author = author;

    } else if (postBody){
        post.postBody = postBody;
    }

    await post.save();

    res.send("게시글이 성공적으로 수정되었습니다.");
    
    
  });


//   5. 게시글 삭제(delete,"/posts/:postId")
//   - 원하는 게시물을 삭제하기


router.delete("/posts/:postId", async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId).exec();

    await post.delete();
    
    res.send({success:"게시글이 삭제되었습니다."});
    
    
  });


//   6. 댓글 목록 조회(get, "/posts/:postId/comments")
//   - 조회하는 게시글에 작성된 모든 댓글을 목록 형식으로 볼 수 있도록 하기
router.get("/posts/:postId/comments", async (req, res) => {
    const { postId } = req.params;

    const comments = await Comment.find({postId}).exec();


    
    res.send({ comments });
 
  });

//   7. 댓글 작성(post,"/posts/:postId/comments")
//   - 댓글 내용을 비워둔 채 댓글 작성 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
//   - 댓글 내용을 입력하고 댓글 작성 API를 호출한 경우 작성한 댓글을 추가하기
router.post("/posts/:postId/comments", async (req, res) => {

    const { postId } = req.params;
    const { author, commentBody } = req.body;

    if (!commentBody){
        res.send("댓글 내용을 입력해주세요");
        return
    }

    const date = new Date().toISOString();
    
    const comment = new Comment({postId,author,commentBody,date});
    await comment.save();

    res.send({success:"댓글이 성공적으로 남겨졌습니다."});
    
    
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////
//   8. 댓글 수정((post,"/posts/:postId/comments/commentId")
//   - 댓글 내용을 비워둔 채 댓글 수정 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
//   - 댓글 내용을 입력하고 댓글 수정 API를 호출한 경우 작성한 댓글을 수정하기

router.patch("/posts/:postId/comments/:commentId", async (req, res) => {
    const { postId, commentId } = req.params;
    const { commentBody } = req.body;
    const comment = await Comment.findById(commentId).exec();

    if (!commentBody) {
        res.send("댓글 내용을 입력해 주세요")
        return
    }
    comment.commentBody = commentBody;    
    
    await comment.save();
    res.send("댓글 내용 수정이 완료되었습니다.");
  });



//   9. 댓글 삭제(delete,"/posts/:postId/comments/commentId")
//   - 원하는 댓글을 삭제하기
router.delete("/posts/:postId/comments/:commentId", async (req, res) => {
    const { postId, commentId } = req.params;

    const comment = await Comment.findById(commentId).exec();

    await comment.delete()
    
    res.send("댓글이 성공적으로 삭제되었습니다.");
    
    
  });  







// 결론은 expree.json(), express.urlencoded() 두가지를 항상 붙혀서 사용하자.(둘다필요)
// x-www-form-urlencoded형태의 데이터를 해석해준다
app.use("/api", express.urlencoded({ extended: false }), router);
//body로 들어오는 json 으로 편하게 읽게 해줌 (body-parser 모듈 대신 사용)
// JSON형태의 데이터를 해석해준다.
app.use(express.json());
// raw 와 text 타입도 해석하고 싶으면 body-parser 모듈을 사용하자.


app.listen(3000, () => {
    console.log("서버가 켜졌습니다.");
});