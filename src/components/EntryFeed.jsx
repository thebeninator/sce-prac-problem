import Entry from "./Entry";

const EntryFeed = ({ entries }) => {
    return (<table>
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
            entries.map( 
                (entry, index) => ( <Entry key={index} entryData={entry}/> )
            )
        }</tbody>
    </table>);
}

export default EntryFeed;