$(document).ready(function () {

const { fromEvent, from, of } = rxjs;
const { map, flatMap } = rxjs.operators;


let userClicksSearchButton = fromEvent(
    $("#search-button"),
    'click'
)
.pipe(
    map((event) => {
        return $("#search-box").val();
    })
);

//$.get('https://api.github.com/users/', function(){console,log("hello world")});

userClicksSearchButton
.pipe(
    flatMap( (searchTerm) => {
        return from(
            $.get('https://api.github.com/users/' + searchTerm)
        )
    })
);

let mySubscription = 
userClicksSearchButton.subscribe({
    next: response => {console.log("success");
                    renderUser(
                        response.login,
                        response.html_url,
                        response.avatar_url);
                        return of(null);
                        // unsubscribe
                       //mySubscription.unsubscribe()
    },
    error: event => console.log("error"),
    complete: event => console.log("complete")
});
/*.subscribe((response) => {
    console.log("response received");
    renderUser(
        response.login,
        response.html_url,
        response.avatar_url
    );
});*/

function renderUser(login, href, imgSrc) {
let searchResult = $("#search-result");
searchResult.show();
searchResult.attr("href", href);
$("#search-result__avatar").attr('src', imgSrc);
$('#search-result__login').text(login);
}


});