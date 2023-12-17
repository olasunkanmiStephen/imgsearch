import { useState, FormEvent, ChangeEvent } from 'react';
import '../Component/Mapp.css';
import Axios from 'axios';

interface UnsplashImage {
  id: string;
  urls: {
    small: string;
  };
}

function App() {
  const [generatedImages, setGeneratedImages] = useState<UnsplashImage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const fetchImages = () => {
    Axios.get(`https://api.unsplash.com/search/photos?page=${page}&query=${searchTerm}&client_id=O2ovLYkYrLJpv4y60ZXqBxy_pIXrFru5m-gae6wyh-k`)
      .then((res) => {
        if (res.data.results.length > 0) {
          setGeneratedImages((prevImages) => [...prevImages, ...res.data.results]);
          setPage((prevPage) => prevPage + 1);
        } else {
          console.warn('No more images found for the given search term.');
        }
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGeneratedImages([]);
    setPage(1);
    fetchImages();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h1>Image search engine</h1>
      <form id="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search anything here..."
          id="search-box"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button type="submit">Search</button>
      </form>
      <div id="search-result">
        {generatedImages.map((image) => (
          <img key={image.id} src={image.urls.small} alt={`Generated ${image.id}`} />
        ))}
      </div>
      {generatedImages.length > 0 && ( // Conditionally render the "Show more" button
        <button id="show-more-btn" onClick={fetchImages}>
          Show more
        </button>
      )}
    </div>
  );
}

export default App;
