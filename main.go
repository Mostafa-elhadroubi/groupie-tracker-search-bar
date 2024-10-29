package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	// "strconv"
	"strings"
)
type Artist struct {
	Artists string `json:"artists"`
	Locations string `json:"locations"`
	Dates string `json:"dates"`
	Relation string `json:"relation"`
}
// var artist Artist
type  ArtistResponse struct {
	ID int `json:"id"`
	Name string `json:"name"`
	Image string `json:"image"`
	Members []string `json:"members"`
	CreationDate int  `json:"creationDate"`
	FirstAlbum string `json:"firstAlbum"`
	Location []string
	Date  []string
}

type Locations struct {
	Id int `json:"id"`
	Locations []string `json:"locations"`
}
type LocationResponse struct {
	Index []Locations `json:"index"`
}
type Dates struct {
	Id int `json:"id"`
	Dates []string `json:"dates"`
}
type DateResponse struct {
	Index []Dates `json:"index"`
}
type Relation struct {
	Id int `json:"id"`
	Relation map[string][]string `json:"datesLocations"`
}
type  RelationResponse struct {
	Index []Relation `json:"index"`
}
var (
	artist Artist
	artistResponse []ArtistResponse
	locations []Locations
	dates []Dates
	relation  []Relation
	locationResponse LocationResponse
	datesResponse DateResponse
	relationResponse RelationResponse
	id int
	data map[string]any
)

func homePage(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "index.html")
}
func artistPage(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "artists.html")
}
func GetRequest(w http.ResponseWriter, r *http.Request) {
	const myurl = "https://groupietrackers.herokuapp.com/api"
	content := GetContent(myurl)
	json.Unmarshal(content, &artist)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(artist)
	
}
func artistData(w http.ResponseWriter, r *http.Request) {
	content := GetContent(artist.Artists)
	json.Unmarshal(content, &artistResponse)
	locationContent := GetContent(artist.Locations)
	json.Unmarshal(locationContent, &locationResponse)
	locations = locationResponse.Index
	datesContent:= GetContent(artist.Dates)
	json.Unmarshal(datesContent, &datesResponse)
	dates =  datesResponse.Index
	relationContent := GetContent(artist.Relation)
	json.Unmarshal(relationContent, &relationResponse)
	relation = relationResponse.Index
	for i:= range artistResponse {
		artistResponse[i].Location = locations[i].Locations
		artistResponse[i].Date = dates[i].Dates
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(artistResponse)
	// fmt.Printf("%#v\n", artistResponse)
}


func CheckSearchName( substr string, str ...string) bool {
	for i := 0; i < len(str);  i++ {
		if  strings.Contains(strings.ToLower(str[i]), strings.ToLower(substr)){
			return true
		}
	}
	return false
}
func GetContent(myurl string) []byte {
	res, err := http.Get(myurl)
	if err != nil {
		fmt.Println("the error is:",err)
		os.Exit(1)
	}
	defer res.Body.Close()
	content, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	return content
}

func artistDetailPage(w http.ResponseWriter, r *http.Request) {
    http.ServeFile(w, r, "artistDetails.html") // Serve the artistDetails.html
}


func main() {
	fs := http.FileServer(http.Dir("css"))
	http.Handle("/css/", http.StripPrefix("/css", fs))
	http.HandleFunc("/artists.html", artistPage)
	http.HandleFunc("/artistDetails.html", artistDetailPage) // Add this line
	http.HandleFunc("/", homePage)
	http.HandleFunc("/data", GetRequest)
	http.HandleFunc("/artists", artistData)

	fmt.Println("Server running at http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Println(err)
		return
	}

}