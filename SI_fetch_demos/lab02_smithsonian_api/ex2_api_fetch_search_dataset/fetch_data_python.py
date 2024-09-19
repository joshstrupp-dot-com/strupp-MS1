def generate_smithsonian_query(api_key, rows=100, sort='relevancy', search_term=None, **kwargs):
    """
    Generates a Smithsonian API query URL based on provided query parameters, with an additional
    search_term parameter for broader searches.
    
    Args:
    api_key (str): Your API key for the Smithsonian API.
    rows (int): The number of results to return. Default is 100.
    sort (str): Sorting of results ('relevancy', 'id', 'newest', 'updated', 'random'). Default is 'relevancy'.
    search_term (str): A broad search term not tied to any specific field.
    **kwargs: Other arbitrary keyword arguments representing query parameters like unit_code, place, etc.
    
    Returns:
    str: A Smithsonian API query URL.
    """
    
    base_url = "https://api.si.edu/openaccess/api/v1.0/search?q="
    
    # Building the query string from kwargs
    query_parts = []
    for key, value in kwargs.items():
        query_parts.append(f"{key}:{value}")
    
    # Adding the broad search term if provided
    if search_term:
        query_parts.append(search_term)  # Add search term without any specific field binding
    
    # Joining query parameters with '+AND+'
    query_string = '+AND+'.join(query_parts)
    
    # Constructing the final URL
    query_url = f"{base_url}{query_string}&api_key={api_key}&rows={rows}&sort={sort}"
    
    return query_url

# Example usage:
api_key = ""
params = {
    "unit_code": "NASM",      # Unit code for museum
    # "online_media_rights": "No Restrictions",      # Media rights, e.g., "No Restrictions"
    # "object_type": "Aircraft",                   # Type of object
    # "language": "English",                   # Language from the vocabulary list
    # "topic": "Peasants",         # Topic of the object
    "place": "Brazil",                       # Geographic place
    # "date": "1980s"                          # Date in normalized form
}

# You can now add a broad search term like "Skull"
query_url = generate_smithsonian_query(api_key, search_term="fuel", **params)
print(query_url)








# // ACAH: Archives Center, National Museum of American History
# // ACM: Anacostia Community Museum
# // CFCHFOLKLIFE: Smithsonian Center for Folklife and Cultural Heritage
# // CHNDM: Cooper-Hewitt, National Design Museum
# // FBR: Smithsonian Field Book Project
# // FSA: Freer Gallery of Art and Arthur M. Sackler Gallery Archives
# // FSG: Freer Gallery of Art and Arthur M. Sackler Gallery
# // HAC: Smithsonian Gardens
# // HMSG: Hirshhorn Museum and Sculpture Garden
# // HSFA: Human Studies Film Archives
# // NAA: National Anthropological Archives
# // NASM: National Air and Space Museum
# // NMAAHC: National Museum of African American History and Culture
# // NMAfA: Smithsonian National Museum of African Art
# // NMAH: Smithsonian National Museum of American History
# // NMAI: National Museum of the American Indian
# // NMNHANTHRO: NMNH - Anthropology Dept.
# // NMNHBIRDS: NMNH - Vertebrate Zoology - Birds Division
# // NMNHBOTANY: NMNH - Botany Dept.
# // NMNHEDUCATION: NMNH - Education & Outreach
# // NMNHENTO: NMNH - Entomology Dept.
# // NMNHFISHES: NMNH - Vertebrate Zoology - Fishes Division
# // NMNHHERPS: NMNH - Vertebrate Zoology - Herpetology Division
# // NMNHINV: NMNH - Invertebrate Zoology Dept.
# // NMNHMAMMALS: NMNH - Vertebrate Zoology - Mammals Division
# // NMNHMINSCI: NMNH - Mineral Sciences Dept.
# // NMNHPALEO: NMNH - Paleobiology Dept.
# // NPG: National Portrait Gallery
# // NPM: National Postal Museum
# // SAAM: Smithsonian American Art Museum
# // SI: Smithsonian Institution, Digitization Program Office
# // SIA: Smithsonian Institution Archives
# // SIL: Smithsonian Libraries