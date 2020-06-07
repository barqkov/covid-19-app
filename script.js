(function() {
  window.onload = function() {
    getGlobalInfo();
  };

  const countryForm = document.getElementById("search-country-form");

  function getGlobalInfo() {
    const totalCases = document.getElementById("total-cases");
    const totalDeaths = document.getElementById("total-deaths");
    const totalRecovered = document.getElementById("total-recovered");

    sendHttpRequest("GET", "https://api.covid19api.com/summary")
      .then(data => {
        if (data === null || data === undefined) getGlobalInfo();
        else {
          totalCases.innerText = `${numberWithCommas(
            data.Global.TotalConfirmed
          )}`;
          totalDeaths.innerText = `${numberWithCommas(
            data.Global.TotalDeaths
          )}`;
          totalRecovered.innerText = `${numberWithCommas(
            data.Global.TotalRecovered
          )}`;
        }
      })
      .catch(error => {
        console.log(error);
        getGlobalInfo();
      });
  }

  const sendHttpRequest = (method, url, data) => {
    const promise = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);

      xhr.responseType = "json";

      if (data) {
        xhr.setRequestHeader("Content-Type", "application/json");
      }

      xhr.onload = () => {
        if (xhr.status >= 400) {
          reject(xhr.response);
        } else {
          resolve(xhr.response);
        }
      };

      xhr.onerror = () => {
        reject("Something went wrong!");
      };

      xhr.send(JSON.stringify(data));
    });
    return promise;
  };

  countryForm.addEventListener("submit", getFormInfo);

  function getFormInfo(e) {
    e.preventDefault();
    const countryInput = document
      .getElementById("country-input")
      .value.toLowerCase();
    getCountryInfo(countryInput);
  }

  function getCountryInfo(countryName) {
    sendHttpRequest(
      "GET",
      `https://api.covid19api.com/live/country/${countryName}`
    ).then(data => {
      const lastIndex = data[data.length - 1];
      displayCountryInfo(lastIndex);
    });
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function displayCountryInfo(countryObj) {
    const countryHolder = document.getElementById("country-info-holder");
    countryHolder.style.display = "block";
    const countryDateHolder = document.getElementById("country-date-info");
    const countryNameHolder = document.getElementById("country-name");
    const countryInfoHolder = document.querySelectorAll(
      "div.display-info-holder-data > h4"
    );
    countryNameHolder.innerText = `Country: ${countryObj.Country}`;
    countryInfoHolder[0].innerText = `Confirmed: ${numberWithCommas(
      countryObj.Confirmed
    )}`;
    countryInfoHolder[1].innerText = `Recovered: ${numberWithCommas(
      countryObj.Recovered
    )}`;
    countryInfoHolder[2].innerText = `Deaths: ${numberWithCommas(
      countryObj.Deaths
    )}`;
    countryDateHolder.innerText = `Last updated on ${countryObj.Date}`;
  }
})();
