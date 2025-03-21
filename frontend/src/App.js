import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './App.css';

function App() {
  const [content, setContent] = useState([]);
  const [answers, setAnswers] = useState({});
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    axios.get('https://social-cause-backend.onrender.com/api/content')
      .then(res => setContent(res.data))
      .catch(err => console.log('Error fetching content:', err));
  }, []);

  const questions = [
    { id: 'q1', text: 'What matters most to you?', options: ['Environment', 'Health', 'Education'] }
  ];

  const handleAnswer = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const getRecommendation = () => {
    const answer = answers.q1;
    if (answer === 'Environment') setRecommendation(content.find(c => c.title === 'Climate Change 101'));
    else if (answer === 'Health') setRecommendation(content.find(c => c.title === 'Why Clean Water Matters'));
    else if (answer === 'Education') setRecommendation(content.find(c => c.title === 'Education for All'));
  };

  return (
    <div className="App">
      <h1>Social Cause Platform</h1>
      <section>
        <h2>Content Library</h2>
        {content.length === 0 ? (
          <p>Loading...</p>
        ) : (
          content.map(item => (
            <div key={item._id}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <a href={item.link} target="_blank" rel="noopener noreferrer">Learn More</a>
            </div>
          ))
        )}
      </section>
      <section>
        <h2>Interactive Map</h2>
        <MapContainer center={[51.505, -0.09]} zoom={2} className="map-container">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {content.map(item => (
            item.location && (
              <Marker key={item._id} position={[item.location.lat, item.location.lng]}>
                <Popup>{item.title}</Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </section>
      <section>
        <h2>Discover Your Passion</h2>
        {questions.map(q => (
          <div key={q.id}>
            <p>{q.text}</p>
            {q.options.map(opt => (
              <button
                key={opt}
                onClick={() => handleAnswer(q.id, opt)}
                style={{ margin: '5px', background: answers[q.id] === opt ? '#ddd' : '#fff' }}
              >
                {opt}
              </button>
            ))}
          </div>
        ))}
        <button onClick={getRecommendation} style={{ marginTop: '10px' }}>Get Recommendation</button>
        {recommendation && (
          <div>
            <h3>Recommended: {recommendation.title}</h3>
            <p>{recommendation.description}</p>
            <a href={recommendation.link} target="_blank" rel="noopener noreferrer">Learn More</a>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;