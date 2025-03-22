
// Welcoming Page Component
// import './WelcomingPage.css';

import { useNavigate } from 'react-router-dom'; 
import { Card } from 'primereact/card';

function WelcomingPage() {
  
  const navigate = useNavigate();
  return (
    <div className="welcome-container">
      <h1>Welcome to MySaaS</h1>
      <p>Find skilled professionals or offer your expertise.</p>
      <div className="options">
      <button onClick={() => navigate('/')}>Go to Landing Page</button>
        <button className="work-btn">Do Work</button>
        <button className="hire-btn">Get Work Done</button>
      </div>
      <Card title="Simple Card" style={{ width: '25rem', marginBottom: '2em' }}>
                <p className="m-0" style={{lineHeight: '1.5'}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt
                    quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!</p>
            </Card>
    </div>
  );
}

export default WelcomingPage;
