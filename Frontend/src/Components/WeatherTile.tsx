import React from "react";

import { WeatherType } from "../Enums/WeatherType";
import { WeatherTypeIcons } from "../Enums/WeatherTypeIcons";
import { WeekDay } from "../Enums/WeekDay";

import "./WeatherTile.css";

const WeatherTile = (props: {
  weather: WeatherType;
  icon: WeatherTypeIcons;
  temperature: number;
  date: WeekDay;
}) => {
    return (
        <div className="weather-tile">
            <img className="weather-tile-icon" src={props.icon} />
            <h1 className="weather-tile-temperature">{props.temperature}°C</h1>
            <h1 className="weather-tile-date">{props.date}</h1>
        </div>
    );
};

export default WeatherTile;