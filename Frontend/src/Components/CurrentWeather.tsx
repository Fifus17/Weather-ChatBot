import React from "react";
import { Row, Col } from '@zendeskgarden/react-grid';

import "./CurrentWeather.css";
import { WeatherTypeIcons } from "../Enums/WeatherTypeIcons";
import { WeatherType } from "../Enums/WeatherType";
import WeatherTile from "./WeatherTile";
import { WeekDay } from "../Enums/WeekDay";

const CurrentWeather = (props: {
  weather: WeatherType;
  temperature: number;
  uv: number;
  wind: number;
  city: string;
  region: string;
  icon: WeatherTypeIcons;
  forecast: {
    weather: WeatherType;
    temperature: number;
    date: WeekDay;
    icon: WeatherTypeIcons;
  }[];
}) => {
    return (
      <div className="current-weather-wrapper">
        <div className="current-weather-container">
          <Row>
          <h1 className="current-weather-city-name">{props.city}, {props.region}</h1>
          </Row>
          <Row>
            <Col>
              <Row justifyContent='center'>
                <img className="current-weather-icon" src={props.icon} alt="current-weather-icon"/>
              </Row>
            </Col>
            <Col>
              <Row>
                <h1 className="current-weather-temperature">{props.temperature}°C</h1>
              </Row>
              {/* <Row >
                <Col>
                  <img src="https://raw.githubusercontent.com/basmilius/weather-icons/0985c712ee2e07b269053ff6ffd86ef79c016e3a/production/line/svg/uv-index.svg" alt="uv" className="current-weather-uv-icon"/>
                  <h1 className="current-weather-uv">{props.uv}</h1>
                </Col>
              </Row> */}
            </Col>
          </Row>
          <hr className="current-weather-horizontal-line"/>
          <div className="current-weather-forecast-container">
            {props.forecast.map((item, index) => {
              return (
                <WeatherTile 
                  weather={item.weather}
                  temperature={item.temperature}
                  date={item.date}
                  icon={item.icon}
                  key={index}
                ></WeatherTile>
              );
            })}
          </div>
        </div>
      </div>
    );
};

export default CurrentWeather;