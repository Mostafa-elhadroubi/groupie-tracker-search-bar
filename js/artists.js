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
//  fetchData()

input.addEventListener('input', async() => {
    const inputValue = input.value.toLowerCase()
    const dataArtist = await fetchData()
    console.log(dataArtist)
    artistParent.innerHTML = ''
    dataArtist.forEach(obj => {
        let Name = obj.name.toLowerCase().includes(inputValue)
        if(Name){  
            console.log(obj.name) 
        }
        let location =  obj.Locations
        location.split(' ') .forEach(location => {
            if(location.toLowerCase().includes(inputValue)) {
                console.log(location)
            }
        })
        let date = obj.creationDate.toString().includes(inputValue)
         if (date) {
            console.log(obj.creationDate)
        } 
        let firstAlbum = obj.firstAlbum.toLowerCase().includes(inputValue)
        if (firstAlbum) {
            console.log(obj.firstAlbum)
        } 
        let members = obj.members
        members.forEach(member => {
            if(member.toLowerCase().includes(inputValue)) {
                console.log(member)
            }
        })
        if(Name || location.toLowerCase().includes(inputValue) || date || firstAlbum || members.join(" ".toLowerCase().includes(inputValue))) {
                artistParent.innerHTML += `
                <div class="artistCard" id="${obj.id}">
                <img src="${obj.image}" alt="${obj.image}" loading="lazy">
                <div class="name">${obj.name}</div>
            </div>
                `
        }
    })

})

/*
input.addEventListener('input', async() => {
    const inputValue = input.value.toLowerCase()
    const dataArtist = await fetchData()
    console.log(dataArtist)
    artistParent.innerHTML = ''  // Clear previous results

    // Loop through the artist data
    dataArtist.forEach(obj => {
        const Name = obj.name.toLowerCase().includes(inputValue);
        const location = obj.Locations.toLowerCase();
        const date = obj.creationDate.toString().includes(inputValue);
        const firstAlbum = obj.firstAlbum.toLowerCase().includes(inputValue);
        const membersMatch = obj.members.some(member => member.toLowerCase().includes(inputValue));

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
    });
});

*/