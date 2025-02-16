package main

import (
	"fmt"
	"groupieTracker/functions"
	"net/http"
)

func main() {
	http.HandleFunc("/", functions.Artists)
	http.HandleFunc("/api/artists/", functions.GetArtistsData)
	http.HandleFunc("/artist/{id}", functions.ArtistDetails)
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("js"))))
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("css"))))
	
	fmt.Println("Server is running on: http//www.localhost:8085")
	if err := http.ListenAndServe(":8085", nil); err != nil {
		fmt.Println(err.Error())
		return
	}
	
}
