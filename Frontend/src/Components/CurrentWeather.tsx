import React, { useState } from "react";
import { Row, Col } from "@zendeskgarden/react-grid";

import styles from "./CurrentWeather.module.css";
import { WeatherType } from "../Enums/WeatherType";
import WeatherTile from "./WeatherTile";
import { WeekDay } from "../Enums/WeekDay";

// Weather icons
import id200d from "../Resources/WeatherAnimatedIcons/thunderstorms-day-rain.svg";
import id200n from "../Resources/WeatherAnimatedIcons/thunderstorms-night-rain.svg";
import id201 from "../Resources/WeatherAnimatedIcons/thunderstorms-rain.svg";
import id202 from "../Resources/WeatherAnimatedIcons/thunderstorms-extreme-rain.svg";
import id210d from "../Resources/WeatherAnimatedIcons/thunderstorms-day.svg";
import id210n from "../Resources/WeatherAnimatedIcons/thunderstorms-night.svg";
import id211 from "../Resources/WeatherAnimatedIcons/thunderstorms.svg";
import id300d from "../Resources/WeatherAnimatedIcons/partly-cloudy-day-drizzle.svg";
import id300n from "../Resources/WeatherAnimatedIcons/partly-cloudy-night-drizzle.svg";
import id301 from "../Resources/WeatherAnimatedIcons/drizzle.svg";
import id302 from "../Resources/WeatherAnimatedIcons/extreme-drizzle.svg";
import id500d from "../Resources/WeatherAnimatedIcons/partly-cloudy-day-rain.svg";
import id500n from "../Resources/WeatherAnimatedIcons/partly-cloudy-night-rain.svg";
import id501 from "../Resources/WeatherAnimatedIcons/rain.svg";
import id502 from "../Resources/WeatherAnimatedIcons/extreme-rain.svg";
import id600d from "../Resources/WeatherAnimatedIcons/partly-cloudy-day-snow.svg";
import id600n from "../Resources/WeatherAnimatedIcons/partly-cloudy-night-snow.svg";
import id601 from "../Resources/WeatherAnimatedIcons/snow.svg";
import id611d from "../Resources/WeatherAnimatedIcons/partly-cloudy-day-sleet.svg";
import id611n from "../Resources/WeatherAnimatedIcons/partly-cloudy-night-sleet.svg";
import id613 from "../Resources/WeatherAnimatedIcons/sleet.svg";
import id616 from "../Resources/WeatherAnimatedIcons/extreme-sleet.svg";
import id701 from "../Resources/WeatherAnimatedIcons/mist.svg";
import id711 from "../Resources/WeatherAnimatedIcons/smoke.svg";
import id721 from "../Resources/WeatherAnimatedIcons/haze.svg";
import id731 from "../Resources/WeatherAnimatedIcons/dust-wind.svg";
import id741 from "../Resources/WeatherAnimatedIcons/fog.svg";
import id751 from "../Resources/WeatherAnimatedIcons/dust.svg";
import id771 from "../Resources/WeatherAnimatedIcons/hurricane.svg";
import id781 from "../Resources/WeatherAnimatedIcons/tornado.svg";
import id800d from "../Resources/WeatherAnimatedIcons/clear-day.svg";
import id800n from "../Resources/WeatherAnimatedIcons/clear-night.svg";
import id801d from "../Resources/WeatherAnimatedIcons/partly-cloudy-day.svg";
import id801n from "../Resources/WeatherAnimatedIcons/partly-cloudy-night.svg";
import id802d from "../Resources/WeatherAnimatedIcons/overcast-day.svg";
import id802n from "../Resources/WeatherAnimatedIcons/overcast-night.svg";
import id803 from "../Resources/WeatherAnimatedIcons/cloudy.svg";
import id804 from "../Resources/WeatherAnimatedIcons/overcast.svg";
import sunset from "../Resources/WeatherAnimatedIcons/sunset.svg";
import sunrise from "../Resources/WeatherAnimatedIcons/sunrise.svg";

import { WeatherForecastType } from "../Enums/WeatherForecastType";
import { Button, ButtonGroup } from "@zendeskgarden/react-buttons";

// Parser from weather id to icon, should be moved to util file
const getIcon = (id: WeatherType, day: boolean) => {
  switch (id) {
    case 200:
    case 230:
      return day ? id200d : id200n;
    case 201:
    case 231:
      return id201;
    case 202:
    case 232:
      return id202;
    case 210:
      return day ? id210d : id210n;
    case 211:
    case 212:
    case 221:
      return id211;
    case 300:
      return day ? id300d : id300n;
    case 301:
    case 310:
    case 311:
      return id301;
    case 302:
    case 312:
    case 313:
    case 314:
    case 321:
      return id302;
    case 500:
      return day ? id500d : id500n;
    case 501:
    case 511:
    case 520:
    case 521:
      return id501;
    case 502:
    case 503:
    case 504:
    case 522:
    case 531:
      return id502;
    case 600:
      return day ? id600d : id600n;
    case 601:
    case 602:
      return id601;
    case 611:
    case 612:
      return day ? id611d : id611n;
    case 613:
    case 615:
    case 620:
      return id613;
    case 616:
    case 621:
    case 622:
      return id616;
    case 701:
      return id701;
    case 711:
      return id711;
    case 721:
      return id721;
    case 731:
      return id731;
    case 741:
      return id741;
    case 751:
    case 761:
    case 762:
      return id751;
    case 771:
      return id771;
    case 781:
      return id781;
    case 800:
      return day ? id800d : id800n;
    case 801:
      return day ? id801d : id801n;
    case 802:
      return day ? id802d : id802n;
    case 803:
      return id803;
    case 804:
      return id804;
    case 'sunrise': return sunrise;
    case 'sunset': return sunset;
  }
};

const CurrentWeather = (props: {
  weather: WeatherType;
  temperature: number;
  uv: number;
  wind: number;
  city: string;
  region: string;
  day: boolean;
  forecastDay: {
    weather: WeatherType;
    temperature: number;
    date: WeekDay;
    day: boolean;
  }[]
  forecastHour: {
    weather: WeatherType;
    temperature: number;
    hour: string;
    minutes: string;
    day: boolean;
  }[]
}) => {
  const [selectedItem, setSelectedItem] = useState("calendar");

  return (
    <div className={styles.currentWeatherWrapper}>
      <div className={styles.currentWeatherContainer}>
        <Row justifyContent="between">
          <h1 className={styles.currentWeatherCityName}>
            {props.city}, {props.region}
          </h1>
          <ButtonGroup className={styles.currentWeatherButtonGroup} selectedItem={selectedItem} onSelect={setSelectedItem}>
            <Button className={styles.currentWeatherForecastTypeButton} size="small" value="calendar">
              <div className={styles.currentWeatherCalendarIcon}></div>
            </Button>
            <Button className={styles.currentWeatherForecastTypeButton} size="small" value="clock">
              <div className={styles.currentWeatherClockIcon}></div>
            </Button>
          </ButtonGroup>
        </Row>
        <Row>
          <Col>
            <Row justifyContent="center">
              <img
                className={styles.currentWeatherIcon}
                src={getIcon(props.weather, props.day)}
                alt="current-weather-icon"
              />
            </Row>
          </Col>
          <Col>
            <Row>
              <h1 className={styles.currentWeatherTemperature}>
                {props.temperature}°C {/*{props.degrees (C, F, K) to pewnie będzie jakiś stan tak jak kolor i potencjalnie font}*/}
              </h1>
            </Row>
            {/* <Row >
                <Col>
                  <img src="https://raw.githubusercontent.com/basmilius/weather-icons/0985c712ee2e07b269053ff6ffd86ef79c016e3a/production/line/svg/uv-index.svg" alt="uv" className="current-weather-uv-icon"/>
                  <h1 className="current-weather-uv">{props.uv}</h1>
                </Col>
              </Row> */}
          </Col>
        </Row>
        <hr className={styles.currentWeatherHorizontalLine} />
        <div className={styles.currentWeatherForecastContainer}>
          {selectedItem === 'calendar' ? 
          <>{props.forecastDay.map((item, index) => {
            return (
              <WeatherTile
                weather={item.weather}
                temperature={item.temperature}
                date={item.date}
                day={item.day}
                type={WeatherForecastType.day}
                icon={getIcon}
                key={index}
              ></WeatherTile>
            );
          })}</> : <>{props.forecastHour.map((item, index) => {
            return (
              <WeatherTile
                weather={item.weather}
                temperature={item.temperature}
                date={item.hour + ":" + item.minutes}
                day={item.day}
                type={WeatherForecastType.hour}
                icon={getIcon}
                key={index}
              ></WeatherTile>
            );
          })}</>}
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
