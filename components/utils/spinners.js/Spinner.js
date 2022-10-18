import { useState, CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";

import PacmanLoader from "react-spinners/PacmanLoader";


function Spinner() {
    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#ffffff");

    return (
        <div>
            <ClipLoader color={color} loading={loading} size={150} />
            <PacmanLoader color={color} loading={loading} size={150} />
        </div>
    );
}

export default Spinner;