// import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="bg-[#FF8C00] text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
               <p className='dark:text-white font-bold'>W</p>
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Wispr</span>
            </div>
        </>
    );
}
