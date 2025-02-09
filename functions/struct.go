package functions

var (
	artistAPI   = "https://groupietrackers.herokuapp.com/api/artists"
	locationAPI = "https://groupietrackers.herokuapp.com/api/locations/"
	relationAPI = "https://groupietrackers.herokuapp.com/api/relation/"
	dateAPI     = "https://groupietrackers.herokuapp.com/api/dates/"
)

var artist []Artist

type Artist struct {
	Id               int      `json:"id"`
	Image            string   `json:"image"`
	Name             string   `json:"name"`
	Members          []string `json:"members"`
	CreationDate     int      `json:"creationDate"`
	FirstAlbum       string   `json:"firstAlbum"`
	Locations        string
	ConcertDates     string
	Relations        string
	RelationsMap     map[string][]string
	LocationsData    Location
}

var location Location

type Location struct {
	Id        int      `json:"id"`
	Locations []string `json:"locations"`
}

var date Date

type Date struct {
	Id    int      `json:"id"`
	Dates []string `json:"dates"`
}

var relation Relation

type Relation struct {
	Id        int                 `json:"id"`
	Relations map[string][]string `json:"datesLocations"`
}
