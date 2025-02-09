const cards = document.querySelectorAll('.artistCard')
const input = document.getElementById('search')
const artistName = [...document.querySelectorAll('.name')]
const artistParent = document.querySelector('.artist')


cards.forEach(card => {
    card.addEventListener('click', () => {
        const artistId = card.getAttribute("id")
            window.location.href = `/artist/${artistId}`
    })
})

const fetchData = async() => {
    const response = await fetch('/api/artists')
    const a = await response.json()
    // console.log(a)
    return a
}
console.log(fetchData())

input.addEventListener('input', () => {
    const inputValue = input.value.toLowerCase()
    const dataArtist = fetchData()
    
    artistName.forEach(Name => {

        if(Name.textContent.toLocaleLowerCase().trim().includes(inputValue)){
    
            console.log(Name.textContent) 
        }
    })
})