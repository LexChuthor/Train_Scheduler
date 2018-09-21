// Initialize Firebase
var config = {
  apiKey: "AIzaSyAK5-sSoE0ExYH5X2D0ga1QG06RDNa3wt0",
  authDomain: "train-scheduler-homework-e826e.firebaseapp.com",
  databaseURL: "https://train-scheduler-homework-e826e.firebaseio.com",
  projectId: "train-scheduler-homework-e826e",
  storageBucket: "train-scheduler-homework-e826e.appspot.com",
  messagingSenderId: "44572658915"
};
firebase.initializeApp(config);

var database = firebase.database();
var train = "";
var destination = "";
var startTime;
var frequency = 0;
var keys = [];

//on click function to add a train into database
$("#add-train").on("click", function () {
  event.preventDefault();
  train = $("#train-input").val().trim();
  destination = $("#destination-input").val().trim();
  startTime = $("#start-input").val().trim();
  frequency = $("#frequency-input").val().trim();
  database.ref().push({
    trainName: train,
    trainDestination: destination,
    schedStart: startTime,
    schedFreq: frequency
  });
  $("#train-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");
});


// references the firebase database to call the values stored there for scheduling logic
database.ref().on("child_added", function (childSnapshot) {
  var firstTrain = childSnapshot.val().schedStart;
  var frequency = parseInt(childSnapshot.val().schedFreq);
  var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  var timeApart = diffTime % frequency;
  var minsTilTrain = frequency - timeApart;
  var nextTrain = moment().add(minsTilTrain, "minutes");
  keys.push(childSnapshot.key);

// appends the train to the table
  $("#train-rows").append(`
        <tr>
            <th>${childSnapshot.val().trainName}</th>
            <th>${childSnapshot.val().trainDestination}</th>
            <th>${childSnapshot.val().schedFreq}</th>
            <th id=nextArrival-${childSnapshot.key}>${moment(nextTrain).format("hh:mm A")}</th>
            <th id=minsAway-${childSnapshot.key}>${parseInt(minsTilTrain)}</th>
        </tr>
    `);
});

//function tries to call the data stored in the html tables but returns as undefined
// function updateTimes() {
//   for (var i = 0; i < keys.length; i++) {
//     $("#nextArrival-" + keys[i]).text("test");
//     $("#minsAway-" + keys[i]).text("test");
//   }
// }

// $("#update-times").on("click", function () {
//   event.preventDefault();
//   updateTimes();
// });
// var text = $("minsAway-" + keys[0]).val();
// console.log(text);
