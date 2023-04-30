import React, { useContext, useEffect, useState } from "react";
import { ReactComponent as ChatIcon } from "@zendeskgarden/svg-icons/src/26/chat.svg";
import { ReactComponent as EmailIcon } from "@zendeskgarden/svg-icons/src/26/email-fill.svg";
import { ReactComponent as SettingsIcon } from "@zendeskgarden/svg-icons/src/26/settings-fill.svg";
import { ReactComponent as PersonIcon } from "@zendeskgarden/svg-icons/src/26/person.svg";
import { ReactComponent as OpenNavIcon } from "@zendeskgarden/svg-icons/src/26/arrange-content.svg";
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
import MobileContext from "../States/mobile-context";

const Layout = (props: {
  addChat: () => void;
  localStorageData: any;
  setLocalStorageData: any;
  messages: any;
  ids: string[];
}) => {
  const [nav, setNav] = useState(1);

  const mobileContext = useContext(MobileContext);

  const [currentChat, setCurrentChat] = useState(0);

  const [isNavOpened, setIsNavOpened] = useState(!mobileContext.isMobile);

  const [user] = useAuthState(auth);

  useEffect(() => {
    setIsNavOpened(!mobileContext.isMobile);
  }, [mobileContext])

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
          id={currentChat}
          docID={props.ids}
          setLocalStorageData={props.setLocalStorageData}
        />
      );
    }
  };

  return (
    <Chrome isFluid hue={PALETTE.blue[800]}>
      <Nav isExpanded={isNavOpened} aria-label="chrome navigation example nav">
        {!mobileContext.isMobile ? (
          <NavItem hasLogo className="layout-top-logo">
            <h2>Stormy</h2>
            <NavItemIcon>
              <img
                src={storm}
                alt="stormy logo"
                style={{ width: "50px", height: "50px" }}
              />
            </NavItemIcon>
          </NavItem>
        ) : (
          <NavItem
            hasLogo
            className="layout-mobile-open-nav"
            onClick={() => setIsNavOpened(!isNavOpened)}
          >
            <NavItemIcon>
              <OpenNavIcon />
            </NavItemIcon>
          </NavItem>
        )}
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
