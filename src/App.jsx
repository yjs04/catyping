import Header from "./components/Header";
import TypingPractice from "./components/TypingPractice";
import Footer from "./components/Footer";
import "./style.css";

const App = () => {
    return (
        <div id="wrap">
            <Header />
            <TypingPractice />
            <Footer />
        </div>
    );
};

export default App;