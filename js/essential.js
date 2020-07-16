const Common= (function(){
    const apiToken= '2819389111522697';
    const apiUrl= `https://www.superheroapi.com/api.php/${apiToken}/`;
    const toastContainer = document.getElementById('toast');
    const FAVOURITES = 'favourites';
    const loader = document.querySelector('.loader');

     // to display loader while fetching 
    function showLoader() {
        loader.style.display = 'block';
    }

    function hideLoader() {
        loader.style.display = 'none';
    }

    // sending api Request using async-----
    async function apiRequest(url){
        try{
            const response= await fetch(url);
            const data= await response.json();

            return{
                data,
                success: true
            };
        }catch(err){
            return{
                error: err.message,
                success: false
            }
        }
    }

    // Add SuperHero to local storage
    function addHero(hero){
    
        if(!hero){
            return;
        }

        // fetch all Superhero from localStorage
        const getFavourites = getFavouriteSuperheroes();
        getFavourites.push(hero);

        localStorage.setItem(
            FAVOURITES,
            JSON.stringify(getFavourites)
        );
        
    }

    // Remove superHero from Storage
    function removeHero(heroId){

        if (!heroId){
            return;
        }

        let getFavourites = getFavouriteSuperheroes();

        // Remove superhero from storage
        getFavourites = getFavourites.filter(
            (item) => item.id !== heroId
        );

        localStorage.setItem(
            FAVOURITES,
            JSON.stringify(getFavourites)
        );

      
    }

    // Display all favourite Heros
    function getFavouriteSuperheroes() {
        return localStorage.getItem(FAVOURITES)
          ? JSON.parse(localStorage.getItem(FAVOURITES))
          : [];
    }

     
    // very important function if debounce api fetch
    function time(func, delay) {
        let timeout;
        return function () {
          const context = this;
          const args = arguments;
    
          clearTimeout(timeout);
    
          timeout = setTimeout(function () {
            timeout = null;
            func.apply(context, args);
          }, delay);
        };
    }

    return{
        apiUrl,
        showLoader,
        hideLoader,
        apiRequest,
        addHero,
        removeHero,
        getFavouriteSuperheroes,
        time
    }
})();
