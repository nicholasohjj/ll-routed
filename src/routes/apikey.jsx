import React, { useState, useEffect, useContext } from "react";
import { getApiKeys } from "../services/dataService";
import { UserContext } from "../context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

// Styled components
const Container = styled.div`
  padding: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const KeyText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  color: white;
  background-color: #1E40AF; /* Default background color */
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.bgColorHover};
  }
`;
const CopiedMessage = styled.span`
  color: green;
  margin-left: 0.5rem;
`;

// Component definition
const APIKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [visibility, setVisibility] = useState({});
  const { user } = useContext(UserContext);
  const [copiedKeyIndex, setCopiedKeyIndex] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!user) return;
      try {
        const keyData = await getApiKeys(user.sub);
        const keys = JSON.parse(keyData.body);
        setApiKeys(keys);

        const initialVisibility = {};
        keys.forEach((key, index) => {
          initialVisibility[index] = false;
        });
        setVisibility(initialVisibility);
      } catch (error) {
        console.error("Error fetching API keys:", error);
        // Handle error state or message here
      }
    };
    init();
  }, [user]);

  const copyToClipboard = (key, index) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopiedKeyIndex(index);
      setTimeout(() => {
        setCopiedKeyIndex(null);
      }, 1500); // Clear copied state after 1.5 seconds
    });
  };

  const toggleVisibility = (index) => {
    setVisibility((prevState) => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  return (
    <Container>
      <Title>API Keys</Title>
      
      {apiKeys.length > 0 ? (
        <List>
          {apiKeys.map((key, index) => (
            <ListItem key={index}>
              <KeyText>
                {visibility[index] ? key : "*".repeat(key.length)}
              </KeyText>
              <div>
                <Button
                  bgColor="#1E40AF"
                  bgColorHover="#1D4ED8"
                  onClick={() => copyToClipboard(key, index)}
                >
                  <FontAwesomeIcon icon={faCopy} /> Copy
                </Button>
                <Button
                  bgColor="#4B5563"
                  bgColorHover="#1F2937"
                  onClick={() => toggleVisibility(index)}
                >
                  <FontAwesomeIcon icon={visibility[index] ? faEyeSlash : faEye} /> {visibility[index] ? "Hide" : "Show"}
                </Button>
                {copiedKeyIndex === index && (
                  <CopiedMessage>Copied!</CopiedMessage>
                )}
              </div>
            </ListItem>
          ))}
        </List>
      ) : (
        <p>No API keys available</p>
      )}
    </Container>
  );
};

export default APIKeys;
