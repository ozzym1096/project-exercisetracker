const Exercise_Model = require('../models/exercise');
const User_Model = require('../models/user');

const router = require('express').Router();

// next() is the error middleware
router.post("/new-user", (req, res, next) => {
  // req.body = {
  //   username: String
  // }
  let newUser = new User_Model(req.body);
  
  newUser.save((err, savedUser) => {
    if(err) {
      // MongoDB uniqueness error (no custom message)
      if(err.code == 11000) {
        // Pass to error middleware function
        return next({
          status: 400,
          message: 'username already taken'
        });
      } else {
        // Pass to error middleware function
        return next(err);
      }
    }
    
    res.json({
      username: savedUser.username,
      _id: savedUser._id
    });
  });
});

// {
//   userId: {
//     type: String,
//     ref: "Users"
//     required: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   duration: {
//     type: Number,
//     required: true
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   },
//   username: {
//     type: String,
//     ref: "Users"
//   }
// }
router.post("/add", (req, res, next) => {
  User_Model.findById(req.body.userId, (err, user) => {
    if(err) return next(err);
    
    if(!user) {
      return next({
        status: 400,
        message: 'unknown _id'
      })
    }
    
    // req.body = {
    //   userId,
    //   description,
    //   duration,
    //   date?
    // }
    let exercise = new Exercise_Model(req.body);
    exercise.username = user.username;
    exercise.duration = parseInt(exercise.duration, 10);
    if (!exercise.date) {
      exercise.date = Date.now()
    }
    
    exercise.save((err, savedDoc) => {
      if (err) return next(err);
      
      let savedExercise = savedDoc.toObject();
      delete savedExercise.__v;
      savedExercise._id = savedExercise.userId
      delete savedExercise.userId
      savedExercise.date = new Date(savedExercise.date).toDateString();
      savedExercise.duration = savedDoc.duration.toString();
      res.json(savedExercise);
    });
  });
});

// Exercise.userId is indexed
router.get("/log", (req, res, next) => {
 const query = req.query,
       reqId = query.userId,
       reqFrom = new Date(query.from),
       reqTo = new Date(query.to);
  
  Exercise_Model.find({
    userId: reqId,
    date: {
      $gt: reqFrom != "Invalid Date" ? reqFrom : 0,
      $lt: reqTo != "Invalid Date" ? reqTo: Date.now()
    }
  })
  .limit(parseInt(query.limit, 10))
  .exec((err, exercises) => {
    if (err) return next(err);
    
    if (!exercises) return next({
      status: 400,
      message: "userId not found"
    });
    
    res.json(exercises);
  })
});

router.get('/users', (req,res,next) => {
  User_Model.find((err, data) => {
    res.json(data)
  })
});

module.exports = router;