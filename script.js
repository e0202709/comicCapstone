let currentComicNumber = 0;
let currentDisplay = 0;
let latestComicNumber = 0;

getLatestComicNumber();

const form = document.querySelector(`#myForm`);
const comicNumToSearch = document.querySelector(`#input__field`);
const numberToDisplay = document.querySelector(`#numOfComicsToDisplay`);


form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (
        comicNumToSearch.value > latestComicNumber ||
        comicNumToSearch.value < 1
    ) {
        document.querySelector("#errorAlert").classList.remove("hidden");
        document.querySelector(
            "#errorMsg"
        ).innerHTML = `Comic Number ${comicNumToSearch.value} Does Not Exist; Please pick a number between 1 and ${latestComicNumber}`;
    } else {
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
    initComics(Number(Math.floor(Math.random() * 2488) + 1), currentDisplay)
);

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
    currentDisplay = comicsToShowAtATime;
    if (comicsToShowAtATime == 5) {
        let arr = [];
        currentComicNumber = comicNumber;
        firstElementToRetrieve = comicNumber - 2;
        for (let k = 0; k < 5; k++) {
            if (comicNumber - 2 + k <= latestComicNumber && comicNumber - 2 + k > 0) {
                arr.push(comicNumber - 2 + k);
            } else if (comicNumber - 2 + k > latestComicNumber) {
                arr.push(Number(comicNumber) - 2 + k - Number(latestComicNumber));
            } else if (comicNumber - 2 + k <= 0) {
                arr.push(Number(comicNumber) - 2 + k + Number(latestComicNumber));
            }
        }

        for (let j = 0; j < comicsToShowAtATime; j++) {
            await Promise.resolve(getComic(arr[j], comicsToShowAtATime, j));
        }
    } else if (comicsToShowAtATime == 3) {
        currentComicNumber = comicNumber;
        let arr = [];
        if (comicNumber == 1) {
            arr.push(latestComicNumber);
            arr.push(comicNumber);
            arr.push(Number(comicNumber) + Number(1));

            for (let i = 0; i < arr.length; i++) {
                await Promise.resolve(getComic(arr[i], comicsToShowAtATime, i));
            }

        } else if (comicNumber == latestComicNumber) {
            arr.push(latestComicNumber - Number(1));
            arr.push(latestComicNumber);
            arr.push(Number(1));
            for (let i = 0; i < arr.length; i++) {
                await Promise.resolve(getComic(arr[i], comicsToShowAtATime, i));
            }

        } else {
            firstElementToRetrieve = comicNumber - 1;
            currentComicNumber = comicNumber;

            for (let i = 0; i < comicsToShowAtATime; i++) {
                if (firstElementToRetrieve + i <= 2488) {
                    await Promise.resolve(
                        getComic(firstElementToRetrieve + i, comicsToShowAtATime, i)
                    );
                }
            }
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
            comicRetrieved.innerHTML = `<h3 class="mt-6 text-gray-900 text-sm font-medium">  ${comic.title} </h3>
      <h3>${comic.num}</h3>
      <img class="resize${numOfComicsDisplayed} id=${number}"
        src="${comic.img}"
        alt="" />`;
        })

        .catch((error) => {
            // document.querySelector("#errorAlert").classList.remove("hidden");
            // document.querySelector("#errorMsg").innerHTML = ` ${error} `;
            // console.log(error);
        });

}

initComics(1, 1);