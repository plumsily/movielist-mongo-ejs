const deleteMovie = document.querySelectorAll(".fa-trash");
const updateWatch = document.querySelectorAll(".fa-square-check");

Array.from(deleteMovie).forEach((element) => {
  element.addEventListener("click", deleteMovieFromDB);
});
Array.from(updateWatch).forEach((element) => {
  element.addEventListener("click", updateMovieWatch);
});

async function deleteMovieFromDB() {
  const name = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("deleteMovie", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nameS: name,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (error) {
    console.error(error);
  }
}

async function updateMovieWatch() {
  const name = this.parentNode.childNodes[1].innerText;
  const watched = this.parentNode.childNodes[3].innerText == "Watched" ? 1 : 0;
  try {
    const response = await fetch("updateWatched", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nameS: name,
        watchedS: watched,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (error) {
    console.error(error);
  }
}
