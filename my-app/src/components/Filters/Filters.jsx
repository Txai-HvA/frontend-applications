import { React, useState, useEffect } from 'react';
import './Filters.scss';







function Filters() {

    //useStates
    const [isLimit, setLimit] = useState(20);
    const [isUserName, setUserName] = useState("ChaibaFM");
    const periods = ["12month", "6month", "3month", "1month", "7day", "overall"];
    const [isPeriod, setPeriod] = useState(periods[0]);

    //Event handlers
    const limitHandler = (e) => { setLimit(e.target.value); };
    const userNameHandler = (e) => { setUserName(e.currentTarget.value) };
    const periodHandler = (e) => { setPeriod(e.target.value); };

    return (
        <section className="filters">
            <label>The top </label>
            <input type="number" placeholder="20" min="5" max="20" id="filterLimit" onChange={e => limitHandler(e)}/> 
            <label> from </label>
            <input type="text" id="filterUserName" placeholder="Your Username" onChange={e => userNameHandler(e)}/>
            <label> from the last </label>    
            <select name="filterPeriod" id="filterPeriod" onChange={e => periodHandler(e)}>
                {periods.map((d) => {
                    return (<option value={d}>{d}</option>)
                })}
            </select>
        </section>
    );
}

export default Filters;
