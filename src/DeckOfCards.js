import { useEffect, useRef, useState } from "react"
import axios from "axios";
import Card from './Card';
import "./Deck.css";

function DeckOfCards() {

    const [deck, setDeck] = useState(null);
    const [cardDrawn, setCardDrawn] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    const timer = useRef();


    const DECK_API = "http://deckofcardsapi.com/api/deck";

    useEffect(function () {
        async function getNewDeck() {
            console.log("First useEffect ");
            const res = await axios.get(`${DECK_API}/new/shuffle/?deck_count=1`);
            setDeck(res.data);
        }
        getNewDeck();
    }, [setDeck])

    async function getACardFromDeck() {
        console.log("Second useEffect ")
        try {
            const deck_id = deck.deck_id;
            const cardRes = await axios.get(`${DECK_API}/${deck_id}/draw`);

            if (cardRes.data.remaining === 0) {
                setAutoDraw(false);
                alert('No Card left');
                throw new Error("No card left");
            }
            const card = cardRes.data.cards[0];

            setCardDrawn(d => [
                ...d, {
                    id: card.code,
                    name: card.suit + " " + card.value,
                    image: card.image
                }
            ])
        } catch (error) {
            console.error(error);
            window.location.reload();
        }

    }
    useEffect(() => {

        if (autoDraw && !timer.current) {
            setInterval(async () => {
                await getACardFromDeck();
            }, 1000);
        }

        return () => clearInterval(timer.current)
    }, [autoDraw])

    const handleClick = () => {
        setAutoDraw(auto => !auto)
        getACardFromDeck();
    }
    const cards = cardDrawn.map(c => (
        <Card key={c.id} name={c.name} image={c.image} />
    ));
    return (
        <div className="Deck">
            <button className="Deck-btn" onClick={handleClick} >
                {autoDraw ? <button>Stop</button> : <button>Give me a Card!!</button>}
            </button>
            <div className="cardArea"> {cards}</div>
        </div>
    )
}



export default DeckOfCards;