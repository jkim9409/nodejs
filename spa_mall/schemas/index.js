const mongoose = require("mongoose");

const connect = () => {
    mongoose.connect("mongodb+srv://test:sparta@cluster0.j4z1z.mongodb.net/?retryWrites=true&w=majority", {ignoreUndefined: true}).catch((err) => {
        console.error(err);
    });

    // mongoose.connect("mongodb+srv://test:sparta@cluster0.j4z1z.mongodb.net/?retryWrites=true&w=majority",{useUnifiedToplogy: true, useNewUrlParser: true});
};

module.exports = connect;
