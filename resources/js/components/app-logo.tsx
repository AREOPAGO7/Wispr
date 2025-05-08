// import AppLogoIcon from './app-logo-icon';
import favicon from '../images/favicon.png';

export default function AppLogo() {
    return (
        <>
            <div className=" text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
              <img src={favicon} alt="Wispr Logo" className="size-6 -ml-2"  />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 text- truncate leading-none font-semibold">Wispr</span>
            </div>
        </>
    );
}
