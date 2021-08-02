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
    if (comicNumToSearch.value === '') { //if input in absent
        document.querySelector("#errorAlert").classList.remove("hidden");
        document.querySelector(
            "#errorMsg"
        ).innerHTML = `Comic number cannot be empty. Please pick a number between 1 and ${latestComicNumber}`;

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
        firstElementToRetrieve = comicNumber - index;
        for (let k = 0; k < 5; k++) {
            if (comicNumber - index + k <= latestComicNumber && comicNumber - index + k > 0) {
                arr.push(comicNumber - index + k);
            } else if (comicNumber - index + k > latestComicNumber) {
                arr.push(Number(comicNumber) - index + k - Number(latestComicNumber));
            } else if (comicNumber - index + k <= 0) {
                arr.push(Number(comicNumber) - index + k + Number(latestComicNumber));
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
//const delay = (ms) => new Promise((res) => setTimeout(res, ms));

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
            // console.log(comic);
            const comicRetrieved = document.querySelector(`.num${number}`);
            comicRetrieved.innerHTML = `<h5 class="mt-6 text-gray-900 text-sm font-medium">  ${comic.title} </h5>
      <h5>${comic.num}</h5>
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

initComics(2, 3);