import './App.css';
import Form from './components/Form/index.jsx';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

  const [presentEvents, setPresentEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
 
  const getAllEvents = async () => {
    let response = await axios.get('http://localhost:8081/getEventListings');
    const eventListings = await response?.data;
    setUpcomingEvents(eventListings.upcomingEvents);
    setPresentEvents(eventListings.presentEvents);
  }

  
  const postEventData =(bodyFormData)=>{
    const myurl= 'http://localhost:8081/addEventData';
    axios({
      method: 'POST',
      url: myurl,
      data: bodyFormData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    })
    .then(response => {
      getAllEvents();
    })
    .catch(err => {
      console.log(err);
    });
  };
  
  const handleJoinAction = (el) => {
    let bodyFormData = new URLSearchParams();
    bodyFormData.append("eventId", el.eventId);
    bodyFormData.append('customers', 1);
    postEventData(bodyFormData);
  };

  const handleLikeAction = (el) => {
    let bodyFormData = new URLSearchParams();
    bodyFormData.append("eventId", el.eventId);
    bodyFormData.append('likes', 1);
    postEventData(bodyFormData);
  };

  const handleDonateAction = (el) => {
    let bodyFormData = new URLSearchParams();
    bodyFormData.append("eventId", el.eventId);
    bodyFormData.append('donations', 100);
    postEventData(bodyFormData);
  };


  useEffect(() => {
    getAllEvents();
  }, []);

  return (
    <>
      <div>
        <h4>Register Event</h4>
        <Form
          getAllEvents={getAllEvents} />
      </div>
      <div>
        <h4>Events</h4>
        <div>
          <h5>Today's Events</h5>
          <div style={{ display: 'flex', flexFlow: 'wrap' }}>
            {presentEvents.map((el, i) => {
              return <div className='event-box' key={i}>
                <p><b>Event Title :</b> {el.event}</p>
                <p><b>Date :</b>{el.date.split('T')[0]}</p>
                <p><b>Start Time :</b>{el.startTime}</p>
                <p><b>End Time :</b>{el.endTime}</p>
                <div>
                  <button type="button" onClick={() => handleJoinAction(el)}>Join</button>
                  <span>{el.customers} already joined</span>
                </div>
                <div>
                  <button type="button" onClick={() => handleLikeAction(el)}> Like </button>
                  <span>{el.likes} likes</span>
                </div>
                <div>
                  <button type="button" onClick={() => handleDonateAction(el)}>Donate</button>
                  <span>{el.donations} donations received yet</span>
                </div>
              </div>
            })}
          </div>
        </div>
        <div>
          <h5>Upcoming Events</h5>
          <div style={{ display: 'flex', flexFlow: 'wrap' }}>
            {upcomingEvents.map((el, i) => {
              return <div className='event-box' key={i}>
                <p><b>Event Title :</b> {el.event}</p>
                <p><b>Date :</b>{el.date.split('T')[0]}</p>
                <p><b>Start Time :</b>{el.startTime}</p>
                <p><b>End Time :</b>{el.endTime}</p>
              </div>
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
