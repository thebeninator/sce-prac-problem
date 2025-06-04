import {useState, useEffect} from "react";
import key from "./ApiKey";

const App = () => {
    const [entries, setEntries] = useState([]);
    const [feedActive, setFeedActive] = useState(false);
    const [address, setAddress] = useState("");

    const [symbol, setSymbol] = useState("");
    const [savedSymbol, setSavedSymbol] = useState("");
    
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0); 
    const [timeMS, setTimeMS] = useState(0);

    const onSubmit = (e) =>  {
        e.preventDefault();

        if (symbol !== "" && (minutes + seconds > 0)) {
            startFeed(symbol, minutes, seconds, savedSymbol !== symbol);
            console.log("Feed started");
        } else {
            stopFeed(symbol === "");
            console.log("Feed stopped");
        }

        setSavedSymbol(symbol);
    }

    const fetchStockData = (address) => {
        fetch(address, {
            headers: { "Accept": "application/json" },
        })
        .then(res => res.json())
        .then(data => setEntries(entries => {
            data.t = new Date(Date.now()).toISOString();
            return [...entries, data];
        }))
        .catch(error => console.log(error));     
    }

    const startFeed = (symbol, minutes, seconds, newSymbol) => {
        let address = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=` + key;
        let ms = (minutes * 60 * 1000) + (seconds * 1000);
        if (ms < 3000) {
            ms = 3000;
        }
        
        // nts: these are async 
        setAddress(address);
        setTimeMS(ms);

        if (newSymbol) {
            console.log("New symbol: refreshing list");
            stopFeed(true);
        }
        
        fetchStockData(address);
        
        setFeedActive(true);
    }

    const stopFeed = (clearEntries) => {
        setFeedActive(false);
        if (clearEntries) {
            setEntries([]);
        }
    }

    useEffect(() => {
        if (!feedActive) {
            return;
        }

        const interval = setInterval(() => {
            fetchStockData(address);
        }, timeMS);

        return () => clearInterval(interval); 
    }, [feedActive, timeMS, address]);
    
    return (<div>        
        <form onSubmit = { onSubmit }>           
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
        </form> 
        
        <table>
            <thead>
                <tr>
                    <th>Open Price</th>
                    <th>High Price</th>
                    <th>Low Price</th>
                    <th>Current Price</th>
                    <th>Previous Close Price</th>
                    <th>Time</th>
                </tr>
            </thead>

            <tbody>{
                entries.map( (entry, index) => ( 
                    <tr key={index}>
                        <td>${ entry.o }</td>
                        <td>${ entry.h }</td>
                        <td>${ entry.l }</td>
                        <td>${ entry.c }</td>
                        <td>${ entry.pc }</td>
                        <td>{ entry.t }</td>
                    </tr> )
                )
            }</tbody>
        </table>
    </div>);
}

export default App;