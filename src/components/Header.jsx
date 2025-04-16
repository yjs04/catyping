import campaign from "../asset/svg/campaign.svg"
import light_svg from "../asset/svg/light_mode.svg"
import dark_svg from "../asset/svg/dark_mode.svg"

const Header = ({}) => {
    return (
        <header>
            <a href="/" id="logo">catyping</a>
            <nav>
                <a href="/sign-up">Sign up</a>
                <a href="/sign-in">Sign in</a>
                <button id="notice_btn"><img src={campaign} alt="notice_btn" /></button>
                <button id="light_btn"><img src={light_svg} alt="light_mode_btn" /></button>
            </nav>
        </header>
    );
};

export default Header;