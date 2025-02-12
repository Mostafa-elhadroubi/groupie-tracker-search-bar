package functions

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"text/template"
)


func Artists(w http.ResponseWriter, r *http.Request) {
	tmp, err := template.ParseFiles("./html/artists.html")
	if err != nil {
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}
	response, err := http.Get(artistAPI)
	if err != nil {
		http.Error(w, "Failed to fetch artist data", http.StatusInternalServerError)
		return
	}
	content, err := io.ReadAll(response.Body)
	if err != nil {
		http.Error(w, "Failed to read response", http.StatusInternalServerError)
		return
	}
	defer response.Body.Close()
	if err := json.Unmarshal(content, &artist); err != nil {
		http.Error(w, "Failed to unmarshal JSON", http.StatusInternalServerError)
		return
	}
	if err := tmp.Execute(w, artist); err != nil {
		http.Error(w, "Failed to execute template", http.StatusInternalServerError)
	}
}
// Add this function to your `functions` package
func GetArtistsData(w http.ResponseWriter, r *http.Request) {
    response, err := http.Get(artistAPI)
    if err != nil {
        http.Error(w, "Failed to fetch artist data", http.StatusInternalServerError)
        return
    }
    content, err := io.ReadAll(response.Body)
    if err != nil {
        http.Error(w, "Failed to read response", http.StatusInternalServerError)
        return
    }
    defer response.Body.Close()

    if err := json.Unmarshal(content, &artist); err != nil {
        http.Error(w, "Failed to unmarshal JSON", http.StatusInternalServerError)
        return
    }
	var wg sync.WaitGroup
	wg.Add(len(artist)) // Add the number of artists to the WaitGroup

	// Use a mutex to safely update the artist slice concurrently
	var mu sync.Mutex

	// Fetch location data for each artist concurrently
	for i := 0; i < len(artist); i++ {
		go func(i int) {
			defer wg.Done() // Mark the goroutine as done when it finishes

			// Fetch location data
			contentLocation := GetContent(w, locationAPI, strconv.Itoa(i+1))
			// var location Location
			if err := json.Unmarshal(contentLocation, &location); err != nil {
				fmt.Println("Error unmarshaling location data:", err)
				return
			}

			// Safely update the artist slice
			mu.Lock()
			if artist[i].Id == location.Id {
				artist[i].Locations = strings.Join(location.Locations, " ")
			}
			// if i < len(artist) { // Ensure the index is within bounds
            //     if location.Locations != nil && len(location.Locations) >= 0 {
            //         artist[i].Locations = strings.Join(location.Locations, " ")
            //     } else {
            //         artist[i].Locations = "" // Set empty string if Locations is nil or empty
            //     }
            // }
			mu.Unlock()
		}(i)
	}

	// Wait for all goroutines to finish
	wg.Wait()
    w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(artist); err != nil {
        http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
    }
}


func ArtistDetails(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		fmt.Println("errr11111111")
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return 
	}
	tmp, err := template.ParseFiles("./html/artistDetails.html")
	if err != nil {
		fmt.Println("errr99999999999")
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}

	strId := strings.TrimPrefix(r.URL.Path, "/artist/")
	id, err := strconv.Atoi(strId)
	if err != nil {
		fmt.Println("err222222")
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	if id < 1 && id > len(artist) {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	contentLocation := GetContent(w, locationAPI, strId)
	err = json.Unmarshal(contentLocation, &location)
	if err != nil {
		fmt.Println("errr33333333")
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	
	contentDate := GetContent(w, dateAPI, strId)
	err = json.Unmarshal(contentDate, &date)
	if err != nil {
		fmt.Println("errr4444444444")
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	
	contentRelation := GetContent(w, relationAPI, strId)
	err = json.Unmarshal(contentRelation, &relation)
	if err != nil {
		fmt.Println("err5555555")
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	artist[id-1].Locations = strings.Join(location.Locations, " ")
	artist[id-1].ConcertDates = strings.Join(date.Dates, " ")
	artist[id-1].RelationsMap = relation.Relations

	err = tmp.Execute(w, artist[id-1])
	if err != nil {
        fmt.Println("Error executing template:", err)
        http.Error(w, "Internal Server Error", http.StatusInternalServerError)
    }
}


func GetContent(w http.ResponseWriter, API string, strId string) []byte {
	response, err := http.Get(API+strId)
		if err != nil {
			fmt.Println("errr66666666")
			http.Error(w, "Failed to fetch artist data", http.StatusInternalServerError)
			panic(0)
		}
		content, err := io.ReadAll(response.Body)
		if err != nil {
			fmt.Println("err7777777777")
			http.Error(w, "Failed to read artist data", http.StatusInternalServerError)
			panic(0)
		}
		return content
}