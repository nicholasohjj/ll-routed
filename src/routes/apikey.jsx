import React, { useState, useEffect, useContext } from "react";
import { getApiKeys } from "../services/dataService";
import { UserContext } from "../context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function APIKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [visibility, setVisibility] = useState({});
  const { user } = useContext(UserContext);

  useEffect(() => {
    const init = async () => {
      if (!user) return;
      try {
        const keyData = await getApiKeys(user.sub);
        // Parse keyData.body from string to array
        const keys = JSON.parse(keyData.body);
        setApiKeys(keys);
        
        // Initialize visibility state
        const initialVisibility = {};
        keys.forEach((key, index) => {
          initialVisibility[index] = false;
        });
        setVisibility(initialVisibility);
      } catch (error) {
        console.error("Error fetching API keys:", error);
      }
    };
    init();
  }, [user]);

  const copyToClipboard = (key) => {
    navigator.clipboard.writeText(key).then(() => {
      alert("API key copied to clipboard");
    });
  };

  const toggleVisibility = (index) => {
    setVisibility((prevState) => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  return (
    <div>
      <h2>API Keys</h2>
      
      <ul>
        {apiKeys.length > 0 ? apiKeys.map((key, index) => (
          <li key={index} className="mb-4">
            <div className="flex items-center">
              <span className="mr-2">
                {visibility[index] ? key : "*".repeat(key.length)}
              </span>
              <button
                className="mr-2 px-2 py-1 bg-blue-500 text-white rounded"
                onClick={() => copyToClipboard(key)}
              >
                <FontAwesomeIcon icon={faCopy} /> {/* Copy icon */}
              </button>
              <button
                className="px-2 py-1 bg-gray-500 text-white rounded"
                onClick={() => toggleVisibility(index)}
              >
                <FontAwesomeIcon icon={visibility[index] ? faEyeSlash : faEye} /> {/* Show/Hide icon */}
              </button>
            </div>
          </li>
        )) : <p>No API keys available</p>}
      </ul>
    </div>
  );
}
