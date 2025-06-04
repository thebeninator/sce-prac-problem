import NewEntryForm from "./components/NewEntryForm";
import EntryFeed from "./components/EntryFeed";
import {useState, useEffect} from "react";
import key from "./ApiKey";

const App = () => {
    const [entries, setEntries] = useState([]);
    const [feedActive, setFeedActive] = useState(false);
    const [address, setAddress] = useState("");
    const [timeMS, setTimeMS] = useState(0);

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
    
    return (<div className="container">        
        <NewEntryForm doStartFeed={ startFeed } doStopFeed={ stopFeed }/> 
        <EntryFeed entries={ entries }/>
    </div>);
}

export default App;