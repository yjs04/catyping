import React, { useEffect, useState, useRef, useCallback } from "react";

const TypingPractice = () => {
    const [language, setLanguage] = useState("ko"); // 기본 영어
    const [langList, setLangList] = useState({
        "en" : "https://quoteslate.vercel.app/api/quotes/random",
        "ko" : "https://korean-advice-open-api.vercel.app/api/advice"
    });
    const [isComposing, setIsComposing] = useState(false);
    const [targetText, setTargetText] = useState("");
    const [inputText, setInputText] = useState("");
    const [authorText, setAuthorText] = useState("");
    const [statusList, setStatusList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [result, setResult] = useState({ cpm: "-", wpm: "-", accuracy: "-" });

    const hiddenInputRef = useRef(null);

    // 랜덤 문장 불러오기
    const loadNewQuote = useCallback(async () => {
        try {
            const res = await fetch(langList[language]);
            const data = await res.json();
            const quote = language === "ko" ? data?.message : data?.quote.replace("’", "'") || "문장을 불러오지 못했습니다.";
            const author = data?.author || "";
            
            setTargetText(quote);
            setAuthorText(author);
            setInputText("");
            setStatusList(Array(quote.length).fill("default"));
            setCurrentIndex(0);
            setStartTime(null);
            setResult({ cpm: "-", wpm: "-", accuracy: "-" });
        } catch (err) {
            setTargetText("문장을 불러오지 못했습니다.");
        }
    }, []);

    useEffect(() => {
        loadNewQuote();
    }, []);

    const handleCompositionStart = () => {
        setIsComposing(true); // 한글 조합 시작
      };
      
      const handleCompositionEnd = (e) => {
        setIsComposing(false); // 조합 끝
        const inputValue = e.currentTarget.textContent;
        const newChar = inputValue.charAt(inputValue.length - 1);
        setInputText(inputText + newChar);
        processChar(newChar); // 완성된 한글 문자만 처리
      };

    const handleInput = (e) => {
        if (isComposing) return;

        const inputValue = e.currentTarget.textContent;
        const newChar = inputValue.charAt(inputValue.length - 1); // 마지막 입력 문자
        setInputText(inputText + newChar);

        processChar(newChar);
    };

    const processChar = (inputChar) => {
        if (!targetText || currentIndex >= targetText.length) return; // targetText가 없으면 뒤로

        if (currentIndex === 0 && !startTime) {
            setStartTime(Date.now());
        }

        // 업데이트 관련
        const updated = [...statusList];

        const newIndex = inputText.length + 1;
        setStatusList(updated);
        setCurrentIndex(newIndex);

        updated[currentIndex] =
        inputChar === targetText[currentIndex] ? "correct" : "incorrect"; // 해당 글자 수의 텍스트가 맞는지 확인 후 correct 여부 확인     

        // 실시간 결과 계산
        const elapsed = (Date.now() - (startTime || Date.now())) / 1000;
        const wpm = elapsed > 0 ? Math.round((newIndex / 5 / elapsed) * 60) : 0;
        const cpm = elapsed > 0 ? Math.round((newIndex / elapsed) * 60) : 0;
        const correctCount = updated.filter((s) => s === "correct").length;
        const acc = Math.round((correctCount / newIndex) * 100);
        setResult({ cpm, wpm, acc });
    }

    const handleKeyDown = (e) => {
        if (e.code == "Space" && !isComposing) {
            e.preventDefault();

            setInputText(inputText + " ");
            console.log(inputText);
            // 👉 onCompositionEnd가 먼저 실행될 수 있도록 지연 처리
            setTimeout(() => {
                processChar(" ");
            }, 0);
        }

        if (e.key === "Enter" && currentIndex >= targetText.length) {
            e.currentTarget.textContent = "";
            setInputText("");
            loadNewQuote();
        }

        console.log(e.key, e.code);

        if (e.key == "Backspace" || e.code == "Backspace") {
            const inputValue = e.currentTarget.textContent;
            if (e.key == "Process") {
                const newChar = inputValue.charAt(inputValue.length - 1);
                console.log(inputText.substring(0, inputText.length - 1));
                
            } else {
                setInputText(inputValue);
            }
            console.log(inputText, inputValue);

            setCurrentIndex(inputText.length);
            const updated = [...statusList];
            updated[currentIndex] = "default";
            setStatusList(updated);
            // console.log(inputText);
            // console.log(statusList, currentIndex);
        }
    }

    return (
        <div id="content">
            <div id="typing_result">
                <div className="typing_box">
                    <p><span>CPM</span><span id="cpm">{result.cpm}</span></p>
                </div>
                <div className="typing_box">
                    <p><span>WPM</span><span id="wpm">{result.wpm}</span></p>
                </div>
                <div className="typing_box">
                    <p><span>ACC</span><span id="acc">{isNaN(result.acc) ? "-" : result.acc + "%"}</span></p>
                </div>
            </div>
            <div id="typing_area" onClick={() => hiddenInputRef.current.focus()}>
                {
                    targetText.split("").map((char, i) => (
                        <span key={i} className={`char ${statusList[i]}`}>{inputText[i] === undefined ? char : inputText[i]}</span>
                    ))
                }
            </div>
            {/* 숨겨진 contentEditable 입력 영역 */}
            <div
                ref={hiddenInputRef}
                contentEditable
                onInput={handleInput}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                onKeyDown={handleKeyDown}
                style={{
                    position: "absolute",
                    opacity: 0,
                    pointerEvents: "none",
                }}
            />
            <p id="quotation">{authorText}</p>
            {currentIndex >= targetText.length && (
                <p id="next_words">Please press enter to see the next sentence↵</p>
            )}
        </div>    
    );
}

export default TypingPractice;