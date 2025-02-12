const cards = document.querySelectorAll('.artistCard')
const input = document.getElementById('search')
const boxSuggestion = document.querySelector('.boxSuggestion')
const artistParent = document.querySelector('.artist')
let boxArr = []

const HandleCardClick = (card) => {
    const artistId = card.getAttribute("id")
    window.location.href = `/artist/${artistId}`
}
// cards.forEach(card => {
//     card.addEventListener('click', () => {
//         const artistId = card.getAttribute("id")
//             window.location.href = `/artist/${artistId}`
//     })
// })
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

// input.addEventListener('input', async() => {
//     const inputValue = input.value.toLowerCase()
//     const dataArtist = await fetchData()
//     console.log(dataArtist)
//     artistParent.innerHTML = ''
//     dataArtist.forEach(obj => {
//         let Name = obj.name.toLowerCase().includes(inputValue)
//         if(Name){  
//             console.log(obj.name) 
//         }
//         let location =  obj.Locations
//         location.split(' ') .forEach(location => {
//             if(location.toLowerCase().includes(inputValue)) {
//                 console.log(location)
//             }
//         })
//         let date = obj.creationDate.toString().includes(inputValue)
//          if (date) {
//             console.log(obj.creationDate)
//         } 
//         let firstAlbum = obj.firstAlbum.toLowerCase().includes(inputValue)
//         if (firstAlbum) {
//             console.log(obj.firstAlbum)
//         } 
//         let members = obj.members
//         members.forEach(member => {
//             if(member.toLowerCase().includes(inputValue)) {
//                 console.log(member)
//             }
//         })
//         if(Name || location.toLowerCase().includes(inputValue) || date || firstAlbum || members.join(" ".toLowerCase().includes(inputValue))) {
//                 artistParent.innerHTML += `
//                 <div class="artistCard" id="${obj.id}">
//                 <img src="${obj.image}" alt="${obj.image}" loading="lazy">
//                 <div class="name">${obj.name}</div>
//             </div>
//                 `
//         }
//     })

// })


input.addEventListener('input', async() => {
    const inputValue = input.value.toLowerCase()
    const dataArtist = await fetchData()
    // console.log(dataArtist)
    artistParent.innerHTML = ''  // Clear previous results
    boxSuggestion.innerHTML = ''
    boxArr = []
    // Loop through the artist data
    console.log(boxArr, "before")
    dataArtist.forEach(obj => {
        const Name = obj.name.toLowerCase().includes(inputValue);
        const location = obj.Locations.toLowerCase();
        const date = obj.creationDate.toString().includes(inputValue);
        const firstAlbum = obj.firstAlbum.toLowerCase().includes(inputValue);
        const membersMatch = obj.members.some(member => member.toLowerCase().includes(inputValue));
        if(Name) {
            if(!boxArr.some(item => typeof item === 'string' && item.toLowerCase().includes(Name))) {
                boxArr.push(Name)
            }
        }
        const locationArr = obj.Locations.split(' ')
        // console.log(locationArr)
        locationArr.forEach(location => {
            if (location.toLowerCase().includes(inputValue)) {
                if(!boxArr.some(item =>  typeof item === 'string' && item.toLowerCase().includes(location))) {
                    boxArr.push(location)
                }
            }
        })
        if(date) {
            console.log(boxArr)
            if(!boxArr.some(item => typeof item === 'string' && item.toLowerCase().includes(date))) {
                boxArr.push(date.toString())
            }
        }
        if(firstAlbum) {
            if(!boxArr.some(item => typeof item === 'string' && item.toLowerCase().includes(firstAlbum))) {
                boxArr.push(firstAlbum)
            }
          
        }
        const membersArr = obj.members
        membersArr.forEach(member => {
            if(member.toLowerCase().includes(inputValue)) {
                if(!boxArr.some(item => typeof item === 'string' && item.toLowerCase().includes(member))) {
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
    boxArr.shift();
    boxArr.forEach(item => {
        const suggestion = document.createElement('div')
        suggestion.textContent = `${item}`
        suggestion.classList.add('suggestion')
        boxSuggestion.appendChild(suggestion)
    })

});

