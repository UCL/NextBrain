import MainNavigation from "./MainNavigation";

import "./Layout.css";

const Layout: React.FC = (props) => {
	return (
		<>
			<MainNavigation />
			<main className="main">{props.children}</main>
		</>
	);
};

export default Layout;
