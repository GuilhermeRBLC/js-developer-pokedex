
const sectionsList = document.querySelectorAll('.sections a')
sectionsList.forEach((obj, index) => obj.addEventListener('click', sectionClick))

function sectionClick() {
    const actived = document.querySelector('.sections a.actived')
    actived.classList.remove('actived')
    this.classList.add('actived')
}

