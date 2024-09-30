"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo";
import LoginComponent from "@/components/navbar/LoginComponent";
import LogoutComponent from "@/components/navbar/LogoutComponent";

type MenuItem = {
  name: string;
  href: string;
  color:
    | "primary"
    | "foreground"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined;
};

const NavBarComponent = () => {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [loginStatus, setLoginStatus] = React.useState(false);

  const changeLoginStatus = (status: boolean) => {
    setLoginStatus(status);
    console.log(`set login status: ${status}`);
  };
  const menuItems: MenuItem[] = [
    { name: "Home", href: "/", color: "foreground" },
    { name: "App", href: "/app", color: "primary" },
    { name: "Performance", href: "/performance", color: "secondary" },
    { name: "Architecture", href: "/architecture", color: "primary" },
    { name: "Send me a msg", href: "/send-me-a-msg", color: "secondary" },
  ];

  return (
    <Navbar
      isBordered={true}
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand
          className="hover:cursor-pointer"
          onClick={() => router.push("/")}
        >
          <AcmeLogo />
          <p className="font-bold text-inherit">DEEP</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand
          className="hover:cursor-pointer"
          onClick={() => router.push("/")}
        >
          <AcmeLogo />
          <p className="font-bold text-inherit">DEEP</p>
        </NavbarBrand>
        <NavbarItem>
          <Link color="foreground" href="/">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="/app" aria-current="page">
            App
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/performance">
            Performance
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/architecture">
            Architecture
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/send-me-a-msg">
            Send me a msg
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          {!loginStatus ? (
            <LoginComponent changeLoginStatus={changeLoginStatus} />
          ) : (
            <LogoutComponent changeLoginStatus={changeLoginStatus} />
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="pt-14">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full font-semibold"
              color={item.color}
              href={item.href}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          {!loginStatus ? (
            <Link
              className="w-full text-pink-600"
              href="#"
              size="lg"
              onClick={() => changeLoginStatus(true)}
            >
              Sign In
            </Link>
          ) : (
            <Link
              className="w-full text-red-600"
              href="#"
              size="lg"
              onClick={() => changeLoginStatus(false)}
            >
              Logout
            </Link>
          )}
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default NavBarComponent;
