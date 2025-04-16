export const calcWPM = (text, timeInSeconds) => {
    const words = text.trim().split("/\s+/").length;
    return Math.round((words / timeInSeconds));
};

export const calcACC = (target, input) => {
    let correct = 0;
    for (let i = 0; i < input.length; i++) {
        if (target[i] === input[i]) {
            correct++;
        }
    }
    return ((correct / target.length) * 100).toFixed(2);
}