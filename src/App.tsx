import type { ChangeEvent } from 'react';

import { Button, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';

import { QueryClient, QueryClientProvider } from 'react-query';

import { Game } from '@/components/Game';
import { Route, Router, useRouter } from '@/components/Router';

import { putUser } from './axios/user';
import { MAX_HP, SAVE_USER_KEY } from './constance';

const queryClient = new QueryClient();

const GameStart: React.VFC = () => {
  const { setRouter } = useRouter();
  const [username, setUserName] = useState('');
  const saveUser = localStorage.getItem(SAVE_USER_KEY);

  const onInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setUserName(evt.target.value);
  };

  const onGameStart = () => {
    putUser({
      name: username,
      hp: MAX_HP,
      exp: 0,
      gold: 0,
    }).then(() => {
      setRouter('game');
    });
  };

  const onGameContinue = () => {
    if (saveUser) {
      putUser(JSON.parse(saveUser)).then(() => {
        setRouter('game');
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <Text className="text-gray-700 font-semibold text-3xl">
        LifeNoFukinEnding
      </Text>
      <Text>v0.0.1 - 摆烂了</Text>
      <div className="w-1/2">
        <Input
          placeholder="请输入你的名字开始游戏"
          value={username}
          onChange={onInputChange}
        />
      </div>
      <Button disabled={username === ''} onClick={onGameStart}>
        开始新游戏
      </Button>
      <Button colorScheme="blue" disabled={!saveUser} onClick={onGameContinue}>
        继续游戏
      </Button>
    </div>
  );
};

const App: React.VFC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="w-full h-screen overflow-hidden">
          <div className="w-full h-full max-w-xl mx-auto border">
            <Route name="start" children={<GameStart />} />
            <Route name="game" children={<Game />} />
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
