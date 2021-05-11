import React, { useState, useEffect } from 'react';
import '../styles/Restaurant.css';

function Hours(props) {
  const { hours } = props;
  const [today, setToday] = useState('');
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const d = new Date();
    const n = d.getDay();
    setToday(days[n]);
  }, [])

  function handleHours(s) {
    if (s === undefined) {
      return 'Closed';
    }
    const parts = s.split('-');
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].length === 4) {
        parts[i] = parts[i] + '0';
      } else if (parts[i].length === 3) {
        parts[i] = '0' + parts[i] + '0';
      } 
    }
    return parts.join(' - ');
  }

  return (
    <div id="hours">
      <table>
      {
        days.map((day, i)=>(
          <tr key={i} className={day === today ? "open" : "closed"}>
            <td>
              {day}
            </td>
            <td></td>
            <td className="hours">
              {handleHours(hours[day])}
            </td>
          </tr>
        ))
      }
      </table>
    </div>
  )
}

export default Hours;