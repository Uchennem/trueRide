'use strict';

// Get a reference to the dropdown
let classificationList = document.querySelector("#classificationList");

// Add an event listener to handle dropdown changes
classificationList.addEventListener("change", function () {
  let classification_id = parseInt(classificationList.value);

  // Log the classification ID for debugging
  console.log(`classification_id is: ${classification_id}`);
  // If user selects the placeholder (no valid value), clear the table
  if (isNaN(classification_id)) {
    document.getElementById("inventoryDisplay").innerHTML = "";
    return; 
  }

  // Define the API endpoint to fetch inventory data
  let classIdURL = `/inv/getInventory/${classification_id}`;
  console.log(classIdURL);

  // Fetch inventory data based on the selected classification
  fetch(classIdURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not OK");
    })
    .then(function (data) {
      // Log the received data for debugging
      console.log(data);

      // Build the inventory table and inject it into the DOM
      buildInventoryList(data);
    })
    .catch(function (error) {
      console.error('There was a problem:', error.message);
    });
});

// Function to build and display the inventory list
function buildInventoryList(data) {
  const inventoryDisplay = document.getElementById("inventoryDisplay");

  // Generate table rows using the received data
  const dataTable = `
    <table>
      <thead>
        <tr>
          <th>Vehicle Name</th>
          <th>&nbsp;</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            element => `
              <tr>
                <td>${element.inv_make} ${element.inv_model}</td>
                <td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>
                <td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td>
              </tr>
            `
          )
          .join('')}
      </tbody>
    </table>
  `;

  // Inject the generated HTML into the inventory display container
  inventoryDisplay.innerHTML = dataTable;
}
