let currentComicNumber = 0;
let currentDisplay = 0;
let latestComicNumber = 0;

getLatestComicNumber();

const form = document.querySelector(`#myForm`);
const comicNumToSearch = document.querySelector(`#input__field`);
const numberToDisplay = document.querySelector(`#numOfComicsToDisplay`);

//Submitting the form to search for a specific comic 
form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (comicNumToSearch.value === '') { //if input in absent, use the currentComicNumber; so that users do not have to keep inputting
        initComics(currentComicNumber, numberToDisplay.value);

    } else if (
        comicNumToSearch.value > latestComicNumber ||
        comicNumToSearch.value < 1) { //invalid comic number which is out of range
        document.querySelector("#errorAlert").classList.remove("hidden");
        document.querySelector(
            "#errorMsg"
        ).innerHTML = `Comic Number ${comicNumToSearch.value} Does Not Exist; Please pick a number between 1 and ${latestComicNumber}`;
    } else { //valid comic number
        initComics(comicNumToSearch.value, numberToDisplay.value);
    }
    comicNumToSearch.value = ''; //clear the comicToSearch value, for better user interface.
});

const nextButton = document.querySelector(`#nextButton`);

nextButton.addEventListener("click", function (event) {
    if (Number(currentComicNumber) + Number(currentDisplay) > latestComicNumber) {
        initComics(
            Number(currentComicNumber) -
            Number(latestComicNumber) +
            Number(currentDisplay),
            currentDisplay
        );
    } else {
        initComics(
            Number(currentComicNumber) + Number(currentDisplay),
            currentDisplay
        );
    }
});

const prevButton = document.querySelector(`#prevButton`);
prevButton.addEventListener("click", function (event) {
    if (Number(currentComicNumber) - Number(currentDisplay) <= 0) {
        initComics(
            Number(latestComicNumber) -
            Number(currentDisplay) +
            Number(currentComicNumber),
            currentDisplay
        );
    } else {
        initComics(
            Number(currentComicNumber) - Number(currentDisplay),
            currentDisplay
        );
    }
});

const firstButton = document.querySelector(`#firstButton`);
firstButton.addEventListener("click", function (event) {
    const numToAdd = Math.floor(currentDisplay / 2);
    initComics(
        1 + numToAdd, currentDisplay
    );

});

const lastButton = document.querySelector(`#lastButton`);
lastButton.addEventListener("click", function (event) {
    const numToSubtract = Math.floor(currentDisplay / 2);
    initComics(
        latestComicNumber - numToSubtract, currentDisplay
    );

});

const randomButton = document.querySelector(`#randomButton`);
randomButton.addEventListener("click", () =>
    initComics(Number(Math.floor(Math.random() * latestComicNumber) + 1), currentDisplay)
);

function onClick(element) {
    document.getElementById("img01").src = element.src;
    document.getElementById("modal01").style.display = "block";
}

function clearDivs() {
    const div = document.querySelectorAll("div[class *= 'num']");

    div.forEach((inDiv) => {
        inDiv.innerHTML = "";
    });
}

async function initComics(comicNumber, comicsToShowAtATime) {
    document.querySelector(".loader").style.display = "block";
    document.querySelector("#errorMsg").innerHTML = "";
    document.querySelector("#errorAlert").classList.add("hidden");
    clearDivs();
    currentDisplay = comicsToShowAtATime; //currentDisplay refers to the number of comic shown each time eg. 1,3 or 5
    if (comicsToShowAtATime == 5 || comicsToShowAtATime == 3) {
        let arr = [];
        currentComicNumber = comicNumber;
        const index = Math.floor(comicsToShowAtATime / 2);
        /*
        firstElementToRetrieve depends on comicsToShowAtATime
        eg: comicNumber = 100; comicsToShowAtATime is 5;firstElementToRetrieve would be 100-2 = 98
        bc display 98,99,100,101,102
        ------------------------------------------------------------------------------------------
        eg: comicNumber = 100; comicsToShowAtATime is 5;firstElementToRetrieve would be 100-1= 99
        bc display 99,100,101
        */
        firstElementToRetrieve = comicNumber - index;
        for (let k = 0; k < comicsToShowAtATime; k++) {
            let comicNumToRetrieve = Number(comicNumber) - index + k;
            //if comicNumToRetrieve is between 0 - latestComicNumber, we will add it into the arrary
            if (comicNumToRetrieve <= latestComicNumber && comicNumToRetrieve > 0) {
                arr.push(comicNumToRetrieve);
            }
            /* 
               if comicNumToRetrieve is bigger than latestComicNumber, we would have to subtract it by the latest comic number
               eg: latestComicNumber is 2488 and comicNumToRetrieve is 2489, we would have to retrieve comic 1, which is 2489-2488 
            */
            else if (comicNumToRetrieve > latestComicNumber) {
                arr.push(comicNumToRetrieve - Number(latestComicNumber));
            }
            /* 
                if comicNumToRetrieve is bigger than latestComicNumber, we would have to add it by the latest comic number
                eg: latestComicNumber is 2488 and comicNumToRetrieve is 0, we would have to retrieve comic 2488, which is 0+2488 
            */
            else if (comicNumToRetrieve <= 0) {
                arr.push(comicNumToRetrieve + Number(latestComicNumber));
            }
        }
        for (let j = 0; j < comicsToShowAtATime; j++) {
            await Promise.resolve(getComic(arr[j], comicsToShowAtATime, j));
        }
    } else {
        currentComicNumber = comicNumber;
        firstElementToRetrieve = comicNumber;
        getComic(comicNumber, 1, 1);
    }
    let hideLoader = setTimeout(() => {
        document.querySelector(".loader").style.display = "none";
    }, 1000);
}

function getLatestComicNumber() {
    const targetUrl = `https://intro-to-js-playground.vercel.app/api/xkcd-comics/?comic=latest`;
    fetch(targetUrl)
        .then((blob) => blob.json())
        .then((comic) => {
            latestComicNumber = comic.num;
        });
}

function getComic(comicNumber, numOfComicsDisplayed, number) {
    //const number = comicNumber % numOfComicsDisplayed;
    //var targetUrl = `https://getxkcd.vercel.app/api/comic?num=${comicNumber}`;
    const targetUrl = ` https://intro-to-js-playground.vercel.app/api/xkcd-comics/${comicNumber}`;
    fetch(targetUrl)
        .then((blob) => {
            if (blob.ok) {
                return blob.json();
            } else {
                console.log(blob.status);
                if (blob.status === 404) {
                    throw new Error("Comic Number Does Not Exist");
                }
            }
        })
        .then((comic) => {
            const comicRetrieved = document.querySelector(`.num${number}`);
            comicRetrieved.innerHTML = `<h5 class="mt-6 text-gray-900 text-sm font-medium">  ${comic.title} </h5>
      <h5>${comic.num} out of ${latestComicNumber}</h5>
      <img class="resize${numOfComicsDisplayed} id=${number}"
        src="${comic.img}" style="" 
        onclick="onClick(this)" class="w3-hover-opacity"
        alt="" />`;
        })

        .catch((error) => {
            // document.querySelector("#errorAlert").classList.remove("hidden");
            // document.querySelector("#errorMsg").innerHTML = ` ${error} `;
            // console.log(error);
        });

}

initComics(2, 3); //first initial display of comics