import { useState } from "react"; 

const NewEntryForm = ({ doStartFeed, doStopFeed }) => {
    const [symbol, setSymbol] = useState("");
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0); 
    const [savedSymbol, setSavedSymbol] = useState("");

    const onSubmit = (e) =>  {
        e.preventDefault();

        if (typeof doStartFeed !== "function") {
            throw new Error("NewEntryForm component was not passed a valid doStartFeed function");
        }

        if (typeof doStopFeed !== "function") {
            throw new Error("NewEntryForm component was not passed a valid doStopFeed function");
        }

        if (symbol !== "" && (minutes + seconds > 0)) {
            doStartFeed(symbol, minutes, seconds, savedSymbol !== symbol);
            console.log("Feed started");
        } else {
            doStopFeed(symbol === "");
            console.log("Feed stopped");
        }

        setSavedSymbol(symbol);
    }

    return (<form onSubmit = { onSubmit }>           
        <div>
            <label>Symbol</label>
            <input type="text" 
                onChange = { (e) => {
                    setSymbol(e.target.value.toUpperCase())
                }}
            />
        </div>

        <div>
            <label>Minutes</label>
            <input type="number" 
                onChange = { (e) => setMinutes(e.target.value) }   
                defaultValue={0}
            />
        </div>

        <div>
            <label>Seconds</label>
            <input type="number" 
                onChange = { (e) => setSeconds(e.target.value) } 
                defaultValue={0}
            />
        </div>

        <div>
            <input type="submit" />
        </div>
    </form>)
}

export default NewEntryForm; 