import {
  getUserInput,
  buildTripObject,
  buildTripsView,
  buildAddTripView,
  requestDataFromAPIs,
  getLocalTrips,
  setLocalTrips,
} from "./helpers";
import { getTrips, postTrip, deleteTrip } from "./APIrequests";

let tripData = {};

// Request user trips on page load
const onPageLoad = async () => {
  document.addEventListener("DOMContentLoaded", async function () {
    const trips = await getTrips();
    if (trips.length) {
      setLocalTrips(trips);
      buildTripsView();
    }
  });
};

/* Function called by event listener */
const submitForm = async (event) => {
  event.preventDefault();

  const { city, startDate, endDate } = getUserInput();
  const { geoData, weatherData, imagesData } = await requestDataFromAPIs(city);

  tripData = buildTripObject(geoData, weatherData, imagesData);
  buildAddTripView(tripData);
};

// delete trip
const removeTrip = async (event) => {
  event.preventDefault();
  const trips = await deleteTrip(event.target.id);
  setLocalTrips(trips);
  buildTripsView();
};

const addTrip = async (event) => {
  const updatedTrips = await postTrip(tripData);
  setLocalTrips(updatedTrips);
  buildTripsView();
};
document.addEventListener("DOMContentLoaded", function () {
  var add = document.getElementById("addTaskButton");
  var removeFinished = document.getElementById("removeFinishedTasksButton");
  var task = document.getElementById("taskInput");
  var list = document.getElementById("taskList");
  var body = document.querySelector("body");
  var prior = document.getElementById("taskPriority");

  //To do counter
  var toDo = document.createElement("span");
  body.insertBefore(toDo, list);
  var allTasks = document.querySelectorAll("li");
  var counter = allTasks.length;
  toDo.innerHTML = "Tasks to do: " + counter;
  //Add task
  add.addEventListener("click", function () {
      if (task.value.length >= 5 &&
      task.value.length <= 100 &&
      prior.value > 0 &&
      prior.value <= 10) {

  //Add task to the list

     var newTask = document.createElement("li");
     newTask.dataset.priority = prior.value;
     var all = document.querySelectorAll("li");
     var index = all.length;
     
     for (var i = 0; i < all.length; i++) {
         if (parseInt(newTask.dataset.priority) < parseInt(all[i].dataset.priority)) {
             index = i;
             break;
         }
     }

     list.insertBefore(newTask, all[index]);
     var taskName = document.createElement("h1");
     newTask.appendChild(taskName);
     taskName.innerHTML = task.value;

     //Add delete button
     var delBtn = document.createElement("button");
     newTask.appendChild(delBtn);
     delBtn.innerHTML = "Delete";
     delBtn.classList.add("delete");

     //Add complete button
     var complBtn = document.createElement("button");
     newTask.appendChild(complBtn);
     complBtn.innerHTML = "Complete";
     complBtn.classList.add("complete");

     counter++;
     toDo.innerHTML = "Tasks to do: " + counter;

     //Mark completed in red and adjust counter
     complBtn.addEventListener("click", function () {
         if (this.parentElement.style.color === "") {
             this.parentElement.style.color = "red";
             this.parentElement.setAttribute("done", "yes");
             counter--;
             toDo.innerHTML = "Tasks to do: " + counter;
         } else if (this.parentElement.style.color === "red") {
             this.parentElement.style.color = "";
             this.parentElement.removeAttribute("done");
             counter++;
             toDo.innerHTML = "Tasks to do: " + counter;
         }
     });

     //Delete selected item and adjust counter
     delBtn.addEventListener("click", function () {
         this.parentElement.parentNode.removeChild(this.parentElement);
         counter--;
         toDo.innerHTML = "Tasks to do: " + counter;
     });

     task.value = "";
     prior.value = "";
      
 } else {

     event.preventDefault();
     alert("Task should have from 5 to 100 characters. Priority should be an integer between 1 and 10");
 }
});

//Remove completed items
removeFinished.addEventListener("click", function () {
 var tasks = document.querySelectorAll("li");
 for (var i = 0; i < tasks.length; i++) {
     if (tasks[i].hasAttribute("done")) {
         tasks[i].parentNode.removeChild(tasks[i]);
     }
 }
});

});

export { submitForm, removeTrip, addTrip, onPageLoad };
