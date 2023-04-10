import React from "react";
import { WeatherForecastType } from "../Enums/WeatherForecastType";

import { WeatherType } from "../Enums/WeatherType";
import { WeekDay } from "../Enums/WeekDay";

import "./WeatherTile.css";

const WeatherTile = (props: {
  weather: WeatherType;
  type: WeatherForecastType;
  icon: (id: WeatherType, day: boolean) => any;
  temperature: number;
  date: string;
  day: boolean;
}) => {
    return (
        <div className="weather-tile">
            <img className="weather-tile-icon" src={props.icon(props.weather, props.day)} alt="weather icon"/>
            <h1 className="weather-tile-temperature">{props.temperature}°C</h1>
            <h1 className="weather-tile-date">{props.date}</h1>
        </div>
    );
};

export default WeatherTile;