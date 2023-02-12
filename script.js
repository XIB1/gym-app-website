window.onload = function() {
  var tableBody = document.getElementById("table-body");

  // Make a request to the server to retrieve the data from the database
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "get-entries.php", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      // Parse the response from the server as JSON
      var entries = JSON.parse(xhr.responseText);

      // Loop through the entries and add a row to the table for each entry
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var row = document.createElement("tr");

        var field1 = document.createElement("td");
        field1.textContent = entry.Date;
        row.appendChild(field1);

        var field2 = document.createElement("td");
        field2.textContent = entry.Time;
        row.appendChild(field2);

        var field3 = document.createElement("td");
        field3.textContent = entry.Exercise;
        row.appendChild(field3);

        var field4 = document.createElement("td");
        field4.textContent = entry.Weight;
        row.appendChild(field4);

        var field5 = document.createElement("td");
        field5.textContent = entry.Sets;
        row.appendChild(field5);

        var field6 = document.createElement("td");
        field6.textContent = entry.Reps;
        row.appendChild(field6);

        var field7 = document.createElement("td");
        field7.textContent = entry.Effort;
        row.appendChild(field7);

        tableBody.appendChild(row);
      }
    }
  };
  xhr.send();


  document.getElementById("add-entry-button").addEventListener("click", function() {
    document.getElementById("add-entry-form").style.display = "block";
  });
    
  document.getElementById("add-entry-form").addEventListener("submit", function(event) {
    event.preventDefault();
    var field1 = document.getElementById("field1").value;
    var field2 = document.getElementById("field2").value;
    var field3 = document.getElementById("field3").value;
    var field4 = document.getElementById("field4").value;
    var field5 = document.getElementById("field5").value;
    var field6 = document.getElementById("field6").value;
    var field7 = document.getElementById("field7").value;
    addEntry(field1, field2, field3, field4, field5, field6, field7);
  });
    
  function addEntry(field1, field2, field3, field4, field5, field6, field7) {
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "add-entry.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        var entriesTable = document.getElementById("entries").getElementsByTagName("tbody")[0];
        var newRow = entriesTable.insertRow();
        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);
        var cell4 = newRow.insertCell(3);
        var cell5 = newRow.insertCell(4);
        var cell6 = newRow.insertCell(5);
        var cell7 = newRow.insertCell(6);
        cell1.innerHTML = field1;
        cell2.innerHTML = field2;
        cell3.innerHTML = field3;
        cell4.innerHTML = field4;
        cell5.innerHTML = field5;
        cell6.innerHTML = field6;
        cell7.innerHTML = field7;
        document.getElementById("add-entry-form").style.display = "none";
      }
    };
    xhr.send("field1=" + encodeURIComponent(field1) + "&field2=" + encodeURIComponent(field2) +
      "&field3=" + encodeURIComponent(field3) + "&field4=" + encodeURIComponent(field4) +
      "&field5=" + encodeURIComponent(field5) + "&field6=" + encodeURIComponent(field6) + 
      "&field7=" + encodeURIComponent(field7));
  }

};