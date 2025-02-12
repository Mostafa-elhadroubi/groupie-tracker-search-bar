const cards = document.querySelectorAll('.artistCard')
const input = document.getElementById('search')
const boxSuggestion = document.querySelector('.boxSuggestion')
const artistParent = document.querySelector('.artist')
let boxArr = []

const HandleCardClick = (card) => {
    const artistId = card.getAttribute("id")
    window.location.href = `/artist/${artistId}`
}

const cardClickEvent = () => {
    const allCards = document.querySelectorAll('.artistCard')
    allCards.forEach(card => {
        card.addEventListener('click', () => HandleCardClick(card))
    })
}
cardClickEvent()
const fetchData = async() => {
    const response = await fetch('/api/artists')
    const resp = await response.json()
// console.log(resp)
    return resp
}
fetchData()


input.addEventListener('input', async() => {
    const inputValue = input.value.toLowerCase()
    const dataArtist = await fetchData()
    artistParent.innerHTML = ''  // Clear previous results
    boxSuggestion.innerHTML = ''
    boxArr = []
    dataArtist.forEach(obj => {
        const Name = obj.name.toLowerCase().includes(inputValue);
        const location = obj.Locations.toLowerCase();
        const date = obj.creationDate.toString().includes(inputValue);
        const firstAlbum = obj.firstAlbum.toLowerCase().includes(inputValue);
        const membersMatch = obj.members.some(member => member.toLowerCase().includes(inputValue));
        console.log(boxArr, "before")
        if(Name) {
            if(!boxArr.some(item => item.toLowerCase().includes(obj.name))) {
                boxArr.push(obj.name)
            }
        }
        const locationArr = obj.Locations.split(' ')
        locationArr.forEach(location => {
            if (location.toLowerCase().includes(inputValue)) {
                if(!boxArr.some(item =>  item.toLowerCase().includes(location))) {
                    boxArr.push(location)
                }
            }
        })
        if(date) {
            console.log(boxArr)
            if(!boxArr.some(item => item.toLowerCase().includes(obj.date.toString()))) {
                boxArr.push(obj.date.toString())
            }
        }
        if(firstAlbum) {
            if(!boxArr.some(item => item.toLowerCase().includes(obj.firstAlbum))) {
                boxArr.push(obj.firstAlbum)
            }
          
        }
        const membersArr = obj.members
        membersArr.forEach(member => {
            if(member.toLowerCase().includes(inputValue)) {
                if(!boxArr.some(item => item.toLowerCase().includes(member))) {
                    boxArr.push(member)
                }
            }
        })
        // Check if any of the conditions match
        if (Name || location.includes(inputValue) || date || firstAlbum || membersMatch) {
            // If it matches, create the artist card and add it to the parent element
            artistParent.innerHTML += `
                <div class="artistCard" id="${obj.id}">
                    <img src="${obj.image}" alt="${obj.image}" loading="lazy">
                    <div class="name">${obj.name}</div>
                </div>
            `;
        }
        console.log(boxArr, "after")
    });
    cardClickEvent();
    boxArr.forEach(item => {
        const suggestion = document.createElement('div')
        suggestion.textContent = `${item}`
        suggestion.classList.add('suggestion')
        boxSuggestion.appendChild(suggestion)
    })

});

