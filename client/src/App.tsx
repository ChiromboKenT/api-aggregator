import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { CustomEventDataType, CustomEventReadyStateChangeType, CustomEventType, SSE, SSEOptionsMethod } from 'sse-ts';
import { Heading, Text, Box, Flex, Button, Textarea } from '@chakra-ui/react';

import './App.css';

const baseURl = 'https://api.openai.com/v1';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [backgroundColors, setBackgroundColors] = useState([
    '#5264c5',
    '#ff0000',
  ]);

  const resultRef = useRef<string | undefined>();

   useEffect(() => {
    const newColors = [
      '#' + Math.floor(Math.random() * 16777215).toString(16),
      '#' + Math.floor(Math.random() * 16777215).toString(16),
    ];
    setBackgroundColors(newColors);

   }, []);

  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmitPromptBtnClicked = async () => {
    if (prompt.trim() !== '') {
      setIsLoading(true);
      setResult('');


      const headers = {
        'Content-Type': 'application/json',

      };

      const source = new SSE(baseURl, {
        headers,
        method: SSEOptionsMethod.GET,

      });

      source.addEventListener('message', (event: CustomEventType) => {
        const dataEvent = event as CustomEventDataType;
        if (dataEvent.data !== '[DONE]') {
          const payload = JSON.parse(dataEvent.data);
          const text = payload.choices[0].text;
          if (text !== '\n') {
            resultRef.current = (resultRef.current || '') + text;
            setResult(resultRef.current);
          }
        } else {
          source.close();
        }
      });

      source.addEventListener('readystatechange', (event : CustomEventType) => {
        const dataEvent = event as CustomEventReadyStateChangeType;
        if (dataEvent.readyState >= 2) {
          setIsLoading(false);
        }
      });

      source.stream();
    } else {
      alert('Please insert a url!');
    }
  };


  return (
    <Flex
      width="100vw"
      height="100vh"
      alignContent="center"
      justifyContent="center"
      transition="background 3s ease-in-out" bgGradient={`linear(to-l, ${backgroundColors[0]}, ${backgroundColors[1]})`}
    >
      <Box maxW="2xl" m="0 auto" p="20px">
        <Heading
          as="h1"
          textAlign="center"
          fontSize="5xl"
          mt="100px"
          bgGradient="linear(to-l,#5264c5, #ff0000)"
          bgClip="text"
        >
          API AGGREGATOR
        </Heading>
        <Heading as="h2" textAlign="center" fontSize="3xl" mt="20px">
          With Server Sent Events (SSE)
        </Heading>
        <Text fontSize="xl" textAlign="center" mt="30px">
          This is a NestJS web application leveraging various APIs, including
          NBA and Weather services, to aggregate and deliver real-time updates.
          Data is seamlessly combined and stored in a database, providing a
          comprehensive view of NBA game information enriched with weather
          details.
        </Text>
        <Textarea
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Insert your url here ..."
          mt="30px"
          size="lg"
        />
        <Button
          isLoading={isLoading}
          loadingText="Loading..."
          colorScheme="teal"
          size="lg"
          mt="30px"
          onClick={handleSubmitPromptBtnClicked}
        >
          Fetch Url
        </Button>
        {result !== '' && (
          <Box maxW="2xl" m="0 auto">
            <Heading as="h5" textAlign="left" fontSize="lg" mt="40px">
              Result:
            </Heading>
            <Text fontSize="lg" textAlign="left" mt="20px">
              {result}
            </Text>
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default App;
