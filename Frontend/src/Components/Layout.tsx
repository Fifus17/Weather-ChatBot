import React, { useState } from "react";
import { ReactComponent as ProductIcon } from "@zendeskgarden/svg-icons/src/26/garden.svg";
import { ReactComponent as ChatIcon } from "@zendeskgarden/svg-icons/src/26/chat.svg";
import { ReactComponent as EmailIcon } from "@zendeskgarden/svg-icons/src/26/email-fill.svg";
import { ReactComponent as SettingsIcon } from "@zendeskgarden/svg-icons/src/26/settings-fill.svg";
import { ReactComponent as ZendeskIcon } from "@zendeskgarden/svg-icons/src/26/zendesk.svg";
import { PALETTE } from "@zendeskgarden/react-theming";

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
import SettingsColorSwatch from "./SettingsColorSwatch";

const Layout = () => {
  const [nav, setNav] = useState(3);

  const [currentChat, setCurrentChat] = useState(2);

  // before I add communication with backend, for testing purposes I'll hold messages in this array
  let [chats, setChats] = useState([
    [
      {
        text: "bagno bagno",
        isUser: false,
        type: "message",
      },
      {
        text: "bagno bagno bhidsabhoadsbbhsadbhasdhbadoboaisdidsa bdsabohasdbadbaobhsd",
        isUser: true,
        type: "message",
      },
      {
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore omnis, quam voluptatum quaerat voluptatem libero voluptatibus officiis porro labore odit voluptas distinctio saepe nulla? Alias assumenda provident magni quam ratione.",
        isUser: false,
        type: "message",
      },
      {
        text: "bagno bagno",
        isUser: false,
        type: "message",
      },
    ],
    [
      {
        text: "bagno bagno",
        isUser: false,
        type: "message",
      },
      {
        text: "bagno bagno bhidsabhoadsbbhsadbhasdhbadoboaisdidsa bdsabohasdbadbaobhsd",
        isUser: true,
        type: "message",
      },
    ],
    [
      {
        type: "currentWeather",
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
      {
        text: "bagno bagno bhidsabhoadsbbhsadbhasdhbadoboaisdidsa bdsabohasdbadbaobhsd",
        isUser: true,
        type: "message",
      },
    ],
  ]);

  const render = (id: string | number) => {
    if (id === chats.length + 1) {
      return <ContactView />;
    } else if (id === chats.length + 2) {
      return <SettingsView />;
    } else {
      return (
        <Chat
          messages={chats[currentChat]}
          setChats={setChats}
          id={currentChat}
          // chats={chats}
        />
      );
    }
  };

  return (
    <Chrome isFluid hue={PALETTE.blue[800]}>
      <Nav isExpanded={true} aria-label="chrome navigation example nav">
        <NavItem hasLogo>
          <NavItemIcon>
            {/* TODO add name / name and logo of our chatbot */}
            <ProductIcon style={{ color: PALETTE.green[400] }} />
          </NavItemIcon>
        </NavItem>
        {chats.map((chat, index) => (
          <NavItem
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
          isCurrent={nav === chats.length + 1}
          onClick={() => setNav(chats.length + 1)}
        >
          <NavItemIcon>
            <EmailIcon />
          </NavItemIcon>
          <NavItemText>Contact</NavItemText>
        </NavItem>
        <NavItem
          isCurrent={nav === chats.length + 2}
          onClick={() => setNav(chats.length + 2)}
        >
          <NavItemIcon>
            <SettingsIcon />
          </NavItemIcon>
          <NavItemText>Settings</NavItemText>
        </NavItem>
        <NavItem hasBrandmark title="Zendesk">
          <NavItemIcon>
            <ZendeskIcon />
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
