var idList; // Will be set to list of AW to AL ids

// Query for AniList API
var query = `
query ($userName: String) {
  Page (page: 1, perPage: 50) {
    mediaList(userName: $userName, type:ANIME, status:CURRENT) {
      progress
      media {
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

// Used to call AniList API
var variables = {
  userName: "aniwatchlist" // Will be able to choose your own username eventually
};

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
  })
  .catch(handleError => console.log(handleError));

// Sets idList to the list of AW to AL ids
fetch('./data.json').then(handleResponse => handleResponse.json())
  .then(handleData => idList = handleData)
  .catch(handleError => console.log(handleError));


// Creates HTML for one anime
function createCard(data) {
  let title = data["media"]["title"]["userPreferred"]; // Need to figure out when to use let, var, const
  let anilistId = data["media"]["id"];
  let currentEpisode = data["progress"] + 1;
  let link = "https://aniwatch.me/anime/" + idList[anilistId] + "/" + currentEpisode;
  let imgLink = data["media"]["coverImage"]["extraLarge"];

  let divCol1 = document.createElement('div'); // Scuffed
  divCol1.classList.add("col-md-6"); // Scuffed
  divCol1.innerHTML = `
    <div class="card mb-4" style="max-width: 500px;">
      <div class="row g-0">
        <div class="col-md-3"><img
            src="${imgLink}"
            class="card-img-top"></div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">Currently airing</p><a class="btn btn-primary"
              href="${link}">Continue Watching</a>
          </div>
        </div>
      </div>
    </div>` // Need to rewrite this HTML

  document.getElementById("bruh").appendChild(divCol1); // Scuffed
}