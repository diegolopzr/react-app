import { useState, useEffect, useCallback} from 'react';
import {API_URL, API_KEY} from '../../config.js';

export const useMovieFetch = movieId => {
    const [state, setState] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState (false);

    const fetchData = useCallback(async () =>{
        setError(false);
        setLoading(true);
        try{
            const endpoint = `${API_URL}movie/${movieId}?api_key=${API_KEY}`
            const result = await (await fetch(endpoint)).json()
            //console.log(result);
            const creditsEndpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`
            const creditsReult  = await (await fetch(creditsEndpoint)).json();
            //console.log(creditsReult);
            const directors = creditsReult.crew.filter(
               member => member.job === 'Director' 
            );

            setState({
                ...result,
                actors: creditsReult.cast,
                directors: directors,
            })

        } catch (error){
            setError (true);
        }
        setLoading(false);
    },[movieId])

    useEffect(()=>{
        if(localStorage[movieId]){
            console.log("Grabbing from localStorage")
            setState(JSON.parse(localStorage[movieId]));
            setLoading(false);
        }else{
            console.log("Grabbing from API")
            fetchData();
        }
    }, [fetchData, movieId]);

    useEffect(()=> {
        localStorage.setItem(movieId, JSON.stringify(state));   
    }, [movieId, state])


    return [state, loading, error]
}