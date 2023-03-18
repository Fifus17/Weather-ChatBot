import React, { useState } from "react";
import { Row, Col } from "@zendeskgarden/react-grid";
import { Toggle, Label, Field } from "@zendeskgarden/react-forms";
import { ReactComponent as ProductIcon } from "@zendeskgarden/svg-icons/src/26/garden.svg";
import { ReactComponent as HomeIcon } from "@zendeskgarden/svg-icons/src/26/home-fill.svg";
import { ReactComponent as EmailIcon } from "@zendeskgarden/svg-icons/src/26/email-fill.svg";
import { ReactComponent as SettingsIcon } from "@zendeskgarden/svg-icons/src/26/settings-fill.svg";
import { ReactComponent as ZendeskIcon } from "@zendeskgarden/svg-icons/src/26/zendesk.svg";
import { PALETTE } from "@zendeskgarden/react-theming";
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

const Layout = () => {
  const [nav, setNav] = useState("nav-1");

  return (
    <Chrome
      isFluid
      hue={PALETTE.blue[800]}
    >
      <Nav isExpanded={true} aria-label="chrome navigation example nav">
        <NavItem hasLogo>
          <NavItemIcon>
            {/* TODO add name / name and logo of our chatbot */}
            <ProductIcon style={{ color: PALETTE.green[400] }} />
          </NavItemIcon>

        </NavItem>
        <NavItem isCurrent={nav === "nav-1"} onClick={() => setNav("nav-1")}>
          <NavItemIcon>
            <HomeIcon />
          </NavItemIcon>
          <NavItemText>Home</NavItemText>
        </NavItem>
        <NavItem isCurrent={nav === "nav-2"} onClick={() => setNav("nav-2")}>
          <NavItemIcon>
            <EmailIcon />
          </NavItemIcon>
          <NavItemText>Email</NavItemText>
        </NavItem>
        <NavItem isCurrent={nav === "nav-3"} onClick={() => setNav("nav-3")}>
          <NavItemIcon>
            <SettingsIcon />
          </NavItemIcon>
          <NavItemText>Settings</NavItemText>
        </NavItem>
        <NavItem hasBrandmark title="Zendesk">
          <NavItemIcon>
            {/* TODO add chatbot logo */}
            <ZendeskIcon />
          </NavItemIcon>
        </NavItem>
      </Nav>
      <Body>
        <Header />
        <Content id="example-navigation-main-content">
          <Chat/>
        </Content>
      </Body>
    </Chrome>
  );
};

export default Layout;
