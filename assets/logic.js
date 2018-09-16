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

  $("#add-train").on("click", function(){
      event.preventDefault();
      train = $("#train-input").val().trim();
      destination = $("#destination-input").val().trim();
      startTime = $("#start-input").val().trim();
      console.log(startTime);
      frequency = $("#frequency-input").val().trim();
    database.ref().push({
        trainName: train,
        trainDestination: destination,
        schedStart: startTime,
        schedFreq: frequency
    });
  });

  database.ref().on("child_added", function(childSnapshot) {
    var firstTrain = childSnapshot.val().schedStart;
    console.log(firstTrain);
    var frequency = parseInt(childSnapshot.val().schedFreq);
    console.log(frequency);
    var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log(diffTime);
    var timeApart = diffTime % frequency;
    var minsTilTrain = frequency - timeApart;
    var nextTrain = moment().add(minsTilTrain, "minutes");

    $("#train-rows").append(`
        <tr>
            <th>${childSnapshot.val().trainName}</th>
            <th>${childSnapshot.val().trainDestination}</th>
            <th>${childSnapshot.val().schedFreq}</th>
            <th>${moment(nextTrain).format("hh:mm A")}</th>
            <th>${parseInt(minsTilTrain)}</th>
        </tr>
    `);
  });