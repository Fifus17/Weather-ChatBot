import React, { useState } from "react";
import { Row, Col } from "@zendeskgarden/react-grid";
import { Toggle, Label, Field } from "@zendeskgarden/react-forms";
import { ReactComponent as ProductIcon } from "@zendeskgarden/svg-icons/src/26/garden.svg";
import { ReactComponent as ChatIcon } from "@zendeskgarden/svg-icons/src/26/chat.svg";
import { ReactComponent as EmailIcon } from "@zendeskgarden/svg-icons/src/26/email-fill.svg";
import { ReactComponent as SettingsIcon } from "@zendeskgarden/svg-icons/src/26/settings-fill.svg";
import { ReactComponent as ZendeskIcon } from "@zendeskgarden/svg-icons/src/26/zendesk.svg";
import { PALETTE } from "@zendeskgarden/react-theming";
import { convertToMatrix } from "@zendeskgarden/container-utilities";

import {
  Body,
  Chrome,
  CollapsibleSubNavItem,
  Content,
  Header,
  Main,
  Nav,
  NavItem,
  NavItemIcon,
  NavItemText,
  SubNav,
  SubNavItem,
  SubNavItemText,
  SkipNav,
} from "@zendeskgarden/react-chrome";
import Chat from "./Chat";
import MyColorSwatch from "./MyColorSwatch";

const Layout = () => {
  const [nav, setNav] = useState("nav-1");
  const [appliedColor, setAppliedColor] = useState(PALETTE.green[400]);

  const [currentChat, setCurrentChat] = useState(1);

  let [chats, setChats] = useState([
    [{
      text: "bagno bagno",
      isUser: false,
    },
    {
      text: "bagno bagno bhidsabhoadsbbhsadbhasdhbadoboaisdidsa bdsabohasdbadbaobhsd",
      isUser: true,
    },
    {
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore omnis, quam voluptatum quaerat voluptatem libero voluptatibus officiis porro labore odit voluptas distinctio saepe nulla? Alias assumenda provident magni quam ratione.",
      isUser: false,
    },
    {
      text: "bagno bagno",
      isUser: false,
    },],
    [{
      text: "bagno bagno",
      isUser: false,
    },
    {
      text: "bagno bagno bhidsabhoadsbbhsadbhasdhbadoboaisdidsa bdsabohasdbadbaobhsd",
      isUser: true,
    },],
    []
  ]);
  // I might need to pull the state of the messages to the layout component, and then pass them to the chat components

  return (
    <Chrome isFluid hue={PALETTE.blue[800]}>
      <Nav isExpanded={true} aria-label="chrome navigation example nav">
        <NavItem hasLogo>
          <NavItemIcon>
            {/* TODO add name / name and logo of our chatbot */}
            <ProductIcon style={{color: PALETTE.green[400]}}/>
          </NavItemIcon>
        </NavItem>
        {chats.map( (chat, index) =>
        <NavItem isCurrent={nav === `nav-${index+1}`} onClick={() => {setNav(`nav-${index+1}`); setCurrentChat(index)}}>
          <NavItemIcon>
            <ChatIcon />
          </NavItemIcon>
          <NavItemText>Chat {index+1}</NavItemText>
        </NavItem>
        )}
        <NavItem isCurrent={nav === `nav-${chats.length+1}`} onClick={() => setNav(`nav-${chats.length+1}`)}>
          <NavItemIcon>
            <EmailIcon />
          </NavItemIcon>
          <NavItemText>Contact</NavItemText>
        </NavItem>
        <NavItem isCurrent={nav === `nav-${chats.length+2}`} onClick={() => setNav(`nav-${chats.length+2}`)}>
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
        <Content id="example-navigation-main-content">
          <Chat appliedColor={appliedColor} messages={chats[currentChat]}/>
        </Content>
      </Body>
    </Chrome>
  );
};

export default Layout;
