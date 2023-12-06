import React from 'react';
import axios from 'axios';

const Form = ({getAllEvents}) => {
const handleSubmit=(e)=>{
     e.preventDefault();
     const event  = e.target.event.value;
     const repeatType = e.target.repeatType.value;
     const fromDate = e.target.fromDate.value;
     const toDate = e.target.toDate.value;
     const startTime = e.target.startTime.value;
     const endTime = e.target.endTime.value;

    const bodyFormData = new URLSearchParams();

    bodyFormData.append('event',event);
    bodyFormData.append("repeatType",repeatType);
    bodyFormData.append('fromDate',fromDate);
    bodyFormData.append('toDate',toDate);
    bodyFormData.append('startTime',startTime);
    bodyFormData.append('endTime',endTime);

    axios.post('http://localhost:8081/registerEvent',bodyFormData)
      .then(response=>{
          console.log(response?.data);
          getAllEvents();
    })
      .catch(err=>console.log(err));

} 
  return (
    <>
    <div>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor='event'>
                    <span>Event</span>
                    <input type='text' name='event' id='event'/>
                </label>
            </div>

            <div>
            <label htmlFor='repeatTytpe'>
                <span>Repeat Type: </span>
                <select name='repeatTytpe' id='repeatType'>
                <option value='daily'>Daily</option>
                <option value='weekly'>Weekly</option>
                <option value='monthly'>Monthly</option>
                </select> 
            </label>
            </div>

            <div>
                <label htmlFor='fromDate'>
                    <span>Start Date</span>
                    <input type='date' name='fromDate' id='fromDate'/>
                </label>
            </div>

            <div>
                <label htmlFor='toDate'>
                    <span>End Date</span>
                    <input type='date' name='toDate' id='toDate'/>
                </label>
            </div>

            <div>
                <label htmlFor='startTime'>
                    <span>Start Time:</span>
                    <input type='time' name='startTime' id='startTime'/>
                </label>
            </div>

            <div>
                <label htmlFor='endTime'>
                    <span>End Time</span>
                    <input type='time' name='endTime' id ='endTime'/>
                </label>
            </div>

            <div>
                <button type='submit'>Save Event</button>
            </div>
        </form>
    </div>
    </>
  )
}

export default Form;