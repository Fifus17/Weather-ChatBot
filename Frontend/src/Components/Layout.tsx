import React, { useState } from "react";
import { ReactComponent as ChatIcon } from "@zendeskgarden/svg-icons/src/26/chat.svg";
import { ReactComponent as EmailIcon } from "@zendeskgarden/svg-icons/src/26/email-fill.svg";
import { ReactComponent as SettingsIcon } from "@zendeskgarden/svg-icons/src/26/settings-fill.svg";
import { ReactComponent as PersonIcon } from "@zendeskgarden/svg-icons/src/26/person.svg";
import { PALETTE } from "@zendeskgarden/react-theming";

import "./Layout.css";

import {
  Body,
  Chrome,
  Content,
  Header,
  Nav,
  NavItem,
  NavItemIcon,
  NavItemText,
} from "@zendeskgarden/react-chrome";

import Chat from "./Chat";
import ContactView from "./ContactView";
import SettingsView from "./SettingsView";
import { WeatherType } from "../Enums/WeatherType";
import { WeekDay } from "../Enums/WeekDay";
import LoginView from "./LoginView";

import storm from "../Resources/WeatherAnimatedIcons/thunderstorms.svg";
import RegisterView from "./RegisterView";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../FirebaseSetup/firebase";

const Layout = (props: {
  addChat: () => void;
  localStorageData: any;
  setLocalStorageData: any;
  messages: any;
  ids: string[];
}) => {
  const [nav, setNav] = useState(1);

  const [currentChat, setCurrentChat] = useState(0);

  const [user] = useAuthState(auth);

  // before I add communication with backend, for testing purposes I'll hold messages in this array
  let [chats, setChats] = useState([
    [
      {
        type: "currentWeather",
        data: {
          weather: WeatherType.id202,
          temperature: 20,
          uv: 5, // currently not using but might add later
          wind: 10, // currently not using but might add later
          city: "Bochnia",
          region: "Małopolskie",
          day: true,
          forecastDay: [
            {
              weather: WeatherType.id211,
              temperature: 20,
              date: WeekDay.Tomorrow,
              day: true,
            },
            {
              weather: WeatherType.id313,
              temperature: 20,
              date: WeekDay.Monday,
              day: true,
            },
            {
              weather: WeatherType.id731,
              temperature: 20,
              date: WeekDay.Tuesday,
              day: true,
            },
            {
              weather: WeatherType.id521,
              temperature: 20,
              date: WeekDay.Wednesday,
              day: true,
            },
            {
              weather: WeatherType.id602,
              temperature: 20,
              date: WeekDay.Thursday,
              day: true,
            },
            {
              weather: WeatherType.id701,
              temperature: 20,
              date: WeekDay.Friday,
              day: true,
            },
            {
              weather: WeatherType.id781,
              temperature: 20,
              date: WeekDay.Saturday,
              day: true,
            },
          ],
          forecastHour: [
            {
              weather: WeatherType.id202,
              temperature: 20,
              hour: "13",
              minutes: "00",
              day: true,
            },
            {
              weather: WeatherType.id313,
              temperature: 20,
              hour: "14",
              minutes: "00",
              day: true,
            },
            {
              weather: WeatherType.id313,
              temperature: 20,
              hour: "15",
              minutes: "00",
              day: true,
            },
            {
              weather: WeatherType.id521,
              temperature: 20,
              hour: "16",
              minutes: "00",
              day: true,
            },
            {
              weather: WeatherType.id521,
              temperature: 20,
              hour: "17",
              minutes: "00",
              day: true,
            },
            {
              weather: WeatherType.id300,
              temperature: 20,
              hour: "18",
              minutes: "00",
              day: true,
            },
            {
              weather: WeatherType.id300,
              temperature: 20,
              hour: "19",
              minutes: "00",
              day: true,
            },
            {
              weather: WeatherType.sunset,
              temperature: 20,
              hour: "19",
              minutes: "39",
              day: true,
            },
            {
              weather: WeatherType.id300,
              temperature: 20,
              hour: "20",
              minutes: "00",
              day: false,
            },
            {
              weather: WeatherType.id602,
              temperature: 20,
              hour: "21",
              minutes: "00",
              day: false,
            },
            {
              weather: WeatherType.id701,
              temperature: 20,
              hour: "22",
              minutes: "00",
              day: false,
            },
            {
              weather: WeatherType.id521,
              temperature: 20,
              hour: "23",
              minutes: "00",
              day: false,
            },
            {
              weather: WeatherType.id521,
              temperature: 20,
              hour: "24",
              minutes: "00",
              day: false,
            },
            {
              weather: WeatherType.id602,
              temperature: 20,
              hour: "1",
              minutes: "00",
              day: false,
            },
            {
              weather: WeatherType.id701,
              temperature: 20,
              hour: "2",
              minutes: "00",
              day: false,
            },
            {
              weather: WeatherType.id300,
              temperature: 20,
              hour: "3",
              minutes: "00",
              day: false,
            },
            {
              weather: WeatherType.id300,
              temperature: 20,
              hour: "4",
              minutes: "00",
              day: false,
            },
            {
              weather: WeatherType.id300,
              temperature: 20,
              hour: "5",
              minutes: "00",
              day: false,
            },
            {
              weather: WeatherType.id300,
              temperature: 20,
              hour: "6",
              minutes: "00",
              day: false,
            },
            {
              weather: WeatherType.sunrise,
              temperature: 20,
              hour: "6",
              minutes: "14",
              day: true,
            },
            {
              weather: WeatherType.id300,
              temperature: 20,
              hour: "7",
              minutes: "00",
              day: true,
            },
            {
              weather: WeatherType.id300,
              temperature: 20,
              hour: "8",
              minutes: "00",
              day: true,
            },
            {
              weather: WeatherType.id300,
              temperature: 20,
              hour: "9",
              minutes: "00",
              day: true,
            },
            {
              weather: WeatherType.id300,
              temperature: 20,
              hour: "10",
              minutes: "00",
              day: true,
            },
            {
              weather: WeatherType.id300,
              temperature: 20,
              hour: "11",
              minutes: "00",
              day: true,
            },
            {
              weather: WeatherType.id300,
              temperature: 20,
              hour: "12",
              minutes: "00",
              day: true,
            },
          ],
        },
      },
      {
        text: "bagno bagno bhidsabhoadsbbhsadbhasdhbadoboaisdidsa bdsabohasdbadbaobhsd",
        isUser: true,
        type: "message",
      },
    ],
  ]);

  const render = (id: string | number) => {
    if (id === -1) {
      return <ContactView />;
    } else if (id === -2) {
      return <SettingsView />;
    } else if (id === -3) {
      return <LoginView changeView={setNav} />;
    } else if (id === -5) {
      return <RegisterView changeView={setNav} />;
    } else {
      return (
        <Chat
          messages={
            user && user !== null
              ? props.messages
              : props.localStorageData[currentChat]!.messages
          }
          setChats={setChats}
          id={currentChat}
          docID={props.ids}
          setLocalStorageData={props.setLocalStorageData}
        />
      );
    }
  };

  return (
    <Chrome isFluid hue={PALETTE.blue[800]}>
      <Nav isExpanded={true} aria-label="chrome navigation example nav">
        <NavItem hasLogo className="layout-top-logo">
          <h2>Stormy</h2> {/* TODO change font */}
          <NavItemIcon>
            <img
              src={storm}
              alt="stormy logo"
              style={{ width: "50px", height: "50px" }}
            />
          </NavItemIcon>
        </NavItem>
        <div className="layout-chats-container">
          {user && props.messages
            ? props.messages.map((_chat: any, index: number) => (
                <NavItem
                  style={{ width: "100%" }}
                  isCurrent={nav === index + 1}
                  onClick={() => {
                    setNav(index + 1);
                    setCurrentChat(index);
                  }}
                  key={index}
                >
                  <NavItemIcon>
                    <ChatIcon />
                  </NavItemIcon>
                  <NavItemText>Chat {index + 1}</NavItemText>
                </NavItem>
              ))
            : props.localStorageData.map((_chat: any, index: number) => (
                <NavItem
                  style={{ width: "100%" }}
                  isCurrent={nav === index + 1}
                  onClick={() => {
                    setNav(index + 1);
                    setCurrentChat(index);
                  }}
                  key={index}
                >
                  <NavItemIcon>
                    <ChatIcon />
                  </NavItemIcon>
                  <NavItemText>Chat {index + 1}</NavItemText>
                </NavItem>
              ))}
          <NavItem
            style={{ width: "100%" }}
            isCurrent={nav === -4}
            onClick={() => {
              setNav(
                user
                  ? props.messages.length + 1
                  : props.localStorageData.length + 1
              );
              setCurrentChat(
                user ? props.messages.length : props.localStorageData.length
              );
              props.addChat();
            }}
          >
            <NavItemIcon>
              <ChatIcon />
            </NavItemIcon>
            <NavItemText>New Chat</NavItemText>
          </NavItem>
        </div>
        <NavItem
          className="layout-divider"
          isCurrent={nav === -1}
          onClick={() => setNav(-1)}
        >
          <NavItemIcon>
            <EmailIcon />
          </NavItemIcon>
          <NavItemText>Contact</NavItemText>
        </NavItem>
        {user ? null : (
          <NavItem isCurrent={nav === -3} onClick={() => setNav(-3)}>
            <NavItemIcon>
              <PersonIcon />
            </NavItemIcon>
            <NavItemText>Log in</NavItemText>
          </NavItem>
        )}
        <NavItem isCurrent={nav === -2} onClick={() => setNav(-2)}>
          <NavItemIcon>
            <SettingsIcon />
          </NavItemIcon>
          <NavItemText>Settings</NavItemText>
        </NavItem>
        <NavItem
          hasBrandmark
          title="github"
          className="layout-github"
          style={{ paddingTop: "0px" }}
        >
          <NavItemIcon>
            <img
              src={storm}
              alt="storm"
              style={{ width: "50px", height: "50px" }}
            />
          </NavItemIcon>
        </NavItem>
      </Nav>
      <Body>
        <Header style={{ backgroundColor: "#f0f3f7" }} />
        <Content id="example-navigation-main-content">{render(nav)}</Content>
      </Body>
    </Chrome>
  );
};

export default Layout;
