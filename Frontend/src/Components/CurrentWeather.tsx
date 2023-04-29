import React, { useContext, useReducer, useState } from "react";
import { Row, Col } from "@zendeskgarden/react-grid";

// import styles from "./CurrentWeather.module.css";
import "./CurrentWeather.css";
import { WeatherType } from "../Enums/WeatherType";
import WeatherTile from "./WeatherTile";
import { WeekDay } from "../Enums/WeekDay";

// Weather icons, to be moved to utils class with whole function
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
import ColorContext from "../States/color-context";
import MobileContext from "../States/mobile-context";

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
    case "sunrise":
      return sunrise;
    case "sunset":
      return sunset;
  }
};

const CurrentWeather = (props: {
  forecast: any;
  weather: number; // openweatherapi weather id
  temperature: number; // in celsius for now, later might add option to change between C and F (change made in frontend)
  uv?: number; // currently not used, but might add this information in the future
  wind?: number; // currently not used, but might add this information in the future
  city: string; // name of the city
  region?: string; // name of the region if provided
  day: boolean; // day or night, icons styling depends on that
  forecastDay: {
    weather: number; // openweatherapi weather id
    temperature: number; // in celsius for now, later might add option to change between C and F (change made in frontend)
    date: string; // "enum" {Today, Tomorrow, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday}
  }[];
  forecastHour: {
    weather: number; // openweatherapi weather id
    temperature: number; // in celsius for now, later might add option to change between C and F (change made in frontend)
    hour: string; // hour in string XX 24 hours format i.e. '07', '22'
    minutes: string; // minutes in string XX fromat i.e. '03', '38'
    day: boolean; // day or night, icons styling depends on that
  }[];
}) => {
  const [selectedItem, setSelectedItem] = useState(props.forecast);
  const colorContext = useContext(ColorContext);
  const mobileContext = useContext(MobileContext);

  return (
    <div className="currentWeatherWrapper">
      <div
        className="currentWeatherContainer"
        style={mobileContext.isMobile ? { width: "80%" } : { width: "60%" }}
      >
        <Row justifyContent="between">
          <h1
            className="currentWeatherCityName"
            style={mobileContext.isMobile ? { fontSize: "16px" } : {}}
          >
            {props.city}, {props.region}
          </h1>
          {/* <ButtonGroup
            className="currentWeatherButtonGroup"
            selectedItem={selectedItem}
            onSelect={setSelectedItem}
            // style={mobileContext.isMobile ? {width: '80px'} : {}}
          > */}
          {/* <Button
              className={
                selectedItem === "calendar"
                  ? `currentWeather-${colorContext.name} currentWeather-${colorContext.name}-selected`
                  : `currentWeather-${colorContext.name}`
              }
              size="small"
              value="calendar"
              // style={mobileContext.isMobile ? { height: "24px" } : {}}
            >
              <div
                className="currentWeatherCalendarIcon"
                style={
                  mobileContext.isMobile
                    ? { height: "10px", width: "10px" }
                    : {}
                }
              ></div>
            </Button> */}
          {/* <Button
              className={
                selectedItem === "clock"
                  ? `currentWeather-${colorContext.name} currentWeather-${colorContext.name}-selected`
                  : `currentWeather-${colorContext.name}`
              }
              size="small"
              value="clock"
              // style={mobileContext.isMobile ? { height: "24px" } : {}}
            >
              <div
                className="currentWeatherClockIcon"
                style={
                  mobileContext.isMobile
                    ? { height: "10px", width: "10px" }
                    : {}
                }
              ></div>
            </Button>
          </ButtonGroup> */}
          <div
            className={`currentWeatherButtonGroup currentWeather-${colorContext.name}`}
          >
            <div
              className={
                selectedItem === "calendar"
                  ? `currentWeather-${colorContext.name} currentWeather-${colorContext.name}-selected`
                  : `currentWeather-${colorContext.name}`
              }
              style={mobileContext.isMobile ? {margin: '0px', borderRight: 'none', padding: '5px', cursor: 'pointer'} : { margin: "0px", borderRight: "none", padding: "10px", cursor: 'pointer' }}
              onClick={() => setSelectedItem("calendar")}
            >
              <div
                className="currentWeatherCalendarIcon"
                style={
                  mobileContext.isMobile
                    ? { height: "10px", width: "10px" }
                    : {}
                }
              ></div>
            </div>
            <div
              className={
                selectedItem === "clock"
                  ? `currentWeather-${colorContext.name} currentWeather-${colorContext.name}-selected`
                  : `currentWeather-${colorContext.name}`
              }
              style={mobileContext.isMobile ? {margin: '0px', borderLeft: 'none', padding: '5px', cursor: 'pointer'} : { margin: "0px", borderLeft: "none", padding: "10px", cursor: 'pointer' }}
              onClick={() => setSelectedItem("clock")}
            >
              <div
                className="currentWeatherClockIcon"
                style={
                  mobileContext.isMobile
                    ? { height: "10px", width: "10px" }
                    : {}
                }
              ></div>
            </div>
          </div>
        </Row>
        <Row>
          <Col>
            <Row justifyContent="center">
              <img
                className="currentWeatherIcon"
                src={getIcon(props.weather, props.day)}
                alt="current-weather-icon"
                style={
                  mobileContext.isMobile
                    ? { width: "80px", height: "80px" }
                    : { width: "200px", height: "200px" }
                }
              />
            </Row>
          </Col>
          <Col>
            <Row>
              <h1
                className="currentWeatherTemperature"
                style={
                  mobileContext.isMobile
                    ? { fontSize: "36px" }
                    : { fontSize: "100px" }
                }
              >
                {props.temperature}°C{" "}
              </h1>
            </Row>
          </Col>
        </Row>
        <hr className="currentWeatherHorizontalLine" />
        {selectedItem === "calendar" ? (
          <div className={"currentWeatherForecastContainer"}>
            {props.forecastDay.map((item, index) => {
              return (
                <WeatherTile
                  weather={item.weather}
                  temperature={item.temperature}
                  date={item.date}
                  type={WeatherForecastType.day}
                  icon={getIcon}
                  key={index}
                ></WeatherTile>
              );
            })}
          </div>
        ) : (
          <div
            className={
              selectedItem === "clock"
                ? "currentWeatherScrollAnimation currentWeatherForecastContainer"
                : "currentWeatherForecastContainer"
            }
          >
            {props.forecastHour.map((item, index) => {
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
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentWeather;
