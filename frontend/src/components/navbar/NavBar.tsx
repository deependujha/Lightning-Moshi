"use client";
import React from "react";
import { Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenuItem, NavbarMenu, NavbarContent, NavbarItem, Link } from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo"
import LoginComponent from "@/components/navbar/LoginComponent";
import LogoutComponent from '@/components/navbar/LogoutComponent';

const NavBarComponent = () => {
	const [ isMenuOpen, setIsMenuOpen ] = React.useState( false );
	const [ loginStatus, setLoginStatus ] = React.useState( false );

	const changeLoginStatus = ( status: boolean ) => {
		setLoginStatus( status );
	}

	const menuItems = [
		"Home",
		"App",
		"Performance",
		"Architecture",
		"System",
		"Deployments",
		"My Settings",
		"Team Settings",
		"Help & Feedback",
		"Log Out",
	];

	return (
		<Navbar
			isBordered={ true }
			isMenuOpen={ isMenuOpen }
			onMenuOpenChange={ setIsMenuOpen }
		>
			<NavbarContent className="sm:hidden" justify="start">
				<NavbarMenuToggle aria-label={ isMenuOpen ? "Close menu" : "Open menu" } />
			</NavbarContent>

			<NavbarContent className="sm:hidden pr-3" justify="center">
				<NavbarBrand>
					<AcmeLogo />
					<p className="font-bold text-inherit">DEEP</p>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				<NavbarBrand>
					<AcmeLogo />
					<p className="font-bold text-inherit">DEEP</p>
				</NavbarBrand>
				<NavbarItem>
					<Link color="foreground" href="#">
						Features
					</Link>
				</NavbarItem>
				<NavbarItem isActive>
					<Link href="#" aria-current="page">
						Customers
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link color="foreground" href="#">
						Integrations
					</Link>
				</NavbarItem>
			</NavbarContent>

			<NavbarContent justify="end">
				<NavbarItem>
					{ !loginStatus ?
						<LoginComponent changeLoginStatus={ changeLoginStatus } />
						:

						<LogoutComponent changeLoginStatus={ changeLoginStatus } />
					}
				</NavbarItem>
			</NavbarContent>

			<NavbarMenu>
				{ menuItems.map( ( item, index ) => (
					<NavbarMenuItem key={ `${item}-${index}` }>
						<Link
							className="w-full"
							color={
								index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
							}
							href="#"
							size="lg"
						>
							{ item }
						</Link>
					</NavbarMenuItem>
				) ) }
			</NavbarMenu>
		</Navbar>
	);
}

export default NavBarComponent;



