import React, { useContext } from "react";
import { WeatherForecastType } from "../Enums/WeatherForecastType";

import { WeatherType } from "../Enums/WeatherType";
import { WeekDay } from "../Enums/WeekDay";
import MobileContext from "../States/mobile-context";

import "./WeatherTile.css";

const WeatherTile = (props: {
  weather: number;
  type: WeatherForecastType;
  icon: (id: number, day: boolean) => any;
  temperature: number;
  date: string;
  day?: boolean;
}) => {
  const mobileContext = useContext(MobileContext);

  return (
    <div className="weather-tile">
      <img
        className="weather-tile-icon"
        src={props.icon(props.weather, props.day ? props.day : true)}
        alt="weather icon"
        style={mobileContext.isMobile ? {width: '50px', height: '50px'} : {width: '100px', height: '100px'}}
      />
      <h1 className="weather-tile-temperature" style={mobileContext.isMobile ? {fontSize: '14px'} : {fontSize: '20px'}}>{props.temperature}°C</h1>
      <h1 className="weather-tile-date" style={mobileContext.isMobile ? {fontSize: '8px'} : {fontSize: '15px'}}>{props.date}</h1>
    </div>
  );
};

export default WeatherTile;
