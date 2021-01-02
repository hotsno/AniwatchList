var idList; // Will be set to list of AW to AL ids

var variables = {
  userName: ""
}

const storageInput = document.querySelector('.storage');
const button = document.querySelector('.button');
let text = "";

storageInput.addEventListener('input', letter => {
  text = letter.target.value;
});

const buttonClicked = () => {
  localStorage.setItem('username', text);
  variables.userName = text;
  document.getElementById("input-button").remove();
  callAPI();
}

button.addEventListener('click', buttonClicked);

// Query for AniList API
var query = `
query ($userName: String) {
  Page (page: 1, perPage: 50) {
    mediaList(userName: $userName, type:ANIME, status:CURRENT) {
      progress
      media {
        status
        coverImage {
          extraLarge
        }
        id
        title {
          userPreferred
        }
      }
    }
  }
}
`;

function callAPI() {

  // Used to call AniList API
  var url = 'https://graphql.anilist.co',
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    };

  // AniList API
  fetch(url, options).then(handleResponse => handleResponse.json())
    .then(handleData => {
      let watching = handleData["data"]["Page"]["mediaList"];
      for (var i = 0; i < watching.length; i++) {
        createCard(watching[i]);
      }

      // Needed for tooltips to work ¯\_(ツ)_/¯
      var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
      })
    })
    .catch(handleError => console.log(handleError));

  // Sets idList to the list of AW to AL ids
  fetch('./data.json').then(handleResponse => handleResponse.json())
    .then(handleData => idList = handleData)
    .catch(handleError => console.log(handleError));
}


// Creates HTML for one anime
function createCard(data) {
  let title = data["media"]["title"]["userPreferred"]; // Need to figure out when to use let, var, const
  let anilistId = data["media"]["id"];
  let currentEpisode = data["progress"] + 1;
  let link = "https://aniwatch.me/anime/" + idList[anilistId] + "/" + currentEpisode;
  let imgLink = data["media"]["coverImage"]["extraLarge"];
  let airing = false;
  if(data["media"]["status"] === "RELEASING") {
    airing = true;
  }
  let airingString = "Currently airing"
  if(!airing) {
    airingString = "Finished airing"
  }

  let divCol1 = document.createElement('div'); // Scuffed
  divCol1.classList.add("col-md-6"); // Scuffed
  divCol1.innerHTML = `
    <div class="card text-white bg-dark mb-4" style="max-width: 500px;">
      <div class="row no-gutters">
        <div class="col-md-3"><img
            src="${imgLink}"
            class="card-img-top"></div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${airingString}</p>
            <a type="button" class="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Play episode ${currentEpisode}" href="${link}">Next Episode</a>
          </div>
        </div>
      </div>
    </div>` // Need to rewrite this HTML

  document.getElementById("bruh").appendChild(divCol1); // Scuffed
}