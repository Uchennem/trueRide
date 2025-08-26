const invModel = require('../models/invModel');
const Util = {};

Util.getNav = async function() {
  try {
    // Get classifications using your model function
    const classifications = await invModel.getAllClassifications();
    console.log(classifications); 
    // Start with Home link
    let navItems = [
      '<li><a href="/" title="Home page">Home</a></li>'
    ];

    // Add classification links if data exists
    if (classifications && classifications.length > 0) {
      classifications.forEach(classification => {
        navItems.push(`
          <li>
            <a href="/inv/type/${classification.classification_id}" 
               title="See our inventory of ${classification.classification_name} vehicles">
              ${classification.classification_name}
            </a>
          </li>
        `);
      });
    }

    // Wrap items in <ul> tags
    return `<ul>${navItems.join('')}</ul>`;
    
  } catch (error) {
    console.error('Error generating navigation:', error);
    // Fallback basic navigation
    return `
      <ul>
        <li><a href="/" title="Home page">Home</a></li>
        <li><a href="/inv" title="Browse all vehicles">Inventory</a></li>
      </ul>
    `;
  }
};

Util.buildClassificationGrid = async function(data) {
  let grid = '';

  if (data.length > 0) {
    grid = `<ul id="inv-display">`;

    data.forEach(vehicle => {
      grid += `
        <li>
          <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on TrueRide Motors" />
          </a>
          <div class="namePrice">
            <hr />
            <h2>
              <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                ${vehicle.inv_make} ${vehicle.inv_model}
              </a>
            </h2>
            <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
          </div>
        </li>
      `;
    });

    grid += `</ul>`;
  } else {
    grid = `<p class="notice">Sorry, no matching vehicles could be found.</p>`;
  }

  return grid;
};

Util.buildVehicleDetails = async function(vehicle) {
    let content ="";
    if(vehicle) {
        // Format the price as currency
        let vehiclePrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD', 
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(vehicle.inv_price);
        let mileage = new Intl.NumberFormat('en-US').format(vehicle.inv_miles);

        content += `<section class="vehicle_details">
            <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make}">
            <div class="aboutVehicle">
            <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
            <div class="vehicleNumbers">
                <h2>Price: ${vehiclePrice}</h2>
                <h2>Mileage: ${mileage} miles</h2>
            </div>
            <p id="vehicle_para"><span class="vehicle_specs">Color: </span>${vehicle.inv_color}</p>
            <p id="vehicle_description">${vehicle.inv_description}</p>
            </div>
        </section>`;

    } else {
        content = `<p class="notice">Sorry no matching vehicle could be found</p>`
    }
  
  
  return content;
}

/* ***************************
 *  Build Classifications Management view
 * ************************** */
 Util.buildClassificationList = (data, selectedId = null) => {
  let options = '<option value="" disabled selected>Make choice</option>'; // Add placeholder

  // Use forEach to iterate over each item in the data array
  data.forEach((element) => {
    // Check if this option should be selected, but only if selectedId is provided
    const isSelected = selectedId && element.classification_id === selectedId ? 'selected' : '';
    options += `<option value="${element.classification_id}" ${isSelected}>${element.classification_name}</option>`;
  });

  // Return the final string with all <option> elements
  return options;
};


/*****************************************
* Middleware For Handling Errors
* Wrap other functions in this for
* General Error Handling
****************************************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util