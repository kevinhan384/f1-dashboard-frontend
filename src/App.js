import { PureComponent, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import Header from './Header';
import Footer from './Footer';
import DriverDropdown from './DriverDropdown';
import YearDropdown from './YearDropdown';
import RaceDropdown from './RaceDropdown';

function App() {
  const baseUrl = 'http://127.0.0.1:8000/visualizations/';

  const [driver1, setDriver1] = useState('');
  const [driver2, setDriver2] = useState('');
  const [race, setRace] = useState('');
  const [year, setYear] = useState(0);

  const [races, setRaces] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [laps, setLaps] = useState([]);
  const [driver1Color, setDriver1Color] = useState('#8884d8');
  const [driver2Color, setDriver2Color] = useState('#82ca9d');

  const [lap, setLap] = useState(1);
  const [tel, setTel] = useState([]);

  const handleYearSelect = async (e) => {
    setYear(e);
    axios.get(baseUrl + `races/${e}/`)
      .then(response => {
        if (response.data) {
          let obj = JSON.parse(response.data);
          let res = [];

          for (const key in obj) {
            res.push(
              {
                id: Number(key),
                label: obj[key],
                value: obj[key]
              }
            );
          }
          setRaces(res);
        }
      })
      .catch(error => {
        setRaces([]);
        console.error('Error fetching the races:', error);
      });;
  };

  const handleRaceSelect = async (e) => {
    setRace(e);
    axios.get(baseUrl + `drivers/${year}/${e}/`)
      .then(response => {
        if (response.data) {
          let obj = JSON.parse(response.data);
          let res = []

          for (const key in obj) {
            let val = JSON.parse(obj[key]);
            res.push(
              {
                id: Number(val['DriverNumber']),
                label: val['FullName'],
                value: val['Abbreviation']
              }
            );
          }
          setDrivers(res);
          console.log(drivers);
        }
      })
      .catch(error => {
        setDrivers([]);
        console.error('Error fetching the drivers:', error);
      });;
  };

  const handleLapsButton = async () => {
    axios.get(baseUrl + `laps/${year}/${race}/${driver1}/${driver2}/`)
      .then(response => {
        if (response.data) {
          let data = JSON.parse(response.data);

          setLaps(data['positions']);
          setDriver1Color(data['colorDriver1']);
          setDriver2Color(data['colorDriver2']);
        }
      })
      .catch(error => {
        setLaps([]);
        console.error('Error fetching the laps:', error);
      });;
  }

  const handleLapSelect = (e) => {
    axios.get(baseUrl + `tel/${year}/${race}/${driver1}/${driver2}/${e.activeLabel}/`)
      .then(response => {
        if (response.data) {
          let data = JSON.parse(response.data);

          setTel(data['tel']);
          setDriver1Color(data['colorDriver1']);
          setDriver2Color(data['colorDriver2']);
        }
      })
      .catch(error => {
        setTel([]);
        console.error('Error fetching the telemetry:', error);
      });;
  }

  return (
    <div className="App">
      <Header />
      <div className='intro'>
        <p>Welcome to F1 Driver Comparison! With this app, you can compare two drivers head-to-head with past statistics and telemetry data.</p>
      </div>

      <div className='year'>
        <YearDropdown onSelect={handleYearSelect} />
      </div>

      <div className='race'>
        {races.length !== 0 && <RaceDropdown dropdownOptions={races} onSelect={handleRaceSelect} />}
      </div>

      <div className="content">
        <div className='driver1'>
          <div className='input1'>
            {drivers.length !== 0 && <DriverDropdown dropdownOptions={drivers} onSelect={setDriver1} />}
          </div>

          {/* <div className='driver1image'>
            {driver1.length !== 0 &&
              <img src={require("./driver-images/" + driver1 + ".avif")} />
            }
          </div> */}
        </div>

        <div className='driver2'>
          <div className='input2'>
            {drivers.length !== 0 && <DriverDropdown dropdownOptions={drivers} onSelect={setDriver2} />}
          </div>

          {/* <div className='driver2image'>
            {driver2.length !== 0 &&
              <img src={require("./driver-images/" + driver2 + ".avif")} />
            }
          </div> */}
        </div>

      </div>

      {driver1.length !== 0 && driver2.length !== 0 && <button type='button' onClick={handleLapsButton}>Click me!</button>}

      <div style={{ width: "500px", height: "300px" }}>
        {laps.length !== 0 &&
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={laps} onClick={handleLapSelect}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Lap" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="driver1Position" stroke={driver1Color} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="driver2Position" stroke={driver2Color} />
            </LineChart>
          </ResponsiveContainer>}
      </div>

      <div style={{ width: "500px", height: "300px" }}>
        {tel.length !== 0 &&
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tel}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="distance" minTickGap={9999999} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="speedDriver1" stroke={driver1Color} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="speedDriver2" stroke={driver2Color} />
            </LineChart>
          </ResponsiveContainer>}
      </div>

      <Footer />
    </div>
  );

}

export default App;
