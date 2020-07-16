const Main= (function(){
 //set search limit as 2
 const SEARCH_TEXT_LIMIT = 2;

 const search= document.getElementById('search');
 const searchlist= document.getElementById('search-result-list');
 let searchResults=[];
 

//display search result 
 function displayresult(){

    if(!searchResults || searchResults.length === 0){
        searchlist.innerHTML= '<li class="not-found"> Not Found!!! </li>';
        return;
    }

    const favSuperHeroes= Common.getFavouriteSuperheroes();
    searchlist.innerHTML='';

    searchResults.forEach((element) => {
        const li= document.createElement('li');
       
        // Find if superHero exists
        const indexOfSuperHeroInFav= favSuperHeroes.findIndex(
            (hero) => hero.id === element.id
        );
        li.classList.add('search-result');
        li.innerHTML=`
                    <div class="search-left">
                        <img src=${element.image.url} alt="" />
                    </div>
                    <div class="search-right">
                        <a href="herodetails.html?id=${element.id}">
                            <div class="name">${element.name}</div>
                        </a>
                        <div class="full-name">${element.biography['full-name']}</div>
                        <button class="btn add-to-fav" data-id=${element.id} style="display: ${indexOfSuperHeroInFav === -1 ? 'block':'none'}">
                            Add to favourites
                        </button>
                        <button class="btn remove-from-fav" data-id=${element.id} style="display: ${indexOfSuperHeroInFav === -1 ? 'none':'block'}">
                            Remove from favourites
                        </button>
                    </div>`;
                    searchlist.appendChild(li);
    });
 }

//Remove search results
function remove_search_res(){
    searchlist.innerHTML='';
    searchResults= [];
}

async function handleSearch(e) {
    const searchTerm = e.target.value; 
    const url = Common.apiUrl;

    if (searchTerm.length <= SEARCH_TEXT_LIMIT) {
      remove_search_res();
      return;
    }

    Common.showLoader();
    remove_search_res();

    try {
      const data = await Common.apiRequest(`${url}/search/${searchTerm}`);
      Common.hideLoader();

      if (data.success) {
        searchResults = data.data.results;
        displayresult();
      }
    } catch (error) {
      console.log('error', error);
      Common.hideLoader();
    }
  }

//----Add/remove from favourite
function handleDocumentClick(e) {
    const target = e.target;

    if (target.classList.contains('add-to-fav')) {
        // Find the hero data and store it in favourites and localstorage
        const searchResultClickedId = target.dataset.id;
        const hero = searchResults.filter(
            (hero) => hero.id === searchResultClickedId
        );
        Common.addHero(hero[0]);
        displayresult();
    } else if (target.classList.contains('remove-from-fav')) {
        // Find the hero data and remove from local storage
        const searchResultClickedId = target.dataset.id;

        // Show add to fav button and hide the remove from fav button
        const addToFavBtn = document.querySelector(
        `button[data-id="${searchResultClickedId}"].add-to-fav`
        );
        if (addToFavBtn) addToFavBtn.style.display = 'block';

        const removeFromFavBtn = document.querySelector(
        `button[data-id="${searchResultClickedId}"].remove-from-fav`
        );
        if (removeFromFavBtn) removeFromFavBtn.style.display = 'none';

        Common.removeHero(searchResultClickedId);
    }
}

function init(){
    search.addEventListener('keyup', Common.time(handleSearch, 500));
    document.addEventListener('click', handleDocumentClick);
}

return{
    init,
};

})();
