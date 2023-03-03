function getDistinctValues(arr, col) {
  const distinct = new Set();
  for (const obj of arr) {
    distinct.add(obj[col]);
  }
  return Array.from(distinct);
};
function removeElementsByClass(className){
  const elements = document.getElementsByClassName(className);
  while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
  }
}
function populateEntries() {
  
  var entries = new Object()

  var morning = new Date("Jan 1, 2023 05:00");
  var day = new Date("Jan 1, 2023 10:00");
  var evening = new Date("Jan 1, 2023 17:00");
  var night = new Date("Jan 1, 2023 22:00");

  var sessionCont = document.getElementById("session-container")

  // Make a request to the server to retrieve the data from the database
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "get-entries.php", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      // Parse the response from the server as JSON
      entries = JSON.parse(xhr.responseText);

      //console.log(getDistinctValues(entries, "Date"));
      //console.log(getDistinctValues(entries, "Date").sort().reverse());

      const dates = getDistinctValues(entries, "Date").sort().reverse();

      for (const date in dates) {

        var entry = entries.filter(item => item.Date == dates[date]);

        var excer = new String();
        var time = new String(entry[0].Time);
        var totWeight = new Number();

        var cont = document.createElement("div");
        cont.classList.add("sesscont");

        var img = document.createElement("img");
        img.classList.add("daytime-img");

        var pic = new String;
        var timestamp = new Date("Jan 1, 2023 " +  time);

        if (timestamp >= morning && timestamp < day) {pic = "morning.png"};
        if (timestamp >= day && timestamp < evening) {pic = "day.png"};
        if (timestamp >= evening && timestamp < night) {pic = "evening.png"};
        if (timestamp >= night || timestamp < morning) {pic = "night.png"};
        img.src = "img/" + pic;
        
        for (row in entry) {

          excer = excer.concat(entry[row].Exercise, ", ");
          if (time > entry[row].Time) {
            time = entry[row].Time;
          };
          totWeight = totWeight + entry[row].Sets * entry[row].Reps * entry[row].Weight;
        };

        excer = excer.slice(0, -2);
        dat = new Date(dates[date]);
        dat = dat.toString();
        dat = parseInt(dat.slice(8, 10)) + " " + dat.slice(4, 7) + " " + dat.slice(11, 15);
        
        var dateBox = document.createElement("div");
        dateBox.classList.add(...["date-box", "sess-info"]);
        dateBox.innerHTML = dat;

        var excBox = document.createElement("div");
        excBox.classList.add(...["exc-box", "sess-info"]);
        excBox.innerHTML = excer;

        var weightBox = document.createElement("div");
        weightBox.classList.add("weight-box");
        weightBox.innerHTML = totWeight + " kg";

        var boxCont = document.createElement("div");
        boxCont.classList.add("box-cont");

        var sessBoxCont = document.createElement("div");
        sessBoxCont.classList.add("sessboxcont");

        boxCont.appendChild(dateBox);
        boxCont.appendChild(excBox);

        sessBoxCont.appendChild(img);
        sessBoxCont.appendChild(boxCont);
        sessBoxCont.appendChild(weightBox);

        cont.appendChild(sessBoxCont);

        sessionCont.appendChild(cont);

      };
    };
  };
  xhr.send();
};
function addEntry(field1, field2, field3, field4, field5, field6, field7) {
  
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "add-entry.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {

      document.getElementById("add-entry-form").style.display = "none";

      var button = document.getElementById("circle-button");
      button.dataset.status = "button";
      document.getElementById("add-entry-form").style.display = "none";

      removeElementsByClass("sesscont");
      populateEntries();
    }
  };
  xhr.send("field1=" + encodeURIComponent(field1) + "&field2=" + encodeURIComponent(field2) +
    "&field3=" + encodeURIComponent(field3) + "&field4=" + encodeURIComponent(field4) +
    "&field5=" + encodeURIComponent(field5) + "&field6=" + encodeURIComponent(field6) + 
    "&field7=" + encodeURIComponent(field7));
};
function showList(event) {
  e = event || window.event;
  c = e.target.firstChild;
  e.target.parentNode.children[1].dataset.status = "show";
};
function selectItem(event) {
  e = event || window.event;
  var target = e.target || e.srcElement;
  text = target.textContent || target.innerText;
  document.getElementById(target.classList[0] + "-input").value = text;
  target.parentNode.dataset.status = "hide";
};

window.onload = function() {

  populateEntries();

  document.getElementById("add-entry-form").addEventListener("submit", function(event) {
    event.stopPropagation();
    event.preventDefault();
    var field1 = document.getElementById("field1").value;
    var field2 = document.getElementById("field2").value;
    var field3 = document.getElementById("field3").value;
    var field4 = document.getElementById("field4").value;
    var field5 = document.getElementById("field5").value;
    var field6 = document.getElementById("field6").value;
    var field7 = document.getElementById("field7").value;
    addEntry(field1, field2, field3, field4, field5, field6, field7);

    var button = document.getElementById("circle-button");
    button.dataset.status = "button";

  });

  document.getElementById("circle-button").addEventListener("click", function() {
    var button = document.getElementById("circle-button");

    if (button.dataset.status == "button") {
      button.dataset.status = "hidden";
      document.getElementById("add-entry-form").style.display = "block";
    } 
  });

  document.getElementById("cancel-button").addEventListener("click", function(event) {
    event.stopPropagation();
    var button = document.getElementById("circle-button");
    button.dataset.status = "button";
    document.getElementById("add-entry-form").style.display = "none";
  });

};